import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { z } = require('zod');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const transcriptPath = path.join(root, 'public/education/bitcoin-101-transcript.json');
const transcript = JSON.parse(await readFile(transcriptPath, 'utf8'));
const chapters = z.array(z.strictObject({ start: z.number().nonnegative(), title: z.string().min(1), summary: z.string().min(1) })).min(1).parse(JSON.parse(await readFile(path.join(root, 'docs/education/chapters.json'), 'utf8')));
for (let index = 0; index < chapters.length; index++) {
  const chapter = chapters[index];
  if (!transcript.segments.some((segment) => segment.start === chapter.start)) throw new Error(`Chapter ${index} does not begin at an actual caption boundary.`);
  if (index && chapter.start <= chapters[index - 1].start) throw new Error('Chapters must have increasing start times.');
}
await writeFile(transcriptPath, `${JSON.stringify({ ...transcript, chapters })}\n`);
console.log(JSON.stringify({ status: 'done', chapters }));
