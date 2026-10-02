import { Prisma } from '@prisma/client'
import { DONATION_CURRENCIES, type DonationCurrency } from './donation-policy'

type TotalRow = { currency: string; amount: Prisma.Decimal.Value | null; count: number }

export function summarizeDonationTotals(rows: Iterable<TotalRow>) {
  const amounts = { USD: new Prisma.Decimal(0), BTC: new Prisma.Decimal(0) }
  const counts = { USD: 0, BTC: 0 }
  for (const row of rows) {
    if (!DONATION_CURRENCIES.includes(row.currency as DonationCurrency)) continue
    const currency = row.currency as DonationCurrency
    const amount = new Prisma.Decimal(row.amount ?? 0)
    if (!amount.isFinite() || amount.isNegative() || !Number.isSafeInteger(row.count) || row.count < 0) {
      throw new Error('Invalid donation totals')
    }
    amounts[currency] = amounts[currency].plus(amount)
    counts[currency] += row.count
  }

  return {
    totalRaised: amounts.USD.toNumber(),
    totalDonations: counts.USD + counts.BTC,
    currency: 'USD' as const,
    totalsByCurrency: {
      USD: { totalRaised: amounts.USD.toFixed(2), totalDonations: counts.USD },
      BTC: { totalRaised: amounts.BTC.toFixed(8), totalDonations: counts.BTC },
    },
  }
}
