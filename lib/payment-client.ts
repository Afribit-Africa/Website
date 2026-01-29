/**
 * Unified payment client that handles both BTCPay and Blink
 * Provides fallback mechanism when BTCPay is not configured
 */

import { logger } from './logger';
import { createInvoice as createBTCPayInvoice, InvoiceData, CreateInvoiceParams } from './btcpay-client';
import { createMerchantInvoice, BlinkInvoice } from './blink-client';

export interface UnifiedInvoiceData {
  id: string;
  checkoutLink?: string;
  paymentRequest?: string;
  status: string;
  amount: string;
  currency: string;
  provider: 'btcpay' | 'blink';
}

/**
 * Check if BTCPay is properly configured
 */
function isBTCPayConfigured(): boolean {
  const host = process.env.BTCPAY_HOST;
  const storeId = process.env.BTCPAY_STORE_ID;
  const apiKey = process.env.BTCPAY_API_KEY;
  
  return !!(host && storeId && apiKey);
}

/**
 * Get Blink donation username from environment
 * Falls back to Afribit's official Blink address if not configured
 */
function getBlinkDonationUsername(): string | null {
  // Try environment variable first
  const envUsername = process.env.BLINK_DONATION_USERNAME;
  if (envUsername) {
    return envUsername;
  }
  
  // Fallback to Afribit's official Blink address: afribit@blink.sv
  const fallbackUsername = 'afribit';
  logger.info('Using Afribit official Blink address: afribit@blink.sv');
  
  return fallbackUsername;
}

/**
 * Create a donation invoice using the best available provider
 * Falls back to Blink if BTCPay is not configured
 */
export async function createDonationInvoice(params: CreateInvoiceParams): Promise<UnifiedInvoiceData> {
  const { amount, currency = 'USD', orderId, buyerEmail, metadata } = params;

  // Try BTCPay first if configured
  if (isBTCPayConfigured()) {
    try {
      logger.info('Attempting to create invoice with BTCPay Server');
      const btcpayInvoice = await createBTCPayInvoice(params);
      
      return {
        id: btcpayInvoice.id,
        checkoutLink: btcpayInvoice.checkoutLink,
        status: btcpayInvoice.status,
        amount: btcpayInvoice.amount,
        currency: btcpayInvoice.currency,
        provider: 'btcpay',
      };
    } catch (error) {
      logger.warn('BTCPay invoice creation failed, falling back to Blink', error);
      // Continue to Blink fallback
    }
  } else {
    logger.info('BTCPay not configured, using Blink payment provider');
  }

  // Fallback to Blink
  const blinkUsername = getBlinkDonationUsername();
  
  if (!blinkUsername) {
    throw new Error(
      'Payment system is temporarily unavailable. Please try again later or contact us directly. ' +
      '(Neither BTCPay nor Blink is properly configured)'
    );
  }

  logger.info('Creating invoice with Blink Lightning Network', { username: blinkUsername });
  
  const memo = `Donation: $${amount} USD${metadata?.tier ? ` - ${metadata.tier}` : ''}${
    metadata?.donorName ? ` from ${metadata.donorName}` : ''
  }`;

  try {
    const blinkInvoice = await createMerchantInvoice(blinkUsername, memo);

    if (!blinkInvoice) {
      throw new Error('Failed to create Blink invoice');
    }

    logger.info('Blink invoice created successfully', { paymentHash: blinkInvoice.paymentHash });

    return {
      id: blinkInvoice.paymentHash,
      paymentRequest: blinkInvoice.paymentRequest,
      status: 'New',
      amount: amount.toString(),
      currency: currency,
      provider: 'blink',
    };
  } catch (error) {
    logger.error('Failed to create Blink invoice', error);
    throw new Error(
      'Failed to create payment invoice. Please try again later or contact support.'
    );
  }
}

/**
 * Check which payment providers are available
 */
export function getAvailablePaymentProviders(): string[] {
  const providers: string[] = [];
  
  if (isBTCPayConfigured()) {
    providers.push('btcpay');
  }
  
  if (getBlinkDonationUsername()) {
    providers.push('blink');
  }
  
  return providers;
}
