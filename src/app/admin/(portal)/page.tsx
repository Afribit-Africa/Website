import { getAdminSession } from '@/lib/auth'

export default async function AdminHomePage() {
  const session = await getAdminSession()

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin">Status</p>
        <h2 className="text-3xl font-bold">Protected admin shell preserved</h2>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          The public frontend has been archived to clear the workspace for the 2026 rebuild. Admin authentication remains active so backend and role-protected flows can still be validated during implementation.
        </p>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Current session</p>
        <p className="mb-1 text-xl font-semibold text-white">{session?.user.name || session?.user.email}</p>
        <p className="mb-4 text-sm text-muted-foreground">{session?.user.email}</p>
        <div className="inline-flex rounded-full border border-bitcoin/20 bg-bitcoin/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin-light">
          {session?.user.role}
        </div>
      </section>
    </div>
  )
}