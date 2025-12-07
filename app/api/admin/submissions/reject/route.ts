import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { sendMerchantRejectionEmail } from '@/lib/resend-email';
import { randomUUID } from 'crypto';
import { requireAdmin } from '@/lib/auth-guards';
import { handleAPIError } from '@/lib/api-error-handler';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();

    const body = await request.json();
    const { submissionId, reason } = body;

    if (!submissionId || !reason) {
      return NextResponse.json(
        { success: false, error: 'Submission ID and reason are required' },
        { status: 400 }
      );
    }

    // Get submission details
    const [submission] = await executeQuery<any[]>(
      'SELECT * FROM merchant_submissions WHERE id = ?',
      [submissionId]
    );

    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Update submission status to rejected
    await executeQuery(
      `UPDATE merchant_submissions
       SET status = 'rejected',
           rejection_reason = ?,
           verified_at = NOW(),
           verified_by_email = ?
       WHERE id = ?`,
      [reason, user.email, submissionId]
    );

    // Log admin activity
    await executeQuery(
      `INSERT INTO admin_activity_log (id, merchant_submission_id, admin_email, action, details, created_at)
       VALUES (?, ?, ?, 'rejected', ?, NOW())`,
      [randomUUID(), submissionId, user.email, reason]
    );

    // Send rejection email with edit link
    try {
      await sendMerchantRejectionEmail(
        submission.contact_email,
        submission.business_name,
        reason,
        submissionId,
        submission.edit_token
      );
    } catch (emailError) {
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Submission rejected successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
