#!/usr/bin/env node
// Adds the same image fields `line` already has to `vitola`, so a specific
// size can carry its own exact photo (e.g. the Gran Reserva Churchill's own
// shot) instead of only ever showing the line's generic hero image. Page
// rendering prefers vitola.image_url, falls back to line.image_url, falls
// back to the typographic emblem. Idempotent, same pattern as the other
// migrate-add-*-images.mjs scripts.
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.argv[2] || path.join(__dirname, '..', 'data', 'cigars.db');

const db = new DatabaseSync(dbPath);
const columns = db.prepare("SELECT name FROM pragma_table_info('vitola')").all().map((c) => c.name);

const toAdd = [
  ['image_url', 'TEXT'],
  ['image_source_name', 'TEXT'],
  ['image_source_url', 'TEXT'],
  ['image_checked_at', 'TEXT'],
  ['image_width', 'INTEGER'],
  ['image_height', 'INTEGER'],
];

for (const [name, type] of toAdd) {
  if (!columns.includes(name)) {
    db.exec(`ALTER TABLE vitola ADD COLUMN ${name} ${type}`);
    console.log(`Added vitola.${name} column.`);
  } else {
    console.log(`vitola.${name} column already present — skipped.`);
  }
}

db.close();
