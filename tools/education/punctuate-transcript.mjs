import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';

const require = createRequire(import.meta.url);
const { parse } = require('dotenv');
const { z } = require('zod');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const docsDirectory = path.join(root, 'docs/education');
const transcriptPath = path.join(root, 'public/education/bitcoin-101-transcript.json');
const originalBytes = await readFile(transcriptPath);
const original = JSON.parse(originalBytes.toString('utf8'));
const beforeHash = createHash('sha256').update(originalBytes).digest('hex');
const env = parse(await readFile(path.join(root, '.env.local'), 'utf8'));
const key = process.env.OPENROUTER_API_KEY || env.OPENROUTER_API_KEY;
if (!key) throw new Error('OPENROUTER_API_KEY is missing.');
const model = 'google/gemini-3.1-flash-lite';
const prompt = 'You edit punctuation in verbatim speech-recognition caption fragments. These fragments are consecutive and some end halfway through a sentence. Return exactly every supplied segment id once, in the same order. Add sensible punctuation and capitalization ONLY. Preserve every spoken word, its order, spelling, contractions, and number tokens exactly. Never add, remove, combine, split, correct, or paraphrase words. Do not invent missing words to repair incomplete fragments. Do not expand contractions. Hyphens may be added between existing words. Do not join spaced digits, convert digits to words, or words to digits. Preserve each text within its own id; never move a word into a neighboring segment. Keep fragments as fragments and use context across consecutive fragments to punctuate them. Keep all hesitations and brief responses. No speaker labels, stage directions, commentary, timestamps, em dashes, or metadata. The result is mechanically compared word-for-word and any wording change will reject the entire response.';
await mkdir(path.join(docsDirectory, 'punctuation'), { recursive: true });
await writeFile(path.join(docsDirectory, 'transcript-before-punctuation.json'), `${JSON.stringify(original)}\n`);
await writeFile(path.join(docsDirectory, 'punctuation-prompt.txt'), `${prompt}\n`);

function words(text) {
  return (text.match(/[\p{L}\p{N}]+(?:['\u2019][\p{L}\p{N}]+)*/gu) || []).map((word) => word.toLowerCase().replaceAll('\u2019', "'"));
}

const updatedTexts = new Map();
const requests = [];
const batchSize = 20;
for (let offset = 0; offset < original.segments.length; offset += batchSize) {
  let batch = original.segments.slice(offset, offset + batchSize).map((segment, index) => ({ id: offset + index, text: segment.text }));
  let accepted = false;
  let feedback = '';
  for (let attempt = 0; attempt < 5 && !accepted; attempt++) {
    const schema = z.strictObject({ segments: z.array(z.strictObject({ id: z.number().int(), text: z.string().min(1) })).length(batch.length) });
    const jsonSchema = {
    type: 'object', additionalProperties: false, required: ['segments'],
    properties: {
      segments: {
        type: 'array', minItems: batch.length, maxItems: batch.length,
        items: { type: 'object', additionalProperties: false, required: ['id', 'text'], properties: { id: { type: 'integer' }, text: { type: 'string' } } },
      },
    },
  };
    console.log(JSON.stringify({ status: 'punctuating', model, firstId: offset, count: batch.length, attempt }));
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://afribit.africa', 'X-Title': 'Afribit Caption Punctuation' },
      body: JSON.stringify({
        model, temperature: 0, max_tokens: 12000, provider: { require_parameters: true },
        messages: [{ role: 'system', content: prompt }, { role: 'user', content: `${JSON.stringify({ segments: batch })}${feedback ? `\nPrevious response rejected: ${feedback}. Preserve the original tokens exactly.` : ''}` }],
        response_format: { type: 'json_schema', json_schema: { name: 'caption_punctuation', strict: true, schema: jsonSchema } },
      }),
      signal: AbortSignal.timeout(120000),
    });
    const result = await response.json();
    if (!response.ok || result.error) {
      const message = String(result.error?.message || 'Punctuation request failed').replaceAll(key, '[redacted]');
      throw new Error(`OpenRouter ${response.status}: ${message}`);
    }
    await writeFile(path.join(docsDirectory, 'punctuation', `${model.split('/').at(-1)}-batch-${offset}-attempt-${attempt}.json`), `${JSON.stringify(result, null, 2)}\n`);
    requests.push({ id: result.id, model: result.model || model, firstId: offset, count: batch.length, attempt, usage: result.usage, costUsd: result.usage?.cost ?? null, accepted: false });
    try {
      const edited = schema.parse(JSON.parse(result.choices?.[0]?.message?.content || ''));
      for (let index = 0; index < batch.length; index++) if (edited.segments[index].id !== batch[index].id) throw new Error(`ID mismatch at index ${index}`);
      const rejected = [];
      for (let index = 0; index < batch.length; index++) {
        if (JSON.stringify(words(edited.segments[index].text)) !== JSON.stringify(words(batch[index].text))) rejected.push(batch[index]);
        else updatedTexts.set(batch[index].id, edited.segments[index].text);
      }
      requests.at(-1).acceptedSegments = batch.length - rejected.length;
      requests.at(-1).rejectedIds = rejected.map((segment) => segment.id);
      accepted = rejected.length === 0;
      requests.at(-1).accepted = accepted;
      if (!accepted) {
        feedback = `Word changes in ids ${rejected.map((segment) => segment.id).join(', ')}; only those ids are resubmitted`;
        console.log(JSON.stringify({ status: 'rejected-word-changes', firstId: offset, attempt, ids: requests.at(-1).rejectedIds }));
        batch = rejected;
      }
    } catch (error) {
      feedback = error instanceof Error ? error.message : 'Schema or wording mismatch';
      console.log(JSON.stringify({ status: 'rejected', firstId: offset, attempt, reason: feedback }));
    }
  }
  if (!accepted) throw new Error(`No valid punctuation result for batch starting ${offset}; public transcript remains unchanged.`);
}

const current = JSON.parse(await readFile(transcriptPath, 'utf8'));
if (current.segments.length !== original.segments.length || current.segments.some((segment, index) => segment.start !== original.segments[index].start || segment.end !== original.segments[index].end || segment.text !== original.segments[index].text)) {
  throw new Error('Transcript segments changed during punctuation; refusing to overwrite concurrent work.');
}
if (updatedTexts.size !== current.segments.length) throw new Error('Not all segment IDs have accepted text.');
const updated = { ...current, segments: current.segments.map((segment, index) => ({ ...segment, text: updatedTexts.get(index) })) };
if (updated.duration !== original.duration || JSON.stringify(updated.waveform) !== JSON.stringify(original.waveform)) throw new Error('Duration or waveform changed.');
await writeFile(transcriptPath, `${JSON.stringify(updated)}\n`);

function timestamp(seconds) {
  const milliseconds = Math.round(seconds * 1000);
  return `${String(Math.floor(milliseconds / 3600000)).padStart(2, '0')}:${String(Math.floor(milliseconds / 60000) % 60).padStart(2, '0')}:${String(Math.floor(milliseconds / 1000) % 60).padStart(2, '0')}.${String(milliseconds % 1000).padStart(3, '0')}`;
}
const cues = updated.segments.map((segment, index) => `${index + 1}\n${timestamp(segment.start)} --> ${timestamp(segment.end)}\n${segment.text.replaceAll('-->', '--&gt;').replaceAll('\n', ' ')}\n`);
await writeFile(path.join(root, 'public/education/bitcoin-101.vtt'), `WEBVTT\n\n${cues.join('\n')}`);
await writeFile(path.join(docsDirectory, 'transcript-readable.txt'), updated.segments.map((segment) => `[${timestamp(segment.start)}] ${segment.text}`).join('\n') + '\n');
const provenance = {
  provider: 'OpenRouter', model, endpoint: 'https://openrouter.ai/api/v1/chat/completions', completedAt: new Date().toISOString(),
  prompt: 'docs/education/punctuation-prompt.txt', beforeSha256: beforeHash,
  afterSha256: createHash('sha256').update(await readFile(transcriptPath)).digest('hex'),
  validation: { strictSchema: true, count: updated.segments.length, ids: 'exact sequence', words: 'identical Unicode word/number tokens, case-insensitive, apostrophe-normalized', timestampsUnchanged: true, durationUnchanged: true, waveformUnchanged: true },
  knownCostUsd: requests.reduce((sum, request) => sum + (request.costUsd || 0), 0), requests,
};
await writeFile(path.join(docsDirectory, 'punctuation-provenance.json'), `${JSON.stringify(provenance, null, 2)}\n`);
console.log(JSON.stringify({ status: 'complete', segments: updated.segments.length, knownCostUsd: provenance.knownCostUsd, example: updated.segments[0] }));
