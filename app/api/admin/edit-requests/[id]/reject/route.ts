import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { executeQuery } from '@/lib/db';
import { sendEditRejectedEmail } from '@/lib/email-templates/edit-rejected';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const rejectionReason = body.rejectionReason || '';
    const adminNotes = body.adminNotes || '';

    if (!rejectionReason || rejectionReason.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: 'Please provide a detailed rejection reason (minimum 20 characters)' },
        { status: 400 }
      );
    }

    // Get edit request details
    const editRequests = await executeQuery<any[]>(
      `SELECT mer.*, ms.business_name
       FROM merchant_edit_requests mer
       LEFT JOIN merchant_submissions ms ON mer.merchant_id = ms.id
       WHERE mer.id = ? AND mer.status = 'pending'`,
      [id]
    );

    if (editRequests.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Edit request not found or already processed' },
        { status: 404 }
      );
    }

    const editRequest = editRequests[0];
    const adminUserId = (session.user as any).id;

    // Mark edit request as rejected
    await executeQuery(
      `UPDATE merchant_edit_requests SET
        status = 'rejected',
        reviewed_at = NOW(),
        reviewed_by = ?,
        admin_notes = ?
      WHERE id = ?`,
      [adminUserId, `${rejectionReason}\n\n${adminNotes}`.trim(), id]
    );

    // Send rejection email using template
    try {
      await sendEditRejectedEmail({
        businessName: editRequest.business_name || editRequest.business_name_old,
        merchantEmail: editRequest.submitter_email,
        rejectionReason: rejectionReason.trim(),
        submittedDate: new Date(editRequest.submitted_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });

      console.log(`✅ Rejection email sent to ${editRequest.submitter_email} for edit request #${id}`);
    } catch (emailError) {
      console.error('❌ Failed to send rejection email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Edit request rejected and merchant notified',
      data: {
        editRequestId: id,
        merchantId: editRequest.merchant_id,
        rejectionReason
      }
    });

  } catch (error) {
    console.error('Reject edit request error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reject edit request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
