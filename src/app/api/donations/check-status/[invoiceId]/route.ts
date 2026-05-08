import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceStatus } from '@/lib/btcpay';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await params;

    if (!invoiceId) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // Get invoice status from BTCPay
    const invoiceStatus = await getInvoiceStatus(invoiceId);

    if (!invoiceStatus) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found in BTCPay' },
        { status: 404 }
      );
    }

    // Find donation record in database
    const donation = await prisma.donation.findFirst({
      where: { btcpayInvoiceId: invoiceId },
    });

    if (!donation) {
      return NextResponse.json(
        { success: false, error: 'Donation not found' },
        { status: 404 }
      );
    }

    // Map BTCPay status to our donation status
    let donationStatus = donation.status;
    const btcpayStatus = invoiceStatus.status;

    if (
      btcpayStatus === 'Settled' ||
      btcpayStatus === 'Processing'
    ) {
      donationStatus = 'COMPLETED';
    } else if (btcpayStatus === 'Expired' || btcpayStatus === 'Invalid') {
      donationStatus = 'FAILED';
    } else if (btcpayStatus === 'New') {
      donationStatus = 'PENDING';
    }

    // Update donation status if changed
    if (donationStatus !== donation.status) {
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          status: donationStatus,
          completedAt: donationStatus === 'COMPLETED' ? new Date() : null,
        },
      });

      // If completed and has program, update program raised amount
      if (donationStatus === 'COMPLETED' && (donation.programId || donation.program)) {
        const programRecord = donation.programId
          ? await prisma.program.findUnique({
              where: { id: donation.programId },
            })
          : await prisma.program.findUnique({
              where: { slug: donation.program! },
            });

        if (programRecord) {
          await prisma.program.update({
            where: { id: programRecord.id },
            data: {
              raised: {
                increment: parseFloat(donation.amount.toString()),
              },
            },
          });
        }
      }
    }

    // Return status information
    return NextResponse.json({
      success: true,
      data: {
        donationId: donation.id,
        invoiceId: invoiceStatus.id,
        status: donationStatus,
        btcpayStatus: btcpayStatus,
        amount: donation.amount.toString(),
        currency: donation.currency,
        createdAt: invoiceStatus.createdTime,
        expirationTime: invoiceStatus.expirationTime,
        checkoutLink: invoiceStatus.checkoutLink,
        program: donation.program,
        programId: donation.programId,
      },
    });
  } catch (error) {
    console.error('Error checking donation status:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check donation status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
