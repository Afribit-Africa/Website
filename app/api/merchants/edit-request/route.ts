import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { sendEmail } from '@/lib/resend-email';

interface EditRequestBody {
  merchantId: number;
  submitterName: string;
  submitterEmail: string;
  submitterPhone?: string;
  businessNameNew?: string;
  blinkAddressNew?: string;
  latitudeNew: number;
  longitudeNew: number;
  addressNew?: string;
  phoneNew?: string;
  categoryNew?: string;
  reasonForEdit: string;
  usedCurrentLocation: boolean;
  locationAccuracy?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: EditRequestBody = await request.json();

    // Validation
    if (!body.merchantId || !body.submitterName || !body.submitterEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: merchantId, submitterName, submitterEmail' },
        { status: 400 }
      );
    }

    if (!body.latitudeNew || !body.longitudeNew) {
      return NextResponse.json(
        { success: false, error: 'Location coordinates are required' },
        { status: 400 }
      );
    }

    if (!body.reasonForEdit || body.reasonForEdit.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please provide a detailed reason for the changes (minimum 10 characters)' },
        { status: 400 }
      );
    }

    // Get current merchant data
    const merchants = await executeQuery<any[]>(
      `SELECT
        id, business_name, latitude, longitude,
        address, phone, category_value as category, osm_node_id, is_early_adopter
      FROM merchant_submissions
      WHERE id = ? AND is_early_adopter = true`,
      [body.merchantId]
    );

    if (merchants.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Merchant not found or not an early adopter' },
        { status: 404 }
      );
    }

    const merchant = merchants[0];

    // Calculate distance between old and new location
    const distanceInMeters = calculateDistance(
      parseFloat(merchant.latitude),
      parseFloat(merchant.longitude),
      body.latitudeNew,
      body.longitudeNew
    );

    // Insert edit request
    const result = await executeQuery<any>(
      `INSERT INTO merchant_edit_requests (
        merchant_id,
        submitter_name,
        submitter_email,
        submitter_phone,
        business_name_old,
        business_name_new,
        latitude_old,
        longitude_old,
        latitude_new,
        longitude_new,
        address_old,
        address_new,
        phone_old,
        phone_new,
        category_old,
        category_new,
        reason_for_edit,
        used_current_location,
        location_accuracy,
        distance_from_original,
        osm_node_id,
        status,
        submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        body.merchantId,
        body.submitterName,
        body.submitterEmail,
        body.submitterPhone || null,
        merchant.business_name,
        body.businessNameNew || merchant.business_name,
        merchant.latitude,
        merchant.longitude,
        body.latitudeNew,
        body.longitudeNew,
        merchant.address,
        body.addressNew || merchant.address,
        merchant.phone,
        body.phoneNew || merchant.phone,
        merchant.category,
        body.categoryNew || merchant.category,
        body.reasonForEdit,
        body.usedCurrentLocation ? 1 : 0,
        body.locationAccuracy || null,
        distanceInMeters,
        merchant.osm_node_id
      ]
    );

    const requestId = (result as any).insertId;

    // Send notification email to admin
    try {
      await sendEmail({
        to: 'team@afribit.co.ke',
        subject: `New Edit Request from Early Adopter: ${merchant.business_name}`,
        html: `
          <h2>New Merchant Edit Request</h2>
          <p>An early adopter has submitted changes for their business listing.</p>

          <h3>Business: ${merchant.business_name}</h3>
          <p><strong>Submitter:</strong> ${body.submitterName} (${body.submitterEmail})</p>
          <p><strong>Request ID:</strong> ${requestId}</p>

          <h4>Changes Requested:</h4>
          <ul>
            ${body.businessNameNew && body.businessNameNew !== merchant.business_name ?
              `<li><strong>Business Name:</strong> ${merchant.business_name} → ${body.businessNameNew}</li>` : ''}
            ${body.blinkAddressNew && body.blinkAddressNew !== merchant.blink_address ?
              `<li><strong>Blink Address:</strong> ${merchant.blink_address} → ${body.blinkAddressNew}</li>` : ''}
            <li><strong>Location:</strong> Moved ${Math.round(distanceInMeters)}m from original position</li>
            <li><strong>New Coordinates:</strong> ${body.latitudeNew}, ${body.longitudeNew}</li>
            ${body.usedCurrentLocation ? '<li>✅ Used GPS at business location</li>' : ''}
          </ul>

          <p><strong>Reason:</strong> ${body.reasonForEdit}</p>

          <p><a href="https://afribit.co.ke/admin/edit-requests/${requestId}">Review Request in Admin Dashboard</a></p>

          <p><strong>OSM Node ID:</strong> ${merchant.osm_node_id || 'Not published yet'}</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to submitter
    try {
      await sendEmail({
        to: body.submitterEmail,
        subject: 'Your Business Details Edit Request Received',
        html: `
          <h2>Thank You for Updating Your Business Details</h2>
          <p>Dear ${body.submitterName},</p>

          <p>We have received your request to update the details for <strong>${merchant.business_name}</strong>.</p>

          <h3>What Happens Next?</h3>
          <ol>
            <li>Our team will review your changes within 2-3 business days</li>
            <li>We'll verify the location coordinates you provided</li>
            <li>If approved, we'll update both our database and OpenStreetMap</li>
            <li>You'll receive an email notification once the review is complete</li>
          </ol>

          <h3>Your Changes:</h3>
          <ul>
            ${body.businessNameNew && body.businessNameNew !== merchant.business_name ?
              `<li><strong>Business Name:</strong> ${body.businessNameNew}</li>` : ''}
            ${body.blinkAddressNew && body.blinkAddressNew !== merchant.blink_address ?
              `<li><strong>Blink Address:</strong> ${body.blinkAddressNew}</li>` : ''}
            <li><strong>Location Updated:</strong> ${body.usedCurrentLocation ? 'Using GPS at business location' : 'Manual pin placement'}</li>
            ${body.addressNew ? `<li><strong>Address:</strong> ${body.addressNew}</li>` : ''}
          </ul>

          <p><strong>Reference ID:</strong> #${requestId}</p>

          <p>If you have any questions, please contact us at team@afribit.co.ke</p>

          <p>Thank you for being an early adopter of Afribit!</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      requestId,
      message: 'Edit request submitted successfully. You will receive an email confirmation shortly.',
      distanceMoved: Math.round(distanceInMeters)
    });

  } catch (error) {
    console.error('Edit request submission error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit edit request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
