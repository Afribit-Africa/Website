import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { executeQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch statistics
    const statsQuery = `
      SELECT
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingCount,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approvedCount,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as publishedCount,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejectedCount,
        SUM(CASE WHEN is_early_adopter = true THEN 1 ELSE 0 END) as earlyAdoptersCount,
        SUM(CASE WHEN submitted_at > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as submissionsLast7Days,
        SUM(CASE WHEN submitted_at > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as submissionsLast30Days,
        COUNT(*) as totalSubmissions
      FROM merchant_submissions
    `;

    const [stats] = await executeQuery<any[]>(statsQuery);

    // Fetch recent submissions
    const recentQuery = `
      SELECT id, business_name as businessName, contact_email as contactEmail, status, submitted_at as submittedAt
      FROM merchant_submissions
      ORDER BY submitted_at DESC
      LIMIT 10
    `;

    const recentSubmissions = await executeQuery<any[]>(recentQuery);

    return NextResponse.json({
      success: true,
      stats: {
        pendingCount: Number(stats.pendingCount) || 0,
        approvedCount: Number(stats.approvedCount) || 0,
        publishedCount: Number(stats.publishedCount) || 0,
        rejectedCount: Number(stats.rejectedCount) || 0,
        earlyAdoptersCount: Number(stats.earlyAdoptersCount) || 0,
        submissionsLast7Days: Number(stats.submissionsLast7Days) || 0,
        submissionsLast30Days: Number(stats.submissionsLast30Days) || 0,
        totalSubmissions: Number(stats.totalSubmissions) || 0,
      },
      recentSubmissions,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
