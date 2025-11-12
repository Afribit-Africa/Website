import { NextRequest, NextResponse } from 'next/server';
import { createInvoice } from '@/lib/btcpay-client';
import { handleAPIError, validateInput, APIError, withRetry } from '@/lib/api-helpers';
import { saveDonorInfo, initDonorsTable } from '@/lib/donor-db';
import { rateLimit, rateLimitConfigs, RateLimitError } from '@/lib/rate-limit';
import { createDonationSchema, formatZodError } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    try {
      await rateLimit(request, rateLimitConfigs.moderate);
    } catch (error) {
      if (error instanceof RateLimitError) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.', retryAfter: error.retryAfter },
          { status: 429, headers: { 'Retry-After': error.retryAfter.toString() } }
        );
      }
      throw error;
    }

    const body = await request.json();

    // Validate input with Zod
    const validation = createDonationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: formatZodError(validation.error) },
        { status: 400 }
      );
    }

    const { amount, tier, donationType, name, email } = validation.data;

    // Create invoice with retry logic
    const invoice = await withRetry(async () => {
      return await createInvoice({
        amount: amount,
        currency: 'USD',
        buyerEmail: donationType === 'named' ? email : undefined,
        metadata: {
          tier: tier || 'custom',
          donationType: donationType || 'anonymous',
          donorName: donationType === 'named' ? name : undefined,
          donorEmail: donationType === 'named' ? email : undefined,
          source: 'website-donation-widget',
          timestamp: new Date().toISOString(),
        },
      });
    }, 2, 1000); // 2 retries, 1 second delay

    console.log('Invoice created successfully:', invoice.id);

    // Save donor information to database
    try {
      // Ensure table exists
      await initDonorsTable();

      // Save donor info (including anonymous donations for stats)
      await saveDonorInfo({
        invoiceId: invoice.id,
        name: donationType === 'named' ? (name || '') : '',
        email: donationType === 'named' ? (email || '') : '',
        amount: amount,
        tier: tier || 'custom',
        donationType: donationType || 'anonymous',
      });

      console.log('Donor info saved to database:', invoice.id);
    } catch (dbError) {
      // Log error but don't fail the invoice creation
      console.error('Failed to save donor info to database:', dbError);
    }

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
