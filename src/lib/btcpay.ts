import { OpenAPI, InvoicesService } from 'btcpay-greenfield-node-client'
import crypto from 'crypto'
import { type DonationCurrency } from '@/lib/donation-policy'
import { normalizeInvoiceAmount } from '@/lib/donation-validation'
import { summarizeDonationTotals } from '@/lib/donation-totals'

// BTCPay Server configuration
const BTCPAY_HOST = process.env.BTCPAY_HOST || 'https://btcpay.afribit.africa'
const BTCPAY_API_KEY = process.env.BTCPAY_API_KEY
const BTCPAY_STORE_ID = process.env.BTCPAY_STORE_ID

// Configure BTCPay client
if (BTCPAY_API_KEY) {
  OpenAPI.BASE = BTCPAY_HOST
  OpenAPI.TOKEN = BTCPAY_API_KEY
  OpenAPI.WITH_CREDENTIALS = true
} else {
  console.warn('BTCPay credentials not configured. Donation features will be disabled.')
}

export interface CreateInvoiceParams {
  amount: number | string
  currency?: DonationCurrency
  buyerEmail?: string
  buyerName?: string
  orderId?: string
  metadata?: {
    program?: string
    message?: string
    isAnonymous?: boolean
    [key: string]: string | boolean | number | undefined
  }
  redirectUrl?: string
  notificationUrl?: string
}

export interface InvoiceData {
  id: string
  checkoutLink: string
  status: string
  amount: string
  currency: string
  createdTime: number
  expirationTime: number
  btcAddress?: string
  lightningInvoice?: string
  metadata?: Record<string, unknown>
}

/**
 * Create a new BTCPay invoice for donation
 */
export async function createInvoice(params: CreateInvoiceParams): Promise<InvoiceData | null> {
  if (process.env.BTCPAY_CHECKOUT_ENABLED !== 'true') {
    throw new Error('BTCPay checkout is not enabled')
  }
  if (!BTCPAY_API_KEY || !BTCPAY_STORE_ID) {
    throw new Error('BTCPay client not configured')
  }

  try {
    const currency = params.currency || 'USD'
    const amount = normalizeInvoiceAmount(params.amount, currency)
    if (amount.isZero()) throw new Error('Donation amount must be positive')

    const invoice = await InvoicesService.invoicesCreateInvoice({
      storeId: BTCPAY_STORE_ID,
      requestBody: {
        amount: amount.toString(),
        currency,
        metadata: {
          buyerEmail: params.buyerEmail,
          buyerName: params.buyerName,
          orderId: params.orderId || `AFRIBIT-${Date.now()}`,
          ...params.metadata,
        },
        checkout: {
          redirectURL: params.redirectUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/donate/success`,
          redirectAutomatically: false,
        },
      },
    })

    return {
      id: invoice.id || '',
      checkoutLink: invoice.checkoutLink || '',
      status: invoice.status || 'New',
      amount: invoice.amount || '0',
      currency: invoice.currency || 'USD',
      createdTime: new Date(invoice.createdTime || Date.now()).getTime(),
      expirationTime: new Date(invoice.expirationTime || Date.now()).getTime(),
      metadata: invoice.metadata,
    }
  } catch (error) {
    console.error('[btcpay-invoice] Provider invoice creation failed')
    throw error
  }
}

/**
 * Get invoice status and details
 */
export async function getInvoiceStatus(invoiceId: string): Promise<InvoiceData | null> {
  if (!BTCPAY_API_KEY || !BTCPAY_STORE_ID) {
    throw new Error('BTCPay client not configured')
  }

  try {
    const invoice = await InvoicesService.invoicesGetInvoice({
      storeId: BTCPAY_STORE_ID,
      invoiceId,
    })

    return {
      id: invoice.id || '',
      checkoutLink: invoice.checkoutLink || '',
      status: invoice.status || 'New',
      amount: invoice.amount || '0',
      currency: invoice.currency || 'USD',
      createdTime: new Date(invoice.createdTime || Date.now()).getTime(),
      expirationTime: new Date(invoice.expirationTime || Date.now()).getTime(),
      metadata: invoice.metadata,
    }
  } catch {
    console.error('[btcpay-invoice] Provider status lookup failed')
    return null
  }
}

/**
 * Get store statistics
 */
export async function getStoreStats() {
  if (!BTCPAY_API_KEY || !BTCPAY_STORE_ID) {
    return null
  }

  try {
    // Get recent invoices to calculate stats
    const invoices = await InvoicesService.invoicesGetInvoices({
      storeId: BTCPAY_STORE_ID,
    })

    // Filter settled invoices
    const settledInvoices = invoices.filter((inv) => inv.status === 'Settled')

    return summarizeDonationTotals(settledInvoices.map((invoice) => ({
      currency: invoice.currency || '',
      amount: invoice.amount || '0',
      count: 1,
    })))
  } catch {
    console.error('[btcpay-stats] Provider totals unavailable')
    return null
  }
}

/**
 * Verify webhook signature (for security)
 */
export function verifyWebhookSignature(payload: string | Buffer, signature: string, secret: string): boolean {
  if (!secret || !/^sha256=[a-f0-9]{64}$/.test(signature)) return false
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)
  const calculatedSignature = hmac.digest()
  const suppliedSignature = Buffer.from(signature.slice('sha256='.length), 'hex')
  return crypto.timingSafeEqual(calculatedSignature, suppliedSignature)
}
