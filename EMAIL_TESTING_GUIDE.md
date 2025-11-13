# Email System Testing Guide

## Overview
The application uses **Resend** as the email service provider with professionally designed HTML email templates.

## Email Configuration

### Sending Domain
- **Domain:** `updates.afribit.africa`
- **From Address:** `receipts@updates.afribit.africa`
- **From Name:** Afribit Africa

### Environment Variables Required
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

## Email Templates

### 1. Donation Receipt Email (`sendDonationReceipt`)

**Design Features:**
- ✅ Professional black background with Bitcoin orange (#F7931A) accents
- ✅ Responsive table-based HTML layout (works in all email clients)
- ✅ Clear visual hierarchy with gradient header
- ✅ Receipt details in bordered card format
- ✅ Tier-specific impact messaging
- ✅ Social media links (Twitter, Facebook, YouTube, Instagram)
- ✅ Professional footer with contact information
- ✅ Both HTML and plain text versions

**Content Sections:**
1. **Header**: Orange gradient with Afribit Africa branding
2. **Thank You Message**: Personalized greeting with impact statement
3. **Receipt Details**:
   - Donation amount (in USD)
   - Support tier
   - Date
   - Receipt ID
   - Transaction ID (if available)
4. **Your Impact**: Tier-specific message explaining how the donation helps
5. **What's Next**: Call-to-action with community engagement options
6. **Social Links**: All social media profiles
7. **Footer**: Contact information and copyright

**Tier Impact Messages:**
- **Supporter**: Basic Bitcoin education materials
- **Advocate**: Educational workshops and business onboarding
- **Champion**: Comprehensive programs and community transformation
- **Friend**: Daily operations and foundational growth
- **Business**: Local entrepreneurship and sustainable scaling
- **Education**: Community ambassador training
- **Custom**: Personalized message with donation amount

### 2. Welcome Email (`sendWelcomeEmail`)
- Additional template for welcoming new donors/subscribers
- Similar professional design
- Community onboarding focus

## Testing the Email System

### Method 1: Test Endpoint (Recommended)

**Endpoint:** `GET /api/test-email?email=YOUR_EMAIL`

**Example:**
```bash
curl "http://localhost:3000/api/test-email?email=test@example.com"
```

**Or visit in browser:**
```
http://localhost:3000/api/test-email?email=your.email@example.com
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Test receipt sent to your.email@example.com",
  "emailId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Method 2: Through Donation Flow

1. Go to `/donate` page
2. Complete donation process with your email
3. Receive receipt email automatically

### Method 3: API Test Call

```javascript
// Test sending to different email addresses
const testEmails = [
  'john@example.com',
  'jane@example.com',
  'support@company.com'
];

for (const email of testEmails) {
  const response = await fetch(`/api/test-email?email=${email}`);
  const result = await response.json();
  console.log(result);
}
```

## Verification Checklist

### Email Delivery
- [ ] Email arrives in inbox (not spam)
- [ ] Sender shows as "Afribit Africa <receipts@updates.afribit.africa>"
- [ ] Subject line is clear: "Thank You for Your Donation - Receipt #XXXXX"
- [ ] Email can be sent to Gmail, Outlook, Yahoo, and other providers

### Email Design
- [ ] Orange header displays correctly
- [ ] Logo and branding are visible
- [ ] Receipt details table is formatted properly
- [ ] All text is readable with good contrast
- [ ] Social media links work
- [ ] Contact links (mailto:) work
- [ ] Responsive on mobile email clients

### Email Content
- [ ] Donor name is personalized
- [ ] Amount displays with 2 decimal places
- [ ] Tier name is properly capitalized
- [ ] Date format is readable
- [ ] Receipt ID is unique and traceable
- [ ] Impact message matches the tier
- [ ] All links are functional

### Cross-Client Testing
Test in these email clients:
- [ ] Gmail (Web)
- [ ] Gmail (Mobile App)
- [ ] Outlook (Web)
- [ ] Outlook (Desktop)
- [ ] Apple Mail (iOS)
- [ ] Apple Mail (macOS)
- [ ] Yahoo Mail
- [ ] ProtonMail

## Common Issues & Solutions

### Issue: Emails going to spam
**Solutions:**
1. Ensure domain DNS records are properly configured (SPF, DKIM, DMARC)
2. Verify domain in Resend dashboard
3. Ask recipients to whitelist `updates.afribit.africa`
4. Check spam score using mail-tester.com

### Issue: API key not configured
**Error:** `Missing RESEND_API_KEY environment variable`

**Solution:**
```bash
# Add to .env.local
RESEND_API_KEY=re_your_api_key_here

# Or set in Vercel:
vercel env add RESEND_API_KEY
```

### Issue: "From" address not verified
**Error:** `Domain not verified`

**Solution:**
1. Log into Resend dashboard
2. Go to Domains section
3. Add `updates.afribit.africa`
4. Configure DNS records as shown
5. Wait for verification (can take 24-48 hours)

### Issue: Rate limiting
**Error:** `Too many requests`

**Solution:**
- Resend has generous limits (100 emails/day on free tier)
- Upgrade to paid plan for higher limits
- Implement email queuing for bulk sends

## Advanced Testing

### Load Testing
```javascript
// Test sending multiple emails
async function loadTest() {
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(
      fetch(`/api/test-email?email=test${i}@example.com`)
    );
  }
  const results = await Promise.all(promises);
  console.log('All emails sent:', results.length);
}
```

### Template Preview
To preview the email template without sending:
1. Copy the HTML from `lib/resend-email.ts`
2. Save as `.html` file
3. Open in browser
4. Check responsive design with DevTools

### Error Handling Test
```javascript
// Test with invalid email
fetch('/api/test-email?email=invalid-email')
  .then(r => r.json())
  .then(console.log);

// Test with missing email
fetch('/api/test-email')
  .then(r => r.json())
  .then(console.log);
```

## Monitoring & Analytics

### Resend Dashboard
Monitor these metrics:
- **Delivered**: Successfully delivered emails
- **Opened**: Recipients who opened the email
- **Clicked**: Links clicked in emails
- **Bounced**: Failed deliveries
- **Complained**: Spam reports

### Logging
All email operations are logged:
```javascript
console.log('Attempting to send email via Resend...');
console.log('Sending from:', fromEmail);
console.log('Email sent successfully via Resend:', result);
```

Check logs in:
- Local: Terminal output
- Vercel: Function logs in dashboard

## Email Best Practices

### Content
✅ Keep subject lines under 50 characters
✅ Personalize with recipient name
✅ Clear call-to-action
✅ Include plain text version
✅ Test all links before sending
✅ Proofread for typos and grammar

### Design
✅ Use table-based layouts for compatibility
✅ Inline CSS (no external stylesheets)
✅ Optimize images (under 1MB total)
✅ Test in dark mode
✅ Keep width under 600px
✅ Use web-safe fonts

### Compliance
✅ Include unsubscribe link (if newsletters)
✅ Add physical address
✅ Respect GDPR/privacy laws
✅ Honor opt-out requests immediately
✅ Secure handling of email addresses

## Production Checklist

Before going live:
- [ ] Domain is fully verified in Resend
- [ ] DNS records are configured correctly
- [ ] API key is set in production environment
- [ ] Test emails sent to real addresses
- [ ] All email clients tested
- [ ] Spam score is acceptable (<5/10)
- [ ] Rate limits are adequate for expected volume
- [ ] Error handling is robust
- [ ] Logging is configured
- [ ] Monitoring/alerts are set up

## Resources

- **Resend Dashboard**: https://resend.com/dashboard
- **Resend Documentation**: https://resend.com/docs
- **Email Testing Tool**: https://www.mail-tester.com/
- **HTML Email Guide**: https://www.campaignmonitor.com/css/
- **Email Client Market Share**: https://www.emailclientmarketshare.com/

## Support Contacts

- **Technical Issues**: connect@afribit.africa
- **Resend Support**: https://resend.com/support
- **Email Deliverability**: Check Resend documentation

---

**Last Updated:** January 2025
**Email Service:** Resend
**Template Version:** 1.0
**Status:** ✅ Production Ready
