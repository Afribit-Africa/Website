import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {
  sendMerchantSubmissionConfirmation,
  sendMerchantApprovalEmail,
  sendMerchantRejectionEmail,
  verifyEmailConfig
} from '@/lib/resend-email';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const type = searchParams.get('type') || 'confirmation';

  // Just verify config if no email provided
  if (!email) {
    const isConfigured = await verifyEmailConfig();
    return NextResponse.json({
      success: isConfigured,
      message: isConfigured ? 'Email system is configured' : 'Email system is not configured',
      config: {
        hasResendKey: !!process.env.RESEND_API_KEY,
        fromEmail: 'merchants@afribit.africa',
      }
    });
  }

  try {
    let result;
    const testSubmissionId = 'test-' + Date.now();
    const testEditToken = 'test-token-' + Math.random().toString(36).substring(7);

    switch (type) {
      case 'confirmation':
        result = await sendMerchantSubmissionConfirmation(
          email,
          'Test Business Name',
          testSubmissionId,
          testEditToken
        );
        break;

      case 'approval':
        result = await sendMerchantApprovalEmail(
          email,
          'Test Business Name'
        );
        break;

      case 'rejection':
        result = await sendMerchantRejectionEmail(
          email,
          'Test Business Name',
          'This is a test rejection reason. Please update your business details and resubmit.',
          testSubmissionId,
          testEditToken
        );
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid email type. Use: confirmation, approval, or rejection' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Test ${type} email sent successfully to ${email}`,
      result: result
    });

  } catch (error: any) {
    logger.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send test email',
      details: error
    }, { status: 500 });
  }
}
