# Testing Plan for BTCPay Donation System

## Environment Configuration

### BTCPay Server (Already Set in Vercel)
```
BTCPAY_HOST=https://pay.afribit.africa
BTCPAY_STORE_ID=DSVtab28GMx3qYVw4FkkZr1vzjEZ6fFmhgc6SQNtYcxg
BTCPAY_API_KEY=852c4c7e2b03b90bdb88a1fdd2711a7ff9904929
```

### Blink Fallback (Optional - already hardcoded as fallback)
```
BLINK_DONATION_USERNAME=afribit
```
Note: If not set, system will automatically use 'afribit' as fallback (afribit@blink.sv)

## Testing Steps

### 1. Verify Configuration
After deployment, visit:
```
https://afribit.africa/api/config/check
```

**Expected Response:**
```json
{
  "success": true,
  "status": {
    "btcpayReady": true,
    "blinkReady": true,
    "anyPaymentReady": true,
    "primaryProvider": "btcpay"
  },
  "config": {
    "btcpay": {
      "host": "https://pay.afribit.africa",
      "hasHost": true,
      "hasStoreId": true,
      "hasApiKey": true,
      "storeIdLength": 44,
      "apiKeyLength": 40
    },
    "blink": {
      "hasUsername": false,
      "username": "afr..."
    }
  },
  "message": "BTCPay Server is configured"
}
```

### 2. Test Donation Flow

#### Test Case 1: BTCPay Invoice Creation
1. Go to https://afribit.africa/donate
2. Select a donation tier (e.g., "Friend of Afribit Kibera" - $25)
3. Choose donation type (anonymous or named)
4. Click "Continue to Payment"

**Expected Result:**
- Invoice should be created successfully
- Should see QR code for Lightning payment
- Should see checkout link for BTCPay
- Console should log: "Attempting to create invoice with BTCPay Server"

#### Test Case 2: Custom Donation Amount
1. Go to donate page
2. Select "Custom Contribution"
3. Enter amount (e.g., $10)
4. Continue to payment

**Expected Result:**
- Custom amount invoice created
- Payment options displayed

#### Test Case 3: Verify Fallback (Force BTCPay Failure)
If BTCPay fails for any reason, system should automatically use Blink.

**To test manually:**
1. Temporarily set wrong BTCPAY_API_KEY in Vercel
2. Try to create donation
3. Check logs - should show: "BTCPay invoice creation failed, falling back to Blink"
4. Should still create Lightning invoice successfully
5. Restore correct API key

### 3. Test BTCPay API Directly

```bash
# Test 1: Get store info
curl -H "Authorization: token 852c4c7e2b03b90bdb88a1fdd2711a7ff9904929" \
  https://pay.afribit.africa/api/v1/stores/DSVtab28GMx3qYVw4FkkZr1vzjEZ6fFmhgc6SQNtYcxg

# Test 2: List recent invoices
curl -H "Authorization: token 852c4c7e2b03b90bdb88a1fdd2711a7ff9904929" \
  https://pay.afribit.africa/api/v1/stores/DSVtab28GMx3qYVw4FkkZr1vzjEZ6fFmhgc6SQNtYcxg/invoices?take=5

# Test 3: Create test invoice
curl -X POST \
  -H "Authorization: token 852c4c7e2b03b90bdb88a1fdd2711a7ff9904929" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "1.00",
    "currency": "USD",
    "checkout": {
      "speedPolicy": "HighSpeed",
      "paymentMethods": ["BTC-OnChain", "BTC-LightningNetwork"]
    },
    "metadata": {
      "orderId": "test-api",
      "source": "manual-test"
    }
  }' \
  https://pay.afribit.africa/api/v1/stores/DSVtab28GMx3qYVw4FkkZr1vzjEZ6fFmhgc6SQNtYcxg/invoices
```

### 4. Test Blink Fallback

```bash
# Test Blink API directly
curl -X POST https://api.blink.sv/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query accountDefaultWallet($username: Username!, $walletCurrency: WalletCurrency!) { accountDefaultWallet(username: $username, walletCurrency: $walletCurrency) { id walletCurrency } }",
    "variables": {
      "username": "afribit",
      "walletCurrency": "BTC"
    }
  }'
```

**Expected Result:**
Should return wallet ID for afribit@blink.sv

### 5. Monitor Logs

After deployment, check Vercel logs for:
- "Attempting to create invoice with BTCPay Server"
- "BTCPay invoice created successfully"
- Or if fallback: "BTCPay invoice creation failed, falling back to Blink"
- "Blink invoice created successfully"

## Success Criteria

✅ Configuration endpoint shows BTCPay is ready
✅ Donation page loads without errors
✅ Can create donation with BTCPay
✅ QR code displays for Lightning payment
✅ Can create donation with custom amount
✅ Fallback to Blink works if BTCPay fails
✅ No console errors on frontend
✅ Proper logging in Vercel

## Troubleshooting

### Issue: 404 Error
- Check environment variables are set in Vercel
- Verify Store ID is correct (44 characters)
- Verify API key is correct (40 characters)

### Issue: Unauthorized
- API key might be expired or wrong
- Create new API key with correct permissions

### Issue: Blink Fallback Not Working
- Check that 'afribit' username exists on Blink
- Verify Blink API is accessible

## Rollback Plan

If issues occur:
1. Set `BLINK_DONATION_USERNAME=afribit` in Vercel
2. This ensures donations work via Lightning Network
3. Debug BTCPay configuration separately
