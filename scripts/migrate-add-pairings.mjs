#!/usr/bin/env node
// One-time, non-destructive migration: adds the cigar pairing citation and
// community-pairing tables to the live data/cigars.db. Safe to re-run
// (CREATE TABLE IF NOT EXISTS) but only needs to run once. Never touches
// existing rows or tables.
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.argv[2] || path.join(__dirname, '..', 'data', 'cigars.db');

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS cigar_pairing_citation (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    line_id        INTEGER NOT NULL REFERENCES line(id),
    pairing_text   TEXT NOT NULL,
    category       TEXT,
    source_name    TEXT NOT NULL,
    source_url     TEXT NOT NULL,
    published_date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cigar_pairing_community (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    line_id         INTEGER NOT NULL REFERENCES line(id),
    submitter_name  TEXT NOT NULL,
    pairing_text    TEXT NOT NULL,
    submitted_date  TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_cigar_pairing_citation_line ON cigar_pairing_citation(line_id);
  CREATE INDEX IF NOT EXISTS idx_cigar_pairing_community_line ON cigar_pairing_community(line_id);
`);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'cigar_pairing%'").all();
console.log('Pairing tables now present:', tables.map((t) => t.name));

db.close();
