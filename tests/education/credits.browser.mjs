import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'

const require = createRequire(import.meta.url)
const { chromium } = require(process.argv[2] || 'playwright')
const base = process.argv[3] || 'http://localhost:3003'
const output = path.join(tmpdir(), 'afribit-credit-qa', new URL(base).hostname)
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
const results = [], errors = []
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.on('pageerror', (error) => errors.push(error.message))
  for (const route of ['/studio', '/studio/bitcoin-podcast-101']) {
    const response = await page.goto(base + route, { waitUntil: 'domcontentloaded' })
    assert.equal(response.status(), 200)
    const credits = page.getByRole('region', { name: 'Episode credits', exact: true })
    await credits.waitFor()
    assert.equal(await credits.getByRole('link', { name: 'Content Btrust Pathway' }).getAttribute('href'), 'https://pathways.btrust.tech/')
    assert.equal(await credits.getByRole('link', { name: 'AI-generated audio Gemini' }).getAttribute('href'), 'https://gemini.google/about/')
    await credits.locator('img').evaluate((image) => image.decode())
    assert.ok(await credits.locator('img').evaluate((image) => image.naturalWidth > 0))
    for (const [width, height] of [[320, 760], [390, 844], [768, 1024], [1440, 1000]]) {
      await page.setViewportSize({ width, height })
      await credits.scrollIntoViewIfNeeded()
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Horizontal overflow')
      const boxes = await credits.locator('a').evaluateAll((elements) => elements.map((element) => {
        const { left, right, top, bottom } = element.getBoundingClientRect()
        return { left, right, top, bottom }
      }))
      assert.ok(boxes.every((box) => box.left >= 0 && box.right <= width), 'Credit outside viewport')
      assert.ok(boxes[0].right <= boxes[1].left || boxes[0].bottom <= boxes[1].top, 'Credits overlap')
      await page.screenshot({ path: path.join(output, `${route === '/studio' ? 'library' : 'lesson'}-${width}.png`), fullPage: true })
      results.push({ route, width, logoLoaded: true, linksCorrect: true, noOverflowOrOverlap: true })
    }
    if (route.includes('bitcoin-podcast-101')) {
      const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((text) => JSON.parse(text))
      const resource = schemas.find((schema) => schema['@type'] === 'LearningResource')
      assert.ok(resource.creditText.includes('Btrust Pathway') && resource.creditText.includes('Gemini'))
      assert.equal(resource.isBasedOn.url, 'https://pathways.btrust.tech/')
      assert.equal(resource.associatedMedia.creditText, 'AI-generated audio created with Gemini.')
      await page.locator('.education-studio[data-hydrated="true"]').waitFor()
      await page.getByRole('button', { name: 'Play audio', exact: true }).click()
      await page.waitForFunction(() => !document.querySelector('audio').paused)
      await page.getByRole('button', { name: 'Pause audio', exact: true }).click()
    }
  }
  assert.deepEqual(errors, [])
  const report = { status: 'passed', base, results, metadataCredits: true, playback: true, errors }
  await writeFile(path.join(output, 'results.json'), JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report))
} finally { await browser.close() }
