import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { logger } from '@/lib/logger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all pending submissions
export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin role
    const userRole = (session.user as any).role;
    if (userRole !== 'admin' && userRole !== 'verifier') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    // Fetch submissions from database
    const submissions = await executeQuery<any[]>(
      status === 'all'
        ? 'SELECT * FROM merchant_submissions ORDER BY submitted_at DESC'
        : 'SELECT * FROM merchant_submissions WHERE status = ? ORDER BY submitted_at DESC',
      status === 'all' ? [] : [status]
    );

    // Fetch stats from view
    const stats = await executeQuery<any[]>(
      'SELECT * FROM merchant_submission_stats'
    );

    return NextResponse.json({
      success: true,
      submissions,
      stats: stats[0] || {
        pending_count: 0,
        approved_count: 0,
        published_count: 0,
        rejected_count: 0,
        early_adopters_count: 0,
        submissions_last_7_days: 0,
        submissions_last_30_days: 0,
      },
    });

  } catch (error) {
    logger.error('Error fetching submissions:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
