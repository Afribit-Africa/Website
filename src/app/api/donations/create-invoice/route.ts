import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createInvoice } from '@/lib/btcpay';
import {
  CROWDFUND_URL,
  DONATION_CURRENCIES,
  getDonationMinimumLabel,
  getDonationMinimumMessage,
  isBelowDonationMinimum,
  normalizeDonationAmount,
  type DonationCurrency,
} from '@/lib/donation-policy';
import { prisma } from '@/lib/prisma';

// Validation schema for donation request
const donationSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(DONATION_CURRENCIES).default('USD'),
  donorName: z.string().min(2, 'Name must be at least 2 characters').optional(),
  donorEmail: z.string().email('Invalid email address').optional(),
  program: z.string().optional(), // Program slug or identifier
  message: z.string().max(500, 'Message too long').optional(),
  isAnonymous: z.boolean().default(false),
});

function extractDonationErrorMessage(error: unknown) {
  if (error && typeof error === 'object') {
    const bodyMessage = (error as { body?: { message?: unknown } }).body?.message
    if (typeof bodyMessage === 'string' && bodyMessage.trim()) {
      return bodyMessage.trim()
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim()
  }

  return 'Unknown error'
}

function buildMinimumAmountResponse(currency: DonationCurrency) {
  return {
    success: false,
    error: 'Amount below minimum',
    message: `${getDonationMinimumMessage(currency)} You can also use the Afribit crowdfund if you would rather give outside the direct checkout flow.`,
    currency,
    minimumAmount: getDonationMinimumLabel(currency),
    crowdfundUrl: CROWDFUND_URL,
  }
}

export async function POST(request: NextRequest) {
  let requestBody: unknown = null

  try {
    if (!process.env.BTCPAY_API_KEY || !process.env.BTCPAY_STORE_ID || !process.env.BTCPAY_HOST) {
      return NextResponse.json(
        {
          success: false,
          error: 'Donation service unavailable',
          message: 'Afribit donation checkout is temporarily unavailable. Please try again shortly.',
        },
        { status: 503 }
      );
    }

    // Parse and validate request body
    requestBody = await request.json();
    const validatedData = donationSchema.parse(requestBody);

    const {
      amount,
      currency,
      donorName,
      donorEmail,
      program,
      message,
      isAnonymous,
    } = validatedData;

    const normalizedAmount = normalizeDonationAmount(amount, currency)

    if (isBelowDonationMinimum(normalizedAmount, currency)) {
      return NextResponse.json(buildMinimumAmountResponse(currency), { status: 422 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin || 'https://afribit.africa';

    let programRecord = null;

    // Verify program exists if program slug is provided
    if (program) {
      programRecord = await prisma.program.findUnique({
        where: { slug: program },
      });

      if (!programRecord) {
        return NextResponse.json(
          { success: false, error: 'Program not found' },
          { status: 404 }
        );
      }
    }

    // Create BTCPay invoice
    const invoiceData = await createInvoice({
      amount: normalizedAmount,
      currency,
      redirectUrl: `${siteUrl}/donate/success`,
      metadata: {
        donorName: isAnonymous ? 'Anonymous' : donorName || 'Anonymous',
        donorEmail: donorEmail || '',
        program: program || '',
        message: message || '',
        isAnonymous: isAnonymous,
        itemDesc: programRecord
          ? `Donation to ${programRecord.name}`
          : 'General Donation to Afribit',
      },
      buyerEmail: isAnonymous ? undefined : donorEmail,
    });

    if (!invoiceData) {
      throw new Error('Failed to create BTCPay invoice');
    }

    // Save donation record to database
    const donation = await prisma.donation.create({
      data: {
        amount: normalizedAmount.toString(),
        currency,
        btcAmount: currency === 'BTC' ? normalizedAmount.toString() : null,
        donorName: isAnonymous ? 'Anonymous' : donorName || 'Anonymous',
        donorEmail: isAnonymous ? null : donorEmail || null,
        program: program || null,
        programId: programRecord?.id || null,
        message: message || null,
        status: 'PENDING',
        btcpayInvoiceId: invoiceData.id,
      },
    });

    // Return success response with checkout link
    return NextResponse.json({
      success: true,
      data: {
        donationId: donation.id,
        invoiceId: invoiceData.id,
        checkoutLink: invoiceData.checkoutLink,
        amount,
        currency,
      },
    });
  } catch (error) {
    console.error('Error creating donation invoice:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    const errorMessage = extractDonationErrorMessage(error)
    const normalizedErrorMessage = errorMessage.toLowerCase()
    const requestedCurrency = typeof (requestBody as { currency?: unknown } | null)?.currency === 'string' && DONATION_CURRENCIES.includes((requestBody as { currency: DonationCurrency }).currency)
      ? (requestBody as { currency: DonationCurrency }).currency
      : 'USD'
    const isBelowMinimum =
      normalizedErrorMessage.includes('below accepted value') ||
      normalizedErrorMessage.includes('below minimum') ||
      normalizedErrorMessage.includes('minimum')
    const isPaymentMethodError =
      normalizedErrorMessage.includes('payment method') ||
      normalizedErrorMessage.includes('matching payment method') ||
      normalizedErrorMessage.includes('rate')

    if (isBelowMinimum) {
      return NextResponse.json(buildMinimumAmountResponse(requestedCurrency), { status: 422 })
    }

    if (isPaymentMethodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment method unavailable',
          message:
            'We could not match that donation amount to an available Bitcoin checkout method just now. Please try a slightly larger amount, switch currency, or use the Afribit crowdfund.',
          currency: requestedCurrency,
          crowdfundUrl: CROWDFUND_URL,
        },
        { status: 422 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create donation invoice',
        message: 'Unable to start the Afribit donation checkout right now. Please try again or use the crowdfund link.',
        details: errorMessage,
        crowdfundUrl: CROWDFUND_URL,
      },
      { status: 500 }
    );
  }
}
