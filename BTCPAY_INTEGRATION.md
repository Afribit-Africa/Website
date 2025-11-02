# BTCPay Server Integration Possibilities for Afribit

## Current BTCPay Setup
- Existing donation crowdfund: `https://pay.afribit.africa/apps/2xYtsTMHMqYv6qozQ8j9zjP66FiR/crowdfund`
- BTCPay Server hosted at: `pay.afribit.africa`

## Integration Options to Improve UX

### 1. **Embedded Donation Widget** ⭐ RECOMMENDED
**What**: Embed donation form directly on the website
**Benefits**:
- Users donate without leaving the site
- Better conversion rates
- Customizable to match Afribit branding
- Real-time donation tracking

**Implementation**:
```typescript
// Component: components/DonationWidget.tsx
- Use BTCPay Server API to generate invoices
- Display QR code for Lightning/On-chain payments
- Show donation progress bar
- Display recent donations feed
```

**UX Improvements**:
- One-click donation amounts ($5, $10, $25, $50, Custom)
- Lightning Network support for instant payments
- Show impact per donation level
- Thank you animation/message on successful payment

---

### 2. **Payment Status Dashboard**
**What**: Real-time donation tracking and transparency
**Benefits**:
- Build trust with donors
- Show community impact
- Gamification of donations

**Features**:
- Total sats raised (live counter)
- Goal progress bars
- Recent donations (anonymous/named)
- Leaderboard (optional)
- Impact metrics (students educated, merchants onboarded, etc.)

---

### 3. **Merchant Directory with Payments**
**What**: Interactive map/directory of Bitcoin-accepting merchants
**Benefits**:
- Showcase circular economy
- Help visitors find merchants
- Merchants can accept payments directly

**Features**:
- Search merchants by category
- Click to pay merchant via BTCPay
- QR codes for each merchant
- Reviews/testimonials
- Location map integration

---

### 4. **Recurring Donations (Subscriptions)**
**What**: Monthly supporter program
**Benefits**:
- Predictable funding
- Build donor relationships
- Lower transaction fees

**Tiers**:
- **Satoshi Supporter** - 10,000 sats/month
- **Bitcoin Builder** - 50,000 sats/month  
- **Lightning Leader** - 100,000 sats/month
- **Hodl Hero** - 500,000 sats/month

**Perks**:
- Monthly impact reports via email
- Exclusive community updates
- Recognition on website
- Access to virtual town halls

---

### 5. **Point-of-Sale (POS) Demo**
**What**: Live demo of BTCPay POS for education
**Benefits**:
- Show how merchants use it
- Educational tool
- Proof of concept

**Features**:
- Interactive demo
- Try making a "payment"
- Step-by-step tutorial
- Video walkthrough

---

### 6. **Invoice Generator for Services**
**What**: Request funding for specific programs
**Benefits**:
- Transparency for donors
- Track program-specific donations
- Accountability

**Use Cases**:
- "Fund a Bitcoin Class" - 50,000 sats
- "Onboard 5 Merchants" - 200,000 sats
- "Waste Management Equipment" - 1,000,000 sats

---

### 7. **Lightning Address Integration**
**What**: Simple payment addresses for individuals
**Benefits**:
- Easy to share
- Human-readable addresses
- Instant Lightning payments

**Example**:
- `donate@afribit.africa`
- `merchants@afribit.africa`
- `education@afribit.africa`

---

### 8. **BTCPay API Integration Features**

#### Donation Flow:
```typescript
1. User clicks "Donate" button
2. Select amount (USD/Sats)
3. Generate BTCPay invoice via API
4. Display payment options:
   - Lightning (instant)
   - On-chain (10-60 min)
   - QR code
   - Copy address
5. Monitor payment status
6. Show success message
7. Send confirmation email
8. Update website stats in real-time
```

#### API Endpoints to Use:
- `POST /api/v1/stores/{storeId}/invoices` - Create invoice
- `GET /api/v1/invoices/{invoiceId}` - Check status
- `WebSocket` - Real-time payment notifications
- `GET /api/v1/stores/{storeId}/payment-requests` - List payments

---

## Recommended First Steps

### Phase 1: Embedded Donations (2-3 days)
1. Create `components/DonationModal.tsx`
2. Integrate BTCPay API
3. Add preset donation amounts
4. QR code display
5. Payment confirmation flow

### Phase 2: Live Stats Dashboard (1-2 days)
1. Fetch total donations via API
2. Display on homepage
3. Add progress bar for goals
4. Recent donations feed

### Phase 3: Merchant Directory (3-4 days)
1. Create merchant database
2. Display merchant cards
3. Add payment buttons
4. Location map

---

## Technical Requirements

### Environment Variables Needed:
```env
BTCPAY_SERVER_URL=https://pay.afribit.africa
BTCPAY_STORE_ID=your_store_id
BTCPAY_API_KEY=your_api_key
BTCPAY_WEBHOOK_SECRET=your_webhook_secret
```

### NPM Packages:
```bash
npm install @btcpayserver/btcpayserver-greenfield-api-client
```

### API Routes to Create:
- `/api/donations/create` - Generate invoice
- `/api/donations/status` - Check payment
- `/api/webhooks/btcpay` - Receive payment notifications
- `/api/stats/donations` - Get totals

---

## Security Considerations
- Store API keys in environment variables
- Validate webhook signatures
- Rate limit API calls
- Never expose private keys
- Use read-only API keys where possible

---

## Analytics & Tracking
- Google Analytics events for donations
- Track conversion rates
- A/B test donation amounts
- Monitor payment method preferences
- Track donor retention

---

Would you like me to start implementing any of these? I recommend starting with the **Embedded Donation Widget** as it will have the biggest immediate impact on UX and donations.
