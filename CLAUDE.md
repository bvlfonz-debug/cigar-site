# CLAUDE.md — Ultimate Cigar Database Project

## Read this first
You are building and maintaining an automated cigar database website. The owner
is a beginner with no coding, git, or GitHub experience. Whenever the owner must
do something themselves (click something in a browser, log in, paste a secret),
give one step at a time in plain language and wait for confirmation. Never dump
a wall of technical steps on them. Explain what you're doing as you go, briefly.

## What this project is
A structured cigar database (brands → lines → vitolas) that powers a generated
website: cigar review pages with aggregate scores, brand pages, rankings,
comparison pages, price tracking, and news briefs. Revenue comes from affiliate
links to cigar retailers. After the initial build, a nightly GitHub Actions
workflow keeps it updated with minimal human involvement.

A second vertical, non-tobacco cigar accessories (humidors, cutters, lighters,
etc.), was added later — see "Accessories Expansion" below. Because accessories
aren't tobacco products, those pages can carry mainstream affiliate programs
(Amazon Associates) and eventually display ads: a second revenue layer on the
same traffic, built with the same rigor and the same beginner-friendly,
one-step-at-a-time approach as everything else here.

A third vertical, a factual cigar lounge directory (`/lounges`), was added
later still — see "Lounge Directory Expansion" below. It carries no
affiliate links or ads; it exists to be a genuinely useful, honestly-sourced
reference, built with the same non-negotiable rule as everything else: never
publish a first-hand rating, only cited aggregates once enough independent
sources exist.

## Stack
- Astro static site, TypeScript, minimal dependencies
- SQLite database at `data/cigars.db`, committed to the repo
- Hosting: Vercel, connected to this GitHub repo (push to main = auto-deploy)
- Automation: GitHub Actions nightly cron running Claude Code headless
- Authentication for automation: the owner's Claude Pro subscription via
  CLAUDE_CODE_OAUTH_TOKEN repo secret (generated with `claude setup-token`).
  NEVER introduce ANTHROPIC_API_KEY anywhere — the owner has no API account
  and an inherited API key would cause surprise billing.

## Build phases — do these IN ORDER, pausing for owner approval between phases
1. **Skeleton**: git setup, Astro site shell, SQLite schema, one fully complete
   sample cigar page (Padrón 1964 Anniversary Exclusivo Maduro) with real
   researched data. Show the owner how to preview locally (`npm run dev`).
   STOP and get approval on the page design before continuing.
2. **Core site**: age gate, FTC disclosure component, brand pages, cigar detail
   template, basic search/filter page, schema.org markup, sitemap. Seed 25
   well-known cigars across major brands (Padrón, Arturo Fuente, Oliva,
   My Father, Rocky Patel, Drew Estate, AJ Fernandez, Davidoff, Romeo y Julieta,
   Montecristo, etc.).
3. **Deploy**: walk the owner through connecting the repo to Vercel (they click,
   you instruct). Site goes live on the free vercel.app URL.
4. **Automation**: create the nightly workflow. Walk the owner through running
   `claude setup-token` and adding the CLAUDE_CODE_OAUTH_TOKEN repo secret
   (they paste the secret themselves — never ask them to show it to you).
   Run one manual test of the workflow before trusting the schedule.
5. **Scale**: grow the seed toward ~500 cigars over multiple sessions/nightly
   runs. Add ranking pages, comparison pages, price-history charts, deals page.

## Design bar
Premium editorial product — think wine or watch publications, not a hobby
blog. Confident, refined, professional. Typography and whitespace carry the
design; data visualizations (score bars, price history) are clean and
restrained, not flashy. No stock-photo cigar clichés, no gimmicks.

## Data model (SQLite)
- **brand**: id, name, slug, country, factory, founded_year, story_short
- **line**: id, brand_id, name, slug, wrapper, binder, filler, strength
  (mild | mild-medium | medium | medium-full | full), release_year, background_text
- **vitola**: id, line_id, size_name, slug, length_in, ring_gauge, vitola_type
  (robusto, toro, churchill, etc.), stick_score, score_flavor,
  score_construction, score_complexity, score_value, tasting_notes (JSON array
  of strings), summary_review, smoke_time_min, box_counts (JSON array)
- **critic_review**: id, vitola_id, source_name, score, score_scale (e.g. 100),
  review_date, url, key_notes_text
- **price_point**: id, vitola_id, retailer, price_single, price_box, box_count,
  affiliate_url, checked_at — APPEND-ONLY. Never update or delete rows; price
  history is a core feature.
- **news_item**: id, title, summary, source_name, source_url, published_at,
  related_vitola_ids (JSON array)
- **review_queue**: human-approval queue, stored as `data/review-queue.json`

## StickScore — the aggregate scoring system
- Sources: Cigar Aficionado, halfwheel, Cigar Coop, Developing Palates,
  Cigar Snob, Cigar Dojo, plus retailer user-review averages (JR, Famous,
  Neptune, Atlantic, etc.)
- Weighting: professional critic scores 70%, retailer user averages 30%
- Recency: reviews from the last 5 years count double vs. older ones
- Normalize all sources to a 100-point scale before aggregating
- Minimum 3 independent sources to publish a score. Fewer → display
  "insufficient data" and add to review queue.
- Sub-scores (flavor, construction, complexity, value) are derived from review
  text analysis; value additionally factors current price against score
  percentile among similar cigars
- Every score page displays source count and links to every original review
- NEVER invent a score, a source, or a review. NEVER present the aggregate as
  a first-hand smoking experience — it is always labeled as an aggregate.

## Content rules — these are non-negotiable
- All written summaries are ORIGINAL SYNTHESIS. Never copy critic prose. At
  most one short attributed quote (<15 words) per source. Facts (sizes, blends,
  prices, dates, scores) are fine to record; critics' written reviews are not
  ours to reproduce.
- Attribute and link every source on every review page.
- Tasting notes are labeled "consensus notes" — extracted patterns across
  sources, never claimed as first-hand.
- Include dissenting critic opinions when they exist. Credibility over hype.
- Tone: knowledgeable friend. No marketing superlatives without data behind them.
- FTC affiliate disclosure component renders on every page containing affiliate
  links, above the fold of the link area.
- Age gate (21+) interstitial on all routes, remembered per session.
- Nothing on the site may target or appeal to minors. No cartoon mascots,
  no candy-adjacent styling.

## Pages to generate
- `/cigars/[brand]/[line]/[vitola]` — the core review page: StickScore with
  sub-score bars, consensus tasting notes as tags, summary review, dissent
  section when applicable, background, specs table, price-per-stick and
  per-box comparison across retailers (affiliate slots), price history chart,
  sources list, similar cigars block
- `/brands/[brand]` — brand story, all lines and vitolas, brand-level stats
- `/rankings/...` — programmatic list pages: by wrapper, country, strength,
  price band, vitola type, and combinations ("best Nicaraguan maduros under $10")
- `/compare/[a]-vs-[b]` — side-by-side comparison pages for popular pairs
- `/deals` — auto-flagged: anything currently priced >15% below its trailing
  90-day average
- `/news` — daily briefs generated from news_items
- `/search` — faceted filter: wrapper, strength, country, price, score
- Homepage: featured cigars, latest news, biggest movers, top-rated

## SEO
- Product + AggregateRating JSON-LD on every cigar page; Article on news
- Clean slugs, canonical URLs, sitemap regenerated every build
- Internal linking: every page links to parents, siblings, 3-5 similar cigars
- Meta descriptions generated from the data, unique per page

## Nightly automation (.github/workflows/nightly.yml)
Schedule: 09:00 UTC daily (owner is in Asia timezone; this is their overnight
lull). Authenticate ONLY via CLAUDE_CODE_OAUTH_TOKEN secret.

Steps in order:
1. **Ingest**: search for cigar news, new releases, and new critic reviews from
   the established sources listed above. Parse into structured records.
2. **Price refresh**: check current prices for a rotating slice of vitolas.
   START SMALL: 30 vitolas/night until real quota consumption is known, then
   tune. Append new price_points. Price swings >25% go to review queue, not live.
3. **Score recompute**: recompute StickScore for any vitola with new reviews.
4. **Generate**: regenerate changed pages, write the day's news briefs, update
   rankings and deals.
5. **Publish gate**:
   - AUTO-PUBLISH: price refreshes from known retailers, score updates from
     known sources, news briefs citing established outlets, page regenerations
   - QUEUE FOR HUMAN (data/review-queue.json): brands/lines never seen before,
     conflicting specs between sources, price swings >25%, scores with <3
     sources, any source of uncertain credibility
6. Commit as `nightly: <date> — <one-line summary>` and push to main.
7. Append a run summary to `data/run-log.md`: what was done, what was skipped,
   what was queued, and any errors.

### Quota frugality — the automation runs on the owner's Claude Pro plan
- Nightly capacity is a FIXED budget shared with the owner's own usage.
- Cap the run with --max-turns. Prefer completing fewer items fully over
  attempting everything partially.
- If quota/rate limits are hit mid-run: commit completed work, log what was
  skipped, exit cleanly. Never leave the repo half-broken.
- Batch work: one search pass, one write pass. Don't re-derive unchanged pages.
- Weekly (Sundays), the run may do heavier catalog work; weekdays stay lean.

### Automation guardrails
- Never delete existing records. Corrections are new records or queued edits.
- Never modify: `config/affiliates.json` values, the age gate, the disclosure
  component, this CLAUDE.md, or the workflow file itself.
- If a source site is unreachable: skip it, note it in the log. Never
  substitute guessed data for missing data.
- Any run that can't finish cleanly commits partial progress with a
  NEEDS-ATTENTION line in run-log.md rather than retrying in a loop.

## Human review loop
The owner skims data/review-queue.json weekly (~20 min). Each queued item must
include: what it is, why flagged, sources found, proposed action, and a simple
approve/reject field the owner can edit. Applied on the next run. Rejected
items are remembered and not re-proposed. Keep the queue small and readable —
it is written for a non-technical human.

## Accessories Expansion
Humidors, torch/soft-flame lighters, cutters, ashtrays, hygrometers,
humidification systems, travel cases, cigar journals/stands — everything here
follows the exact same content rules, aggregate-scoring discipline, and
beginner-friendly pacing as the cigar side. The only real difference is the
affiliate programs available (see Affiliate configuration below) and that
accessory pages don't get sub-score breakdowns (flavor/construction/etc. don't
apply) — they get pros/cons instead.

### Data model (SQLite) additions
- **accessory_category**: id, name, slug (humidors, torch-lighters,
  soft-flame-lighters, cutters, ashtrays, hygrometers,
  humidification-systems, travel-cases, journals-stands)
- **accessory**: id, category_id, brand, model, slug, specs (JSON — capacity,
  material, dimensions, warranty, etc.), acc_score, summary_review,
  pros (JSON array of strings), cons (JSON array of strings)
- **accessory_review**: id, accessory_id, source_name, source_type
  (critic | community), score, score_scale, review_date, url, key_notes_text
  — same shape as critic_review
- **accessory_price_point**: id, accessory_id, retailer, price_single,
  price_box, box_count, affiliate_url, checked_at — APPEND-ONLY, same as
  price_point. Amazon rows: see Affiliate configuration — never store a
  price value that gets displayed as current.

### AccScore — same aggregation rules as StickScore
- Minimum 3 independent sources to publish. Fewer → "insufficient data",
  queued. Normalize to 100. Recent (≤5yr) sources count double. Never invent
  a score, a source, or a review.
- Sources: dedicated review blogs, YouTube reviews (cite the channel name as
  the source), retailer user-review averages, and forum consensus (r/cigars,
  cigar forums) — label forum-derived figures explicitly as "community
  consensus," never presented as a single critic's verdict.
- Every score page displays source count and links to every original source,
  same as cigar pages.

### Pages
- `/accessories/[category]/[brand-model]` — review page, same layout language
  as cigar pages: AccScore, pros/cons (in place of sub-score bars), specs
  table, price comparison across retailers (affiliate slots), sources list
- `/accessories/[category]` — category hub, ranks all items in that category
  (same pattern as `/rankings/[facet]/[value]`)
- `/guides/[slug]` — buying guide pages (list below)
- Cross-linking (Phase C): every cigar page gets a small "gear for this"
  block; accessory pages link back to related cigar content. Guides
  internal-link to the product review pages they reference.

### First 15 guide pages — build in this order
1. Best humidors for beginners
2. Best humidors under $100
3. Best humidors under $200
4. Desktop vs cabinet vs travel humidors explained *(evergreen)*
5. Best torch lighters
6. Best cigar cutters
7. Guillotine vs V-cut vs punch: which cut and why *(evergreen)*
8. Best travel cigar cases
9. Best hygrometers (and how to calibrate one) *(evergreen)*
10. Boveda vs beads vs gel: humidification compared *(evergreen)*
11. Best cigar ashtrays
12. Best gifts for cigar smokers
13. How to set up your first humidor (step-by-step) *(evergreen)*
14. Best budget cigar starter kits
15. Cigar accessories every beginner actually needs

Guides 4, 7, 9, 10, 13 are educational/evergreen — they exist to build topical
authority for SEO and internal-link to the product review pages, not to rank
products themselves.

### Nightly automation folding
Accessories work folds into the SAME nightly run, within the SAME quota
budget in CLAUDE.md's "Quota frugality" section — this does not add a second
run or expand total nightly work. Alternate focus night-to-night (e.g. cigars
on even calendar days, accessories on odd ones, or similar simple rule) rather
than trying to cover both every night. The same publish gate and review queue
rules apply equally: new accessory brands/categories never seen before →
queue for human; price swings >25% → queue; scores under 3 sources →
insufficient data, queued.

### Build phases — same "stop for approval" discipline as the original build
A) Schema + ONE complete sample (a well-reviewed humidor, real researched
   data, same rigor as the Padrón sample page) + ONE sample guide page (Best
   humidors for beginners). STOP for owner approval before continuing.
B) Seed ~40 accessories across all categories. Build guides 1-8.
C) Build guides 9-15. Add the cross-link blocks. Fold into nightly runs.

## Lounge Directory Expansion
A factual directory of cigar lounges (`/lounges/[city]/[slug]`) — a third
vertical alongside cigars and accessories. Non-negotiable, unchanged since
Phase 1: **StickScore never publishes a first-hand lounge rating.** Any
score shown (LoungeScore, now active as of Phase C) is an aggregate of
CITED external sources — Google/Yelp/TripAdvisor-style platform aggregates,
or genuine dated editorial rankings — never generated by the automation or
by us directly.

### Data model (SQLite) additions
- **lounge**: id, name, slug, city, city_slug, state, country, address,
  phone, website, hours_text, walk_in_or_membership
  (walk-in | membership | both), membership_details, indoor_smoking_status
  (allowed | not-allowed | allowed-with-restrictions), indoor_smoking_note,
  amenities (JSON array), overview_text, lounge_score, facts_source_url,
  facts_checked_at — UNIQUE(city_slug, slug). `city_slug` is computed and
  persisted at insert time (by `db-tools.mjs`'s `add-lounge` command), not
  derived per-page, so same-named cities in different states never collide
  (e.g. Portland, OR vs Portland, ME).
- **lounge_external_rating**: id, lounge_id, source_name, source_type
  (critic | platform — `platform` is a Google/Yelp/TripAdvisor-style live
  aggregate, `critic` is a genuine dated editorial ranking), score,
  score_scale, review_count, rating_date, url, key_notes_text — same shape
  as accessory_review.

### LoungeScore — same aggregation rules as StickScore/AccScore
`computeLoungeScore` (in `scripts/lib/stickscore.mjs`) is an alias of
`computeStickScore` — same 3-independent-source minimum, same recency
weighting (≤5yr sources count double), same critic/platform 70/30
blend-or-fallback. Minimum 3 independent sources to publish; fewer →
"insufficient data," same as everywhere else on the site. `rating_date` is
the date a platform aggregate was observed/checked (these are live
aggregates, not dated first-hand reviews) or the actual publish date for a
genuine editorial ranking. Add ratings via `add-lounge-external-rating`;
recompute via `recompute-lounge-score` (both in `scripts/db-tools.mjs`).

### Pages
- `/lounges` — hub listing all cities with lounges recorded
- `/lounges/[city]` — city index, lounges sorted scored-first-desc then
  alphabetically (same convention as the accessory category hub)
- `/lounges/[city]/[slug]` — detail page: LoungeScore panel (or
  "insufficient data"), facts panel (address/phone/website/hours), walk-in
  vs. membership, indoor smoking status + note + the fixed disclaimer
  sentence below, amenities, overview_text, a Ratings section citing every
  external source, and a "facts last checked" line citing
  `facts_source_url`. `LocalBusiness` JSON-LD (schema.org has no specific
  cigar-lounge type) with a conditional `aggregateRating` block, emitted
  only once `lounge_score` is non-null — same pattern as the cigar/accessory
  pages' Product JSON-LD. No pricing section, no affiliate links, no FTC
  disclosure component — lounges aren't retailers.

### Content rules specific to lounges
- Fixed disclaimer sentence, reused verbatim wherever indoor smoking status
  is shown, never paraphrased per-lounge (same treatment as the Amazon
  disclosure sentence): "Smoking laws vary and change — confirm current
  regulations directly with the venue before visiting."
- "Never invent" extends to the directory facts themselves, not just
  ratings — address/hours/phone/etc. need a real `facts_source_url`.
- New cities/lounges never verified before must go through the same
  `queue-add` review-queue flow as new cigar brands/lines and new accessory
  categories — never created directly without a matching approved queue entry.
- Ratings must always be cited external sources — never generate a rating
  yourself, even as a placeholder or estimate.

### Nightly automation folding
Lounges share the SAME nightly run and SAME turn budget as cigars and
accessories — this is now a 3-way rotation (day-of-month modulo 3) rather
than the 2-way cigars/accessories alternation from before. A lounge-focus
night's work: look for new cited ratings on existing lounges (to push
insufficient-data entries over the 3-source minimum, or refresh stale
ones), and — via the queue — propose new lounges/cities. Same publish-gate
rules apply: new cities/lounges → queue for human; ratings under 3 sources
→ insufficient data, queued.

### Build phases — same "stop for approval" discipline
A) Schema + `db.ts` + `db-tools.mjs` (`add-lounge`, `find-lounge`) + the 3
   page templates + nav/sitemap + ONE real researched sample lounge. DONE.
B) Seed a real batch of lounges across several cities — facts only, still
   no ratings. DONE.
C) Populate `lounge_external_rating` from cited platforms, activate
   LoungeScore display, fold lounges into the nightly automation's
   3-way rotation, add cross-links to/from guides and cigar pages. DONE.

## Affiliate configuration
- `config/affiliates.json` holds retailer names, tracking IDs, and URL
  templates. Ship with placeholder values clearly marked PLACEHOLDER.
- Retailer rows on cigar pages render links from this config only.
- When the owner receives real affiliate approvals, they paste IDs into this
  file with your step-by-step help.
- Respect program terms: no trademark bidding, required disclosures, geo
  restrictions. Flag any program whose terms conflict with the site design.

### Amazon Associates (accessories only)
- Added to `config/affiliates.json` as PLACEHOLDER until the owner is
  actually approved for the program.
- IMPORTANT — do not prompt the owner to apply for Amazon Associates until
  they tell you they've purchased a proper domain for the site. They've said
  they need to do that first; wait for them to bring it up rather than
  raising it yourself.
- Required disclosure, verbatim, on every page with an Amazon link: "As an
  Amazon Associate I earn from qualifying purchases." Render it via the same
  FTC disclosure component used for cigar retailers, extended to include this
  exact sentence whenever an Amazon link is present on the page.
- NEVER display a stored/scraped Amazon price as if it's current — Amazon's
  associate terms require price data to come from their own API, not a
  cached number we looked up. For Amazon rows specifically, render a "Check
  price on Amazon →" link instead of a dollar figure, regardless of whether
  a price value happens to exist on the row.
- NEVER include an Amazon affiliate link in an email.
- Non-Amazon accessory retailers (mainstream shops, cigar retailers' own
  accessory sections) keep the normal price-comparison treatment — real
  fetched prices displayed, same as cigar price_point rows.

## Error handling for a beginner owner
- All errors the owner might see should fail with plain-language messages.
- The run-log.md is the owner's window into the automation — write it for a
  human, not a machine: short, dated entries, plain English.
- If the owner pastes an error into a session, diagnose and fix it yourself;
  do not hand them debugging homework.
