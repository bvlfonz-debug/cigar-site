#!/usr/bin/env node
// One-time, non-destructive migration: adds image fields to the `line`
// table. Images are per-blend (line), not per-vitola, since that's what
// manufacturer sites actually provide -- one hero shot per line, reused
// across all vitola sizes on the cigar detail page. Safe to re-run --
// a pragma_table_info check before each ALTER TABLE (SQLite has no
// ADD COLUMN IF NOT EXISTS). Never touches existing rows or tables.
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.argv[2] || path.join(__dirname, '..', 'data', 'cigars.db');

const db = new DatabaseSync(dbPath);

const columns = db.prepare("SELECT name FROM pragma_table_info('line')").all().map((c) => c.name);

const toAdd = [
  ['image_url', 'TEXT'],
  ['image_source_name', 'TEXT'],
  ['image_source_url', 'TEXT'],
  ['image_checked_at', 'TEXT'],
];

for (const [name, type] of toAdd) {
  if (!columns.includes(name)) {
    db.exec(`ALTER TABLE line ADD COLUMN ${name} ${type}`);
    console.log(`Added line.${name} column.`);
  } else {
    console.log(`line.${name} column already present — skipped.`);
  }
}

db.close();
