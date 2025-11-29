import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { sendMerchantConfirmationEmail } from '@/lib/email-templates/merchant-confirmation';
import { sendChangesAppliedEmail } from '@/lib/email-templates/changes-applied';
import { sendEditRejectedEmail } from '@/lib/email-templates/edit-rejected';
import { sendDonationReceipt } from '@/lib/resend-email';
import { handleAPIError } from '@/lib/api-helpers';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    logger.info('=== EMAIL TEST ENDPOINT CALLED ===');

    // Check if Resend API key is set
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Missing RESEND_API_KEY environment variable',
        hint: 'Add RESEND_API_KEY to your Vercel environment settings'
      }, { status: 500 });
    }

    logger.info('Resend API key is present');

    // Get test email from query params
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email');

    if (testEmail) {
      logger.info('Sending test receipt to:', testEmail);

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

        logger.info('Email sent successfully:', result);

        return NextResponse.json({
          success: true,
          message: `Test receipt sent to ${testEmail}`,
          emailId: result.data?.id,
        });
      } catch (emailError: any) {
        logger.error('Failed to send test email:', emailError);
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
    logger.error('Email test error:', error);
    return handleAPIError(error);
  }
}

// POST endpoint for testing edit request emails
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { emailType } = body;

    const testEmail = 'spiraedmunds@gmail.com';
    const testBusinessName = 'Kibera Fresh Groceries';

    let result;

    switch (emailType) {
      case 'confirmation':
        // Test merchant confirmation email
        logger.info('Sending test confirmation email to:', testEmail);
        result = await sendMerchantConfirmationEmail({
          businessName: testBusinessName,
          merchantEmail: testEmail,
          confirmationToken: 'test-token-abc123def456',
          expiresInDays: 7,
          changes: {
            businessName: {
              old: 'Kibera Fresh Groceries',
              new: 'Kibera Fresh Groceries & General Store'
            },
            category: {
              old: 'Grocery Store',
              new: 'Grocery & General Store'
            },
            address: {
              old: 'Olympic Estate, Kibera',
              new: 'Olympic Estate, Near Karanja Road, Kibera'
            },
            phone: {
              old: '+254712345678',
              new: '+254787654321'
            },
            blinkAddress: {
              old: 'kiberafresh@blink.sv',
              new: 'kiberafresh2024@blink.sv'
            },
            location: {
              old: { lat: -1.3133, lng: 36.7833 },
              new: { lat: -1.3150, lng: 36.7850 },
              distance: 245
            }
          }
        });
        break;

      case 'applied':
        // Test changes applied email
        logger.info('Sending test changes applied email to:', testEmail);
        result = await sendChangesAppliedEmail({
          businessName: testBusinessName,
          merchantEmail: testEmail,
          osmNodeId: '12345678',
          updatedFields: ['Business Name', 'Phone Number', 'Location', 'Blink Address'],
          viewMapUrl: 'https://afribit.africa/maps',
          btcMapUrl: 'https://btcmap.org/map#15/-1.3133/36.7833'
        });
        break;

      case 'rejected':
        // Test rejection email
        logger.info('Sending test rejection email to:', testEmail);
        result = await sendEditRejectedEmail({
          businessName: testBusinessName,
          merchantEmail: testEmail,
          rejectionReason: 'Thank you for submitting your edit request. After reviewing the location you provided, we noticed that the coordinates point to a residential area rather than a business location. For accurate mapping on Bitcoin Maps, please visit your business premises and use the "Use My Current Location" button on the merchant form. This ensures your exact business location is captured. If you need assistance, feel free to contact our support team.',
          submittedDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid emailType. Use: confirmation, applied, or rejected' },
          { status: 400 }
        );
    }

    logger.info('Test email sent successfully:', result);

    return NextResponse.json({
      success: true,
      message: `Test ${emailType} email sent to ${testEmail}`,
      emailType,
      recipient: testEmail,
      emailId: result.data?.id
    });

  } catch (error) {
    logger.error('Test email error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
