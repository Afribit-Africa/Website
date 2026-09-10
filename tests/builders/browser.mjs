import assert from 'node:assert/strict'
import path from 'node:path'
import os from 'node:os'
import { createRequire } from 'node:module'

const loadModule = createRequire(import.meta.url)
const { chromium } = loadModule(process.argv[2] || 'playwright')
const base = process.argv[3] || 'http://localhost:3000'

async function verify() {
  const browser = await chromium.launch()
  const errors = []
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.on('pageerror', (error) => errors.push(`${page.url()}: ${error.stack || error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydrat|didn't match|server rendered/i.test(message.text())) errors.push(message.text())
  })
  try {
    for (const slug of ['', '/taka-sats', '/afribit-wifi', '/insats']) {
      const response = await page.goto(`${base}/builders${slug}`, { waitUntil: 'networkidle' })
      assert.equal(response.status(), 200)
      assert.equal(await page.locator('h1').count(), 1)
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://afribit.africa/builders${slug}`)
      const schemas = await page.locator('script[type="application/ld+json"]').allTextContents()
      assert.ok(schemas.every((schema) => JSON.parse(schema)['@type'] !== 'BlogPosting'))
      for (const width of [320, 390, 768, 1440, 1920]) {
        await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 })
        await page.waitForTimeout(120)
        const dimensions = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }))
        assert.ok(dimensions.scroll <= dimensions.width, `${slug || 'index'} overflows at ${width}: ${dimensions.scroll}`)
      }
      await page.setViewportSize({ width: 1440, height: 1000 })
      if (slug) {
        const tabs = page.getByRole('tablist')
        await tabs.scrollIntoViewIfNeeded()
        const triggers = page.getByRole('tab')
        for (let index = 0; index < 4; index++) {
          await triggers.nth(index).click()
          assert.equal(await triggers.nth(index).getAttribute('aria-selected'), 'true')
          assert.equal(await page.getByRole('tabpanel').count(), 1)
        }
        await triggers.nth(0).focus()
        await page.keyboard.press('ArrowRight')
        await page.waitForTimeout(150)
        assert.equal(await triggers.nth(1).getAttribute('aria-selected'), 'true')
        await page.locator('.builder-flow').screenshot({ path: path.join(os.tmpdir(), `builders-flow-${slug.slice(1)}.png`) })
      }
      console.log(`PASS route, SEO, responsive layout${slug ? ', workflow + keyboard' : ''}: /builders${slug}`)
    }

    await page.locator('.insats-public-report').scrollIntoViewIfNeeded()
    await page.waitForFunction(() => document.querySelector('.insats-report-counts strong')?.textContent !== '--', null, { timeout: 20000 })
    const liveEntriesText = await page.locator('.insats-report-counts strong').first().innerText()
    assert.match(liveEntriesText, /^[\d,]+$/)
    await page.getByRole('button', { name: 'Maize flour' }).click()
    assert.match(await page.locator('.insats-readings').innerText(), /KES 229/)
    const slider = page.getByRole('slider', { name: 'Observation period' })
    await slider.focus()
    await page.keyboard.press('Home')
    assert.match(await page.locator('.insats-readings').innerText(), /KES 205/)
    await page.keyboard.press('End')
    assert.match(await page.locator('.insats-readings').innerText(), /21,100/)
    const legend = page.getByRole('group', { name: 'Visible chart series' })
    await legend.getByRole('button', { name: 'KES price' }).click()
    assert.equal(await legend.getByRole('button', { name: 'KES price' }).getAttribute('aria-pressed'), 'false')
    await page.getByText('View data table', { exact: true }).click()
    assert.equal(await page.locator('tbody tr').count(), 8)
    console.log('PASS Insats live public report, product selection, slider keyboard, series toggles, table')

    await page.route('**/api/builders/insats', (route) => route.fulfill({ status: 503, contentType: 'application/json', body: '{"success":false}' }))
    await page.getByRole('button', { name: 'Refresh Insats report' }).click()
    await page.waitForFunction(() => document.querySelector('.insats-report-status')?.textContent.includes('last retrieved'))
    assert.equal(await page.locator('.insats-report-counts strong').first().innerText(), liveEntriesText)
    await page.reload({ waitUntil: 'networkidle' })
    await page.locator('.insats-public-report').scrollIntoViewIfNeeded()
    await page.waitForFunction(() => document.querySelector('.insats-report-status')?.textContent.includes('temporarily unavailable'))
    assert.equal(await page.locator('.insats-report-counts strong').first().innerText(), '--')
    await page.unroute('**/api/builders/insats')
    console.log('PASS Insats unavailable + stale report states')

    const redirects = {
      '/blog': '/builders',
      '/blog/taka-sats-waste-to-bitcoin': '/builders/taka-sats',
      '/blog/building-afribit-wifi': '/builders/afribit-wifi',
      '/blog/local-economic-intelligence-bitcoin-payments': '/builders/insats',
    }
    for (const [from, to] of Object.entries(redirects)) {
      const response = await page.request.get(`${base}${from}`, { maxRedirects: 0 })
      assert.equal(response.status(), 308)
      assert.equal(response.headers().location, to)
    }
    const missing = await page.request.get(`${base}/builders/not-a-project`)
    assert.equal(missing.status(), 404)
    const sitemap = await (await page.request.get(`${base}/sitemap.xml`)).text()
    assert.ok(sitemap.includes('/builders/insats'))
    assert.ok(!sitemap.includes('/blog'))
    console.log('PASS legacy 308 redirects, missing project 404, sitemap')

    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(`${base}/builders`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)
    const bounds = await page.evaluate(() => ({ header: document.querySelector('body > header').getBoundingClientRect().bottom, title: document.querySelector('h1').getBoundingClientRect().top, opacity: getComputedStyle(document.querySelector('h1 > span')).opacity }))
    assert.ok(bounds.title > bounds.header, `Reduced-motion title overlaps header: ${JSON.stringify(bounds)}`)
    assert.equal(bounds.opacity, '1')
    await page.getByRole('button', { name: 'Open menu', exact: true }).click()
    await page.getByRole('link', { name: 'Afribit Builders The people & projects behind the tech' }).click()
    await page.getByRole('button', { name: 'Close menu', exact: true }).waitFor({ state: 'detached' })
    await page.screenshot({ path: path.join(os.tmpdir(), 'builders-reduced-mobile.png') })
    console.log('PASS reduced motion + mobile navigation')
    assert.deepEqual(errors, [])
    console.log('PASS no browser runtime errors')
  } finally {
    await browser.close()
  }
}

verify().catch((error) => { console.error(error); process.exitCode = 1 })
