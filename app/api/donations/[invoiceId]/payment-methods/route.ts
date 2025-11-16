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
  } catch (error: any) {
    logger.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}
