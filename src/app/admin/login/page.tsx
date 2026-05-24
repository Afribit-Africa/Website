import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Admin Login',
  description: 'Sign in to the Afribit Merchant Management portal.',
  path: '/admin/login',
  noIndex: true,
})

const errorMessages: Record<string, string> = {
  AccessDenied: 'This Google account is not authorized for Afribit admin access.',
  OAuthSignin: 'Google sign-in could not be started. Check the OAuth configuration and try again.',
  OAuthCallback: 'Google sign-in did not complete successfully. Try again.',
  Configuration: 'Authentication is not configured correctly for this environment.',
  Default: 'Sign-in failed. Please try again or contact support.',
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await getAdminSession()

  if (session) {
    redirect('/admin')
  }

  const { error } = await searchParams
  const errorMessage = error ? errorMessages[error] ?? errorMessages.Default : null
  const signInHref = '/api/auth/signin/google?callbackUrl=%2Fadmin'

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center md:p-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-bitcoin">Admin Portal</p>
        <h1 className="text-4xl font-bold md:text-5xl">Afribit Merchant Management</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-8 text-muted-foreground">
          Authorized administrators only. Google sign-in remains active while the public frontend is being reset.
        </p>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-left text-sm leading-7 text-red-100">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-8 space-y-4">
          <a
            href={signInHref}
            className="inline-flex w-full items-center justify-center rounded-xl bg-bitcoin px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Sign in with Google
          </a>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-muted-foreground">
            Authorized administrators only.
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Need assistance?{' '}
          <Link href="mailto:connect@afribit.africa" className="text-bitcoin hover:text-white">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}