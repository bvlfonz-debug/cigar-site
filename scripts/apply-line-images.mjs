#!/usr/bin/env node
// Batch apply: for a JSON array of manually-verified (line, source image)
// pairs, resizes each source image without cropping (see
// scripts/lib/image-pipeline.mjs for the dimension rules), saves it under
// public/, and writes image_url/image_width/image_height/image_source_name/
// image_source_url/image_checked_at onto the matching line row. Idempotent --
// re-running re-resizes from the same source and overwrites with the same
// values.
//
// Usage: node scripts/apply-line-images.mjs <entries.json>
// Each entry: { file: <source image path>, line_id, brand_slug, line_slug, site }
import fs from 'node:fs';
import { openDb, resizeAndSaveCigarImage, writeLineImageRecord } from './lib/image-pipeline.mjs';

const entries = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const db = openDb();

let count = 0;
for (const e of entries) {
  const { publicPath, width, height } = await resizeAndSaveCigarImage(e.file, e.brand_slug, e.line_slug);
  writeLineImageRecord(db, { lineId: e.line_id, publicPath, width, height, siteUrl: e.site });
  count++;
}

console.log(`Updated ${count} line rows with image data.`);
db.close();
