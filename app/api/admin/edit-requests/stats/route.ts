import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-guards';
import { handleAPIError } from '@/lib/api-error-handler';

export async function GET() {
  try {
    await requireAdmin();

    // Get counts by status
    const stats = await executeQuery<any[]>(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'merchant_confirmed' THEN 1 ELSE 0 END) as merchant_confirmed,
        SUM(CASE WHEN status = 'applied' THEN 1 ELSE 0 END) as applied,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM merchant_edit_requests`
    );

    return NextResponse.json({
      success: true,
      data: stats[0]
    });

  } catch (error) {
    console.error('Error fetching edit request stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
