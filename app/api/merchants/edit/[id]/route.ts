import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { logger } from '@/lib/logger';

// GET request to retrieve submission by ID and token
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Edit token is required' },
        { status: 401 }
      );
    }

    // Fetch from database with token validation
    const submissions = await executeQuery<any[]>(
      `SELECT * FROM merchant_submissions
       WHERE id = ? AND edit_token = ? AND status IN ('pending', 'rejected')`,
      [id, token]
    );

    if (submissions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Submission not found or cannot be edited' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, submission: submissions[0] });

  } catch (error) {
    logger.error('Error fetching submission:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT request to update submission
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { token, ...updateData } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Edit token is required' },
        { status: 401 }
      );
    }

    // Validate token and submission exists
    const submissions = await executeQuery<any[]>(
      `SELECT * FROM merchant_submissions
       WHERE id = ? AND edit_token = ? AND status IN ('pending', 'rejected')`,
      [id, token]
    );

    if (submissions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Submission not found or cannot be edited' },
        { status: 404 }
      );
    }

    // Build update query dynamically based on provided fields
    const updateFields = [];
    const updateValues = [];

    if (updateData.businessName) {
      updateFields.push('business_name = ?');
      updateValues.push(updateData.businessName);
    }
    if (updateData.categoryKey) {
      updateFields.push('category_key = ?');
      updateValues.push(updateData.categoryKey);
    }
    if (updateData.categoryValue) {
      updateFields.push('category_value = ?');
      updateValues.push(updateData.categoryValue);
    }
    if (updateData.description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(updateData.description);
    }
    if (updateData.latitude) {
      updateFields.push('latitude = ?');
      updateValues.push(updateData.latitude);
    }
    if (updateData.longitude) {
      updateFields.push('longitude = ?');
      updateValues.push(updateData.longitude);
    }
    if (updateData.address !== undefined) {
      updateFields.push('address = ?');
      updateValues.push(updateData.address);
    }
    if (updateData.phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(updateData.phone);
    }
    if (updateData.website !== undefined) {
      updateFields.push('website = ?');
      updateValues.push(updateData.website);
    }
    if (updateData.openingHours !== undefined) {
      updateFields.push('opening_hours = ?');
      updateValues.push(updateData.openingHours);
    }
    if (updateData.paymentOnchain !== undefined) {
      updateFields.push('payment_onchain = ?');
      updateValues.push(updateData.paymentOnchain);
    }
    if (updateData.paymentLightning !== undefined) {
      updateFields.push('payment_lightning = ?');
      updateValues.push(updateData.paymentLightning);
    }
    if (updateData.paymentLightningContactless !== undefined) {
      updateFields.push('payment_lightning_contactless = ?');
      updateValues.push(updateData.paymentLightningContactless);
    }
    if (updateData.lightningAddress !== undefined) {
      updateFields.push('lightning_address = ?');
      updateValues.push(updateData.lightningAddress);
    }

    // Always update last_edited_at
    updateFields.push('last_edited_at = NOW()');

    if (updateFields.length === 1) { // Only timestamp, no actual updates
      return NextResponse.json({
        success: true,
        message: 'No changes to update',
      });
    }

    // Execute update
    await executeQuery(
      `UPDATE merchant_submissions SET ${updateFields.join(', ')} WHERE id = ?`,
      [...updateValues, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Submission updated successfully',
    });

  } catch (error) {
    logger.error('Error updating submission:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
