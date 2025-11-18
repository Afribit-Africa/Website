import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { executeQuery } from '@/lib/db';
import { sendMerchantApprovalEmail } from '@/lib/resend-email';
import { publishToOSM, getOSMNodeUrl, getBTCMapUrl } from '@/lib/osm-publisher';
import { randomUUID } from 'crypto';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { submissionId, notes, adminOverride } = body;

    if (!submissionId) {
      return NextResponse.json(
        { success: false, error: 'Submission ID is required' },
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

    // Check if submission has been verified by a verifier (unless admin override)
    if (submission.verification_status !== 'verified' && !adminOverride) {
      return NextResponse.json(
        {
          success: false,
          error: 'This submission must be verified by a verifier before approval',
          verificationStatus: submission.verification_status,
          hint: 'Use adminOverride: true to bypass verification requirement'
        },
        { status: 400 }
      );
    }

    // Publish to OpenStreetMap (after admin approval as per BTCMap workflow)
    let osmPublishResult = null;
    let finalStatus = 'approved';

    if (process.env.OSM_ACCESS_TOKEN) {
      logger.info('📍 Publishing to OpenStreetMap...');
      osmPublishResult = await publishToOSM({
        businessName: submission.business_name,
        latitude: submission.latitude,
        longitude: submission.longitude,
        category: submission.category_value || 'Other',
        address: submission.address,
        paymentOnchain: submission.payment_onchain,
        paymentLightning: submission.payment_lightning,
        paymentLightningContactless: submission.payment_lightning_contactless,
        contactEmail: submission.contact_email,
        verifiedAt: submission.verified_at_location || new Date().toISOString(),
        submissionId: submissionId
      });

      if (osmPublishResult.success) {
        logger.info('✅ Published to OSM successfully');
        logger.info(`   Node ID: ${osmPublishResult.nodeId}`);
        logger.info(`   Changeset ID: ${osmPublishResult.changesetId}`);
        logger.info(`   View on OSM: ${getOSMNodeUrl(osmPublishResult.nodeId!)}`);
        logger.info(`   View on BTCMap: ${getBTCMapUrl(submission.latitude, submission.longitude)}`);
        finalStatus = 'published';
      } else {
        logger.error('⚠️  OSM publishing failed:', osmPublishResult.error);
        // Continue with approval even if OSM fails
      }
    } else {
      logger.info('⏭️  OSM publishing skipped (not configured)');
    }

    // Update submission status
    await executeQuery(
      `UPDATE merchant_submissions
       SET status = ?,
           verified_at = NOW(),
           verified_by_email = ?,
           osm_node_id = ?,
           osm_changeset_id = ?,
           published_at = ${finalStatus === 'published' ? 'NOW()' : 'NULL'}
       WHERE id = ?`,
      [
        finalStatus,
        session.user?.email,
        osmPublishResult?.nodeId || null,
        osmPublishResult?.changesetId || null,
        submissionId
      ]
    );

    // Log admin activity
    const activityDetails = adminOverride
      ? `Admin Override: ${notes || 'Approved without verifier verification'}`
      : notes || 'No notes provided';

    await executeQuery(
      `INSERT INTO admin_activity_log (id, merchant_submission_id, admin_email, action, details, created_at)
       VALUES (?, ?, ?, 'approved', ?, NOW())`,
      [randomUUID(), submissionId, session.user?.email, activityDetails]
    );

    // Send approval email to merchant
    try {
      await sendMerchantApprovalEmail(
        submission.contact_email,
        submission.business_name
      );
      logger.info('✅ Approval email sent successfully');
    } catch (emailError) {
      logger.error('❌ Failed to send approval email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Submission approved successfully',
      osmPublished: osmPublishResult?.success || false,
      osmNodeId: osmPublishResult?.nodeId,
      osmChangesetId: osmPublishResult?.changesetId,
      osmNodeUrl: osmPublishResult?.nodeId ? getOSMNodeUrl(osmPublishResult.nodeId) : null,
      btcMapUrl: getBTCMapUrl(submission.latitude, submission.longitude),
      status: finalStatus
    });
  } catch (error) {
    logger.error('Approve API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
