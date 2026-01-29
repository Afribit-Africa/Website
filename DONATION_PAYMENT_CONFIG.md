# Donation Payment Configuration

This document explains how the donation payment system works and how to configure it.

## Overview

The donation system supports two payment providers:
1. **BTCPay Server** - Self-hosted Bitcoin payment processor (primary)
2. **Blink** - Lightning Network payment service (fallback)

The system automatically falls back to Blink if BTCPay is not configured or unavailable.

## Configuration

### BTCPay Server (Optional)

If you want to use BTCPay Server as your primary payment processor, set these environment variables:

```bash
BTCPAY_HOST=https://your-btcpay-instance.com
BTCPAY_STORE_ID=your-store-id
BTCPAY_API_KEY=your-api-key
```

**How to get these values:**

1. Log in to your BTCPay Server instance
2. Create a store or use an existing one
3. Go to Store Settings → Access Tokens
4. Create a new API key with these permissions:
   - `btcpay.store.canviewinvoices`
   - `btcpay.store.cancreateinvoice`
5. Copy the API key and store ID

### Blink (Fallback)

For Blink Lightning Network support, set:

```bash
BLINK_DONATION_USERNAME=your-blink-username
```

**Note:** The username should be the part before `@blink.sv`. For example, if your Blink address is `afribit@blink.sv`, use `afribit` as the username.

If neither BTCPay nor Blink is configured, the system will use a demo fallback address for testing purposes.

## How It Works

1. When a user initiates a donation:
   - The system first checks if BTCPay Server is configured
   - If configured, it attempts to create a BTCPay invoice
   - If BTCPay fails or is not configured, it falls back to Blink

2. For BTCPay invoices:
   - Creates a full invoice with on-chain and Lightning Network options
   - Provides a checkout link
   - Supports payment status polling

3. For Blink invoices:
   - Creates a Lightning Network invoice directly
   - Shows QR code for payment
   - Manual payment confirmation (auto-confirmation not yet implemented)

## Payment Flow

### BTCPay Flow
```
User selects tier → API creates BTCPay invoice → System fetches Lightning invoice
→ Shows QR code → Polls for payment status → Shows success
```

### Blink Flow
```
User selects tier → API creates Blink Lightning invoice → Shows QR code
→ Manual payment confirmation → Shows success
```

## Troubleshooting

### "Payment system is temporarily unavailable"
- Check that either `BTCPAY_*` or `BLINK_DONATION_USERNAME` is set
- Verify the BTCPay server URL is accessible
- Check that the Blink username is valid

### "BTCPay API Error: 404"
- Verify `BTCPAY_HOST` points to a valid BTCPay instance
- Check that `BTCPAY_STORE_ID` is correct
- Ensure `BTCPAY_API_KEY` has the necessary permissions
- The system will automatically fall back to Blink if BTCPay fails

### Blink payments not working
- Verify the Blink username exists (test at `https://blink.sv/username`)
- Check network connectivity to `api.blink.sv`

## Future Improvements

- [ ] Add webhook support for Blink payment confirmation
- [ ] Implement automatic payment status polling for Blink
- [ ] Add support for additional payment providers
- [ ] Improve error messages and user feedback
