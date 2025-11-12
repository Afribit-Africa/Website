import { NextRequest, NextResponse } from 'next/server';
import { sendDonationReceipt } from '@/lib/resend-email';
import { getDonorByInvoiceId } from '@/lib/donor-db';
import { handleAPIError } from '@/lib/api-helpers';
import { rateLimit, rateLimitConfigs, RateLimitError } from '@/lib/rate-limit';
import { sendReceiptSchema, formatZodError } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    try {
      await rateLimit(request, rateLimitConfigs.strict);
    } catch (error) {
      if (error instanceof RateLimitError) {
        return NextResponse.json(
          { success: false, error: 'Too many requests. Please try again later.' },
          { status: 429, headers: { 'Retry-After': error.retryAfter.toString() } }
        );
      }
      throw error;
    }

    const body = await request.json();

    // Validate input
    const validation = sendReceiptSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: formatZodError(validation.error) },
        { status: 400 }
      );
    }

    const { invoiceId, transactionId } = validation.data;

    console.log('Attempting to send receipt for invoice:', invoiceId);

    // Get donor info from database
    let donor;
    try {
      donor = await getDonorByInvoiceId(invoiceId);
      console.log('Donor found:', donor ? 'Yes' : 'No');
    } catch (dbError) {
      console.error('Database error when fetching donor:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database error', details: String(dbError) },
        { status: 500 }
      );
    }

    if (!donor) {
      console.log('No donor found for invoice:', invoiceId);
      return NextResponse.json(
        { success: false, error: 'Donor not found in database' },
        { status: 404 }
      );
    }

    // Only send receipts to named donors
    if (donor.donation_type !== 'named' || !donor.email) {
      console.log('Skipping email - donation type:', donor.donation_type, 'email:', donor.email);
      return NextResponse.json(
        { success: false, error: 'Email receipt not applicable for anonymous donations' },
        { status: 400 }
      );
    }

    console.log('Sending receipt email to:', donor.email);

    // Send receipt email
    try {
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

      console.log('Receipt sent successfully to:', donor.email);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { success: false, error: 'Failed to send email', details: String(emailError) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Receipt sent successfully',
    });
  } catch (error) {
    console.error('Failed to send receipt - general error:', error);
    return handleAPIError(error);
  }
}
