/**
 * Changes Applied Email Template
 *
 * Sent after admin applies confirmed changes to the database and OSM.
 * Notifies merchant that their information is now live.
 */

interface ChangesAppliedEmailData {
  businessName: string;
  merchantEmail: string;
  osmNodeId?: string;
  updatedFields: string[]; // Array of field names that were updated
  viewMapUrl: string;
  btcMapUrl?: string;
}

export function generateChangesAppliedEmail(data: ChangesAppliedEmailData): string {
  const {
    businessName,
    osmNodeId,
    updatedFields,
    viewMapUrl,
    btcMapUrl
  } = data;

  const hasOsmLink = osmNodeId && btcMapUrl;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Business Information Has Been Updated</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; border: 1px solid rgba(74, 222, 128, 0.3); border-radius: 12px; overflow: hidden;">

          <!-- Header with Success Badge -->
          <tr>
            <td style="background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); padding: 50px 30px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 10px;">✓</div>
              <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: bold;">Changes Applied!</h1>
              <p style="margin: 10px 0 0 0; color: #000000; font-size: 16px; font-weight: 500;">Your business is now updated on Bitcoin Maps</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #4ade80; font-size: 24px; text-align: center;">
                🎉 ${businessName} is Live!
              </h2>

              <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Great news! Your confirmed changes have been successfully applied to our database and published to Bitcoin Maps.
              </p>

              <!-- Updated Fields -->
              <div style="background-color: rgba(74, 222, 128, 0.1); border-left: 4px solid #4ade80; border-radius: 4px; padding: 20px; margin: 0 0 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #4ade80; font-size: 18px;">
                  📝 Updated Information
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #cccccc; font-size: 15px; line-height: 1.8;">
                  ${updatedFields.map(field => `<li>${field}</li>`).join('\n                  ')}
                </ul>
              </div>

              <!-- View Your Business Section -->
              <div style="background: linear-gradient(135deg, rgba(247, 147, 26, 0.1) 0%, rgba(255, 140, 0, 0.1) 100%); border: 1px solid rgba(247, 147, 26, 0.3); border-radius: 8px; padding: 25px; margin: 0 0 30px 0;">
                <h3 style="margin: 0 0 20px 0; color: #F7931A; font-size: 18px; text-align: center;">
                  📍 View Your Updated Listing
                </h3>

                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding-bottom: ${hasOsmLink ? '15px' : '0'};">
                      <a href="${viewMapUrl}"
                         style="display: inline-block; background: linear-gradient(135deg, #F7931A 0%, #ff8c00 100%); color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(247, 147, 26, 0.4);">
                        🗺️ View on Afribit Map
                      </a>
                    </td>
                  </tr>
                  ${hasOsmLink ? `
                  <tr>
                    <td align="center">
                      <a href="${btcMapUrl}"
                         style="display: inline-block; background-color: rgba(255, 255, 255, 0.1); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; border: 1px solid rgba(255, 255, 255, 0.2);">
                        🌍 View on BTCMap.org
                      </a>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- What's Next -->
              <div style="background-color: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; border-radius: 4px; padding: 20px; margin: 0 0 30px 0;">
                <h4 style="margin: 0 0 12px 0; color: #3b82f6; font-size: 16px;">What's next for your business?</h4>
                <ul style="margin: 0; padding-left: 20px; color: #cccccc; font-size: 14px; line-height: 1.8;">
                  <li><strong>Your location is now accurate</strong> - Bitcoin users can easily find you</li>
                  <li><strong>Visible on multiple maps</strong> - Listed on BTCMap, OpenStreetMap, and Afribit Map</li>
                  <li><strong>Part of the Bitcoin economy</strong> - Join 40+ early adopter merchants in Kibera</li>
                  <li><strong>Need more changes?</strong> You can always submit another edit request</li>
                </ul>
              </div>

              <!-- Thank You Message -->
              <div style="text-align: center; padding: 20px; background-color: rgba(255, 255, 255, 0.03); border-radius: 8px;">
                <p style="margin: 0 0 10px 0; color: #F7931A; font-size: 18px; font-weight: bold;">
                  Thank You for Being an Early Adopter! 🙏
                </p>
                <p style="margin: 0; color: #cccccc; font-size: 15px; line-height: 1.6;">
                  You're helping build the Bitcoin economy in Kenya. Your participation makes a real difference
                  in bringing financial freedom to our community.
                </p>
              </div>

              <!-- Support -->
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <p style="margin: 0; color: #999999; font-size: 14px; text-align: center;">
                  Questions or concerns? Contact us at
                  <a href="mailto:support@afribit.africa" style="color: #F7931A; text-decoration: underline;">support@afribit.africa</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: rgba(255, 255, 255, 0.02); padding: 30px; text-align: center; border-top: 1px solid rgba(74, 222, 128, 0.2);">
              <p style="margin: 0 0 10px 0; color: #999999; font-size: 14px;">
                Building the Bitcoin Economy in Kenya
              </p>
              <p style="margin: 0; color: #666666; font-size: 12px;">
                Afribit Africa | <a href="https://afribit.africa" style="color: #F7931A; text-decoration: none;">afribit.africa</a>
              </p>
              <p style="margin: 10px 0 0 0; color: #666666; font-size: 11px;">
                You're receiving this because changes were applied to your business listing
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
 * Send changes applied email via Resend
 */
export async function sendChangesAppliedEmail(data: ChangesAppliedEmailData) {
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const emailHtml = generateChangesAppliedEmail(data);

  try {
    const result = await resend.emails.send({
      from: 'Afribit Africa <updates@updates.afribit.africa>',
      to: data.merchantEmail,
      subject: `✓ ${data.businessName} Updated on Bitcoin Maps`,
      html: emailHtml,
    });

    console.log('✅ Changes applied email sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Failed to send changes applied email:', error);
    return { success: false, error: error.message };
  }
}
