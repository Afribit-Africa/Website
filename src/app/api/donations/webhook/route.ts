import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getInvoiceStatus, verifyWebhookSignature } from '@/lib/btcpay'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { donationConfirmationEmail, adminDonationNotification } from '@/lib/email-templates'
import { reconcileDonation } from '@/lib/donation-settlement'
import { DONATION_WEBHOOK_EVENTS, donationWebhookSchema } from '@/lib/donation-validation'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('btcpay-sig')
    if (!signature) {
      return NextResponse.json({ success: false, error: 'Missing signature' }, { status: 401 })
    }
    const webhookSecret = process.env.BTCPAY_WEBHOOK_SECRET
    const storeId = process.env.BTCPAY_STORE_ID
    if (!webhookSecret || !storeId) {
      return NextResponse.json({ success: false, error: 'Webhook not configured' }, { status: 503 })
    }
    const rawBody = Buffer.from(await request.arrayBuffer())
    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 })
    }
    const body: unknown = JSON.parse(rawBody.toString('utf8'))
    const { type } = z.object({ type: z.string().min(1).max(128) }).parse(body)
    if (!DONATION_WEBHOOK_EVENTS.some((event) => event === type)) {
      return NextResponse.json({ success: true, message: 'Event ignored' })
    }
    const payload = donationWebhookSchema.parse(body)
    if (payload.storeId !== storeId) {
      return NextResponse.json({ success: false, error: 'Unexpected invoice store' }, { status: 403 })
    }
    const existing = await prisma.donation.findUnique({
      where: { btcpayInvoiceId: payload.invoiceId },
      select: { id: true },
    })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Donation not found' }, { status: 404 })
    }
    // Delivery order is not authoritative; reconcile the current invoice in our store.
    const invoice = await getInvoiceStatus(payload.invoiceId)
    if (!invoice || invoice.id !== payload.invoiceId) {
      return NextResponse.json({ success: false, error: 'Invoice verification unavailable' }, { status: 503 })
    }
    const result = await prisma.$transaction((transaction) => reconcileDonation(transaction, invoice))
    if (!result) {
      return NextResponse.json({ success: false, error: 'Donation not found' }, { status: 404 })
    }
    if (result.credited) {
      const { donation, programName } = result
      const notification = {
        donorName: donation.donorName || 'Supporter',
        amount: donation.amount.toString(),
        currency: donation.currency,
        program: programName,
        invoiceId: payload.invoiceId,
        isAnonymous: donation.isAnonymous,
      }
      if (!donation.isAnonymous && donation.donorEmail) {
        const template = donationConfirmationEmail(notification)
        await sendEmail({ to: donation.donorEmail, ...template }).catch(() => {
          console.error('[donation-webhook] Donor notification failed')
        })
      }
      if (process.env.ADMIN_EMAIL) {
        const template = adminDonationNotification({
          ...notification,
          donorEmail: donation.isAnonymous ? undefined : donation.donorEmail || undefined,
        })
        await sendEmail({ to: process.env.ADMIN_EMAIL, ...template }).catch(() => {
          console.error('[donation-webhook] Admin notification failed')
        })
      }
    }
    return NextResponse.json({ success: true, message: 'Webhook processed successfully' })
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return NextResponse.json({ success: false, error: 'Invalid webhook payload' }, { status: 400 })
    }
    console.error('[donation-webhook] Reconciliation failed')
    return NextResponse.json({ success: false, error: 'Failed to process webhook' }, { status: 500 })
  }
}
