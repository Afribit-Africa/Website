import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { APIErrors } from './api-error-handler';

/**
 * User type with role information (extends NextAuth User type)
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

/**
 * Admin user type
 */
export interface AdminUser extends AuthenticatedUser {
  role: 'admin';
}

/**
 * Verifier user type (admin or verifier)
 */
export interface VerifierUser extends AuthenticatedUser {
  role: 'admin' | 'verifier';
}

/**
 * Require authenticated admin user
 * Throws APIError if not authenticated or not admin
 * 
 * @returns Authenticated admin user
 * @throws {APIError} 401 if not authenticated or not admin
 */
export async function requireAdmin(): Promise<AdminUser> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw APIErrors.Unauthorized('Authentication required');
  }

  // Cast user to include role property (set in session callback)
  const user = session.user as AuthenticatedUser;

  if (user.role !== 'admin') {
    throw APIErrors.Forbidden('Admin access required');
  }

  return user as AdminUser;
}

/**
 * Require authenticated verifier user (admin or verifier role)
 * Throws APIError if not authenticated or not authorized
 * 
 * @returns Authenticated verifier user
 * @throws {APIError} 401 if not authenticated or not authorized
 */
export async function requireVerifier(): Promise<VerifierUser> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw APIErrors.Unauthorized('Authentication required');
  }

  // Cast user to include role property
  const user = session.user as AuthenticatedUser;
  const allowedRoles = ['admin', 'verifier'];
  
  if (!allowedRoles.includes(user.role)) {
    throw APIErrors.Forbidden('Verifier access required');
  }

  return user as VerifierUser;
}

/**
 * Get current authenticated user (optional)
 * Returns null if not authenticated
 * 
 * @returns Authenticated user or null
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const session = await getServerSession(authOptions);
  return session?.user ? (session.user as AuthenticatedUser) : null;
}

/**
 * Check if user is authenticated
 * 
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return !!session?.user;
}

/**
 * Check if current user has admin role
 * 
 * @returns true if admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  const user = session?.user as AuthenticatedUser | undefined;
  return user?.role === 'admin';
}

/**
 * Check if current user has verifier role (admin or verifier)
 * 
 * @returns true if verifier, false otherwise
 */
export async function isVerifier(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  const user = session?.user as AuthenticatedUser | undefined;
  const allowedRoles = ['admin', 'verifier'];
  return !!user && allowedRoles.includes(user.role);
}
