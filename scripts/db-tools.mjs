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
import { computeStickScore, computeAccScore, computeLoungeScore } from './lib/stickscore.mjs';

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

function parseAccessoryPath(p) {
  const parts = p.split('/').filter(Boolean);
  if (parts.length !== 3 || parts[0] !== 'accessories') {
    fail(`Invalid accessory path "${p}" — expected /accessories/<category>/<brand-model>/`);
  }
  return { categorySlug: parts[1], accessorySlug: parts[2] };
}

function resolveAccessory(p) {
  const { categorySlug, accessorySlug } = parseAccessoryPath(p);
  const category = db.prepare('SELECT * FROM accessory_category WHERE slug = ?').get(categorySlug);
  if (!category) fail(`No accessory category found with slug "${categorySlug}"`);
  const accessory = db.prepare('SELECT * FROM accessory WHERE category_id = ? AND slug = ?').get(category.id, accessorySlug);
  if (!accessory) fail(`No accessory found with slug "${accessorySlug}" in category "${categorySlug}"`);
  return { category, accessory };
}

function parseLoungePath(p) {
  const parts = p.split('/').filter(Boolean);
  if (parts.length !== 3 || parts[0] !== 'lounges') {
    fail(`Invalid lounge path "${p}" — expected /lounges/<city-slug>/<lounge-slug>/`);
  }
  return { citySlug: parts[1], loungeSlug: parts[2] };
}

function resolveLounge(p) {
  const { citySlug, loungeSlug } = parseLoungePath(p);
  const lounge = db.prepare('SELECT * FROM lounge WHERE city_slug = ? AND slug = ?').get(citySlug, loungeSlug);
  if (!lounge) fail(`No lounge found with slug "${loungeSlug}" in city "${citySlug}"`);
  return { lounge };
}

function parseReleasePath(p) {
  const parts = p.split('/').filter(Boolean);
  if (parts.length !== 2 || parts[0] !== 'calendar') {
    fail(`Invalid release path "${p}" — expected /calendar/<slug>/`);
  }
  return { slug: parts[1] };
}

function resolveRelease(p) {
  const { slug } = parseReleasePath(p);
  const release = db.prepare('SELECT * FROM cigar_release WHERE slug = ?').get(slug);
  if (!release) fail(`No release found with slug "${slug}"`);
  return { release };
}

function parseFactoryPath(p) {
  const parts = p.split('/').filter(Boolean);
  if (parts.length !== 2 || parts[0] !== 'factories') {
    fail(`Invalid factory path "${p}" — expected /factories/<slug>/`);
  }
  return { slug: parts[1] };
}

function resolveFactory(p) {
  const { slug } = parseFactoryPath(p);
  const factory = db.prepare('SELECT * FROM factory WHERE slug = ?').get(slug);
  if (!factory) fail(`No factory found with slug "${slug}"`);
  return { factory };
}

function parseLinePath(p) {
  const parts = p.split('/').filter(Boolean);
  if (parts.length !== 3 || parts[0] !== 'cigars') {
    fail(`Invalid line path "${p}" — expected /cigars/<brand>/<line>/`);
  }
  return { brandSlug: parts[1], lineSlug: parts[2] };
}

function resolveLine(p) {
  const { brandSlug, lineSlug } = parseLinePath(p);
  const brand = db.prepare('SELECT * FROM brand WHERE slug = ?').get(brandSlug);
  if (!brand) fail(`No brand found with slug "${brandSlug}"`);
  const line = db.prepare('SELECT * FROM line WHERE brand_id = ? AND slug = ?').get(brand.id, lineSlug);
  if (!line) fail(`No line found with slug "${lineSlug}" under brand "${brandSlug}"`);
  return { brand, line };
}

// Queues a missing-sourced-fact gap so it surfaces in the owner's weekly
// review-queue skim instead of sitting invisibly null. Reuses queue-add's
// own dedup (by "item" string) so calling this on every add/update is safe.
function queueMissingFact(item, path, why) {
  commands['queue-add']({
    item,
    path,
    reason: 'Missing sourced fact on a brand/factory profile',
    why_flagged: why,
    proposed_action: 'Research a citable source and call add-brand-source/add-factory-source, then update-brand/update-factory to fill the field.',
  });
}

// Small local slugify — scripts/ doesn't import from src/ anywhere else in
// this project (scripts/lib/stickscore.mjs is a standalone duplicate, not a
// shared import), so this stays a duplicate rather than crossing that
// boundary for one function.
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function recomputeAccScore(accessoryId) {
  const reviews = db.prepare('SELECT * FROM accessory_review WHERE accessory_id = ?').all(accessoryId);
  const accScore = computeAccScore(reviews, new Date());
  db.prepare('UPDATE accessory SET acc_score = @acc_score WHERE id = @id').run(
    at({ id: accessoryId, acc_score: accScore })
  );
  return accScore;
}

function recomputeLoungeScore(loungeId) {
  // lounge_external_rating stores rating_date (not review_date, since these
  // are cited external platform aggregates or editorial rankings, not
  // first-hand reviews) — map it to the key computeLoungeScore expects.
  const ratings = db.prepare('SELECT * FROM lounge_external_rating WHERE lounge_id = ?').all(loungeId)
    .map((r) => ({ ...r, review_date: r.rating_date }));
  const loungeScore = computeLoungeScore(ratings, new Date());
  db.prepare('UPDATE lounge SET lounge_score = @lounge_score WHERE id = @id').run(
    at({ id: loungeId, lounge_score: loungeScore })
  );
  return loungeScore;
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

  // Editorial text fields (e.g. summary_review needs rewriting once a vitola
  // crosses the 3-source threshold and stops being "insufficient data").
  // Only touches the fields actually passed in.
  'update-vitola-copy'(payload) {
    const { vitola } = resolveVitola(payload.path);
    const sets = [];
    const params = { id: vitola.id };
    if (payload.summary_review != null) {
      sets.push('summary_review = @summary_review');
      params.summary_review = payload.summary_review;
    }
    if (payload.tasting_notes != null) {
      sets.push('tasting_notes = @tasting_notes');
      params.tasting_notes = JSON.stringify(payload.tasting_notes);
    }
    if (sets.length === 0) fail('update-vitola-copy requires summary_review and/or tasting_notes');
    db.prepare(`UPDATE vitola SET ${sets.join(', ')} WHERE id = @id`).run(at(params));
    return { ok: true };
  },

  // Sub-scores are editorial synthesis from review text, not something a
  // formula derives — set them explicitly once a vitola has enough reviews
  // to support real ones (only overwrites the four score_* columns).
  'set-sub-scores'(payload) {
    const { vitola } = resolveVitola(payload.path);
    const required = ['flavor', 'construction', 'complexity', 'value'];
    for (const field of required) {
      if (payload[field] == null) fail(`set-sub-scores requires "${field}"`);
    }
    db.prepare(`
      UPDATE vitola
      SET score_flavor = @flavor, score_construction = @construction,
          score_complexity = @complexity, score_value = @value
      WHERE id = @id
    `).run(at({ id: vitola.id, flavor: payload.flavor, construction: payload.construction, complexity: payload.complexity, value: payload.value }));
    return { ok: true };
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

  // Removes a queue item once its underlying issue is resolved (e.g. a
  // cigar that was "insufficient sources" now has enough to score).
  'queue-resolve'(payload) {
    if (!payload.item) fail('queue-resolve requires "item"');
    const queue = readQueue();
    const before = queue.length;
    const remaining = queue.filter((q) => q.item !== payload.item);
    if (remaining.length === before) {
      return { ok: true, removed: false, reason: 'no matching item found' };
    }
    writeQueue(remaining);
    return { ok: true, removed: true };
  },

  // --- Accessories Expansion (non-tobacco) ---

  'find-accessory'(payload) {
    const { category, accessory } = resolveAccessory(payload.path);
    return { category, accessory };
  },

  'add-accessory-category'(payload) {
    const required = ['name', 'slug'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-accessory-category requires "${field}"`);
    }
    const existing = db.prepare('SELECT id FROM accessory_category WHERE slug = ?').get(payload.slug);
    if (existing) fail(`Accessory category "${payload.slug}" already exists (id ${existing.id})`);
    const result = db.prepare('INSERT INTO accessory_category (name, slug) VALUES (@name, @slug)').run(at({
      name: payload.name,
      slug: payload.slug,
    }));
    return { ok: true, category_id: result.lastInsertRowid };
  },

  'add-accessory'(payload) {
    const required = ['category_slug', 'brand', 'model', 'slug', 'summary_review'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-accessory requires "${field}"`);
    }
    const category = db.prepare('SELECT * FROM accessory_category WHERE slug = ?').get(payload.category_slug);
    if (!category) fail(`No accessory category found with slug "${payload.category_slug}"`);
    const existing = db.prepare('SELECT id FROM accessory WHERE category_id = ? AND slug = ?').get(category.id, payload.slug);
    if (existing) fail(`Accessory "${payload.slug}" already exists in "${payload.category_slug}" (id ${existing.id})`);
    const result = db.prepare(`
      INSERT INTO accessory (category_id, brand, model, slug, specs, acc_score, summary_review, pros, cons)
      VALUES (@category_id, @brand, @model, @slug, @specs, NULL, @summary_review, @pros, @cons)
    `).run(at({
      category_id: category.id,
      brand: payload.brand,
      model: payload.model,
      slug: payload.slug,
      specs: JSON.stringify(payload.specs ?? {}),
      summary_review: payload.summary_review,
      pros: JSON.stringify(payload.pros ?? []),
      cons: JSON.stringify(payload.cons ?? []),
    }));
    return { ok: true, accessory_id: result.lastInsertRowid };
  },

  'add-accessory-review'(payload) {
    const { accessory } = resolveAccessory(payload.path);
    const required = ['source_name', 'score', 'score_scale', 'review_date', 'url'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-accessory-review requires "${field}"`);
    }
    db.prepare(`
      INSERT INTO accessory_review (accessory_id, source_name, source_type, score, score_scale, review_date, url, key_notes_text)
      VALUES (@accessory_id, @source_name, @source_type, @score, @score_scale, @review_date, @url, @key_notes_text)
    `).run(at({
      accessory_id: accessory.id,
      source_name: payload.source_name,
      source_type: payload.source_type ?? 'critic',
      score: payload.score,
      score_scale: payload.score_scale,
      review_date: payload.review_date,
      url: payload.url,
      key_notes_text: payload.key_notes_text ?? null,
    }));
    const accScore = recomputeAccScore(accessory.id);
    return { ok: true, accessory_id: accessory.id, acc_score: accScore };
  },

  'add-accessory-price-point'(payload) {
    const { accessory } = resolveAccessory(payload.path);
    const required = ['retailer'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-accessory-price-point requires "${field}"`);
    }
    if (payload.price_single == null && payload.price_box == null) {
      fail('add-accessory-price-point requires at least one of price_single or price_box');
    }
    db.prepare(`
      INSERT INTO accessory_price_point (accessory_id, retailer, price_single, price_box, box_count, affiliate_url, checked_at)
      VALUES (@accessory_id, @retailer, @price_single, @price_box, @box_count, @affiliate_url, @checked_at)
    `).run(at({
      accessory_id: accessory.id,
      retailer: payload.retailer,
      price_single: payload.price_single ?? null,
      price_box: payload.price_box ?? null,
      box_count: payload.box_count ?? null,
      affiliate_url: payload.affiliate_url ?? null,
      checked_at: new Date().toISOString(),
    }));
    return { ok: true };
  },

  'recompute-acc-score'(payload) {
    const { accessory } = resolveAccessory(payload.path);
    const accScore = recomputeAccScore(accessory.id);
    return { ok: true, acc_score: accScore };
  },

  // Lounge Directory — Phase A is a pure factual directory. There is
  // deliberately no add-lounge-external-rating / recompute-lounge-score
  // command yet: nothing populates lounge_external_rating or reads
  // lounge_score until Phase C is explicitly approved (see CLAUDE.md
  // "Lounge Directory Expansion").
  'find-lounge'(payload) {
    const { lounge } = resolveLounge(payload.path);
    return { lounge };
  },

  'add-lounge'(payload) {
    const required = ['name', 'slug', 'city', 'state', 'address', 'overview_text'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-lounge requires "${field}"`);
    }
    const citySlug = slugify(`${payload.city}${payload.state ? '-' + payload.state : ''}`);
    const existing = db.prepare('SELECT id FROM lounge WHERE city_slug = ? AND slug = ?').get(citySlug, payload.slug);
    if (existing) fail(`Lounge "${payload.slug}" already exists in "${citySlug}" (id ${existing.id})`);
    const result = db.prepare(`
      INSERT INTO lounge (
        name, slug, city, city_slug, state, country, address, phone, website, hours_text,
        walk_in_or_membership, membership_details, indoor_smoking_status, indoor_smoking_note,
        amenities, overview_text, lounge_score, facts_source_url, facts_checked_at
      ) VALUES (
        @name, @slug, @city, @city_slug, @state, @country, @address, @phone, @website, @hours_text,
        @walk_in_or_membership, @membership_details, @indoor_smoking_status, @indoor_smoking_note,
        @amenities, @overview_text, NULL, @facts_source_url, @facts_checked_at
      )
    `).run(at({
      name: payload.name,
      slug: payload.slug,
      city: payload.city,
      city_slug: citySlug,
      state: payload.state ?? null,
      country: payload.country ?? 'USA',
      address: payload.address,
      phone: payload.phone ?? null,
      website: payload.website ?? null,
      hours_text: payload.hours_text ?? null,
      walk_in_or_membership: payload.walk_in_or_membership ?? null,
      membership_details: payload.membership_details ?? null,
      indoor_smoking_status: payload.indoor_smoking_status ?? null,
      indoor_smoking_note: payload.indoor_smoking_note ?? null,
      amenities: JSON.stringify(payload.amenities ?? []),
      overview_text: payload.overview_text,
      facts_source_url: payload.facts_source_url ?? null,
      facts_checked_at: payload.facts_checked_at ?? null,
    }));
    return { ok: true, lounge_id: result.lastInsertRowid, city_slug: citySlug };
  },

  // Phase C: lounge ratings — CITED EXTERNAL SOURCES ONLY (Google/Yelp/
  // TripAdvisor-style platform aggregates, or genuine dated editorial
  // rankings). Never a first-hand rating. Same 3-independent-source
  // minimum and aggregation rules as StickScore/AccScore.
  'add-lounge-external-rating'(payload) {
    const { lounge } = resolveLounge(payload.path);
    const required = ['source_name', 'score', 'score_scale', 'rating_date', 'url'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-lounge-external-rating requires "${field}"`);
    }
    db.prepare(`
      INSERT INTO lounge_external_rating (lounge_id, source_name, source_type, score, score_scale, review_count, rating_date, url, key_notes_text)
      VALUES (@lounge_id, @source_name, @source_type, @score, @score_scale, @review_count, @rating_date, @url, @key_notes_text)
    `).run(at({
      lounge_id: lounge.id,
      source_name: payload.source_name,
      source_type: payload.source_type ?? 'platform',
      score: payload.score,
      score_scale: payload.score_scale,
      review_count: payload.review_count ?? null,
      rating_date: payload.rating_date,
      url: payload.url,
      key_notes_text: payload.key_notes_text ?? null,
    }));
    const loungeScore = recomputeLoungeScore(lounge.id);
    return { ok: true, lounge_id: lounge.id, lounge_score: loungeScore };
  },

  'recompute-lounge-score'(payload) {
    const { lounge } = resolveLounge(payload.path);
    const loungeScore = recomputeLoungeScore(lounge.id);
    return { ok: true, lounge_score: loungeScore };
  },

  // Cigar Release Calendar — same auto-publish tier as add-news-item (a
  // cited report, not a new catalog entity), NOT queue-gated like
  // add-brand/add-line/add-lounge. A real source_name/source_url is
  // required on every row instead.
  'find-release'(payload) {
    const { release } = resolveRelease(payload.path);
    return { release };
  },

  'add-release'(payload) {
    const required = ['brand_name', 'line_name', 'announced_date', 'summary_text', 'source_name', 'source_url'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-release requires "${field}"`);
    }
    const year = String(payload.announced_date).slice(0, 4);
    const slug = slugify(`${payload.brand_name}-${payload.line_name}-${year}`);
    const existing = db.prepare('SELECT id FROM cigar_release WHERE slug = ?').get(slug);
    if (existing) fail(`Release "${slug}" already exists (id ${existing.id}) — use update-release instead`);

    let brandSlug = null;
    if (payload.brand_slug != null) {
      const brand = db.prepare('SELECT slug FROM brand WHERE slug = ?').get(payload.brand_slug);
      if (!brand) fail(`No brand found with slug "${payload.brand_slug}"`);
      brandSlug = brand.slug;
    }

    if (payload.release_month != null && !/^\d{4}-\d{2}$/.test(payload.release_month)) {
      fail(`release_month must be in "YYYY-MM" format, got "${payload.release_month}"`);
    }

    let relatedNewsItemId = null;
    if (payload.related_news_item_id != null) {
      const newsItem = db.prepare('SELECT id FROM news_item WHERE id = ?').get(payload.related_news_item_id);
      if (!newsItem) fail(`No news_item found with id "${payload.related_news_item_id}"`);
      relatedNewsItemId = newsItem.id;
    }

    const result = db.prepare(`
      INSERT INTO cigar_release (
        slug, brand_name, brand_slug, line_name, announced_date, release_month,
        release_date_text, summary_text, source_name, source_url, related_vitola_id, related_news_item_id
      ) VALUES (
        @slug, @brand_name, @brand_slug, @line_name, @announced_date, @release_month,
        @release_date_text, @summary_text, @source_name, @source_url, NULL, @related_news_item_id
      )
    `).run(at({
      slug,
      brand_name: payload.brand_name,
      brand_slug: brandSlug,
      line_name: payload.line_name,
      announced_date: payload.announced_date,
      release_month: payload.release_month ?? null,
      release_date_text: payload.release_date_text ?? null,
      summary_text: payload.summary_text,
      source_name: payload.source_name,
      source_url: payload.source_url,
      related_news_item_id: relatedNewsItemId,
    }));
    return { ok: true, release_id: result.lastInsertRowid, slug };
  },

  // Only touches fields actually passed in, mirroring update-vitola-copy.
  'update-release'(payload) {
    const { release } = resolveRelease(payload.path);
    const sets = [];
    const params = { id: release.id };

    if (payload.release_month != null) {
      if (!/^\d{4}-\d{2}$/.test(payload.release_month)) {
        fail(`release_month must be in "YYYY-MM" format, got "${payload.release_month}"`);
      }
      sets.push('release_month = @release_month');
      params.release_month = payload.release_month;
    }
    if (payload.release_date_text != null) {
      sets.push('release_date_text = @release_date_text');
      params.release_date_text = payload.release_date_text;
    }
    if (payload.summary_text != null) {
      sets.push('summary_text = @summary_text');
      params.summary_text = payload.summary_text;
    }
    if (payload.related_vitola_path != null) {
      const { vitola } = resolveVitola(payload.related_vitola_path);
      sets.push('related_vitola_id = @related_vitola_id');
      params.related_vitola_id = vitola.id;
    }
    if (payload.related_news_item_id != null) {
      const newsItem = db.prepare('SELECT id FROM news_item WHERE id = ?').get(payload.related_news_item_id);
      if (!newsItem) fail(`No news_item found with id "${payload.related_news_item_id}"`);
      sets.push('related_news_item_id = @related_news_item_id');
      params.related_news_item_id = newsItem.id;
    }

    if (sets.length === 0) {
      fail('update-release requires at least one of: release_month, release_date_text, summary_text, related_vitola_path, related_news_item_id');
    }
    db.prepare(`UPDATE cigar_release SET ${sets.join(', ')} WHERE id = @id`).run(at(params));
    return { ok: true };
  },

  'find-factory'(payload) {
    const { factory } = resolveFactory(payload.path);
    return { factory };
  },

  // A new factory is a new catalog entity, same tier as add-brand/add-line —
  // only call this directly when data/review-queue.json already has an
  // owner-approved entry; otherwise queue-add first. `history_text`/
  // `founded_year`/`city` are NEVER fabricated: omit them and this command
  // queues the gap for the owner rather than guessing.
  'add-factory'(payload) {
    const required = ['name', 'slug', 'country'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-factory requires "${field}"`);
    }
    const existing = db.prepare('SELECT id FROM factory WHERE slug = ?').get(payload.slug);
    if (existing) fail(`Factory "${payload.slug}" already exists (id ${existing.id})`);

    const brandSlugs = payload.brand_slugs ?? [];
    const brands = brandSlugs.map((slug) => {
      const brand = db.prepare('SELECT * FROM brand WHERE slug = ?').get(slug);
      if (!brand) fail(`No brand found with slug "${slug}"`);
      return brand;
    });

    const result = db.prepare(`
      INSERT INTO factory (name, slug, country, city, founded_year, history_text)
      VALUES (@name, @slug, @country, @city, @founded_year, @history_text)
    `).run(at({
      name: payload.name,
      slug: payload.slug,
      country: payload.country,
      city: payload.city ?? null,
      founded_year: payload.founded_year ?? null,
      history_text: payload.history_text ?? null,
    }));
    const factoryId = result.lastInsertRowid;

    for (const brand of brands) {
      db.prepare('UPDATE brand SET factory_id = ? WHERE id = ?').run(factoryId, brand.id);
    }

    if (payload.founded_year == null) {
      queueMissingFact(`Factory "${payload.name}" is missing founded_year`, `/factories/${payload.slug}/`, 'founded_year was not provided when this factory was added.');
    }
    if (payload.history_text == null) {
      queueMissingFact(`Factory "${payload.name}" is missing history_text`, `/factories/${payload.slug}/`, 'history_text was not provided when this factory was added.');
    }

    return { ok: true, factory_id: factoryId, linked_brands: brands.map((b) => b.slug) };
  },

  // Only touches fields actually passed in (mirrors update-release).
  'update-factory'(payload) {
    const { factory } = resolveFactory(payload.path);
    const sets = [];
    const params = { id: factory.id };
    if (payload.city != null) {
      sets.push('city = @city');
      params.city = payload.city;
    }
    if (payload.founded_year != null) {
      sets.push('founded_year = @founded_year');
      params.founded_year = payload.founded_year;
    }
    if (payload.history_text != null) {
      sets.push('history_text = @history_text');
      params.history_text = payload.history_text;
    }
    if (sets.length === 0) fail('update-factory requires at least one of: city, founded_year, history_text');
    db.prepare(`UPDATE factory SET ${sets.join(', ')} WHERE id = @id`).run(at(params));
    return { ok: true };
  },

  // Only touches fields actually passed in. Currently just links a brand to
  // a real, already-profiled factory — other brand fields have their own
  // established mutation path (none yet) and aren't in scope here.
  'update-brand'(payload) {
    const brand = db.prepare('SELECT * FROM brand WHERE slug = ?').get(payload.brand_slug);
    if (!brand) fail(`No brand found with slug "${payload.brand_slug}"`);
    const sets = [];
    const params = { id: brand.id };
    if (payload.factory_slug != null) {
      const factory = db.prepare('SELECT id FROM factory WHERE slug = ?').get(payload.factory_slug);
      if (!factory) fail(`No factory found with slug "${payload.factory_slug}"`);
      sets.push('factory_id = @factory_id');
      params.factory_id = factory.id;
    }
    if (sets.length === 0) fail('update-brand requires at least one of: factory_slug');
    db.prepare(`UPDATE brand SET ${sets.join(', ')} WHERE id = @id`).run(at(params));
    return { ok: true };
  },

  // Citations on an EXISTING entity (like add-critic-review) — auto-publish
  // tier, no queue-gating. Multiple rows per brand/factory since different
  // facts are often sourced from different places at different times.
  'add-brand-source'(payload) {
    const brand = db.prepare('SELECT * FROM brand WHERE slug = ?').get(payload.brand_slug);
    if (!brand) fail(`No brand found with slug "${payload.brand_slug}"`);
    const required = ['source_name', 'source_url', 'fact_note', 'retrieved_at'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-brand-source requires "${field}"`);
    }
    const result = db.prepare(`
      INSERT INTO brand_source (brand_id, source_name, source_url, fact_note, retrieved_at)
      VALUES (@brand_id, @source_name, @source_url, @fact_note, @retrieved_at)
    `).run(at({
      brand_id: brand.id,
      source_name: payload.source_name,
      source_url: payload.source_url,
      fact_note: payload.fact_note,
      retrieved_at: payload.retrieved_at,
    }));
    return { ok: true, brand_source_id: result.lastInsertRowid };
  },

  'add-factory-source'(payload) {
    const { factory } = resolveFactory(payload.path);
    const required = ['source_name', 'source_url', 'fact_note', 'retrieved_at'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-factory-source requires "${field}"`);
    }
    const result = db.prepare(`
      INSERT INTO factory_source (factory_id, source_name, source_url, fact_note, retrieved_at)
      VALUES (@factory_id, @source_name, @source_url, @fact_note, @retrieved_at)
    `).run(at({
      factory_id: factory.id,
      source_name: payload.source_name,
      source_url: payload.source_url,
      fact_note: payload.fact_note,
      retrieved_at: payload.retrieved_at,
    }));
    return { ok: true, factory_source_id: result.lastInsertRowid };
  },

  // Citation on an existing entity (like add-critic-review) — auto-publish
  // tier, no queue-gating. Keyed to line_id, not vitola_id: a real "pair this
  // with X" recommendation is almost always about the blend as a whole, not
  // one specific size.
  'add-pairing-citation'(payload) {
    const { line } = resolveLine(payload.path);
    const required = ['pairing_text', 'source_name', 'source_url', 'published_date'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-pairing-citation requires "${field}"`);
    }
    const result = db.prepare(`
      INSERT INTO cigar_pairing_citation (line_id, pairing_text, category, source_name, source_url, published_date)
      VALUES (@line_id, @pairing_text, @category, @source_name, @source_url, @published_date)
    `).run(at({
      line_id: line.id,
      pairing_text: payload.pairing_text,
      category: payload.category ?? null,
      source_name: payload.source_name,
      source_url: payload.source_url,
      published_date: payload.published_date,
    }));
    return { ok: true, pairing_citation_id: result.lastInsertRowid };
  },

  'find-pairing-citations'(payload) {
    const { line } = resolveLine(payload.path);
    return { citations: db.prepare('SELECT * FROM cigar_pairing_citation WHERE line_id = ?').all(line.id) };
  },

  // IMPORTANT: only ever call this after a human has personally read the
  // submission for appropriateness, spam, and minors-targeting — there is no
  // "pending" state in this table, so calling this command IS the approval.
  // Nightly automation must never call this unsupervised; see CLAUDE.md
  // "Cigar Pairings."
  'add-community-pairing'(payload) {
    const { line } = resolveLine(payload.path);
    const required = ['submitter_name', 'pairing_text', 'submitted_date'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-community-pairing requires "${field}"`);
    }
    const result = db.prepare(`
      INSERT INTO cigar_pairing_community (line_id, submitter_name, pairing_text, submitted_date)
      VALUES (@line_id, @submitter_name, @pairing_text, @submitted_date)
    `).run(at({
      line_id: line.id,
      submitter_name: payload.submitter_name,
      pairing_text: payload.pairing_text,
      submitted_date: payload.submitted_date,
    }));
    return { ok: true, community_pairing_id: result.lastInsertRowid };
  },

  'find-community-pairings'(payload) {
    const { line } = resolveLine(payload.path);
    return { pairings: db.prepare('SELECT * FROM cigar_pairing_community WHERE line_id = ?').all(line.id) };
  },

  // Real submissions arrive out-of-band (however the owner collects them —
  // a linked form, email, etc.), never through a live public endpoint. Only
  // ever call this after a human has personally read the submission for
  // appropriateness, spam, and minors-targeting — same trust model as
  // add-community-pairing. This command's own job beyond that is idempotency
  // (skip if external_id already exists) and structural validity (star
  // range, non-empty name, valid enums), not re-moderation.
  'add-community-review'(payload) {
    const { vitola } = resolveVitola(payload.path);
    const required = ['external_id', 'reviewer_name', 'star_rating', 'submitted_date'];
    for (const field of required) {
      if (payload[field] == null) fail(`add-community-review requires "${field}"`);
    }
    if (!Number.isInteger(payload.star_rating) || payload.star_rating < 1 || payload.star_rating > 5) {
      fail(`add-community-review requires "star_rating" to be an integer between 1 and 5, got ${payload.star_rating}`);
    }
    if (String(payload.reviewer_name).trim().length === 0) {
      fail('add-community-review requires a non-empty "reviewer_name"');
    }
    const existing = db.prepare('SELECT id FROM cigar_community_review WHERE external_id = ?').get(payload.external_id);
    if (existing) {
      return { ok: true, skipped: true, reason: 'already synced', community_review_id: existing.id };
    }
    const validEnum = (value, allowed) => value == null || allowed.includes(value);
    if (!validEnum(payload.strength_experienced, ['mild', 'mild-medium', 'medium', 'medium-full', 'full'])) {
      fail(`add-community-review: invalid strength_experienced "${payload.strength_experienced}"`);
    }
    if (!validEnum(payload.draw_experienced, ['tight', 'ideal', 'loose'])) {
      fail(`add-community-review: invalid draw_experienced "${payload.draw_experienced}"`);
    }
    if (!validEnum(payload.burn_experienced, ['poor', 'average', 'excellent'])) {
      fail(`add-community-review: invalid burn_experienced "${payload.burn_experienced}"`);
    }
    const result = db.prepare(`
      INSERT INTO cigar_community_review (
        vitola_id, external_id, reviewer_name, star_rating, strength_experienced,
        draw_experienced, burn_experienced, tasting_notes_user, review_text, submitted_date
      ) VALUES (
        @vitola_id, @external_id, @reviewer_name, @star_rating, @strength_experienced,
        @draw_experienced, @burn_experienced, @tasting_notes_user, @review_text, @submitted_date
      )
    `).run(at({
      vitola_id: vitola.id,
      external_id: payload.external_id,
      reviewer_name: payload.reviewer_name,
      star_rating: payload.star_rating,
      strength_experienced: payload.strength_experienced ?? null,
      draw_experienced: payload.draw_experienced ?? null,
      burn_experienced: payload.burn_experienced ?? null,
      tasting_notes_user: JSON.stringify(payload.tasting_notes_user ?? []),
      review_text: payload.review_text ?? null,
      submitted_date: payload.submitted_date,
    }));
    return { ok: true, skipped: false, community_review_id: result.lastInsertRowid };
  },

  // For hiding an already-published review the owner later decides is spam
  // or inappropriate (e.g. after a reader flags it some other way) — never
  // deletes the row, matches the site's "never delete, only correct" rule.
  'update-community-review-status'(payload) {
    if (payload.external_id == null) fail('update-community-review-status requires "external_id"');
    const review = db.prepare('SELECT * FROM cigar_community_review WHERE external_id = ?').get(payload.external_id);
    if (!review) fail(`No community review found with external_id "${payload.external_id}"`);
    const sets = [];
    const params = { id: review.id };
    if (payload.hidden != null) {
      sets.push('hidden = @hidden');
      params.hidden = payload.hidden ? 1 : 0;
    }
    if (payload.report_count != null) {
      sets.push('report_count = @report_count');
      params.report_count = payload.report_count;
    }
    if (sets.length === 0) fail('update-community-review-status requires at least one of: hidden, report_count');
    db.prepare(`UPDATE cigar_community_review SET ${sets.join(', ')} WHERE id = @id`).run(at(params));
    return { ok: true };
  },

  'find-community-reviews'(payload) {
    const { vitola } = resolveVitola(payload.path);
    return { reviews: db.prepare('SELECT * FROM cigar_community_review WHERE vitola_id = ?').all(vitola.id) };
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
