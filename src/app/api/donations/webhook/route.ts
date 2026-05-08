import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/btcpay';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { donationConfirmationEmail, adminDonationNotification } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    // Get webhook signature from headers
    const signature = request.headers.get('btcpay-sig');

    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Get raw body text for signature verification
    const rawBody = await request.text();

    // Verify webhook signature
    const webhookSecret = process.env.BTCPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('BTCPAY_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { success: false, error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);

    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload = JSON.parse(rawBody);
    const { type, invoiceId, afterExpiration } = payload;

    console.log('Webhook received:', { type, invoiceId, afterExpiration });

    // Only process invoice-related events
    if (!type || !type.startsWith('Invoice')) {
      return NextResponse.json({ success: true, message: 'Event ignored' });
    }

    // Find donation by BTCPay invoice ID
    const donation = await prisma.donation.findFirst({
      where: { btcpayInvoiceId: invoiceId },
    });

    if (!donation) {
      console.error('Donation not found for invoice:', invoiceId);
      return NextResponse.json(
        { success: false, error: 'Donation not found' },
        { status: 404 }
      );
    }

    // Map webhook event type to donation status
    let newStatus = donation.status;

    switch (type) {
      case 'InvoiceSettled':
      case 'InvoiceProcessing':
        // Payment received and confirmed
        newStatus = 'COMPLETED';
        break;

      case 'InvoicePaymentSettled':
        // Payment is being processed
        newStatus = 'PROCESSING';
        break;

      case 'InvoiceExpired':
      case 'InvoiceInvalid':
        // Invoice expired or invalid
        newStatus = 'FAILED';
        break;

      case 'InvoiceReceivedPayment':
        // Payment detected but not confirmed yet
        newStatus = 'PROCESSING';
        break;

      default:
        console.log('Unhandled webhook type:', type);
    }

    // Update donation status
    if (newStatus !== donation.status) {
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          status: newStatus,
          completedAt: newStatus === 'COMPLETED' ? new Date() : null,
        },
      });

      // Update program raised amount if completed
      let completedProgramName = donation.program || undefined;

      if (newStatus === 'COMPLETED' && (donation.programId || donation.program)) {
        const programRecord = donation.programId
          ? await prisma.program.findUnique({
              where: { id: donation.programId },
            })
          : await prisma.program.findUnique({
              where: { slug: donation.program! },
            });

        if (programRecord) {
          completedProgramName = programRecord.name;
          await prisma.program.update({
            where: { id: programRecord.id },
            data: {
              raised: {
                increment: parseFloat(donation.amount.toString()),
              },
            },
          });

          console.log(
            `Program ${programRecord.name} updated with donation of ${donation.amount} ${donation.currency}`
          );
        }
      }

      // TODO: Send confirmation email to donor
      // This will be implemented in Task 7 (Email System)
      if (newStatus === 'COMPLETED' && donation.donorEmail && donation.btcpayInvoiceId) {
        // Send donor confirmation email
        const donorEmailTemplate = donationConfirmationEmail({
          donorName: donation.donorName || 'Supporter',
          amount: donation.amount.toString(),
          currency: donation.currency,
          program: completedProgramName,
          invoiceId: donation.btcpayInvoiceId,
          isAnonymous: donation.isAnonymous,
        });

        await sendEmail({
          to: donation.donorEmail,
          subject: donorEmailTemplate.subject,
          html: donorEmailTemplate.html,
        }).catch(error => {
          console.error('Failed to send donor confirmation email:', error);
        });

        // Send admin notification email
        if (process.env.ADMIN_EMAIL) {
          const adminEmailTemplate = adminDonationNotification({
            donorName: donation.donorName || 'Anonymous',
            donorEmail: donation.donorEmail || undefined,
            amount: donation.amount.toString(),
            currency: donation.currency,
            program: completedProgramName,
            invoiceId: donation.btcpayInvoiceId,
            isAnonymous: donation.isAnonymous,
          });

          await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: adminEmailTemplate.subject,
            html: adminEmailTemplate.html,
          }).catch(error => {
            console.error('Failed to send admin notification email:', error);
          });
        }

        console.log(
          `Confirmation email sent to ${donation.donorEmail} for donation #${donation.id}`
        );
      }

      console.log(
        `Donation #${donation.id} status updated: ${donation.status} → ${newStatus}`
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    console.error('Error processing webhook:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process webhook',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
