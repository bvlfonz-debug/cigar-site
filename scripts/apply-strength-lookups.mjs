#!/usr/bin/env node
// Fills line.strength ONLY where it is currently NULL ("not yet sourced"),
// from data/research/strength-lookups.json ({ "brand-slug/line-slug": { strength, source_url } }).
// Never overwrites a value that is already set.
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(path.join(__dirname, '..', 'data', 'cigars.db'));
const lookups = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'research', 'strength-lookups.json'), 'utf8'));
const OK = ['mild', 'mild-medium', 'medium', 'medium-full', 'full'];
let applied = 0; const missing = [];
for (const [key, v] of Object.entries(lookups)) {
  const [b, l] = key.split('/');
  if (!OK.includes(v.strength)) { missing.push(`${key}: invalid "${v.strength}"`); continue; }
  const r = db.prepare(`UPDATE line SET strength = ? WHERE strength IS NULL AND slug = ? AND brand_id = (SELECT id FROM brand WHERE slug = ?)`).run(v.strength, l, b);
  if (Number(r.changes) === 1) applied++; else missing.push(`${key}: no NULL-strength line matched`);
}
console.log(JSON.stringify({ applied, notApplied: missing }, null, 1));
