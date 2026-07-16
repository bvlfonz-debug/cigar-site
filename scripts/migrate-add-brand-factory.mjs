#!/usr/bin/env node
// One-time, non-destructive migration: adds the factory entity, brand/factory
// source-citation tables, and a brand.factory_id link column to the live
// data/cigars.db. Safe to re-run — CREATE TABLE IF NOT EXISTS for the new
// tables, and a pragma_table_info check before the ALTER TABLE (SQLite has no
// ADD COLUMN IF NOT EXISTS). Never touches existing rows or tables.
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.argv[2] || path.join(__dirname, '..', 'data', 'cigars.db');

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS factory (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    slug          TEXT NOT NULL UNIQUE,
    country       TEXT NOT NULL,
    city          TEXT,
    founded_year  INTEGER,
    history_text  TEXT
  );

  CREATE TABLE IF NOT EXISTS brand_source (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_id      INTEGER NOT NULL REFERENCES brand(id),
    source_name   TEXT NOT NULL,
    source_url    TEXT NOT NULL,
    fact_note     TEXT NOT NULL,
    retrieved_at  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS factory_source (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    factory_id    INTEGER NOT NULL REFERENCES factory(id),
    source_name   TEXT NOT NULL,
    source_url    TEXT NOT NULL,
    fact_note     TEXT NOT NULL,
    retrieved_at  TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_brand_source_brand ON brand_source(brand_id);
  CREATE INDEX IF NOT EXISTS idx_factory_source_factory ON factory_source(factory_id);
`);

const brandColumns = db.prepare("SELECT name FROM pragma_table_info('brand')").all().map((c) => c.name);
if (!brandColumns.includes('factory_id')) {
  db.exec('ALTER TABLE brand ADD COLUMN factory_id INTEGER REFERENCES factory(id)');
  console.log('Added brand.factory_id column.');
} else {
  console.log('brand.factory_id column already present — skipped.');
}
db.exec('CREATE INDEX IF NOT EXISTS idx_brand_factory ON brand(factory_id)');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%factory%' OR name = 'brand_source'").all();
console.log('Factory/brand-source tables now present:', tables.map((t) => t.name));

db.close();
