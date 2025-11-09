import { NextRequest, NextResponse } from 'next/server';
import { sendDonationReceipt } from '@/lib/email-service';
import { getDonorByInvoiceId } from '@/lib/donor-db';
import { handleAPIError } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  try {
    const { invoiceId, transactionId } = await request.json();

    if (!invoiceId) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // Get donor info from database
    const donor = await getDonorByInvoiceId(invoiceId);

    if (!donor) {
      return NextResponse.json(
        { success: false, error: 'Donor not found' },
        { status: 404 }
      );
    }

    // Only send receipts to named donors
    if (donor.donation_type !== 'named' || !donor.email) {
      return NextResponse.json(
        { success: false, error: 'Email receipt not applicable for anonymous donations' },
        { status: 400 }
      );
    }

    // Send receipt email
    await sendDonationReceipt({
      donorName: donor.name,
      donorEmail: donor.email,
      amount: parseFloat(donor.amount),
      tier: donor.tier,
      invoiceId: donor.invoice_id,
      date: new Date(donor.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      transactionId,
    });

    return NextResponse.json({
      success: true,
      message: 'Receipt sent successfully',
    });
  } catch (error) {
    console.error('Failed to send receipt:', error);
    return handleAPIError(error);
  }
}
