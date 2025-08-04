import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/config';
import { runScheduledEvaluations } from '@/lib/ai/background-jobs';
import { prisma } from '@/lib/database/prisma';

/**
 * POST /api/admin/run-evaluations
 * Manually trigger the background evaluation job (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication and admin role
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // For now, let's allow any authenticated user to run this
    // In production, you'd want to check for admin role
    // if (session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Admin access required' },
    //     { status: 403 }
    //   );
    // }

    console.log(`Manual evaluation job triggered by user: ${session.user.id}`);
    
    // Run the scheduled evaluations
    const result = await runScheduledEvaluations();
    
    return NextResponse.json({
      success: true,
      message: 'Evaluation job completed',
      result: {
        processed: result.processed,
        skipped: result.skipped,
        failed: result.failed,
        totalCost: result.totalCost
      },
      triggeredBy: session.user.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Manual evaluation job error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to run evaluation job',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/run-evaluations
 * Get status of background jobs
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get recent job activity (you might want to store this in a dedicated table)
    const recentTests = await prisma?.aiTest.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        provider: true,
        model: true,
        cost: true,
        tokensUsed: true,
        duration: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });

    const stats = {
      last24Hours: {
        total: recentTests?.length || 0,
        completed: recentTests?.filter(t => t.status === 'COMPLETED').length || 0,
        failed: recentTests?.filter(t => t.status === 'FAILED').length || 0,
        totalCost: recentTests?.reduce((sum, t) => sum + (t.cost?.toNumber() || 0), 0) || 0,
        totalTokens: recentTests?.reduce((sum, t) => sum + (t.tokensUsed || 0), 0) || 0
      },
      recentActivity: recentTests?.slice(0, 10).map(test => ({
        id: test.id,
        timestamp: test.createdAt,
        status: test.status,
        provider: test.provider,
        model: test.model,
        cost: test.cost,
        duration: test.duration
      })) || []
    };

    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching job status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job status' },
      { status: 500 }
    );
  }
}