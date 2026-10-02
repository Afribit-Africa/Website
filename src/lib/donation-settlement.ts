import { DonationStatus, type Donation, type Prisma } from '@prisma/client'
import { z } from 'zod'
import { DONATION_CURRENCIES } from './donation-policy'
import { parseDonationAmount } from './donation-validation'
import type { InvoiceData } from './btcpay'

type AuthoritativeInvoice = Pick<InvoiceData, 'id' | 'status' | 'amount' | 'currency'>

export function getDonationStatus(status: string): DonationStatus {
  switch (status) {
    case 'New': return DonationStatus.PENDING
    case 'Processing': return DonationStatus.PROCESSING
    case 'Settled': return DonationStatus.COMPLETED
    case 'Expired': return DonationStatus.EXPIRED
    case 'Invalid': return DonationStatus.FAILED
    default: throw new Error('Unsupported invoice status')
  }
}

export function assertDonationInvoice(donation: Donation, invoice: AuthoritativeInvoice): void {
  const currency = z.enum(DONATION_CURRENCIES).parse(donation.currency)
  if (
    invoice.id !== donation.btcpayInvoiceId || invoice.currency !== currency ||
    !parseDonationAmount(invoice.amount, currency).equals(parseDonationAmount(donation.amount, currency))
  ) {
    throw new Error('Invoice does not match the donation')
  }
}

export async function reconcileDonation(
  transaction: Prisma.TransactionClient,
  invoice: AuthoritativeInvoice,
): Promise<{ donation: Donation; credited: boolean; programName?: string } | null> {
  const donation = await transaction.donation.findUnique({ where: { btcpayInvoiceId: invoice.id } })
  if (!donation) return null
  assertDonationInvoice(donation, invoice)
  const status = getDonationStatus(invoice.status)

  // Completion is a durable credit marker: delayed deliveries cannot reopen it.
  if (donation.completedAt || donation.status === DonationStatus.COMPLETED) {
    return { donation, credited: false }
  }

  const completedAt = status === DonationStatus.COMPLETED ? new Date() : null
  const claimed = await transaction.donation.updateMany({
    where: {
      id: donation.id,
      btcpayInvoiceId: invoice.id,
      amount: donation.amount,
      currency: donation.currency,
      completedAt: null,
      status: { not: DonationStatus.COMPLETED },
    },
    data: { status, completedAt },
  })
  if (claimed.count !== 1) return { donation, credited: false }

  let programName = donation.program || undefined
  if (status === DonationStatus.COMPLETED && donation.currency === 'USD' && (donation.programId || donation.program)) {
    const program = await transaction.program.findUnique({
      where: donation.programId ? { id: donation.programId } : { slug: donation.program! },
      select: { id: true, name: true },
    })
    if (!program) throw new Error('Donation program is unavailable')
    await transaction.program.update({
      where: { id: program.id },
      data: { raised: { increment: donation.amount } },
    })
    programName = program.name
  }

  return {
    donation: { ...donation, status, completedAt },
    credited: status === DonationStatus.COMPLETED,
    programName,
  }
}
