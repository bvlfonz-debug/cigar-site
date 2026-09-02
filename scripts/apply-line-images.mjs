#!/usr/bin/env node
// One-time apply: writes image_url/image_source_name/image_source_url/
// image_checked_at for the set of (line, image) pairs that passed full
// manual visual verification (see /private/tmp .../scratchpad/final_with_paths.json
// for the review trail). Idempotent -- re-running overwrites the same rows
// with the same values.
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'cigars.db');
const entries = JSON.parse(
  fs.readFileSync(process.argv[2], 'utf8')
);

const db = new DatabaseSync(dbPath);
const checkedAt = new Date().toISOString().slice(0, 10);

const update = db.prepare(
  `UPDATE line SET image_url = ?, image_source_name = ?, image_source_url = ?, image_checked_at = ? WHERE id = ?`
);

let count = 0;
for (const e of entries) {
  const domain = new URL(e.site).hostname.replace(/^www\./, '');
  update.run(e.public_path, domain, e.site, checkedAt, e.line_id);
  count++;
}

console.log(`Updated ${count} line rows with image data.`);
db.close();
