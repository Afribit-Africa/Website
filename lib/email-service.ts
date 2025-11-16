import nodemailer from 'nodemailer';
import { logger } from './logger';

// Create reusable transporter with more compatible settings
// Try port 587 with STARTTLS if 465 doesn't work
const smtpPort = parseInt(process.env.SMTP_PORT || '465');
const useSecure = smtpPort === 465; // Use SSL for 465, STARTTLS for 587

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: useSecure, // true for 465 (SSL), false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    // Don't fail on invalid certs
    rejectUnauthorized: false
  },
  // Connection timeout
  connectionTimeout: 10000,
  // Socket timeout
  socketTimeout: 10000,
  debug: process.env.NODE_ENV === 'development', // Enable debug output in dev
  logger: process.env.NODE_ENV === 'development' // Log to console in dev
});

export interface DonationReceiptData {
  donorName: string;
  donorEmail: string;
  amount: number;
  tier: string;
  invoiceId: string;
  date: string;
  transactionId?: string;
}

export async function sendDonationReceipt(data: DonationReceiptData) {
  const { donorName, donorEmail, amount, tier, invoiceId, date, transactionId } = data;

  logger.info('Preparing donation receipt email for:', donorEmail);
  logger.debug('Email config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    from: process.env.EMAIL_FROM,
  });

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Donation Receipt - Afribit Africa</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border: 1px solid #F7931A; border-radius: 8px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #F7931A 0%, #ff8c00 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: bold;">AFRIBIT AFRICA</h1>
              <p style="margin: 10px 0 0 0; color: #000000; font-size: 16px; font-weight: 500;">Building the Bitcoin Economy in Africa</p>
            </td>
          </tr>

          <!-- Thank You Message -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h2 style="margin: 0 0 20px 0; color: #F7931A; font-size: 28px;">Thank You for Your Donation! 🎉</h2>
              <p style="margin: 0; color: #cccccc; font-size: 16px; line-height: 1.6;">
                Dear ${donorName},
              </p>
              <p style="margin: 20px 0; color: #cccccc; font-size: 16px; line-height: 1.6;">
                We are incredibly grateful for your generous contribution. Your support helps us empower communities in Kenya with Bitcoin education, merchant adoption, and financial freedom.
              </p>
            </td>
          </tr>

          <!-- Donation Details -->
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; border: 1px solid #F7931A; border-radius: 8px;">
                <tr>
                  <td style="padding: 30px;">
                    <h3 style="margin: 0 0 20px 0; color: #F7931A; font-size: 20px; text-align: center;">Receipt Details</h3>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 12px 0; color: #888888; font-size: 14px;">Donation Amount:</td>
                        <td style="padding: 12px 0; color: #F7931A; font-size: 18px; font-weight: bold; text-align: right;">$${amount.toFixed(2)} USD</td>
                      </tr>
                      <tr style="border-top: 1px solid #333333;">
                        <td style="padding: 12px 0; color: #888888; font-size: 14px;">Support Tier:</td>
                        <td style="padding: 12px 0; color: #ffffff; font-size: 16px; text-align: right; text-transform: capitalize;">${tier}</td>
                      </tr>
                      <tr style="border-top: 1px solid #333333;">
                        <td style="padding: 12px 0; color: #888888; font-size: 14px;">Date:</td>
                        <td style="padding: 12px 0; color: #ffffff; font-size: 16px; text-align: right;">${date}</td>
                      </tr>
                      <tr style="border-top: 1px solid #333333;">
                        <td style="padding: 12px 0; color: #888888; font-size: 14px;">Receipt ID:</td>
                        <td style="padding: 12px 0; color: #ffffff; font-size: 14px; text-align: right; font-family: monospace;">${invoiceId}</td>
                      </tr>
                      ${transactionId ? `
                      <tr style="border-top: 1px solid #333333;">
                        <td style="padding: 12px 0; color: #888888; font-size: 14px;">Transaction ID:</td>
                        <td style="padding: 12px 0; color: #ffffff; font-size: 12px; text-align: right; font-family: monospace; word-break: break-all;">${transactionId}</td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Impact Message -->
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <div style="background-color: #0a0a0a; border-left: 4px solid #F7931A; padding: 20px; border-radius: 4px;">
                <h4 style="margin: 0 0 10px 0; color: #F7931A; font-size: 18px;">Your Impact</h4>
                <p style="margin: 0; color: #cccccc; font-size: 14px; line-height: 1.6;">
                  ${getTierImpactMessage(tier, amount)}
                </p>
              </div>
            </td>
          </tr>

          <!-- What's Next -->
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <h3 style="margin: 0 0 20px 0; color: #F7931A; font-size: 20px; text-align: center;">What's Next?</h3>
              <div style="background-color: #0a0a0a; padding: 20px; border-radius: 8px;">
                <ul style="margin: 0; padding-left: 20px; color: #cccccc; font-size: 14px; line-height: 1.8;">
                  <li>Stay updated on our progress through monthly newsletters</li>
                  <li>Follow us on social media for real-time updates</li>
                  <li>Join our community events and Bitcoin education sessions</li>
                  <li>Share your support and help us reach more communities</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Social Links -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <p style="margin: 0 0 15px 0; color: #888888; font-size: 14px;">Connect with us:</p>
              <div>
                <a href="https://x.com/afribitAfrica" style="display: inline-block; margin: 0 10px; color: #F7931A; text-decoration: none; font-size: 14px;">Twitter</a>
                <span style="color: #333333;">|</span>
                <a href="https://www.facebook.com/profile.php?id=61566260787078" style="display: inline-block; margin: 0 10px; color: #F7931A; text-decoration: none; font-size: 14px;">Facebook</a>
                <span style="color: #333333;">|</span>
                <a href="https://www.youtube.com/@afribitAfrica" style="display: inline-block; margin: 0 10px; color: #F7931A; text-decoration: none; font-size: 14px;">YouTube</a>
                <span style="color: #333333;">|</span>
                <a href="https://www.instagram.com/afribitafrica/" style="display: inline-block; margin: 0 10px; color: #F7931A; text-decoration: none; font-size: 14px;">Instagram</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 30px; text-align: center; border-top: 1px solid #333333;">
              <p style="margin: 0 0 10px 0; color: #888888; font-size: 12px;">
                This is an official receipt for your donation to Afribit Africa
              </p>
              <p style="margin: 0 0 10px 0; color: #888888; font-size: 12px;">
                Kibera, Nairobi, Kenya
              </p>
              <p style="margin: 0; color: #888888; font-size: 12px;">
                Questions? Contact us at <a href="mailto:info@afribit.africa" style="color: #F7931A; text-decoration: none;">info@afribit.africa</a>
              </p>
              <p style="margin: 15px 0 0 0; color: #666666; font-size: 11px;">
                © ${new Date().getFullYear()} Afribit Africa. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const emailText = `
Thank You for Your Donation!

Dear ${donorName},

We are incredibly grateful for your generous contribution of $${amount.toFixed(2)} USD. Your support helps us empower communities in Kenya with Bitcoin education, merchant adoption, and financial freedom.

RECEIPT DETAILS
---------------
Donation Amount: $${amount.toFixed(2)} USD
Support Tier: ${tier}
Date: ${date}
Receipt ID: ${invoiceId}
${transactionId ? `Transaction ID: ${transactionId}` : ''}

YOUR IMPACT
-----------
${getTierImpactMessage(tier, amount)}

WHAT'S NEXT?
------------
- Stay updated on our progress through monthly newsletters
- Follow us on social media for real-time updates
- Join our community events and Bitcoin education sessions
- Share your support and help us reach more communities

Connect with us:
Twitter: https://x.com/afribitAfrica
Facebook: https://www.facebook.com/profile.php?id=61566260787078
YouTube: https://www.youtube.com/@afribitAfrica
Instagram: https://www.instagram.com/afribitafrica/

This is an official receipt for your donation to Afribit Africa
Kibera, Nairobi, Kenya

Questions? Contact us at info@afribit.africa

© ${new Date().getFullYear()} Afribit Africa. All rights reserved.
  `;

  try {
    logger.info('Attempting to send email via transporter...');
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: donorEmail,
      subject: `Thank You for Your Donation - Receipt #${invoiceId.substring(0, 8)}`,
      text: emailText,
      html: emailHtml,
    });
    logger.info('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    logger.error('Transporter sendMail error:', error);
    throw error;
  }
}

function getTierImpactMessage(tier: string, amount: number): string {
  const tierMessages: Record<string, string> = {
    'supporter': 'Your contribution helps us provide basic Bitcoin education materials to community members, enabling them to take their first steps toward financial sovereignty.',
    'advocate': 'Your generous support enables us to run educational workshops and onboard small businesses to accept Bitcoin, creating real-world use cases in our community.',
    'champion': 'Your exceptional contribution powers our comprehensive programs including merchant training, community events, and ongoing support systems that transform entire neighborhoods.',
    'custom': `Your generous donation of $${amount.toFixed(2)} makes a real difference in bringing Bitcoin education and economic empowerment to communities in Kibera and beyond.`,
  };

  return tierMessages[tier.toLowerCase()] || tierMessages['custom'];
}

export async function sendWelcomeEmail(donorName: string, donorEmail: string) {
  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Afribit Africa Community</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border: 1px solid #F7931A; border-radius: 8px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #F7931A 0%, #ff8c00 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: bold;">WELCOME!</h1>
              <p style="margin: 10px 0 0 0; color: #000000; font-size: 16px; font-weight: 500;">You're now part of the Afribit Africa family</p>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #cccccc; font-size: 16px; line-height: 1.6;">
                Dear ${donorName},
              </p>
              <p style="margin: 0 0 20px 0; color: #cccccc; font-size: 16px; line-height: 1.6;">
                Thank you for joining our mission to bring Bitcoin education and economic empowerment to communities in Kenya!
              </p>
              <p style="margin: 0; color: #cccccc; font-size: 16px; line-height: 1.6;">
                As a valued member of our community, you'll receive regular updates about our programs, success stories from the ground, and opportunities to get more involved.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <a href="https://afribit.africa" style="display: inline-block; background-color: #F7931A; color: #000000; text-decoration: none; padding: 15px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">Visit Our Website</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 30px; text-align: center; border-top: 1px solid #333333;">
              <p style="margin: 0 0 10px 0; color: #888888; font-size: 12px;">
                Kibera, Nairobi, Kenya
              </p>
              <p style="margin: 0; color: #888888; font-size: 12px;">
                <a href="mailto:info@afribit.africa" style="color: #F7931A; text-decoration: none;">info@afribit.africa</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: donorEmail,
    subject: 'Welcome to Afribit Africa Community! 🎉',
    html: emailHtml,
  });
}

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    logger.info('Verifying email configuration');
    logger.debug('Host:', process.env.SMTP_HOST);
    logger.debug('Port:', process.env.SMTP_PORT);
    logger.debug('User:', process.env.SMTP_USER);
    logger.debug('Secure:', process.env.SMTP_SECURE);

    await transporter.verify();
    logger.info('Email configuration verified successfully');
    return true;
  } catch (error) {
    logger.error('Email configuration error:', error);
    logger.error('Error details:', JSON.stringify(error, null, 2));
    return false;
  }
}

// Merchant Registration Email Functions
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afribit.africa';
const FROM_EMAIL = process.env.EMAIL_FROM || 'info@afribit.africa';

// Generate edit URL for merchant
function generateEditUrl(submissionId: string, editToken: string): string {
  return `${SITE_URL}/merchants/edit/${submissionId}?token=${editToken}`;
}

// Send submission confirmation email to merchant
export async function sendSubmissionConfirmationEmail(
  merchantEmail: string,
  submissionId: string,
  editToken: string,
  businessName: string
): Promise<boolean> {
  try {
    const editUrl = generateEditUrl(submissionId, editToken);

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: merchantEmail,
      subject: '✅ Merchant Submission Received - Afribit',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #F97316 0%, #F59E0B 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .button:hover { background: #EA580C; }
              .info-box { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🎉 Thank You for Your Submission!</h1>
              </div>
              <div class="content">
                <h2>Hi there,</h2>
                <p>Thank you for submitting <strong>${businessName}</strong> to the Afribit Merchant Directory!</p>

                <h3>What happens next?</h3>
                <ol>
                  <li><strong>Review:</strong> Our team will review your submission within 24-48 hours</li>
                  <li><strong>Verification:</strong> We'll verify the business details and Bitcoin payment acceptance</li>
                  <li><strong>Publishing:</strong> Once approved, we'll publish to OpenStreetMap and BTCMap</li>
                  <li><strong>Visibility:</strong> Your business will appear on btcmap.org within 10-20 minutes</li>
                </ol>

                <div class="info-box">
                  <strong>💡 Need to make changes?</strong><br>
                  You can edit your submission anytime before it's approved using the link below:
                </div>

                <div style="text-align: center;">
                  <a href="${editUrl}" class="button">✏️ Edit Your Submission</a>
                </div>

                <p style="font-size: 12px; color: #6B7280; word-break: break-all;">
                  Direct link: ${editUrl}
                </p>

                <div class="info-box" style="background: #DBEAFE; border-left-color: #3B82F6;">
                  <strong>🏆 Early Adopter Program</strong><br>
                  The first 50 verified merchants get:
                  <ul style="margin: 10px 0;">
                    <li>Special "Early Adopter" badge</li>
                    <li>Featured listing on our homepage</li>
                    <li>Priority support</li>
                    <li>Recognition in our community</li>
                  </ul>
                </div>

                <p>If you have any questions, feel free to reach out to us at <a href="mailto:${FROM_EMAIL}">${FROM_EMAIL}</a></p>

                <p>Best regards,<br><strong>The Afribit Team</strong></p>
              </div>
              <div class="footer">
                <p>Afribit Africa | Promoting Bitcoin Adoption in Africa</p>
                <p><a href="${SITE_URL}" style="color: #F97316;">Visit our website</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return true;
  } catch (error) {
    logger.error('Error sending confirmation email:', error);
    return false;
  }
}

// Send approval notification to merchant
export async function sendApprovalEmail(
  merchantEmail: string,
  businessName: string,
  isEarlyAdopter: boolean,
  adopterNumber?: number | null
): Promise<boolean> {
  try {
    const earlyAdopterBadge = isEarlyAdopter && adopterNumber
      ? `
        <div class="info-box" style="background: linear-gradient(135deg, #A855F7 0%, #EC4899 100%); border: none; color: white;">
          <h3 style="margin: 0 0 10px 0; color: white;">🏆 Congratulations! You're Early Adopter #${adopterNumber}</h3>
          <p style="margin: 0; color: white;">You're one of the first 50 verified Bitcoin merchants on our platform!</p>
        </div>
      `
      : '';

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: merchantEmail,
      subject: '🎉 Your Merchant Submission Has Been Approved!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .info-box { background: #D1FAE5; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">✅ Submission Approved!</h1>
              </div>
              <div class="content">
                <h2>Great news!</h2>
                <p><strong>${businessName}</strong> has been approved and will be published to BTCMap shortly!</p>

                ${earlyAdopterBadge}

                <div class="info-box">
                  <strong>📍 What's happening now:</strong><br>
                  <ul style="margin: 10px 0;">
                    <li>We're publishing your business to OpenStreetMap</li>
                    <li>Your listing will sync to BTCMap.org within 10-20 minutes</li>
                    <li>Bitcoin users worldwide will be able to find your business</li>
                  </ul>
                </div>

                <div style="text-align: center;">
                  <a href="https://btcmap.org" class="button">🗺️ View on BTCMap</a>
                </div>

                <p><strong>Share your achievement:</strong></p>
                <p>Let your customers know you accept Bitcoin! Share on social media and use hashtags: #BitcoinAfrica #BTCMap #OrangeTheWorld</p>

                <p>Thank you for being part of the Bitcoin circular economy in Africa! 🧡</p>

                <p>Best regards,<br><strong>The Afribit Team</strong></p>
              </div>
              <div class="footer">
                <p>Afribit Africa | Promoting Bitcoin Adoption in Africa</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return true;
  } catch (error) {
    logger.error('Error sending approval email:', error);
    return false;
  }
}

// Send rejection notification to merchant with edit link
export async function sendRejectionEmail(
  merchantEmail: string,
  businessName: string,
  reason: string,
  submissionId: string,
  editToken: string
): Promise<boolean> {
  try {
    const editUrl = generateEditUrl(submissionId, editToken);

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: merchantEmail,
      subject: 'Merchant Submission Update - Action Required',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .info-box { background: #FEE2E2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">⚠️ Submission Requires Updates</h1>
              </div>
              <div class="content">
                <h2>Hi there,</h2>
                <p>Thank you for your submission of <strong>${businessName}</strong>. We've reviewed it and need some additional information or corrections.</p>

                <div class="info-box">
                  <strong>📝 Reason for rejection:</strong><br>
                  <p style="margin: 10px 0;">${reason}</p>
                </div>

                <p><strong>Next steps:</strong></p>
                <ol>
                  <li>Click the button below to edit your submission</li>
                  <li>Address the issues mentioned above</li>
                  <li>Save your changes - we'll review them again</li>
                </ol>

                <div style="text-align: center;">
                  <a href="${editUrl}" class="button">✏️ Update Your Submission</a>
                </div>

                <p style="font-size: 12px; color: #6B7280; word-break: break-all;">
                  Direct link: ${editUrl}
                </p>

                <p>If you have any questions about the rejection reason, please don't hesitate to contact us at <a href="mailto:${FROM_EMAIL}">${FROM_EMAIL}</a></p>

                <p>We look forward to adding your business to BTCMap!</p>

                <p>Best regards,<br><strong>The Afribit Team</strong></p>
              </div>
              <div class="footer">
                <p>Afribit Africa | Promoting Bitcoin Adoption in Africa</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return true;
  } catch (error) {
    logger.error('Error sending rejection email:', error);
    return false;
  }
}

// Send published notification to merchant (after OSM sync)
export async function sendPublishedEmail(
  merchantEmail: string,
  businessName: string,
  osmNodeId: number,
  isEarlyAdopter: boolean,
  adopterNumber?: number | null
): Promise<boolean> {
  try {
    const earlyAdopterNote = isEarlyAdopter && adopterNumber
      ? `
        <div class="info-box" style="background: linear-gradient(135deg, #A855F7 0%, #EC4899 100%); border: none; color: white; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: white;">🏆 Early Adopter #${adopterNumber}</h3>
          <p style="margin: 0; color: white;">Your business is featured on our homepage as one of the first 50 verified Bitcoin merchants!</p>
        </div>
      `
      : '';

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: merchantEmail,
      subject: '🎉 Your Business is Now Live on BTCMap!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
              .info-box { background: #D1FAE5; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 14px; }
              .links { text-align: center; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🎉 You're Live on BTCMap!</h1>
              </div>
              <div class="content">
                <h2>Congratulations!</h2>
                <p><strong>${businessName}</strong> is now visible to Bitcoin users worldwide! 🌍</p>

                ${earlyAdopterNote}

                <div class="info-box">
                  <strong>✅ Your business is now:</strong><br>
                  <ul style="margin: 10px 0;">
                    <li>Published on OpenStreetMap (Node ID: ${osmNodeId})</li>
                    <li>Visible on BTCMap.org</li>
                    <li>Discoverable by Bitcoin wallet apps</li>
                    <li>Listed in the Afribit Merchant Directory</li>
                  </ul>
                </div>

                <h3>View Your Listing:</h3>
                <div class="links">
                  <a href="https://www.openstreetmap.org/node/${osmNodeId}" class="button">View on OpenStreetMap</a>
                  <a href="https://btcmap.org" class="button">View on BTCMap</a>
                  <a href="${SITE_URL}/merchants" class="button">Afribit Directory</a>
                </div>

                <h3>Spread the Word! 📣</h3>
                <p>Share your achievement with your customers:</p>
                <ul>
                  <li>Post on social media with hashtags: <strong>#BitcoinAfrica #BTCMap #OrangeTheWorld</strong></li>
                  <li>Add a "Bitcoin Accepted Here" sticker to your storefront</li>
                  <li>Tell customers they can find you on BTCMap</li>
                  <li>Share your OpenStreetMap link: <a href="https://www.openstreetmap.org/node/${osmNodeId}">osm.org/node/${osmNodeId}</a></li>
                </ul>

                <div class="info-box" style="background: #FEF3C7; border-left-color: #F59E0B;">
                  <strong>💡 Pro Tips:</strong><br>
                  <ul style="margin: 10px 0;">
                    <li>Keep your contact information up to date</li>
                    <li>Train staff on accepting Bitcoin payments</li>
                    <li>Consider offering Bitcoin-only discounts</li>
                    <li>Join local Bitcoin meetups and events</li>
                  </ul>
                </div>

                <p>Thank you for being part of the Bitcoin circular economy in Africa! Together we're building the future of money. 🧡⚡</p>

                <p>Questions? Contact us at <a href="mailto:${FROM_EMAIL}">${FROM_EMAIL}</a></p>

                <p>Best regards,<br><strong>The Afribit Team</strong></p>
              </div>
              <div class="footer">
                <p>Afribit Africa | Promoting Bitcoin Adoption in Africa</p>
                <p>
                  <a href="${SITE_URL}" style="color: #F97316; margin: 0 10px;">Website</a> |
                  <a href="https://x.com/afribitAfrica" style="color: #F97316; margin: 0 10px;">Twitter</a> |
                  <a href="https://www.facebook.com/profile.php?id=61566260787078" style="color: #F97316; margin: 0 10px;">Facebook</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return true;
  } catch (error) {
    logger.error('Error sending published email:', error);
    return false;
  }
}
