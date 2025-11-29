/**
 * Merchant Confirmation Email Template
 *
 * Sent after admin approves an edit request.
 * Contains confirmation link that merchant must click to verify changes.
 */

interface MerchantConfirmationEmailData {
  businessName: string;
  merchantEmail: string;
  confirmationToken: string;
  expiresInDays: number;
  changes: {
    businessName?: { old: string; new: string };
    category?: { old: string; new: string };
    address?: { old: string; new: string };
    phone?: { old: string; new: string };
    blinkAddress?: { old: string; new: string };
    location?: {
      old: { lat: number; lng: number };
      new: { lat: number; lng: number };
      distance: number; // in meters
    };
  };
}

export function generateMerchantConfirmationEmail(data: MerchantConfirmationEmailData): string {
  const {
    businessName,
    merchantEmail,
    confirmationToken,
    expiresInDays,
    changes
  } = data;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://afribit.africa';
  const confirmationUrl = `${baseUrl}/api/confirm-merchant/${confirmationToken}`;

  // Count number of changes
  const changeCount = Object.keys(changes).length;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Business Information Changes</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; border: 1px solid rgba(247, 147, 26, 0.3); border-radius: 12px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #F7931A 0%, #ff8c00 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: bold;">AFRIBIT AFRICA</h1>
              <p style="margin: 10px 0 0 0; color: #000000; font-size: 16px; font-weight: 500;">Bitcoin Map Verification</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #F7931A; font-size: 24px; text-align: center;">
                🎯 Please Confirm Your Business Changes
              </h2>

              <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hello <strong>${businessName}</strong> team,
              </p>

              <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                An administrator has reviewed your edit request and <span style="color: #4ade80; font-weight: bold;">approved the changes</span>.
                Before we update your information on Bitcoin Maps, we need you to confirm these changes are correct.
              </p>

              <!-- Changes Summary -->
              <div style="background-color: rgba(255, 255, 255, 0.05); border-left: 4px solid #F7931A; border-radius: 4px; padding: 20px; margin: 0 0 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #F7931A; font-size: 18px;">
                  📋 Proposed Changes (${changeCount} field${changeCount !== 1 ? 's' : ''})
                </h3>

                <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
                  ${changes.businessName ? `
                  <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <td colspan="3" style="padding: 12px 0 4px 0;">
                      <strong style="color: #F7931A;">Business Name:</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #999999; width: 60px;">Old:</td>
                    <td style="color: #ff6b6b; text-decoration: line-through;">${changes.businessName.old}</td>
                  </tr>
                  <tr>
                    <td style="color: #999999;">New:</td>
                    <td style="color: #4ade80; font-weight: bold;">${changes.businessName.new}</td>
                  </tr>
                  ` : ''}

                  ${changes.category ? `
                  <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <td colspan="3" style="padding: 12px 0 4px 0;">
                      <strong style="color: #F7931A;">Category:</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #999999;">Old:</td>
                    <td style="color: #ff6b6b; text-decoration: line-through;">${changes.category.old}</td>
                  </tr>
                  <tr>
                    <td style="color: #999999;">New:</td>
                    <td style="color: #4ade80; font-weight: bold;">${changes.category.new}</td>
                  </tr>
                  ` : ''}

                  ${changes.address ? `
                  <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <td colspan="3" style="padding: 12px 0 4px 0;">
                      <strong style="color: #F7931A;">Address:</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #999999;">Old:</td>
                    <td style="color: #ff6b6b; text-decoration: line-through;">${changes.address.old}</td>
                  </tr>
                  <tr>
                    <td style="color: #999999;">New:</td>
                    <td style="color: #4ade80; font-weight: bold;">${changes.address.new}</td>
                  </tr>
                  ` : ''}

                  ${changes.phone ? `
                  <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <td colspan="3" style="padding: 12px 0 4px 0;">
                      <strong style="color: #F7931A;">Phone:</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #999999;">Old:</td>
                    <td style="color: #ff6b6b; text-decoration: line-through;">${changes.phone.old}</td>
                  </tr>
                  <tr>
                    <td style="color: #999999;">New:</td>
                    <td style="color: #4ade80; font-weight: bold;">${changes.phone.new}</td>
                  </tr>
                  ` : ''}

                  ${changes.blinkAddress ? `
                  <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <td colspan="3" style="padding: 12px 0 4px 0;">
                      <strong style="color: #F7931A;">Blink Address:</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #999999;">Old:</td>
                    <td style="color: #ff6b6b; text-decoration: line-through;">${changes.blinkAddress.old || 'Not set'}</td>
                  </tr>
                  <tr>
                    <td style="color: #999999;">New:</td>
                    <td style="color: #4ade80; font-weight: bold;">${changes.blinkAddress.new}</td>
                  </tr>
                  ` : ''}

                  ${changes.location ? `
                  <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <td colspan="3" style="padding: 12px 0 4px 0;">
                      <strong style="color: #F7931A;">Location (GPS Coordinates):</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #999999;">Old:</td>
                    <td style="color: #ff6b6b; text-decoration: line-through;">${changes.location.old.lat.toFixed(6)}, ${changes.location.old.lng.toFixed(6)}</td>
                  </tr>
                  <tr>
                    <td style="color: #999999;">New:</td>
                    <td style="color: #4ade80; font-weight: bold;">${changes.location.new.lat.toFixed(6)}, ${changes.location.new.lng.toFixed(6)}</td>
                  </tr>
                  <tr>
                    <td style="color: #999999;">Distance:</td>
                    <td style="color: #F7931A;">${changes.location.distance < 1000 ? Math.round(changes.location.distance) + ' meters' : (changes.location.distance / 1000).toFixed(2) + ' km'}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 0 0 30px 0;">
                <a href="${confirmationUrl}"
                   style="display: inline-block; background: linear-gradient(135deg, #F7931A 0%, #ff8c00 100%); color: #000000; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 15px rgba(247, 147, 26, 0.4);">
                  ✓ Confirm These Changes
                </a>
              </div>

              <!-- Expiry Warning -->
              <div style="background-color: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 8px; padding: 15px; margin: 0 0 30px 0;">
                <p style="margin: 0; color: #fbbf24; font-size: 14px; text-align: center;">
                  <strong>⏰ Action Required:</strong> This confirmation link expires in <strong>${expiresInDays} days</strong>.
                  Please confirm your changes before then.
                </p>
              </div>

              <!-- What Happens Next -->
              <div style="background-color: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; border-radius: 4px; padding: 20px; margin: 0 0 30px 0;">
                <h4 style="margin: 0 0 12px 0; color: #3b82f6; font-size: 16px;">What happens after you confirm?</h4>
                <ol style="margin: 0; padding-left: 20px; color: #cccccc; font-size: 14px; line-height: 1.8;">
                  <li>Your confirmed information will be marked as verified</li>
                  <li>An administrator will apply the changes to our database</li>
                  <li>Your business will be updated on Bitcoin Maps and OpenStreetMap</li>
                  <li>You'll receive a final confirmation email with links to view your updated listing</li>
                </ol>
              </div>

              <!-- Security Note -->
              <div style="background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 15px;">
                <p style="margin: 0; color: #999999; font-size: 13px;">
                  <strong style="color: #F7931A;">Didn't request this change?</strong><br>
                  If you didn't submit an edit request for ${businessName}, please contact us immediately at
                  <a href="mailto:support@afribit.africa" style="color: #F7931A; text-decoration: underline;">support@afribit.africa</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: rgba(255, 255, 255, 0.02); padding: 30px; text-align: center; border-top: 1px solid rgba(247, 147, 26, 0.2);">
              <p style="margin: 0 0 10px 0; color: #999999; font-size: 14px;">
                Building the Bitcoin Economy in Kenya
              </p>
              <p style="margin: 0; color: #666666; font-size: 12px;">
                Afribit Africa | <a href="https://afribit.africa" style="color: #F7931A; text-decoration: none;">afribit.africa</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send merchant confirmation email via Resend
 */
export async function sendMerchantConfirmationEmail(data: MerchantConfirmationEmailData) {
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const emailHtml = generateMerchantConfirmationEmail(data);

  try {
    const result = await resend.emails.send({
      from: 'Afribit Africa <confirmations@updates.afribit.africa>',
      to: data.merchantEmail,
      subject: `Please Confirm Your Business Changes - ${data.businessName}`,
      html: emailHtml,
    });

    console.log('✅ Merchant confirmation email sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Failed to send merchant confirmation email:', error);
    return { success: false, error: error.message };
  }
}
