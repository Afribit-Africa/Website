import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { createHash } from 'node:crypto'

const require = createRequire(import.meta.url)
const { chromium } = require(process.argv[2] || 'playwright')
const sharp = require('sharp')
const base = process.argv[3] || 'http://localhost:3002'
const lesson = `${base}/studio/bitcoin-podcast-101`
const output = path.resolve('docs/education/qa-globe')
await mkdir(output, { recursive: true })
const results = [], errors = []
let failure = null
const browser = await chromium.launch()
const record = (name, detail = {}) => { results.push({ name, ...detail }); console.log(`PASS ${name}`) }
const captureErrors = (page) => {
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error' && /hydration|didn't match|server rendered/i.test(message.text())) errors.push(message.text()) })
}
async function ready(page, view = 'read') {
  const response = await page.goto(`${lesson}?view=${view}`, { waitUntil: 'domcontentloaded' })
  assert.equal(response.status(), 200)
  await page.waitForFunction(() => document.querySelector('audio')?.readyState >= 1)
  await page.locator('.education-studio[data-hydrated="true"]').waitFor()
  await page.locator('.studio-space-backdrop[data-globe="ready"]').waitFor()
}
async function centered(page) {
  await page.waitForFunction(() => {
    const line = document.querySelector('.studio-lyric-line.is-current')?.getBoundingClientRect()
    const viewport = document.querySelector('.studio-lyrics')?.getBoundingClientRect()
    return line && viewport && Math.abs(line.y + line.height / 2 - viewport.y - viewport.height / 2) < 5
  })
}
async function screenshot(page, name) {
  await page.waitForTimeout(550)
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${name}`)
  await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true })
}
async function globeFrame(page) {
  const bytes = await page.locator('.studio-space-backdrop canvas').screenshot()
  const { width, height } = await sharp(bytes).metadata()
  // Only compare the planet, not overlaid tool hover states or credit text.
  const planet = await sharp(bytes).extract({ left: Math.floor(width * .2), top: Math.floor(height * .2), width: Math.floor(width * .6), height: Math.floor(height * .6) }).raw().toBuffer()
  return createHash('sha256').update(planet).digest('hex')
}
async function globePixels(page) {
  const { data, info } = await sharp(await page.locator('.studio-space-backdrop canvas').screenshot()).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  let colorful = 0
  for (let index = 0; index < data.length; index += info.channels) {
    const channels = [data[index], data[index + 1], data[index + 2]]
    if (Math.max(...channels) - Math.min(...channels) > 12 && Math.max(...channels) > 45) colorful++
  }
  assert.ok(colorful > info.width * info.height * .015, 'Globe canvas is blank or map failed to render')
  return { width: info.width, height: info.height, colorfulPixels: colorful }
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage(); captureErrors(page)
  await page.goto(`${base}/studio`)
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://afribit.africa/studio')
  assert.equal(await page.locator('.studio-title-tile').count(), 1)
  for (const [width, height] of [[320, 760], [390, 844], [768, 1024], [1440, 1000], [1920, 1080]]) {
    await page.setViewportSize({ width, height }); await screenshot(page, `library-${width}`)
  }
  await page.getByRole('tab', { name: 'Videos 0' }).click()
  assert.equal(await page.locator('.studio-title-tile').count(), 0)
  await page.getByRole('button', { name: 'Explore audiobooks' }).click()
  await page.getByRole('tab', { name: 'Books 0' }).click()
  assert.equal(await page.locator('.studio-title-tile').count(), 0)
  await page.getByRole('tab', { name: 'Read 1' }).click()
  assert.ok((await page.locator('.studio-title-tile').getAttribute('href')).endsWith('view=read'))
  await page.getByRole('searchbox', { name: 'Search library' }).fill('not a real title xyz')
  assert.equal(await page.locator('.studio-title-tile').count(), 0)
  await page.getByRole('button', { name: 'Clear search' }).click()
  await page.locator('.studio-title-tile').click()
  await page.waitForURL('**/studio/bitcoin-podcast-101?view=read', { waitUntil: 'domcontentloaded' })
  record('library formats, honest empty collections, search and reading entry')

  await page.setViewportSize({ width: 1440, height: 1000 }); await ready(page)
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://afribit.africa/studio/bitcoin-podcast-101')
  assert.ok((await page.locator('script[type="application/ld+json"]').allTextContents()).some((value) => JSON.parse(value)['@type'] === 'LearningResource'))
  assert.equal(await page.locator('.studio-space-backdrop canvas').count(), 1)
  assert.equal(await page.locator('video').count(), 0)
  await centered(page)
  for (const [width, height] of [[320, 760], [390, 844], [768, 1024], [1440, 1000], [1920, 1080]]) {
    await page.setViewportSize({ width, height }); await centered(page); await screenshot(page, `read-${width}`)
    const stage = await page.locator('.studio-world-stage').boundingBox(), controls = await page.locator('.studio-player-controls').boundingBox()
    assert.ok(controls.y >= stage.y + stage.height)
  }
  record('responsive large reading, local centering, real transcript and lesson metadata')

  await page.setViewportSize({ width: 1440, height: 1000 })
  const seek = page.getByRole('slider', { name: 'Seek audio' })
  await seek.fill('230'); await centered(page)
  const firstCue = await page.locator('.studio-lyric-line.is-current').getAttribute('data-cue')
  const pageScroll = await page.evaluate(() => scrollY)
  await seek.fill('255'); await centered(page)
  assert.notEqual(await page.locator('.studio-lyric-line.is-current').getAttribute('data-cue'), firstCue)
  assert.equal(await page.evaluate(() => scrollY), pageScroll)
  await screenshot(page, 'read-desktop-seek')
  const lyrics = await page.locator('.studio-lyrics').boundingBox()
  await page.mouse.move(lyrics.x + 50, lyrics.y + 70); await page.mouse.wheel(0, 120)
  await page.waitForFunction(() => document.querySelector('.studio-lyrics').dataset.following === 'false')
  assert.equal(await page.locator('.studio-lyrics').getAttribute('data-following'), 'false')
  await page.getByRole('button', { name: 'Follow narration', exact: true }).click(); await centered(page)
  const cue = page.locator('.studio-lyric-line.is-current')
  await cue.click(); await centered(page)
  record('seeking follows phrases without scrolling the document, browse pause and recenter')

  await page.getByRole('tab', { name: 'Listen', exact: true }).click()
  await page.locator('.studio-space-backdrop[data-globe="ready"]').waitFor()
  await page.getByRole('button', { name: 'Hide captions' }).click()
  const desktopPixels = await globePixels(page)
  await page.getByRole('button', { name: 'Play audio', exact: true }).click()
  await page.waitForFunction(() => !document.querySelector('audio').paused)
  const frame1 = await globeFrame(page); await page.waitForTimeout(1200)
  assert.notEqual(frame1, await globeFrame(page), 'Earth globe is static while enabled')
  await page.getByRole('button', { name: 'Pause visual motion' }).click()
  await page.waitForFunction(() => document.querySelector('.studio-space-backdrop').dataset.moving === 'false')
  assert.equal(await page.locator('audio').evaluate((audio) => audio.paused), false)
  const still = await globeFrame(page); await page.waitForTimeout(500); assert.equal(still, await globeFrame(page))
  await page.getByRole('button', { name: 'Pause audio', exact: true }).click()
  await page.getByLabel('Playback speed', { exact: true }).selectOption('1.5')
  assert.equal(await page.locator('audio').evaluate((audio) => audio.playbackRate), 1.5)
  await page.getByRole('slider', { name: 'Audio volume' }).fill('0.4')
  await page.getByRole('slider', { name: 'Audio volume' }).fill('0')
  await page.getByRole('button', { name: 'Unmute audio' }).click()
  assert.equal(await page.locator('audio').evaluate((audio) => audio.volume), 0.4)
  await page.getByRole('button', { name: 'Forward 15 seconds' }).click()
  await page.getByRole('button', { name: 'Rewind 15 seconds' }).click()
  await page.getByRole('button', { name: 'Explore globe', exact: true }).click()
  const globe = page.locator('.studio-space-backdrop canvas'), beforeDrag = await globeFrame(page), box = await globe.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 90, box.y + box.height / 2 + 20, { steps: 8 }); await page.mouse.up()
  assert.notEqual(beforeDrag, await globeFrame(page), 'Mouse drag does not rotate globe')
  await globe.focus(); const beforeKey = await globeFrame(page); await page.keyboard.press('ArrowRight')
  assert.notEqual(beforeKey, await globeFrame(page), 'Keyboard does not rotate globe')
  await page.getByRole('button', { name: 'Finish exploring globe' }).click()
  await page.getByRole('tab', { name: 'Read', exact: true }).click()
  await page.getByRole('button', { name: 'Enter focus mode' }).click()
  assert.equal(await page.locator('.studio-sidebar').isVisible(), false)
  await centered(page); await screenshot(page, 'read-focus')
  await page.getByRole('button', { name: 'Exit focus mode' }).click()
  record('nonblank mapped globe, moving frames, mouse/keyboard exploration, independent pause and audio controls', { desktopPixels })

  await page.getByRole('button', { name: 'Search transcript', exact: true }).click()
  const search = page.getByRole('searchbox', { name: 'Search transcript' })
  await search.fill('satoshi'); assert.ok(await page.locator('.studio-transcript-line').count() > 0)
  await search.fill('does not exist xyz'); assert.equal(await page.locator('.studio-transcript-line').count(), 0)
  await page.getByRole('button', { name: 'Clear transcript search' }).click()
  await screenshot(page, 'transcript-desktop')
  await page.locator('.studio-transcript-line button').nth(10).click(); await centered(page)
  assert.equal(await page.getByRole('dialog').count(), 0)
  await page.getByRole('button', { name: 'Save bookmark', exact: true }).click()
  await page.getByRole('tab', { name: /Saved/ }).click()
  await page.getByLabel('A thought at').fill('A network we can verify together.')
  await page.getByRole('button', { name: 'Save moment' }).click()
  assert.equal(await page.locator('.studio-bookmark').count(), 2)
  await screenshot(page, 'saved-desktop')
  await page.reload(); await page.getByRole('tab', { name: /Saved/ }).click()
  await page.locator('.studio-bookmark').nth(1).waitFor()
  record('transcript search, timestamp seeking, persistent notes and bookmarks')

  await ready(page, 'listen'); await page.getByRole('button', { name: 'Hide captions' }).click()
  assert.equal(await page.locator('.studio-captions').count(), 0)
  await page.getByRole('button', { name: 'Show captions' }).click()
  await screenshot(page, 'listen-desktop')

  const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const touchPage = await touchContext.newPage(); captureErrors(touchPage); await ready(touchPage)
  await touchPage.getByRole('button', { name: 'Open episode chapters' }).tap()
  await touchPage.getByRole('dialog').locator('.studio-chapters button').nth(2).tap(); await centered(touchPage)
  await touchPage.getByRole('button', { name: 'Play audio', exact: true }).tap()
  await touchPage.waitForFunction(() => !document.querySelector('audio').paused)
  await screenshot(touchPage, 'read-mobile-touch')
  await touchPage.getByRole('button', { name: 'Pause audio', exact: true }).tap()
  await touchPage.locator('.studio-lyrics').evaluate((element) => element.dispatchEvent(new Event('touchmove', { bubbles: true })))
  await touchPage.waitForFunction(() => document.querySelector('.studio-lyrics').dataset.following === 'false')
  assert.equal(await touchPage.locator('.studio-lyrics').getAttribute('data-following'), 'false')
  await touchPage.getByRole('button', { name: 'Follow narration', exact: true }).tap(); await centered(touchPage)
  await touchPage.getByRole('tab', { name: 'Listen', exact: true }).tap()
  await touchPage.locator('.studio-space-backdrop[data-globe="ready"]').waitFor()
  await touchPage.getByRole('button', { name: 'Explore globe', exact: true }).tap()
  const mobilePixels = await globePixels(touchPage), mobileBefore = await globeFrame(touchPage)
  const mobileBox = await touchPage.locator('canvas').boundingBox(), cdp = await touchContext.newCDPSession(touchPage)
  const point = { x: mobileBox.x + mobileBox.width / 2, y: mobileBox.y + mobileBox.height / 2 }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: point.x + 65, y: point.y + 15 }] })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  assert.notEqual(mobileBefore, await globeFrame(touchPage), 'Touch drag does not rotate globe')
  await screenshot(touchPage, 'globe-mobile-touch')
  record('mobile canvas pixels and real touch drag', { mobilePixels })
  await touchContext.close(); record('mobile chapter drawer, touch playback, browsing and follow')

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const reduced = await reducedContext.newPage(); await ready(reduced)
  await reduced.getByRole('button', { name: 'Play audio', exact: true }).click()
  await reduced.waitForFunction(() => !document.querySelector('audio').paused)
  assert.equal(await reduced.locator('.studio-space-backdrop').getAttribute('data-moving'), 'false')
  await reduced.getByRole('tab', { name: 'Listen', exact: true }).click()
  await reduced.locator('.studio-space-backdrop[data-globe="ready"]').waitFor()
  await reduced.getByRole('button', { name: 'Hide captions' }).click()
  const reducedFrame = await globeFrame(reduced); await reduced.waitForTimeout(700)
  assert.equal(reducedFrame, await globeFrame(reduced))
  await reduced.getByRole('tab', { name: 'Read', exact: true }).click()
  await reduced.getByRole('slider', { name: 'Seek audio' }).fill('380'); await centered(reduced)
  await screenshot(reduced, 'read-reduced-motion'); await reducedContext.close()
  record('reduced motion freezes globe and keeps reading functional')

  const fallback = await context.newPage()
  await fallback.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      return type === 'webgl' || type === 'webgl2' ? null : original.call(this, type, ...args)
    }
  })
  await fallback.goto(lesson); await fallback.locator('.studio-space-backdrop[data-globe="fallback"]').waitFor()
  await fallback.waitForFunction(() => document.querySelector('.studio-space-backdrop img').naturalWidth > 0)
  await fallback.getByRole('button', { name: 'Play audio', exact: true }).click()
  await fallback.waitForFunction(() => !document.querySelector('audio').paused)
  await screenshot(fallback, 'webgl-fallback'); await fallback.close(); record('unavailable WebGL retains clean globe poster, reading and audio')

  const audioFailure = await context.newPage(); await audioFailure.route('**/education/bitcoin-101.mp3', (route) => route.abort())
  await audioFailure.goto(lesson); await audioFailure.getByRole('status').filter({ hasText: 'audio could not load' }).waitFor()
  await audioFailure.unroute('**/education/bitcoin-101.mp3'); await audioFailure.getByRole('button', { name: 'Play audio', exact: true }).click()
  await audioFailure.waitForFunction(() => !document.querySelector('audio').paused); await audioFailure.close()
  record('failed audio reports error and recovers')

  const slowContext = await browser.newContext(); await slowContext.addInitScript(() => localStorage.setItem('afribit:bitcoin-101:progress', '800'))
  const slow = await slowContext.newPage(); let releaseAudio
  const delayed = new Promise((resolve) => { releaseAudio = resolve })
  await slow.route('**/education/bitcoin-101.mp3', async (route) => { await delayed; await route.continue() })
  await slow.goto(lesson, { waitUntil: 'domcontentloaded' }); await slow.locator('.education-studio[data-hydrated="true"]').waitFor()
  await slow.getByRole('slider', { name: 'Seek audio' }).fill('230'); releaseAudio()
  await slow.waitForFunction(() => document.querySelector('audio').currentTime >= 229 && document.querySelector('audio').currentTime < 231)
  await centered(slow); await slowContext.close(); record('pre-metadata seeking overrides old saved progress')

  await page.setViewportSize({ width: 1024, height: 900 }); await page.goto(`${base}/builders`)
  const bounds = await page.evaluate(() => {
    const header = document.querySelector('body > header'), logo = header.querySelector('a[href="/"]').getBoundingClientRect()
    const nav = header.querySelector('nav').getBoundingClientRect(), donate = header.querySelector('a[href="/donate"]').getBoundingClientRect()
    return { logoRight: logo.right, navLeft: nav.left, navRight: nav.right, donateLeft: donate.left }
  })
  assert.ok(bounds.logoRight <= bounds.navLeft && bounds.navRight <= bounds.donateLeft, JSON.stringify(bounds))
  await page.locator('nav').getByRole('link', { name: 'Studio', exact: true }).click(); await page.waitForURL('**/studio')
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto(`${base}/builders`)
  await page.getByRole('button', { name: 'Open menu', exact: true }).click()
  await page.getByRole('link', { name: /Afribit Studio Bitcoin education/ }).click(); await page.waitForURL('**/studio')
  await page.getByRole('link', { name: 'Back to Afribit' }).click(); await page.waitForURL(base + '/')
  record('coherent Studio button, nav fit, mobile entry and return to website')

  const noJsContext = await browser.newContext({ javaScriptEnabled: false }), noJs = await noJsContext.newPage()
  await noJs.goto(lesson); assert.equal(await noJs.locator('noscript audio[controls]').count(), 1); await noJsContext.close()
  const alias = await context.request.get(`${base}/education`, { maxRedirects: 0 }); assert.equal(alias.status(), 308)
  const sitemap = await context.request.get(`${base}/sitemap.xml`); assert.ok((await sitemap.text()).includes('/studio/bitcoin-podcast-101'))
  const audioRange = await context.request.get(`${base}/education/bitcoin-101.mp3`, { headers: { Range: 'bytes=0-1023' } }); assert.equal(audioRange.status(), 206)
  assert.deepEqual(errors, []); record('legacy redirect, native no-JS audio, sitemap, ranged audio and no runtime errors')
} catch (error) {
  failure = error.stack; console.error(error); process.exitCode = 1
  const pages = browser.contexts().flatMap((context) => context.pages())
  for (const [index, page] of pages.entries()) {
    await page.screenshot({ path: path.join(output, `failure-${index}.png`), fullPage: true }).catch(() => {})
    console.error('Page URL:', page.url())
  }
} finally {
  await writeFile(path.join(output, 'results.json'), JSON.stringify({ base, status: failure ? 'failed' : 'passed', failure, results, errors }, null, 2) + '\n')
  await browser.close()
}
