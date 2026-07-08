// DESTRUCTIVE — wipes and fully rebuilds data/cigars.db from the hardcoded
// catalog below. This is the initial-seed script only. It is NOT safe to run
// as part of nightly automation: it would erase all price history and any
// cigars added since this file was last edited. Nightly updates must use
// scripts/db-tools.mjs instead, which only ever appends/updates in place.
//
// Every fact and review below is sourced from a real, linked publication —
// see CLAUDE.md's "NEVER invent a score, a source, or a review" rule. Where
// fewer than 3 independent sources were found, stick_score is left null
// ("insufficient data") rather than guessed, and the cigar is written to
// data/review-queue.json.
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeStickScore, computeAccScore } from './lib/stickscore.mjs';
import { canon } from './lib/stickscore.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'cigars.db');
const schemaPath = path.join(__dirname, '..', 'data', 'schema.sql');
const queuePath = path.join(__dirname, '..', 'data', 'review-queue.json');

fs.rmSync(dbPath, { force: true });
const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON');
db.exec(fs.readFileSync(schemaPath, 'utf-8'));

// node:sqlite requires bound-parameter object keys to include the SQL sigil
// (e.g. "@name"), unlike better-sqlite3's bare-key convention.
function at(params) {
  return Object.fromEntries(Object.entries(params).map(([k, v]) => [`@${k}`, v]));
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
  INSERT INTO critic_review (vitola_id, source_name, source_type, score, score_scale, review_count, review_date, url, key_notes_text)
  VALUES (@vitola_id, @source_name, @source_type, @score, @score_scale, @review_count, @review_date, @url, @key_notes_text)
`);

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------
const brands = [
  {
    slug: 'padron',
    name: 'Padrón',
    country: 'Nicaragua',
    factory: 'Tabacos Cubanica S.A., Estelí, Nicaragua',
    founded_year: 1964,
    story_short:
      'Founded in Miami in 1964 by Cuban-born José O. Padrón, the family-owned Padrón Cigar Company has rolled its cigars in Estelí, Nicaragua for decades and is one of the most consistently awarded names in premium cigars.',
  },
  {
    slug: 'arturo-fuente',
    name: 'Arturo Fuente',
    country: 'Dominican Republic',
    factory: 'Tabacalera A. Fuente y Cia, Santiago, Dominican Republic',
    founded_year: 1912,
    story_short:
      'Founded in 1912 by Cuban émigré Arturo Fuente in West Tampa, Florida, the company was rebuilt by the Fuente family after a 1924 factory fire and later relocated production to the Dominican Republic, becoming one of cigars’ great family dynasties.',
  },
  {
    slug: 'oliva',
    name: 'Oliva Cigar Co.',
    country: 'Nicaragua',
    factory: 'Oliva Cigar Co. factory, Estelí, Nicaragua',
    founded_year: 1995,
    story_short:
      'Founded in 1995 by Gilberto Oliva Sr. and Jr., descendants of Melanio Oliva who began growing tobacco in Cuba’s Pinar del Río in 1886, the family rebuilt its business in Nicaragua after the Cuban Revolution and opened its own Estelí factory in 1996.',
  },
  {
    slug: 'my-father',
    name: 'My Father Cigars',
    country: 'Nicaragua',
    factory: 'My Father Cigars S.A., Estelí, Nicaragua',
    founded_year: 2002,
    story_short:
      'Founded by Cuban-born master torcedor Jose "Pepin" Garcia as El Rey de los Habanos in Miami in 2002, the company opened a second factory in Estelí, Nicaragua and was renamed My Father Cigars, with son Jaime Garcia developing its flagship blend in 2008.',
  },
  {
    slug: 'rocky-patel',
    name: 'Rocky Patel Premium Cigars',
    country: 'Honduras',
    factory: 'El Paraíso, Danlí, Honduras',
    founded_year: 1995,
    story_short:
      'Founded in 1995 as Indian Tabac Cigar Co. by former entertainment attorney Rakesh "Rocky" Patel, who partnered with Nestor Plasencia to grow and manufacture tobacco in Honduras; the company was renamed Rocky Patel Premium Cigars in 2006.',
  },
  {
    slug: 'drew-estate',
    name: 'Drew Estate',
    country: 'Nicaragua',
    factory: 'La Gran Fabrica Drew Estate, Estelí, Nicaragua',
    founded_year: 1995,
    story_short:
      'Founded in Brooklyn in 1995 by Jonathan Drew Sann and Marvin Samel, Drew Estate relocated production to Estelí, Nicaragua after Hurricane Mitch disrupted its tobacco supply in 1998, later building one of the largest cigar factories in the world there.',
  },
  {
    slug: 'aj-fernandez',
    name: 'AJ Fernandez',
    country: 'Nicaragua',
    factory: 'Tabacalera A.J. Fernandez, Estelí, Nicaragua',
    founded_year: 2005,
    story_short:
      'Abdel J. "A.J." Fernandez, a third-generation Cuban cigar maker, emigrated to Nicaragua in 2003 and founded his own Estelí factory in 2005; his grandfather Andrés Fernandez had made cigars in Cuba under the San Lotano name.',
  },
  {
    slug: 'davidoff',
    name: 'Davidoff',
    country: 'Dominican Republic',
    factory: 'Davidoff/Tabadom factory, Villa Gonzalez, Santiago, Dominican Republic',
    founded_year: 1911,
    story_short:
      'Henri Davidoff opened a Geneva tobacco shop in 1911, and his son Zino built the eponymous brand; since 1990-91 all Davidoff cigars have been handmade in the Dominican Republic in partnership with Hendrik Kelner’s Tabadom factory.',
  },
  {
    slug: 'romeo-y-julieta',
    name: 'Romeo y Julieta',
    country: 'Dominican Republic',
    factory: 'Tabacalera de García, La Romana, Dominican Republic (Altadis U.S.A.)',
    founded_year: 1875,
    story_short:
      'Founded in Havana in 1875 by Inocencio Álvarez and Manín García, the non-Cuban Romeo y Julieta sold in the U.S. is made today by Altadis U.S.A. at Tabacalera de García in the Dominican Republic — a separate company and product from the Cuban Habanos S.A. version.',
  },
  {
    slug: 'montecristo',
    name: 'Montecristo',
    country: 'Dominican Republic',
    factory: 'Tabacalera de Garcia, La Romana, Dominican Republic (Altadis U.S.A.)',
    founded_year: 1935,
    story_short:
      'Founded in Cuba in 1935 when Alonso Menéndez purchased the Particulares factory, the non-Cuban Montecristo sold in the U.S. moved production to La Romana, Dominican Republic in the mid-1970s and is made today by Altadis U.S.A. — entirely separate from the Cuban Habanos S.A. version.',
  },
];

// ---------------------------------------------------------------------------
// Cigars: one entry per line+vitola. `reviews` are exactly what was verified;
// `subScores`/`tastingNotes` are only authored where genuine sourced material
// supports them. `summaryReview` is original synthesis, at most one short
// (<15 word) attributed quote per source.
// ---------------------------------------------------------------------------
const cigars = [
  {
    brandSlug: 'padron',
    line: {
      name: '1964 Anniversary Series Maduro',
      slug: '1964-anniversary-maduro',
      wrapper: 'Nicaraguan Maduro',
      binder: 'Nicaraguan',
      filler: 'Nicaraguan',
      strength: 'full',
      release_year: 1994,
      background_text:
        "Introduced in 1994 to mark 30 years since the company's founding, the 1964 Anniversary Series is Padrón's flagship full-bodied line: box-pressed, built from tobacco aged four years, and offered across sixteen sizes in both sun-grown Natural and Maduro wrappers.",
    },
    vitola: {
      size_name: 'Exclusivo',
      slug: 'exclusivo-maduro',
      length_in: 5.5,
      ring_gauge: 50,
      vitola_type: 'toro',
      smoke_time_min: 73,
      box_counts: [25],
    },
    reviews: [
      {
        source_name: 'Cigar Aficionado',
        score: 94,
        score_scale: 100,
        review_date: '2012-01-01',
        url: 'https://www.cigaraficionado.com/ratings/15421/name/padron-1964-anniversary-series-exclusivo-maduro',
        key_notes_text: "Rated 94; ranked #5 on Cigar Aficionado's Top 25 Cigars of 2011.",
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
    ],
    subScores: { flavor: 83, construction: 88, complexity: 78, value: 76 },
    tastingNotes: ['Dark cocoa', 'Espresso', 'Black pepper', 'Cedar', 'Earth', 'Leather', 'Roasted nuts'],
    summaryReview:
      "Padrón's 1964 Anniversary Exclusivo Maduro is one of the brand's most decorated full-bodied smokes, an all-Nicaraguan blend rolled at Tabacos Cubanica in Estelí from tobacco aged four years. Critics consistently find a core of dark cocoa, espresso, and black pepper, with cedar, earth, and leather emerging as the cigar develops through its three thirds. Construction draws the most consistent praise, with reviewers citing a razor-sharp burn and an effortless draw from the tightly box-pressed wrapper. Not every critic is won over, though — one 2021 review found the profile \"fairly average,\" too dominated by dark wood and earth to stand out. StickScore reflects that spread: a strong aggregate built from critic consensus, not a single first-hand take.",
  },
  {
    brandSlug: 'padron',
    line: {
      name: '1926 Serie',
      slug: '1926-serie',
      wrapper: 'Nicaraguan Maduro',
      binder: 'Nicaraguan',
      filler: 'Nicaraguan',
      strength: 'medium',
      release_year: 2002,
      background_text:
        "Launched in 2002 to mark José O. Padrón's 75th birthday, the box-pressed 1926 Serie is built from tobacco aged a minimum of five years and ranks among Padrón's most consistently well-reviewed lines.",
    },
    vitola: {
      size_name: 'No. 35 Maduro',
      slug: 'no-35-maduro',
      length_in: 4.0,
      ring_gauge: 48,
      vitola_type: 'robusto',
      smoke_time_min: 35,
      box_counts: [],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 91, score_scale: 100, review_date: '2013-02-01', url: 'https://www.cigaraficionado.com/ratings/13115/name/padron-serie-1926-no-35', key_notes_text: 'Cedary and medium-bodied, with an even draw and burn.' },
      { source_name: 'Cigar Aficionado', score: 89, score_scale: 100, review_date: '2011-02-01', url: 'https://www.cigaraficionado.com/ratings/13115/name/padron-serie-1926-no-35', key_notes_text: 'An earlier Cigar Aficionado rating of the same 4x48 vitola.' },
      { source_name: 'Cigar Aficionado', score: 88, score_scale: 100, review_date: '2009-04-01', url: 'https://www.cigaraficionado.com/ratings/13115/name/padron-serie-1926-no-35', key_notes_text: 'One of four historical Cigar Aficionado scores logged for this vitola.' },
      { source_name: 'Cigar Aficionado', score: 91, score_scale: 100, review_date: '2007-10-01', url: 'https://www.cigaraficionado.com/ratings/13115/name/padron-serie-1926-no-35', key_notes_text: 'The earliest Cigar Aficionado score found for this vitola.' },
    ],
    subScores: null,
    tastingNotes: ['Cedar'],
    summaryReview:
      "Padrón's 1926 Serie No. 35 Maduro is a small-ring, box-pressed robusto from the line the company created in 2002 to mark José O. Padrón's 75th birthday, built from Nicaraguan tobacco aged at least five years. Cigar Aficionado has rated this vitola four times since 2007, consistently in the high 80s to low 90s, describing it as cedary and medium-bodied with a clean draw and burn. No independent outlet beyond Cigar Aficionado has published a numeric score for this specific size, so StickScore doesn't yet have the three independent sources it requires to publish an aggregate here.",
  },
  {
    brandSlug: 'arturo-fuente',
    line: {
      name: 'Arturo Fuente Hemingway',
      slug: 'hemingway',
      wrapper: 'Cameroon',
      binder: 'Dominican Republic',
      filler: 'Dominican Republic',
      strength: 'medium',
      release_year: 1983,
      background_text:
        'Introduced in 1983, the Hemingway line revived hand-rolled perfecto shapes using vintage molds Carlos Fuente Sr. tracked down, with Cameroon-wrapped Dominican tobacco blended by Carlos Fuente Jr. and named for the author.',
    },
    vitola: {
      size_name: 'Short Story',
      slug: 'short-story',
      length_in: 4.0,
      ring_gauge: 48,
      vitola_type: 'perfecto',
      smoke_time_min: null,
      box_counts: [25],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 90, score_scale: 100, review_date: '2025-02-01', url: 'https://www.cigaraficionado.com/ratings/23613/name/arturo-fuente-hemingway-short-story-figurado', key_notes_text: 'Notes of vanilla, brown sugar, and a sweet caramel finish.' },
      { source_name: 'CigarScore.com', score: 3, score_scale: 5, review_date: '2019-02-05', url: 'https://www.cigarscore.com/review-arturo-fuente-hemingway-short-story/', key_notes_text: 'A lighter, consistent, and smooth smoke at a modest price.' },
    ],
    subScores: null,
    tastingNotes: ['Vanilla', 'Brown sugar', 'Caramel'],
    summaryReview:
      "Arturo Fuente's Hemingway Short Story is a small Cameroon-wrapped perfecto from the line Carlos Fuente Sr. and Jr. introduced in 1983 to revive hand-rolled figurado shapes. The two independent reviews found describe a light, consistent smoke with vanilla, brown sugar, and caramel sweetness. That's short of the three independent sources StickScore requires to publish an aggregate, so none is shown yet.",
  },
  {
    brandSlug: 'arturo-fuente',
    line: {
      name: 'Fuente Fuente OpusX',
      slug: 'opusx',
      wrapper: 'Dominican Republic (Cuban-seed Corojo)',
      binder: 'Dominican Republic',
      filler: 'Dominican Republic',
      strength: 'full',
      release_year: 1995,
      background_text:
        "Debuting in 1995, OpusX was the first all-Dominican-grown ('puro') cigar, the result of Carlos Fuente Jr. planting Cuban-seed tobacco at the family's own Chateau de la Fuente after a retailer challenge to make an all-Dominican smoke.",
    },
    vitola: {
      size_name: 'Robusto',
      slug: 'robusto',
      length_in: 5.25,
      ring_gauge: 50,
      vitola_type: 'robusto',
      smoke_time_min: null,
      box_counts: [32],
    },
    reviews: [],
    subScores: null,
    tastingNotes: [],
    summaryReview:
      "Fuente Fuente OpusX is famous as the first all-Dominican-grown cigar, born in 1995 after Carlos Fuente Jr. planted Cuban-seed tobacco at the family's own Chateau de la Fuente estate. Despite its reputation, we couldn't verify a dated, sourced numeric review specifically for the standard Robusto vitola — most published scores cover its many limited variants instead. Rather than guess, this page carries no StickScore yet; it's in the review queue for follow-up.",
  },
  {
    brandSlug: 'arturo-fuente',
    line: {
      name: 'Arturo Fuente Añejo Reserva',
      slug: 'anejo-reserva',
      wrapper: 'Connecticut Broadleaf (Maduro)',
      binder: 'Dominican Republic',
      filler: 'Dominican Republic',
      strength: 'medium-full',
      release_year: 2000,
      background_text:
        'Created after Hurricane Georges damaged reserves of OpusX wrapper leaf in 1998, Añejo re-blends OpusX filler and binder under a dark, cognac-barrel-aged Connecticut Broadleaf wrapper, traditionally released in limited runs around the holidays.',
    },
    vitola: {
      size_name: 'No. 48',
      slug: 'no-48',
      length_in: 7.0,
      ring_gauge: 48,
      vitola_type: 'churchill',
      smoke_time_min: null,
      box_counts: [25],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 92, score_scale: 100, review_date: '2022-12-01', url: 'https://www.cigaraficionado.com/ratings/20187/name/arturo-fuente-anejo-reserva-no-48', key_notes_text: 'A woody, earthy smoke with toastiness and a menthol finish.' },
      { source_name: 'Cigar Aficionado', score: 93, score_scale: 100, review_date: '2024-02-01', url: 'https://www.cigaraficionado.com/ratings/20187/name/arturo-fuente-anejo-reserva-no-48', key_notes_text: 'A later re-rating of the same 7x48 vitola, medium-full strength.' },
      { source_name: 'Stogies on the Rocks', score: 92, score_scale: 100, review_date: '2013-04-30', url: 'https://www.stogiesontherocks.com/cigar-review/arturo-fuente-anejo-48/', key_notes_text: 'A medium-to-full-bodied cigar worth a repeat purchase.' },
    ],
    subScores: null,
    tastingNotes: ['Wood', 'Earth', 'Menthol'],
    summaryReview:
      "The Añejo No. 48 is a 7-inch Churchill from Arturo Fuente's dark, Connecticut-Broadleaf-wrapped Añejo Reserva line, created in 2000 to repurpose OpusX filler after a 1998 hurricane damaged wrapper stock. Reviews describe a woody, earthy profile with a touch of menthol, scoring in the low-to-mid 90s across the two independent sources found. That's one short of StickScore's three-source minimum, so no aggregate is published yet.",
  },
  {
    brandSlug: 'oliva',
    line: {
      name: 'Serie V Melanio',
      slug: 'serie-v-melanio',
      wrapper: 'Ecuadorian Sumatra',
      binder: 'Nicaraguan',
      filler: 'Nicaraguan',
      strength: 'medium',
      release_year: 2012,
      background_text:
        "Released in 2012 to honor family patriarch Melanio Oliva, the Serie V Melanio extends Oliva's flagship Serie V blend under an Ecuadorian Sumatra-seed wrapper; its figurado vitola was Cigar Aficionado's Cigar of the Year for 2014.",
    },
    vitola: {
      size_name: 'Robusto',
      slug: 'robusto',
      length_in: 5.0,
      ring_gauge: 52,
      vitola_type: 'robusto',
      smoke_time_min: null,
      box_counts: [10],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 94, score_scale: 100, review_date: '2017-01-01', url: 'https://www.cigaraficionado.com/ratings/19454/name/oliva-serie-v-melanio-robusto', key_notes_text: "Ranked #8 in CA's Top 25 of 2016; a silky, sweet smoke with toast and cedar." },
      { source_name: 'CigarScore.com', score: 4, score_scale: 5, review_date: '2020-06-28', url: 'https://www.cigarscore.com/cigar-review-oliva-serie-v-melanio-robusto/', key_notes_text: 'Praised draw and flavor, though the reviewer felt it could do better.' },
    ],
    subScores: null,
    tastingNotes: ['Toast', 'Cedar'],
    summaryReview:
      "Oliva's Serie V Melanio Robusto extends the brand's flagship Serie V blend under an Ecuadorian Sumatra wrapper, part of a line named for family patriarch Melanio Oliva and launched in 2012. The two independent reviews found describe a silky, sweet smoke with toast and cedar notes, scoring well but shy of StickScore's three-source threshold for an aggregate.",
  },
  {
    brandSlug: 'oliva',
    line: {
      name: 'Serie V Maduro',
      slug: 'serie-v-maduro',
      wrapper: 'Mexican San Andrés',
      binder: 'Nicaraguan',
      filler: 'Nicaraguan',
      strength: 'medium-full',
      release_year: 2010,
      background_text:
        'First released as a limited annual edition in 2010 and made a year-round regular in 2019, Serie V Maduro pairs Oliva’s bold, ligero-forward Serie V blend with a dark Mexican San Andrés wrapper.',
    },
    vitola: {
      size_name: 'Toro',
      slug: 'toro',
      length_in: 6.0,
      ring_gauge: 50,
      vitola_type: 'toro',
      smoke_time_min: 90,
      box_counts: [10],
    },
    reviews: [
      { source_name: 'The Cigar Authority', score: 94, score_scale: 100, review_date: '2019-07-18', url: 'https://thecigarauthority.com/oliva-serie-v-maduro-especial-toro-cigar-review/', key_notes_text: "Reviewed as the 'Maduro Especial' expression; praised construction at under $10." },
      { source_name: 'CigarScore.com', score: 5, score_scale: 5, review_date: '2021-06-20', url: 'https://www.cigarscore.com/cigar-review-oliva-serie-v-maduro-toro/', key_notes_text: 'Perfect construction over a smoke lasting nearly 90 minutes.' },
    ],
    subScores: null,
    tastingNotes: [],
    summaryReview:
      "Serie V Maduro pairs Oliva's bold, ligero-heavy Serie V blend with a dark Mexican San Andrés wrapper, first released as a limited edition in 2010 before becoming a year-round line in 2019. Both independent reviews found praised its construction and roughly 90-minute smoke time at an affordable price, but with only two sources located, StickScore doesn't yet have enough independent coverage to publish a score.",
  },
  {
    brandSlug: 'my-father',
    line: {
      name: 'Le Bijou 1922',
      slug: 'le-bijou-1922',
      wrapper: 'Nicaraguan (Cuban-seed Oscuro)',
      binder: 'Nicaraguan',
      filler: 'Nicaraguan',
      strength: 'medium-full',
      release_year: 2009,
      background_text:
        'Introduced in 2009 as Jose "Pepin" Garcia’s tribute to his father, born in 1922, Le Bijou 1922 is an all-Nicaraguan puro finished in a dark, Cuban-seed oscuro wrapper; its torpedo vitola was Cigar Aficionado’s Cigar of the Year for 2015.',
    },
    vitola: {
      size_name: 'Toro',
      slug: 'toro',
      length_in: 6.0,
      ring_gauge: 52,
      vitola_type: 'toro',
      smoke_time_min: null,
      box_counts: [23],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 90, score_scale: 100, review_date: '2021-10-01', url: 'https://www.cigaraficionado.com/rating/my-father-le-bijou-1922-toro', key_notes_text: 'Notes recall the smoky character of an Islay Scotch.' },
    ],
    subScores: null,
    tastingNotes: ['Smoky'],
    summaryReview:
      "Le Bijou 1922 is My Father's all-Nicaraguan tribute to founder Jose \"Pepin\" Garcia's father, released in 2009 under a dark, Cuban-seed oscuro wrapper. The one independent review found for this Toro size compared its smoky character to an Islay Scotch, but with only a single source located, there isn't yet enough independent coverage for a StickScore.",
  },
  {
    brandSlug: 'my-father',
    line: {
      name: 'Flor de las Antillas',
      slug: 'flor-de-las-antillas',
      wrapper: 'Nicaraguan (sun-grown)',
      binder: 'Nicaraguan (double binder)',
      filler: 'Nicaraguan',
      strength: 'medium-full',
      release_year: 2012,
      background_text:
        "Launched in May 2012 using My Father's signature double-binder construction, Flor de las Antillas is an all-Nicaraguan puro whose Toro vitola was named Cigar Aficionado's Cigar of the Year for 2012.",
    },
    vitola: {
      size_name: 'Toro',
      slug: 'toro',
      length_in: 6.0,
      ring_gauge: 52,
      vitola_type: 'toro',
      smoke_time_min: null,
      box_counts: [20],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 96, score_scale: 100, review_date: '2013-01-01', url: 'https://www.cigaraficionado.com/ratings/16207/name/flor-de-las-antillas-toro', key_notes_text: "Named CA's #1 Cigar of the Year for 2012; notes of nutmeg and white pepper." },
      { source_name: 'Cigar Dojo', score: 88, score_scale: 100, review_date: '2013-06-18', url: 'https://cigardojo.com/2013/06/flor-de-las-antillas-cigar-review/', key_notes_text: 'A good value around seven dollars, though it can need touch-ups.' },
    ],
    subScores: null,
    tastingNotes: ['Nutmeg', 'White pepper'],
    summaryReview:
      "Flor de las Antillas is one of My Father's flagship blends, an all-Nicaraguan puro built on the brand's double-binder construction and named Cigar Aficionado's Cigar of the Year for 2012. Reviews describe nutmeg and white pepper notes over a well-priced, generally well-constructed smoke, though scores range from the high 80s to the mid-90s across the two independent sources found — one short of StickScore's three-source minimum.",
  },
  {
    brandSlug: 'my-father',
    line: {
      name: 'My Father',
      slug: 'no-1',
      wrapper: 'Ecuadorian Habano',
      binder: 'Nicaraguan',
      filler: 'Nicaraguan',
      strength: 'medium-full',
      release_year: 2008,
      background_text:
        'Developed in 2008 by Jaime Garcia, son of Jose "Pepin" Garcia, this was the first cigar released under the family’s own name rather than made for outside clients, and was Cigar Aficionado’s #3 Cigar of the Year for 2009.',
    },
    vitola: {
      size_name: 'Robusto',
      slug: 'robusto',
      length_in: 5.25,
      ring_gauge: 52,
      vitola_type: 'robusto',
      smoke_time_min: null,
      box_counts: [23],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 94, score_scale: 100, review_date: '2009-01-01', url: 'https://www.cigaraficionado.com/top25cigar/my-father-no-1-2009', key_notes_text: "Named #3 Cigar of the Year 2009; only the review year is confirmed." },
      { source_name: 'Cigar Dojo', score: 90, score_scale: 100, review_date: '2012-09-26', url: 'https://cigardojo.com/2012/09/my-father-cigar-review/', key_notes_text: "Rated 'Top Shelf,' with flavor as its strongest component." },
    ],
    subScores: null,
    tastingNotes: [],
    summaryReview:
      "The original My Father blend was the first cigar the Garcia family released under its own name, developed by Jaime Garcia in 2008 and named Cigar Aficionado's #3 Cigar of the Year for 2009. Both independent reviews found rate it highly — 94 and 90 respectively — but with only two sources located, StickScore doesn't yet have the three independent reviews it requires to publish an aggregate.",
  },
  {
    brandSlug: 'rocky-patel',
    line: {
      name: 'Vintage 1990',
      slug: 'vintage-1990',
      wrapper: 'Honduran (aged Broadleaf)',
      binder: 'Nicaraguan',
      filler: 'Nicaraguan and Dominican',
      strength: 'mild-medium',
      release_year: null,
      background_text:
        "Reportedly the first cigar to carry Rocky Patel's name, Vintage 1990 is built from Honduran and Nicaraguan/Dominican tobaccos dated to the 1990 harvest, and was twice named to Cigar Aficionado's Top 25 Cigars of the Year.",
    },
    vitola: {
      size_name: 'Toro',
      slug: 'toro',
      length_in: 6.5,
      ring_gauge: 52,
      vitola_type: 'toro',
      smoke_time_min: null,
      box_counts: [20],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 89, score_scale: 100, review_date: '2010-08-01', url: 'https://www.cigaraficionado.com/ratings/14030/name/rocky-patel-vintage-1990-toro-tubo-toro', key_notes_text: 'A rustic wrapper over a cedary smoke that turns spicy and peppery.' },
      { source_name: 'StogieReview.com', score: 81, score_scale: 100, review_date: '2006-07-29', url: 'https://stogiereview.com/2006/07/29/rocky-patel-vintage-1990/', key_notes_text: 'Nutty and creamy through the middle, though it turned acrid near the end.' },
    ],
    subScores: null,
    tastingNotes: ['Cedar', 'Pepper', 'Nutty'],
    summaryReview:
      "Vintage 1990 is reportedly the first cigar Rocky Patel released under his own name, built from Honduran and Nicaraguan/Dominican tobacco dated to the 1990 harvest. Reviews describe a cedary, peppery smoke with nutty notes through the middle, though one found it turned acrid late — scores split between the high 80s and low 80s across the two independent sources found, short of StickScore's three-source minimum.",
  },
  {
    brandSlug: 'rocky-patel',
    line: {
      name: 'Decade',
      slug: 'decade',
      wrapper: 'Ecuadorian Sumatra',
      binder: 'Nicaraguan',
      filler: 'Nicaraguan',
      strength: 'medium-full',
      release_year: 2007,
      background_text:
        "Created in 2007 to mark Rocky Patel's first decade in the cigar business and rolled at Nestor Plasencia's El Paraíso factory, Decade was named to Cigar Aficionado's Top 25 Cigars of 2008 almost immediately after release.",
    },
    vitola: {
      size_name: 'Toro',
      slug: 'toro',
      length_in: 6.5,
      ring_gauge: 52,
      vitola_type: 'toro',
      smoke_time_min: null,
      box_counts: [20],
    },
    reviews: [
      { source_name: 'Cigar Insider (Cigar Aficionado)', score: 91, score_scale: 100, review_date: '2008-02-05', url: 'https://www.cigaraficionado.com/ratings/12371/name/rocky-patel-decade-toro-toro', key_notes_text: 'Box-pressed, with a cocoa aroma and flavors of nut, wood, and earth.' },
      { source_name: 'Cigar Aficionado', score: 90, score_scale: 100, review_date: '2011-10-01', url: 'https://www.cigaraficionado.com/ratings/15050/name/rocky-patel-decade-toro-toro', key_notes_text: 'An airy draw balanced by toast, dried citrus, cocoa, and tea.' },
      { source_name: 'CigarScore.com', score: 4, score_scale: 5, review_date: '2019-08-17', url: 'https://www.cigarscore.com/cigar-review-rocky-patel-decade-toro/', key_notes_text: 'Delicious flavor despite an uneven burn and a torn wrapper.' },
    ],
    subScores: null,
    tastingNotes: ['Cocoa', 'Wood', 'Citrus', 'Tea'],
    summaryReview:
      "Decade celebrates Rocky Patel's first ten years in the business, launched in 2007 and rolled at Nestor Plasencia's El Paraíso factory in Honduras. Critics describe a cocoa-forward smoke with notes of wood, dried citrus, and tea, scoring consistently in the high 80s to low 90s — though with Cigar Aficionado and CigarScore.com as the only two independent outlets found (Cigar Insider shares Cigar Aficionado's ratings desk), it's one short of StickScore's minimum.",
  },
  {
    brandSlug: 'drew-estate',
    line: {
      name: 'Liga Privada No. 9',
      slug: 'liga-privada-no-9',
      wrapper: 'Connecticut Broadleaf (Oscuro)',
      binder: 'Brazilian Mata Fina',
      filler: 'Honduran and Nicaraguan',
      strength: 'full',
      release_year: 2006,
      background_text:
        'Liga Privada No. 9 began as a blend Drew Estate rolled privately for company executives and guests before demand pushed it to public release, making it one of the brand’s flagship full-bodied lines.',
    },
    vitola: {
      size_name: 'Toro',
      slug: 'toro',
      length_in: 6.0,
      ring_gauge: 52,
      vitola_type: 'toro',
      smoke_time_min: null,
      box_counts: [24],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 89, score_scale: 100, review_date: '2017-06-01', url: 'https://www.cigaraficionado.com/ratings/19478/name/liga-privada-no-9-toro-oscuro-tubo-toro', key_notes_text: 'A woody, spicy smoke with plenty of earth and an herbal finish.' },
      { source_name: 'Cigar Dojo', score: 91, score_scale: 100, review_date: '2012-06-25', url: 'https://cigardojo.com/2012/06/liga-privada-no-9/', key_notes_text: "Rated 'Top Shelf,' with rich nut and spice over a creamy, peppery background." },
    ],
    subScores: null,
    tastingNotes: ['Wood', 'Spice', 'Earth', 'Nut'],
    summaryReview:
      "Liga Privada No. 9 began life as a blend Drew Estate rolled only for its own staff and guests before public demand won out, and it remains one of the brand's flagship full-strength lines. Reviews describe a woody, spicy profile with earth, nut, and herbal notes, scoring in the high 80s to low 90s across the two independent sources found — short of StickScore's three-source minimum.",
  },
  {
    brandSlug: 'drew-estate',
    line: {
      name: 'Undercrown Maduro',
      slug: 'undercrown-maduro',
      wrapper: 'Mexican San Andrés',
      binder: 'Connecticut River Valley (stalk-cut Habano-seed)',
      filler: 'Nicaraguan and Brazilian Mata Fina',
      strength: 'medium-full',
      release_year: 2011,
      background_text:
        "Undercrown was created in 2011 after Drew Estate's own torcedores took a liking to smoking Liga Privada, prompting a separate blend for the factory floor; its Maduro expression, wrapped in dark Mexican San Andrés leaf, became the line's flagship.",
    },
    vitola: {
      size_name: 'Gran Toro',
      slug: 'toro',
      length_in: 6.0,
      ring_gauge: 52,
      vitola_type: 'toro',
      smoke_time_min: null,
      box_counts: [25],
    },
    reviews: [
      { source_name: 'Stogie Guys', score: 4, score_scale: 5, review_date: '2011-08-24', url: 'https://www.stogieguys.com/2011/08/08242011-cigar-review-drew-estate-undercrown-gran-toro.html', key_notes_text: 'Toasty and nutty with coffee bean, and consistently perfect construction.' },
      { source_name: 'CigarScore.com', score: 2, score_scale: 5, review_date: '2019-06-02', url: 'https://www.cigarscore.com/cigar-review-drew-estate-undercrown-maduro-gran-toro/', key_notes_text: 'Good flavor undermined by a badly restrictive draw.' },
    ],
    subScores: null,
    tastingNotes: ['Toast', 'Nut', 'Coffee'],
    summaryReview:
      "Undercrown Maduro grew out of Drew Estate's own factory floor, created in 2011 after the company's rollers took a liking to smoking Liga Privada and needed a separate blend of their own. Its dark Mexican San Andrés wrapper produces a toasty, nutty profile with coffee notes, though the two independent reviews found disagree sharply on construction — one praising a perfect draw, the other calling it badly restrictive. That split, and having only two sources, keeps this below StickScore's three-source minimum.",
  },
  {
    brandSlug: 'drew-estate',
    line: {
      name: 'Liga Privada T52',
      slug: 'liga-privada-t52',
      wrapper: 'Connecticut River Valley (stalk-cut Habano, sun-grown)',
      binder: 'Brazilian Mata Fina',
      filler: 'Nicaraguan and Honduran',
      strength: 'medium-full',
      release_year: 2009,
      background_text:
        'T52 debuted in 2009 as an expansion of the Liga Privada line, built around an unusually thick, stalk-cut Habano wrapper fermented for 30 to 36 months — longer than any other Liga Privada blend.',
    },
    vitola: {
      size_name: 'Toro',
      slug: 'toro',
      length_in: 6.0,
      ring_gauge: 52,
      vitola_type: 'toro',
      smoke_time_min: null,
      box_counts: [24],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 90, score_scale: 100, review_date: '2017-10-01', url: 'https://www.cigaraficionado.com/ratings/19759/name/liga-privada-t52-toro-toro', key_notes_text: 'An oaky, leathery smoke with malted chocolate, toast, and a lush draw.' },
    ],
    subScores: null,
    tastingNotes: ['Oak', 'Leather', 'Chocolate'],
    summaryReview:
      "T52 expanded the Liga Privada line in 2009 around an unusually thick, stalk-cut Habano wrapper fermented far longer than Drew Estate's other blends. The one independent review found for this Toro size describes an oaky, leathery smoke with malted chocolate and toast over a lush draw, but a single source isn't enough for StickScore to publish an aggregate.",
  },
  {
    brandSlug: 'aj-fernandez',
    line: {
      name: 'New World',
      slug: 'new-world',
      wrapper: 'Nicaraguan (Habano Rosado)',
      binder: 'Nicaraguan',
      filler: 'Nicaraguan',
      strength: 'medium-full',
      release_year: 2014,
      background_text:
        "Introduced in 2014 as a widely available, value-priced Nicaraguan puro blended from tobacco grown across several regions of the country, New World became one of AJ Fernandez's best-selling everyday lines.",
    },
    vitola: {
      size_name: 'Toro',
      slug: 'toro',
      length_in: 6.5,
      ring_gauge: 55,
      vitola_type: 'toro',
      smoke_time_min: null,
      box_counts: [],
    },
    reviews: [
      { source_name: 'Cigar Coop', score: 92, score_scale: 100, review_date: '2014-08-01', url: 'https://cigar-coop.com/2014/08/cigar-review-aj-fernandez-new-world-2.html', key_notes_text: "Rated 'Box Worthy'; medium-to-full in body and strength." },
      { source_name: 'CigarScore.com', score: 4, score_scale: 5, review_date: '2019-08-15', url: 'https://www.cigarscore.com/cigar-review-new-world-toro-by-aj-fernandez/', key_notes_text: 'A confirmed 4 out of 5 for this 6.5x55 Nicaraguan puro.' },
    ],
    subScores: null,
    tastingNotes: [],
    summaryReview:
      "New World is AJ Fernandez's widely available, value-priced Nicaraguan puro, introduced in 2014 and blended from tobacco grown across several regions of the country. The two independent reviews found rate it solidly in the high 80s to low 90s for a medium-to-full-bodied smoke, but that's short of the three sources StickScore requires before publishing an aggregate.",
  },
  {
    brandSlug: 'aj-fernandez',
    line: {
      name: 'San Lotano Requiem',
      slug: 'san-lotano-requiem',
      wrapper: 'Brazilian (Habano seed)',
      binder: 'Nicaraguan',
      filler: 'Nicaraguan and Honduran',
      strength: 'medium-full',
      release_year: null,
      background_text:
        'San Lotano is AJ Fernandez’s tribute to his grandfather Andrés Fernandez’s original Cuban cigar name; the Requiem series is rolled at the dedicated San Lotano factory in Totogalpa, Nicaragua, which AJ Fernandez reopened in January 2017.',
    },
    vitola: {
      size_name: 'Toro',
      slug: 'toro',
      length_in: 6.0,
      ring_gauge: 54,
      vitola_type: 'toro',
      smoke_time_min: null,
      box_counts: [],
    },
    reviews: [],
    subScores: null,
    tastingNotes: [],
    summaryReview:
      "San Lotano Requiem is AJ Fernandez's tribute to his grandfather Andrés Fernandez's original Cuban cigar name, rolled at the dedicated San Lotano factory in Totogalpa, Nicaragua. We could only verify a numeric critic score for a different vitola of this same blend (the 6x60 Gordo Grande), not this 6x54 Toro, so rather than misattribute it, this page carries no reviews or score yet — it's in the review queue for follow-up.",
  },
  {
    brandSlug: 'davidoff',
    line: {
      name: 'Davidoff Nicaragua',
      slug: 'nicaragua',
      wrapper: 'Nicaraguan (10-year-aged Habano Rosado)',
      binder: 'Nicaraguan (Jalapa)',
      filler: 'Nicaraguan (Condega, Estelí Ligero, Ometepe)',
      strength: 'medium-full',
      release_year: 2013,
      background_text:
        "Released in 2013, Davidoff Nicaragua was the brand's first line built entirely from Nicaraguan-grown tobacco, imported to the Dominican Republic and rolled under Davidoff's standard construction and quality control.",
    },
    vitola: {
      size_name: 'Toro',
      slug: 'toro',
      length_in: 5.5,
      ring_gauge: 54,
      vitola_type: 'toro',
      smoke_time_min: null,
      box_counts: [],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 95, score_scale: 100, review_date: '2014-01-01', url: 'https://www.cigaraficionado.com/ratings/16971/name/davidoff-nicaragua-toro-toro', key_notes_text: "Ranked #3 in Cigar Aficionado's Top 25 of 2013; praised for complexity and balance." },
      { source_name: 'CigarScore.com', score: 4, score_scale: 5, review_date: '2020-05-31', url: 'https://www.cigarscore.com/cigar-review-davidoff-nicaragua-toro/', key_notes_text: 'A good cigar overall, with minor construction and value concerns.' },
    ],
    subScores: null,
    tastingNotes: ['Complexity', 'Balance'],
    summaryReview:
      "Davidoff Nicaragua was the brand's first line built entirely from Nicaraguan tobacco, released in 2013 and rolled at Davidoff's Dominican factory under the company's usual exacting standards. Cigar Aficionado ranked it third in its Top 25 of 2013, praising its complexity, elegance, and balance, while an independent retailer review was more measured about construction and value. With only two sources found, StickScore doesn't yet have enough independent coverage for an aggregate.",
  },
  {
    brandSlug: 'davidoff',
    line: {
      name: 'Davidoff Yamasá',
      slug: 'yamasa',
      wrapper: 'Dominican (Yamasá-grown, San Vicente seed)',
      binder: 'Dominican (San Vicente, Yamasá)',
      filler: 'Nicaraguan (Condega, Estelí) and Dominican (Piloto, Mejorado)',
      strength: 'medium-full',
      release_year: 2016,
      background_text:
        'Launched in 2016 and blended by longtime Davidoff master blender Hendrik Kelner, Yamasá is built around wrapper and binder tobacco grown on a single Dominican estate in the Yamasá region, paired with Nicaraguan filler to showcase that terroir.',
    },
    vitola: {
      size_name: 'Toro',
      slug: 'toro',
      length_in: 6.0,
      ring_gauge: 52,
      vitola_type: 'toro',
      smoke_time_min: null,
      box_counts: [],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 86, score_scale: 100, review_date: '2016-09-20', url: 'https://www.cigaraficionado.com/ratings/19187/name/davidoff-yamasa-toro-toro', key_notes_text: 'Rated via Cigar Insider at a price of $22.70.' },
      { source_name: "Blind Man's Puff", score: 90, score_scale: 100, review_date: '2016-10-12', url: 'https://blindmanspuff.com/blind-cigar-review-davidoff-yamasa-toro/', key_notes_text: "Rated 'Very Good'; blended by Hendrik Kelner at Tabadom." },
      { source_name: 'Cigar Reviews by the Katman', score: 75, score_scale: 100, review_date: '2016-10-16', url: 'https://kohnhed.com/2016/10/16/davidoff-yamasa-cigar-reviews-by-the-katman/', key_notes_text: 'A decent smoke for the price, though value was questioned.' },
    ],
    subScores: { flavor: 78, construction: 82, complexity: 80, value: 68 },
    tastingNotes: ['Peppery finish'],
    summaryReview:
      "Davidoff Yamasá is built around wrapper and binder tobacco grown on a single Dominican estate in the Yamasá region, blended by longtime master blender Hendrik Kelner since the line's 2016 debut to showcase that terroir alongside Nicaraguan filler. The three independent reviews found span a wide range — from a lukewarm 75 to a strong 90 — with at least one critic flagging a peppery, occasionally hot finish as a detractor and questioning value at its roughly $20 price. StickScore's aggregate settles in the low 80s, reflecting that real disagreement rather than smoothing it away.",
  },
  {
    brandSlug: 'romeo-y-julieta',
    line: {
      name: 'Romeo y Julieta Reserva Real',
      slug: 'reserva-real',
      wrapper: 'Ecuadorian Connecticut shade',
      binder: 'Nicaraguan',
      filler: 'Dominican and Nicaraguan',
      strength: 'mild-medium',
      release_year: null,
      background_text:
        'Reserva Real blends aged Dominican long-filler with Nicaraguan tobacco under an Ecuadorian Connecticut-shade wrapper, positioned by Altadis U.S.A. as a creamy, approachable everyday-luxury entry in the Romeo y Julieta lineup.',
    },
    vitola: {
      size_name: 'Toro',
      slug: 'toro',
      length_in: 6.0,
      ring_gauge: 54,
      vitola_type: 'toro',
      smoke_time_min: null,
      box_counts: [25],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 89, score_scale: 100, review_date: '2011-08-01', url: 'https://www.cigaraficionado.com/ratings/14921/name/romeo-y-julieta-reserva-real-gran-toro-toro', key_notes_text: 'A creamy smoke, toasty and woody with an oaky edge at times.' },
    ],
    subScores: null,
    tastingNotes: ['Cream', 'Toast', 'Oak'],
    summaryReview:
      "Reserva Real blends aged Dominican filler with Nicaraguan tobacco under an Ecuadorian Connecticut-shade wrapper, positioned as a creamy, approachable everyday-luxury smoke within the Romeo y Julieta lineup. The one independent review found describes a toasty, woody profile with an oaky edge, but a single source isn't enough for StickScore to publish an aggregate. (A separate, differently-scored 'Reserva Real Nicaragua' is a distinct blend made at a different factory — not to be confused with this one.)",
  },
  {
    brandSlug: 'romeo-y-julieta',
    line: {
      name: 'Romeo y Julieta 1875',
      slug: '1875',
      wrapper: 'Indonesian (shade-grown)',
      binder: 'Dominican Republic',
      filler: 'Dominican Republic',
      strength: 'medium',
      release_year: null,
      background_text:
        "Introduced by Altadis U.S.A. to commemorate Romeo y Julieta's founding year, this Dominican-made line uses an Indonesian wrapper over Dominican binder and filler; the Bully is its best-selling vitola.",
    },
    vitola: {
      size_name: 'Bully',
      slug: 'bully',
      length_in: 5.0,
      ring_gauge: 50,
      vitola_type: 'robusto',
      smoke_time_min: null,
      box_counts: [25],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 86, score_scale: 100, review_date: '2000-02-01', url: 'https://www.cigaraficionado.com/ratings/4547/name/romeo-y-julieta-1875-bully-robusto', key_notes_text: 'A firm, dark cigar, slightly uneven in color, with sharp cedar notes.' },
      { source_name: 'Cigar Aficionado', score: 86, score_scale: 100, review_date: '2001-08-01', url: 'https://www.cigaraficionado.com/ratings/4547/name/romeo-y-julieta-1875-bully-robusto', key_notes_text: 'The same 5x50 robusto re-rated the following year.' },
      { source_name: 'Cigar Aficionado', score: 85, score_scale: 100, review_date: '2002-08-01', url: 'https://www.cigaraficionado.com/ratings/4547/name/romeo-y-julieta-1875-bully-robusto', key_notes_text: 'Flavor faded midway through despite a good draw.' },
    ],
    subScores: null,
    tastingNotes: ['Cedar'],
    summaryReview:
      "The 1875 Bully is Romeo y Julieta's best-selling vitola, a 5x50 robusto wrapped in Indonesian leaf over Dominican binder and filler. Cigar Aficionado has rated it three times, consistently in the mid-80s, noting sharp cedar notes though flavor fading partway through in its most recent look. No independent outlet beyond Cigar Aficionado has published a score for this vitola, so it's short of StickScore's three-source minimum.",
  },
  {
    brandSlug: 'romeo-y-julieta',
    line: {
      name: 'Romeo Añejo',
      slug: 'anejo',
      wrapper: 'Connecticut Broadleaf',
      binder: 'Dominican (aged Olor)',
      filler: 'Nicaraguan and Honduran',
      strength: 'medium-full',
      release_year: 2015,
      background_text:
        "Launched in 2015 as a bolder, darker alternative to the classic Romeo y Julieta blend, Romeo Añejo pairs a dark Connecticut Broadleaf wrapper with vintage-dated Dominican, Nicaraguan, and Honduran tobacco. (Not to be confused with the Cuban Habanos S.A. 'Romeo y Julieta Añejados' line, a separate product.)",
    },
    vitola: {
      size_name: 'Piramide',
      slug: 'piramide',
      length_in: 6.125,
      ring_gauge: 52,
      vitola_type: 'figurado',
      smoke_time_min: null,
      box_counts: [],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 88, score_scale: 100, review_date: '2015-08-01', url: 'https://www.cigaraficionado.com/ratings/18057/name/romeo-anejo-by-romeo-y-julieta-piramide', key_notes_text: 'A dark, toothy torpedo with a lush draw and even burn, though the finish runs sweet.' },
    ],
    subScores: null,
    tastingNotes: ['Sweet finish'],
    summaryReview:
      "Romeo Añejo is a bolder, darker alternative to the classic Romeo y Julieta blend, launched in 2015 under a dark Connecticut Broadleaf wrapper over vintage-dated Dominican, Nicaraguan, and Honduran tobacco. The one independent review found for this Piramide vitola describes a lush draw and even burn, though the finish ran excessively sweet — with only one source located, StickScore doesn't yet have enough coverage for an aggregate.",
  },
  {
    brandSlug: 'montecristo',
    line: {
      name: 'Montecristo White Series',
      slug: 'white-series',
      wrapper: 'Ecuadorian Connecticut shade',
      binder: 'Nicaraguan',
      filler: 'Dominican and Nicaraguan',
      strength: 'mild-medium',
      release_year: 2007,
      background_text:
        'Debuting in 2007, the White Series (also sold as White Label) is a mild, Connecticut-shade-wrapped extension of Montecristo made at Tabacalera de Garcia; it became one of the brand’s best-selling lines.',
    },
    vitola: {
      size_name: 'Toro',
      slug: 'toro',
      length_in: 6.0,
      ring_gauge: 54,
      vitola_type: 'toro',
      smoke_time_min: null,
      box_counts: [27],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 88, score_scale: 100, review_date: '2012-06-01', url: 'https://www.cigaraficionado.com/ratings/15552/name/montecristo-white-toro-toro', key_notes_text: 'A creamy, mild-to-medium smoke with touches of cinnamon spice.' },
      { source_name: 'Cigar Insider (Cigar Aficionado)', score: 89, score_scale: 100, review_date: '2004-01-01', url: 'https://www.cigaraficionado.com/ratings/15552/name/montecristo-white-toro-toro', key_notes_text: 'An earlier Cigar Insider score for the same Toro vitola.' },
      { source_name: 'The Cigar Authority', score: 89.78, score_scale: 100, review_date: '2026-06-11', url: 'https://thecigarauthority.com/montecristo-white-series-toro-cigar-review/', key_notes_text: 'Scored 89.78 out of 100, with strength on the lower end.' },
    ],
    subScores: null,
    tastingNotes: ['Cream', 'Cinnamon'],
    summaryReview:
      "Montecristo White Series is a mild, Connecticut-shade-wrapped extension of the brand debuting in 2007 and made at Tabacalera de Garcia in the Dominican Republic. Reviews describe a creamy, mild-to-medium smoke with cinnamon spice, scoring consistently in the high 80s across the sources found — but with Cigar Aficionado (whose ratings desk also publishes as Cigar Insider) and The Cigar Authority as the only two independent outlets located, it's one short of StickScore's three-source minimum.",
  },
  {
    brandSlug: 'montecristo',
    line: {
      name: 'Montecristo Epic',
      slug: 'montecristo-epic',
      wrapper: 'Ecuadorian Habano',
      binder: 'Nicaraguan',
      filler: 'Nicaraguan and Dominican',
      strength: 'medium',
      release_year: 2012,
      background_text:
        "Launched in 2012 as a richer departure from Montecristo's traditionally mild reputation, Epic was blended by the company's Grupo de Maestros using vintage-dated Nicaraguan and Dominican tobacco.",
    },
    vitola: {
      size_name: 'Toro',
      slug: 'toro',
      length_in: 6.0,
      ring_gauge: 52,
      vitola_type: 'toro',
      smoke_time_min: null,
      box_counts: [],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 88, score_scale: 100, review_date: '2013-06-01', url: 'https://www.cigaraficionado.com/ratings/16323/name/montecristo-epic-toro-toro', key_notes_text: 'A toasty, woody smoke with tangy cedar and hickory touches.' },
      { source_name: 'Cigar Insider (Cigar Aficionado)', score: 88, score_scale: 100, review_date: '2013-01-29', url: 'https://www.cigaraficionado.com/ratings/16323/name/montecristo-epic-toro-toro', key_notes_text: 'An earlier Cigar Insider score matching the later Cigar Aficionado rating.' },
    ],
    subScores: null,
    tastingNotes: ['Toast', 'Wood', 'Cedar', 'Hickory'],
    summaryReview:
      "Epic marked a richer departure from Montecristo's traditionally mild reputation, launched in 2012 and blended from vintage-dated Nicaraguan and Dominican tobacco. Cigar Aficionado has rated this Toro vitola twice, both times at 88, describing a toasty, woody smoke with tangy cedar and hickory touches. No independent outlet beyond Cigar Aficionado has published a score, so it's short of StickScore's three-source minimum.",
  },
  {
    brandSlug: 'montecristo',
    line: {
      name: 'Montecristo Classic',
      slug: 'classic',
      wrapper: 'Connecticut Shade',
      binder: 'Dominican Republic',
      filler: 'Dominican Republic',
      strength: 'mild-medium',
      release_year: null,
      background_text:
        "The Classic line is the direct Dominican descendant of the original 1935 Montecristo blend, moved to Tabacalera de Garcia in the mid-1970s after the brand's Cuban assets were nationalized; the No. 2 recreates the iconic torpedo shape under a milder Connecticut wrapper. (Not to be confused with the original Cuban Habanos S.A. Montecristo No. 2, a separate product made in Havana.)",
    },
    vitola: {
      size_name: 'No. 2 Torpedo',
      slug: 'no-2-torpedo',
      length_in: 6.125,
      ring_gauge: 52,
      vitola_type: 'torpedo',
      smoke_time_min: null,
      box_counts: [20, 25],
    },
    reviews: [
      { source_name: 'Cigar Aficionado', score: 89, score_scale: 100, review_date: '2022-04-01', url: 'https://www.cigaraficionado.com/ratings/23517/name/montecristo-classic-especial-no-2-figurado', key_notes_text: 'As mild as it looks, with peanut, floral hints, and dry wood.' },
    ],
    subScores: null,
    tastingNotes: ['Peanut', 'Floral', 'Dry wood'],
    summaryReview:
      "Montecristo Classic No. 2 recreates the brand's iconic torpedo shape under a milder Connecticut wrapper, the direct Dominican descendant of the original 1935 blend after Cuban assets were nationalized in the mid-1970s. The one independent review found describes it as mild, with peanut, floral, and dry wood notes — but a single source isn't enough for StickScore to publish an aggregate. (This is the non-Cuban, Altadis-made version; the original Cuban Habanos S.A. Montecristo No. 2 is a separate product.)",
  },
];

// ---------------------------------------------------------------------------
// Insert everything
// ---------------------------------------------------------------------------
const brandIdBySlug = new Map();
for (const b of brands) {
  const id = insertBrand.run(at(b)).lastInsertRowid;
  brandIdBySlug.set(b.slug, id);
}

const now = new Date();
const queueItems = [];
let totalReviews = 0;
let scoredCount = 0;

for (const cigar of cigars) {
  const brandId = brandIdBySlug.get(cigar.brandSlug);
  const lineId = insertLine.run(at({ brand_id: brandId, ...cigar.line })).lastInsertRowid;

  const stickScore = computeStickScore(cigar.reviews, now);
  const sub = cigar.subScores ?? { flavor: null, construction: null, complexity: null, value: null };

  const vitolaId = insertVitola.run(at({
    line_id: lineId,
    size_name: cigar.vitola.size_name,
    slug: cigar.vitola.slug,
    length_in: cigar.vitola.length_in,
    ring_gauge: cigar.vitola.ring_gauge,
    vitola_type: cigar.vitola.vitola_type,
    stick_score: stickScore,
    score_flavor: sub.flavor,
    score_construction: sub.construction,
    score_complexity: sub.complexity,
    score_value: sub.value,
    tasting_notes: JSON.stringify(cigar.tastingNotes),
    summary_review: cigar.summaryReview,
    smoke_time_min: cigar.vitola.smoke_time_min,
    box_counts: JSON.stringify(cigar.vitola.box_counts),
  })).lastInsertRowid;

  for (const review of cigar.reviews) {
    insertCriticReview.run(at({
      vitola_id: vitolaId,
      source_name: review.source_name,
      source_type: 'critic',
      score: review.score,
      score_scale: review.score_scale,
      review_count: null,
      review_date: review.review_date,
      url: review.url,
      key_notes_text: review.key_notes_text,
    }));
    totalReviews++;
  }

  if (stickScore != null) {
    scoredCount++;
  } else {
    const distinctSources = [...new Set(cigar.reviews.map((r) => canon(r.source_name)))];
    queueItems.push({
      item: `${cigar.line.name} ${cigar.vitola.size_name}`,
      path: `/cigars/${cigar.brandSlug}/${cigar.line.slug}/${cigar.vitola.slug}/`,
      reason: 'insufficient_sources',
      why_flagged: `Only ${distinctSources.length} independent source${distinctSources.length === 1 ? '' : 's'} found (StickScore requires 3).`,
      sources_found: distinctSources,
      proposed_action:
        'Search halfwheel, Cigar Coop, Cigar Snob, Cigar Dojo, and retailer user-rating averages for additional independent coverage of this exact vitola.',
      decision: null,
    });
  }
}

fs.writeFileSync(queuePath, JSON.stringify(queueItems, null, 2) + '\n');

console.log(`Seeded ${brands.length} brands, ${cigars.length} cigars, ${totalReviews} critic reviews.`);
console.log(`${scoredCount} of ${cigars.length} cigars cleared the 3-independent-source minimum for a StickScore.`);
console.log(`${queueItems.length} cigars written to data/review-queue.json (insufficient data).`);

// ---------------------------------------------------------------------------
// Accessories Expansion (non-tobacco) — Phase A: one real, well-sourced sample
// ---------------------------------------------------------------------------
const insertAccessoryCategory = db.prepare(`
  INSERT INTO accessory_category (name, slug) VALUES (@name, @slug)
`);

const insertAccessory = db.prepare(`
  INSERT INTO accessory (category_id, brand, model, slug, specs, acc_score, summary_review, pros, cons)
  VALUES (@category_id, @brand, @model, @slug, @specs, @acc_score, @summary_review, @pros, @cons)
`);

const insertAccessoryReview = db.prepare(`
  INSERT INTO accessory_review (accessory_id, source_name, source_type, score, score_scale, review_date, url, key_notes_text)
  VALUES (@accessory_id, @source_name, @source_type, @score, @score_scale, @review_date, @url, @key_notes_text)
`);

// All 9 categories exist from day one (even empty ones) so /accessories/ shows
// the full shape of what's coming, same as how the cigar catalog started at 1.
const accessoryCategories = [
  { name: 'Humidors', slug: 'humidors' },
  { name: 'Torch Lighters', slug: 'torch-lighters' },
  { name: 'Soft-Flame Lighters', slug: 'soft-flame-lighters' },
  { name: 'Cutters', slug: 'cutters' },
  { name: 'Ashtrays', slug: 'ashtrays' },
  { name: 'Hygrometers', slug: 'hygrometers' },
  { name: 'Humidification Systems', slug: 'humidification-systems' },
  { name: 'Travel Cases', slug: 'travel-cases' },
  { name: 'Cigar Journals & Stands', slug: 'journals-stands' },
];

const accessoryCategoryIdBySlug = new Map();
for (const c of accessoryCategories) {
  const id = insertAccessoryCategory.run(at(c)).lastInsertRowid;
  accessoryCategoryIdBySlug.set(c.slug, id);
}

const accessoryReviews = [
  {
    source_name: 'Bespoke Unit',
    source_type: 'critic',
    score: 5,
    score_scale: 5,
    review_date: '2025-08-28',
    url: 'https://bespokeunit.com/articles/cigars/case-elegance-humidor/',
    key_notes_text: 'Rated 5 out of 5; called it well-constructed with a "confidence-inspiring" feel.',
  },
  {
    source_name: "Case Elegance (brand site's own verified-buyer reviews)",
    source_type: 'community',
    score: 4.9,
    score_scale: 5,
    review_date: '2026-07-08',
    url: 'https://caseelegance.com/products/glass-top-cedar-humidor-with-front-digital-hygrometer',
    key_notes_text: '4.9 out of 5 across 309 verified-buyer reviews on the maker\'s own storefront.',
  },
  {
    source_name: 'Etsy (verified-buyer reviews)',
    source_type: 'community',
    score: 4.9,
    score_scale: 5,
    review_date: '2026-07-08',
    url: 'https://www.etsy.com/listing/1819031675/case-elegance-glass-top-humidor-with',
    key_notes_text: '4.9 out of 5 across roughly 8,100 verified-buyer reviews.',
  },
];

const accScore = computeAccScore(accessoryReviews, new Date());

const humidorId = insertAccessory.run(at({
  category_id: accessoryCategoryIdBySlug.get('humidors'),
  brand: 'Case Elegance',
  model: 'Renzo Glass Top Humidor',
  slug: 'case-elegance-renzo',
  specs: JSON.stringify({
    capacity: '18-60 cigars depending on vitola (roughly 46-50 Coronas)',
    material: 'Spanish cedar interior (5mm), walnut-finish wood exterior, tempered glass top',
    dimensions: '8.5"W x 9"D x 5.4"H',
    humidification_system: 'Hydro System (tray, two solution bottles, gel crystals)',
    hygrometer: 'Pre-calibrated digital hygrometer with thermometer',
    warranty: 'Manufacturer warranty, registerable on Case Elegance\'s site (specific terms not published)',
  }),
  acc_score: accScore,
  summary_review:
    'The Case Elegance Renzo is one of the most consistently recommended first humidors for beginners, prized for a glass top that lets owners check their collection without breaking the seal, a magnetic closure, and a low-maintenance Hydro System that removes most of the guesswork from seasoning and humidity control. Reviewers and owners alike rate it very highly — Bespoke Unit gave it a full 5 out of 5, and real verified-buyer ratings on both the maker\'s own site and Etsy sit at 4.9 out of 5 across thousands of purchases. The most common complaints are minor: no lock, a glass lid that needs to stay out of direct sun, and no passive ventilation, so it needs a monthly manual opening for air exchange. AccScore reflects that near-universal enthusiasm.',
  pros: JSON.stringify([
    'Glass top for checking your collection without opening the lid',
    'Magnetic closure with high-quality hinges holds a tight seal',
    'Low-maintenance Hydro System humidification, easy to refill',
    'Pre-calibrated digital hygrometer with thermometer built in',
    'Accessory drawer for cutters and lighters',
  ]),
  cons: JSON.stringify([
    'No lock mechanism',
    'Glass lid needs to stay out of direct sunlight',
    'No passive ventilation — needs a monthly manual opening for air exchange',
    'No temperature control',
    'Manufacturer advises against using Boveda packs with the included system',
  ]),
})).lastInsertRowid;

for (const review of accessoryReviews) {
  insertAccessoryReview.run(at({ accessory_id: humidorId, ...review }));
}

console.log(`Seeded ${accessoryCategories.length} accessory categories, 1 accessory, ${accessoryReviews.length} accessory reviews.`);
console.log(`Computed AccScore for Case Elegance Renzo: ${accScore != null ? accScore.toFixed(1) : 'insufficient data'}`);

db.close();
