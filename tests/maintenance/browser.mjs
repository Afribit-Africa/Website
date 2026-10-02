import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { pathToFileURL } from 'node:url'

const modulePath = process.argv[2]
if (!modulePath) throw new Error('Pass the path to the Playwright installation.')
const { chromium } = await import(pathToFileURL(path.join(modulePath, 'index.mjs')).href)
const base = process.argv[3] || 'http://localhost:3003'
const output = process.argv[4] || path.join(os.tmpdir(), 'afribit-maintenance-qa', new URL(base).hostname)
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
let checks = 0
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const request = context.request
  for (const [oldSlug, target] of [['mama-eddy-salon-1', 'mama-eddy-salon'], ['night-salon', 'night-salon-1']]) {
    const response = await request.get(`${base}/merchants/${oldSlug}`, { maxRedirects: 0 })
    assert.equal(response.status(), 308)
    assert.ok(response.headers().location.endsWith(`/merchants/${target}`))
    checks++
  }
  const home = await request.get(base)
  assert.equal(home.status(), 200)
  assert.equal(home.headers()['x-content-type-options'], 'nosniff')
  assert.equal(home.headers()['x-frame-options'], 'SAMEORIGIN')
  assert.ok(home.headers()['content-security-policy'].includes("object-src 'none'"))
  assert.equal(home.headers()['x-powered-by'], undefined)
  checks++
  const robots = await (await request.get(`${base}/robots.txt`)).text()
  assert.ok(!robots.includes('Disallow: /_next/'))
  assert.ok(robots.includes('https://www.afribit.africa/sitemap.xml'))
  const sitemap = await (await request.get(`${base}/sitemap.xml`)).text()
  for (const slug of ['mama-eddy-salon-1', 'night-salon']) assert.ok(!sitemap.includes(`/merchants/${slug}</loc>`))
  assert.equal((sitemap.match(/<loc>https:\/\/www\.afribit\.africa\/merchants\/(?!location-accuracy)/g) || []).length, 48)
  for (const slug of ['privacy', 'terms', 'cookies']) assert.ok(!sitemap.includes(`/legal/${slug}</loc>`))
  assert.ok(!sitemap.match(/<loc>https:\/\/www\.afribit\.africa\/about<\/loc>\s*<lastmod>/))
  checks++
  const og = await request.get(`${base}/opengraph-image`)
  assert.equal(og.status(), 200)
  assert.ok(og.headers()['content-type'].includes('image/png'))
  const png = await og.body()
  assert.equal(png.readUInt32BE(16), 1200)
  assert.equal(png.readUInt32BE(20), 630)
  assert.ok(png.length > 5000)
  await writeFile(path.join(output, 'sharing-preview.png'), png)
  checks++

  // Invalid requests stop before database/email work. Never submit a real form in QA.
  const crossOrigin = await request.post(`${base}/api/contact`, { headers: { origin: 'https://evil.example' }, data: {} })
  assert.equal(crossOrigin.status(), 403)
  assert.ok(crossOrigin.headers()['cache-control'].includes('no-store'))
  const unauthenticated = await request.get(`${base}/api/admin/merchant-verifications/queue`)
  assert.equal(unauthenticated.status(), 401)
  checks++
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(`${new URL(page.url()).pathname}: ${error.message}`))
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 })
    for (const route of ['/', '/merchants', '/merchants/mama-eddy-salon', '/contact', '/studio']) {
      const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' })
      assert.equal(response.status(), 200)
      assert.equal(await page.locator('h1').count(), 1)
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      assert.equal(canonical, `https://www.afribit.africa${route === '/' ? '' : route}`)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      assert.ok(overflow <= 1, `${route} at ${width}: ${overflow}px overflow`)
      assert.equal(await page.locator('a[href="/register"],a[href$="afribit.africa/maps"],a[href*="staging.geyser"]').count(), 0)
      if (route === '/merchants') {
        assert.equal(await page.getByRole('heading', { name: 'Mama Eddy Salon', exact: true }).count(), 1)
        assert.equal(await page.getByRole('heading', { name: 'Night Salon', exact: true }).count(), 1)
        await page.getByPlaceholder('Search by name, category, or neighborhood').fill('Mama Eddy')
        await page.getByText('1 merchant shown', { exact: true }).waitFor()
        await page.getByPlaceholder('Search by name, category, or neighborhood').fill('no-such-merchant-qa')
        await page.getByRole('heading', { name: 'No merchants matched these filters.' }).waitFor()
        await page.getByRole('button', { name: 'Reset filters', exact: true }).click()
        await page.getByText('48 merchants shown', { exact: true }).waitFor()
        await page.locator('#merchant-directory').scrollIntoViewIfNeeded()
        await page.screenshot({ path: path.join(output, `directory-${width}.png`) })
      }
      if (route.includes('mama-eddy-salon')) {
        const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => JSON.parse(node.textContent)))
        const business = schemas.find(schema => schema['@type'] === 'LocalBusiness')
        assert.equal(business.name, 'Mama Eddy Salon')
        assert.equal(business.geo.latitude, -1.316439)
        assert.equal(business.geo.longitude, 36.7761)
      }
      if (route === '/contact') await page.getByRole('form', { name: 'Contact form' }).scrollIntoViewIfNeeded()
      await page.screenshot({ path: path.join(output, `${route.replaceAll('/', '_') || 'home'}-${width}.png`) })
      checks++
    }
  }
  assert.deepEqual(errors, [])
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  assert.ok((await page.locator('h1').textContent()).replace(/\s+/g, ' ').includes('through Bitcoin'))
  assert.deepEqual(errors, [])
  checks++
  const links = new Set()
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  for (const href of await page.locator('header a[href],footer a[href]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))) {
    if (href?.startsWith('/') && !href.startsWith('//') && !href.includes('#')) links.add(href)
  }
  for (const href of links) {
    const response = await request.get(`${base}${href}`)
    assert.equal(response.status(), 200, `${href} must resolve`)
    checks++
  }
  console.log(`Passed ${checks} maintenance browser checks. Screenshots: ${output}`)
} finally { await browser.close() }
