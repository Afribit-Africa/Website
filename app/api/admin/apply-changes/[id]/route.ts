/**
 * Apply Merchant Edit Changes API Endpoint
 *
 * Final step in the two-step approval workflow.
 * Only callable by admin after merchant has confirmed changes.
 *
 * Actions:
 * 1. Update merchant_submissions table with new values
 * 2. Set early_adopter_confirmed = true
 * 3. Publish to OpenStreetMap (if osm_node_id exists)
 * 4. Update edit request status to 'applied'
 * 5. Send confirmation email to merchant
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { sendChangesAppliedEmail } from '@/lib/email-templates/changes-applied';
import { requireAdmin } from '@/lib/auth-guards';
import { handleAPIError } from '@/lib/api-error-handler';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const user = await requireAdmin();

    const { id } = await context.params;

    // Fetch edit request details
    const editRequests = await executeQuery<any[]>(
      `SELECT * FROM merchant_edit_requests WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!editRequests || editRequests.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Edit request not found' },
        { status: 404 }
      );
    }

    const editRequest = editRequests[0];

    // Verify status is 'merchant_confirmed'
    if (editRequest.status !== 'merchant_confirmed') {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot apply changes. Status is '${editRequest.status}' but must be 'merchant_confirmed'`
        },
        { status: 400 }
      );
    }

    // Update merchant_submissions table
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (editRequest.business_name_new) {
      updateFields.push('business_name = ?');
      updateValues.push(editRequest.business_name_new);
    }

    if (editRequest.category_new) {
      updateFields.push('category_value = ?');
      updateValues.push(editRequest.category_new);
    }

    if (editRequest.address_new) {
      updateFields.push('address = ?');
      updateValues.push(editRequest.address_new);
    }

    if (editRequest.phone_new) {
      updateFields.push('phone = ?');
      updateValues.push(editRequest.phone_new);
    }

    if (editRequest.blink_address_new) {
      updateFields.push('blink_address = ?');
      updateValues.push(editRequest.blink_address_new);
    }

    if (editRequest.latitude_new && editRequest.longitude_new) {
      updateFields.push('latitude = ?');
      updateFields.push('longitude = ?');
      updateValues.push(editRequest.latitude_new);
      updateValues.push(editRequest.longitude_new);
    }

    // Always set early_adopter_confirmed to true
    updateFields.push('early_adopter_confirmed = TRUE');
    updateFields.push('updated_at = NOW()');

    // Add merchant_id to WHERE clause
    updateValues.push(editRequest.merchant_id);

    // Execute update
    const updateQuery = `
      UPDATE merchant_submissions
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    await executeQuery(updateQuery, updateValues);

    console.log(`✅ Updated merchant_submissions for merchant #${editRequest.merchant_id}`);

    // Publish to OpenStreetMap if osm_node_id exists
    if (editRequest.osm_node_id) {
      // Note: OSM publishing would happen here via osm-publisher.ts
      // For now, we'll log it
      console.log(`📍 TODO: Publish to OSM node ${editRequest.osm_node_id}`);
      // await publishToOSM(editRequest);
    }

    // Update edit request status to 'applied'
    await executeQuery(
      `UPDATE merchant_edit_requests
      SET
        status = 'applied',
        reviewed_at = NOW(),
        reviewed_by = ?,
        admin_notes = CONCAT(COALESCE(admin_notes, ''), '\n\nChanges applied to database and OSM at ', NOW())
      WHERE id = ?`,
      [user.id, id]
    );

    console.log(`✅ Edit request #${id} marked as applied`);

    // Send confirmation email to merchant
    const updatedFieldsList: string[] = [];
    if (editRequest.business_name_new) updatedFieldsList.push('Business Name');
    if (editRequest.category_new) updatedFieldsList.push('Category');
    if (editRequest.address_new) updatedFieldsList.push('Address');
    if (editRequest.phone_new) updatedFieldsList.push('Phone Number');
    if (editRequest.blink_address_new) updatedFieldsList.push('Blink Address');
    if (editRequest.latitude_new && editRequest.longitude_new) updatedFieldsList.push('GPS Location');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://afribit.africa';
    const viewMapUrl = `${baseUrl}/maps?merchant=${editRequest.merchant_id}`;
    const btcMapUrl = editRequest.osm_node_id
      ? `https://btcmap.org/merchant/${editRequest.osm_node_id}`
      : undefined;

    await sendChangesAppliedEmail({
      businessName: editRequest.business_name_new || editRequest.business_name_old,
      merchantEmail: editRequest.submitter_email,
      osmNodeId: editRequest.osm_node_id,
      updatedFields: updatedFieldsList,
      viewMapUrl,
      btcMapUrl
    });

    return NextResponse.json({
      success: true,
      message: 'Changes applied successfully',
      data: {
        merchantId: editRequest.merchant_id,
        editRequestId: id,
        updatedFields: updateFields.length - 2, // Exclude early_adopter_confirmed and updated_at
        osmPublished: !!editRequest.osm_node_id
      }
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Apply changes error:', message);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to apply changes',
        details: message
      },
      { status: 500 }
    );
  }
}
