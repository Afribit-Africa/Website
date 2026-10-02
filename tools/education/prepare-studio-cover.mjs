import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'

const require = createRequire(import.meta.url)
const { chromium } = require(process.argv[2] || 'playwright')
const { build } = require('esbuild')
const sharp = require('sharp')
const root = path.resolve(import.meta.dirname, '../..')
const bundled = await build({
  stdin: { contents: "import { drawStudioBackground } from './src/components/education/background-runtime'; drawStudioBackground(document.querySelector('canvas').getContext('2d'), 1600, 900, 12);", resolveDir: root, loader: 'ts' },
  bundle: true, platform: 'browser', format: 'iife', write: false,
  tsconfig: path.join(root, 'tsconfig.json'),
})
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 })
  await page.setContent('<html><body style="margin:0"><canvas width="1600" height="900"></canvas></body></html>')
  await page.addScriptTag({ content: bundled.outputFiles[0].text })
  const png = await page.locator('canvas').screenshot()
  const cover = await sharp(png).webp({ quality: 90 }).toBuffer()
  await mkdir(path.join(root, 'public/education'), { recursive: true })
  await writeFile(path.join(root, 'public/education/studio-cover.webp'), cover)
  await writeFile(path.join(root, 'docs/education/studio-background-provenance.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    description: 'Text-free cover rendered from the same deterministic canvas beams used in Studio. No external video or AI-generated media.',
    generator: 'tools/education/prepare-studio-cover.mjs',
    license: 'MIT; adapted from Kokonut UI. See kokonut-LICENSE.txt.',
    sources: [
      'https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/beams-background.tsx',
      'https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/background-paths.tsx',
      'https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/flow-field.tsx',
    ],
    artifact: { path: 'public/education/studio-cover.webp', width: 1600, height: 900, bytes: cover.length, sha256: createHash('sha256').update(cover).digest('hex') },
  }, null, 2) + '\n')
  console.log(`Prepared text-free Studio cover: ${cover.length} bytes, 1600x900`)
} finally { await browser.close() }
