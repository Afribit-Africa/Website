import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDbPool } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const pool = getDbPool();

    const { id: submissionId } = await params;

    // Fetch submission details
    const [rows] = await pool.execute(
      `SELECT
        id,
        business_name as businessName,
        category_value as category,
        address as location,
        latitude,
        longitude,
        payment_onchain as paymentOnchain,
        payment_lightning as paymentLightning,
        payment_lightning_contactless as paymentLightningContactless,
        contact_email as contactEmail,
        submitted_at as submittedAt,
        verification_status as verificationStatus
      FROM merchant_submissions
      WHERE id = ? AND verification_status = 'pending_verification'`,
      [submissionId]
    );

    const submissions = rows as any[];

    if (submissions.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Submission not found or already verified' },
        { status: 404 }
      );
    }

    const submission = submissions[0];

    // Build payment methods array from boolean columns
    const paymentMethods = [];
    if (submission.paymentOnchain) paymentMethods.push('onchain');
    if (submission.paymentLightning) paymentMethods.push('lightning');
    if (submission.paymentLightningContactless) paymentMethods.push('lightning_contactless');

    submission.paymentMethods = paymentMethods;

    // Remove boolean columns from response
    delete submission.paymentOnchain;
    delete submission.paymentLightning;
    delete submission.paymentLightningContactless;

    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (error) {
    logger.error('Error fetching submission:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
