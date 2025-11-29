/**
 * Merchant Confirmation API Endpoint
 *
 * Handles merchant confirmation of edit requests via email link.
 * Part of the two-step approval workflow:
 * 1. Admin approves → sends confirmation email
 * 2. Merchant clicks link → THIS endpoint → status: 'merchant_confirmed'
 * 3. Admin applies changes → updates database and OSM
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { verifyToken, isTokenExpired } from '@/lib/utils/token-generator';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No confirmation token provided' },
        { status: 400 }
      );
    }

    // Find edit request by token
    const editRequests = await query<any[]>(
      `SELECT
        id,
        merchant_id,
        business_name_new,
        submitter_email,
        status,
        confirmation_token,
        token_expires_at,
        merchant_confirmed_at
      FROM merchant_edit_requests
      WHERE confirmation_token = ?
      LIMIT 1`,
      [token]
    );

    if (!editRequests || editRequests.length === 0) {
      return NextResponse.redirect(
        new URL('/confirm/invalid', request.url)
      );
    }

    const editRequest = editRequests[0];

    // Check if already confirmed
    if (editRequest.status === 'merchant_confirmed') {
      return NextResponse.redirect(
        new URL('/confirm/already-confirmed', request.url)
      );
    }

    // Check if already applied
    if (editRequest.status === 'applied') {
      return NextResponse.redirect(
        new URL('/confirm/already-applied', request.url)
      );
    }

    // Check if token has expired
    if (editRequest.token_expires_at && isTokenExpired(editRequest.token_expires_at)) {
      return NextResponse.redirect(
        new URL('/confirm/expired', request.url)
      );
    }

    // Verify status is 'approved'
    if (editRequest.status !== 'approved') {
      return NextResponse.redirect(
        new URL('/confirm/invalid', request.url)
      );
    }

    // Update status to merchant_confirmed
    await query(
      `UPDATE merchant_edit_requests
      SET
        status = 'merchant_confirmed',
        merchant_confirmed_at = NOW()
      WHERE id = ?`,
      [editRequest.id]
    );

    console.log(`✅ Merchant confirmed edit request #${editRequest.id} for "${editRequest.business_name_new}"`);

    // Redirect to success page with business name
    const successUrl = new URL('/confirm/success', request.url);
    successUrl.searchParams.set('business', editRequest.business_name_new || 'your business');

    return NextResponse.redirect(successUrl);

  } catch (error: any) {
    console.error('❌ Merchant confirmation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to confirm edit request',
        details: error.message
      },
      { status: 500 }
    );
  }
}
