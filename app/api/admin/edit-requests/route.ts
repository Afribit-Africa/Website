import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-guards';
import { handleAPIError } from '@/lib/api-error-handler';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = '';
    const params: any[] = [];

    if (status !== 'all') {
      whereClause = 'WHERE mer.status = ?';
      params.push(status);
    }

    // Get total count
    const countResult = await executeQuery<any[]>(
      `SELECT COUNT(*) as total FROM merchant_edit_requests mer ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get edit requests with merchant details
    const editRequests = await executeQuery<any[]>(
      `SELECT
        mer.*,
        ms.business_name,
        ms.category,
        ms.location as current_address,
        ms.adopter_number,
        au.name as reviewed_by_name
      FROM merchant_edit_requests mer
      LEFT JOIN merchant_submissions ms ON mer.merchant_id = ms.id
      LEFT JOIN admin_users au ON mer.reviewed_by = au.id
      ${whereClause}
      ORDER BY
        CASE mer.status
          WHEN 'pending' THEN 1
          WHEN 'approved' THEN 2
          WHEN 'rejected' THEN 3
        END,
        mer.submitted_at DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get stats
    const stats = await executeQuery<any[]>(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = 'approved' AND reviewed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as approved_this_week
      FROM merchant_edit_requests`
    );

    return NextResponse.json({
      success: true,
      editRequests: editRequests.map(req => ({
        id: req.id,
        merchantId: req.merchant_id,
        businessName: req.business_name,
        category: req.category,
        submitterName: req.submitter_name,
        submitterEmail: req.submitter_email,
        submitterPhone: req.submitter_phone,
        businessNameOld: req.business_name_old,
        businessNameNew: req.business_name_new,
        blinkAddressOld: req.blink_address_old,
        blinkAddressNew: req.blink_address_new,
        locationOld: {
          lat: parseFloat(req.latitude_old),
          lng: parseFloat(req.longitude_old),
          address: req.address_old
        },
        locationNew: {
          lat: parseFloat(req.latitude_new),
          lng: parseFloat(req.longitude_new),
          address: req.address_new
        },
        phoneOld: req.phone_old,
        phoneNew: req.phone_new,
        categoryOld: req.category_old,
        categoryNew: req.category_new,
        reasonForEdit: req.reason_for_edit,
        usedCurrentLocation: req.used_current_location === 1,
        locationAccuracy: req.location_accuracy,
        distanceFromOriginal: req.distance_from_original,
        status: req.status,
        osmNodeId: req.osm_node_id,
        submittedAt: req.submitted_at,
        reviewedAt: req.reviewed_at,
        reviewedBy: req.reviewed_by_name,
        adminNotes: req.admin_notes,
        adopterNumber: req.adopter_number
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: stats[0]
    });

  } catch (error) {
    console.error('List edit requests error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch edit requests',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
