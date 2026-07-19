#!/usr/bin/env node
// One-time, non-destructive migration: adds the community review table to
// the live data/cigars.db. Safe to re-run (CREATE TABLE IF NOT EXISTS) but
// only needs to run once. Never touches existing rows or tables.
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.argv[2] || path.join(__dirname, '..', 'data', 'cigars.db');

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS cigar_community_review (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    vitola_id             INTEGER NOT NULL REFERENCES vitola(id),
    external_id           TEXT NOT NULL UNIQUE,
    reviewer_name         TEXT NOT NULL,
    star_rating           INTEGER NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
    strength_experienced  TEXT CHECK (strength_experienced IN ('mild','mild-medium','medium','medium-full','full')),
    draw_experienced      TEXT CHECK (draw_experienced IN ('tight','ideal','loose')),
    burn_experienced      TEXT CHECK (burn_experienced IN ('poor','average','excellent')),
    tasting_notes_user    TEXT NOT NULL DEFAULT '[]',
    review_text           TEXT,
    submitted_date        TEXT NOT NULL,
    report_count          INTEGER NOT NULL DEFAULT 0,
    hidden                INTEGER NOT NULL DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_cigar_community_review_vitola ON cigar_community_review(vitola_id);
`);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = 'cigar_community_review'").all();
console.log('Community review table now present:', tables.map((t) => t.name));

db.close();
