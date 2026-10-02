import assert from 'node:assert/strict'
import { test } from 'node:test'
import { contactSchema, newsletterSchema } from '../../src/lib/form-validation'
import { assertFormOrigin, readFormJson, verifyFormCaptcha, limitFormRequests, FormRequestError } from '../../src/lib/public-form-security'
import { contactFormNotification, newsletterWelcomeEmail, donationConfirmationEmail, adminDonationNotification } from '../../src/lib/email-templates'
import { merchantDuplicatePlan, merchantRedirects } from '../../src/lib/merchant-duplicates'
import { generateMetadata, SITE_URL, DEFAULT_OG_IMAGE, getOrganizationSchema } from '../../src/lib/metadata'

const fields = { name: 'Test Visitor', email: 'VISITOR@example.org', subject: '', phone: '', message: 'A legitimate test message.' }

test('forms accept empty optional fields, normalize email and bound untrusted values', () => {
  assert.equal(contactSchema.parse(fields).email, 'visitor@example.org')
  assert.equal(contactSchema.safeParse({ ...fields, subject: 'x\r\nBcc: other@example.org' }).success, false)
  for (const [field, value] of [['name', 'x'.repeat(101)], ['message', 'x'.repeat(5001)], ['email', 'x'.repeat(255)]]) {
    assert.equal(contactSchema.safeParse({ ...fields, [field]: value }).success, false)
  }
  assert.equal(newsletterSchema.safeParse({ email: 'not an email' }).success, false)
})

test('public forms reject missing/foreign origins and wrong content types', () => {
  for (const origin of [undefined, 'https://evil.example', 'https://www.afribit.africa.evil.example']) {
    assert.throws(() => assertFormOrigin(new Request('https://www.afribit.africa/api/contact', { headers: { ...(origin ? { origin } : {}), 'content-type': 'application/json' } })), FormRequestError)
  }
  assert.doesNotThrow(() => assertFormOrigin(new Request('https://www.afribit.africa/api/contact', { headers: { origin: 'https://www.afribit.africa', 'content-type': 'application/json; charset=utf-8' } })))
  assert.throws(() => assertFormOrigin(new Request('https://www.afribit.africa/api/contact', { headers: { origin: 'https://www.afribit.africa', 'content-type': 'text/plain' } })), FormRequestError)
})

test('malformed and streamed oversized JSON is rejected before persistence', async () => {
  const request = (body: string) => new Request('https://www.afribit.africa/api/contact', { method: 'POST', body })
  assert.deepEqual(await readFormJson(request(JSON.stringify(fields))), fields)
  await assert.rejects(readFormJson(request('{')), { status: 400 })
  await assert.rejects(readFormJson(request('x'.repeat(32769))), { status: 413 })
})

test('captcha fails closed on missing, expired, failed and unavailable verification', async context => {
  const original = { secret: process.env.HCAPTCHA_SECRET_KEY, key: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY }
  process.env.HCAPTCHA_SECRET_KEY = 'unit-test-secret'
  process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY = 'unit-test-key'
  try {
    await assert.rejects(verifyFormCaptcha(undefined), { status: 400 })
    const mock = context.mock.method(globalThis, 'fetch', async (_url: unknown, options?: RequestInit) => {
      assert.equal(options?.headers && (options.headers as Record<string, string>)['Content-Type'], 'application/x-www-form-urlencoded')
      assert.equal(new URLSearchParams(options?.body as string).get('sitekey'), 'unit-test-key')
      return Response.json({ success: true })
    })
    await verifyFormCaptcha('valid')
    mock.mock.mockImplementation(async () => Response.json({ success: false }))
    await assert.rejects(verifyFormCaptcha('expired'), { status: 400 })
    mock.mock.mockImplementation(async () => { throw new Error('Network unavailable') })
    await assert.rejects(verifyFormCaptcha('unavailable'), { status: 503 })
    delete process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY
    await assert.rejects(verifyFormCaptcha('partial-config'), { status: 503 })
  } finally {
    for (const [key, value] of Object.entries({ HCAPTCHA_SECRET_KEY: original.secret, NEXT_PUBLIC_HCAPTCHA_SITE_KEY: original.key })) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value
    }
  }
})

test('distributed rate limiter uses atomic expiry and rejects excess/service failure', async context => {
  const original = { url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN, enabled: process.env.PUBLIC_FORM_REDIS_ENABLED }
  process.env.PUBLIC_FORM_REDIS_ENABLED = 'true'
  process.env.UPSTASH_REDIS_REST_URL = 'https://unit-test.example'
  process.env.UPSTASH_REDIS_REST_TOKEN = 'unit-test-token'
  const request = new Request('https://www.afribit.africa/api/contact', { headers: { 'x-forwarded-for': '192.0.2.1' } })
  try {
    const mock = context.mock.method(globalThis, 'fetch', async (_url: unknown, options?: RequestInit) => {
      const command = JSON.parse(String(options?.body)) as string[]
      assert.equal(command[0], 'EVAL')
      assert.ok(command[1].includes('EXPIRE'))
      assert.ok(!command[3].includes('192.0.2.1'))
      return Response.json({ result: 1 })
    })
    await limitFormRequests(request, 'contact')
    mock.mock.mockImplementation(async () => Response.json({ result: 6 }))
    await assert.rejects(limitFormRequests(request, 'contact'), { status: 429, retryAfter: 900 })
    mock.mock.mockImplementation(async () => Response.json({ error: 'Unavailable' }, { status: 500 }))
    await assert.rejects(limitFormRequests(request, 'contact'), { status: 503 })
  } finally {
    for (const [key, value] of Object.entries({ UPSTASH_REDIS_REST_URL: original.url, UPSTASH_REDIS_REST_TOKEN: original.token, PUBLIC_FORM_REDIS_ENABLED: original.enabled })) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value
    }
  }
})

test('all notification templates escape dynamic HTML and preserve line breaks', () => {
  const attack = '<img src="https://evil.example" onerror="alert(1)"> & \'test\''
  const templates = [
    contactFormNotification({ name: attack, email: attack, phone: attack, subject: attack, message: `${attack}\nNext line`, submittedAt: new Date() }),
    newsletterWelcomeEmail({ name: attack }),
    donationConfirmationEmail({ donorName: attack, amount: '10', currency: 'USD', program: attack, invoiceId: attack, isAnonymous: false }),
    adminDonationNotification({ donorName: attack, donorEmail: attack, amount: '10', currency: 'USD', program: attack, invoiceId: attack, isAnonymous: false }),
  ]
  for (const template of templates) {
    assert.ok(!template.html.includes(attack))
    assert.ok(template.html.includes('&lt;img'))
    assert.ok(template.html.includes('&quot;'))
    assert.ok(template.html.includes('&amp;'))
  }
  assert.ok(templates[0].html.includes('<br>Next line'))
  assert.ok(!templates[1].html.includes('/unsubscribe"'))
})

test('only two reviewed import copies redirect; real-node review pairs are untouched', () => {
  assert.equal(merchantDuplicatePlan.length, 2)
  assert.equal(new Set(merchantDuplicatePlan.map(row => row.canonicalId)).size, 2)
  assert.deepEqual(merchantRedirects(), [
    { source: '/merchants/mama-eddy-salon-1', destination: '/merchants/mama-eddy-salon', permanent: true },
    { source: '/merchants/night-salon', destination: '/merchants/night-salon-1', permanent: true },
  ])
})

test('canonical and raster sharing metadata match the live production domain', () => {
  assert.equal(SITE_URL, 'https://www.afribit.africa')
  assert.equal(DEFAULT_OG_IMAGE, '/opengraph-image')
  assert.equal(generateMetadata({ title: 'Merchants', description: 'Local businesses.', path: '/merchants' }).alternates?.canonical, `${SITE_URL}/merchants`)
  assert.ok(!('foundingDate' in getOrganizationSchema()))
})
