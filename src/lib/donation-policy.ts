export const CROWDFUND_URL =
  'https://pay.afribit.africa/apps/2xYtsTMHMqYv6qozQ8j9zjP66FiR/crowdfund'

export const DONATION_CURRENCIES = ['USD', 'BTC'] as const

export type DonationCurrency = (typeof DONATION_CURRENCIES)[number]

export const DONATION_MINIMUMS: Record<DonationCurrency, number> = {
  USD: 1,
  BTC: 0.00001,
}

export const DONATION_INPUT_STEPS: Record<DonationCurrency, string> = {
  USD: '1',
  BTC: '0.00000001',
}

export const DONATION_INPUT_PLACEHOLDERS: Record<DonationCurrency, string> = {
  USD: '25',
  BTC: '0.00010000',
}

export function normalizeDonationAmount(amount: number, currency: DonationCurrency) {
  if (!Number.isFinite(amount)) {
    return amount
  }

  if (currency === 'BTC') {
    return Number(amount.toFixed(8))
  }

  return Number(amount.toFixed(2))
}

export function formatDonationAmount(amount: number, currency: DonationCurrency) {
  const normalizedAmount = normalizeDonationAmount(amount, currency)

  if (currency === 'BTC') {
    return normalizedAmount.toFixed(8).replace(/\.?0+$/, '')
  }

  return normalizedAmount.toFixed(2).replace(/\.00$/, '')
}

export function getDonationMinimum(currency: DonationCurrency) {
  return DONATION_MINIMUMS[currency]
}

export function getDonationMinimumLabel(currency: DonationCurrency) {
  if (currency === 'USD') {
    return `$${formatDonationAmount(getDonationMinimum(currency), currency)}`
  }

  return `${formatDonationAmount(getDonationMinimum(currency), currency)} BTC`
}

export function isBelowDonationMinimum(amount: number, currency: DonationCurrency) {
  return normalizeDonationAmount(amount, currency) < getDonationMinimum(currency)
}

export function getDonationMinimumMessage(currency: DonationCurrency) {
  if (currency === 'USD') {
    return `The minimum direct checkout amount is ${getDonationMinimumLabel(currency)}.`
  }

  return `The minimum direct checkout amount is ${getDonationMinimumLabel(currency)}.`
}

export function getDonationAmountHelperText(currency: DonationCurrency) {
  if (currency === 'BTC') {
    return `Enter the amount in BTC. Suggested impact tiers are shown in USD for reference. Minimum ${getDonationMinimumLabel(currency)}.`
  }

  return `Enter the amount in US dollars. Minimum ${getDonationMinimumLabel(currency)}.`
}