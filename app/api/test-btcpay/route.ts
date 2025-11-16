import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET() {
  const host = process.env.BTCPAY_HOST;
  const storeId = process.env.BTCPAY_STORE_ID;
  const apiKey = process.env.BTCPAY_API_KEY;

  logger.info('Testing BTCPay connection...');
  logger.info('Host:', host);
  logger.info('Store ID:', storeId);

  try {
    // Try to fetch store info (simpler endpoint)
    const url = `${host}/api/v1/stores/${storeId}`;
    logger.info('Testing URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    logger.info('Response status:', response.status);

    const data = await response.text();
    logger.info('Response body:', data.substring(0, 200));

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      canConnect: true,
      preview: data.substring(0, 200),
    });
  } catch (error: any) {
    logger.error('Connection test failed:', error);
    return NextResponse.json({
      success: false,
      canConnect: false,
      error: error.message,
      errorType: error.constructor.name,
      cause: error.cause,
    });
  }
}
