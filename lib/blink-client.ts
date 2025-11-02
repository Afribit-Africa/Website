/**
 * Blink API Client for creating Lightning invoices
 * Documentation: https://dev.blink.sv/
 * GraphQL Endpoint: https://api.blink.sv/graphql
 */

interface BlinkInvoiceResponse {
  data?: {
    lnNoAmountInvoiceCreateOnBehalfOfRecipient?: {
      invoice?: {
        paymentRequest: string;
        paymentHash: string;
        paymentSecret: string;
      };
      errors: Array<{
        message: string;
      }>;
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

interface BlinkWalletResponse {
  data?: {
    accountDefaultWallet?: {
      id: string;
      walletCurrency: string;
    };
    errors?: Array<{
      message: string;
    }>;
  };
  errors?: Array<{
    message: string;
  }>;
}

export interface BlinkInvoice {
  paymentRequest: string;
  paymentHash: string;
  paymentSecret: string;
}

const BLINK_API_ENDPOINT = 'https://api.blink.sv/graphql';

/**
 * Get wallet ID for a Blink username
 * Uses accountDefaultWallet query to resolve username to wallet ID
 */
export async function getBlinkWalletId(username: string): Promise<string | null> {
  const query = `
    query accountDefaultWallet($username: Username!, $walletCurrency: WalletCurrency!) {
      accountDefaultWallet(username: $username, walletCurrency: $walletCurrency) {
        id
        walletCurrency
      }
    }
  `;

  try {
    const response = await fetch(BLINK_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          username,
          walletCurrency: 'BTC' // Default to BTC wallet
        }
      }),
      cache: 'no-store'
    });

    const data: BlinkWalletResponse = await response.json();

    if (data.errors && data.errors.length > 0) {
      console.error('Blink API error:', data.errors);
      return null;
    }

    return data.data?.accountDefaultWallet?.id || null;
  } catch (error) {
    console.error('Error fetching Blink wallet ID:', error);
    return null;
  }
}

/**
 * Create a no-amount invoice on behalf of a merchant
 * This allows donors to specify the amount when paying
 * Uses lnNoAmountInvoiceCreateOnBehalfOfRecipient mutation
 * 
 * @param blinkUsername - The merchant's Blink username (e.g., "muanzompya" from muanzompya@blink.sv)
 * @param memo - Optional memo for the invoice
 * @returns Invoice data or null on error
 */
export async function createMerchantInvoice(
  blinkUsername: string,
  memo?: string
): Promise<BlinkInvoice | null> {
  // First, get the wallet ID from the username
  const walletId = await getBlinkWalletId(blinkUsername);
  
  if (!walletId) {
    console.error('Could not resolve Blink username to wallet ID');
    return null;
  }

  const mutation = `
    mutation lnNoAmountInvoiceCreateOnBehalfOfRecipient($input: LnNoAmountInvoiceCreateOnBehalfOfRecipientInput!) {
      lnNoAmountInvoiceCreateOnBehalfOfRecipient(input: $input) {
        invoice {
          paymentRequest
          paymentHash
          paymentSecret
        }
        errors {
          message
        }
      }
    }
  `;

  try {
    const response = await fetch(BLINK_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            recipientWalletId: walletId,
            memo: memo || 'Donation via Afribit',
            expiresIn: 1440 // 24 hours
          }
        }
      }),
      cache: 'no-store'
    });

    const data: BlinkInvoiceResponse = await response.json();

    if (data.errors && data.errors.length > 0) {
      console.error('Blink API errors:', data.errors);
      return null;
    }

    if (data.data?.lnNoAmountInvoiceCreateOnBehalfOfRecipient?.errors && 
        data.data.lnNoAmountInvoiceCreateOnBehalfOfRecipient.errors.length > 0) {
      console.error('Invoice creation errors:', data.data.lnNoAmountInvoiceCreateOnBehalfOfRecipient.errors);
      return null;
    }

    const invoice = data.data?.lnNoAmountInvoiceCreateOnBehalfOfRecipient?.invoice;
    
    if (!invoice) {
      console.error('No invoice returned from Blink API');
      return null;
    }

    return invoice;
  } catch (error) {
    console.error('Error creating merchant invoice:', error);
    return null;
  }
}

/**
 * Extract username from Blink address
 * @param blinkAddress - Full Blink address (e.g., "muanzompya@blink.sv")
 * @returns Username portion (e.g., "muanzompya")
 */
export function extractBlinkUsername(blinkAddress: string): string {
  return blinkAddress.split('@')[0];
}

/**
 * Generate deep links for various Lightning wallets
 * @param paymentRequest - Lightning invoice payment request
 * @returns Object with wallet-specific deep links
 */
export function generateWalletLinks(paymentRequest: string) {
  const encoded = encodeURIComponent(paymentRequest);
  
  return {
    blink: `https://blink.sv/pay?lightning=${encoded}`,
    phoenix: `phoenix://pay?lightning=${encoded}`,
    muun: `muun:${paymentRequest}`,
    bluewallet: `bluewallet:lightning:${paymentRequest}`,
    breez: `breez:lightning:${paymentRequest}`,
    zeus: `zeus:lightning:${paymentRequest}`,
    walletofsatoshi: `walletofsatoshi:lightning:${paymentRequest}`,
    cashapp: `https://cash.app/launch/lightning/${encoded}`,
    strike: `strike:lightning:${paymentRequest}`,
    generic: `lightning:${paymentRequest}`
  };
}
