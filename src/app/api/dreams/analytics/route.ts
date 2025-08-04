import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/database/prisma';
import { CostTracker } from '@/lib/ai/background-jobs';

/**
 * GET /api/dreams/analytics
 * Provides analytics and insights about dream evaluations
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const dateRange = searchParams.get('range') || '30'; // days
    const includeGlobal = searchParams.get('global') === 'true';
    const metric = searchParams.get('metric') || 'all';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(dateRange));

    // Get user's dreams and evaluations
    const userDreams = await prisma.dream.findMany({
      where: {
        userId,
        status: 'ACTIVE'
      },
      include: {
        aiTests: {
          where: {
            status: 'COMPLETED',
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        progressLogs: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    });

    // Calculate user metrics
    const userMetrics = await calculateUserMetrics(userId, startDate, endDate);
    
    // Get cost summary
    const costSummary = await CostTracker.getCostSummary(startDate, endDate, userId);

    // Calculate impossibility decay trends
    const decayTrends = await calculateDecayTrends(userDreams);

    // Get global benchmarks if requested
    let globalBenchmarks = null;
    if (includeGlobal) {
      globalBenchmarks = await calculateGlobalBenchmarks(startDate, endDate);
    }

    // Prepare response based on requested metric
    const response: any = {
      dateRange: {
        start: startDate,
        end: endDate,
        days: parseInt(dateRange)
      },
      userId
    };

    if (metric === 'all' || metric === 'overview') {
      response.overview = {
        totalDreams: userDreams.length,
        totalEvaluations: userMetrics.totalEvaluations,
        averageImpossibility: userMetrics.averageImpossibility,
        improvedDreams: userMetrics.improvedDreams,
        completedMilestones: userMetrics.completedMilestones
      };
    }

    if (metric === 'all' || metric === 'trends') {
      response.trends = {
        impossibilityDecay: decayTrends,
        evaluationFrequency: userMetrics.evaluationsByDay,
        modelPerformance: userMetrics.modelPerformance
      };
    }

    if (metric === 'all' || metric === 'costs') {
      response.costs = costSummary;
    }

    if (metric === 'all' || metric === 'dreams') {
      response.dreams = userDreams.map(dream => ({
        id: dream.id,
        title: dream.title,
        category: dream.category,
        totalEvaluations: dream.aiTests.length,
        latestScore: dream.aiTests[0]?.impossibilityScore || null,
        firstScore: dream.aiTests[dream.aiTests.length - 1]?.impossibilityScore || null,
        improvement: dream.aiTests.length > 1 ? 
          (dream.aiTests[dream.aiTests.length - 1]?.impossibilityScore?.toNumber() || 0) - 
          (dream.aiTests[0]?.impossibilityScore?.toNumber() || 0) : null,
        lastTested: dream.aiTests[0]?.createdAt || null,
        progressLogs: dream.progressLogs.length
      }));
    }

    if (globalBenchmarks) {
      response.benchmarks = globalBenchmarks;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

/**
 * Calculate comprehensive user metrics
 */
async function calculateUserMetrics(userId: string, startDate: Date, endDate: Date) {
  // Get all user evaluations in date range
  const evaluations = await prisma.aiTest.findMany({
    where: {
      userId,
      status: 'COMPLETED',
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      dream: {
        select: {
          id: true,
          title: true,
          category: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Calculate basic metrics
  const totalEvaluations = evaluations.length;
  const averageImpossibility = evaluations.length > 0 
    ? evaluations.reduce((sum, evaluation) => sum + evaluation.impossibilityScore.toNumber(), 0) / evaluations.length
    : 0;

  // Count improved dreams (comparing first vs latest evaluation per dream)
  const dreamScores = evaluations.reduce((acc, evaluation) => {
    const dreamId = evaluation.dream.id;
    if (!acc[dreamId]) {
      acc[dreamId] = [];
    }
    acc[dreamId].push({
      score: evaluation.impossibilityScore.toNumber(),
      date: evaluation.createdAt
    });
    return acc;
  }, {} as { [dreamId: string]: Array<{ score: number; date: Date }> });

  let improvedDreams = 0;
  Object.values(dreamScores).forEach(scores => {
    if (scores.length > 1) {
      scores.sort((a, b) => a.date.getTime() - b.date.getTime());
      const improvement = scores[0].score - scores[scores.length - 1].score;
      if (improvement > 0) improvedDreams++;
    }
  });

  // Count completed milestones
  const milestones = await prisma.progressLog.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate,
        lte: endDate
      },
      milestoneReached: {
        not: null
      }
    }
  });

  // Evaluations by day
  const evaluationsByDay = evaluations.reduce((acc, evaluation) => {
    const day = evaluation.createdAt.toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as { [day: string]: number });

  // Model performance comparison
  const modelPerformance = evaluations.reduce((acc, evaluation) => {
    const model = `${evaluation.provider}/${evaluation.model}`;
    if (!acc[model]) {
      acc[model] = {
        count: 0,
        totalScore: 0,
        averageScore: 0,
        averageConfidence: 0,
        totalConfidence: 0
      };
    }
    
    acc[model].count++;
    acc[model].totalScore += evaluation.impossibilityScore.toNumber();
    acc[model].totalConfidence += evaluation.confidence.toNumber();
    acc[model].averageScore = acc[model].totalScore / acc[model].count;
    acc[model].averageConfidence = acc[model].totalConfidence / acc[model].count;
    
    return acc;
  }, {} as any);

  return {
    totalEvaluations,
    averageImpossibility,
    improvedDreams,
    completedMilestones: milestones.length,
    evaluationsByDay,
    modelPerformance
  };
}

/**
 * Calculate impossibility decay trends for user's dreams
 */
async function calculateDecayTrends(dreams: any[]) {
  const trends = [];

  for (const dream of dreams) {
    if (dream.aiTests.length < 2) continue;

    const scores = dream.aiTests
      .map((test: any) => ({
        score: test.impossibilityScore.toNumber(),
        date: test.createdAt,
        confidence: test.confidence.toNumber()
      }))
      .sort((a: any, b: any) => a.date.getTime() - b.date.getTime());

    // Calculate linear regression for trend
    const n = scores.length;
    const sumX = scores.reduce((sum, _, index) => sum + index, 0);
    const sumY = scores.reduce((sum, point) => sum + point.score, 0);
    const sumXY = scores.reduce((sum, point, index) => sum + index * point.score, 0);
    const sumXX = scores.reduce((sum, _, index) => sum + index * index, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    trends.push({
      dreamId: dream.id,
      dreamTitle: dream.title,
      category: dream.category,
      initialScore: scores[0].score,
      currentScore: scores[scores.length - 1].score,
      totalImprovement: scores[0].score - scores[scores.length - 1].score,
      trendSlope: slope,
      confidence: scores.reduce((sum, point) => sum + point.confidence, 0) / scores.length,
      evaluationCount: scores.length,
      timespan: {
        start: scores[0].date,
        end: scores[scores.length - 1].date,
        days: Math.ceil((scores[scores.length - 1].date.getTime() - scores[0].date.getTime()) / (1000 * 60 * 60 * 24))
      }
    });
  }

  return trends.sort((a, b) => b.totalImprovement - a.totalImprovement);
}

/**
 * Calculate global benchmarks (anonymized)
 */
async function calculateGlobalBenchmarks(startDate: Date, endDate: Date) {
  // Get aggregated global statistics
  const globalTests = await prisma.aiTest.findMany({
    where: {
      status: 'COMPLETED',
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      impossibilityScore: true,
      confidence: true,
      provider: true,
      model: true,
      dream: {
        select: {
          category: true
        }
      }
    }
  });

  if (globalTests.length === 0) {
    return null;
  }

  // Overall statistics
  const overallStats = {
    totalEvaluations: globalTests.length,
    averageImpossibility: globalTests.reduce((sum, test) => sum + test.impossibilityScore.toNumber(), 0) / globalTests.length,
    averageConfidence: globalTests.reduce((sum, test) => sum + test.confidence.toNumber(), 0) / globalTests.length
  };

  // Statistics by category
  const categoryStats = globalTests.reduce((acc, test) => {
    const category = test.dream.category;
    if (!acc[category]) {
      acc[category] = {
        count: 0,
        totalImpossibility: 0,
        totalConfidence: 0
      };
    }
    
    acc[category].count++;
    acc[category].totalImpossibility += test.impossibilityScore.toNumber();
    acc[category].totalConfidence += test.confidence.toNumber();
    
    return acc;
  }, {} as any);

  // Convert to averages
  Object.keys(categoryStats).forEach(category => {
    const stats = categoryStats[category];
    stats.averageImpossibility = stats.totalImpossibility / stats.count;
    stats.averageConfidence = stats.totalConfidence / stats.count;
    delete stats.totalImpossibility;
    delete stats.totalConfidence;
  });

  // Model performance (global)
  const modelStats = globalTests.reduce((acc, test) => {
    const model = `${test.provider}/${test.model}`;
    if (!acc[model]) {
      acc[model] = {
        count: 0,
        totalImpossibility: 0,
        totalConfidence: 0
      };
    }
    
    acc[model].count++;
    acc[model].totalImpossibility += test.impossibilityScore.toNumber();
    acc[model].totalConfidence += test.confidence.toNumber();
    
    return acc;
  }, {} as any);

  // Convert to averages
  Object.keys(modelStats).forEach(model => {
    const stats = modelStats[model];
    stats.averageImpossibility = stats.totalImpossibility / stats.count;
    stats.averageConfidence = stats.totalConfidence / stats.count;
    delete stats.totalImpossibility;
    delete stats.totalConfidence;
  });

  return {
    overall: overallStats,
    byCategory: categoryStats,
    byModel: modelStats
  };
}