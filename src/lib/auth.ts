import { getServerSession, type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import type { UserRole } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export function isAdminRole(role: UserRole | null | undefined): role is UserRole {
  return role === 'ADMIN' || role === 'EDITOR'
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'google' || !user.email || !profile || !('email_verified' in profile) || profile.email_verified !== true) {
        return false
      }

      try {
        const adminUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        })

        if (!adminUser || !isAdminRole(adminUser.role)) {
          return false
        }

        user.id = adminUser.id
        user.email = adminUser.email
        user.name = adminUser.name || user.name || adminUser.email
        user.role = adminUser.role

        return true
      } catch (error) {
        console.error('[auth] google sign-in error:', error)
        return false
      }
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id
      }

      // Re-check permissions for every session, including admin API requests.
      // Never accept roles from a client-triggered session update.
      token.role = 'VIEWER'
      if (token.sub) {
        try {
          const current = await prisma.user.findUnique({ where: { id: token.sub }, select: { role: true } })
          if (current && isAdminRole(current.role)) token.role = current.role
        } catch { console.error('[auth] authorization lookup failed') }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }

      if (session.user && token.role) {
        session.user.role = token.role as UserRole
      }

      return session
    },
  },
}

export async function getAuthSession() {
  return getServerSession(authOptions)
}

export async function getAdminSession() {
  const session = await getAuthSession()

  if (!session?.user?.id || !isAdminRole(session.user.role)) {
    return null
  }

  return session
}
