import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailConfig, sendDonationReceipt } from '@/lib/email-service';
import { handleAPIError } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    // Verify email configuration
    const isValid = await verifyEmailConfig();

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Email configuration is invalid' },
        { status: 500 }
      );
    }

    // Get test email from query params
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email');

    if (testEmail) {
      // Send a test receipt
      await sendDonationReceipt({
        donorName: 'Test Donor',
        donorEmail: testEmail,
        amount: 25,
        tier: 'friend',
        invoiceId: 'TEST-' + Date.now(),
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });

      return NextResponse.json({
        success: true,
        message: `Test receipt sent to ${testEmail}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Email configuration is valid',
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        from: process.env.EMAIL_FROM,
      },
    });
  } catch (error) {
    console.error('Email test error:', error);
    return handleAPIError(error);
  }
}
