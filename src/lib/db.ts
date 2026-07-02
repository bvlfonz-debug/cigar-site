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
  score: number;
  score_scale: number;
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
