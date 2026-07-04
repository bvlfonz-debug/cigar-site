#!/usr/bin/env node
// Incremental, append-safe database operations for nightly automation.
// Unlike scripts/seed.mjs (which wipes and rebuilds), every command here
// only inserts or updates specific rows — it never deletes existing records,
// per CLAUDE.md's automation guardrails.
//
// Usage: node scripts/db-tools.mjs <command> '<json-payload>'
// Prints a JSON result to stdout. Exits non-zero with a message on error.
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeStickScore } from './lib/stickscore.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'cigars.db');
const queuePath = path.join(__dirname, '..', 'data', 'review-queue.json');

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON');

function at(params) {
  return Object.fromEntries(Object.entries(params).map(([k, v]) => [`@${k}`, v]));
}

function fail(message) {
  console.error(JSON.stringify({ error: message }));
  process.exit(1);
}

function parseVitolaPath(p) {
  const parts = p.split('/').filter(Boolean);
  if (parts.length !== 4 || parts[0] !== 'cigars') {
    fail(`Invalid vitola path "${p}" — expected /cigars/<brand>/<line>/<vitola>/`);
  }
  return { brandSlug: parts[1], lineSlug: parts[2], vitolaSlug: parts[3] };
}

function resolveVitola(p) {
  const { brandSlug, lineSlug, vitolaSlug } = parseVitolaPath(p);
  const brand = db.prepare('SELECT * FROM brand WHERE slug = ?').get(brandSlug);
  if (!brand) fail(`No brand found with slug "${brandSlug}"`);
  const line = db.prepare('SELECT * FROM line WHERE brand_id = ? AND slug = ?').get(brand.id, lineSlug);
  if (!line) fail(`No line found with slug "${lineSlug}" under brand "${brandSlug}"`);
  const vitola = db.prepare('SELECT * FROM vitola WHERE line_id = ? AND slug = ?').get(line.id, vitolaSlug);
  if (!vitola) fail(`No vitola found with slug "${vitolaSlug}" under line "${lineSlug}"`);
  return { brand, line, vitola };
}

function readQueue() {
  if (!fs.existsSync(queuePath)) return [];
  return JSON.parse(fs.readFileSync(queuePath, 'utf-8'));
}

function writeQueue(items) {
  fs.writeFileSync(queuePath, JSON.stringify(items, null, 2) + '\n');
}

function recomputeStickScore(vitolaId) {
  const reviews = db.prepare('SELECT * FROM critic_review WHERE vitola_id = ?').all(vitolaId);
  const stickScore = computeStickScore(reviews, new Date());
  db.prepare('UPDATE vitola SET stick_score = @stick_score WHERE id = @id').run(
    at({ id: vitolaId, stick_score: stickScore })
  );
  return stickScore;
}

const commands = {
  'find-vitola'(payload) {
    const { brand, line, vitola } = resolveVitola(payload.path);
    return { brand, line, vitola };
  },

  'add-critic-review'(payload) {
    const { vitola } = resolveVitola(payload.path);
    const required = ['source_name', 'score', 'score_scale', 'review_date', 'url'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-critic-review requires "${field}"`);
    }
    db.prepare(`
      INSERT INTO critic_review (vitola_id, source_name, source_type, score, score_scale, review_count, review_date, url, key_notes_text)
      VALUES (@vitola_id, @source_name, @source_type, @score, @score_scale, @review_count, @review_date, @url, @key_notes_text)
    `).run(at({
      vitola_id: vitola.id,
      source_name: payload.source_name,
      source_type: payload.source_type ?? 'critic',
      score: payload.score,
      score_scale: payload.score_scale,
      review_count: payload.review_count ?? null,
      review_date: payload.review_date,
      url: payload.url,
      key_notes_text: payload.key_notes_text ?? null,
    }));
    const stickScore = recomputeStickScore(vitola.id);
    return { ok: true, vitola_id: vitola.id, stick_score: stickScore };
  },

  'add-price-point'(payload) {
    const { vitola } = resolveVitola(payload.path);
    const required = ['retailer'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-price-point requires "${field}"`);
    }
    if (payload.price_single == null && payload.price_box == null) {
      fail('add-price-point requires at least one of price_single or price_box');
    }

    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const trailing = db
      .prepare('SELECT price_single FROM price_point WHERE vitola_id = ? AND checked_at >= ? AND price_single IS NOT NULL')
      .all(vitola.id, ninetyDaysAgo);

    let swingPct = null;
    if (trailing.length > 0 && payload.price_single != null) {
      const avg = trailing.reduce((s, r) => s + r.price_single, 0) / trailing.length;
      swingPct = ((payload.price_single - avg) / avg) * 100;
    }

    if (swingPct != null && Math.abs(swingPct) > 25) {
      const queue = readQueue();
      queue.push({
        item: `${vitola.size_name} price at ${payload.retailer}`,
        path: payload.path,
        reason: 'price_swing',
        why_flagged: `New price $${payload.price_single} is ${swingPct.toFixed(0)}% off the trailing 90-day average — held for review instead of publishing automatically.`,
        sources_found: [payload.retailer],
        proposed_action: `Confirm the new price is real (not a data error) at ${payload.affiliate_url ?? payload.retailer}, then approve to publish.`,
        decision: null,
      });
      writeQueue(queue);
      return { ok: true, queued: true, swing_pct: swingPct };
    }

    db.prepare(`
      INSERT INTO price_point (vitola_id, retailer, price_single, price_box, box_count, affiliate_url, checked_at)
      VALUES (@vitola_id, @retailer, @price_single, @price_box, @box_count, @affiliate_url, @checked_at)
    `).run(at({
      vitola_id: vitola.id,
      retailer: payload.retailer,
      price_single: payload.price_single ?? null,
      price_box: payload.price_box ?? null,
      box_count: payload.box_count ?? null,
      affiliate_url: payload.affiliate_url ?? null,
      checked_at: new Date().toISOString(),
    }));
    return { ok: true, queued: false, swing_pct: swingPct };
  },

  'add-news-item'(payload) {
    const required = ['title', 'summary', 'source_name', 'source_url', 'published_at'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-news-item requires "${field}"`);
    }
    const relatedIds = (payload.related_paths ?? []).map((p) => resolveVitola(p).vitola.id);
    db.prepare(`
      INSERT INTO news_item (title, summary, source_name, source_url, published_at, related_vitola_ids)
      VALUES (@title, @summary, @source_name, @source_url, @published_at, @related_vitola_ids)
    `).run(at({
      title: payload.title,
      summary: payload.summary,
      source_name: payload.source_name,
      source_url: payload.source_url,
      published_at: payload.published_at,
      related_vitola_ids: JSON.stringify(relatedIds),
    }));
    return { ok: true };
  },

  'add-brand'(payload) {
    const required = ['name', 'slug', 'country', 'story_short'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-brand requires "${field}"`);
    }
    const existing = db.prepare('SELECT id FROM brand WHERE slug = ?').get(payload.slug);
    if (existing) fail(`Brand "${payload.slug}" already exists (id ${existing.id})`);
    const result = db.prepare(`
      INSERT INTO brand (name, slug, country, factory, founded_year, story_short)
      VALUES (@name, @slug, @country, @factory, @founded_year, @story_short)
    `).run(at({
      name: payload.name,
      slug: payload.slug,
      country: payload.country,
      factory: payload.factory ?? null,
      founded_year: payload.founded_year ?? null,
      story_short: payload.story_short,
    }));
    return { ok: true, brand_id: result.lastInsertRowid };
  },

  'add-line'(payload) {
    const required = ['brand_slug', 'name', 'slug', 'wrapper', 'binder', 'filler', 'strength', 'background_text'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-line requires "${field}"`);
    }
    const brand = db.prepare('SELECT * FROM brand WHERE slug = ?').get(payload.brand_slug);
    if (!brand) fail(`No brand found with slug "${payload.brand_slug}"`);
    const existing = db.prepare('SELECT id FROM line WHERE brand_id = ? AND slug = ?').get(brand.id, payload.slug);
    if (existing) fail(`Line "${payload.slug}" already exists under "${payload.brand_slug}" (id ${existing.id})`);
    const result = db.prepare(`
      INSERT INTO line (brand_id, name, slug, wrapper, binder, filler, strength, release_year, background_text)
      VALUES (@brand_id, @name, @slug, @wrapper, @binder, @filler, @strength, @release_year, @background_text)
    `).run(at({
      brand_id: brand.id,
      name: payload.name,
      slug: payload.slug,
      wrapper: payload.wrapper,
      binder: payload.binder,
      filler: payload.filler,
      strength: payload.strength,
      release_year: payload.release_year ?? null,
      background_text: payload.background_text,
    }));
    return { ok: true, line_id: result.lastInsertRowid };
  },

  'add-vitola'(payload) {
    const required = ['brand_slug', 'line_slug', 'size_name', 'slug', 'length_in', 'ring_gauge', 'vitola_type', 'summary_review'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-vitola requires "${field}"`);
    }
    const brand = db.prepare('SELECT * FROM brand WHERE slug = ?').get(payload.brand_slug);
    if (!brand) fail(`No brand found with slug "${payload.brand_slug}"`);
    const line = db.prepare('SELECT * FROM line WHERE brand_id = ? AND slug = ?').get(brand.id, payload.line_slug);
    if (!line) fail(`No line found with slug "${payload.line_slug}" under "${payload.brand_slug}"`);
    const existing = db.prepare('SELECT id FROM vitola WHERE line_id = ? AND slug = ?').get(line.id, payload.slug);
    if (existing) fail(`Vitola "${payload.slug}" already exists under that line (id ${existing.id})`);
    const result = db.prepare(`
      INSERT INTO vitola (
        line_id, size_name, slug, length_in, ring_gauge, vitola_type,
        stick_score, score_flavor, score_construction, score_complexity, score_value,
        tasting_notes, summary_review, smoke_time_min, box_counts
      ) VALUES (
        @line_id, @size_name, @slug, @length_in, @ring_gauge, @vitola_type,
        NULL, NULL, NULL, NULL, NULL,
        @tasting_notes, @summary_review, @smoke_time_min, @box_counts
      )
    `).run(at({
      line_id: line.id,
      size_name: payload.size_name,
      slug: payload.slug,
      length_in: payload.length_in,
      ring_gauge: payload.ring_gauge,
      vitola_type: payload.vitola_type,
      tasting_notes: JSON.stringify(payload.tasting_notes ?? []),
      summary_review: payload.summary_review,
      smoke_time_min: payload.smoke_time_min ?? null,
      box_counts: JSON.stringify(payload.box_counts ?? []),
    }));
    return { ok: true, vitola_id: result.lastInsertRowid };
  },

  'recompute-stick-score'(payload) {
    const { vitola } = resolveVitola(payload.path);
    const stickScore = recomputeStickScore(vitola.id);
    return { ok: true, stick_score: stickScore };
  },

  'queue-add'(payload) {
    const required = ['item', 'reason', 'why_flagged', 'proposed_action'];
    for (const field of required) {
      if (payload[field] == null) fail(`queue-add requires "${field}"`);
    }
    const queue = readQueue();
    // Remembered, not re-proposed: skip if this exact item is already queued
    // (pending or previously decided) rather than piling up duplicates.
    if (queue.some((q) => q.item === payload.item)) {
      return { ok: true, skipped: true, reason: 'already in queue' };
    }
    queue.push({
      item: payload.item,
      path: payload.path ?? null,
      reason: payload.reason,
      why_flagged: payload.why_flagged,
      sources_found: payload.sources_found ?? [],
      proposed_action: payload.proposed_action,
      decision: null,
    });
    writeQueue(queue);
    return { ok: true, skipped: false };
  },

  'queue-list'() {
    return readQueue();
  },
};

const [, , command, payloadJson] = process.argv;
if (!command || !commands[command]) {
  fail(`Unknown command "${command}". Available: ${Object.keys(commands).join(', ')}`);
}

let payload = {};
if (payloadJson) {
  try {
    payload = JSON.parse(payloadJson);
  } catch (e) {
    fail(`Invalid JSON payload: ${e.message}`);
  }
}

try {
  const result = commands[command](payload);
  console.log(JSON.stringify(result, null, 2));
} catch (e) {
  fail(e.message);
} finally {
  db.close();
}
