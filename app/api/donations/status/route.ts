import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceStatus } from '@/lib/btcpay-client';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    const invoice = await getInvoiceStatus(invoiceId);

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to check payment status';
    logger.error('Error checking invoice status:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
