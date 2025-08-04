import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/database/prisma';
import { 
  evaluateDream, 
  generateConsensusEvaluation, 
  calculateImpossibilityDecay,
  type EvaluationRequest 
} from '@/lib/ai/evaluation';
import { AiProvider } from '@prisma/client';

interface TestRequestBody {
  providers?: ('openai' | 'anthropic')[];
  enableMultiModel?: boolean;
  generateConsensus?: boolean;
  retest?: boolean;
}

/**
 * POST /api/dreams/[id]/test
 * Runs AI evaluation on a specific dream
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const dreamId = params.id;
    const body = await request.json() as TestRequestBody;
    const {
      providers = ['openai', 'anthropic'],
      enableMultiModel = true,
      generateConsensus = true,
      retest = false
    } = body;

    // Fetch the dream
    const dream = await prisma.dream.findFirst({
      where: {
        id: dreamId,
        OR: [
          { userId: session.user.id }, // User's own dream
          { isPublic: true } // Public dream
        ]
      },
      include: {
        user: {
          select: { id: true, name: true }
        },
        _count: {
          select: { aiTests: true }
        }
      }
    });

    if (!dream) {
      return NextResponse.json(
        { error: 'Dream not found or access denied' },
        { status: 404 }
      );
    }

    // Check if recent evaluation exists (unless retest is requested)
    if (!retest) {
      const recentTest = await prisma.aiTest.findFirst({
        where: {
          dreamId,
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Within last 24 hours
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      if (recentTest) {
        return NextResponse.json({
          message: 'Recent evaluation found',
          useExisting: true,
          lastEvaluation: {
            id: recentTest.id,
            impossibilityScore: recentTest.impossibilityScore,
            confidence: recentTest.confidence,
            createdAt: recentTest.createdAt
          }
        });
      }
    }

    // Prepare evaluation request
    const evaluationRequest: EvaluationRequest = {
      dreamId: dream.id,
      userId: session.user.id,
      dreamTitle: dream.title,
      dreamDescription: dream.description,
      originalPrompt: dream.originalPrompt,
      category: dream.category,
      providers,
      enableMultiModel
    };

    // Run evaluations
    const evaluations = await evaluateDream(evaluationRequest);

    if (evaluations.length === 0) {
      return NextResponse.json(
        { error: 'All evaluations failed. Please try again.' },
        { status: 500 }
      );
    }

    // Generate consensus if requested and multiple evaluations
    let consensusResult = null;
    if (generateConsensus && evaluations.length > 1) {
      try {
        consensusResult = await generateConsensusEvaluation(evaluations);
        
        // Store consensus result
        await prisma.aiTest.create({
          data: {
            dreamId: dream.id,
            userId: session.user.id,
            provider: 'OPENAI', // Use OPENAI as default for consensus
            model: 'consensus',
            testPrompt: 'Consensus evaluation from multiple models',
            response: JSON.stringify(consensusResult),
            impossibilityScore: consensusResult.impossibilityScore,
            confidence: consensusResult.confidence,
            reasoning: consensusResult.reasoning,
            status: 'COMPLETED',
            tokensUsed: consensusResult.metadata.tokensUsed,
            duration: consensusResult.metadata.duration,
            testParameters: consensusResult.metadata.testParameters,
            metadata: {
              evaluationScores: {
                comprehension: consensusResult.comprehensionScore,
                quality: consensusResult.qualityScore,
                innovation: consensusResult.innovationScore,
                feasibility: consensusResult.feasibilityScore,
                overall: consensusResult.overallScore
              },
              evaluationType: 'consensus',
              modelCount: evaluations.length
            }
          }
        });
      } catch (error) {
        console.error('Failed to generate consensus:', error);
      }
    }

    // Calculate impossibility decay
    let decayAnalysis = null;
    try {
      decayAnalysis = await calculateImpossibilityDecay(dreamId);
    } catch (error) {
      console.warn('Could not calculate decay analysis:', error);
    }

    // Update progress log
    await updateProgressLog(dreamId, session.user.id, evaluations, consensusResult);

    return NextResponse.json({
      success: true,
      dreamId: dream.id,
      dreamTitle: dream.title,
      evaluations: evaluations.map(evaluation => ({
        provider: evaluation.metadata.provider,
        model: evaluation.metadata.model,
        scores: {
          comprehension: evaluation.comprehensionScore,
          quality: evaluation.qualityScore,
          innovation: evaluation.innovationScore,
          feasibility: evaluation.feasibilityScore,
          overall: evaluation.overallScore,
          impossibility: evaluation.impossibilityScore
        },
        confidence: evaluation.confidence,
        reasoning: evaluation.reasoning,
        metadata: {
          duration: evaluation.metadata.duration,
          tokensUsed: evaluation.metadata.tokensUsed
        }
      })),
      consensus: consensusResult ? {
        scores: {
          comprehension: consensusResult.comprehensionScore,
          quality: consensusResult.qualityScore,
          innovation: consensusResult.innovationScore,
          feasibility: consensusResult.feasibilityScore,
          overall: consensusResult.overallScore,
          impossibility: consensusResult.impossibilityScore
        },
        confidence: consensusResult.confidence,
        reasoning: consensusResult.reasoning
      } : null,
      decay: decayAnalysis,
      totalTests: dream._count.aiTests + evaluations.length
    });

  } catch (error) {
    console.error('Dream evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate dream' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/dreams/[id]/test
 * Retrieves evaluation history for a dream
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    const dreamId = params.id;
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const provider = searchParams.get('provider');
    const includeAnalysis = searchParams.get('analysis') === 'true';

    // Check dream access
    const dream = await prisma.dream.findFirst({
      where: {
        id: dreamId,
        OR: session?.user?.id ? [
          { userId: session.user.id },
          { isPublic: true }
        ] : [
          { isPublic: true }
        ]
      }
    });

    if (!dream) {
      return NextResponse.json(
        { error: 'Dream not found or access denied' },
        { status: 404 }
      );
    }

    // Build query filters
    const where: any = {
      dreamId,
      status: 'COMPLETED'
    };

    if (provider && Object.values(AiProvider).includes(provider.toUpperCase() as AiProvider)) {
      where.provider = provider.toUpperCase();
    }

    // Fetch evaluations
    const evaluations = await prisma.aiTest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { id: true, name: true }
        }
      }
    });

    // Calculate analysis if requested
    let analysis = null;
    if (includeAnalysis && evaluations.length > 0) {
      try {
        // Get decay analysis
        const decayAnalysis = await calculateImpossibilityDecay(dreamId);
        
        // Calculate score trends
        const scoreTrend = evaluations.map(evaluation => ({
          date: evaluation.createdAt,
          impossibilityScore: evaluation.impossibilityScore.toNumber(),
          confidence: evaluation.confidence.toNumber(),
          provider: evaluation.provider,
          model: evaluation.model
        }));

        // Calculate average scores by provider
        const providerStats = evaluations.reduce((acc, evaluation) => {
          if (!acc[evaluation.provider]) {
            acc[evaluation.provider] = {
              count: 0,
              avgImpossibility: 0,
              avgConfidence: 0,
              models: new Set()
            };
          }
          
          const stats = acc[evaluation.provider];
          const prevCount = stats.count;
          stats.count++;
          stats.avgImpossibility = (stats.avgImpossibility * prevCount + evaluation.impossibilityScore.toNumber()) / stats.count;
          stats.avgConfidence = (stats.avgConfidence * prevCount + evaluation.confidence.toNumber()) / stats.count;
          stats.models.add(evaluation.model);
          
          return acc;
        }, {} as any);

        // Convert Set to Array for JSON serialization
        Object.keys(providerStats).forEach(provider => {
          providerStats[provider].models = Array.from(providerStats[provider].models);
        });

        analysis = {
          decay: decayAnalysis,
          scoreTrend,
          providerStats,
          summary: {
            totalEvaluations: evaluations.length,
            averageImpossibility: evaluations.reduce((sum, evaluation) => sum + evaluation.impossibilityScore.toNumber(), 0) / evaluations.length,
            averageConfidence: evaluations.reduce((sum, evaluation) => sum + evaluation.confidence.toNumber(), 0) / evaluations.length,
            latestScore: evaluations[0]?.impossibilityScore.toNumber(),
            oldestScore: evaluations[evaluations.length - 1]?.impossibilityScore.toNumber()
          }
        };
      } catch (error) {
        console.warn('Failed to generate analysis:', error);
      }
    }

    return NextResponse.json({
      dreamId,
      dreamTitle: dream.title,
      evaluations: evaluations.map(evaluation => ({
        id: evaluation.id,
        provider: evaluation.provider,
        model: evaluation.model,
        impossibilityScore: evaluation.impossibilityScore,
        confidence: evaluation.confidence,
        reasoning: evaluation.reasoning,
        metadata: evaluation.metadata,
        duration: evaluation.duration,
        tokensUsed: evaluation.tokensUsed,
        createdAt: evaluation.createdAt,
        evaluatedBy: evaluation.user.name || 'Anonymous'
      })),
      analysis,
      pagination: {
        limit,
        total: evaluations.length
      }
    });

  } catch (error) {
    console.error('Error fetching evaluation history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evaluation history' },
      { status: 500 }
    );
  }
}

/**
 * Update progress log with new evaluation data
 */
async function updateProgressLog(
  dreamId: string,
  userId: string,
  evaluations: any[],
  consensusResult: any
) {
  try {
    // Get all completed tests for this dream
    const allTests = await prisma.aiTest.findMany({
      where: {
        dreamId,
        status: 'COMPLETED'
      },
      orderBy: { createdAt: 'desc' }
    });

    if (allTests.length === 0) return;

    // Calculate statistics
    const scores = allTests.map(test => test.impossibilityScore.toNumber());
    const averageImpossibility = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const bestScore = Math.min(...scores);
    const testCount = allTests.length;
    const activeModels = [...new Set(allTests.map(test => `${test.provider}/${test.model}`))];

    // Calculate improvement trend (compared to previous log)
    const previousLog = await prisma.progressLog.findFirst({
      where: { dreamId },
      orderBy: { createdAt: 'desc' }
    });

    let improvementTrend = null;
    if (previousLog) {
      const previousAvg = previousLog.averageImpossibility.toNumber();
      improvementTrend = ((previousAvg - averageImpossibility) / previousAvg) * 100;
    }

    // Determine milestone
    let milestoneReached = null;
    if (bestScore <= 10) milestoneReached = 'highly_achievable';
    else if (bestScore <= 25) milestoneReached = 'achievable';
    else if (bestScore <= 50) milestoneReached = 'challenging';
    else if (bestScore <= 75) milestoneReached = 'difficult';

    // Create progress log entry
    await prisma.progressLog.create({
      data: {
        dreamId,
        userId,
        averageImpossibility,
        bestScore,
        testCount,
        activeModels,
        improvementTrend,
        milestoneReached,
        snapshotData: {
          evaluations: evaluations.length,
          consensus: consensusResult ? true : false,
          timestamp: new Date().toISOString(),
          scoreDistribution: {
            'very_achievable': scores.filter(s => s <= 10).length,
            'achievable': scores.filter(s => s > 10 && s <= 25).length,
            'challenging': scores.filter(s => s > 25 && s <= 50).length,
            'difficult': scores.filter(s => s > 50 && s <= 75).length,
            'very_difficult': scores.filter(s => s > 75).length
          }
        }
      }
    });

  } catch (error) {
    console.error('Failed to update progress log:', error);
  }
}