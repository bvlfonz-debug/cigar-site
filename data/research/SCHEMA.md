# Cigar research handoff — schema & rules

This is a self-contained brief for researching new cigars to add to the
Cigar Codex catalog. Save each researched cigar (or line) as one JSON file
in `data/research/incoming/`, following the template in `TEMPLATE.json` in
this same folder. Claude (this project's coding assistant) will read every
file in that folder later and add the data to the live database — so the
file's structure and the sourcing rules below need to be followed exactly,
not just approximately.

## Non-negotiable rules (read this first)

1. **Never invent a brand, blend, wrapper, vitola size, price, or tasting
   note.** Every fact must trace back to something you actually read on a
   real page. If you can't find a fact, leave the field `null` — do not
   guess or estimate.
2. **Every source needs a real, working URL and the date you looked at it**
   (`retrieved_at`, `YYYY-MM-DD`). "I recall that..." is not a source.
3. **Check for duplicates before researching a cigar in depth.** A cigar
   counts as a near-duplicate (skip it) if the same brand+line already
   exists in the catalog with a vitola within ~0.25" length or a few
   ring-gauge points of one you're about to add. If unsure whether
   something's already catalogued under a slightly different name/spelling,
   note the ambiguity in the file rather than silently adding it or
   silently skipping it.
4. **Prefer extending an existing brand's lineup** (a new line under a
   brand already in the catalog) over introducing a brand-new brand —
   it's cheaper to verify and lower duplicate risk. New brands are fine
   too, with the same sourcing rigor.
5. **`background_text` and `summary_review` must be original synthesis**,
   not copied text. You may use at most one short quoted phrase (under 15
   words) from any single source, attributed. Record facts (sizes, blends,
   prices, dates, scores) freely — just don't reproduce a critic's written
   prose.
6. **Critic scores are best-effort.** A cigar can be saved with zero critic
   reviews — it'll just show "insufficient data" on the site until 3
   independent sources exist. Don't burn excessive time chasing a review
   that doesn't exist; don't invent one either.
7. **One JSON file per new line** (a brand can have multiple lines; if
   you're researching several lines for the same brand, that's several
   files — repeat the `brand` block identically in each, it'll be
   deduplicated on ingest).

## Entity hierarchy

```
brand (a manufacturer, e.g. "Padrón")
 └─ line (a specific blend, e.g. "Padrón 1964 Anniversary")
     └─ vitola (a specific physical size, e.g. "Robusto, 5" x 50")
         └─ critic_review (a cited score from a real publication)
```

Images are a separate, later step — don't worry about photos for this
research pass.

## Field reference

### `brand` — only needed if the brand isn't already in the catalog

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | Official brand name as the manufacturer presents it |
| `slug` | string | yes | URL slug: lowercase, hyphens, e.g. `padron` |
| `country` | string | yes | Country of origin, e.g. `Nicaragua` |
| `factory` | string | no | Plain-text factory name if known — leave `null` if unsourced, don't guess |
| `founded_year` | integer | no | Leave `null` if not confidently sourced |
| `story_short` | string | yes | 1–3 sentence original-synthesis founding summary |
| `sources` | array | yes if any of `factory`/`founded_year`/`story_short` are filled in | See citation shape below — at least one real source for any historical claim |

### `line` — the specific blend being added

| Field | Type | Required | Notes |
|---|---|---|---|
| `brand_slug` | string | yes | The brand this line belongs to (must match an existing brand's slug, or the `brand.slug` in this same file if it's new) |
| `name` | string | yes | Full line name as sold, e.g. `Padrón 1964 Anniversary` |
| `slug` | string | yes | URL slug, unique within the brand |
| `wrapper` | string | yes | e.g. `Ecuadorian Habano` |
| `binder` | string | yes | e.g. `Nicaraguan` |
| `filler` | string | yes | e.g. `Nicaraguan` |
| `strength` | enum | yes | One of exactly: `mild`, `mild-medium`, `medium`, `medium-full`, `full` |
| `release_year` | integer | no | Leave `null` if not confidently sourced |
| `background_text` | string | yes | Original-synthesis paragraph on the blend/release story |

### `vitolas` — array, one entry per physical size

| Field | Type | Required | Notes |
|---|---|---|---|
| `size_name` | string | yes | e.g. `Robusto`, `No. 4`, `Toro Gordo` |
| `slug` | string | yes | URL slug, unique within the line |
| `length_in` | number | yes | Length in inches, e.g. `5.5` |
| `ring_gauge` | integer | yes | e.g. `52` |
| `vitola_type` | string | yes | Conventional shape name: `robusto`, `toro`, `churchill`, `torpedo`, `belicoso`, `lancero`, `corona`, `gordo`, `perfecto`, etc. |
| `summary_review` | string | yes | Original-synthesis 1–2 sentences. If there are no critic sources yet, keep this a plain factual note rather than inventing a flavor profile |
| `tasting_notes` | array of strings | no | Only include if drawn from something you actually read (a review, a retailer page) — omit/empty array if nothing describes the flavor |
| `smoke_time_min` | integer | no | Approximate smoking time in minutes, if sourced |
| `box_counts` | array of integers | no | Box sizes it's sold in, e.g. `[10, 20]` |
| `critic_reviews` | array | no | See citation shape below |

### `critic_reviews` — array, nested inside each vitola

| Field | Type | Required | Notes |
|---|---|---|---|
| `source_name` | string | yes | Publication/retailer name, e.g. `halfwheel`, `Cigar Aficionado` |
| `source_type` | enum | no (defaults to `critic`) | `critic` or `retailer` |
| `score` | number | yes | The score as given |
| `score_scale` | number | yes | What it's out of, e.g. `100` |
| `review_date` | string | yes | `YYYY-MM-DD` |
| `url` | string | yes | Direct link to the review |
| `key_notes_text` | string | no | A short paraphrase or one attributed quote under 15 words |

### `sources` — citation shape, used for `brand.sources`

| Field | Type | Required |
|---|---|---|
| `source_name` | string | yes |
| `source_url` | string | yes |
| `fact_note` | string | yes — which specific fact this source supports |
| `retrieved_at` | string | yes — `YYYY-MM-DD` |

## Where things end up on the live site

- `brand` → `/brands/[slug]`
- `line` + its `vitolas` → `/cigars/[brand]/[line]/[vitola]`
- `critic_reviews` feed the aggregate "Codex Score" (never a first-hand
  rating — always a computed aggregate across independent sources)

## What NOT to do

- Don't try to write directly to the database or run any scripts — just
  produce the JSON files. Ingestion is a separate step.
- Don't research accessories, lounges, or factories in this pass — cigars
  (brand/line/vitola) only, unless asked separately.
- Don't fill in a field you're not sure about — `null`/omitted is always
  safer than a guess.
