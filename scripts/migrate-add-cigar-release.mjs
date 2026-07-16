#!/usr/bin/env node
// One-time, non-destructive migration: adds the Cigar Release Calendar table
// to the live data/cigars.db. Safe to re-run (CREATE TABLE IF NOT EXISTS) but
// only needs to run once. Unlike scripts/seed.mjs, this never touches
// existing rows or tables.
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.argv[2] || path.join(__dirname, '..', 'data', 'cigars.db');

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS cigar_release (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    slug                  TEXT NOT NULL UNIQUE,
    brand_name            TEXT NOT NULL,
    brand_slug            TEXT REFERENCES brand(slug),
    line_name             TEXT NOT NULL,
    announced_date        TEXT NOT NULL,
    release_month         TEXT,
    release_date_text     TEXT,
    summary_text          TEXT NOT NULL,
    source_name           TEXT NOT NULL,
    source_url            TEXT NOT NULL,
    related_vitola_id     INTEGER REFERENCES vitola(id),
    related_news_item_id  INTEGER REFERENCES news_item(id)
  );

  CREATE INDEX IF NOT EXISTS idx_cigar_release_brand ON cigar_release(brand_slug);
  CREATE INDEX IF NOT EXISTS idx_cigar_release_vitola ON cigar_release(related_vitola_id);
`);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'cigar_release%'").all();
console.log('Cigar release tables now present:', tables.map((t) => t.name));

db.close();
