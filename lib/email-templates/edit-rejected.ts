/**
 * Edit Request Rejected Email Template
 *
 * Sent when admin rejects an edit request with a reason.
 */

interface EditRejectedEmailData {
  businessName: string;
  merchantEmail: string;
  rejectionReason: string;
  submittedDate: string;
  contactEmail?: string;
}

export function generateEditRejectedEmail(data: EditRejectedEmailData): string {
  const {
    businessName,
    rejectionReason,
    submittedDate,
    contactEmail = 'support@afribit.africa'
  } = data;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://afribit.africa';
  const submitNewRequestUrl = `${baseUrl}/merchants`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Request Update - Action Required</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 12px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: bold;">AFRIBIT AFRICA</h1>
              <p style="margin: 10px 0 0 0; color: #000000; font-size: 16px; font-weight: 500;">Edit Request Update</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #fbbf24; font-size: 24px; text-align: center;">
                ⚠️ Edit Request Needs Attention
              </h2>

              <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
                Hello <strong>${businessName}</strong> team,
              </p>

              <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Your edit request submitted on <strong>${submittedDate}</strong> could not be approved at this time.
              </p>

              <!-- Rejection Reason -->
              <div style="background-color: rgba(251, 191, 36, 0.1); border-left: 4px solid #fbbf24; border-radius: 4px; padding: 20px; margin: 0 0 30px 0;">
                <h3 style="margin: 0 0 12px 0; color: #fbbf24; font-size: 18px;">
                  📋 Reason for Review
                </h3>
                <p style="margin: 0; color: #ffffff; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${rejectionReason}</p>
              </div>

              <!-- What To Do Next -->
              <div style="background-color: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; border-radius: 4px; padding: 20px; margin: 0 0 30px 0;">
                <h4 style="margin: 0 0 12px 0; color: #3b82f6; font-size: 16px;">What should you do next?</h4>
                <ul style="margin: 0; padding-left: 20px; color: #cccccc; font-size: 14px; line-height: 1.8;">
                  <li><strong>Review the feedback</strong> provided above carefully</li>
                  <li><strong>Gather correct information</strong> - Make sure you have accurate details</li>
                  <li><strong>Submit a new request</strong> with the corrected information</li>
                  <li><strong>Contact support</strong> if you need clarification or assistance</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 0 0 30px 0;">
                <a href="${submitNewRequestUrl}"
                   style="display: inline-block; background: linear-gradient(135deg, #F7931A 0%, #ff8c00 100%); color: #000000; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 15px rgba(247, 147, 26, 0.4);">
                  Submit New Request
                </a>
              </div>

              <!-- Support Section -->
              <div style="background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 20px; text-align: center;">
                <h4 style="margin: 0 0 12px 0; color: #F7931A; font-size: 16px;">Need Help?</h4>
                <p style="margin: 0 0 15px 0; color: #cccccc; font-size: 14px; line-height: 1.6;">
                  If you have questions about this decision or need assistance with your new submission,
                  our support team is here to help.
                </p>
                <a href="mailto:${contactEmail}"
                   style="display: inline-block; color: #F7931A; text-decoration: underline; font-size: 15px; font-weight: 600;">
                  ${contactEmail}
                </a>
              </div>

              <!-- Encouraging Message -->
              <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, rgba(247, 147, 26, 0.05) 0%, rgba(255, 140, 0, 0.05) 100%); border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #cccccc; font-size: 15px; line-height: 1.6;">
                  <strong style="color: #F7931A;">Thank you for your patience!</strong><br>
                  We appreciate your effort to keep your business information accurate on Bitcoin Maps.
                  Your participation helps build a stronger Bitcoin economy in Kenya.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: rgba(255, 255, 255, 0.02); padding: 30px; text-align: center; border-top: 1px solid rgba(251, 191, 36, 0.2);">
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
 * Send edit rejected email via Resend
 */
export async function sendEditRejectedEmail(data: EditRejectedEmailData) {
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const emailHtml = generateEditRejectedEmail(data);

  try {
    const result = await resend.emails.send({
      from: 'Afribit Africa <notifications@updates.afribit.africa>',
      to: data.merchantEmail,
      subject: `Edit Request Update - ${data.businessName}`,
      html: emailHtml,
    });

    console.log('✅ Edit rejected email sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Failed to send edit rejected email:', error);
    return { success: false, error: error.message };
  }
}
