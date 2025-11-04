import { NextRequest, NextResponse } from 'next/server';
import { getInvoicePaymentMethods } from '@/lib/btcpay-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await params;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Fetching payment methods for invoice:', invoiceId);
    }
    
    const paymentMethods = await getInvoicePaymentMethods(invoiceId);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Payment methods received:', JSON.stringify(paymentMethods, null, 2));
    }
    
    return NextResponse.json(paymentMethods);
  } catch (error: any) {
    // Always log errors, even in production
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}
