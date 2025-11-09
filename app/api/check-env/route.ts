import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const envVars = {
    SMTP_HOST: process.env.SMTP_HOST || 'NOT SET',
    SMTP_PORT: process.env.SMTP_PORT || 'NOT SET',
    SMTP_SECURE: process.env.SMTP_SECURE || 'NOT SET',
    SMTP_USER: process.env.SMTP_USER || 'NOT SET',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD ? '***SET***' : 'NOT SET',
    EMAIL_FROM: process.env.EMAIL_FROM || 'NOT SET',
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'NOT SET',
  };

  return NextResponse.json({
    success: true,
    environment: envVars,
    note: 'Check if all variables are set correctly'
  });
}
