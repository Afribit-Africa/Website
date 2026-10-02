import { config } from 'dotenv'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

config({ path: '.env.local', quiet: true })
config({ path: '.env', quiet: true })

async function main() {
  const { prisma } = await import('../../src/lib/prisma')
  try {
    const rows = await prisma.merchant.findMany({ include: { verificationChecks: true, testimonials: true }, orderBy: { name: 'asc' } })
    const publicRows = rows.map((row) => ({
      id: row.id, name: row.name, slug: row.slug, status: row.status, category: row.category,
      osmNodeId: row.osmNodeId, latitude: row.latitude?.toNumber() ?? null, longitude: row.longitude?.toNumber() ?? null,
      lastSurveyedAt: row.lastSurveyedAt, lastVerificationMethod: row.lastVerificationMethod,
      featured: row.featured, checks: row.verificationChecks.length, testimonials: row.testimonials.length,
    }))
    const report = { auditedAt: new Date().toISOString(), total: rows.length, active: rows.filter((row) => row.status === 'ACTIVE').length, rows: publicRows }
    await mkdir('docs/maintenance', { recursive: true })
    await writeFile('docs/maintenance/merchant-audit.json', JSON.stringify(report, null, 2) + '\n')
    console.log(JSON.stringify(report, null, 2))
    if (process.argv.includes('--backup')) {
      const directory = path.resolve('.maintenance-private')
      await mkdir(directory, { recursive: true })
      const file = path.join(directory, `merchants-${new Date().toISOString().replaceAll(':', '-')}.json`)
      await writeFile(file, JSON.stringify({ backedUpAt: new Date().toISOString(), merchants: rows }, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
      console.log(`Private merchant backup: ${file}`)
    }
  } finally { await prisma.$disconnect() }
}

main().catch(() => { console.error('Merchant audit failed; database credentials withheld.'); process.exitCode = 1 })
