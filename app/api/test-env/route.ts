import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env_check: {
      BTCPAY_HOST: process.env.BTCPAY_HOST || 'NOT_SET',
      BTCPAY_STORE_ID: process.env.BTCPAY_STORE_ID ? 'SET (length: ' + process.env.BTCPAY_STORE_ID.length + ')' : 'NOT_SET',
      BTCPAY_API_KEY: process.env.BTCPAY_API_KEY ? 'SET (length: ' + process.env.BTCPAY_API_KEY.length + ')' : 'NOT_SET',
      NODE_ENV: process.env.NODE_ENV,
      all_env_keys: Object.keys(process.env).filter(key => key.includes('BTCPAY')),
    }
  });
}
