import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build query
    let query = `
      SELECT
        id,
        business_name as businessName,
        category_key as categoryKey,
        category_value as categoryValue,
        description,
        latitude,
        longitude,
        address as location,
        phone as phoneNumber,
        website,
        lightning_address as lightningAddress,
        payment_onchain as paymentOnchain,
        payment_lightning as paymentLightning,
        payment_lightning_contactless as paymentLightningContactless,
        contact_name as ownerName,
        contact_email as email,
        osm_node_id as btcMapNodeId,
        is_early_adopter as isEarlyAdopter,
        adopter_number as adopterNumber,
        published_at as publishedAt
      FROM merchant_submissions
      WHERE status = 'published'
    `;

    const params: any[] = [];

    // Add category filter if provided
    if (category && category !== 'all') {
      query += ' AND category_value = ?';
      params.push(category);
    }

    // Add search filter if provided
    if (search && search.trim()) {
      query += ` AND (
        business_name LIKE ? OR
        address LIKE ? OR
        contact_name LIKE ? OR
        description LIKE ?
      )`;
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY published_at DESC';

    const merchants = await executeQuery<any[]>(query, params);

    // Format merchants for frontend
    const formattedMerchants = merchants.map(m => {
      // Map category_value to frontend category
      let category = 'other';
      switch (m.categoryValue) {
        case 'restaurant':
        case 'cafe':
        case 'fast_food':
          category = 'restaurant';
          break;
        case 'car':
        case 'car_wash':
          category = 'transport';
          break;
        case 'beauty':
        case 'hairdresser':
          category = 'beauty';
          break;
        case 'convenience':
        case 'general':
        case 'supermarket':
          category = 'shop';
          break;
        case 'community_centre':
        case 'workshop':
          category = 'service';
          break;
        case 'attraction':
        case 'hotel':
          category = 'tourism';
          break;
        case 'electronics':
        case 'computer':
          category = 'tech';
          break;
        case 'social_facility':
        case 'ngo':
          category = 'nonprofit';
          break;
      }

      return {
        id: m.id,
        businessName: m.businessName,
        ownerName: m.ownerName,
        email: m.email,
        phoneNumber: m.phoneNumber || '',
        location: m.location || '',
        blinkAddress: m.lightningAddress || '',
        lightningAddress: m.lightningAddress || '',
        btcMapUrl: m.btcMapNodeId ? `https://btcmap.org/merchant/${m.btcMapNodeId}` : undefined,
        btcMapNodeId: m.btcMapNodeId?.toString(),
        latitude: m.latitude && !isNaN(parseFloat(m.latitude)) ? parseFloat(m.latitude) : undefined,
        longitude: m.longitude && !isNaN(parseFloat(m.longitude)) ? parseFloat(m.longitude) : undefined,
        slug: m.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        description: m.description,
        paymentOnchain: Boolean(m.paymentOnchain),
        paymentLightning: Boolean(m.paymentLightning),
        paymentLightningContactless: Boolean(m.paymentLightningContactless),
        isEarlyAdopter: Boolean(m.isEarlyAdopter),
        adopterNumber: m.adopterNumber,
      };
    });

    return NextResponse.json({
      success: true,
      merchants: formattedMerchants,
      count: formattedMerchants.length,
    });
  } catch (error) {
    logger.error('Merchants API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch merchants' },
      { status: 500 }
    );
  }
}
