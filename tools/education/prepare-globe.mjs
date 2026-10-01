import { mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const sharp = require('sharp')
const source = 'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg'
const response = await fetch(source)
if (!response.ok) throw new Error(`NASA map: ${response.status}`)
const original = Buffer.from(await response.arrayBuffer())
const texture = await sharp(original).resize(2048, 1024).webp({ quality: 85 }).toBuffer()
await mkdir('public/education', { recursive: true })
await writeFile('public/education/earth-surface.webp', texture)
// Text-free orthographic fallback for browsers without WebGL.
const surface = await sharp(texture).ensureAlpha().raw().toBuffer()
const width = 1600, height = 900, radius = 345, centerX = 800, centerY = 450
const pixels = Buffer.alloc(width * height * 3)
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const offset = (y * width + x) * 3
  pixels[offset] = 7; pixels[offset + 1] = 11; pixels[offset + 2] = 12
  const nx = (x - centerX) / radius, ny = (centerY - y) / radius
  if (nx * nx + ny * ny >= 1) continue
  const nz = Math.sqrt(1 - nx * nx - ny * ny)
  const longitude = Math.atan2(nx, nz) + .35
  const latitude = Math.asin(ny)
  const u = Math.floor((longitude / (2 * Math.PI) + .5) * 2048) % 2048
  const v = Math.min(1023, Math.floor((.5 - latitude / Math.PI) * 1024))
  const sample = (v * 2048 + u) * 4
  const light = .36 + .64 * Math.max(0, nx * -.45 + ny * .25 + nz * .86)
  for (let c = 0; c < 3; c++) pixels[offset + c] = Math.round(surface[sample + c] * light)
}
const cover = await sharp(pixels, { raw: { width, height, channels: 3 } }).webp({ quality: 88 }).toBuffer()
await writeFile('public/education/globe-cover.webp', cover)
await writeFile('docs/education/globe-provenance.json', JSON.stringify({
  source, credit: 'NASA Earth Observatory, Blue Marble Next Generation, December 2004',
  sourcePage: 'https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography-bathymetry/',
  usage: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
  notes: 'Satellite map only; no video, titles, logo, captions or embedded words. No endorsement implied. Cover is an orthographic projection of this map.',
  sourceSha256: createHash('sha256').update(original).digest('hex'),
  artifacts: [ ['public/education/earth-surface.webp', texture], ['public/education/globe-cover.webp', cover] ].map(([path, bytes]) => ({ path, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') }))
}, null, 2) + '\n')
console.log('Prepared text-free globe texture and cover.')
