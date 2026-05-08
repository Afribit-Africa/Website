import type { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'

export default async function AdminPortalLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <header className="mx-auto mb-8 flex w-full max-w-5xl items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-bitcoin">Admin Portal</p>
          <h1 className="text-xl font-bold">Afribit Merchant Management</h1>
        </div>
        <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-bitcoin">
          Back to site
        </Link>
      </header>
      <main className="mx-auto w-full max-w-5xl">{children}</main>
    </div>
  )
}