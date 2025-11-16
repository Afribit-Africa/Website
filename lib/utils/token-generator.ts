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
