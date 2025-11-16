import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { executeQuery } from '@/lib/db';
import { sendRejectionEmail } from '@/lib/email-service';
import crypto from 'crypto';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession();
    if (!session?.user?.email || session.user.email !== 'info@afribit.africa') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { submissionId, adminEmail, reason } = body;

    if (!submissionId || !adminEmail || !reason) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch submission
    const submissions = await executeQuery<any[]>(
      'SELECT * FROM merchant_submissions WHERE id = ?',
      [submissionId]
    );

    if (submissions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      );
    }

    const submission = submissions[0];

    if (submission.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Submission already processed' },
        { status: 400 }
      );
    }

    // Update submission status
    await executeQuery(
      `UPDATE merchant_submissions SET
        status = 'rejected',
        rejection_reason = ?,
        verified_at = NOW(),
        verified_by_email = ?
      WHERE id = ?`,
      [reason, adminEmail, submissionId]
    );

    // Log admin activity
    const activityId = crypto.randomUUID();
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');

    await executeQuery(
      `INSERT INTO admin_activity_log (id, merchant_submission_id, admin_email, action, details, ip_address)
       VALUES (?, ?, ?, 'rejected', ?, ?)`,
      [activityId, submissionId, adminEmail, reason, ipAddress]
    );

    // Send rejection email to merchant with edit link
    try {
      await sendRejectionEmail(
        submission.contact_email,
        submission.business_name,
        reason,
        submissionId,
        submission.edit_token
      );
    } catch (emailError) {
      logger.error('Failed to send rejection email:', emailError);
      // Continue anyway
    }

    return NextResponse.json({
      success: true,
      message: 'Submission rejected',
      editToken: submission.edit_token,
    });

  } catch (error) {
    logger.error('Error rejecting submission:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
