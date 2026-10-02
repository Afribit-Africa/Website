import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { test } from 'node:test'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const { Prisma } = require('@prisma/client')
const root = fileURLToPath(new URL('../../', import.meta.url))
const webhookPath = 'src/app/api/donations/webhook/route.ts'
const createPath = 'src/app/api/donations/create-invoice/route.ts'
const statusPath = 'src/app/api/donations/check-status/[invoiceId]/route.ts'
const statsPath = 'src/app/api/donations/stats/route.ts'

function donation(overrides = {}) {
  return {
    id: 'donation-one', btcpayInvoiceId: 'invoice-one',
    amount: new Prisma.Decimal('10'), currency: 'USD', btcAmount: null,
    status: 'PENDING', completedAt: null, createdAt: new Date(0),
    donorName: 'Offline Supporter', donorEmail: 'supporter@example.invalid',
    message: null, isAnonymous: false, program: 'merchants', programId: 'program-one',
    ...overrides,
  }
}

function matches(record, where) {
  return Object.entries(where).every(([key, expected]) => {
    if (expected === undefined) return true
    if (expected && typeof expected === 'object' && 'not' in expected) return record[key] !== expected.not
    if (Prisma.Decimal.isDecimal(expected)) return expected.equals(record[key])
    return record[key] === expected
  })
}

function database(records = [donation()]) {
  let state = {
    records: records.map((record) => ({ ...record })),
    program: { id: 'program-one', slug: 'merchants', name: 'Merchant Program', raised: new Prisma.Decimal(0) },
  }
  const calls = { reads: 0, writes: 0, transactions: 0 }
  let failProgramUpdate = false
  let failTotals = false
  let queue = Promise.resolve()

  function client(getState) {
    return {
      donation: {
        async findUnique({ where }) {
          calls.reads++
          const record = getState().records.find((item) => matches(item, where))
          return record ? { ...record } : null
        },
        async create({ data }) {
          calls.writes++
          const record = donation({ ...data, amount: new Prisma.Decimal(data.amount), id: 'new-donation' })
          getState().records.push(record)
          return { ...record }
        },
        async updateMany({ where, data }) {
          calls.writes++
          let count = 0
          for (const record of getState().records) {
            if (matches(record, where)) {
              Object.assign(record, data)
              count++
            }
          }
          return { count }
        },
        async groupBy() {
          if (failTotals) throw new Error('Synthetic database failure')
          const groups = new Map()
          for (const record of getState().records.filter((item) => item.status === 'COMPLETED')) {
            const group = groups.get(record.currency) || {
              currency: record.currency, _sum: { amount: new Prisma.Decimal(0) }, _count: { id: 0 },
            }
            group._sum.amount = group._sum.amount.plus(record.amount)
            group._count.id++
            groups.set(record.currency, group)
          }
          return [...groups.values()]
        },
      },
      program: {
        async findUnique({ where }) {
          const program = getState().program
          return program && matches(program, where) ? { ...program } : null
        },
        async update({ data }) {
          calls.writes++
          if (failProgramUpdate) throw new Error('Synthetic program update failure')
          const program = getState().program
          program.raised = program.raised.plus(data.raised.increment)
          return { ...program }
        },
      },
    }
  }

  const prisma = client(() => state)
  prisma.$transaction = (callback) => {
    calls.transactions++
    const pending = queue.then(async () => {
      const draft = {
        records: state.records.map((record) => ({ ...record })),
        program: state.program ? { ...state.program } : null,
      }
      const result = await callback(client(() => draft))
      state = draft
      return result
    })
    queue = pending.then(() => undefined, () => undefined)
    return pending
  }
  return {
    prisma, calls, current: () => state,
    failProgramUpdate: (value) => { failProgramUpdate = value },
    failTotals: () => { failTotals = true },
  }
}

// Evaluate the real routes with a closed dependency list: no live Prisma, SMTP, or HTTP.
function harness(options = {}) {
  const db = database(options.records)
  const env = {
    BTCPAY_CHECKOUT_ENABLED: 'true',
    BTCPAY_API_KEY: 'offline-key', BTCPAY_STORE_ID: 'offline-store',
    BTCPAY_HOST: 'https://offline.example.invalid', BTCPAY_WEBHOOK_SECRET: 'offline-secret',
  }
  const calls = { invoiceCreates: [], invoiceReads: [], storeReads: 0, emails: [] }
  let invoice = {
    id: 'invoice-one', status: 'Settled', amount: '10.00', currency: 'USD',
    createdTime: 0, expirationTime: 1000, checkoutLink: 'https://offline.example.invalid/checkout',
    ...options.invoice,
  }
  let invoiceFailure = false
  let storeFailure = false
  const cache = new Map()
  const dependencies = {
    '@prisma/client': require('@prisma/client'),
    zod: require('zod'), crypto,
    'next/server': { NextResponse: Response, NextRequest: Request },
    '@/lib/prisma': { prisma: db.prisma },
    '@/lib/email': { sendEmail: async (email) => { calls.emails.push(email); return { success: true } } },
    '@/lib/email-templates': {
      donationConfirmationEmail: () => ({ subject: 'Offline receipt', html: 'Offline receipt' }),
      adminDonationNotification: () => ({ subject: 'Offline notification', html: 'Offline notification' }),
    },
    'btcpay-greenfield-node-client': {
      OpenAPI: {},
      InvoicesService: {
        async invoicesCreateInvoice(input) {
          calls.invoiceCreates.push(input)
          return { ...invoice, amount: input.requestBody.amount, currency: input.requestBody.currency }
        },
        async invoicesGetInvoice(input) {
          calls.invoiceReads.push(input)
          if (invoiceFailure) throw new Error('Synthetic provider failure')
          return { ...invoice }
        },
        async invoicesGetInvoices() {
          calls.storeReads++
          if (storeFailure) throw new Error('Synthetic provider failure')
          return options.storeInvoices || []
        },
      },
    },
  }

  function load(relativePath) {
    const filename = path.resolve(root, relativePath)
    if (!filename.startsWith(path.join(root, 'src') + path.sep)) throw new Error('Blocked module path')
    if (cache.has(filename)) return cache.get(filename)
    const exports = {}
    cache.set(filename, exports)
    const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText
    vm.runInNewContext(code, {
      exports, Buffer, Date, JSON, SyntaxError, process: { env },
      console: { error() {}, warn() {}, log() {} },
      fetch() { throw new Error('Network access is prohibited in donation tests') },
      require(name) {
        if (Object.hasOwn(dependencies, name)) return dependencies[name]
        if (name.startsWith('@/')) return load('src/' + name.slice(2) + '.ts')
        if (name.startsWith('./')) return load(path.relative(root, path.resolve(path.dirname(filename), name + '.ts')))
        throw new Error('Blocked dependency: ' + name)
      },
    }, { filename })
    return exports
  }

  function webhookRequest(overrides = {}, signatureOverride) {
    const raw = JSON.stringify({
      type: 'InvoiceSettled', invoiceId: 'invoice-one', storeId: env.BTCPAY_STORE_ID,
      deliveryId: 'delivery-one', ...overrides,
    })
    const signature = 'sha256=' + crypto.createHmac('sha256', env.BTCPAY_WEBHOOK_SECRET).update(raw).digest('hex')
    return new Request('https://offline.example.invalid/api/donations/webhook', {
      method: 'POST', headers: { 'btcpay-sig': signatureOverride ?? signature }, body: raw,
    })
  }

  return {
    db, env, calls, load, webhookRequest,
    setInvoice: (changes) => { invoice = { ...invoice, ...changes } },
    failInvoice: () => { invoiceFailure = true }, failStore: () => { storeFailure = true },
    create: (body) => load(createPath).POST(Object.assign(new Request('https://offline.example.invalid/api/donations/create-invoice', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    }), { nextUrl: new URL('https://offline.example.invalid') })),
    webhook: (payload, signature) => load(webhookPath).POST(webhookRequest(payload, signature)),
    status: (invoiceId = 'invoice-one') => load(statusPath).GET({}, { params: Promise.resolve({ invoiceId }) }),
  }
}

test('official HMAC headers verify exact bytes; malformed, tampered, and bare signatures fail', () => {
  const { verifyWebhookSignature } = harness().load('src/lib/btcpay.ts')
  const bytes = Buffer.from([0x7b, 0x22, 0xc3, 0xa9, 0x22, 0x7d])
  const digest = crypto.createHmac('sha256', 'offline-secret').update(bytes).digest('hex')
  assert.equal(verifyWebhookSignature(bytes, 'sha256=' + digest, 'offline-secret'), true)
  for (const signature of ['', digest, 'sha256=x', 'sha256=' + digest + '00', 'SHA256=' + digest]) {
    assert.equal(verifyWebhookSignature(bytes, signature, 'offline-secret'), false)
  }
  assert.equal(verifyWebhookSignature(Buffer.from('tampered'), 'sha256=' + digest, 'offline-secret'), false)
  assert.equal(verifyWebhookSignature(bytes, 'sha256=' + digest, 'wrong-secret'), false)
  assert.equal(verifyWebhookSignature(bytes, 'sha256=' + digest, ''), false)
})

test('invoice bounds and rounding overflow fail before provider calls or DB writes', async () => {
  for (const amount of [100_000_000_000, 1e20, 99_999_999_999.9999, -1, 0, null]) {
    const h = harness({ records: [] })
    const response = await h.create({ amount, currency: 'USD' })
    assert.equal(response.status, 400, String(amount))
    assert.equal(h.calls.invoiceCreates.length, 0)
    assert.equal(h.db.calls.writes, 0)
  }
  const { donationInvoiceSchema } = harness().load('src/lib/donation-validation.ts')
  for (const amount of [NaN, Infinity, -Infinity]) {
    assert.equal(donationInvoiceSchema.safeParse({ amount }).success, false)
  }
})

test('SDK helper rejects oversized amounts without issuing an invoice', async () => {
  const h = harness()
  await assert.rejects(h.load('src/lib/btcpay.ts').createInvoice({ amount: 100_000_000_000 }))
  assert.equal(h.calls.invoiceCreates.length, 0)
})

test('checkout requires an exact explicit opt-in even when old credentials exist', async () => {
  for (const flag of [undefined, '', 'false', 'True', '1']) {
    const h = harness({ records: [] })
    if (flag === undefined) delete h.env.BTCPAY_CHECKOUT_ENABLED
    else h.env.BTCPAY_CHECKOUT_ENABLED = flag
    assert.equal((await h.create({ amount: 10 })).status, 503)
    await assert.rejects(h.load('src/lib/btcpay.ts').createInvoice({ amount: 10 }))
    assert.equal(h.calls.invoiceCreates.length, 0)
    assert.equal(h.db.calls.reads, 0)
    assert.equal(h.db.calls.writes, 0)
  }
})

test('disabled checkout retains status and webhook processing for old invoices', async () => {
  const h = harness()
  delete h.env.BTCPAY_CHECKOUT_ENABLED
  assert.equal((await h.status()).status, 200)
  assert.equal((await h.webhook()).status, 200)
  assert.equal(h.calls.invoiceCreates.length, 0)
  assert.equal(h.db.current().program.raised.toString(), '10')
})

test('valid upper USD bound and decimal normalization preserve the provider and DB amount', async () => {
  for (const [amount, expected] of [[99_999_999_999.99, '99999999999.99'], [1.005, '1.01']]) {
    const h = harness({ records: [] })
    assert.equal((await h.create({ amount, currency: 'USD' })).status, 200)
    assert.equal(h.calls.invoiceCreates[0].requestBody.amount, expected)
    assert.equal(h.db.current().records[0].amount.toString(), expected)
  }
})

test('anonymous invoices persist the flag and omit email and real name from provider metadata', async () => {
  const h = harness({ records: [] })
  assert.equal((await h.create({ amount: 10, donorEmail: 'private@example.invalid', donorName: 'Private Person', isAnonymous: true })).status, 200)
  const serialized = JSON.stringify(h.calls.invoiceCreates[0].requestBody.metadata)
  assert.equal(serialized.includes('private@example.invalid'), false)
  assert.equal(serialized.includes('Private Person'), false)
  assert.equal(h.db.current().records[0].isAnonymous, true)
  assert.equal(h.db.current().records[0].donorEmail, null)
})

test('below-minimum and malformed JSON requests do not create invoices', async () => {
  const h = harness({ records: [] })
  assert.equal((await h.create({ amount: 0.5, currency: 'USD' })).status, 422)
  assert.equal((await h.create({ amount: 0.000001, currency: 'BTC' })).status, 422)
  const response = await h.load(createPath).POST(new Request('https://offline.example.invalid', { method: 'POST', body: '{' }))
  assert.equal(response.status, 400)
  assert.equal(h.calls.invoiceCreates.length, 0)
})

test('unconfirmed and individual partial-payment events never credit program totals', async () => {
  for (const [type, status] of [['InvoiceProcessing', 'Processing'], ['InvoicePaymentSettled', 'New']]) {
    const h = harness({ invoice: { status } })
    assert.equal((await h.webhook({ type })).status, 200)
    assert.equal(h.db.current().program.raised.toString(), '0')
    assert.equal(h.db.current().records[0].completedAt, null)
    assert.equal(h.calls.emails.length, 0)
  }
})

test('current provider state overrides the delivery event; sequential retries credit and notify once', async () => {
  const h = harness()
  for (const type of ['InvoiceProcessing', 'InvoiceSettled', 'InvoiceReceivedPayment']) {
    assert.equal((await h.webhook({ type })).status, 200)
  }
  assert.equal(h.db.current().program.raised.toString(), '10')
  assert.equal(h.db.current().records[0].status, 'COMPLETED')
  assert.equal(h.calls.emails.length, 1)
})

test('parallel webhook deliveries credit and notify once', async () => {
  const h = harness()
  const responses = await Promise.all(Array.from({ length: 6 }, (_, index) => h.webhook({ deliveryId: 'delivery-' + index })))
  assert.equal(responses.every((response) => response.status === 200), true)
  assert.equal(h.db.current().program.raised.toString(), '10')
  assert.equal(h.calls.emails.length, 1)
})

test('atomic conditional claim protects overlapping reads of the same pending donation', async () => {
  const h = harness()
  const { reconcileDonation } = h.load('src/lib/donation-settlement.ts')
  const invoice = { id: 'invoice-one', status: 'Settled', amount: '10', currency: 'USD' }
  const results = await Promise.all([reconcileDonation(h.db.prisma, invoice), reconcileDonation(h.db.prisma, invoice)])
  assert.equal(results.filter((result) => result.credited).length, 1)
  assert.equal(h.db.current().program.raised.toString(), '10')
})

test('delayed provider snapshots cannot reopen completion or double-credit settlement', async () => {
  const h = harness()
  await h.webhook()
  const completedAt = h.db.current().records[0].completedAt
  for (const status of ['Processing', 'Expired', 'Invalid', 'New', 'Settled']) {
    h.setInvoice({ status })
    assert.equal((await h.webhook({ type: 'InvoiceReceivedPayment' })).status, 200)
  }
  assert.equal(h.db.current().program.raised.toString(), '10')
  assert.equal(h.db.current().records[0].completedAt, completedAt)
  assert.equal(h.db.current().records[0].status, 'COMPLETED')
  assert.equal(h.calls.emails.length, 1)
})

test('program failure rolls back settlement; redelivery can repair the credit', async () => {
  const h = harness()
  h.db.failProgramUpdate(true)
  assert.equal((await h.webhook()).status, 500)
  assert.equal(h.db.current().records[0].status, 'PENDING')
  assert.equal(h.db.current().records[0].completedAt, null)
  assert.equal(h.db.current().program.raised.toString(), '0')
  assert.equal(h.calls.emails.length, 0)
  h.db.failProgramUpdate(false)
  assert.equal((await h.webhook()).status, 200)
  assert.equal(h.db.current().program.raised.toString(), '10')
  assert.equal(h.calls.emails.length, 1)
})

test('BTC settlements retain satoshi precision and never add raw BTC to USD programs', async () => {
  const h = harness({
    records: [donation({ currency: 'BTC', amount: new Prisma.Decimal('0.00001001') })],
    invoice: { currency: 'BTC', amount: '0.00001001' },
  })
  assert.equal((await h.webhook()).status, 200)
  assert.equal(h.db.current().records[0].status, 'COMPLETED')
  assert.equal(h.db.current().records[0].amount.toString(), '0.00001001')
  assert.equal(h.db.current().program.raised.toString(), '0')
})

test('authoritative invoice identity, currency, amount, and precision mismatches cause no writes', async () => {
  for (const invoice of [{ id: 'other-invoice' }, { currency: 'BTC' }, { amount: '9.99' }, { amount: '0' }, { amount: '10.001' }, { status: 'Unexpected' }]) {
    const h = harness({ invoice })
    assert.equal((await h.webhook()).status >= 400, true)
    assert.equal(h.db.calls.writes, 0)
    assert.equal(h.calls.emails.length, 0)
  }
})

test('signed malformed payloads and wrong-store deliveries never query or mutate donations', async () => {
  for (const [payload, status] of [[{ invoiceId: undefined }, 400], [{ deliveryId: undefined }, 400], [{ storeId: undefined }, 400], [{ storeId: 'different-store' }, 403]]) {
    const h = harness()
    assert.equal((await h.webhook(payload)).status, status)
    assert.equal(h.db.calls.reads, 0)
    assert.equal(h.db.calls.writes, 0)
    assert.equal(h.calls.invoiceReads.length, 0)
  }
})

test('invalid signatures and unrelated events produce no provider calls or writes', async () => {
  const h = harness()
  assert.equal((await h.webhook({}, 'sha256=' + '0'.repeat(64))).status, 401)
  assert.equal((await h.webhook({ type: 'PayoutCreated' })).status, 200)
  assert.equal(h.calls.invoiceReads.length, 0)
  assert.equal(h.db.calls.reads, 0)
})

test('unknown invoices and unavailable providers leave donations unchanged', async () => {
  const missing = harness({ records: [] })
  assert.equal((await missing.webhook()).status, 404)
  assert.equal(missing.calls.invoiceReads.length, 0)
  const unavailable = harness()
  unavailable.failInvoice()
  assert.equal((await unavailable.webhook()).status, 503)
  assert.equal(unavailable.db.calls.writes, 0)
})

test('status polling reports processing/settlement without transactions, writes, or PII', async () => {
  const h = harness()
  for (const [providerStatus, expected] of [['Processing', 'PROCESSING'], ['Settled', 'COMPLETED']]) {
    h.setInvoice({ status: providerStatus })
    const response = await h.status()
    const body = await response.json()
    assert.equal(response.status, 200)
    assert.equal(body.data.status, expected)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.equal(JSON.stringify(body).includes('supporter@example.invalid'), false)
  }
  assert.equal(h.db.calls.transactions, 0)
  assert.equal(h.db.calls.writes, 0)
  assert.equal(h.db.current().records[0].status, 'PENDING')
})

test('status polling validates IDs before provider lookup and rejects invoice mismatches', async () => {
  const h = harness({ invoice: { amount: '9' } })
  assert.equal((await h.status('../wrong')).status, 400)
  assert.equal(h.calls.invoiceReads.length, 0)
  assert.equal((await h.status()).status, 500)
  assert.equal(h.db.calls.writes, 0)
})

test('database statistics preserve exact USD/BTC totals and keep legacy totalRaised USD-only', async () => {
  const h = harness({ records: [
    donation({ status: 'COMPLETED', amount: new Prisma.Decimal('0.1') }),
    donation({ id: 'donation-two', status: 'COMPLETED', amount: new Prisma.Decimal('0.2') }),
    donation({ id: 'donation-three', status: 'COMPLETED', currency: 'BTC', amount: new Prisma.Decimal('0.00000001') }),
  ] })
  const response = await h.load(statsPath).GET()
  const { data } = await response.json()
  assert.equal(data.totalRaised, 0.3)
  assert.equal(data.totalDonations, 3)
  assert.deepEqual(data.totalsByCurrency, {
    USD: { totalRaised: '0.30', totalDonations: 2 },
    BTC: { totalRaised: '0.00000001', totalDonations: 1 },
  })
  assert.equal(h.calls.storeReads, 0)
})

test('provider fallback statistics separate currencies and ignore unsettled invoices', async () => {
  const h = harness({ records: [], storeInvoices: [
    { status: 'Settled', currency: 'USD', amount: '10.10' },
    { status: 'Settled', currency: 'BTC', amount: '0.00001001' },
    { status: 'Processing', currency: 'USD', amount: '900' },
    { status: 'Settled', currency: 'EUR', amount: '900' },
  ] })
  const { data } = await (await h.load(statsPath).GET()).json()
  assert.equal(data.totalRaised, 10.1)
  assert.equal(data.totalDonations, 2)
  assert.equal(data.totalsByCurrency.BTC.totalRaised, '0.00001001')
})

test('unavailable totals return 503 rather than claiming successful zero totals', async () => {
  const h = harness()
  h.db.failTotals()
  h.failStore()
  assert.equal((await h.load(statsPath).GET()).status, 503)
})
