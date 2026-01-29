import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Diagnostic endpoint to check BTCPay and Blink configuration
 * Only shows if variables are set, not the actual values (security)
 */
export async function GET(request: NextRequest) {
  try {
    const config = {
      btcpay: {
        host: process.env.BTCPAY_HOST || '(not set)',
        hasHost: !!process.env.BTCPAY_HOST,
        hasStoreId: !!process.env.BTCPAY_STORE_ID,
        hasApiKey: !!process.env.BTCPAY_API_KEY,
        storeIdLength: process.env.BTCPAY_STORE_ID?.length || 0,
        apiKeyLength: process.env.BTCPAY_API_KEY?.length || 0,
      },
      blink: {
        hasUsername: !!process.env.BLINK_DONATION_USERNAME,
        username: process.env.BLINK_DONATION_USERNAME ? 
          `${process.env.BLINK_DONATION_USERNAME.substring(0, 3)}...` : 
          '(not set)',
      },
      nodeEnv: process.env.NODE_ENV,
    };

    // Check if BTCPay is fully configured
    const btcpayConfigured = config.btcpay.hasHost && 
                            config.btcpay.hasStoreId && 
                            config.btcpay.hasApiKey;

    // Check if Blink is configured
    const blinkConfigured = config.blink.hasUsername;

    const status = {
      btcpayReady: btcpayConfigured,
      blinkReady: blinkConfigured,
      anyPaymentReady: btcpayConfigured || blinkConfigured,
      primaryProvider: btcpayConfigured ? 'btcpay' : (blinkConfigured ? 'blink' : 'none'),
    };

    logger.info('Payment configuration check', { status, config });

    return NextResponse.json({
      success: true,
      status,
      config,
      message: btcpayConfigured ? 
        'BTCPay Server is configured' : 
        (blinkConfigured ? 
          'Blink is configured (BTCPay not set)' : 
          'No payment provider configured'),
      recommendations: getRecommendations(config),
    });
  } catch (error) {
    logger.error('Error checking payment configuration:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check configuration',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function getRecommendations(config: any): string[] {
  const recommendations: string[] = [];

  if (!config.btcpay.hasHost) {
    recommendations.push('Set BTCPAY_HOST environment variable (e.g., https://pay.afribit.africa)');
  }
  
  if (!config.btcpay.hasStoreId) {
    recommendations.push('Set BTCPAY_STORE_ID environment variable (get from BTCPay dashboard)');
  }
  
  if (!config.btcpay.hasApiKey) {
    recommendations.push('Set BTCPAY_API_KEY environment variable (create in BTCPay Store Settings)');
  }

  if (config.btcpay.storeIdLength > 0 && config.btcpay.storeIdLength < 10) {
    recommendations.push('BTCPAY_STORE_ID looks too short, verify it is correct');
  }

  if (config.btcpay.apiKeyLength > 0 && config.btcpay.apiKeyLength < 20) {
    recommendations.push('BTCPAY_API_KEY looks too short, verify it is correct');
  }

  if (!config.blink.hasUsername) {
    recommendations.push('Consider setting BLINK_DONATION_USERNAME as a fallback payment option');
  }

  if (recommendations.length === 0) {
    recommendations.push('Configuration looks good! All required variables are set.');
  }

  return recommendations;
}
