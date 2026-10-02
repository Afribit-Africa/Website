import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { DONATION_CURRENCIES, type DonationCurrency } from './donation-policy'

export const DONATION_AMOUNT_LIMIT = 100_000_000_000
export const donationInvoiceIdSchema = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/)

export function normalizeInvoiceAmount(amount: number | string, currency: DonationCurrency): Prisma.Decimal {
  const value = new Prisma.Decimal(amount)
  const normalized = value.toDecimalPlaces(currency === 'BTC' ? 8 : 2)
  if (!value.isFinite() || value.lte(0) || normalized.gte(DONATION_AMOUNT_LIMIT)) {
    throw new Error('Donation amount is outside the supported range')
  }
  return normalized
}

export function parseDonationAmount(amount: Prisma.Decimal.Value, currency: DonationCurrency): Prisma.Decimal {
  const value = new Prisma.Decimal(amount)
  if (
    !value.isFinite() || value.lte(0) || value.gte(DONATION_AMOUNT_LIMIT) ||
    value.decimalPlaces() > (currency === 'BTC' ? 8 : 2)
  ) {
    throw new Error('Invalid donation amount')
  }
  return value
}

export const donationInvoiceSchema = z.object({
  amount: z.number().positive().lt(DONATION_AMOUNT_LIMIT),
  currency: z.enum(DONATION_CURRENCIES).default('USD'),
  donorName: z.string().trim().min(2).max(200).optional(),
  donorEmail: z.string().trim().email().max(254).optional(),
  program: z.string().trim().min(1).max(128).optional(),
  message: z.string().max(500).optional(),
  isAnonymous: z.boolean().default(false),
}).superRefine((data, context) => {
  try {
    normalizeInvoiceAmount(data.amount, data.currency)
  } catch {
    context.addIssue({ code: 'custom', path: ['amount'], message: 'Donation amount is outside the supported range' })
  }
})

export const DONATION_WEBHOOK_EVENTS = [
  'InvoiceCreated', 'InvoiceReceivedPayment', 'InvoicePaymentSettled',
  'InvoiceProcessing', 'InvoiceExpired', 'InvoiceSettled', 'InvoiceInvalid',
] as const

export const donationWebhookSchema = z.object({
  type: z.enum(DONATION_WEBHOOK_EVENTS),
  invoiceId: donationInvoiceIdSchema,
  storeId: donationInvoiceIdSchema,
  deliveryId: donationInvoiceIdSchema,
})
