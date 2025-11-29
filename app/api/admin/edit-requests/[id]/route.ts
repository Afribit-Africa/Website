import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { executeQuery } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const editRequests = await executeQuery<any[]>(
      `SELECT
        mer.*,
        ms.business_name,
        ms.category,
        ms.location as current_address,
        ms.phone as current_phone,
        ms.blink_address as current_blink,
        ms.latitude as current_lat,
        ms.longitude as current_lng,
        ms.adopter_number,
        ms.osm_node_id as merchant_osm_node_id,
        au.name as reviewed_by_name,
        au.email as reviewed_by_email
      FROM merchant_edit_requests mer
      LEFT JOIN merchant_submissions ms ON mer.merchant_id = ms.id
      LEFT JOIN admin_users au ON mer.reviewed_by = au.id
      WHERE mer.id = ?`,
      [params.id]
    );

    if (editRequests.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Edit request not found' },
        { status: 404 }
      );
    }

    const req = editRequests[0];

    return NextResponse.json({
      success: true,
      editRequest: {
        id: req.id,
        merchantId: req.merchant_id,
        submitter: {
          name: req.submitter_name,
          email: req.submitter_email,
          phone: req.submitter_phone
        },
        businessName: {
          old: req.business_name_old,
          new: req.business_name_new,
          changed: req.business_name_old !== req.business_name_new
        },
        blinkAddress: {
          old: req.blink_address_old,
          new: req.blink_address_new,
          changed: req.blink_address_old !== req.blink_address_new
        },
        location: {
          old: {
            lat: parseFloat(req.latitude_old),
            lng: parseFloat(req.longitude_old),
            address: req.location_old
          },
          new: {
            lat: parseFloat(req.latitude_new),
            lng: parseFloat(req.longitude_new),
            address: req.location_new
          },
          distanceMoved: req.distance_from_original
        },
        phone: {
          old: req.phone_old,
          new: req.phone_new,
          changed: req.phone_old !== req.phone_new
        },
        category: {
          old: req.category_old,
          new: req.category_new,
          changed: req.category_old !== req.category_new
        },
        reasonForEdit: req.reason_for_edit,
        usedCurrentLocation: req.used_current_location === 1,
        locationAccuracy: req.location_accuracy,
        status: req.status,
        osmNodeId: req.osm_node_id || req.merchant_osm_node_id,
        adopterNumber: req.adopter_number,
        submittedAt: req.submitted_at,
        reviewedAt: req.reviewed_at,
        reviewedBy: req.reviewed_by_name ? {
          name: req.reviewed_by_name,
          email: req.reviewed_by_email
        } : null,
        adminNotes: req.admin_notes,
        merchantConfirmedAt: req.merchant_confirmed_at,
        tokenExpiresAt: req.token_expires_at
      }
    });

  } catch (error) {
    console.error('Get edit request error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch edit request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await executeQuery(
      `DELETE FROM merchant_edit_requests WHERE id = ?`,
      [params.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Edit request deleted successfully'
    });

  } catch (error) {
    console.error('Delete edit request error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete edit request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
