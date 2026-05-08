import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createInvoice } from '@/lib/btcpay';
import { prisma } from '@/lib/prisma';

// Validation schema for donation request
const donationSchema = z.object({
  amount: z.number().positive().min(1, 'Minimum donation is $1'),
  currency: z.enum(['USD', 'BTC']).default('USD'),
  donorName: z.string().min(2, 'Name must be at least 2 characters').optional(),
  donorEmail: z.string().email('Invalid email address').optional(),
  program: z.string().optional(), // Program slug or identifier
  message: z.string().max(500, 'Message too long').optional(),
  isAnonymous: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const validatedData = donationSchema.parse(body);

    const {
      amount,
      currency,
      donorName,
      donorEmail,
      program,
      message,
      isAnonymous,
    } = validatedData;

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
      amount,
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
        amount: amount.toString(),
        currency,
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
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create donation invoice',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
