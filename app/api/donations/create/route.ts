import { NextRequest, NextResponse } from 'next/server';
import { createInvoice } from '@/lib/btcpay-client';
import { handleAPIError, validateInput, APIError, withRetry } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    validateInput(body, {
      amount: (val) => typeof val === 'number' && val > 0 && val < 1000000,
      tier: (val) => typeof val === 'string' || val === undefined,
      email: (val) => typeof val === 'string' || val === undefined,
    });

    const { amount, tier, email } = body;

    // Create invoice with retry logic
    const invoice = await withRetry(async () => {
      return await createInvoice({
        amount: parseFloat(amount),
        currency: 'USD',
        buyerEmail: email,
        metadata: {
          tier: tier || 'custom',
          source: 'website-donation-widget',
          timestamp: new Date().toISOString(),
        },
      });
    }, 2, 1000); // 2 retries, 1 second delay

    console.log('Invoice created successfully:', invoice.id);

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
