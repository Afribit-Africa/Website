import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getStoreStats } from '@/lib/btcpay'
import { DONATION_CURRENCIES } from '@/lib/donation-policy'
import { summarizeDonationTotals } from '@/lib/donation-totals'

export const dynamic = 'force-dynamic'

export async function GET() {
  let stats: ReturnType<typeof summarizeDonationTotals> | null = null
  try {
    const rows = await prisma.donation.groupBy({
      by: ['currency'],
      where: { status: 'COMPLETED', currency: { in: [...DONATION_CURRENCIES] } },
      _sum: { amount: true },
      _count: { id: true },
    })
    stats = summarizeDonationTotals(rows.map((row) => ({
      currency: row.currency,
      amount: row._sum.amount,
      count: row._count.id,
    })))
  } catch {
    console.error('[donation-stats] Database totals unavailable')
  }
  if (!stats || stats.totalDonations === 0) {
    stats = await getStoreStats().catch(() => null) || stats
  }
  if (!stats) {
    return NextResponse.json({ success: false, error: 'Donation totals unavailable' }, { status: 503 })
  }
  return NextResponse.json({ success: true, data: stats })
}
