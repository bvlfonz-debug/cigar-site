import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { wrapperMatchesKeywords } from './pairingRules';

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
  factory_id: number | null;
  founded_year: number | null;
  story_short: string;
}

export interface FactoryRow {
  id: number;
  name: string;
  slug: string;
  country: string;
  city: string | null;
  founded_year: number | null;
  history_text: string | null;
}

export interface BrandSourceRow {
  id: number;
  brand_id: number;
  source_name: string;
  source_url: string;
  fact_note: string;
  retrieved_at: string;
}

export interface FactorySourceRow {
  id: number;
  factory_id: number;
  source_name: string;
  source_url: string;
  fact_note: string;
  retrieved_at: string;
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

export interface PairingCitationRow {
  id: number;
  line_id: number;
  pairing_text: string;
  category: string | null;
  source_name: string;
  source_url: string;
  published_date: string;
}

export interface CommunityPairingRow {
  id: number;
  line_id: number;
  submitter_name: string;
  pairing_text: string;
  submitted_date: string;
}

export interface CommunityReviewRow {
  id: number;
  vitola_id: number;
  external_id: string;
  reviewer_name: string;
  star_rating: number;
  strength_experienced: string | null;
  draw_experienced: string | null;
  burn_experienced: string | null;
  tasting_notes_user: string;
  review_text: string | null;
  submitted_date: string;
  report_count: number;
  hidden: number;
}

export interface CigarPageData {
  brand: BrandRow;
  line: LineRow;
  vitola: VitolaRow;
  criticReviews: CriticReviewRow[];
  pairingCitations: PairingCitationRow[];
  communityPairings: CommunityPairingRow[];
  communityReviews: CommunityReviewRow[];
}

// First-hand, user-submitted star ratings — NEVER computed via
// computeStickScore (that logic is critic-weighting/recency-doubling, which
// is meaningless for a flat 1-5 average) and never blended with
// vitola.stick_score anywhere. Same "insufficient data" minimum-count
// convention used everywhere else on the site, just a plain arithmetic mean.
export function computeCommunityAverage(reviews: CommunityReviewRow[]): number | null {
  const visible = reviews.filter((r) => !r.hidden);
  if (visible.length < 3) return null;
  return visible.reduce((sum, r) => sum + r.star_rating, 0) / visible.length;
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

  const pairingCitations = db
    .prepare('SELECT * FROM cigar_pairing_citation WHERE line_id = ? ORDER BY published_date DESC')
    .all(line.id) as PairingCitationRow[];

  const communityPairings = db
    .prepare('SELECT * FROM cigar_pairing_community WHERE line_id = ? ORDER BY submitted_date DESC')
    .all(line.id) as CommunityPairingRow[];

  const communityReviews = db
    .prepare('SELECT * FROM cigar_community_review WHERE vitola_id = ? AND hidden = 0 ORDER BY submitted_date DESC')
    .all(vitola.id) as CommunityReviewRow[];

  return { brand, line, vitola, criticReviews, pairingCitations, communityPairings, communityReviews };
}

export interface BrandPageLine extends LineRow {
  vitolas: VitolaRow[];
}

export interface BrandPageData {
  brand: BrandRow;
  lines: BrandPageLine[];
  sources: BrandSourceRow[];
  factory: FactoryRow | null;
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

  const sources = db.prepare('SELECT * FROM brand_source WHERE brand_id = ? ORDER BY retrieved_at DESC').all(brand.id) as BrandSourceRow[];
  const factory = brand.factory_id != null
    ? (db.prepare('SELECT * FROM factory WHERE id = ?').get(brand.factory_id) as FactoryRow | undefined) ?? null
    : null;

  return { brand, lines: linesWithVitolas, sources, factory };
}

// ---------------------------------------------------------------------------
// Factory profiles
// ---------------------------------------------------------------------------

export interface FactoryPageBrand extends BrandRow {
  lines: BrandPageLine[];
}

export interface FactoryPageData {
  factory: FactoryRow;
  brands: FactoryPageBrand[];
  sources: FactorySourceRow[];
}

export function getAllFactorySlugs(): string[] {
  return (getDb().prepare('SELECT slug FROM factory').all() as { slug: string }[]).map((r) => r.slug);
}

export function getFactoryById(id: number): FactoryRow | null {
  return (getDb().prepare('SELECT * FROM factory WHERE id = ?').get(id) as FactoryRow | undefined) ?? null;
}

export function getAllFactories(): (FactoryRow & { brandCount: number })[] {
  const db = getDb();
  const factories = db.prepare('SELECT * FROM factory ORDER BY name').all() as FactoryRow[];
  const countStmt = db.prepare('SELECT COUNT(*) AS n FROM brand WHERE factory_id = ?');
  return factories.map((f) => ({ ...f, brandCount: (countStmt.get(f.id) as { n: number }).n }));
}

export function getFactoryPage(factorySlug: string): FactoryPageData | null {
  const db = getDb();
  const factory = db.prepare('SELECT * FROM factory WHERE slug = ?').get(factorySlug) as FactoryRow | undefined;
  if (!factory) return null;

  const brandRows = db.prepare('SELECT * FROM brand WHERE factory_id = ? ORDER BY name').all(factory.id) as BrandRow[];
  const brands: FactoryPageBrand[] = brandRows.map((brand) => {
    const lines = db.prepare('SELECT * FROM line WHERE brand_id = ? ORDER BY name').all(brand.id) as LineRow[];
    return {
      ...brand,
      lines: lines.map((line) => ({
        ...line,
        vitolas: db.prepare('SELECT * FROM vitola WHERE line_id = ? ORDER BY size_name').all(line.id) as VitolaRow[],
      })),
    };
  });

  const sources = db.prepare('SELECT * FROM factory_source WHERE factory_id = ? ORDER BY retrieved_at DESC').all(factory.id) as FactorySourceRow[];

  return { factory, brands, sources };
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

export interface CigarProfileMatch {
  brandName: string;
  brandSlug: string;
  lineName: string;
  lineSlug: string;
  vitolaSizeName: string;
  vitolaSlug: string;
  stickScore: number | null;
}

// For the /pairings/[slug]/ "example cigars" sections. Small dataset (see
// getSimilarCigars above), so filter/sort in memory rather than a fuzzy SQL
// match — reuses wrapperMatchesKeywords() from pairingRules.ts so the guide
// pages and the per-cigar rule engine agree on what counts as e.g. "a
// maduro-style wrapper." Matches on strength OR wrapper (not both required):
// in the per-cigar rule engine, strength and wrapper are independent signals
// that each suggest a pairing category on their own, so a topic page's
// example list should be the union, not the (much narrower) intersection.
export function getCigarsByProfile(strengths: string[], wrapperKeywords: string[], limit = 8): CigarProfileMatch[] {
  const rows = getDb()
    .prepare(
      `SELECT
         brand.name AS brandName, brand.slug AS brandSlug,
         line.name AS lineName, line.slug AS lineSlug, line.wrapper AS wrapper, line.strength AS strength,
         vitola.size_name AS vitolaSizeName, vitola.slug AS vitolaSlug, vitola.stick_score AS stickScore
       FROM vitola
       JOIN line ON line.id = vitola.line_id
       JOIN brand ON brand.id = line.brand_id`
    )
    .all() as (CigarProfileMatch & { wrapper: string; strength: string })[];

  return rows
    .filter(
      (r) =>
        strengths.includes(r.strength) ||
        (wrapperKeywords.length > 0 && wrapperMatchesKeywords(r.wrapper, wrapperKeywords))
    )
    .sort((a, b) => (b.stickScore ?? -1) - (a.stickScore ?? -1))
    .slice(0, limit)
    .map(({ wrapper, strength, ...rest }) => rest);
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

// Full history (not just latest), grouped by retailer, oldest first per group —
// used for the price-history table and the /deals trailing-average calculation.
export function getPriceHistory(vitolaId: number): Record<string, PricePointRow[]> {
  const rows = getDb()
    .prepare('SELECT * FROM price_point WHERE vitola_id = ? ORDER BY checked_at ASC')
    .all(vitolaId) as PricePointRow[];

  const byRetailer: Record<string, PricePointRow[]> = {};
  for (const row of rows) {
    (byRetailer[row.retailer] ??= []).push(row);
  }
  return byRetailer;
}

export interface DealCandidate {
  brandName: string;
  brandSlug: string;
  lineName: string;
  lineSlug: string;
  vitolaSizeName: string;
  vitolaSlug: string;
  retailer: string;
  latestPrice: number;
  trailingAverage: number;
  percentBelow: number;
  affiliate_url: string | null;
}

// Anything currently priced >15% below its own trailing 90-day average,
// per CLAUDE.md's /deals rule. A price needs at least one earlier check to
// compare against, so a cigar's first-ever price check can never be a deal.
export function getDeals(): DealCandidate[] {
  const db = getDb();
  const cigars = db
    .prepare(
      `SELECT brand.name AS brandName, brand.slug AS brandSlug,
              line.name AS lineName, line.slug AS lineSlug,
              vitola.id AS vitolaId, vitola.size_name AS vitolaSizeName, vitola.slug AS vitolaSlug
       FROM vitola
       JOIN line ON line.id = vitola.line_id
       JOIN brand ON brand.id = line.brand_id`
    )
    .all() as { brandName: string; brandSlug: string; lineName: string; lineSlug: string; vitolaId: number; vitolaSizeName: string; vitolaSlug: string }[];

  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const deals: DealCandidate[] = [];

  for (const cigar of cigars) {
    const history = getPriceHistory(cigar.vitolaId);
    for (const [retailer, points] of Object.entries(history)) {
      if (points.length < 2) continue; // nothing to compare the latest check against yet
      const latest = points[points.length - 1];
      const trailing = points.slice(0, -1).filter((p) => p.checked_at >= ninetyDaysAgo && p.price_single != null);
      if (trailing.length === 0 || latest.price_single == null) continue;

      const avg = trailing.reduce((s, p) => s + (p.price_single as number), 0) / trailing.length;
      const percentBelow = ((avg - latest.price_single) / avg) * 100;
      if (percentBelow > 15) {
        deals.push({
          brandName: cigar.brandName,
          brandSlug: cigar.brandSlug,
          lineName: cigar.lineName,
          lineSlug: cigar.lineSlug,
          vitolaSizeName: cigar.vitolaSizeName,
          vitolaSlug: cigar.vitolaSlug,
          retailer,
          latestPrice: latest.price_single,
          trailingAverage: avg,
          percentBelow,
          affiliate_url: latest.affiliate_url,
        });
      }
    }
  }

  return deals.sort((a, b) => b.percentBelow - a.percentBelow);
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
  relatedReleaseSlug: string | null;
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
  // Bidirectional cross-link with the Cigar Release Calendar: a release row
  // may point back at the news item that reported it.
  const releaseByNewsItem = new Map(
    (db.prepare('SELECT related_news_item_id, slug FROM cigar_release WHERE related_news_item_id IS NOT NULL').all() as { related_news_item_id: number; slug: string }[])
      .map((r) => [r.related_news_item_id, r.slug])
  );

  return rows.map((r) => {
    const ids = JSON.parse(r.related_vitola_ids) as number[];
    const relatedCigars = ids.map((id) => relatedStmt.get(id) as RelatedCigar | undefined).filter((c): c is RelatedCigar => !!c);
    return { ...r, relatedCigars, relatedReleaseSlug: releaseByNewsItem.get(r.id) ?? null };
  });
}

export function getLatestNewsItems(limit = 3): NewsItemWithRelated[] {
  return getAllNewsItems().slice(0, limit);
}

// ---------------------------------------------------------------------------
// Cigar Release Calendar
// ---------------------------------------------------------------------------

export interface CigarReleaseRow {
  id: number;
  slug: string;
  brand_name: string;
  brand_slug: string | null;
  line_name: string;
  announced_date: string;
  release_month: string | null;
  release_date_text: string | null;
  summary_text: string;
  source_name: string;
  source_url: string;
  related_vitola_id: number | null;
  related_news_item_id: number | null;
}

export interface CigarReleaseWithRelated extends CigarReleaseRow {
  relatedCigar: RelatedCigar | null;
  relatedNewsItem: { id: number; title: string; published_at: string } | null;
}

export function getAllCigarReleases(): CigarReleaseWithRelated[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM cigar_release').all() as CigarReleaseRow[];
  const vitolaStmt = db.prepare(`
    SELECT brand.name AS brandName, brand.slug AS brandSlug,
           line.name AS lineName, line.slug AS lineSlug,
           vitola.size_name AS vitolaSizeName, vitola.slug AS vitolaSlug
    FROM vitola JOIN line ON line.id = vitola.line_id JOIN brand ON brand.id = line.brand_id
    WHERE vitola.id = ?
  `);
  const newsStmt = db.prepare('SELECT id, title, published_at FROM news_item WHERE id = ?');

  return rows.map((r) => ({
    ...r,
    relatedCigar: r.related_vitola_id != null ? (vitolaStmt.get(r.related_vitola_id) as RelatedCigar | undefined) ?? null : null,
    relatedNewsItem: r.related_news_item_id != null
      ? (newsStmt.get(r.related_news_item_id) as { id: number; title: string; published_at: string } | undefined) ?? null
      : null,
  }));
}

export interface CompareCigarEntry {
  brandSlug: string;
  brandName: string;
  lineSlug: string;
  lineName: string;
  vitolaSlug: string;
  vitolaSizeName: string;
  stickScore: number | null;
}

export function getAllCigarsForCompare(): CompareCigarEntry[] {
  return getDb()
    .prepare(
      `SELECT brand.slug AS brandSlug, brand.name AS brandName,
              line.slug AS lineSlug, line.name AS lineName,
              vitola.slug AS vitolaSlug, vitola.size_name AS vitolaSizeName,
              vitola.stick_score AS stickScore
       FROM vitola
       JOIN line ON line.id = vitola.line_id
       JOIN brand ON brand.id = line.brand_id
       ORDER BY brand.name, line.name, vitola.size_name`
    )
    .all() as CompareCigarEntry[];
}

// Every same-brand cigar pair as a URL slug — shared by /compare/[pair]'s
// getStaticPaths and the sitemap, so the two can never disagree. Bounded to
// same-brand pairs (not the full cross-product) to keep page count and
// build time predictable as the catalog grows.
export function getAllComparePairSlugs(): string[] {
  const cigars = getAllCigarsForCompare();
  const byBrand = new Map<string, typeof cigars>();
  for (const c of cigars) {
    const list = byBrand.get(c.brandSlug) ?? [];
    list.push(c);
    byBrand.set(c.brandSlug, list);
  }
  const slugs: string[] = [];
  for (const brandCigars of byBrand.values()) {
    for (let i = 0; i < brandCigars.length; i++) {
      for (let j = i + 1; j < brandCigars.length; j++) {
        const a = brandCigars[i];
        const b = brandCigars[j];
        slugs.push(`${a.brandSlug}-${a.lineSlug}-${a.vitolaSlug}-vs-${b.brandSlug}-${b.lineSlug}-${b.vitolaSlug}`);
      }
    }
  }
  return slugs;
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

// ---------------------------------------------------------------------------
// Accessories Expansion (non-tobacco)
// ---------------------------------------------------------------------------

export interface AccessoryCategoryRow {
  id: number;
  name: string;
  slug: string;
}

export interface AccessoryRow {
  id: number;
  category_id: number;
  brand: string;
  model: string;
  slug: string;
  specs: string;
  acc_score: number | null;
  summary_review: string;
  pros: string;
  cons: string;
}

export interface AccessoryReviewRow {
  id: number;
  accessory_id: number;
  source_name: string;
  source_type: 'critic' | 'community';
  score: number;
  score_scale: number;
  review_date: string;
  url: string;
  key_notes_text: string | null;
}

export interface AccessoryPricePointRow {
  id: number;
  accessory_id: number;
  retailer: string;
  price_single: number | null;
  price_box: number | null;
  box_count: number | null;
  affiliate_url: string | null;
  checked_at: string;
}

export function getAllAccessoryCategories(): AccessoryCategoryRow[] {
  return getDb().prepare('SELECT * FROM accessory_category ORDER BY name').all() as AccessoryCategoryRow[];
}

export function getAllAccessorySlugs(): { category: string; accessory: string }[] {
  return getDb()
    .prepare(
      `SELECT accessory_category.slug AS category, accessory.slug AS accessory
       FROM accessory JOIN accessory_category ON accessory_category.id = accessory.category_id`
    )
    .all() as { category: string; accessory: string }[];
}

export interface AccessoryPageData {
  category: AccessoryCategoryRow;
  accessory: AccessoryRow;
  reviews: AccessoryReviewRow[];
}

export function getAccessoryPage(categorySlug: string, accessorySlug: string): AccessoryPageData | null {
  const db = getDb();
  const category = db.prepare('SELECT * FROM accessory_category WHERE slug = ?').get(categorySlug) as
    | AccessoryCategoryRow
    | undefined;
  if (!category) return null;

  const accessory = db
    .prepare('SELECT * FROM accessory WHERE category_id = ? AND slug = ?')
    .get(category.id, accessorySlug) as AccessoryRow | undefined;
  if (!accessory) return null;

  const reviews = db
    .prepare('SELECT * FROM accessory_review WHERE accessory_id = ? ORDER BY review_date DESC')
    .all(accessory.id) as AccessoryReviewRow[];

  return { category, accessory, reviews };
}

export interface AccessorySummary {
  brand: string;
  model: string;
  slug: string;
  accScore: number | null;
}

export function getAccessoriesByCategory(categorySlug: string): { category: AccessoryCategoryRow; accessories: AccessorySummary[] } | null {
  const db = getDb();
  const category = db.prepare('SELECT * FROM accessory_category WHERE slug = ?').get(categorySlug) as
    | AccessoryCategoryRow
    | undefined;
  if (!category) return null;

  const rows = db
    .prepare('SELECT brand, model, slug, acc_score AS accScore FROM accessory WHERE category_id = ?')
    .all(category.id) as AccessorySummary[];

  return { category, accessories: rows };
}

// price_point-style: latest check per retailer only.
export function getLatestAccessoryPricePoints(accessoryId: number): AccessoryPricePointRow[] {
  const rows = getDb()
    .prepare('SELECT * FROM accessory_price_point WHERE accessory_id = ? ORDER BY checked_at DESC')
    .all(accessoryId) as AccessoryPricePointRow[];

  const latestByRetailer = new Map<string, AccessoryPricePointRow>();
  for (const row of rows) {
    if (!latestByRetailer.has(row.retailer)) {
      latestByRetailer.set(row.retailer, row);
    }
  }
  return [...latestByRetailer.values()];
}

// ---------------------------------------------------------------------------
// Lounge Directory Expansion (factual directory, no first-hand ratings)
// ---------------------------------------------------------------------------

export interface LoungeRow {
  id: number;
  name: string;
  slug: string;
  city: string;
  city_slug: string;
  state: string | null;
  country: string;
  address: string;
  phone: string | null;
  website: string | null;
  hours_text: string | null;
  walk_in_or_membership: 'walk-in' | 'membership' | 'both' | null;
  membership_details: string | null;
  indoor_smoking_status: 'allowed' | 'not-allowed' | 'allowed-with-restrictions' | null;
  indoor_smoking_note: string | null;
  amenities: string;
  overview_text: string;
  lounge_score: number | null;
  facts_source_url: string | null;
  facts_checked_at: string | null;
}

export interface LoungeExternalRatingRow {
  id: number;
  lounge_id: number;
  source_name: string;
  source_type: 'critic' | 'platform';
  score: number;
  score_scale: number;
  review_count: number | null;
  rating_date: string;
  url: string;
  key_notes_text: string | null;
}

export interface LoungeCitySummary {
  city_slug: string;
  city: string;
  state: string | null;
  count: number;
}

export function getAllLoungeCitySlugs(): LoungeCitySummary[] {
  return getDb()
    .prepare(
      `SELECT city_slug, city, state, COUNT(*) AS count
       FROM lounge GROUP BY city_slug ORDER BY city`
    )
    .all() as LoungeCitySummary[];
}

export function getAllLoungeSlugs(): { city: string; lounge: string }[] {
  return getDb()
    .prepare('SELECT city_slug AS city, slug AS lounge FROM lounge')
    .all() as { city: string; lounge: string }[];
}

export function getLoungesByCity(citySlug: string): { cityLabel: string; state: string | null; lounges: LoungeRow[] } | null {
  const db = getDb();
  const cityRow = db.prepare('SELECT city, state FROM lounge WHERE city_slug = ? LIMIT 1').get(citySlug) as
    | { city: string; state: string | null }
    | undefined;
  if (!cityRow) return null;

  const lounges = db
    .prepare('SELECT * FROM lounge WHERE city_slug = ? ORDER BY name')
    .all(citySlug) as LoungeRow[];

  return { cityLabel: cityRow.city, state: cityRow.state, lounges };
}

export function getLoungePage(citySlug: string, slug: string): { lounge: LoungeRow; ratings: LoungeExternalRatingRow[] } | null {
  const db = getDb();
  const lounge = db
    .prepare('SELECT * FROM lounge WHERE city_slug = ? AND slug = ?')
    .get(citySlug, slug) as LoungeRow | undefined;
  if (!lounge) return null;

  const ratings = db
    .prepare('SELECT * FROM lounge_external_rating WHERE lounge_id = ? ORDER BY rating_date DESC')
    .all(lounge.id) as LoungeExternalRatingRow[];

  return { lounge, ratings };
}
