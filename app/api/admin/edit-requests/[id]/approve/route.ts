import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { executeQuery } from '@/lib/db';
import { generateTokenWithExpiry } from '@/lib/utils/token-generator';
import { sendMerchantConfirmationEmail } from '@/lib/email-templates/merchant-confirmation';

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
    const adminNotes = body.adminNotes || '';

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

    // Generate confirmation token (two-step approval workflow)
    const { token, hash, expiresAt } = generateTokenWithExpiry(7); // 7 days expiry

    // Update edit request status to 'approved' with token
    await executeQuery(
      `UPDATE merchant_edit_requests SET
        status = 'approved',
        confirmation_token = ?,
        token_expires_at = ?,
        reviewed_at = NOW(),
        reviewed_by = ?,
        admin_notes = ?
      WHERE id = ?`,
      [hash, expiresAt, adminUserId, adminNotes, id]
    );

    // Build changes object for email template
    const changes: any = {};

    if (editRequest.business_name_new && editRequest.business_name_new !== editRequest.business_name_old) {
      changes.businessName = {
        old: editRequest.business_name_old || 'Not set',
        new: editRequest.business_name_new
      };
    }

    if (editRequest.category_new && editRequest.category_new !== editRequest.category_old) {
      changes.category = {
        old: editRequest.category_old || 'Not set',
        new: editRequest.category_new
      };
    }

    if (editRequest.address_new && editRequest.address_new !== editRequest.address_old) {
      changes.address = {
        old: editRequest.address_old || 'Not set',
        new: editRequest.address_new
      };
    }

    if (editRequest.phone_new && editRequest.phone_new !== editRequest.phone_old) {
      changes.phone = {
        old: editRequest.phone_old || 'Not set',
        new: editRequest.phone_new
      };
    }

    if (editRequest.blink_address_new && editRequest.blink_address_new !== editRequest.blink_address_old) {
      changes.blinkAddress = {
        old: editRequest.blink_address_old || 'Not set',
        new: editRequest.blink_address_new
      };
    }

    if (editRequest.latitude_new && editRequest.longitude_new &&
        (editRequest.latitude_new !== editRequest.latitude_old ||
         editRequest.longitude_new !== editRequest.longitude_old)) {
      changes.location = {
        old: {
          lat: parseFloat(editRequest.latitude_old) || 0,
          lng: parseFloat(editRequest.longitude_old) || 0
        },
        new: {
          lat: parseFloat(editRequest.latitude_new),
          lng: parseFloat(editRequest.longitude_new)
        },
        distance: editRequest.distance_from_original || 0
      };
    }

    // Send confirmation email to merchant (NOT approval email)
    try {
      await sendMerchantConfirmationEmail({
        businessName: editRequest.business_name || editRequest.business_name_old,
        merchantEmail: editRequest.submitter_email,
        confirmationToken: token, // Send plain token, not hash
        expiresInDays: 7,
        changes
      });

      console.log(`✅ Confirmation email sent to ${editRequest.submitter_email} for edit request #${id}`);
    } catch (emailError) {
      console.error('❌ Failed to send confirmation email:', emailError);
      // Roll back approval if email fails
      await executeQuery(
        `UPDATE merchant_edit_requests SET
          status = 'pending',
          confirmation_token = NULL,
          token_expires_at = NULL,
          reviewed_at = NULL,
          reviewed_by = NULL
        WHERE id = ?`,
        [id]
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send confirmation email to merchant',
          message: emailError instanceof Error ? emailError.message : 'Email service error'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Edit request approved. Confirmation email sent to merchant.',
      data: {
        editRequestId: id,
        merchantEmail: editRequest.submitter_email,
        expiresAt: expiresAt.toISOString(),
        status: 'approved'
      }
    });

  } catch (error) {
    console.error('❌ Approve edit request error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to approve edit request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
