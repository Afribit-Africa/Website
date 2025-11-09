# Email System Documentation

## Overview
Afribit Africa now has a professional email system that automatically sends beautiful receipt emails to named donors after successful Bitcoin donations.

## Features

### 1. **Donation Receipt Emails**
- Automatically sent when payment is confirmed
- Professional HTML email design with Afribit branding
- Includes all donation details:
  - Donation amount
  - Support tier
  - Receipt ID
  - Transaction ID
  - Date and time
- Personalized impact message based on donation tier
- Social media links for engagement
- Mobile-responsive design

### 2. **Email Templates**
Located in `lib/email-service.ts`:

#### Donation Receipt Template
- **Subject**: "Thank You for Your Donation - Receipt #[ID]"
- **Design**: Black background with Bitcoin orange accents
- **Content**:
  - Thank you message
  - Receipt details table
  - Impact message (tier-specific)
  - What's next section
  - Social media links
  - Professional footer

#### Welcome Email Template
- **Subject**: "Welcome to Afribit Africa Community! 🎉"
- **Purpose**: Welcome new supporters to the community
- **Can be sent manually for newsletter signups**

## Configuration

Email settings are in `.env.local`:

```env
SMTP_HOST="mail.afribit.africa"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="info@afribit.africa"
SMTP_PASSWORD="N422ZoTK3aOM"
EMAIL_FROM="info@afribit.africa"
EMAIL_FROM_NAME="Afribit Africa"
```

## API Endpoints

### 1. Send Receipt Email
**POST** `/api/donations/send-receipt`

Send a donation receipt to a donor.

**Request Body**:
```json
{
  "invoiceId": "invoice-id-here",
  "transactionId": "transaction-id-here" // optional
}
```

**Response**:
```json
{
  "success": true,
  "message": "Receipt sent successfully"
}
```

### 2. Test Email Configuration
**GET** `/api/test-email`

Verify email configuration is working.

**Response**:
```json
{
  "success": true,
  "message": "Email configuration is valid",
  "config": {
    "host": "mail.afribit.africa",
    "port": "465",
    "secure": "true",
    "from": "info@afribit.africa"
  }
}
```

**Send Test Email**:
**GET** `/api/test-email?email=your-email@example.com`

Sends a test receipt to the specified email address.

## How It Works

### Automatic Flow

1. **User makes named donation** on `/donate` page
   - Selects "Named Donation"
   - Enters name and email
   - Completes Lightning payment

2. **Payment confirmation detected**
   - Frontend polls payment status every 3 seconds
   - When status is "settled", "paid", or "processing":
     - Payment success screen is shown
     - Receipt email is automatically triggered

3. **Receipt email sent**
   - System fetches donor info from database
   - Generates professional HTML email
   - Sends via SMTP (info@afribit.africa)
   - Email includes all donation details

4. **Donor receives email**
   - Arrives from "Afribit Africa <info@afribit.africa>"
   - Beautiful branded design
   - Can be saved as official receipt
   - Includes social links for continued engagement

### Database Integration

The system stores all donations in the `donors` table:

```sql
CREATE TABLE donors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  email VARCHAR(255),
  amount DECIMAL(10, 2),
  tier VARCHAR(50),
  donation_type ENUM('anonymous', 'named'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

Only **named donations** with email addresses receive receipt emails.

## Testing the Email System

### Method 1: Test Endpoint
Visit: `https://afribit.africa/api/test-email?email=your-email@example.com`

This will send a test receipt to verify your email setup.

### Method 2: Real Donation
1. Go to `/donate` page
2. Select "Named Donation"
3. Enter your details
4. Complete a small test payment
5. Check your email for the receipt

### Method 3: Manual Send
Use the API directly:

```bash
curl -X POST https://afribit.africa/api/donations/send-receipt \
  -H "Content-Type: application/json" \
  -d '{"invoiceId": "existing-invoice-id"}'
```

## Email Design Features

### Professional Branding
- Afribit Africa logo colors
- Bitcoin orange (#F7931A) primary color
- Clean, modern layout
- Dark theme matching website

### Mobile Responsive
- Works on all devices
- Tables optimized for mobile
- Readable font sizes
- Touch-friendly links

### Accessibility
- Plain text alternative included
- High contrast colors
- Clear hierarchy
- Semantic HTML

## Tier-Specific Impact Messages

The email includes personalized impact messages based on donation tier:

- **Supporter ($25)**: Basic education materials message
- **Advocate**: Workshop and merchant onboarding message
- **Champion**: Comprehensive programs message
- **Custom**: Flexible message with amount

## Future Enhancements

Potential additions:
- Monthly newsletter system
- Donation anniversary emails
- Impact report emails
- Event invitation emails
- Milestone celebration emails

## Troubleshooting

### Email not sending?
1. Check SMTP credentials in `.env.local`
2. Test configuration: `/api/test-email`
3. Check server logs for errors
4. Verify email address is valid

### Email going to spam?
1. Check SPF/DKIM records for afribit.africa
2. Ensure sending from verified domain
3. Don't send too many emails at once
4. Ask recipients to whitelist info@afribit.africa

### Receipt not arriving?
1. Check if it was a named donation (anonymous don't get emails)
2. Verify email address in database
3. Check spam/junk folder
4. Manually resend via API

## Support

For email system issues, contact:
- Email: info@afribit.africa
- Check logs in production console
- Use test endpoint to verify configuration
