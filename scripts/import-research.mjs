#!/usr/bin/env node
// Imports the "Cigar Codex research" JSON batches (one folder per brand) into
// data/cigars.db. Append-only: inserts new brands/lines/vitolas, appends
// vitolas to existing lines, never updates or deletes an existing row.
//
// Usage:
//   node scripts/import-research.mjs <researchRoot>            # dry run (default)
//   node scripts/import-research.mjs <researchRoot> --apply    # write to the DB
//
// Optional: data/research/strength-lookups.json -- { "brand-slug/line-slug": { strength, source_url } }
// supplies a single-source strength for lines whose research file left it out.
// Anything not mappable to the 5-value enum stays NULL ("not yet sourced").
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeStickScore } from './lib/stickscore.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = process.argv[2];
const APPLY = process.argv.includes('--apply');
if (!root) {
  console.error('Usage: node scripts/import-research.mjs <researchRoot> [--apply]');
  process.exit(1);
}
const dbPath = path.join(__dirname, '..', 'data', 'cigars.db');
const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON');
const at = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [`@${k}`, v]));

const SKIP_FOLDERS = new Set(['padron']); // owner: on hold, never touch
const UNKNOWN = 'Not yet sourced';

const slugify = (t) =>
  t.toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const norm = (t) =>
  t.toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, 'and')
    .replace(/\b(cigars?|cigar co|co|company|premium|tobacco|tobac|the|by)\b/g, '').replace(/[^a-z0-9]/g, '');

const report = { newBrands: [], newLines: [], newVitolas: 0, appended: [], skipped: [], flags: [], unresolved: [], strengthNull: [] };
const skip = (file, why) => report.skipped.push({ file, why });
const flag = (file, why) => report.flags.push({ file, why });

// Research descriptions sometimes carry workflow chatter ("not on the site at all",
// "Mac folder", "recommend a visual check") that must not reach the public site.
// Sentences containing it are dropped (lossy but never invents anything).
const META = /(not on the site|on the site|the site|site's|our site|this site|absent|brand index|\bmac\b|photo|research|session|\bflag|unverified|unconfirmed|recommend|disambiguation|correction|filename|folder|\bI\b|\byou(r)?\b|\bwe\b|\bour\b|this batch|presum|inferred|unresolved|treating|modeled|wikipedia|does not include|not independently|not verified|genuinely distinct|confirmed as a distinct|distinct from|distinct sub-?line from|not just a|catalog|\bsite\b|decode|important|only facts|assumption|search-result|\bcap\b|not covered here|this entry|this file|distinct from the site|already listed|conflict|\bnote\b|wasn't|couldn't|could not|not confirmed|no source|confirmed absent|sub-?brand of the site)/i;
function cleanText(t) {
  if (typeof t !== 'string') return '';
  return t.split(/(?<=[a-z0-9)'"”][.!?])\s+(?=[A-Z0-9'"‘“])/).filter((x) => !META.test(x) && /^([A-Z'"‘“]|\d+[,.]?\d*\s?(x|[A-Z%]|th|st|nd|rd|-))/.test(x.trim())).join(' ').trim();
}
const COUNTRIES = ['Dominican Republic', 'Nicaragua', 'Honduras', 'Mexico', 'Costa Rica', 'Ecuador', 'Peru', 'United States', 'USA', 'Cuba', 'Brazil', 'Spain', 'Colombia', 'Panama', 'Indonesia', 'Philippines', 'Switzerland', 'Germany', 'Italy'];
function countryOf(raw) {
  if (typeof raw !== 'string') return null;
  const head = raw.replace(/\s*\(.*$/, '').trim();
  const hit = COUNTRIES.filter((c) => head.toLowerCase().includes(c.toLowerCase()));
  if (hit.length === 1) return hit[0] === 'USA' ? 'United States' : hit[0];
  return null;
}

// ---- brand lookup ---------------------------------------------------------
const dbBrands = () => db.prepare('SELECT * FROM brand').all();
function findBrand(name, slug) {
  const nn = norm(name);
  return dbBrands().find((b) => (slug && b.slug === slug) || norm(b.name) === nn || (slug && norm(b.slug) === norm(slug)) || b.slug === slugify(name));
}

// ---- parsing helpers ------------------------------------------------------
const STRENGTHS = ['mild', 'mild-medium', 'medium', 'medium-full', 'full'];
function mapStrength(raw) {
  if (raw == null || typeof raw !== 'string') return null;
  const s = raw.trim().toLowerCase().replace(/\s*(-?bodied|strength)\s*$/, '').replace(/\s+/g, '-');
  return STRENGTHS.includes(s) ? s : null;
}
// Pulls an explicit single-value strength statement out of a line's own research text
// (e.g. "medium-bodied", "medium-full strength"). Ranges ("medium to full") and conflicting
// mentions return null so they fall through to a proper single-source lookup.
function mineStrength(text) {
  if (typeof text !== 'string' || !text) return null;
  const t = text.toLowerCase().replace(/[–—]/g, '-');
  if (/(mild|medium|full)[-\s]*(bodied|body|strength)?[-\s]*(to|and|or|building|trending|\/)[-\s]*(mild|medium|full)/.test(t)) return null;
  const found = new Set();
  for (const m of t.matchAll(/\b(mild-medium|medium-full|mild|medium|full)[- ](bodied|body|strength|bodied)\b/g)) found.add(m[1]);
  for (const m of t.matchAll(/\b(mild-medium|medium-full)\b/g)) found.add(m[1]);
  return found.size === 1 ? [...found][0] : null;
}
function textField(v) {
  if (v == null) return UNKNOWN;
  if (typeof v === 'string') return v.trim() || UNKNOWN;
  if (typeof v === 'object') return Object.entries(v).map(([k, x]) => `${k}: ${x}`).join(' / ');
  return String(v);
}
const SHAPES = ['petit corona', 'double corona', 'long corona', 'lonsdale', 'panetela', 'lancero', 'belicoso', 'torpedo', 'perfecto',
  'churchill', 'robusto', 'toro', 'gordo', 'corona', 'figurado', 'culebra', 'cigarillo', 'presidente'];
function vitolaType(name, sizeStr, notes, len, rg) {
  const hay = `${sizeStr ?? ''} ${name ?? ''} ${notes ?? ''}`.toLowerCase();
  for (const s of SHAPES) if (hay.includes(s)) return s;
  if (rg >= 54) return 'gordo';
  if (rg <= 41 && len >= 6.5) return 'lancero';
  if (rg <= 38) return 'panetela';
  if (rg <= 46) return len >= 5.75 ? 'lonsdale' : 'corona';
  if (len >= 6.75) return 'churchill';
  if (len >= 5.75) return 'toro';
  return 'robusto';
}
function parseSize(s) {
  if (typeof s !== 'string') return null;
  const m = s.match(/^\s*(\d+(?:\.\d+)?)\s*(?:["”″]\s*)?[x×]\s*(\d{2,3})\s*(?:$|[,(;\-–:]|\s+(?:per|box|pressed|tapered|perfecto|belicoso|torpedo|lancero|\())/i);
  if (!m) return null;
  const len = parseFloat(m[1]), rg = parseInt(m[2], 10);
  if (!(len >= 2 && len <= 12) || !(rg >= 20 && rg <= 100)) return null;
  return { len, rg };
}
function vitolaSummary(brandName, lineName, v, p) {
  const n = (v.notes ?? '').trim();
  if (n && n.length <= 220 && !/^(unverified|unconfirmed)/i.test(n)) return n;
  return `${v.name}, ${p.len} x ${p.rg}, part of the ${lineName} line from ${brandName}.`;
}

// ---- normalising the various file shapes ----------------------------------
function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return { __error: e.message }; }
}
// Returns [{ brandObj, line, vitolas, researchSources, notes }]
function linesOf(d) {
  if (d.line && typeof d.line === 'object') return [{ line: d.line, vitolas: d.vitolas ?? [] }];
  if (Array.isArray(d.lines)) return d.lines.map((x) => ({ line: x.line, vitolas: x.vitolas ?? [] }));
  return null;
}
function normaliseVitola(v) {
  // two shapes: research {name,size,notes,sources} or db {size_name,length_in,ring_gauge,...}
  if (v.size_name != null) {
    const ok = typeof v.length_in === 'number' && typeof v.ring_gauge === 'number';
    return { name: v.size_name, slug: v.slug ?? slugify(v.size_name), len: ok ? v.length_in : null, rg: ok ? v.ring_gauge : null,
      type: v.vitola_type ? String(v.vitola_type).toLowerCase() : undefined, summary: v.summary_review || undefined, notes: null,
      tasting_notes: (v.tasting_notes ?? []).filter((x) => typeof x === 'string'),
      smoke: v.smoke_time_min ?? null, boxes: (v.box_counts ?? []).filter((x) => Number.isInteger(x)),
      critics: (v.critic_reviews ?? []).filter((c) => c && c.score != null && c.review_date && c.url).map((c) => ({ ...c, score_scale: Number(c.score_scale ?? 100) })),
      rawSize: ok ? `${v.length_in} x ${v.ring_gauge}` : null };
  }
  return { name: v.name, rawSize: v.size, notes: v.notes ?? null, critics: [], tasting_notes: [], smoke: null, boxes: [] };
}

// ---- per-folder pass ------------------------------------------------------
const lookups = fs.existsSync(path.join(__dirname, '..', 'data', 'research', 'strength-lookups.json'))
  ? JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'research', 'strength-lookups.json'), 'utf8')) : {};
const overrides = fs.existsSync(path.join(__dirname, '..', 'data', 'research', 'import-overrides.json'))
  ? JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'research', 'import-overrides.json'), 'utf8')) : { folderBrand: {}, fileBrand: {} };

const folders = fs.readdirSync(root).filter((f) => fs.statSync(path.join(root, f)).isDirectory()).sort();
const inserts = []; // deferred work, applied inside one transaction

for (const folder of folders) {
  if (SKIP_FOLDERS.has(slugify(folder))) continue;
  const dir = path.join(root, folder);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
  const parsed = files.map((f) => ({ f, rel: `${folder}/${f}`, d: readJson(path.join(dir, f)) }));

  // folder-level default brand
  const distinctBrandObjs = new Map();
  for (const x of parsed) if (x.d.brand && typeof x.d.brand === 'object' && x.d.brand.name) distinctBrandObjs.set(x.d.brand.name, x.d.brand);
  let folderBrandName = overrides.folderBrand?.[folder] ?? null;
  if (!folderBrandName) {
    const hit = findBrand(folder, null);
    if (hit) folderBrandName = hit.name;
  }
  if (!folderBrandName && distinctBrandObjs.size === 1) folderBrandName = [...distinctBrandObjs.keys()][0];
  const folderBrandObj = folderBrandName ? distinctBrandObjs.get(folderBrandName) ?? null : null;

  for (const { f, rel, d } of parsed) {
    if (f === '_image_manifest.json') continue;
    if (/UNRESOLVED|UNCONFIRMED/i.test(f)) { report.unresolved.push(rel); continue; }
    if (d.__error) { skip(rel, `invalid JSON: ${d.__error}`); continue; }

    // ---- supplement files ----
    if (Array.isArray(d.additional_vitolas)) {
      const bName = overrides.fileBrand?.[rel] ?? folderBrandName;
      const brand = bName ? findBrand(bName, null) : null;
      if (!brand) { skip(rel, `supplement: cannot resolve brand (folder "${folder}")`); continue; }
      const lines = db.prepare('SELECT * FROM line WHERE brand_id = ?').all(brand.id);
      let line = d.line_slug ? lines.find((l) => l.slug === d.line_slug) : null;
      if (!line && d.line_slug) { // research slugs are often brand-prefixed: take the longest dash-suffix that is a real slug
        const parts = d.line_slug.split('-');
        for (let i = 1; i < parts.length && !line; i++) line = lines.find((l) => l.slug === parts.slice(i).join('-'));
      }
      if (!line && d.line_name) line = lines.find((l) => norm(l.name) === norm(d.line_name));
      if (!line && d.line_name) {
        const c = lines.filter((l) => norm(l.name).endsWith(norm(d.line_name)));
        if (c.length === 1) line = c[0];
      }
      if (!line && d.line_slug) { // unique prefix/containment as a last resort
        const c = lines.filter((l) => d.line_slug.startsWith(l.slug) || l.slug.startsWith(d.line_slug));
        if (c.length === 1) line = c[0];
      }
      if (!line) { skip(rel, `supplement: line "${d.line_slug ?? d.line_name}" not found under ${brand.slug}`); continue; }
      inserts.push({ kind: 'supplement', rel, brandSlug: brand.slug, lineId: line.id, lineName: line.name, brandName: brand.name, vitolas: d.additional_vitolas });
      continue;
    }

    const groups = linesOf(d);
    if (!groups) { skip(rel, `unrecognised shape (keys: ${Object.keys(d).slice(0, 6).join(', ')})`); continue; }

    // ---- brand resolution ----
    let brandObj = d.brand && typeof d.brand === 'object' ? d.brand : null;
    let brandName = brandObj?.name ?? overrides.fileBrand?.[rel] ?? groups[0].line.brand_slug ?? folderBrandName;
    if (overrides.skipFiles?.[rel]) { skip(rel, overrides.skipFiles[rel]); continue; }
    if (!brandObj && folderBrandObj && brandName === folderBrandName) brandObj = folderBrandObj; // sibling file carries the brand object
    if (!brandName) { skip(rel, `cannot resolve brand (folder "${folder}")`); continue; }
    inserts.push({ kind: 'file', rel, brandName, brandObj, groups, researchSources: d.research_sources ?? [], folder });
  }
}

// ---- plan + apply ---------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const brandCache = new Map(); // slug -> {id,...,planned?}
let plannedBrandId = -1;

function resolveBrandForPlan(name, obj, rel) {
  if (overrides.brandAlias?.[name]) { const a = dbBrands().find((b) => b.slug === overrides.brandAlias[name]); if (a) return { brand: a, created: false }; }
  let b = findBrand(name, obj?.slug ?? (typeof name === 'string' && /^[a-z0-9-]+$/.test(name) ? name : null));
  if (b) return { brand: b, created: false };
  const planned = [...brandCache.values()].find((x) => x.planned && (norm(x.name) === norm(name) || x.slug === (obj?.slug ?? slugify(name))));
  if (planned) return { brand: planned, created: false };
  if (!obj) { skip(rel, `brand "${name}" not in the database and no brand object supplied`); return null; }
  const slugGuess = obj.slug ?? slugify(obj.name);
  const country = overrides.brandCountry?.[slugGuess] ?? countryOf(obj.country ?? obj.origin_country ?? obj.origin ?? '');
  const story = overrides.brandStory?.[slugGuess] ?? cleanText(obj.story_short ?? obj.description);
  if (!country) { skip(rel, `new brand "${name}": cannot derive a single country from "${String(obj.origin_country ?? obj.origin).slice(0, 80)}"`); return null; }
  if (!story) { skip(rel, `new brand "${name}": no usable description after removing research-process notes`); return null; }
  let fy = overrides.brandFounded?.[slugGuess] ?? obj.founded_year ?? null;
  if (fy == null && typeof obj.founded === 'string' && /^\d{4}$/.test(obj.founded.trim())) fy = parseInt(obj.founded, 10);
  if (fy != null && typeof fy !== 'number') fy = null;
  const nb = { id: plannedBrandId--, planned: true, name: overrides.brandName?.[slugGuess] ?? obj.name, slug: obj.slug ?? slugify(obj.name), country, factory: overrides.brandFactory?.[slugGuess] ?? obj.factory ?? null,
    founded_year: fy, story_short: story, sources: obj.sources ?? [], rel };
  brandCache.set(nb.slug, nb);
  return { brand: nb, created: true };
}

const work = []; // fully-resolved writes
for (const it of inserts) {
  if (it.kind === 'supplement') {
    const existing = db.prepare('SELECT * FROM vitola WHERE line_id = ?').all(it.lineId);
    const add = [];
    for (const raw of it.vitolas) {
      const v = normaliseVitola(raw);
      const p = v.len != null ? { len: v.len, rg: v.rg } : parseSize(v.rawSize);
      if (!p) { skip(`${it.rel} :: ${v.name}`, `size not confirmed/parseable: "${String(v.rawSize).slice(0, 80)}"`); continue; }
      const slug = v.slug ?? slugify(v.name);
      const dup = existing.find((e) => e.slug === slug || (Math.abs(e.length_in - p.len) <= 0.25 && Math.abs(e.ring_gauge - p.rg) <= 2))
        ?? add.find((e) => e.slug === slug);
      if (dup) { flag(`${it.rel} :: ${v.name}`, `skipped: collides/near-duplicates existing vitola "${dup.size_name ?? dup.name}" (${dup.length_in ?? dup.len} x ${dup.ring_gauge ?? dup.rg}) in ${it.lineName}`); continue; }
      add.push({ name: v.name, slug, len: p.len, rg: p.rg, type: v.type ?? vitolaType(v.name, v.rawSize, v.notes, p.len, p.rg),
        summary: v.summary ?? vitolaSummary(it.brandName, it.lineName, v, p), tasting_notes: v.tasting_notes, boxes: v.boxes, smoke: v.smoke, critics: v.critics });
    }
    if (add.length) work.push({ kind: 'supplement', rel: it.rel, lineId: it.lineId, lineName: it.lineName, brandSlug: it.brandSlug, vitolas: add });
    continue;
  }

  const r = resolveBrandForPlan(it.brandName, it.brandObj, it.rel);
  if (!r) continue;
  const { brand, created } = r;
  if (created && !work.some((w) => w.kind === 'brand' && w.brand.slug === brand.slug)) {
    // an existing brand with the same slug but different name would have been matched above, so this is genuinely new
    work.push({ kind: 'brand', rel: it.rel, brand });
    report.newBrands.push(`${brand.name} (${brand.slug})`);
  }
  for (const g of it.groups) {
    const L = g.line;
    if (!L?.name) { skip(it.rel, 'line without a name'); continue; }
    const slug = L.slug ?? slugify(L.name);
    const existingLines = brand.planned ? [] : db.prepare('SELECT * FROM line WHERE brand_id = ?').all(brand.id);
    const dupLine = existingLines.find((l) => l.slug === slug || norm(l.name) === norm(L.name))
      ?? work.find((w) => w.kind === 'line' && w.brand.slug === brand.slug && (w.slug === slug || norm(w.name) === norm(L.name)));
    if (dupLine) { flag(it.rel, `slug/name collision: line "${L.name}" (${slug}) vs existing "${dupLine.name}" (${dupLine.slug}) under ${brand.slug} — not imported`); continue; }

    let strength = mapStrength(typeof L.strength === 'string' ? L.strength : null);
    const lk = lookups[`${brand.slug}/${slug}`];
    if (!strength && lk?.strength && STRENGTHS.includes(lk.strength)) strength = lk.strength;
    let mined = false;
    if (!strength) {
      const m = mineStrength([L.description, L.background_text, L.notes].filter(Boolean).join(' '));
      if (m) { strength = m; mined = true; }
    }
    if (!strength) report.strengthNull.push({ key: `${brand.slug}/${slug}`, name: L.name, research: L.strength ?? null, rel: it.rel });

    let background = cleanText(L.background_text ?? L.description ?? '') || cleanText(L.notes ?? '') || (it.brandObj ? cleanText(it.brandObj.description) : '');
    if (!background && textField(L.wrapper) !== UNKNOWN) {
      // plainest possible summary from the confirmed blend composition alone (same rule the nightly automation follows)
      const parts = [`${textField(L.wrapper)} wrapper`];
      if (textField(L.binder) !== UNKNOWN) parts.push(`${textField(L.binder)} binder`);
      if (textField(L.filler) !== UNKNOWN) parts.push(`${textField(L.filler)} filler`);
      background = `${L.name} from ${brand.name}: ${parts.join(', ')}.`;
    }
    if (!background) { skip(it.rel, `line "${L.name}" has no description/background_text`); continue; }
    const vits = [];
    for (const raw of g.vitolas) {
      const v = normaliseVitola(raw);
      let p = v.len != null ? { len: v.len, rg: v.rg } : parseSize(v.rawSize);
      if (!p) { skip(`${it.rel} :: ${v.name}`, `size not parseable: "${String(v.rawSize).slice(0, 90)}"`); continue; }
      const vslug = v.slug ?? slugify(v.name);
      if (vits.some((x) => x.slug === vslug)) { flag(`${it.rel} :: ${v.name}`, `duplicate vitola slug "${vslug}" within the file — kept the first`); continue; }
      vits.push({ ...v, slug: vslug, len: p.len, rg: p.rg,
        type: v.type ?? vitolaType(v.name, v.rawSize, v.notes, p.len, p.rg),
        summary: v.summary ?? vitolaSummary(brand.name, L.name, v, p) });
    }
    if (!vits.length) { skip(it.rel, `line "${L.name}" has no importable vitolas`); continue; }
    work.push({ kind: 'line', rel: it.rel, brand, name: L.name, slug, wrapper: textField(L.wrapper), binder: textField(L.binder),
      filler: textField(L.filler), strength, release_year: Number.isInteger(L.release_year) ? L.release_year : null,
      background, vitolas: vits });
    report.newLines.push(`${brand.slug}/${slug}`);
    if (mined) (report.strengthMined ??= []).push(`${brand.slug}/${slug}=${strength}`);
    report.newVitolas += vits.length;
  }
}

report.plan = work.map((w) => w.kind === 'brand' ? { kind: 'brand', ...w.brand, sources: undefined } : w.kind === 'line' ? { kind: 'line', brand: w.brand.slug, name: w.name, slug: w.slug, wrapper: w.wrapper, binder: w.binder, filler: w.filler, strength: w.strength, release_year: w.release_year, background: w.background, vitolas: w.vitolas.map((v) => `${v.name} ${v.len}x${v.rg} ${v.type}${v.critics?.length ? ' +' + v.critics.length + 'rev' : ''}`) } : { kind: 'supplement', line: w.lineName, vitolas: w.vitolas.map((v) => `${v.name} ${v.len}x${v.rg} ${v.type}`) });
for (const w of work) if (w.kind === 'supplement') report.appended.push(`${w.brandSlug}/${w.lineName}: +${w.vitolas.length} (${w.vitolas.map((v) => v.name).join(', ')})`);

if (APPLY) {
  db.exec('BEGIN');
  try {
    const insBrand = db.prepare(`INSERT INTO brand (name, slug, country, factory, founded_year, story_short) VALUES (@name,@slug,@country,@factory,@founded_year,@story_short)`);
    const insSrc = db.prepare(`INSERT INTO brand_source (brand_id, source_name, source_url, fact_note, retrieved_at) VALUES (@brand_id,@source_name,@source_url,@fact_note,@retrieved_at)`);
    const insLine = db.prepare(`INSERT INTO line (brand_id,name,slug,wrapper,binder,filler,strength,release_year,background_text) VALUES (@brand_id,@name,@slug,@wrapper,@binder,@filler,@strength,@release_year,@background_text)`);
    const insVit = db.prepare(`INSERT INTO vitola (line_id,size_name,slug,length_in,ring_gauge,vitola_type,stick_score,score_flavor,score_construction,score_complexity,score_value,tasting_notes,summary_review,smoke_time_min,box_counts) VALUES (@line_id,@size_name,@slug,@length_in,@ring_gauge,@vitola_type,NULL,NULL,NULL,NULL,NULL,@tasting_notes,@summary_review,@smoke_time_min,@box_counts)`);
    const insCrit = db.prepare(`INSERT INTO critic_review (vitola_id,source_name,source_type,score,score_scale,review_count,review_date,url,key_notes_text) VALUES (@vitola_id,@source_name,@source_type,@score,@score_scale,@review_count,@review_date,@url,@key_notes_text)`);
    const addVit = (lineId, v) => {
      const r = insVit.run(at({ line_id: lineId, size_name: v.name, slug: v.slug, length_in: v.len, ring_gauge: v.rg, vitola_type: v.type,
        tasting_notes: JSON.stringify(v.tasting_notes ?? []), summary_review: v.summary, smoke_time_min: v.smoke ?? null, box_counts: JSON.stringify(v.boxes ?? []) }));
      const vid = Number(r.lastInsertRowid);
      for (const c of v.critics ?? []) {
        insCrit.run(at({ vitola_id: vid, source_name: c.source_name, source_type: c.source_type ?? 'critic', score: c.score, score_scale: c.score_scale ?? 100,
          review_count: c.review_count ?? null, review_date: c.review_date, url: c.url, key_notes_text: c.key_notes_text ?? null }));
      }
      if (v.critics?.length) {
        const score = computeStickScore(db.prepare('SELECT * FROM critic_review WHERE vitola_id = ?').all(vid), new Date());
        db.prepare('UPDATE vitola SET stick_score = @s WHERE id = @id').run(at({ s: score, id: vid }));
      }
    };
    const realId = new Map();
    for (const w of work) {
      if (w.kind === 'brand') {
        const b = w.brand;
        const r = insBrand.run(at({ name: b.name, slug: b.slug, country: b.country, factory: b.factory, founded_year: b.founded_year, story_short: b.story_short }));
        realId.set(b.slug, Number(r.lastInsertRowid));
        for (const s of b.sources ?? []) insSrc.run(at({ brand_id: Number(r.lastInsertRowid), source_name: s.source_name, source_url: s.source_url, fact_note: s.fact_note, retrieved_at: s.retrieved_at ?? today }));
      } else if (w.kind === 'line') {
        const brandId = w.brand.planned ? realId.get(w.brand.slug) : w.brand.id;
        const r = insLine.run(at({ brand_id: brandId, name: w.name, slug: w.slug, wrapper: w.wrapper, binder: w.binder, filler: w.filler,
          strength: w.strength, release_year: w.release_year, background_text: w.background }));
        for (const v of w.vitolas) addVit(Number(r.lastInsertRowid), v);
      } else if (w.kind === 'supplement') {
        for (const v of w.vitolas) addVit(w.lineId, v);
      }
    }
    db.exec('COMMIT');
    console.log('APPLIED.');
  } catch (e) {
    db.exec('ROLLBACK');
    console.error('ROLLED BACK:', e.message);
    process.exit(1);
  }
}

fs.writeFileSync(path.join(__dirname, '..', 'data', 'research', APPLY ? 'import-report.json' : 'import-dryrun.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  mode: APPLY ? 'APPLY' : 'DRY RUN', newBrands: report.newBrands.length, newLines: report.newLines.length, newVitolas: report.newVitolas,
  supplements: report.appended.length, skipped: report.skipped.length, flags: report.flags.length, unresolvedFlagFiles: report.unresolved.length,
  linesStrengthNull: report.strengthNull.length,
}, null, 2));
