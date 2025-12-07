import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { executeQuery } from '@/lib/db';
import { logger } from '@/lib/logger';

interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  is_active: boolean;
}

// Allowed admin emails for Google OAuth
const ALLOWED_ADMIN_EMAILS = [
  'admin@afribit.co.ke',
  'team@afribit.co.ke',
  'edmundspira@gmail.com',
  'rmdawida@gmail.com',
  'info@afribit.africa',
];

// Allowed verifier emails for Google OAuth
const ALLOWED_VERIFIER_EMAILS = [
  'goldenheartcbo@gmail.com',
  'cyrusmbeki@gmail.com',
  'ondiekibrian9@gmail.com',
  'spiraedmunds@gmail.com',
  'muchasamuel01@gmail.com',
  'mitchjuma44@gmail.com',
  'gracelifelegacy@gmail.com',
  'mercyaloo02@gmail.com',
];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        try {
          // Fetch admin user from database
          const users = await executeQuery<AdminUser[]>(
            'SELECT * FROM admin_users WHERE email = ? AND is_active = true',
            [credentials.email]
          );

          if (!users || users.length === 0) {
            throw new Error('Invalid credentials');
          }

          const user = users[0];

          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user.password_hash);

          if (!isValid) {
            throw new Error('Invalid credentials');
          }

          // Update last login
          await executeQuery(
            'UPDATE admin_users SET last_login_at = NOW() WHERE id = ?',
            [user.id]
          );

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          logger.error('Auth error:', error);
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google OAuth, check if email is in allowed list
      if (account?.provider === 'google') {
        const email = user.email?.toLowerCase();

        const isAdmin = email && ALLOWED_ADMIN_EMAILS.includes(email);
        const isVerifier = email && ALLOWED_VERIFIER_EMAILS.includes(email);

        if (!email || (!isAdmin && !isVerifier)) {
          logger.warn('Unauthorized Google login attempt:', email);
          return false; // Deny access
        }

        // Determine role based on email list
        const role = isAdmin ? 'admin' : 'verifier';

        try {
          // Check if user exists in database
          const users = await executeQuery<AdminUser[]>(
            'SELECT * FROM admin_users WHERE email = ?',
            [email]
          );

          // If user doesn't exist, create them with appropriate role
          // If user exists, update last login and ensure role matches
          if (!users || users.length === 0) {
            const { randomUUID } = await import('crypto');
            await executeQuery(
              `INSERT INTO admin_users (id, email, name, role, password_hash, is_active, last_login_at)
               VALUES (?, ?, ?, ?, 'GOOGLE_OAUTH', true, NOW())`,
              [randomUUID(), email, user.name || email.split('@')[0], role]
            );
          } else {
            // Update last login and role (in case email moved between lists)
            await executeQuery(
              'UPDATE admin_users SET last_login_at = NOW(), role = ? WHERE email = ?',
              [role, email]
            );
          }
        } catch (error) {
          logger.error('Error creating/updating Google user:', error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }

      // For Google OAuth, fetch role from database
      if (account?.provider === 'google' && token.email) {
        try {
          const users = await executeQuery<AdminUser[]>(
            'SELECT role FROM admin_users WHERE email = ?',
            [token.email]
          );
          if (users && users.length > 0) {
            token.role = users[0].role;
          }
        } catch (error) {
          logger.error('Error fetching user role:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || 'admin';
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After successful OAuth login, check user role from database and redirect accordingly
      // This callback runs after signIn callback completes

      // If it's a callback from OAuth provider
      if (url.startsWith(baseUrl)) {
        // Extract the path
        const urlObj = new URL(url);

        // If redirecting to admin pages after login, let middleware handle the role-based redirect
        if (urlObj.pathname.startsWith('/admin') || urlObj.pathname.startsWith('/verifier')) {
          return url;
        }
      }

      // Default to admin dashboard, middleware will redirect verifiers
      return `${baseUrl}/admin/dashboard`;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
