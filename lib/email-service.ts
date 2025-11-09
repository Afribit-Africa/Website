import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
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

  console.log('Preparing email for:', donorEmail);
  console.log('Email config:', {
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
    console.log('Attempting to send email via transporter...');
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: donorEmail,
      subject: `Thank You for Your Donation - Receipt #${invoiceId.substring(0, 8)}`,
      text: emailText,
      html: emailHtml,
    });
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Transporter sendMail error:', error);
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
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}
