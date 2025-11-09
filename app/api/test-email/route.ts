import { NextRequest, NextResponse } from 'next/server';
import { sendDonationReceipt } from '@/lib/resend-email';
import { handleAPIError } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    console.log('=== EMAIL TEST ENDPOINT CALLED ===');

    // Check if Resend API key is set
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Missing RESEND_API_KEY environment variable',
        hint: 'Add RESEND_API_KEY to your Vercel environment settings'
      }, { status: 500 });
    }

    console.log('Resend API key is present');

    // Get test email from query params
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email');

    if (testEmail) {
      console.log('Sending test receipt to:', testEmail);

      try {
        // Send a test receipt
        const result = await sendDonationReceipt({
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

        console.log('Email sent successfully:', result);

        return NextResponse.json({
          success: true,
          message: `Test receipt sent to ${testEmail}`,
          emailId: result.data?.id,
        });
      } catch (emailError: any) {
        console.error('Failed to send test email:', emailError);
        return NextResponse.json({
          success: false,
          error: 'Failed to send email',
          details: emailError.message || String(emailError)
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Resend email configuration is valid',
      config: {
        apiKeyPresent: true,
        fromEmail: process.env.EMAIL_FROM_VERIFIED === 'true'
          ? process.env.EMAIL_FROM
          : 'onboarding@resend.dev',
      },
    });
  } catch (error) {
    console.error('Email test error:', error);
    return handleAPIError(error);
  }
}
