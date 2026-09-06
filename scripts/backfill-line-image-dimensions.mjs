#!/usr/bin/env node
// One-time backfill: reads the intrinsic pixel dimensions of every line's
// image_url (a file under public/) and stores them on the row, so page
// templates can size each photo's frame to its own aspect ratio at build
// time without re-reading the file on every render.
import { DatabaseSync } from 'node:sqlite';
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'cigars.db');
const publicDir = path.join(__dirname, '..', 'public');

const db = new DatabaseSync(dbPath);
const rows = db.prepare('SELECT id, image_url FROM line WHERE image_url IS NOT NULL').all();

const update = db.prepare('UPDATE line SET image_width = ?, image_height = ? WHERE id = ?');

let count = 0;
for (const row of rows) {
  const filePath = path.join(publicDir, row.image_url);
  const meta = await sharp(filePath).metadata();
  update.run(meta.width, meta.height, row.id);
  count++;
}

console.log(`Backfilled dimensions for ${count} lines.`);
db.close();
