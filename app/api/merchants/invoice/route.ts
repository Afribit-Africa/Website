import { NextRequest, NextResponse } from 'next/server';
import { createMerchantInvoice, extractBlinkUsername } from '@/lib/blink-client';
import { getMerchantBySlug } from '@/lib/merchants-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { merchantSlug, amount, memo } = body;

    // Validate input
    if (!merchantSlug) {
      return NextResponse.json(
        { error: 'Merchant slug is required' },
        { status: 400 }
      );
    }

    // Get merchant data
    const merchant = getMerchantBySlug(merchantSlug);
    
    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    if (!merchant.blinkAddress) {
      return NextResponse.json(
        { error: 'Merchant does not have a Blink address' },
        { status: 400 }
      );
    }

    // Extract username from Blink address
    const blinkUsername = extractBlinkUsername(merchant.blinkAddress);

    // Create custom memo
    const invoiceMemo = memo || `Donation to ${merchant.businessName} via Afribit`;

    // Create invoice using Blink API
    const invoice = await createMerchantInvoice(blinkUsername, invoiceMemo);

    if (!invoice) {
      return NextResponse.json(
        { error: 'Failed to create invoice' },
        { status: 500 }
      );
    }

    // Return invoice data
    return NextResponse.json({
      success: true,
      invoice: {
        paymentRequest: invoice.paymentRequest,
        paymentHash: invoice.paymentHash,
        paymentSecret: invoice.paymentSecret
      },
      merchant: {
        name: merchant.businessName,
        blinkAddress: merchant.blinkAddress,
        owner: merchant.ownerName
      },
      amount: amount || null // Amount will be specified when paying the invoice
    });

  } catch (error) {
    console.error('Error in merchant invoice API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
