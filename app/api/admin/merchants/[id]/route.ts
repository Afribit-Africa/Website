import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { executeQuery } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const token = await getToken({ req: request as any });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if merchant exists
    const merchant = await executeQuery(
      'SELECT id, business_name FROM merchant_submissions WHERE id = ?',
      [id]
    ) as any[];

    if (!merchant || merchant.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Delete merchant
    await executeQuery(
      'DELETE FROM merchant_submissions WHERE id = ?',
      [id]
    );

    logger.info(`Admin deleted merchant: ${merchant[0].business_name} (${id})`);

    return NextResponse.json({
      success: true,
      message: 'Merchant deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting merchant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete merchant' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const token = await getToken({ req: request as any });
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Check if merchant exists
    const merchant = await executeQuery(
      'SELECT id FROM merchant_submissions WHERE id = ?',
      [id]
    ) as any[];

    if (!merchant || merchant.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Build dynamic UPDATE query
    const updates: string[] = [];
    const values: any[] = [];

    const allowedFields = [
      'business_name',
      'category_key',
      'category_value',
      'description',
      'latitude',
      'longitude',
      'address',
      'phone',
      'website',
      'opening_hours',
      'social_twitter',
      'social_facebook',
      'social_instagram',
      'payment_onchain',
      'payment_lightning',
      'payment_lightning_contactless',
      'contact_name',
      'contact_email',
      'status'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(id);

    // Update merchant
    await executeQuery(
      `UPDATE merchant_submissions SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    logger.info(`Admin updated merchant: ${id}`);

    return NextResponse.json({
      success: true,
      message: 'Merchant updated successfully'
    });
  } catch (error) {
    logger.error('Error updating merchant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update merchant' },
      { status: 500 }
    );
  }
}
