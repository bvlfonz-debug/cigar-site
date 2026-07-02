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

## Affiliate configuration
- `config/affiliates.json` holds retailer names, tracking IDs, and URL
  templates. Ship with placeholder values clearly marked PLACEHOLDER.
- Retailer rows on cigar pages render links from this config only.
- When the owner receives real affiliate approvals, they paste IDs into this
  file with your step-by-step help.
- Respect program terms: no trademark bidding, required disclosures, geo
  restrictions. Flag any program whose terms conflict with the site design.

## Error handling for a beginner owner
- All errors the owner might see should fail with plain-language messages.
- The run-log.md is the owner's window into the automation — write it for a
  human, not a machine: short, dated entries, plain English.
- If the owner pastes an error into a session, diagnose and fix it yourself;
  do not hand them debugging homework.
