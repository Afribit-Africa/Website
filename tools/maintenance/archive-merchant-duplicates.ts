import { config } from 'dotenv'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { merchantDuplicatePlan } from '../../src/lib/merchant-duplicates'

config({ path: '.env.local', quiet: true })
config({ path: '.env', quiet: true })

async function main() {
  const { prisma } = await import('../../src/lib/prisma')
  try {
    const rows = await prisma.merchant.findMany({ include: { verificationChecks: true, testimonials: true } })
    const plan = merchantDuplicatePlan.map(entry => {
      const canonical = rows.find(row => row.id === entry.canonicalId)
      const duplicate = rows.find(row => row.id === entry.duplicateId)
      if (!canonical || !duplicate || canonical.status !== 'ACTIVE' || canonical.name !== entry.name || duplicate.name !== entry.name || canonical.slug !== entry.canonicalSlug || duplicate.slug !== entry.duplicateSlug || canonical.osmNodeId !== entry.nodeId || duplicate.osmNodeId !== `${entry.nodeId}-dup` || !['ACTIVE', 'ARCHIVED'].includes(duplicate.status)) {
        throw new Error('Reviewed identity or status changed; aborting')
      }
      return { entry, canonical, duplicate }
    })
    console.log(JSON.stringify(plan.map(({ entry, duplicate }) => ({ ...entry, action: duplicate.status === 'ARCHIVED' ? 'already archived' : 'archive import copy', retainedChecks: duplicate.verificationChecks.length, retainedTestimonials: duplicate.testimonials.length })), null, 2))
    if (!process.argv.includes('--apply')) { console.log('Dry run only. Use --apply to back up and archive these two reviewed copies.'); return }
    const directory = path.resolve('.maintenance-private')
    await mkdir(directory, { recursive: true })
    const backup = path.join(directory, `merchants-before-dedup-${new Date().toISOString().replaceAll(':', '-')}.json`)
    await writeFile(backup, JSON.stringify({ backedUpAt: new Date().toISOString(), merchants: rows }, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
    await prisma.$transaction(async tx => {
      for (const { entry, canonical, duplicate } of plan) {
        const current = await tx.merchant.findUnique({ where: { id: canonical.id }, select: { updatedAt: true, status: true } })
        if (!current || current.status !== 'ACTIVE' || current.updatedAt.getTime() !== canonical.updatedAt.getTime()) throw new Error('Canonical changed; aborting')
        if (duplicate.status === 'ARCHIVED') continue
        const result = await tx.merchant.updateMany({
          where: { id: duplicate.id, slug: entry.duplicateSlug, osmNodeId: `${entry.nodeId}-dup`, status: 'ACTIVE', updatedAt: duplicate.updatedAt },
          data: { status: 'ARCHIVED' },
        })
        if (result.count !== 1) throw new Error('Duplicate changed; aborting')
      }
    }, { isolationLevel: 'Serializable' })
    console.log(`Archived reviewed copies. All records, history and canonical GPS retained. Private backup: ${backup}`)
  } finally { await prisma.$disconnect() }
}

main().catch(() => { console.error('Duplicate cleanup aborted. No credentials or private merchant details logged.'); process.exitCode = 1 })
