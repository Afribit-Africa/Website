import { NextRequest, NextResponse } from 'next/server'
import { getInvoiceStatus } from '@/lib/btcpay'
import { prisma } from '@/lib/prisma'
import { assertDonationInvoice, getDonationStatus } from '@/lib/donation-settlement'
import { donationInvoiceIdSchema } from '@/lib/donation-validation'
import { z } from 'zod'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  try {
    const invoiceId = donationInvoiceIdSchema.parse((await params).invoiceId)
    const donation = await prisma.donation.findUnique({ where: { btcpayInvoiceId: invoiceId } })
    if (!donation) {
      return NextResponse.json({ success: false, error: 'Donation not found' }, { status: 404 })
    }
    const invoice = await getInvoiceStatus(invoiceId)
    if (!invoice) {
      return NextResponse.json({ success: false, error: 'Invoice verification unavailable' }, { status: 503 })
    }
    assertDonationInvoice(donation, invoice)
    return NextResponse.json({
      success: true,
      data: {
        donationId: donation.id,
        invoiceId: invoice.id,
        status: donation.completedAt || donation.status === 'COMPLETED'
          ? 'COMPLETED' : getDonationStatus(invoice.status),
        btcpayStatus: invoice.status,
        amount: donation.amount.toString(),
        currency: donation.currency,
        createdAt: invoice.createdTime,
        expirationTime: invoice.expirationTime,
        checkoutLink: invoice.checkoutLink,
        program: donation.program,
        programId: donation.programId,
      },
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid invoice ID' }, { status: 400 })
    }
    console.error('[donation-status] Invoice lookup failed')
    return NextResponse.json({ success: false, error: 'Failed to check donation status' }, { status: 500 })
  }
}
