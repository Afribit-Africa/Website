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
      donationType: (val) => val === 'anonymous' || val === 'named' || val === undefined,
      donorName: (val) => typeof val === 'string' || val === undefined,
      donorEmail: (val) => typeof val === 'string' || val === undefined,
    });

    const { amount, tier, donationType, donorName, donorEmail } = body;

    // Create invoice with retry logic
    const invoice = await withRetry(async () => {
      return await createInvoice({
        amount: parseFloat(amount),
        currency: 'USD',
        buyerEmail: donationType === 'named' ? donorEmail : undefined,
        metadata: {
          tier: tier || 'custom',
          donationType: donationType || 'anonymous',
          donorName: donationType === 'named' ? donorName : undefined,
          donorEmail: donationType === 'named' ? donorEmail : undefined,
          source: 'website-donation-widget',
          timestamp: new Date().toISOString(),
        },
      });
    }, 2, 1000); // 2 retries, 1 second delay

    console.log('Invoice created successfully:', invoice.id);

    // TODO: Save donor information to database for named donations
    // This would be implemented when database is set up
    if (donationType === 'named' && donorName && donorEmail) {
      // await saveDonorInfo({ invoiceId: invoice.id, name: donorName, email: donorEmail, amount, tier });
      console.log('Named donation info:', { invoiceId: invoice.id, name: donorName, email: donorEmail });
    }

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
