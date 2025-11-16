import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { executeQuery } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req: request as any });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all merchants from merchant_submissions table
    const merchants = await executeQuery(
      `SELECT
        id, business_name, category_key, category_value, description,
        latitude, longitude, address, phone, website, opening_hours,
        social_twitter, social_facebook, social_instagram,
        payment_onchain, payment_lightning, payment_lightning_contactless,
        contact_name, contact_email, contact_relationship,
        status, osm_node_id, is_early_adopter, adopter_number,
        submitted_at, approved_at, published_at
      FROM merchant_submissions
      ORDER BY submitted_at DESC`,
      []
    );

    return NextResponse.json({
      success: true,
      merchants
    });
  } catch (error) {
    logger.error('Error fetching merchants list:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch merchants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req: request as any });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      business_name,
      category_key,
      category_value,
      description,
      latitude,
      longitude,
      address,
      phone,
      website,
      opening_hours,
      payment_onchain,
      payment_lightning,
      payment_lightning_contactless,
      contact_name,
      contact_email,
    } = body;

    // Validate required fields
    if (!business_name || !category_value || !latitude || !longitude || !address) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique ID
    const id = crypto.randomUUID();

    // Insert merchant
    await executeQuery(
      `INSERT INTO merchant_submissions (
        id, business_name, category_key, category_value, description,
        latitude, longitude, address, phone, website, opening_hours,
        payment_onchain, payment_lightning, payment_lightning_contactless,
        contact_name, contact_email, status, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', NOW())`,
      [
        id,
        business_name,
        category_key || 'other',
        category_value,
        description || '',
        latitude,
        longitude,
        address,
        phone || '',
        website || '',
        opening_hours || '',
        payment_onchain || false,
        payment_lightning || false,
        payment_lightning_contactless || false,
        contact_name || '',
        contact_email || '',
      ]
    );

    logger.info(`Admin manually added merchant: ${business_name}`);

    return NextResponse.json({
      success: true,
      message: 'Merchant added successfully',
      merchantId: id
    });
  } catch (error) {
    logger.error('Error adding merchant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add merchant' },
      { status: 500 }
    );
  }
}
