import { NextRequest, NextResponse } from 'next/server';
import { getCrowdfundStats } from '@/lib/btcpay-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const stats = await getCrowdfundStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error('Error fetching donation stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
