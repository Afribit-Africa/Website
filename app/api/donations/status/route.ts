import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceStatus } from '@/lib/btcpay-client';

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
  } catch (error: any) {
    console.error('Error fetching invoice status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch invoice status' },
      { status: 500 }
    );
  }
}
