import { NextRequest, NextResponse } from 'next/server';
import { getCrowdfundStats } from '@/lib/btcpay-client';
import { logger } from '@/lib/logger';

// Cache for 30 seconds, revalidate every 30 seconds
export const revalidate = 30;

export async function GET(request: NextRequest) {
  try {
    const stats = await getCrowdfundStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch stats';
    logger.error('Error fetching donation stats:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
