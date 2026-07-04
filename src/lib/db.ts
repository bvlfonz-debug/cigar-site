import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

const dbPath = path.join(process.cwd(), 'data', 'cigars.db');

let db: DatabaseSync | undefined;

function getDb(): DatabaseSync {
  if (!db) {
    db = new DatabaseSync(dbPath, { readOnly: true });
  }
  return db;
}

export interface BrandRow {
  id: number;
  name: string;
  slug: string;
  country: string;
  factory: string | null;
  founded_year: number | null;
  story_short: string;
}

export interface LineRow {
  id: number;
  brand_id: number;
  name: string;
  slug: string;
  wrapper: string;
  binder: string;
  filler: string;
  strength: string;
  release_year: number | null;
  background_text: string;
}

export interface VitolaRow {
  id: number;
  line_id: number;
  size_name: string;
  slug: string;
  length_in: number;
  ring_gauge: number;
  vitola_type: string;
  stick_score: number | null;
  score_flavor: number | null;
  score_construction: number | null;
  score_complexity: number | null;
  score_value: number | null;
  tasting_notes: string;
  summary_review: string;
  smoke_time_min: number | null;
  box_counts: string;
}

export interface CriticReviewRow {
  id: number;
  vitola_id: number;
  source_name: string;
  source_type: 'critic' | 'retailer';
  score: number;
  score_scale: number;
  review_count: number | null;
  review_date: string;
  url: string;
  key_notes_text: string | null;
}

export interface CigarPageData {
  brand: BrandRow;
  line: LineRow;
  vitola: VitolaRow;
  criticReviews: CriticReviewRow[];
}

export function getAllCigarSlugs(): { brand: string; line: string; vitola: string }[] {
  return getDb()
    .prepare(
      `SELECT brand.slug AS brand, line.slug AS line, vitola.slug AS vitola
       FROM vitola
       JOIN line ON line.id = vitola.line_id
       JOIN brand ON brand.id = line.brand_id`
    )
    .all() as { brand: string; line: string; vitola: string }[];
}

export function getCigarPage(brandSlug: string, lineSlug: string, vitolaSlug: string): CigarPageData | null {
  const db = getDb();

  const brand = db.prepare('SELECT * FROM brand WHERE slug = ?').get(brandSlug) as BrandRow | undefined;
  if (!brand) return null;

  const line = db
    .prepare('SELECT * FROM line WHERE brand_id = ? AND slug = ?')
    .get(brand.id, lineSlug) as LineRow | undefined;
  if (!line) return null;

  const vitola = db
    .prepare('SELECT * FROM vitola WHERE line_id = ? AND slug = ?')
    .get(line.id, vitolaSlug) as VitolaRow | undefined;
  if (!vitola) return null;

  const criticReviews = db
    .prepare('SELECT * FROM critic_review WHERE vitola_id = ? ORDER BY review_date DESC')
    .all(vitola.id) as CriticReviewRow[];

  return { brand, line, vitola, criticReviews };
}

export interface BrandPageLine extends LineRow {
  vitolas: VitolaRow[];
}

export interface BrandPageData {
  brand: BrandRow;
  lines: BrandPageLine[];
}

export function getAllBrandSlugs(): string[] {
  return (getDb().prepare('SELECT slug FROM brand').all() as { slug: string }[]).map((r) => r.slug);
}

export function getAllBrands(): BrandRow[] {
  return getDb().prepare('SELECT * FROM brand ORDER BY name').all() as BrandRow[];
}

export function getBrandPage(brandSlug: string): BrandPageData | null {
  const db = getDb();
  const brand = db.prepare('SELECT * FROM brand WHERE slug = ?').get(brandSlug) as BrandRow | undefined;
  if (!brand) return null;

  const lines = db.prepare('SELECT * FROM line WHERE brand_id = ? ORDER BY name').all(brand.id) as LineRow[];
  const linesWithVitolas: BrandPageLine[] = lines.map((line) => ({
    ...line,
    vitolas: db.prepare('SELECT * FROM vitola WHERE line_id = ? ORDER BY size_name').all(line.id) as VitolaRow[],
  }));

  return { brand, lines: linesWithVitolas };
}

export interface SearchIndexEntry {
  brandName: string;
  brandSlug: string;
  lineName: string;
  lineSlug: string;
  vitolaSizeName: string;
  vitolaSlug: string;
  wrapper: string;
  strength: string;
  country: string;
  stickScore: number | null;
  path: string;
}

export interface SimilarCigar {
  brandName: string;
  brandSlug: string;
  lineName: string;
  lineSlug: string;
  vitolaSizeName: string;
  vitolaSlug: string;
  stickScore: number | null;
}

export function getSimilarCigars(currentVitolaId: number, wrapper: string, strength: string, limit = 5): SimilarCigar[] {
  const rows = getDb()
    .prepare(
      `SELECT
         brand.name AS brandName, brand.slug AS brandSlug,
         line.name AS lineName, line.slug AS lineSlug, line.wrapper AS wrapper, line.strength AS strength,
         vitola.id AS vitolaId, vitola.size_name AS vitolaSizeName, vitola.slug AS vitolaSlug, vitola.stick_score AS stickScore
       FROM vitola
       JOIN line ON line.id = vitola.line_id
       JOIN brand ON brand.id = line.brand_id
       WHERE vitola.id != ? AND (line.wrapper = ? OR line.strength = ?)
       ORDER BY (line.wrapper = ?) DESC, (line.strength = ?) DESC, vitola.stick_score DESC
       LIMIT ?`
    )
    .all(currentVitolaId, wrapper, strength, wrapper, strength, limit) as (SimilarCigar & { vitolaId: number })[];

  return rows.map(({ vitolaId, ...rest }) => rest);
}

export interface PricePointRow {
  id: number;
  vitola_id: number;
  retailer: string;
  price_single: number | null;
  price_box: number | null;
  box_count: number | null;
  affiliate_url: string | null;
  checked_at: string;
}

// price_point is append-only, so history piles up per retailer over time —
// this returns just the most recent check per retailer for display.
export function getLatestPricePoints(vitolaId: number): PricePointRow[] {
  const rows = getDb()
    .prepare('SELECT * FROM price_point WHERE vitola_id = ? ORDER BY checked_at DESC')
    .all(vitolaId) as PricePointRow[];

  const latestByRetailer = new Map<string, PricePointRow>();
  for (const row of rows) {
    if (!latestByRetailer.has(row.retailer)) {
      latestByRetailer.set(row.retailer, row);
    }
  }
  return [...latestByRetailer.values()];
}

export interface NewsItemRow {
  id: number;
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  published_at: string;
  related_vitola_ids: string;
}

export interface RelatedCigar {
  brandName: string;
  brandSlug: string;
  lineName: string;
  lineSlug: string;
  vitolaSizeName: string;
  vitolaSlug: string;
}

export interface NewsItemWithRelated extends NewsItemRow {
  relatedCigars: RelatedCigar[];
}

export function getAllNewsItems(): NewsItemWithRelated[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM news_item ORDER BY published_at DESC').all() as NewsItemRow[];
  const relatedStmt = db.prepare(`
    SELECT brand.name AS brandName, brand.slug AS brandSlug,
           line.name AS lineName, line.slug AS lineSlug,
           vitola.size_name AS vitolaSizeName, vitola.slug AS vitolaSlug
    FROM vitola JOIN line ON line.id = vitola.line_id JOIN brand ON brand.id = line.brand_id
    WHERE vitola.id = ?
  `);

  return rows.map((r) => {
    const ids = JSON.parse(r.related_vitola_ids) as number[];
    const relatedCigars = ids.map((id) => relatedStmt.get(id) as RelatedCigar | undefined).filter((c): c is RelatedCigar => !!c);
    return { ...r, relatedCigars };
  });
}

export function getLatestNewsItems(limit = 3): NewsItemWithRelated[] {
  return getAllNewsItems().slice(0, limit);
}

export function getSearchIndex(): SearchIndexEntry[] {
  const rows = getDb()
    .prepare(
      `SELECT
         brand.name AS brandName, brand.slug AS brandSlug, brand.country AS country,
         line.name AS lineName, line.slug AS lineSlug, line.wrapper AS wrapper, line.strength AS strength,
         vitola.size_name AS vitolaSizeName, vitola.slug AS vitolaSlug, vitola.stick_score AS stickScore
       FROM vitola
       JOIN line ON line.id = vitola.line_id
       JOIN brand ON brand.id = line.brand_id`
    )
    .all() as Omit<SearchIndexEntry, 'path'>[];

  return rows.map((r) => ({
    ...r,
    path: `/cigars/${r.brandSlug}/${r.lineSlug}/${r.vitolaSlug}/`,
  }));
}
