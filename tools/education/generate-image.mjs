import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { parse } = require('dotenv');
const sharp = require('sharp');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [promptArgument, outputArgument] = process.argv.slice(2);
if (!promptArgument || !outputArgument) {
  throw new Error('Usage: node tools/education/generate-image.mjs docs/education/prompt.json docs/education/output.webp');
}
const promptPath = path.resolve(root, promptArgument);
const outputPath = path.resolve(root, outputArgument);
const allowed = ['docs/education', 'public/education'].map((entry) => path.resolve(root, entry) + path.sep);
if (!allowed.some((prefix) => outputPath.startsWith(prefix))) throw new Error('Output must stay in education media folders.');
const env = parse(await readFile(path.join(root, '.env.local'), 'utf8'));
const key = process.env.OPENROUTER_API_KEY || env.OPENROUTER_API_KEY;
if (!key) throw new Error('OPENROUTER_API_KEY is missing from the local environment.');
const request = JSON.parse(await readFile(promptPath, 'utf8'));
const startedAt = new Date().toISOString();
console.log(JSON.stringify({ status: 'generating', model: request.model, output: outputArgument }));
const response = await fetch('https://openrouter.ai/api/v1/images', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://afribit.africa',
    'X-Title': 'Afribit Bitcoin Education Media',
  },
  body: JSON.stringify(request),
  signal: AbortSignal.timeout(300000),
});
const result = await response.json();
if (!response.ok || result.error) {
  const message = String(result.error?.message || 'Image generation request failed').replaceAll(key, '[redacted]');
  throw new Error(`OpenRouter ${response.status}: ${message}`);
}
const image = result.data?.find((entry) => entry.b64_json);
if (!image) throw new Error('OpenRouter returned no image bytes.');
if (image.media_type === 'image/svg+xml') throw new Error('A raster output is required.');
const imageBytes = Buffer.from(image.b64_json, 'base64');
await mkdir(path.dirname(outputPath), { recursive: true });
const metadata = await sharp(imageBytes).metadata();
await sharp(imageBytes).resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 88, effort: 6 }).toFile(outputPath);
const provenance = {
  provider: 'OpenRouter',
  endpoint: 'https://openrouter.ai/api/v1/images',
  model: request.model,
  request: promptArgument.replaceAll('\\', '/'),
  output: outputArgument.replaceAll('\\', '/'),
  startedAt,
  completedAt: new Date().toISOString(),
  generationId: response.headers.get('x-generation-id') || result.id || null,
  dimensions: { width: metadata.width, height: metadata.height },
  usage: result.usage || null,
  costUsd: result.usage?.cost ?? null,
  optimization: { format: 'webp', quality: 88, maximumWidth: 2400 },
  synthetic: true,
};
const provenancePath = path.join(root, 'docs/education', `${path.parse(outputPath).name}-provenance.json`);
await writeFile(provenancePath, `${JSON.stringify(provenance, null, 2)}\n`);
console.log(JSON.stringify({ status: 'done', output: outputArgument, dimensions: provenance.dimensions, usage: provenance.usage }));
