import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStoreStats } from '@/lib/btcpay';

// Cache for 60 seconds to avoid hammering BTCPay on every page load
export const revalidate = 60;

export async function GET() {
  try {
    // Query DB for donation stats
    const [dbStats, btcpayStats] = await Promise.allSettled([
      prisma.donation.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
        _count: { id: true },
      }),
      getStoreStats(),
    ]);

    let totalRaised = 0;
    let totalDonations = 0;

    // Prefer DB stats (authoritative), fall back to BTCPay stats
    if (dbStats.status === 'fulfilled' && dbStats.value) {
      totalDonations = dbStats.value._count.id;
      totalRaised = parseFloat(dbStats.value._sum.amount?.toString() ?? '0') || 0;
    }

    // If DB is empty, fall back to BTCPay direct count
    if (totalDonations === 0 && btcpayStats.status === 'fulfilled' && btcpayStats.value) {
      totalRaised = btcpayStats.value.totalRaised;
      totalDonations = btcpayStats.value.totalDonations;
    }

    return NextResponse.json({
      success: true,
      data: {
        totalRaised: Math.round(totalRaised * 100) / 100,
        totalDonations,
        currency: 'USD',
      },
    });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
