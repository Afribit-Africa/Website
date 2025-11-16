import { Resend } from 'resend';
import { logger } from './logger';

const resend = new Resend(process.env.RESEND_API_KEY);

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

  // Use verified domain: updates.afribit.africa
  const fromEmail = 'receipts@updates.afribit.africa';
  const fromName = 'Afribit Africa';

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
    logger.debug('Attempting to send email via Resend');

    // Use verified domain: updates.afribit.africa
    const fromEmail = 'Afribit Africa <receipts@updates.afribit.africa>';

    logger.debug('Sending from:', fromEmail);

    const result = await resend.emails.send({
      from: fromEmail,
      to: donorEmail,
      subject: `Thank You for Your Donation - Receipt #${invoiceId.substring(0, 8)}`,
      text: emailText,
      html: emailHtml,
    });

    logger.info('Donation receipt email sent successfully:', result.id);
    return result;
  } catch (error) {
    logger.error('Resend email error:', error);
    throw error;
  }
}

function getTierImpactMessage(tier: string, amount: number): string {
  const tierMessages: Record<string, string> = {
    'supporter': 'Your contribution helps us provide basic Bitcoin education materials to community members, enabling them to take their first steps toward financial sovereignty.',
    'advocate': 'Your generous support enables us to run educational workshops and onboard small businesses to accept Bitcoin, creating real-world use cases in our community.',
    'champion': 'Your exceptional contribution powers our comprehensive programs including merchant training, community events, and ongoing support systems that transform entire neighborhoods.',
    'friend': 'Your vital contribution directly supports the daily operational success and foundational growth of all Afribit Kibera initiatives.',
    'business': 'Your support fuels local entrepreneurship and helps scale community businesses sustainably with Bitcoin.',
    'education': 'Your contribution trains community ambassadors who will spread Bitcoin education throughout Kibera.',
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

  try {
    // Use verified domain: updates.afribit.africa
    const fromEmail = 'Afribit Africa <hello@updates.afribit.africa>';

    const result = await resend.emails.send({
      from: fromEmail,
      to: donorEmail,
      subject: 'Welcome to Afribit Africa Community! 🎉',
      html: emailHtml,
    });
    return result;
  } catch (error) {
    logger.error('Welcome email error:', error);
    throw error;
  }
}

// Verify Resend API key is configured
export async function verifyEmailConfig() {
  try {
    if (!process.env.RESEND_API_KEY) {
      logger.error('RESEND_API_KEY is not set');
      return false;
    }
    logger.info('Resend API key is configured');
    return true;
  } catch (error) {
    logger.error('Email configuration error:', error);
    return false;
  }
}

// ============================================================
// MERCHANT REGISTRATION EMAIL FUNCTIONS
// ============================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afribit.africa';

// Generate edit URL for merchant
function generateEditUrl(submissionId: string, editToken: string): string {
  return `${SITE_URL}/merchants/edit/${submissionId}?token=${editToken}`;
}

// Send submission confirmation email to merchant
export async function sendMerchantSubmissionConfirmation(
  merchantEmail: string,
  businessName: string,
  submissionId: string,
  editToken: string
) {
  const editUrl = generateEditUrl(submissionId, editToken);
  const logoUrl = `${SITE_URL}/Media/Logo/afribit-logo.png`;

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Merchant Submission Received - Afribit</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0A0A0A; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1A1A1A; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; overflow: hidden;">

          <!-- Logo & Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #F7931A 0%, #ff8c00 100%); padding: 40px 30px; text-align: center;">
              <img src="${logoUrl}" alt="Afribit Africa" style="width: 80px; height: 80px; margin-bottom: 20px;" />
              <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: bold;">Submission Received</h1>
              <p style="margin: 10px 0 0 0; color: #000000; font-size: 16px; font-weight: 500;">Thank you for joining the Afribit Merchant Directory</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #ffffff; font-size: 18px; font-weight: 600;">Hi there,</p>

              <p style="margin: 0 0 20px 0; color: #cccccc; font-size: 16px; line-height: 1.6;">
                Thank you for submitting <strong style="color: #F7931A;">${businessName}</strong> to the Afribit Merchant Directory!
              </p>

              <p style="margin: 0 0 20px 0; color: #cccccc; font-size: 16px; line-height: 1.6;">
                Your submission has been received and is now under review. We'll carefully verify all the details and let you know once it's approved and live on our map.
              </p>

              <!-- Edit Link Box -->
              <div style="background-color: rgba(247, 147, 26, 0.1); border: 2px solid #F7931A; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="margin: 0 0 10px 0; color: #F7931A; font-size: 18px;">Need to make changes?</h3>
                <p style="margin: 0 0 15px 0; color: #cccccc; font-size: 14px;">
                  You can edit your submission anytime using this link:
                </p>
                <p style="margin: 0; text-align: center;">
                  <a href="${editUrl}" style="display: inline-block; background-color: #F7931A; color: #000000; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-size: 16px; font-weight: bold;">Edit Your Submission</a>
                </p>
              </div>

              <p style="margin: 20px 0 0 0; color: #888888; font-size: 14px; line-height: 1.6;">
                <strong style="color: #cccccc;">Important:</strong> Please save this email! You'll need the edit link above to check your submission status or make any changes.
              </p>
            </td>
          </tr>

          <!-- What's Next Section -->
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <div style="background-color: #0A0A0A; border-radius: 8px; padding: 25px;">
                <h3 style="margin: 0 0 15px 0; color: #F7931A; font-size: 20px;">What happens next?</h3>

                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="display: inline-block; width: 30px; height: 30px; background-color: #F7931A; color: #000000; border-radius: 50%; text-align: center; line-height: 30px; font-weight: bold; margin-right: 10px;">1</span>
                      <span style="color: #cccccc; font-size: 15px; vertical-align: middle;">Our team reviews your submission</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="display: inline-block; width: 30px; height: 30px; background-color: #F7931A; color: #000000; border-radius: 50%; text-align: center; line-height: 30px; font-weight: bold; margin-right: 10px;">2</span>
                      <span style="color: #cccccc; font-size: 15px; vertical-align: middle;">We verify your business details</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="display: inline-block; width: 30px; height: 30px; background-color: #F7931A; color: #000000; border-radius: 50%; text-align: center; line-height: 30px; font-weight: bold; margin-right: 10px;">3</span>
                      <span style="color: #cccccc; font-size: 15px; vertical-align: middle;">Your business goes live on the map!</span>
                    </td>
                  </tr>
                </table>

                <p style="margin: 20px 0 0 0; color: #888888; font-size: 14px;">
                  This usually takes 1-3 business days. Check your submission status using the edit link above.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0A0A0A; padding: 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
              <p style="margin: 0 0 10px 0; color: #888888; font-size: 14px;">
                Questions? Contact us at <a href="mailto:info@afribit.africa" style="color: #F7931A; text-decoration: none;">info@afribit.africa</a>
              </p>
              <p style="margin: 0 0 15px 0; color: #888888; font-size: 12px;">
                Kibera, Nairobi, Kenya
              </p>
              <div style="margin-top: 15px;">
                <a href="https://twitter.com/afribitafrica" style="color: #F7931A; text-decoration: none; margin: 0 10px;">Twitter</a>
                <span style="color: #333;">|</span>
                <a href="https://afribit.africa" style="color: #F7931A; text-decoration: none; margin: 0 10px;">Website</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: 'Afribit Merchants <merchants@updates.afribit.africa>',
      to: merchantEmail,
      subject: 'Merchant Submission Received - Afribit Directory',
      html: emailHtml,
      replyTo: 'info@afribit.africa'
    });

    logger.info('Submission confirmation email sent:', result);
    return result;
  } catch (error) {
    logger.error('Failed to send submission confirmation email:', error);
    throw error;
  }
}

// Send approval email to merchant
export async function sendMerchantApprovalEmail(
  merchantEmail: string,
  businessName: string
) {
  const logoUrl = `${SITE_URL}/Media/Logo/afribit-logo.png`;

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Merchant Approved - Afribit</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0A0A0A; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1A1A1A; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; overflow: hidden;">

          <!-- Logo & Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <img src="${logoUrl}" alt="Afribit Africa" style="width: 80px; height: 80px; margin-bottom: 20px;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Congratulations!</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 500;">Your business is now approved</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #ffffff; font-size: 18px; font-weight: 600;">Great news!</p>

              <p style="margin: 0 0 20px 0; color: #cccccc; font-size: 16px; line-height: 1.6;">
                <strong style="color: #F7931A;">${businessName}</strong> has been approved and is now being published to the Afribit Merchant Directory!
              </p>

              <div style="background-color: rgba(16, 185, 129, 0.1); border-left: 4px solid #10B981; border-radius: 4px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0 0 10px 0; color: #10B981; font-size: 16px; font-weight: 600;">Your business is now live!</p>
                <p style="margin: 0; color: #cccccc; font-size: 14px; line-height: 1.6;">
                  Bitcoin users in Kenya can now discover your business on our interactive map. You're helping build the circular Bitcoin economy in Africa!
                </p>
              </div>

              <p style="margin: 20px 0 0 0; text-align: center;">
                <a href="${SITE_URL}/maps" style="display: inline-block; background-color: #F7931A; color: #000000; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-size: 16px; font-weight: bold;">View on Map</a>
              </p>
            </td>
          </tr>

          <!-- Benefits Section -->
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <div style="background-color: #0A0A0A; border-radius: 8px; padding: 25px;">
                <h3 style="margin: 0 0 15px 0; color: #F7931A; font-size: 20px;">What this means for you:</h3>

                <ul style="margin: 0; padding: 0 0 0 20px; color: #cccccc; font-size: 15px; line-height: 2;">
                  <li>Increased visibility to Bitcoin users</li>
                  <li>Part of the growing Bitcoin circular economy</li>
                  <li>Support from the Afribit community</li>
                  <li>Featured in our merchant directory</li>
                </ul>

                <p style="margin: 20px 0 0 0; color: #888888; font-size: 14px;">
                  Keep accepting Bitcoin and help us spread financial freedom in Africa!
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0A0A0A; padding: 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
              <p style="margin: 0 0 10px 0; color: #888888; font-size: 14px;">
                Questions? Contact us at <a href="mailto:info@afribit.africa" style="color: #F7931A; text-decoration: none;">info@afribit.africa</a>
              </p>
              <p style="margin: 0 0 15px 0; color: #888888; font-size: 12px;">
                Kibera, Nairobi, Kenya
              </p>
              <div style="margin-top: 15px;">
                <a href="https://twitter.com/afribitafrica" style="color: #F7931A; text-decoration: none; margin: 0 10px;">Twitter</a>
                <span style="color: #333;">|</span>
                <a href="https://afribit.africa" style="color: #F7931A; text-decoration: none; margin: 0 10px;">Website</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: 'Afribit Merchants <merchants@updates.afribit.africa>',
      to: merchantEmail,
      subject: 'Congratulations! Your business is now approved - Afribit',
      html: emailHtml,
      replyTo: 'info@afribit.africa'
    });

    logger.info('Approval email sent:', result);
    return result;
  } catch (error) {
    logger.error('Failed to send approval email:', error);
    throw error;
  }
}

// Send rejection email to merchant
export async function sendMerchantRejectionEmail(
  merchantEmail: string,
  businessName: string,
  rejectionReason: string,
  submissionId: string,
  editToken: string
) {
  const editUrl = generateEditUrl(submissionId, editToken);
  const logoUrl = `${SITE_URL}/Media/Logo/afribit-logo.png`;

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0;">
  <title>Submission Update - Afribit</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0A0A0A; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1A1A1A; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; overflow: hidden;">

          <!-- Logo & Header -->
          <tr>
            <td style="background-color: #DC2626; padding: 40px 30px; text-align: center;">
              <img src="${logoUrl}" alt="Afribit Africa" style="width: 80px; height: 80px; margin-bottom: 20px;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Submission Requires Updates</h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #ffffff; font-size: 18px; font-weight: 600;">Hi there,</p>

              <p style="margin: 0 0 20px 0; color: #cccccc; font-size: 16px; line-height: 1.6;">
                Thank you for submitting <strong style="color: #F7931A;">${businessName}</strong> to the Afribit Merchant Directory.
              </p>

              <p style="margin: 0 0 20px 0; color: #cccccc; font-size: 16px; line-height: 1.6;">
                Unfortunately, we need you to make some updates before we can approve your submission.
              </p>

              <!-- Reason Box -->
              <div style="background-color: rgba(220, 38, 38, 0.1); border-left: 4px solid #DC2626; border-radius: 4px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0 0 10px 0; color: #DC2626; font-size: 16px; font-weight: 600;">Reason:</p>
                <p style="margin: 0; color: #cccccc; font-size: 14px; line-height: 1.6;">
                  ${rejectionReason}
                </p>
              </div>

              <!-- Edit Link -->
              <div style="background-color: rgba(247, 147, 26, 0.1); border: 2px solid #F7931A; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="margin: 0 0 10px 0; color: #F7931A; font-size: 18px;">Update Your Submission</h3>
                <p style="margin: 0 0 15px 0; color: #cccccc; font-size: 14px;">
                  Please use the link below to update your submission:
                </p>
                <p style="margin: 0; text-align: center;">
                  <a href="${editUrl}" style="display: inline-block; background-color: #F7931A; color: #000000; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-size: 16px; font-weight: bold;">Edit Submission</a>
                </p>
              </div>

              <p style="margin: 20px 0 0 0; color: #888888; font-size: 14px; line-height: 1.6;">
                Once you've made the necessary changes, we'll review your submission again. We're here to help bring more Bitcoin merchants to Kenya!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0A0A0A; padding: 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
              <p style="margin: 0 0 10px 0; color: #888888; font-size: 14px;">
                Questions? Contact us at <a href="mailto:info@afribit.africa" style="color: #F7931A; text-decoration: none;">info@afribit.africa</a>
              </p>
              <p style="margin: 0 0 15px 0; color: #888888; font-size: 12px;">
                Kibera, Nairobi, Kenya
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

  try {
    const result = await resend.emails.send({
      from: 'Afribit Merchants <merchants@updates.afribit.africa>',
      to: merchantEmail,
      subject: 'Submission Update Required - Afribit Directory',
      html: emailHtml,
      replyTo: 'info@afribit.africa'
    });

    logger.info('Rejection email sent:', result.id);
    return result;
  } catch (error) {
    logger.error('Failed to send rejection email:', error);
    throw error;
  }
}

/**
 * Send password reset email to admin user
 */
export async function sendPasswordResetEmail(data: {
  email: string;
  name: string;
  resetLink: string;
  expiresAt: Date;
}) {
  const { email, name, resetLink, expiresAt } = data;

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset - Afribit Africa</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border: 1px solid #F7931A; border-radius: 8px; overflow: hidden;">

          <tr>
            <td style="background: linear-gradient(135deg, #F7931A 0%, #ff8c00 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: bold;">AFRIBIT AFRICA</h1>
              <p style="margin: 10px 0 0 0; color: #000000; font-size: 16px; font-weight: 500;">Admin Password Reset</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #cccccc; font-size: 16px;">
                Hello ${name},
              </p>
              <p style="margin: 0 0 20px 0; color: #cccccc; font-size: 14px; line-height: 1.6;">
                You requested to reset your password for your Afribit Africa admin account. Click the button below to set a new password:
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="display: inline-block; background-color: #F7931A; color: #000000; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">Reset Password</a>
              </div>

              <p style="margin: 20px 0 0 0; color: #888888; font-size: 13px; line-height: 1.6;">
                This link will expire at ${expiresAt.toLocaleString()}. If you didn't request this reset, please ignore this email or contact us immediately.
              </p>

              <p style="margin: 20px 0 0 0; color: #666666; font-size: 12px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <span style="color: #F7931A; word-break: break-all;">${resetLink}</span>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #0a0a0a; padding: 20px 30px; text-align: center; border-top: 1px solid #333333;">
              <p style="margin: 0; color: #888888; font-size: 12px;">
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

  try {
    const result = await resend.emails.send({
      from: 'Afribit Admin <admin@updates.afribit.africa>',
      to: email,
      subject: 'Reset Your Password - Afribit Africa',
      html: emailHtml,
      replyTo: 'info@afribit.africa'
    });

    logger.info('Password reset email sent:', result.id);
    return result;
  } catch (error) {
    logger.error('Failed to send password reset email:', error);
    throw error;
  }
}

/**
 * Send verification rejection email to merchant
 */
export async function sendMerchantVerificationRejectionEmail(data: {
  email: string;
  businessName: string;
  reason: string;
}) {
  const { email, businessName, reason } = data;

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Update - Afribit Africa</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border: 1px solid #F7931A; border-radius: 8px; overflow: hidden;">

          <tr>
            <td style="background: linear-gradient(135deg, #F7931A 0%, #ff8c00 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: bold;">AFRIBIT AFRICA</h1>
              <p style="margin: 10px 0 0 0; color: #000000; font-size: 16px; font-weight: 500;">Merchant Verification Update</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #F7931A; font-size: 24px;">Verification Status Update</h2>

              <p style="margin: 0 0 20px 0; color: #cccccc; font-size: 16px;">
                Dear ${businessName} Team,
              </p>

              <p style="margin: 0 0 20px 0; color: #cccccc; font-size: 14px; line-height: 1.6;">
                Our verification team recently visited your location. Unfortunately, we were unable to verify your business at this time.
              </p>

              <div style="background-color: rgba(220, 38, 38, 0.1); border-left: 4px solid #DC2626; border-radius: 4px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: #DC2626; font-size: 16px; font-weight: 600;">Verifier Notes:</p>
                <p style="margin: 0; color: #cccccc; font-size: 14px; line-height: 1.6;">
                  ${reason}
                </p>
              </div>

              <p style="margin: 20px 0 0 0; color: #cccccc; font-size: 14px; line-height: 1.6;">
                If you believe this is an error or would like to provide additional information, please contact us at <a href="mailto:info@afribit.africa" style="color: #F7931A; text-decoration: none;">info@afribit.africa</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #0a0a0a; padding: 20px 30px; text-align: center; border-top: 1px solid #333333;">
              <p style="margin: 0; color: #888888; font-size: 12px;">
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

  try {
    const result = await resend.emails.send({
      from: 'Afribit Merchants <merchants@updates.afribit.africa>',
      to: email,
      subject: 'Verification Status Update - Afribit Directory',
      html: emailHtml,
      replyTo: 'info@afribit.africa'
    });

    logger.info('Verification rejection email sent:', result.id);
    return result;
  } catch (error) {
    logger.error('Failed to send verification rejection email:', error);
    throw error;
  }
}

/**
 * Send admin notification when new merchant is submitted
 */
export async function sendAdminNotificationEmail(data: {
  submissionId: string;
  businessName: string;
  category: string;
  contactEmail: string;
  location: string;
}) {
  const { submissionId, businessName, category, contactEmail, location } = data;

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'info@afribit.africa';
  const dashboardUrl = `${process.env.NEXTAUTH_URL || 'https://afribit.africa'}/admin/submissions`;

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Merchant Submission - Afribit Africa</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border: 1px solid #F7931A; border-radius: 8px; overflow: hidden;">

          <tr>
            <td style="background: linear-gradient(135deg, #F7931A 0%, #ff8c00 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: bold;">NEW SUBMISSION</h1>
              <p style="margin: 10px 0 0 0; color: #000000; font-size: 16px; font-weight: 500;">Merchant Directory</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #F7931A; font-size: 24px;">New Merchant Awaiting Review</h2>

              <div style="background-color: #0a0a0a; border: 1px solid #F7931A; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 10px 0; color: #888888; font-size: 14px;">Business Name:</td>
                    <td style="padding: 10px 0; color: #ffffff; font-size: 16px; text-align: right; font-weight: 600;">${businessName}</td>
                  </tr>
                  <tr style="border-top: 1px solid #333333;">
                    <td style="padding: 10px 0; color: #888888; font-size: 14px;">Category:</td>
                    <td style="padding: 10px 0; color: #ffffff; font-size: 14px; text-align: right;">${category}</td>
                  </tr>
                  <tr style="border-top: 1px solid #333333;">
                    <td style="padding: 10px 0; color: #888888; font-size: 14px;">Contact Email:</td>
                    <td style="padding: 10px 0; color: #ffffff; font-size: 14px; text-align: right;">${contactEmail}</td>
                  </tr>
                  <tr style="border-top: 1px solid #333333;">
                    <td style="padding: 10px 0; color: #888888; font-size: 14px;">Location:</td>
                    <td style="padding: 10px 0; color: #ffffff; font-size: 14px; text-align: right;">${location}</td>
                  </tr>
                  <tr style="border-top: 1px solid #333333;">
                    <td style="padding: 10px 0; color: #888888; font-size: 14px;">Submission ID:</td>
                    <td style="padding: 10px 0; color: #666666; font-size: 12px; text-align: right; font-family: monospace;">${submissionId}</td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${dashboardUrl}" style="display: inline-block; background-color: #F7931A; color: #000000; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">Review Submission</a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #0a0a0a; padding: 20px 30px; text-align: center; border-top: 1px solid #333333;">
              <p style="margin: 0; color: #888888; font-size: 12px;">
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

  try {
    const result = await resend.emails.send({
      from: 'Afribit Admin <admin@updates.afribit.africa>',
      to: adminEmail,
      subject: `New Merchant Submission: ${businessName}`,
      html: emailHtml,
      replyTo: contactEmail
    });

    logger.info('Admin notification email sent:', result.id);
    return result;
  } catch (error) {
    logger.error('Failed to send admin notification email:', error);
    throw error;
  }
}

/**
 * Send published notification to merchant
 */
export async function sendMerchantPublishedEmail(data: {
  email: string;
  businessName: string;
  osmNodeId: string;
  btcmapUrl: string;
}) {
  const { email, businessName, osmNodeId, btcmapUrl } = data;

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Business is Now Live! - Afribit Africa</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border: 1px solid #F7931A; border-radius: 8px; overflow: hidden;">

          <tr>
            <td style="background: linear-gradient(135deg, #F7931A 0%, #ff8c00 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: bold;">🎉 CONGRATULATIONS! 🎉</h1>
              <p style="margin: 10px 0 0 0; color: #000000; font-size: 16px; font-weight: 500;">Your Business is Now Live</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #F7931A; font-size: 24px;">Welcome to the Bitcoin Economy!</h2>

              <p style="margin: 0 0 20px 0; color: #cccccc; font-size: 16px;">
                Dear ${businessName} Team,
              </p>

              <p style="margin: 0 0 20px 0; color: #cccccc; font-size: 14px; line-height: 1.6;">
                We're excited to announce that <strong style="color: #F7931A;">${businessName}</strong> has been successfully published to the global Bitcoin merchant directory! Your business is now discoverable by Bitcoin users worldwide.
              </p>

              <div style="background-color: rgba(247, 147, 26, 0.1); border: 2px solid #F7931A; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #F7931A; font-size: 18px;">Your Listing Details</h3>
                <p style="margin: 0 0 10px 0; color: #888888; font-size: 13px;">OpenStreetMap Node ID:</p>
                <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 14px; font-family: monospace;">${osmNodeId}</p>

                <p style="margin: 0; text-align: center;">
                  <a href="${btcmapUrl}" style="display: inline-block; background-color: #F7931A; color: #000000; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-size: 16px; font-weight: bold;">View Your Listing</a>
                </p>
              </div>

              <div style="background-color: #0a0a0a; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #F7931A; font-size: 18px;">What's Next?</h3>
                <ul style="margin: 0; padding-left: 20px; color: #cccccc; font-size: 14px; line-height: 1.8;">
                  <li>Share your BTCMap listing on social media</li>
                  <li>Display Bitcoin payment acceptance at your location</li>
                  <li>Join our community events and workshops</li>
                  <li>Help onboard other local businesses</li>
                </ul>
              </div>

              <p style="margin: 20px 0 0 0; color: #cccccc; font-size: 14px; line-height: 1.6;">
                Thank you for being part of the Bitcoin revolution in Africa. Together, we're building a more inclusive financial future!
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #0a0a0a; padding: 20px 30px; text-align: center; border-top: 1px solid #333333;">
              <p style="margin: 0 0 10px 0; color: #888888; font-size: 12px;">
                Questions? Contact us at <a href="mailto:info@afribit.africa" style="color: #F7931A; text-decoration: none;">info@afribit.africa</a>
              </p>
              <p style="margin: 0; color: #888888; font-size: 12px;">
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

  try {
    const result = await resend.emails.send({
      from: 'Afribit Merchants <merchants@updates.afribit.africa>',
      to: email,
      subject: `🎉 ${businessName} is Now Live on BTCMap!`,
      html: emailHtml,
      replyTo: 'info@afribit.africa'
    });

    logger.info('Published notification email sent:', result.id);
    return result;
  } catch (error) {
    logger.error('Failed to send published email:', error);
    throw error;
  }
}
