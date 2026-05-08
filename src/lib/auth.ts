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
    async signIn({ user, account }) {
      if (account?.provider !== 'google' || !user.email) {
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

      if (user?.role) {
        token.role = user.role
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