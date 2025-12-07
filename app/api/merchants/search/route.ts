import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    let merchants;

    if (!query || query.trim().length === 0) {
      // If no query, return all early adopters
      merchants = await executeQuery<any[]>(
        `SELECT
          id,
          business_name,
          category_value as category,
          address,
          latitude,
          longitude,
          phone,
          adopter_number,
          osm_node_id,
          is_early_adopter
        FROM merchant_submissions
        WHERE is_early_adopter = true
        ORDER BY
          adopter_number ASC,
          business_name ASC
        LIMIT 100`,
        []
      );
    } else {
      // Search early adopters
      merchants = await executeQuery<any[]>(
        `SELECT
          id,
          business_name,
          category_value as category,
          address,
          latitude,
          longitude,
          phone,
          adopter_number,
          osm_node_id,
          is_early_adopter
        FROM merchant_submissions
        WHERE is_early_adopter = true
          AND (
            business_name LIKE ?
            OR address LIKE ?
            OR category_value LIKE ?
            OR phone LIKE ?
          )
        ORDER BY
          adopter_number ASC,
          business_name ASC
        LIMIT 50`,
        [
          `%${query}%`,
          `%${query}%`,
          `%${query}%`,
          `%${query}%`
        ]
      );
    }

    return NextResponse.json({
      success: true,
      merchants: merchants.map(m => ({
        id: m.id,
        businessName: m.business_name,
        category: m.category,
        address: m.address,
        latitude: m.latitude && !isNaN(parseFloat(m.latitude)) ? parseFloat(m.latitude) : null,
        longitude: m.longitude && !isNaN(parseFloat(m.longitude)) ? parseFloat(m.longitude) : null,
        phone: m.phone,
        adopterNumber: m.adopter_number,
        confirmed: false, // Column doesn't exist yet, will be added via migration
        osmNodeId: m.osm_node_id,
        isEarlyAdopter: m.is_early_adopter === 1
      })),
      count: merchants.length
    });

  } catch (error) {
    console.error('Merchant search error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search merchants',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
