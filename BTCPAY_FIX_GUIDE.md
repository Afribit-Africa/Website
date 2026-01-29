# BTCPay Server Configuration Issue - Quick Fix Guide

## Problem Summary
The donation page shows "BTCPay API Error: 404" because the BTCPay server is not accessible.

## Root Cause
The environment variables for BTCPay Server are **NOT SET** in your deployment environment (Vercel/Netlify/etc.).

## Quick Fix (Choose One)

### Option 1: Configure BTCPay Server (Recommended if you have one)

If you have a BTCPay Server instance, you need to set these environment variables in your deployment platform:

**For Vercel:**
1. Go to https://vercel.com/your-project/settings/environment-variables
2. Add these variables:
   ```
   BTCPAY_HOST=https://your-btcpay-instance.com
   BTCPAY_STORE_ID=your-store-id-here
   BTCPAY_API_KEY=your-api-key-here
   ```
3. Redeploy the application

**For Netlify:**
1. Go to Site settings → Environment variables
2. Add the same three variables
3. Trigger a new deploy

### Option 2: Set up BTCPay Server DNS

If `pay.afribit.africa` is supposed to be your BTCPay server:

1. Configure DNS A record for `pay.afribit.africa` pointing to your BTCPay server IP
2. Ensure your BTCPay server is running and accessible
3. Wait for DNS propagation (5-30 minutes)
4. Set the environment variables as in Option 1

### Option 3: Use Blink Fallback (Temporary Solution)

My code changes added automatic fallback to Blink Lightning Network. To use this:

1. Set this environment variable:
   ```
   BLINK_DONATION_USERNAME=your-blink-username
   ```
   (The part before @blink.sv, e.g., if your address is `afribit@blink.sv`, use `afribit`)

2. This will allow donations to work immediately via Lightning Network while you fix BTCPay

## Testing the Fix

### Test BTCPay Server Availability
```bash
curl -I https://your-btcpay-instance.com/api/v1/health
```

Should return HTTP 200 if the server is accessible.

### Test API Credentials
```bash
curl -H "Authorization: token YOUR_API_KEY" \
  https://your-btcpay-instance.com/api/v1/stores/YOUR_STORE_ID/invoices
```

Should return a list of invoices (or empty array []).

## Current Status

✅ **Code is fixed** - Added fallback mechanism
❌ **Environment not configured** - BTCPay variables missing
❌ **DNS not configured** - `pay.afribit.africa` doesn't resolve

## Next Steps

1. **Immediate**: Set `BLINK_DONATION_USERNAME` for temporary donations
2. **Permanent**: Configure BTCPay Server environment variables
3. **Optional**: Set up `pay.afribit.africa` DNS if that's your BTCPay instance

## Files Changed

- `lib/payment-client.ts` - New unified payment system with fallback
- `app/api/donations/create/route.ts` - Uses new payment client
- `app/donate/page.tsx` - Handles both BTCPay and Blink invoices

These changes are **backward compatible** and will use BTCPay when properly configured, with automatic fallback to Blink.
