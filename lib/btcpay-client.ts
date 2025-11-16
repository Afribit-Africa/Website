/**
 * BTCPay Server API Client Configuration
 * Handles all interactions with BTCPay Server Greenfield API
 */

import { logger } from './logger';

// Get environment variables - these are only available on server side
function getEnvVar(key: string, defaultValue: string = ''): string {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
}

// Helper to get BTCPay config at runtime
function getBTCPayConfig() {
  return {
    host: process.env.BTCPAY_HOST || 'https://pay.afribit.africa',
    storeId: process.env.BTCPAY_STORE_ID || '',
    apiKey: process.env.BTCPAY_API_KEY || '',
  };
}

export interface CreateInvoiceParams {
  amount: number;
  currency?: string;
  orderId?: string;
  buyerEmail?: string;
  metadata?: Record<string, any>;
}

export interface InvoiceData {
  id: string;
  checkoutLink: string;
  status: string;
  amount: string;
  currency: string;
  createdTime: number;
  expirationTime: number;
  lightningAddress?: string;
  onchainAddress?: string;
}

/**
 * Create a new BTCPay invoice
 */
export async function createInvoice(params: CreateInvoiceParams): Promise<InvoiceData> {
  const { amount, currency = 'USD', orderId, buyerEmail, metadata } = params;

  const { host, storeId, apiKey } = getBTCPayConfig();

  logger.debug('BTCPay Config Check:', {
    hasHost: !!host,
    hasStoreId: !!storeId,
    hasApiKey: !!apiKey,
    host,
    storeId: storeId ? `${storeId.substring(0, 10)}...` : 'MISSING',
  });

  if (!host || !storeId || !apiKey) {
    const error = new Error('BTCPay Server configuration is missing. Please check environment variables.');
    logger.error('BTCPay configuration error');
    throw error;
  }

  logger.info('Creating invoice with BTCPay Server:', { amount, currency });

  const url = `${host}/api/v1/stores/${storeId}/invoices`;
  logger.debug('BTCPay API URL:', url);

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${apiKey}`,
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency,
        checkout: {
          speedPolicy: 'HighSpeed',
          paymentMethods: ['BTC-OnChain', 'BTC-LightningNetwork'],
          redirectURL: `${getEnvVar('NEXT_PUBLIC_SITE_URL', 'https://afribit.africa')}/donate/success`,
        },
        metadata: {
          orderId: orderId || `donation-${Date.now()}`,
          buyerEmail,
          ...metadata,
        },
      }),
    });
  } catch (fetchError: any) {
    logger.error('BTCPay fetch error:', {
      message: fetchError.message,
      cause: fetchError.cause,
      type: fetchError.constructor.name,
    });
    throw new Error(`Network error connecting to BTCPay Server: ${fetchError.message}`);
  }

  logger.debug('BTCPay response status:', response.status);

  if (!response.ok) {
    const error = await response.text();
    logger.error('BTCPay API error response:', error);
    throw new Error(`BTCPay API Error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  logger.info('BTCPay invoice created successfully:', data.id);

  return {
    id: data.id,
    checkoutLink: data.checkoutLink,
    status: data.status,
    amount: data.amount,
    currency: data.currency,
    createdTime: data.createdTime,
    expirationTime: data.expirationTime,
  };
}

/**
 * Get invoice status
 */
export async function getInvoiceStatus(invoiceId: string): Promise<InvoiceData> {
  const { host, storeId, apiKey } = getBTCPayConfig();

  const response = await fetch(`${host}/api/v1/stores/${storeId}/invoices/${invoiceId}`, {
    headers: {
      'Authorization': `token ${apiKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`BTCPay API Error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  return {
    id: data.id,
    checkoutLink: data.checkoutLink,
    status: data.status,
    amount: data.amount,
    currency: data.currency,
    createdTime: data.createdTime,
    expirationTime: data.expirationTime,
  };
}

/**
 * Get payment methods (Lightning/On-chain addresses) for an invoice
 */
export async function getInvoicePaymentMethods(invoiceId: string) {
  const { host, storeId, apiKey } = getBTCPayConfig();

  const response = await fetch(`${host}/api/v1/stores/${storeId}/invoices/${invoiceId}/payment-methods`, {
    headers: {
      'Authorization': `token ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch payment methods');
  }

  return response.json();
}

/**
 * Get all settled invoices (for donor tracking)
 */
export async function getSettledInvoices(limit: number = 100) {
  try {
    const { host, storeId, apiKey } = getBTCPayConfig();

    const response = await fetch(`${host}/api/v1/stores/${storeId}/invoices?status=settled&take=${limit}`, {
      headers: {
        'Authorization': `token ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invoices from BTCPay Server');
    }

    const invoices = await response.json();
    logger.info(`Fetched ${invoices.length} settled invoices`);
    return invoices;
  } catch (error) {
    logger.error('Error fetching settled invoices:', error);
    return [];
  }
}

/**
 * Get crowdfund statistics (approximate using invoice data)
 */
export async function getCrowdfundStats() {
  try {
    const { host, storeId, apiKey } = getBTCPayConfig();

    // Note: This is a simplified version. For accurate stats, you'd need to:
    // 1. Track invoices in your database
    // 2. Use BTCPay's reporting features
    // 3. Or fetch from the crowdfund app directly

    const response = await fetch(`${host}/api/v1/stores/${storeId}/invoices?status=settled&take=100`, {
      headers: {
        'Authorization': `token ${apiKey}`,
      },
    });

    if (!response.ok) {
      logger.warn('Failed to fetch crowdfund stats, using fallback values');
      return {
        totalRaised: 2149.45, // Fallback to known value
        goal: 100000,
        contributors: 54,
        percentageComplete: 2.15,
      };
    }

    const invoices = await response.json();
    const totalRaised = invoices.reduce((sum: number, inv: any) => {
      return sum + parseFloat(inv.amount || '0');
    }, 0);

    return {
      totalRaised,
      goal: 100000,
      contributors: invoices.length,
      percentageComplete: (totalRaised / 100000) * 100,
    };
  } catch (error) {
    logger.error('Error fetching crowdfund stats:', error);
    return {
      totalRaised: 2149.45,
      goal: 100000,
      contributors: 54,
      percentageComplete: 2.15,
    };
  }
}

export const btcpayClient = {
  createInvoice,
  getInvoiceStatus,
  getInvoicePaymentMethods,
  getCrowdfundStats,
  getSettledInvoices,
};
