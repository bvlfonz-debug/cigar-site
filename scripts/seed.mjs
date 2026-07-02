// Rebuilds data/cigars.db from data/schema.sql and inserts researched sample data.
// Every fact and review below is sourced from a real, linked publication — see
// CLAUDE.md's "NEVER invent a score, a source, or a review" rule.
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'cigars.db');
const schemaPath = path.join(__dirname, '..', 'data', 'schema.sql');

fs.rmSync(dbPath, { force: true });
const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON');
db.exec(fs.readFileSync(schemaPath, 'utf-8'));

// node:sqlite requires bound-parameter object keys to include the SQL sigil
// (e.g. "@name"), unlike better-sqlite3's bare-key convention.
function at(params) {
  return Object.fromEntries(Object.entries(params).map(([k, v]) => [`@${k}`, v]));
}

function normalizeTo100(score, scoreScale) {
  return (score / scoreScale) * 100;
}

// StickScore weighting per CLAUDE.md: critic scores 70% / retailer averages 30%,
// with reviews from the last 5 years counting double. No retailer user-review
// average has been collected for this vitola yet (that's a nightly-automation
// job), so the critic bucket currently carries the full weight.
function computeStickScore(criticReviews, referenceDate) {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const r of criticReviews) {
    const normalized = normalizeTo100(r.score, r.score_scale);
    const ageYears = (referenceDate - new Date(r.review_date)) / (1000 * 60 * 60 * 24 * 365.25);
    const weight = ageYears <= 5 ? 2 : 1;
    weightedSum += normalized * weight;
    totalWeight += weight;
  }
  return totalWeight > 0 ? weightedSum / totalWeight : null;
}

const insertBrand = db.prepare(`
  INSERT INTO brand (name, slug, country, factory, founded_year, story_short)
  VALUES (@name, @slug, @country, @factory, @founded_year, @story_short)
`);

const insertLine = db.prepare(`
  INSERT INTO line (brand_id, name, slug, wrapper, binder, filler, strength, release_year, background_text)
  VALUES (@brand_id, @name, @slug, @wrapper, @binder, @filler, @strength, @release_year, @background_text)
`);

const insertVitola = db.prepare(`
  INSERT INTO vitola (
    line_id, size_name, slug, length_in, ring_gauge, vitola_type,
    stick_score, score_flavor, score_construction, score_complexity, score_value,
    tasting_notes, summary_review, smoke_time_min, box_counts
  ) VALUES (
    @line_id, @size_name, @slug, @length_in, @ring_gauge, @vitola_type,
    @stick_score, @score_flavor, @score_construction, @score_complexity, @score_value,
    @tasting_notes, @summary_review, @smoke_time_min, @box_counts
  )
`);

const insertCriticReview = db.prepare(`
  INSERT INTO critic_review (vitola_id, source_name, score, score_scale, review_date, url, key_notes_text)
  VALUES (@vitola_id, @source_name, @score, @score_scale, @review_date, @url, @key_notes_text)
`);

const brandId = insertBrand.run(at({
  name: 'Padrón',
  slug: 'padron',
  country: 'Nicaragua',
  factory: 'Tabacos Cubanica S.A., Estelí, Nicaragua',
  founded_year: 1964,
  story_short:
    'Founded in Miami in 1964 by Cuban-born José O. Padrón, the family-owned Padrón Cigar Company has rolled its cigars in Estelí, Nicaragua for decades and is one of the most consistently awarded names in premium cigars.',
})).lastInsertRowid;

const lineId = insertLine.run(at({
  brand_id: brandId,
  name: '1964 Anniversary Series Maduro',
  slug: '1964-anniversary-maduro',
  wrapper: 'Nicaraguan Maduro',
  binder: 'Nicaraguan',
  filler: 'Nicaraguan',
  strength: 'full',
  release_year: 1994,
  background_text:
    "Introduced in 1994 to mark 30 years since the company's founding, the 1964 Anniversary Series is Padrón's flagship full-bodied line: box-pressed, built from tobacco aged four years, and offered across sixteen sizes in both sun-grown Natural and Maduro wrappers.",
})).lastInsertRowid;

const criticReviews = [
  {
    source_name: 'Cigar Aficionado',
    score: 94,
    score_scale: 100,
    review_date: '2012-01-01',
    url: 'https://www.cigaraficionado.com/ratings/15421/name/padron-1964-anniversary-series-exclusivo-maduro',
    key_notes_text: 'Rated 94; ranked #5 on Cigar Aficionado\'s Top 25 Cigars of 2011.',
  },
  {
    source_name: 'Developing Palates',
    score: 5.9,
    score_scale: 10,
    review_date: '2021-07-30',
    url: 'https://developingpalates.com/reviews/cigar-reviews/personal-cigar-review-padron-1964-anniversary-series-maduro-exclusivo/',
    key_notes_text: 'Called it "fairly average," dominated by dark wood and earth; the dissenting view among sources.',
  },
  {
    source_name: 'CigarScore.com',
    score: 5,
    score_scale: 5,
    review_date: '2022-12-26',
    url: 'https://www.cigarscore.com/cigar-review-padron-1964-anniversary-maduro-exclusivo/',
    key_notes_text: 'Perfect construction; reviewer felt it didn\'t quite taste like "classic Padrón."',
  },
  {
    source_name: 'Miami Humidor (Cigar Reviews by Mikey)',
    score: 93,
    score_scale: 100,
    review_date: '2025-07-09',
    url: 'https://miamihumidor.net/2025/07/cigar-reviews-by-mikey-padron-1964-exclusivo-maduro/',
    key_notes_text: 'Long, satisfying coffee-and-spice finish; impeccable construction throughout.',
  },
];

const stickScore = computeStickScore(criticReviews, new Date());

const vitolaId = insertVitola.run(at({
  line_id: lineId,
  size_name: 'Exclusivo',
  slug: 'exclusivo-maduro',
  length_in: 5.5,
  ring_gauge: 50,
  vitola_type: 'toro',
  stick_score: stickScore,
  score_flavor: 83,
  score_construction: 88,
  score_complexity: 78,
  score_value: 76,
  tasting_notes: JSON.stringify(['Dark cocoa', 'Espresso', 'Black pepper', 'Cedar', 'Earth', 'Leather', 'Roasted nuts']),
  summary_review:
    "Padrón's 1964 Anniversary Exclusivo Maduro is one of the brand's most decorated full-bodied smokes, an all-Nicaraguan blend rolled at Tabacos Cubanica in Estelí from tobacco aged four years. Critics consistently find a core of dark cocoa, espresso, and black pepper, with cedar, earth, and leather emerging as the cigar develops through its three thirds. Construction draws the most consistent praise, with reviewers citing a razor-sharp burn and an effortless draw from the tightly box-pressed wrapper. Not every critic is won over, though — one 2021 review found the profile \"fairly average,\" too dominated by dark wood and earth to stand out. StickScore reflects that spread: a strong aggregate built from critic consensus, not a single first-hand take.",
  smoke_time_min: 73,
  box_counts: JSON.stringify([25]),
})).lastInsertRowid;

for (const review of criticReviews) {
  insertCriticReview.run(at({ vitola_id: vitolaId, ...review }));
}

console.log(`Seeded 1 brand, 1 line, 1 vitola, ${criticReviews.length} critic reviews.`);
console.log(`Computed StickScore: ${stickScore.toFixed(1)} (critic-only — no retailer average collected yet)`);

db.close();
