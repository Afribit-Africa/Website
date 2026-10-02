import assert from 'node:assert/strict'
import { test } from 'node:test'
import { authOptions } from '../../src/lib/auth'
import { prisma } from '../../src/lib/prisma'

test('JWT permissions refresh from the database and fail closed on revocation or outage', async context => {
  const jwt = authOptions.callbacks!.jwt!
  const run = () => jwt({ token: { sub: 'unit-test-user', role: 'ADMIN' }, trigger: 'update', session: { role: 'ADMIN' } } as Parameters<typeof jwt>[0])
  const original = prisma.user.findUnique
  const lookup = context.mock.fn(async (): Promise<{ role: string } | null> => ({ role: 'EDITOR' }))
  prisma.user.findUnique = lookup as unknown as typeof original
  try {
    assert.equal((await run())?.role, 'EDITOR')
    lookup.mock.mockImplementation(async () => ({ role: 'VIEWER' }))
    assert.equal((await run())?.role, 'VIEWER')
    lookup.mock.mockImplementation(async () => null)
    assert.equal((await run())?.role, 'VIEWER')
    lookup.mock.mockImplementation(async () => { throw new Error('Database unavailable') })
    assert.equal((await run())?.role, 'VIEWER')
  } finally { prisma.user.findUnique = original; await prisma.$disconnect() }
})

test('Google login requires a verified email before looking up permissions', async context => {
  const signIn = authOptions.callbacks!.signIn!
  const original = prisma.user.findUnique
  const lookup = context.mock.fn(async () => { throw new Error('Must not call') })
  prisma.user.findUnique = lookup as unknown as typeof original
  try {
    const result = await signIn({ user: { id: 'unit-test-user', email: 'visitor@example.org' }, account: { provider: 'google', type: 'oauth', providerAccountId: 'test' }, profile: { email: 'visitor@example.org' } })
    assert.equal(result, false)
    assert.equal(lookup.mock.callCount(), 0)
  } finally { prisma.user.findUnique = original }
})
