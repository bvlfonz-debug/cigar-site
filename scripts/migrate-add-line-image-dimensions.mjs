#!/usr/bin/env node
// Adds image_width/image_height to `line` -- needed so the detail page can
// size each photo's frame to its own aspect ratio instead of force-cropping
// every image into one fixed box (which is what caused wide manufacturer
// banners to render zoomed-in and tall renders to render oddly cropped).
// Idempotent, same pragma_table_info pattern as migrate-add-line-images.mjs.
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.argv[2] || path.join(__dirname, '..', 'data', 'cigars.db');

const db = new DatabaseSync(dbPath);
const columns = db.prepare("SELECT name FROM pragma_table_info('line')").all().map((c) => c.name);

for (const [name, type] of [['image_width', 'INTEGER'], ['image_height', 'INTEGER']]) {
  if (!columns.includes(name)) {
    db.exec(`ALTER TABLE line ADD COLUMN ${name} ${type}`);
    console.log(`Added line.${name} column.`);
  } else {
    console.log(`line.${name} column already present — skipped.`);
  }
}

db.close();
