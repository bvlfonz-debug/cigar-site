#!/usr/bin/env node
// Attaches the owner's own, visually verified product photos to line rows.
// Usage: node scripts/apply-owner-photos.mjs <entries.json>   (array of { file, brand_slug, line_slug })
// Resolves each line by brand slug + line slug (never by fuzzy name), skips lines that already have
// a photo, resizes via the shared non-cropping pipeline, and credits the photo to Cigar Codex.
import fs from 'node:fs';
import { openDb, resizeAndSaveCigarImage, writeLineImageRecord } from './lib/image-pipeline.mjs';
const entries = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const db = openDb();
let done = 0; const problems = [];
for (const e of entries) {
  const line = db.prepare('SELECT l.id, l.image_url FROM line l JOIN brand b ON b.id = l.brand_id WHERE b.slug = ? AND l.slug = ?').get(e.brand_slug, e.line_slug);
  if (!line) { problems.push(`${e.brand_slug}/${e.line_slug}: no such line`); continue; }
  if (line.image_url) { problems.push(`${e.brand_slug}/${e.line_slug}: already has a photo, left alone`); continue; }
  if (!fs.existsSync(e.file)) { problems.push(`${e.brand_slug}/${e.line_slug}: file missing ${e.file}`); continue; }
  const { publicPath, width, height } = await resizeAndSaveCigarImage(e.file, e.brand_slug, e.line_slug);
  writeLineImageRecord(db, { lineId: line.id, publicPath, width, height, siteUrl: 'https://cigar-site.vercel.app/', sourceName: 'Cigar Codex' });
  done++;
}
console.log(JSON.stringify({ attached: done, problems }, null, 1));
db.close();
