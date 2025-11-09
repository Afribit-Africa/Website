import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailConfig, sendDonationReceipt } from '@/lib/resend-email';
import { handleAPIError } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    console.log('=== EMAIL TEST ENDPOINT CALLED ===');

    // First check if environment variables are set
    const envCheck = {
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_PORT: !!process.env.SMTP_PORT,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASSWORD: !!process.env.SMTP_PASSWORD,
      EMAIL_FROM: !!process.env.EMAIL_FROM,
    };

    console.log('Environment variables present:', envCheck);

    const missingVars = Object.entries(envCheck)
      .filter(([_, present]) => !present)
      .map(([key, _]) => key);

    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        missing: missingVars,
        hint: 'Make sure these variables are set in Vercel environment settings'
      }, { status: 500 });
    }

    // Verify email configuration
    const isValid = await verifyEmailConfig();

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email configuration is invalid',
          hint: 'Check server logs for detailed SMTP error'
        },
        { status: 500 }
      );
    }

    // Get test email from query params
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email');

    if (testEmail) {
      console.log('Sending test receipt to:', testEmail);

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
        user: process.env.SMTP_USER,
      },
    });
  } catch (error) {
    console.error('Email test error:', error);
    return handleAPIError(error);
  }
}
