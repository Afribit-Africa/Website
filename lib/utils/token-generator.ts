// Secure token generation for merchant edit functionality

import crypto from 'crypto';

/**
 * Generate a cryptographically secure random token for merchant edit links
 * @param length - Length of the token (default: 32 bytes = 64 hex characters)
 * @returns Secure random token string
 */
export function generateEditToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a shorter submission ID for display (e.g., in emails)
 * @returns 8-character alphanumeric ID
 */
export function generateShortId(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

/**
 * Hash a token for secure storage (optional, for additional security)
 * @param token - Token to hash
 * @returns SHA256 hash of the token
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a cryptographically secure confirmation token for admin approval workflow
 * Used in two-step approval: admin approves → merchant confirms → admin applies
 *
 * @returns Base64URL-encoded token string (URL-safe, no padding)
 * @example
 * const token = generateConfirmationToken();
 * // Returns: "xK8fN2pQ7vR4mW9sL3dH1jY6cE5tB0aZ9uI8oP7nM4k"
 */
export function generateConfirmationToken(): string {
  // Generate 32 bytes (256 bits) of random data for maximum security
  const buffer = crypto.randomBytes(32);

  // Convert to base64url encoding (URL-safe: no +, /, or = characters)
  return buffer.toString('base64url');
}

/**
 * Verify a token matches a stored hash using constant-time comparison
 * Prevents timing attacks that could guess the token
 *
 * @param token - The plain token from the URL
 * @param storedHash - The hash from the database
 * @returns True if token is valid
 * @example
 * const isValid = verifyToken(urlToken, dbHash);
 * if (!isValid) throw new Error('Invalid token');
 */
export function verifyToken(token: string, storedHash: string): boolean {
  const tokenHash = hashToken(token);

  // Use timingSafeEqual to prevent timing attacks
  try {
    const tokenBuffer = Buffer.from(tokenHash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');

    return crypto.timingSafeEqual(tokenBuffer, storedBuffer);
  } catch {
    // Buffers have different lengths - not a valid match
    return false;
  }
}

/**
 * Check if a confirmation token has expired
 *
 * @param expiresAt - The expiration timestamp from the database
 * @returns True if token is expired
 * @example
 * if (isTokenExpired(request.token_expires_at)) {
 *   return { error: 'Token has expired' };
 * }
 */
export function isTokenExpired(expiresAt: Date | string): boolean {
  const expiryDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  return new Date() > expiryDate;
}

/**
 * Get token expiry date
 *
 * @param daysFromNow - Number of days until expiry (default: 7)
 * @returns Date object for token expiration
 * @example
 * const expiresAt = getTokenExpiry(7);
 * // Returns: Date 7 days from now
 */
export function getTokenExpiry(daysFromNow: number = 7): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + daysFromNow);
  return expiry;
}

/**
 * Generate confirmation token with expiry information
 * Convenience function for the two-step approval workflow
 *
 * @param daysUntilExpiry - Number of days until expiry (default: 7)
 * @returns Object with plain token, hashed token, and expiry date
 * @example
 * const { token, hash, expiresAt } = generateTokenWithExpiry();
 * // Send token in email, store hash and expiresAt in database
 */
export function generateTokenWithExpiry(daysUntilExpiry: number = 7) {
  const token = generateConfirmationToken();
  const hash = hashToken(token);
  const expiresAt = getTokenExpiry(daysUntilExpiry);

  return {
    token,        // Send this in the confirmation email
    hash,         // Store this in the database (confirmation_token column)
    expiresAt     // Store this in token_expires_at column
  };
}

/**
 * Generate a secure edit URL for merchants
 * @param submissionId - UUID of the submission
 * @param editToken - Secure edit token
 * @param baseUrl - Base URL of the application
 * @returns Complete edit URL
 */
export function generateEditUrl(
  submissionId: string,
  editToken: string,
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'https://afribit.co.ke'
): string {
  return `${baseUrl}/merchants/edit/${submissionId}?token=${editToken}`;
}
