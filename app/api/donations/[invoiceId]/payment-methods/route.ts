import { NextRequest, NextResponse } from 'next/server';
import { getInvoicePaymentMethods } from '@/lib/btcpay-client';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await params;

    const paymentMethods = await getInvoicePaymentMethods(invoiceId);

    return NextResponse.json(paymentMethods);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch payment methods';
    logger.error('Error fetching payment methods:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
