#!/usr/bin/env node
// One-time, non-destructive migration: adds the Lounge Directory tables to
// the live data/cigars.db. Safe to re-run (CREATE TABLE IF NOT EXISTS) but
// only needs to run once. Unlike scripts/seed.mjs, this never touches
// existing rows or tables.
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.argv[2] || path.join(__dirname, '..', 'data', 'cigars.db');

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS lounge (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    name                    TEXT NOT NULL,
    slug                    TEXT NOT NULL,
    city                    TEXT NOT NULL,
    city_slug               TEXT NOT NULL,
    state                   TEXT,
    country                 TEXT NOT NULL DEFAULT 'USA',
    address                 TEXT NOT NULL,
    phone                   TEXT,
    website                 TEXT,
    hours_text              TEXT,
    walk_in_or_membership   TEXT CHECK (walk_in_or_membership IN ('walk-in','membership','both')),
    membership_details      TEXT,
    indoor_smoking_status   TEXT CHECK (indoor_smoking_status IN ('allowed','not-allowed','allowed-with-restrictions')),
    indoor_smoking_note     TEXT,
    amenities               TEXT NOT NULL DEFAULT '[]',
    overview_text           TEXT NOT NULL,
    lounge_score            REAL,
    facts_source_url        TEXT,
    facts_checked_at        TEXT,
    UNIQUE (city_slug, slug)
  );

  CREATE TABLE IF NOT EXISTS lounge_external_rating (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    lounge_id      INTEGER NOT NULL REFERENCES lounge(id),
    source_name    TEXT NOT NULL,
    source_type    TEXT NOT NULL DEFAULT 'platform' CHECK (source_type IN ('critic','platform')),
    score          REAL NOT NULL,
    score_scale    REAL NOT NULL,
    review_count   INTEGER,
    rating_date    TEXT NOT NULL,
    url            TEXT NOT NULL,
    key_notes_text TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_lounge_city ON lounge(city_slug);
  CREATE INDEX IF NOT EXISTS idx_lounge_external_rating_lounge ON lounge_external_rating(lounge_id);
`);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'lounge%'").all();
console.log('Lounge tables now present:', tables.map((t) => t.name));

db.close();
