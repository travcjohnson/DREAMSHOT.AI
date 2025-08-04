import { prisma } from '@/lib/database/prisma';
import { evaluateDream, calculateImpossibilityDecay } from './evaluation';
import { AiProvider, TestStatus } from '@prisma/client';

export interface JobConfig {
  retestIntervalDays: number;
  maxCostPerDay: number;
  priorityThresholds: {
    high: number; // Dreams with impossibility > this get priority
    medium: number;
  };
  modelLimits: {
    [key: string]: {
      maxRequestsPerDay: number;
      costPerRequest: number;
    };
  };
}

export const DEFAULT_JOB_CONFIG: JobConfig = {
  retestIntervalDays: 30, // Retest every 30 days
  maxCostPerDay: 10.00, // $10 daily budget
  priorityThresholds: {
    high: 75, // Very difficult dreams get priority
    medium: 50
  },
  modelLimits: {
    'gpt-4o': {
      maxRequestsPerDay: 20,
      costPerRequest: 0.15
    },
    'gpt-4o-mini': {
      maxRequestsPerDay: 100,
      costPerRequest: 0.03
    },
    'claude-3-5-sonnet-20241022': {
      maxRequestsPerDay: 25,
      costPerRequest: 0.12
    },
    'claude-3-5-haiku-20241022': {
      maxRequestsPerDay: 80,
      costPerRequest: 0.04
    }
  }
};

/**
 * Background job scheduler for automated dream re-testing
 */
export class DreamEvaluationScheduler {
  private config: JobConfig;
  private isRunning: boolean = false;

  constructor(config: JobConfig = DEFAULT_JOB_CONFIG) {
    this.config = config;
  }

  /**
   * Main job runner - should be called via cron or queue system
   */
  async runDailyEvaluations(): Promise<{
    processed: number;
    skipped: number;
    failed: number;
    totalCost: number;
  }> {
    if (this.isRunning) {
      console.warn('Evaluation job already running, skipping...');
      return { processed: 0, skipped: 0, failed: 0, totalCost: 0 };
    }

    this.isRunning = true;
    console.log('Starting daily dream evaluations...');

    try {
      // Check daily usage and costs
      const dailyUsage = await this.getDailyUsage();
      if (dailyUsage.cost >= this.config.maxCostPerDay) {
        console.log(`Daily cost limit reached: $${dailyUsage.cost}`);
        return { processed: 0, skipped: 0, failed: 0, totalCost: dailyUsage.cost };
      }

      // Get dreams that need re-testing
      const dreamsToTest = await this.getEligibleDreams();
      console.log(`Found ${dreamsToTest.length} dreams eligible for testing`);

      let processed = 0;
      let skipped = 0;
      let failed = 0;
      let totalCost = dailyUsage.cost;

      // Process dreams in priority order
      for (const dream of dreamsToTest) {
        if (totalCost >= this.config.maxCostPerDay) {
          console.log('Daily cost limit reached, stopping evaluations');
          break;
        }

        try {
          console.log(`Processing dream: ${dream.id} - ${dream.title}`);
          
          // Estimate cost for this evaluation
          const estimatedCost = this.estimateEvaluationCost();
          if (totalCost + estimatedCost > this.config.maxCostPerDay) {
            console.log(`Skipping dream ${dream.id} - would exceed daily budget`);
            skipped++;
            continue;
          }

          // Run evaluation with cost-optimized model selection
          const result = await this.runCostOptimizedEvaluation(dream);
          
          if (result.success) {
            processed++;
            totalCost += result.cost;
            console.log(`Successfully evaluated dream ${dream.id} (cost: $${result.cost})`);
          } else {
            failed++;
            console.error(`Failed to evaluate dream ${dream.id}:`, result.error);
          }

          // Small delay to prevent API rate limiting
          await this.delay(1000);

        } catch (error) {
          console.error(`Error processing dream ${dream.id}:`, error);
          failed++;
        }
      }

      console.log(`Daily evaluation complete: ${processed} processed, ${skipped} skipped, ${failed} failed, $${totalCost.toFixed(2)} total cost`);
      
      // Log daily summary
      await this.logDailySummary(processed, skipped, failed, totalCost);

      return { processed, skipped, failed, totalCost };

    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Get dreams eligible for re-testing based on various criteria
   */
  private async getEligibleDreams(): Promise<Array<{
    id: string;
    title: string;
    userId: string;
    description: string;
    originalPrompt: string;
    category: string;
    lastTest?: {
      createdAt: Date;
      impossibilityScore: number;
      confidence: number;
    };
    priority: 'high' | 'medium' | 'low';
  }>> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retestIntervalDays);

    // Get active dreams with their latest test results
    const dreams = await prisma.dream.findMany({
      where: {
        status: 'ACTIVE',
        // Only include dreams that haven't been tested recently OR have never been tested
        OR: [
          {
            aiTests: {
              none: {}
            }
          },
          {
            aiTests: {
              none: {
                createdAt: {
                  gte: cutoffDate
                },
                status: 'COMPLETED'
              }
            }
          }
        ]
      },
      include: {
        aiTests: {
          where: {
            status: 'COMPLETED'
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      take: 200 // Limit to prevent overwhelming the system
    });

    // Transform and prioritize
    const eligibleDreams = dreams.map(dream => {
      const lastTest = dream.aiTests[0];
      let priority: 'high' | 'medium' | 'low' = 'low';

      if (lastTest) {
        const impossibilityScore = lastTest.impossibilityScore.toNumber();
        if (impossibilityScore >= this.config.priorityThresholds.high) {
          priority = 'high';
        } else if (impossibilityScore >= this.config.priorityThresholds.medium) {
          priority = 'medium';
        }
      } else {
        // New dreams get medium priority
        priority = 'medium';
      }

      return {
        id: dream.id,
        title: dream.title,
        userId: dream.userId,
        description: dream.description,
        originalPrompt: dream.originalPrompt,
        category: dream.category,
        lastTest: lastTest ? {
          createdAt: lastTest.createdAt,
          impossibilityScore: lastTest.impossibilityScore.toNumber(),
          confidence: lastTest.confidence.toNumber()
        } : undefined,
        priority
      };
    });

    // Sort by priority (high -> medium -> low) and then by staleness
    return eligibleDreams.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }

      // Within same priority, older tests first
      const aDate = a.lastTest?.createdAt?.getTime() || 0;
      const bDate = b.lastTest?.createdAt?.getTime() || 0;
      return aDate - bDate;
    });
  }

  /**
   * Run cost-optimized evaluation for a single dream
   */
  private async runCostOptimizedEvaluation(dream: {
    id: string;
    title: string;
    userId: string;
    description: string;
    originalPrompt: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
  }): Promise<{
    success: boolean;
    cost: number;
    error?: string;
  }> {
    try {
      // Select models based on priority and remaining budget
      const models = this.selectOptimalModels(dream.priority);
      
      const evaluations = await evaluateDream({
        dreamId: dream.id,
        userId: dream.userId,
        dreamTitle: dream.title,
        dreamDescription: dream.description,
        originalPrompt: dream.originalPrompt,
        category: dream.category,
        providers: models.map(m => m.provider),
        enableMultiModel: models.length > 1
      });

      if (evaluations.length === 0) {
        return { success: false, cost: 0, error: 'No evaluations completed' };
      }

      // Calculate actual cost
      const totalCost = evaluations.reduce((sum, evaluation) => {
        const tokensUsed = evaluation.metadata.tokensUsed || 1000;
        const modelConfig = this.config.modelLimits[evaluation.metadata.model];
        return sum + (modelConfig?.costPerRequest || 0.05);
      }, 0);

      return { success: true, cost: totalCost };

    } catch (error) {
      return { 
        success: false, 
        cost: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Select optimal models based on priority and budget constraints
   */
  private selectOptimalModels(priority: 'high' | 'medium' | 'low'): Array<{
    provider: 'openai' | 'anthropic';
    model: string;
  }> {
    switch (priority) {
      case 'high':
        // Use best models for high-priority dreams
        return [
          { provider: 'openai', model: 'gpt-4o' },
          { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' }
        ];
      
      case 'medium':
        // Use one premium model
        return [
          { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' }
        ];
      
      case 'low':
        // Use cost-effective models
        return [
          { provider: 'openai', model: 'gpt-4o-mini' }
        ];
    }
  }

  /**
   * Estimate cost for an evaluation
   */
  private estimateEvaluationCost(): number {
    // Conservative estimate based on average usage
    return 0.08; // $0.08 per evaluation on average
  }

  /**
   * Get today's usage statistics
   */
  private async getDailyUsage(): Promise<{
    cost: number;
    requests: number;
    tokensUsed: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tests = await prisma.aiTest.findMany({
      where: {
        createdAt: {
          gte: today
        },
        status: 'COMPLETED'
      }
    });

    const cost = tests.reduce((sum, test) => sum + (test.cost?.toNumber() || 0), 0);
    const requests = tests.length;
    const tokensUsed = tests.reduce((sum, test) => sum + (test.tokensUsed || 0), 0);

    return { cost, requests, tokensUsed };
  }

  /**
   * Log daily summary for monitoring
   */
  private async logDailySummary(
    processed: number,
    skipped: number,
    failed: number,
    totalCost: number
  ): Promise<void> {
    try {
      // This could be stored in a dedicated monitoring table
      console.log({
        type: 'daily_evaluation_summary',
        date: new Date().toISOString().split('T')[0],
        processed,
        skipped,
        failed,
        totalCost,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log daily summary:', error);
    }
  }

  /**
   * Utility delay function
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Cost tracking utilities
 */
export class CostTracker {
  /**
   * Get cost summary for a date range
   */
  static async getCostSummary(
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<{
    totalCost: number;
    totalTokens: number;
    totalRequests: number;
    breakdown: {
      [provider: string]: {
        cost: number;
        tokens: number;
        requests: number;
        models: { [model: string]: number };
      };
    };
  }> {
    const where: any = {
      createdAt: {
        gte: startDate,
        lte: endDate
      },
      status: 'COMPLETED'
    };

    if (userId) {
      where.userId = userId;
    }

    const tests = await prisma.aiTest.findMany({
      where,
      select: {
        provider: true,
        model: true,
        cost: true,
        tokensUsed: true
      }
    });

    const breakdown: any = {};
    let totalCost = 0;
    let totalTokens = 0;
    let totalRequests = tests.length;

    for (const test of tests) {
      const provider = test.provider;
      const model = test.model;
      const cost = test.cost?.toNumber() || 0;
      const tokens = test.tokensUsed || 0;

      if (!breakdown[provider]) {
        breakdown[provider] = {
          cost: 0,
          tokens: 0,
          requests: 0,
          models: {}
        };
      }

      breakdown[provider].cost += cost;
      breakdown[provider].tokens += tokens;
      breakdown[provider].requests += 1;
      breakdown[provider].models[model] = (breakdown[provider].models[model] || 0) + 1;

      totalCost += cost;
      totalTokens += tokens;
    }

    return {
      totalCost,
      totalTokens,
      totalRequests,
      breakdown
    };
  }

  /**
   * Check if user is within their rate limits
   */
  static async checkRateLimit(
    userId: string,
    dailyLimit: number = 10
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: Date;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCount = await prisma.aiTest.count({
      where: {
        userId,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    return {
      allowed: todayCount < dailyLimit,
      remaining: Math.max(0, dailyLimit - todayCount),
      resetTime: tomorrow
    };
  }
}

/**
 * Export instance for use in API routes
 */
export const dreamScheduler = new DreamEvaluationScheduler();

/**
 * Utility function to run scheduled jobs (for cron integration)
 */
export async function runScheduledEvaluations() {
  try {
    const result = await dreamScheduler.runDailyEvaluations();
    console.log('Scheduled evaluations completed:', result);
    return result;
  } catch (error) {
    console.error('Scheduled evaluations failed:', error);
    throw error;
  }
}