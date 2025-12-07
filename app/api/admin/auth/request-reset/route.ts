import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { executeQuery } from '@/lib/db';
import { logger } from '@/lib/logger';
import { sendPasswordResetEmail } from '@/lib/resend-email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if admin user exists
    const [users] = await executeQuery<any[]>(
      'SELECT id, email, name FROM admin_users WHERE email = ? AND is_active = true',
      [email]
    );

    if (!users || users.length === 0) {
      // Don't reveal if email exists or not (security)
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    }

    const user = users[0];
    const resetToken = randomUUID();
    const resetExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    await executeQuery(
      `UPDATE admin_users
       SET reset_token = ?, reset_token_expiry = ?
       WHERE id = ?`,
      [resetToken, resetExpiry, user.id]
    );

    // Send password reset email
    const resetLink = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${resetToken}`;

    try {
      await sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        resetLink,
        expiresAt: resetExpiry,
      });
      logger.info('Password reset email sent to:', email);
    } catch (emailError) {
      logger.error('Failed to send password reset email:', emailError);
      // Continue anyway - user can contact support
    }

    // Log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Password reset link:', resetLink);
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process password reset request';
    logger.error('Password reset request error:', message);
    return NextResponse.json(
      { success: false, error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
