import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { executeQuery } from '@/lib/db';
import { logger } from '@/lib/logger';
import { MERCHANTS } from '@/lib/merchants-data';
import { randomUUID } from 'crypto';

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

    logger.info(`Admin ${session.user?.email} initiating merchant import...`);

    let inserted = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const merchant of MERCHANTS) {
      try {
        // Check if merchant already exists
        const existing = await executeQuery<any[]>(
          'SELECT id FROM merchant_submissions WHERE business_name = ?',
          [merchant.businessName]
        );

        if (existing.length > 0) {
          skipped++;
          continue;
        }

        // Generate IDs
        const id = randomUUID();
        const editToken = randomUUID().replace(/-/g, '');

        // Map category to OSM category
        let categoryKey = 'amenity';
        let categoryValue = 'other';

        switch (merchant.category) {
          case 'restaurant':
            categoryKey = 'amenity';
            categoryValue = 'restaurant';
            break;
          case 'transport':
            categoryKey = 'shop';
            categoryValue = 'car';
            break;
          case 'beauty':
            categoryKey = 'shop';
            categoryValue = 'beauty';
            break;
          case 'shop':
            categoryKey = 'shop';
            categoryValue = 'convenience';
            break;
          case 'service':
            categoryKey = 'amenity';
            categoryValue = 'community_centre';
            break;
          case 'tourism':
            categoryKey = 'tourism';
            categoryValue = 'attraction';
            break;
          case 'tech':
            categoryKey = 'shop';
            categoryValue = 'electronics';
            break;
          case 'nonprofit':
            categoryKey = 'amenity';
            categoryValue = 'social_facility';
            break;
          default:
            categoryKey = 'amenity';
            categoryValue = 'other';
        }

        // Insert merchant
        await executeQuery(
          `INSERT INTO merchant_submissions (
            id, business_name, category_key, category_value, description,
            latitude, longitude, address, phone, website,
            payment_onchain, payment_lightning, payment_lightning_contactless,
            lightning_address, contact_name, contact_email, contact_relationship,
            status, edit_token, osm_node_id, btcmap_synced,
            is_early_adopter, submitted_at, verified_at, published_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
          [
            id,
            merchant.businessName,
            categoryKey,
            categoryValue,
            merchant.description || `${merchant.businessName} in ${merchant.location}`,
            merchant.latitude || null,
            merchant.longitude || null,
            merchant.location,
            merchant.phoneNumber || null,
            merchant.btcMapUrl || null,
            false, // payment_onchain
            true,  // payment_lightning
            false, // payment_lightning_contactless
            merchant.blinkAddress || merchant.lightningAddress || null,
            merchant.ownerName,
            merchant.email && merchant.email !== 'N/A' && merchant.email !== '–' 
              ? merchant.email 
              : 'info@afribit.africa',
            'owner',
            'published', // Mark as published - these are legacy verified merchants
            editToken,
            merchant.btcMapNodeId || null,
            merchant.btcMapUrl ? true : false,
            true, // All legacy merchants are early adopters
          ]
        );

        inserted++;
      } catch (error: any) {
        logger.error(`Error importing ${merchant.businessName}:`, error);
        errors.push(`${merchant.businessName}: ${error.message}`);
      }
    }

    // Assign adopter numbers
    const earlyAdopters = await executeQuery<any[]>(
      `SELECT id FROM merchant_submissions 
       WHERE is_early_adopter = true AND adopter_number IS NULL 
       ORDER BY submitted_at ASC`
    );

    for (let i = 0; i < earlyAdopters.length; i++) {
      await executeQuery(
        'UPDATE merchant_submissions SET adopter_number = ? WHERE id = ?',
        [i + 1, earlyAdopters[i].id]
      );
    }

    logger.info(`Import complete: ${inserted} inserted, ${skipped} skipped`);

    return NextResponse.json({
      success: true,
      message: 'Merchant import completed',
      stats: {
        total: MERCHANTS.length,
        inserted,
        skipped,
        errors: errors.length,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    logger.error('Merchant import error:', error);
    return NextResponse.json(
      { success: false, error: 'Import failed' },
      { status: 500 }
    );
  }
}
