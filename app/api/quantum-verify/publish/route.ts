import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { publishMerchantToOSM } from '@/lib/osm-client';
import crypto from 'crypto';
import { logger } from '@/lib/logger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Publish an approved merchant to OpenStreetMap
 * This endpoint is called after admin approval
 */
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
    const { submissionId, adminEmail } = body;

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

    // Verify submission is approved (not already published)
    if (submission.status !== 'approved') {
      return NextResponse.json(
        { success: false, error: `Cannot publish submission with status: ${submission.status}` },
        { status: 400 }
      );
    }

    // Check if OSM credentials are configured
    if (!process.env.OSM_ACCESS_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: 'OSM_ACCESS_TOKEN not configured. Please set up OAuth 2.0 with OpenStreetMap.',
          documentation: 'See MERCHANT_REGISTRATION_SYSTEM.md for setup instructions'
        },
        { status: 500 }
      );
    }

    // Publish to OpenStreetMap
    let nodeId: number;
    let changesetId: number;

    try {
      const result = await publishMerchantToOSM(submission);
      nodeId = result.nodeId;
      changesetId = result.changesetId;
    } catch (osmError: any) {
      logger.error('OSM publish error:', osmError);

      // Log failed publish attempt
      const activityId = crypto.randomUUID();
      await executeQuery(
        `INSERT INTO admin_activity_log (id, merchant_submission_id, admin_email, action, details)
         VALUES (?, ?, ?, 'publish_failed', ?)`,
        [activityId, submissionId, adminEmail, osmError.message]
      );

      return NextResponse.json(
        { success: false, error: `Failed to publish to OSM: ${osmError.message}` },
        { status: 500 }
      );
    }

    // Update submission with OSM data
    await executeQuery(
      `UPDATE merchant_submissions SET
        status = 'published',
        osm_node_id = ?,
        osm_changeset_id = ?,
        published_at = NOW()
      WHERE id = ?`,
      [nodeId, changesetId, submissionId]
    );

    // Log successful publish
    const activityId = crypto.randomUUID();
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');

    await executeQuery(
      `INSERT INTO admin_activity_log (id, merchant_submission_id, admin_email, action, details, ip_address)
       VALUES (?, ?, ?, 'published', ?, ?)`,
      [
        activityId,
        submissionId,
        adminEmail,
        `Published to OSM - Node: ${nodeId}, Changeset: ${changesetId}`,
        ipAddress
      ]
    );

    // Send published notification email to merchant
    try {
      const [merchantRows] = await executeQuery<any[]>(
        'SELECT contact_email, business_name FROM merchant_submissions WHERE id = ?',
        [submissionId]
      );
      const merchant = merchantRows?.[0];

      if (merchant?.contact_email) {
        const { sendMerchantPublishedEmail } = await import('@/lib/resend-email');
        await sendMerchantPublishedEmail({
          email: merchant.contact_email,
          businessName: merchant.business_name,
          osmNodeId: nodeId.toString(),
          btcmapUrl: `https://btcmap.org/merchant/${nodeId}`,
        });
        logger.info('Published notification email sent to:', merchant.contact_email);
      }
    } catch (emailError) {
      logger.error('Failed to send published email:', emailError);
      // Don't fail the publish if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Merchant published to OpenStreetMap successfully',
      osmNodeId: nodeId,
      osmChangesetId: changesetId,
      osmUrl: `https://www.openstreetmap.org/node/${nodeId}`,
      btcmapUrl: 'https://btcmap.org',
      note: 'Merchant will appear on BTCMap within 10-20 minutes'
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    logger.error('Error publishing merchant:', message);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
