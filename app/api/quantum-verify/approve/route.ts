import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { sendApprovalEmail, sendPublishedEmail } from '@/lib/email-service';
import { publishMerchantToOSM } from '@/lib/osm-client';
import { addMerchantToDirectory } from '@/lib/directory-updater';
import crypto from 'crypto';
import { logger } from '@/lib/logger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin role
    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { submissionId, adminEmail, notes } = body;

    if (!submissionId || !adminEmail) {
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

    // Check if this qualifies as early adopter
    const countResult = await executeQuery<any[]>(
      "SELECT COUNT(*) as count FROM merchant_submissions WHERE status = 'published'"
    );
    const publishedCount = countResult[0].count;

    const isEarlyAdopter = publishedCount < 50;
    const adopterNumber = isEarlyAdopter ? publishedCount + 1 : null;

    // Update submission status
    await executeQuery(
      `UPDATE merchant_submissions SET
        status = 'approved',
        verified_at = NOW(),
        verified_by_email = ?,
        is_early_adopter = ?,
        adopter_number = ?
      WHERE id = ?`,
      [adminEmail, isEarlyAdopter, adopterNumber, submissionId]
    );

    // Log admin activity
    const activityId = crypto.randomUUID();
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');

    await executeQuery(
      `INSERT INTO admin_activity_log (id, merchant_submission_id, admin_email, action, details, ip_address)
       VALUES (?, ?, ?, 'approved', ?, ?)`,
      [activityId, submissionId, adminEmail, notes || null, ipAddress]
    );

    // Send approval email to merchant
    try {
      await sendApprovalEmail(
        submission.contact_email,
        submission.business_name,
        isEarlyAdopter,
        adopterNumber
      );
    } catch (emailError) {
      logger.error('Failed to send approval email:', emailError);
      // Continue anyway
    }

    // Automatically publish to OpenStreetMap if configured
    let osmNodeId: number | null = null;
    let osmChangesetId: number | null = null;
    let publishError: string | null = null;

    if (process.env.OSM_ACCESS_TOKEN) {
      try {
        logger.info(`🌍 Auto-publishing ${submission.business_name} to OpenStreetMap...`);
        const osmResult = await publishMerchantToOSM(submission);
        osmNodeId = osmResult.nodeId;
        osmChangesetId = osmResult.changesetId;

        // Update submission with OSM data
        await executeQuery(
          `UPDATE merchant_submissions SET
            status = 'published',
            osm_node_id = ?,
            osm_changeset_id = ?,
            published_at = NOW()
          WHERE id = ?`,
          [osmNodeId, osmChangesetId, submissionId]
        );

        // Log successful publish
        const publishActivityId = crypto.randomUUID();
        await executeQuery(
          `INSERT INTO admin_activity_log (id, merchant_submission_id, admin_email, action, details)
           VALUES (?, ?, ?, 'published', ?)`,
          [
            publishActivityId,
            submissionId,
            adminEmail,
            `Auto-published to OSM - Node: ${osmNodeId}, Changeset: ${osmChangesetId}`
          ]
        );

        logger.info(`✅ Auto-published to OSM: Node ${osmNodeId}`);

        // Add to merchant directory
        try {
          await addMerchantToDirectory(
            osmNodeId,
            submission.latitude,
            submission.longitude,
            submission.business_name
          );
          logger.info(`✅ Added to merchant directory`);
        } catch (dirError) {
          logger.error('Failed to update directory:', dirError);
          // Continue anyway - can be added manually
        }

        // Send published email to merchant
        try {
          await sendPublishedEmail(
            submission.contact_email,
            submission.business_name,
            osmNodeId,
            isEarlyAdopter,
            adopterNumber
          );
        } catch (emailError) {
          logger.error('Failed to send published email:', emailError);
        }

      } catch (osmError) {
        logger.error('❌ Failed to auto-publish to OSM:', osmError);
        publishError = osmError instanceof Error ? osmError.message : 'Unknown error';

        // Log failed publish attempt
        const failActivityId = crypto.randomUUID();
        await executeQuery(
          `INSERT INTO admin_activity_log (id, merchant_submission_id, admin_email, action, details)
           VALUES (?, ?, ?, 'publish_failed', ?)`,
          [failActivityId, submissionId, adminEmail, publishError]
        );
      }
    } else {
      publishError = 'OSM_ACCESS_TOKEN not configured';
      logger.warn('⚠️ OSM publishing skipped: OSM_ACCESS_TOKEN not configured');
    }

    return NextResponse.json({
      success: true,
      message: 'Submission approved successfully',
      isEarlyAdopter,
      adopterNumber,
      osmPublished: osmNodeId !== null,
      osmNodeId,
      osmChangesetId,
      osmUrl: osmNodeId ? `https://www.openstreetmap.org/node/${osmNodeId}` : null,
      publishError,
    });

  } catch (error) {
    logger.error('Error approving submission:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
