# BTCPay Server Configuration Issue - Quick Fix Guide

## Problem Summary
The donation page shows "BTCPay API Error: 404" when trying to create invoices.

## Root Cause
The BTCPay server at **https://pay.afribit.africa/** is working correctly (IP: 170.75.168.13), but the environment variables for authentication are **NOT SET** or **INCORRECT** in your deployment environment (Vercel/Netlify/etc.).

## BTCPay Server Details
- **URL**: https://pay.afribit.africa/
- **External IP**: 170.75.168.13
- **IPv6**: 2602:ffb6:4:4f52:f816:3eff:fe17:d54f
- **Status**: ✅ Server is operational

## Quick Fix

### Configure BTCPay Server Environment Variables

You need to set these environment variables in your deployment platform:

**For Vercel:**
1. Go to https://vercel.com/your-project/settings/environment-variables
2. Add these variables:
   ```
   BTCPAY_HOST=https://pay.afribit.africa
   BTCPAY_STORE_ID=your-actual-store-id-here
   BTCPAY_API_KEY=your-actual-api-key-here
   ```
3. Redeploy the application

**For Netlify:**
1. Go to Site settings → Environment variables
2. Add the same three variables
3. Trigger a new deploy

**For Railway/Render/Other platforms:**
1. Go to environment variables section
2. Add the three variables above
3. Redeploy


### How to Get BTCPay Server Credentials

1. **Log in to BTCPay Server**: Go to https://pay.afribit.africa/ and log in with your admin credentials

2. **Select Your Store**: 
   - From the top navigation, select your store
   - Note the Store ID from the URL (e.g., `/stores/{STORE_ID}/`)

3. **Create API Key**:
   - Go to Store Settings → Access Tokens
   - Click "Create a new token"
   - Give it a label (e.g., "Website Donations")
   - Select these permissions:
     - `btcpay.store.canviewinvoices`
     - `btcpay.store.cancreateinvoice`
     - `btcpay.store.canmodifyinvoices` (optional)
   - Click "Request authorization"
   - Copy the API key (it's shown only once!)

4. **Set Environment Variables**:
   ```bash
   BTCPAY_HOST=https://pay.afribit.africa
   BTCPAY_STORE_ID=<your-store-id-from-step-2>
   BTCPAY_API_KEY=<your-api-key-from-step-3>
   ```

### Temporary Fallback: Use Blink

The system will automatically fall back to Blink Lightning Network (afribit@blink.sv) if BTCPay fails. 

To explicitly set the Blink username as an environment variable:

```bash
BLINK_DONATION_USERNAME=afribit
```

**Note**: If this variable is not set, the system will automatically use 'afribit' (afribit@blink.sv) as the fallback.

This ensures donations always work via Lightning Network even if BTCPay has issues.

## Testing the Fix

### Test BTCPay Server Is Accessible
```bash
curl -I https://pay.afribit.africa/
```

Should return HTTP 200 with BTCPay Server headers.

### Test API Authentication (Once you have credentials)
```bash
curl -H "Authorization: token YOUR_API_KEY" \
  https://pay.afribit.africa/api/v1/stores/YOUR_STORE_ID/invoices
```

Should return a JSON array of invoices (or empty array `[]` if no invoices exist).

**Expected response**: `[]` or `[{invoice objects}]`
**Error response**: `401 Unauthorized` (wrong API key) or `404 Not Found` (wrong Store ID)

### Verify Environment Variables in Production

**Use the diagnostic endpoint:**

Visit `/api/config/check` on your deployed site to see the current configuration status:
```
https://your-site.com/api/config/check
```

This will show you:
- Which environment variables are set (without revealing actual values)
- Whether BTCPay is properly configured
- Whether Blink is configured
- Recommendations for fixing configuration issues

**Example response:**
```json
{
  "success": true,
  "status": {
    "btcpayReady": false,
    "blinkReady": true,
    "anyPaymentReady": true,
    "primaryProvider": "blink"
  },
  "config": {
    "btcpay": {
      "host": "https://pay.afribit.africa",
      "hasHost": true,
      "hasStoreId": false,
      "hasApiKey": false,
      "storeIdLength": 0,
      "apiKeyLength": 0
    },
    "blink": {
      "hasUsername": true,
      "username": "mua..."
    }
  },
  "message": "Blink is configured (BTCPay not set)",
  "recommendations": [
    "Set BTCPAY_STORE_ID environment variable (get from BTCPay dashboard)",
    "Set BTCPAY_API_KEY environment variable (create in BTCPay Store Settings)"
  ]
}
```

## Current Status

✅ **BTCPay Server is operational** at https://pay.afribit.africa/
✅ **Code is fixed** - Added fallback mechanism  
❌ **Environment variables missing/incorrect** - Need to be set in production
✅ **DNS is working** - Server is accessible at pay.afribit.africa

## Common Issues

### "BTCPay API Error: 404"
- **Cause**: Wrong `BTCPAY_STORE_ID` or missing API endpoint
- **Fix**: Verify the Store ID is correct from your BTCPay dashboard

### "BTCPay API Error: 401"  
- **Cause**: Wrong or expired `BTCPAY_API_KEY`
- **Fix**: Create a new API key with correct permissions

### "BTCPay Server configuration is missing"
- **Cause**: Environment variables not set at all
- **Fix**: Set all three variables (HOST, STORE_ID, API_KEY) in your deployment platform

### Donations still not working after setting variables
- **Cause**: Changes not deployed, or environment variables not loaded
- **Fix**: Trigger a new deployment and verify variables are loaded

## Next Steps

1. **Immediate**: Set `BLINK_DONATION_USERNAME` for temporary donations
2. **Permanent**: Configure BTCPay Server environment variables
3. **Optional**: Set up `pay.afribit.africa` DNS if that's your BTCPay instance

## Files Changed

- `lib/payment-client.ts` - New unified payment system with fallback
- `app/api/donations/create/route.ts` - Uses new payment client
- `app/donate/page.tsx` - Handles both BTCPay and Blink invoices

These changes are **backward compatible** and will use BTCPay when properly configured, with automatic fallback to Blink.
