#!/usr/bin/env node
// One-time, non-destructive migration: lets line.strength be NULL, meaning
// "not yet sourced" (same null-as-signal pattern as stick_score and
// founded_year). SQLite can't drop a CHECK/NOT NULL in place, so this
// rebuilds the `line` table with identical columns/ids, then verifies row
// counts and foreign keys. Safe to re-run -- it exits early if strength is
// already nullable.
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.argv[2] || path.join(__dirname, '..', 'data', 'cigars.db');
const db = new DatabaseSync(dbPath);

const cols = db.prepare("SELECT * FROM pragma_table_info('line')").all();
const strength = cols.find((c) => c.name === 'strength');
if (!strength.notnull) {
  console.log('line.strength is already nullable — skipped.');
  process.exit(0);
}

const before = db.prepare('SELECT COUNT(*) AS n FROM line').get().n;
db.exec('PRAGMA foreign_keys = OFF');
db.exec('BEGIN');
try {
  db.exec(`
    CREATE TABLE line_new (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id         INTEGER NOT NULL REFERENCES brand(id),
      name             TEXT NOT NULL,
      slug             TEXT NOT NULL,
      wrapper          TEXT NOT NULL,
      binder           TEXT NOT NULL,
      filler           TEXT NOT NULL,
      strength         TEXT CHECK (strength IS NULL OR strength IN ('mild','mild-medium','medium','medium-full','full')),
      release_year     INTEGER,
      background_text  TEXT NOT NULL,
      image_url TEXT, image_source_name TEXT, image_source_url TEXT, image_checked_at TEXT,
      image_width INTEGER, image_height INTEGER,
      UNIQUE (brand_id, slug)
    );
    INSERT INTO line_new (id, brand_id, name, slug, wrapper, binder, filler, strength, release_year,
                          background_text, image_url, image_source_name, image_source_url,
                          image_checked_at, image_width, image_height)
      SELECT id, brand_id, name, slug, wrapper, binder, filler, strength, release_year,
             background_text, image_url, image_source_name, image_source_url,
             image_checked_at, image_width, image_height FROM line;
    DROP TABLE line;
    ALTER TABLE line_new RENAME TO line;
    CREATE INDEX idx_line_brand ON line(brand_id);
  `);
  const after = db.prepare('SELECT COUNT(*) AS n FROM line').get().n;
  if (after !== before) throw new Error(`row count changed ${before} -> ${after}`);
  const bad = db.prepare('PRAGMA foreign_key_check').all();
  if (bad.length) throw new Error(`foreign key violations: ${JSON.stringify(bad.slice(0, 3))}`);
  db.exec('COMMIT');
  console.log(`line.strength is now nullable (${after} lines preserved).`);
} catch (e) {
  db.exec('ROLLBACK');
  console.error('Migration rolled back:', e.message);
  process.exit(1);
}
db.close();
