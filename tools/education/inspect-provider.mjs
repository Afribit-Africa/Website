import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { parse } = require('dotenv');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const env = parse(await readFile(path.join(root, '.env.local'), 'utf8'));
const key = process.env.OPENROUTER_API_KEY || env.OPENROUTER_API_KEY;
if (!key) throw new Error('OPENROUTER_API_KEY is missing.');

async function get(endpoint) {
  const response = await fetch(`https://openrouter.ai/api/v1/${endpoint}`, {
    headers: { Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`OpenRouter ${endpoint}: HTTP ${response.status}`);
  return response.json();
}

const authorization = await get('key');
const imageModels = await get('images/models');
const transcriptionModels = await get('models?output_modalities=transcription');
const snapshot = {
  checkedAt: new Date().toISOString(),
  keyValid: Boolean(authorization.data),
  documentation: [
    'https://openrouter.ai/docs/guides/overview/multimodal/image-generation',
    'https://openrouter.ai/blog/tutorials/transcription-on-openrouter/',
  ],
  imageModels: imageModels.data.map(({ id, name, supported_parameters }) => ({ id, name, supportedParameters: supported_parameters })),
  transcriptionModels: transcriptionModels.data.map(({ id, name, pricing }) => ({ id, name, pricing })),
};
await mkdir(path.join(root, 'docs/education'), { recursive: true });
await writeFile(path.join(root, 'docs/education/provider-capabilities.json'), `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(JSON.stringify({ keyValid: snapshot.keyValid, imageModels: snapshot.imageModels.length, transcriptionModels: snapshot.transcriptionModels.length }));
