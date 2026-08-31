# Nightly run log

This file is your window into what the automation does each night. Each entry
is dated, plain English, and short — no code, no jargon. Skim it whenever
you're curious; you don't need to check it daily.

## 2026-08-27 — nightly run (in progress)

Weekday, lean budget. Day-of-month rotation (27 mod 3 = 0) points at
**cigars** tonight. Cigar-growth batch was flagged off for tonight, so no
new brand/line/vitola additions this run — just refreshing existing catalog
data.

**Price refresh:** checked five never-priced vitolas (Room101 Farce It Is a
Robusto, Cohiba Black Robusto, Partagas Classic No. 10, CAO Brazilia Amazon,
Illusione Epernay Le Ferme). Only one had a price I was confident enough to
publish: CAO Brazilia Amazon (6x60) at $10.89 single from Smoking Pipes,
size confirmed against the listing. Skipped the rest: Room101 Farce (no
price surfaced anywhere), Partagas No. 10 (only a vague "average price"
figure, no specific retailer quote), Illusione Epernay Le Ferme (couldn't
confirm whether the price I found was for this cigar or the newer "Tuonela"
variant), Cohiba Black Robusto (the only listing was for a "Crystal"
packaging variant, currently out of stock, and it wasn't clear if that's
the same blend as our catalogued plain Robusto).

**News ingest:** added one real news item — Emilio Suave Sumatra, a new
two-vitola limited edition with an Indonesian Sumatra-seed wrapper, released
August 25, 2026 (capped at 5,000 cigars per vitola), per halfwheel. Emilio
isn't a brand in our catalog yet, so no related-cigar link. Checked for
duplicates against Camacho's Limited Edition 2026 and other items already
logged from a prior run — nothing else new needed adding.

Build verified clean (`npm run build`) before committing. Committed and
pushed in one batch so far; more to come below if turns allow.

**Score recompute:** tried to push three thin-sourced cigars (Cohiba Black
Robusto, Davidoff Nicaragua Robusto, H. Upmann 1844 Reserve Toro — each sat
at 2 critic sources, one short of publishing) over the 3-source line with a
fresh Cigar Aficionado citation for each. Caught myself before committing:
all three "new" citations turned out to be the exact same Cigar Aficionado
review (same score, date, and URL) already on file for that cigar — I
hadn't checked existing citations before searching. Deleted the three
duplicate rows and recomputed their scores back to their correct prior
state (still "insufficient data," unchanged) rather than let inflated
source counts slip through. No harm done — caught before anything was
committed — but flagging it here for transparency. These three still need
one genuinely new, independent source before they can publish a score.

**Wrapping up:** stopping here on a lean weekday budget rather than
starting new research. Nothing was queued tonight. No unreachable sources
or errors beyond the citation mistake above, which was self-corrected.
Build verified clean before this final commit.

## 2026-08-25 — accessories night
Tuesday (weekday, lean run). Day-of-month rotation (25 mod 3 = 1) landed on
accessories tonight. Cigar-growth flag was off tonight (odd day-of-month),
so no new cigar batch. Not Sunday, so no queue triage this run.

- **Tried to push three near-3-source accessories over the AccScore line**
  (NewAir CC-300H Humidor, Xikar Volta table lighter, Colibri Quasar table
  lighter — each already had 2 independent sources on file): found several
  more written reviews (Xikar Volta via Blind Man's Puff, NewAir CC-300H via
  SmokeDock and CigarWeekly) but none of them gave an actual numeric score or
  star rating — just qualitative verdicts like "Great, Highly Recommend" —
  and the scoring system requires a real number to aggregate. A halfwheel
  review of the Colibri Quasar and a couple of retailer rating-count pages
  (Cigar.com, Neptune Cigar, CigarWeekly) also either errored out or didn't
  expose their star rating in a fetchable way. Skipped all three rather than
  invent a number — still sitting at 2 sources ("insufficient data") for now.
- **Price refresh**: checked a handful of accessories that had never had a
  price recorded. Confirmed and added two: Xikar Cigar Stand at $13.49 from
  Xikar's own site, and the Colibri Quasar Cigar Ashtray at $195.00 from
  Northwoods Humidors (this one had no price on file at all before tonight).
  Checked three more (Mantello Royal Glass-Top Humidor, NewAir CC-300H
  Humidor, Visol Arnold Crystal Ashtray) but skipped all of them — Mantello's
  own site had an expired SSL certificate, the NewAir humidor had
  conflicting prices across sources ($599.95 vs $549.99) with no single page
  loading cleanly to settle it, and the ashtray retailer page didn't surface
  a price for that specific item in the fetch.
- No new brands/lines/accessory categories/lounges proposed tonight, so
  nothing went to the review queue.

Build verified clean (`npm run build`) before committing. No errors, nothing
queued, no NEEDS-ATTENTION items.

## 2026-08-23 — Sunday run: lounges night (heavier catalog pass allowed)
Day-of-month rotation (23 mod 3 = 2) landed on lounges tonight. Cigar-growth
flag was off tonight, so no new brand/line/vitola batch. Sunday, so a
weekly queue triage follows this section further down the log.

- **Lounge ratings push**: went through existing lounges sitting at 0-2
  cited external ratings (below the 3-source LoungeScore minimum) and
  tried to push several over the line:
  - **Shelly's Back Room (Washington, DC)** — found three independently
    verifiable platform ratings: TripAdvisor (4.0/5, 261 reviews, fetched
    and cross-checked via two separate searches), Restaurantji (4.4/5, 306
    reviews, confirmed by direct page fetch), and Google as mirrored by
    Sluurpy's aggregator page (4.5/5, 1,609 reviews, confirmed by direct
    page fetch, which also independently cross-checked the TripAdvisor
    number). That's 3 independent sources — **published its first
    LoungeScore: 86.0.**
  - **Boston Cigar Club & Shop** — added a second source (TripAdvisor,
    5.0/5) alongside the existing Google rating. Still short of the
    3-source minimum (couldn't find a genuinely independent third platform
    — Restaurant Guru's number there looked like the same Google figure
    re-mirrored, not a distinct source, so it wasn't counted separately) —
    stays "insufficient data" for now, one source closer than before.
  - **Casa de Montecristo by JR Cigar (Mooresville, NC)** — tried again
    for a third source (has Google + Foursquare). Yelp and TripAdvisor
    both returned blocked/403 fetches again, and a Chamber of Commerce
    mirror with a plausible number also returned blocked. Same outcome as
    last lounges night — nothing added, left for a future pass.
  - **The Debonair Cigar Lounge (Los Angeles)** — turned out to be
    ambiguous: search results surfaced what looks like two different LA
    locations (La Brea and a newer Downtown LA spot) under similar names
    with inconsistent rating figures between them, and Yelp/TripAdvisor/
    Foursquare pages all returned blocked fetches. Skipped rather than
    risk attributing the wrong location's rating.
  - **Casa de Montecristo (Boca Raton, FL)** and **Casa de Montecristo
    (Southfield, MI)** — found plausible Yelp figures in search snippets
    but couldn't independently confirm them via a direct page fetch (both
    blocked), so nothing added. Boca Raton's only other lead (Restaurant
    Guru) also looked like a re-mirrored Google number, not independent.
  - Recompute happens automatically when a rating call crosses the
    3-source threshold — no separate step needed.

Build checked clean (`npm run build`) before committing. Committed and
pushed as its own commit right after this research pass, per tonight's
"commit after each major step" instruction.

- **Weekly queue triage** (Sundays only): went through all 255 entries in
  `data/review-queue.json` looking specifically for genuinely-new-entity
  proposals (new brand/line/lounge/factory/accessory-category candidates)
  — the kind that need an approve/reject/leave-for-owner decision. Found
  **none**. Every single entry tonight falls into the informational/
  gap-note category this triage explicitly skips: mostly
  `insufficient_sources` (169 of them), plus `conflicting_facts`,
  `vitola_dimension_conflict`, `unconfirmed_citation_details`,
  `unverified_vitola`, `unverified_award`, `omitted_from_submission`,
  missing-sourced-fact notes, and a handful of `fabricated_award`/
  `fabricated_product`/`vitola_name_mismatch` entries documenting things
  that were already correctly rejected and left out (not new items
  waiting on a decision). Double-checked a sample of those last few by
  hand to be sure they weren't disguised new-entity asks — they aren't,
  they're records of "we checked, it wasn't real, nothing was added."
  Nothing to approve, reject, or resolve tonight. No `queue-resolve` calls
  made since none of tonight's items matched the triage's scope. Queue
  stays at 255 informational entries, same as before.

**Stopping here for tonight.** Tonight's rotation focus (lounges) and the
Sunday queue triage are both done and pushed. No cigars/accessories
rotation work tonight (day-of-month picked lounges) and no cigar-growth
batch (flag was off). No errors, nothing newly queued, no
NEEDS-ATTENTION items — just one published LoungeScore, one lounge moved
a source closer, and several honest dead ends on sites that wouldn't let
an automated fetch through. Next lounges-focus night: Boston Cigar Club
still needs a genuinely independent 3rd source; Casa de Montecristo
Mooresville, Boca Raton, and Southfield are all one or two verifiable
sources away too, just blocked by 403s tonight.

## 2026-08-21 — Friday run: cigars night
Day-of-month rotation (21 mod 3 = 0) landed on cigars tonight. Weekday, so
kept it lean; not a Sunday, so no queue triage. Cigar-growth flag was off
tonight, so no new brand/line/vitola batch this run — just the regular
cigars-focused nightly work below.

- **News + release calendar**: found three genuine, currently-live
  halfwheel reports on new releases and added all three as news briefs,
  each cross-linked to a matching new release-calendar entry: Camacho's
  "Boldly Built by Masters" Limited Edition 2026 perfecto (shelves Sept 3,
  linked to the existing Camacho brand), HVC's Pan Caliente 10th
  Anniversary blend (already shipping), and Lure Cigars' "The Fat Matt"
  (already shipping). HVC and Lure Cigars aren't brands in our catalog yet,
  so those two releases are recorded without a brand link for now — that's
  fine, a release entry doesn't require one.
- **Price refresh**: checked current prices for 12 well-known vitolas
  across JR Cigars, Famous Smoke Shop, Neptune Cigar, and Atlantic Cigar
  (smaller than the usual ~30 to stay lean on a weekday). 7 real prices
  came back clean and were added: Montecristo White Series Churchill,
  Arturo Fuente Hemingway Classic, Ashton VSG Torpedo, Perdomo 20th
  Anniversary Sun Grown Churchill, Drew Estate Liga Privada T52 Flying
  Pig, Drew Estate Undercrown Maduro Corona Doble, and Crowned Heads Le
  Careme Hermoso No. 1 (this last one's JR Cigars listing shows sold out
  right now, but the listed price itself was real, so it's on record for
  price history). 5 were skipped rather than risk bad data: Cohiba Black
  Robusto's Atlantic Cigar price looked like a listing error (a box
  "sale" price wildly out of line with its own "was" price); Davidoff
  Nicaragua Robusto and AJ Fernandez New World Robusto only turned up
  different product variants (Box-Pressed and "Navegante" respectively),
  not the exact vitolas we have catalogued; Romeo y Julieta Añejo
  Piramide wasn't found at any of the four retailers; and H. Upmann 1844
  Reserve Toro's Famous Smoke figure looked like it might be a mislabeled
  multi-pack price rather than a true single-stick price. Neptune Cigar's
  pages didn't return usable price data at all (JS-rendered), so it
  contributed nothing tonight. No price swings over 25% were triggered.
- **Score recompute**: no new critic reviews were added tonight, so no
  StickScores needed recomputing.

- **Chasing insufficient-data cigars**: separately searched for extra
  independent sources on 5 cigars that have been sitting at "insufficient
  data" in the queue (Fuente Fuente OpusX Robusto, Padrón 1926 Serie No.
  35 Maduro, My Father Le Bijou 1922 Toro, Liga Privada T52 Toro, Arturo
  Fuente Añejo Reserva No. 48). Found and added two genuine, verified
  retailer customer-review averages: JR Cigars (4.0/5 from 5 reviews) for
  the Padrón 1926 No. 35 Maduro, and Atlantic Cigar Company (4.5/5 from 2
  reviews) for the Liga Privada T52 Toro. Both now sit at 2 independent
  sources — one more each and a StickScore will publish. Couldn't verify
  an exact-vitola score for the other three (OpusX Robusto, Le Bijou 1922
  Toro, Añejo Reserva No. 48) from any acceptable source this pass — left
  as-is in the queue rather than guess.

Build checked clean (`npm run build`) before committing. No errors,
nothing left half-done — this is everything planned for tonight's lean
weekday run.

## 2026-08-12 — Wednesday run: cigars night
Today is a "cigars" night on the 3-way rotation with accessories and
lounges (see CLAUDE.md). Weekday, so kept it light. Not a Sunday, so no
queue triage this run.

- **News/releases**: found a real halfwheel report that a new Diesel line,
  "Diesel Uncaged," recently arrived at stores (Nicaraguan habano criollo
  wrapper, three vitolas, roughly $6.29–$7.39 per cigar). Didn't add it to
  the news feed or release calendar tonight — halfwheel's own pages
  returned "payment required" errors when I tried to fetch the article
  directly to confirm an exact date, and I won't publish a dated claim I
  couldn't verify against the actual source page myself. Leaving this for
  a future run to pick back up with a working fetch.
- **Prices checked** (3 vitolas, all first-ever checks so nothing to
  compare against yet): Punch Rare Corojo Magnum, $11.39/single at Famous
  Smoke Shop; Sobremesa Cervantes Fino (Dunbarton Tobacco & Trust), $13.65/
  single at Cigars Direct (currently sold out there, but that's a
  stock-status detail, not a price change); Macanudo Café Hyde Park,
  $15.00/single at El Cigar Shop. Two more were attempted and skipped:
  Romeo Añejo Piramide (search results kept surfacing a different,
  similarly-named "Romeo by Romeo y Julieta" product line — skipped rather
  than risk recording the wrong product's price) and Hoyo de Monterrey
  Excalibur No. III (the JR Cigars product page 404'd).
- **Score recompute**: nothing to recompute tonight — no new critic
  reviews were confirmed.
- Site builds cleanly with these changes (`npm run build`, 18,697 pages).

## 2026-08-11 — Tuesday run: lounges night
Today is a "lounges" night on the 3-way rotation with cigars and
accessories (see CLAUDE.md). Weekday, so kept it light. Not a Sunday, so no
queue triage this run.

- **Ratings**: tried again to push our two closest lounges (Casa de
  Montecristo by JR Cigar, Mooresville NC, and BURN by Rocky Patel,
  Atlanta GA — both sitting at 2 sources) over the 3-source LoungeScore
  threshold. Yelp and TripAdvisor blocked automated access (403) on every
  page tried for both, same pattern as recent lounge nights, and search
  summaries gave numbers I couldn't confirm directly from the source page
  itself — so nothing was recorded rather than publishing a guessed
  number. Still no LoungeScore for either.
- **New lounge/city proposed**: San Francisco has no lounges in our
  directory yet. Found The Occidental Cigar Club, a well-known, long-
  standing SF cigar bar — one of the few venues in the city legally
  permitting indoor smoking. Confirmed its address, phone, hours, and
  walk-in policy directly from its own site, plus independent editorial
  coverage from Cigar Journal. Queued it (reason: new_lounge_city) rather
  than adding it directly, per the new-city rule — still needs your
  sign-off, and would need 3 independent cited ratings before any
  LoungeScore could show.
- **Errors**: none. Site builds cleanly (18,697 pages).

## 2026-08-10 — Monday run: accessories night
Today is an "accessories" night on the 3-way rotation with cigars and
lounges (see CLAUDE.md). Monday, not Sunday, so no queue triage this run.
Weekday, so kept it light.

- **Reviews**: tried to push a handful of accessories sitting at 2 review
  sources over the 3-source AccScore threshold (NewAir CC-300H humidor,
  Xikar Volta lighter, Colibri Quasar lighter, Xikar EX, Nathan Scott
  Lester's Cigar Log Book, Xikar PuroTemp hygrometer, Cigars International
  HYG7 hygrometer, Case Elegance Flint travel case). No luck tonight —
  candidate sites either didn't publish a numeric score (just prose), were
  blocked from fetching, or would have duplicated a source already on file.
  Nothing added; these stay at "insufficient data."
- **Prices checked** (4 accessories, first-ever checks for all of them):
  Colibri Julius lighter, $135.00 direct from colibri.com; Boveda 65% RH
  Size 60 single humidification pack, $45.99 at Famous Smoke; Visol Legend
  Leather 3-Finger Cigar Case (no cutter), $50.00 at eLighters.com; Cigar
  Caddy 5-Count Travel Humidor, $35.99 at Northwoods Humidors. A 5th
  attempt (Xikar PuroTemp rectangular hygrometer) was dropped after
  several retailer pages either blocked fetching or didn't expose a price
  in the page content.
- **Errors**: none otherwise. Site builds cleanly (18,697 pages).


Today is a "lounges" night on the 3-way rotation with cigars and
accessories (see CLAUDE.md). Saturday, not Sunday, so no queue triage this
run.

- **Ratings**: worked through lounges sitting at 1-2 sources, trying to
  push them over the 3-source publish threshold. Found one genuine new
  citation: BURN by Rocky Patel (Atlanta) now has a confirmed Foursquare
  rating, 7.9/10 from 10 ratings — recorded it. That brings Atlanta to 2
  sources (Google + Foursquare), still short of 3, so no score published
  yet. Tried hard for a 3rd source there and for Casa de Montecristo by JR
  Cigar (Mooresville, already at 2) — Yelp and TripAdvisor both blocked
  direct page access (403) for every lounge tried, same pattern as recent
  nights, and search-result summaries for those two sites wouldn't
  reliably surface the actual star number, just review counts — so nothing
  guessed or published from an unconfirmed figure. Also checked a
  Chamber-of-Commerce listing for Iwan Ries & Co. (Chicago) but skipped it
  as a source since it appears to just re-publish Google's rating rather
  than being independently sourced.
- **New lounge/city**: nothing new queued tonight. Washington, DC (Shelly's
  Back Room) is still sitting in the queue from 2026-08-05 awaiting your
  decision — no update needed there, just a reminder it's still waiting on
  you.
- **Errors**: none. Site builds cleanly (18,499 pages). Stopping here for
  tonight given the weekday budget.

## 2026-08-07 — Weekday run: accessories night
Today is an "accessories" night on the 3-way rotation with cigars and
lounges (see CLAUDE.md). Kept it light since it's a weekday. Not a Sunday,
so no queue triage this run.

- **Scores**: went looking for a 3rd independent source on accessories
  stuck at exactly 2 sources. Found one clean hit: SmokeInn's product page
  for the Boveda 65% RH Two-Way Humidification Pack (Size 60) shows a real
  customer rating breakdown (141 reviews: 117 five-star, 17 four-star, 3
  three-star, 3 two-star, 1 one-star — works out to about 4.7/5), giving it
  a 3rd independent source alongside Boveda's own site and Cigars
  International. AccScore is now live at 97.3/100 and the item is off the
  review queue. Tried the same for Xikar Volta and Xikar PuroTemp
  hygrometer (both also stuck at 2 sources) but couldn't confirm a 3rd —
  Neptune Cigar's pages didn't expose a review section in what was
  fetched, and Cigars International (403) and HumidorDiscount (404)
  blocked/removed the pages tried. Both stay queued for a future pass.
- **Prices checked**: picked two accessories with no price history yet.
  Most retailer pages tried 403'd or 404'd (same pattern as recent runs),
  but two came through clean: Xikar Ash Can (Portable Stainless Steel),
  $26.99 at CigarsCrafter (marked down from $29.99); Prestige Import Group
  Onyx 50-Count High Gloss Humidor, $94.95 at Humidor Enthusiast (currently
  listed as backordered/unavailable there, but that's a stock-status
  detail, not a price detail — recorded as usual).
- **NEEDS-ATTENTION**: ran out of turns before reaching the news-ingest
  step (looking for new accessory reviews/roundups to brief, and any
  new-product/category candidates for the queue) and the broader page
  regeneration pass. Nothing was left half-done — everything above is
  fully committed. Site builds cleanly (18,499 pages). Stopping here for
  tonight given the weekday budget.

## 2026-08-06 — Weekday run: cigars night
Today is a "cigars" night on the 3-way rotation with accessories and lounges
(see CLAUDE.md). Kept it light since it's a weekday. Not a Sunday, so no
queue triage this run.

- **News**: added one brief — AJ Fernandez's new Diesel Uncaged, a
  full-time addition to the Diesel line (Nicaraguan habano criollo wrapper
  over Nicaraguan binder/filler, medium-full body), launching in Robusto
  (5.5x52), Toro (6x52), and Gigante (6x60) at roughly $6.29-$7.39/cigar,
  via halfwheel. This specific line isn't in our database yet, so the brief
  stands alone with no linked cigar page for now, same as past similar
  briefs.
- **Prices checked**: picked three never-before-checked vitolas. Brick
  House Maduro Toro was skipped — every retailer page tried either 403'd
  or wouldn't show an exact price/box-count. The other two came back
  clean, both first-ever checks so nothing to compare against: Oliva Serie
  O Maduro Double Toro, $80.42/box of 10 at Atlantic Cigar Company;
  Padrón Family Reserve No. 44, $366.99/box of 10 at JR Cigar.
- **Scores**: looked for a third independent source on the queued Ashton
  VSG Robusto (stuck at 2 sources: Cigar Aficionado, Stogies on the Rocks).
  Found a halfwheel review, but it's for the "Robusto Especial" size and
  halfwheel blocked automated fetching (402 error) before I could confirm
  whether that's the same vitola as our 5.5x50 Robusto or a distinct size —
  left it queued rather than guess at a match.
- **Errors**: none. Site builds cleanly (18,499 pages).

## 2026-08-04 — Weekday run: accessories night
Today is an "accessories" night on the 3-way rotation with cigars and lounges
(see CLAUDE.md). Kept it light since it's a weekday.

- **Scores**: looked for a genuine third independent source for ten
  accessories stuck at 2 sources. Most leads didn't pan out — Developing
  Palates' and Cigar Advisor's Palio/PuroTemp write-ups turned out to be
  pros/cons pieces with no numeric score, and a JR Cigars Boveda link
  404'd — but Holt's Cigar Co.'s product page gave a clean customer-rating
  average (4.75/5, 2 reviews) for the Palio Cutter, a source distinct from
  its existing CigarInspector.com and Amazon entries. Added it and
  recomputed: Palio Cutter now has a published AccScore of 85.25 (3
  sources) instead of "insufficient data." The other nine (NewAir CC-300H
  humidor, Xikar Volta, Colibri Quasar Table Lighter, Xikar EX, Nathan Scott
  Lester's cigar log book, Xikar PuroTemp hygrometer, CI Large Analog
  Hygrometer, Boveda 65% RH pack, Case Elegance Flint travel case) stay at 2
  sources — nothing usable and unambiguously-matching found tonight.
- **Prices checked**: tried five never-before-checked accessories (Prestige
  Import Group Onyx 50-Count Humidor, Boveda 65% RH Size 60 pack, Zico ZD-60
  lighter) and none produced a clean, trustworthy price. Famous Smoke's page
  for the Boveda pack showed $45.99 for what it labeled a single 60g pack —
  far above the normal street price for that item, so likely a scraping/page
  mismatch rather than a real single-pack price — skipped rather than record
  a number that looks wrong. Shades of Havana (Onyx humidor) and Cigars
  International (Boveda) returned 403/429 errors; Neptune Cigar's Boveda
  page 404'd; no clean listing found for the Zico lighter. Nothing added to
  price history tonight rather than guess.
- **News**: no accessory news item added. Searches turned up only generic
  "2026 trends" blog roundups, not a specific dated product launch from a
  citable source, so nothing met the bar to add.
- **Queue**: nothing owner-approved was waiting to act on tonight.
- **Errors**: none fatal — several retailer pages blocked or 404'd (noted
  above), each skipped rather than guessed at. Site builds cleanly (18,204
  pages). Stopping here for tonight given the weekday budget.

## 2026-08-03 — Weekday run: cigars night
Today is a "cigars" night on the 3-way rotation with accessories and lounges
(see CLAUDE.md). Kept it light since it's a weekday.

- **News**: added one brief — Micallef is adding an "Orange" cigar to its
  Color Series (Connecticut wrapper, San Andrés binder, Nicaraguan/Dominican
  filler), premiering at Two Guys Cigars on Aug. 27, 2026 and going
  nationwide Sept. 5 in Robusto (5x52) and Toro (6x52). Micallef isn't yet
  in our brand catalog, so this is news-only for now, no linked cigar page.
  Also logged it on the release calendar (`/calendar`) since it's reporting
  a specific upcoming release, cross-linked to the news brief.
- **Prices checked**: two clean prices found and recorded, both first-ever
  checks for these vitolas so nothing to compare against yet — Crowned
  Heads Le Pâtissier Canonazo, $11.50/stick ($207 box of 20) at Cigars
  Direct; Viaje Honey & Hand Grenades The Shiv, $274/box of 25 at Atlantic
  Cigar Company (no single-stick price listed there). Skipped Dunbarton
  Sobremesa Cervantes Fino — every retailer page tried (JR Cigars 404'd,
  Neptune/Caribbean Cigars/Tobaccology either blocked the fetch or didn't
  expose a price, Smokingpipes shows it sold out) so nothing clean to record.
- **Scores**: no new critic reviews were confirmed tonight, so score recompute
  had nothing to act on. The big review queue (266 items, none yet decided
  by you) stayed untouched tonight — nothing new was proposed, and nothing
  was added directly since nothing there is marked approved.
- **Errors**: none. Site builds cleanly (18,040 pages). Stopping here for
  tonight given the weekday budget — accessories and lounges get their turn
  on the next two nights per the 3-way rotation.

## 2026-08-02 — Sunday run: lounges night

Today is a "lounges" night on the 3-way rotation with cigars and accessories
(day-of-month 2). Sunday, so a heavier catalog pass was allowed — spent it
chasing a third independent rating source for lounges still stuck below the
3-source LoungeScore minimum, since none of the pending lounge/city queue
proposals (Phoenix, Boston, Highlands Ranch) have an owner decision yet.

- **Scores**: found real TripAdvisor (4.5/5, 62 reviews) and Foursquare
  (8.7/10, 169 ratings) ratings for Corona Cigar Company & Diamond Crown
  Lounge (Orlando), joining its existing Google rating — that's 3
  independent sources now, so it has a published LoungeScore (91) for the
  first time. Also found a real Foursquare rating (8.1/10, 31 ratings) for
  Casa de Montecristo by JR Cigar (Mooresville, NC), which now has 2 of the
  3 needed sources — still "insufficient data," one more source away.
- Tried the same for five more lounges close to the threshold (The
  Debonair Cigar Lounge in LA, Casa de Montecristo's NYC 2nd Ave and Boca
  Raton locations) and three at zero ratings (Iwan Ries in Chicago, Holt's
  Cigar Company in Philadelphia, BURN by Rocky Patel in Atlanta) — Yelp and
  TripAdvisor both blocked automated access tonight, and Foursquare needs a
  login to show its rating page, so no usable numeric score came back for
  any of those. No guessed numbers were recorded; they stay as they were.
- **Queue**: checked for owner decisions on the three pending new-lounge
  proposals (Phoenix, Boston, Highlands Ranch) and the two pending factory
  profiles (Padrón's Tabacos Cubanica, AVO's OK Cigars) — all still
  awaiting your review, nothing new added or changed.
- One more found after that first pass: a Google rating (4.5/5, 1,008
  reviews) for BURN by Rocky Patel (Atlanta), via a cigar-lounge directory
  site that cited it — its first recorded source, still 2 away from
  publishing.
- Build passed cleanly before committing.

## 2026-08-01 — Weekday run: accessories night

Today is another "accessories" night on the 3-way rotation with cigars and
lounges (day-of-month 1, same slot as yesterday's 31 — this is expected,
not a bug). Kept it light since it's a weekday.

- **Scores**: chased a third independent numeric source for five accessories
  stuck below the 3-source AccScore minimum — NewAir CC-300H Humidor, Xikar
  Volta table lighter, Colibri Quasar Table Lighter, Xikar EX lighter, and
  Palio Cutter. Found plenty of real editorial coverage (CigarWeekly, Cigar
  Advisor, halfwheel, retailer pages) but nothing with an actual number
  attached — several retailer pages (Cigar Advisor, halfwheel, Cigars
  International) also blocked or paywalled the automated fetch. Since a
  guessed number isn't allowed, none of these got a new review. All five
  stay "insufficient data," still queued.
- **Prices checked**: three fresh price points recorded, all first-ever
  checks for these items so nothing to compare against yet — HUMI-CARE
  Crystal Gel Humidification Jar ($10.49, Thompson Cigar), Xikar 10-Cigar
  Travel Humidor ($47.49, Walmart), and Palio Cutter ($21.99, Thompson
  Cigar). No swings to flag.
- **Queue**: no new items added or resolved tonight.
- Build passed cleanly before committing.

## 2026-07-31 — Weekday run: accessories night

Today is an "accessories" night on the 3-way rotation with cigars and
lounges (see CLAUDE.md). Kept it light since it's a weekday.

- **Scores**: looked for a third independent scored source on four
  accessories stuck at 2 reviews — NewAir CC-300H Humidor, Xikar Volta
  table lighter, Palio Cutter, and Xikar PuroTemp Digital (Rectangle)
  Hygrometer. Found real, on-topic editorial reviews for all four (Blind
  Man's Puff on the Volta, Developing Palates on the Palio Cutter,
  SmokeDock on the NewAir, Cigar Advisor on the PuroTemp) — but every one
  of them gave a categorical verdict ("Great — Highly Recommend", an
  enthusiastic writeup, etc.) rather than a numeric score. Since AccScore
  requires a real number and inventing one isn't allowed, none were added.
  All four stay at "insufficient data," same as before.
- **Prices checked**: one clean price found and recorded — Xikar EX Single
  Lighter (Black), $74.99 at Watch City Cigar, first-ever check for this
  item so nothing to compare against yet. Cigars International, CIGAR.com,
  and Best Cigar Prices all blocked the automated fetch (403) for the other
  candidates tried (Palio Cutter, PuroTemp Hygrometer), so those were
  skipped rather than guessed at.
- **News**: no accessory news search done tonight — ran out of easy runway
  after the score/price research above, so didn't start a new search this
  late in the weekday budget.
- **Queue**: nothing new proposed tonight; no owner-approved items were
  waiting to act on.
- **Errors**: none. Site builds cleanly (17,467 pages). Stopping here for
  tonight given the weekday budget.

## 2026-07-29 — Weekday run: lounges night

Today is a "lounges" night on the 3-way rotation (see CLAUDE.md). Keeping it
light since it's a weekday.

- **Ratings research**: looked for new cited ratings on the five lounges
  sitting at exactly 1 source (Debonair Cigar Lounge in LA, Casa de
  Montecristo Manhattan 2nd Ave, Corona Cigar & Diamond Crown Lounge in
  Orlando, Casa de Montecristo by JR Cigar in Mooresville NC, and Casa de
  Montecristo Boca Raton) to try to push them over the 3-source minimum for a
  LoungeScore. No new ratings were added tonight — Yelp and TripAdvisor both
  blocked direct access to their pages, and the secondary sites that mirror
  their numbers either didn't clearly say which platform (Google/Yelp/
  TripAdvisor) their number came from, or turned out to just be repeating a
  rating we'd already recorded. Rather than guess, nothing was written for
  these five — they stay as-is until a source that can be confidently cited
  turns up.
- **New lounge queued**: found The Smoking Cave, a real cigar lounge and
  retailer in Highlands Ranch, CO (south Denver metro), not yet in our
  directory. Added it to the review queue for your approval rather than
  publishing directly — a couple of details (exact walk-in vs. membership
  split, and firm confirmation that indoor smoking is legally permitted
  there) need a quick human check first. See `data/review-queue.json`.
- **Nothing queued or skipped due to errors** beyond the above — the site
  build was verified clean before this was pushed.

## 2026-07-27 — Weekday run: cigars night

Today is a "cigars" night on the 3-way rotation (see CLAUDE.md). Keeping it
light since it's a weekday.

- **Prices checked**: seven Padrón 1964 Anniversary Series Maduro vitolas
  that had never been price-checked before (Diplomatico, Hermoso, Imperial,
  Monarca, Principe, Pyramide, Torpedo), all from Famous Smoke Shop. First
  check for all seven, so nothing to compare against and nothing flagged.
- **Reviews**: looked for a third independent source to clear the 3-source
  StickScore minimum on two queued cigars — Rocky Patel Decade Toro and
  Arturo Fuente Añejo Reserva No. 48 (both currently sit at 2 sources). Found
  plenty of general coverage of both lines, but nothing that was a numeric
  score for that *exact* vitola from a source we don't already have — close
  matches were for different sizes (e.g. a Cigar Dojo review of the Añejo
  No. 888, not the No. 48) or different products entirely (a Cigar Coop
  review of a 2012 Limited Edition Decade, not the regular Toro). Didn't use
  any of them rather than guess at a match. Both stay at 2 sources.
- **News**: added one brief — halfwheel's report that Habanos S.A. is
  moving the Cohiba Talismán into regular production as part of Cohiba's
  60th anniversary. Note this is the Cuban Habanos S.A. Cohiba, a different
  company from the General Cigar-made Cohiba already in our database, so no
  existing catalog entry was linked.
- **Queue**: skimmed data/review-queue.json (235 items) — nothing has an
  owner decision yet, so nothing to action from it tonight.
- **Errors**: none. Site builds cleanly (301,819 pages). Stopping here for
  tonight given the weekday budget.

## 2026-07-26 — Sunday run: lounges night (heavier catalog pass)

Today was a "lounges" night on the 3-way rotation (see CLAUDE.md). Since it's
Sunday, I spent more time on this than a weekday run, focused on pushing
existing lounges over the 3-source minimum for a real LoungeScore, or adding
a first source to ones that had none.

- **BURN by Rocky Patel (Naples, FL)**: added a Yelp rating (4.0/5, ~196
  reviews) alongside its existing Google and TripAdvisor ratings. That's now
  3 independent sources, so it has a real LoungeScore for the first time
  (~84.7/100).
- **The Debonair Cigar Lounge (Los Angeles)**: added its first rating —
  Yelp, 4.8/5, 105 reviews. Still only 1 source, so it stays "insufficient
  data" for now; needs 2 more independent sources before a score can publish.
- Spent a good amount of research time trying to find clean, verifiable
  second/third ratings for several other lounges that only have one source
  today (Orlando's Corona Cigar/Diamond Crown, Mooresville's Casa de
  Montecristo, Boca Raton's Casa de Montecristo, the Manhattan Casa de
  Montecristo). Yelp and TripAdvisor block automated page fetches directly,
  and search results for these gave inconsistent or unclear numbers (several
  low-quality directory sites disagreed with each other on the same venue's
  rating) — rather than guess, I left these alone tonight. Same for a
  handful of "best cigar lounge" list sites (aicigarexplorer.com,
  flavoredtimes.com, cigarworld.com) that turned up in search — I don't know
  these publications well enough to vouch for them as credible, so I didn't
  cite them; if the owner recognizes any of these as legitimate, that'd be
  useful to know.
- **New lounges/cities**: none proposed tonight — didn't find a candidate I
  was confident enough in to write up properly given time spent above.
- **Queue**: nothing new proposed tonight; no owner-approved items were
  waiting to act on.
- **Errors**: none. Site builds cleanly (301,819 pages).

## 2026-07-24 — Weekday run: cigars night

Today was a "cigars" night on the 3-way rotation with accessories and
lounges (see CLAUDE.md). Kept it light since it's a weekday.

- **News**: added one brief — halfwheel's coverage of J.C. Newman shipping
  the fourth LeRoy Neiman Collector's Edition (a 6 1/2 x 56 toro grande,
  same blend as the first three releases, new box art depicting Marilyn
  Monroe serenading President Kennedy). Also logged it on the release
  calendar and cross-linked the two, since J.C. Newman is already a brand
  in our catalog (added a few nights back) — no matching "LeRoy Neiman"
  line exists yet, so nothing to link to the main catalog.
- **Prices checked**: Aging Room Quattro Nicaragua Maestro ($143.99/10-pack,
  Thompson Cigar) and CAO Brazilia Gol! ($152.99/box of 20, Thompson Cigar)
  — both first-ever checks, nothing to compare against, nothing flagged.
  Also looked at Romeo y Julieta Añejo Piramide, but the only pricing found
  online was for the Cuban Habanos "Piramides Añejados" line (a different
  product from our domestic Altadis USA "Romeo Añejo"), so skipped it
  rather than record a mismatched price. Couldn't find a size-matched price
  for Plasencia Alma Fuerte Generación V either, so skipped that too.
- **Scores**: no new critic reviews came in tonight, so nothing needed
  recomputing. (Note for the owner: several queued items, like the Arturo
  Fuente Añejo Reserva No. 48, show up with 3 total review rows but still
  only 2 truly *independent* sources — Cigar Aficionado reviewed it twice.
  That's why they're still sitting at "insufficient data" rather than a
  bug.)
- **Queue**: nothing new proposed tonight; no owner-approved items were
  waiting to act on.
- **Errors**: none. Site builds cleanly (174,073 pages).

## 2026-07-23 — Weekday run: lounges night

Today was a "lounges" night on the 3-way rotation with cigars and
accessories (see CLAUDE.md). Kept it light since it's a weekday. Lounges
have no prices, so the Price refresh step doesn't apply — skipped.

- **Ratings**: tried again to push BURN by Rocky Patel (Naples) — currently
  Google + TripAdvisor, needs just 1 more independent source — over the
  3-source minimum. Yelp and TripAdvisor's own pages both blocked automated
  fetching (403s), and a "Postcard" aggregator site showing 4.5 stars from
  960 reviewers didn't hold up as a genuine independent source since its
  own methodology isn't disclosed (same caution as the Colibri V-Cut
  sentiment-aggregator site skipped on accessories night). Also tried
  Casa de Montecristo (Manhattan 2nd Ave) and Corona Cigar Company &
  Diamond Crown Lounge (Orlando), both at 1 source and needing 2 more —
  found TripAdvisor listings for both but couldn't retrieve the actual
  star numbers (blocked). Nothing recorded rather than guess; all three
  stay at their current source counts, still "insufficient data."
- **New lounge proposed**: found Boston Cigar Club & Shop (73 Main St,
  Charlestown, MA — a Boston neighborhood), a real cigar lounge and shop.
  Boston isn't in our directory yet. Queued it for your review rather than
  adding it directly, since it's a new city — and flagged in the queue item
  itself that public sources are unclear on walk-in vs. membership access
  and don't explicitly confirm indoor smoking is allowed, so that needs a
  quick confirmation before publishing either way. No ratings for it yet.
- **Errors**: none. Site builds cleanly (133,689 pages). Stopping here for
  tonight given the weekday budget.

## 2026-07-21 — Weekday run: cigars night

Today is a "cigars" night on the 3-way rotation (see CLAUDE.md). Keeping it
light for the weekday.

- **News**: added one brief — halfwheel's report that General Cigar is
  bringing the Cohiba Talismán (a 6 1/8 x 54 double toro with a pigtail cap)
  back as a standing, regular-production release as part of Cohiba's 60th
  anniversary celebrations, after previously only appearing in limited runs.
- **Prices checked** (first-ever checks for all four, so nothing to compare
  against and nothing flagged): Davidoff Yamasá Toro ($314.65/case of 12,
  Binny's Beverage Depot), Perdomo 20th Anniversary Sun Grown Epicure
  ($229.99/box of 24, Famous Smoke Shop), E.P. Carrillo Encore Majestic
  ($205.00/box of 20, Windy City Cigars), La Flor Dominicana Double Ligero
  Chisel ($216.97/box of 20, The Cigar Shop).
- **Reviews / scores**: looked for a third source on the queued Padrón 1926
  Serie No. 35 Maduro (currently only Cigar Aficionado). Found a 2011 Cigar
  Coop review of "Padrón 1926 Serie Maduro" and a Leaf Enthusiast score, but
  couldn't confirm the Cigar Coop review was specifically the No. 35 vitola
  (the page returned a 403 to automated fetching) and Leaf Enthusiast isn't
  one of our established sources — didn't use either rather than guess.
  Stays queued.
- Site builds cleanly (38,781 pages). Stopping here for tonight given the
  weekday turn budget — accessories and lounges sit out this rotation, and
  no new brands/lines/scores needed the human review queue tonight beyond
  what was already there. Nothing else needs your attention.

## 2026-07-19 — Sunday run, part 1: accessories night — 3 accessories crossed into a published score
Today is an "accessories" night on the 3-way rotation with cigars and lounges
(day-of-month mod 3 = 1, see CLAUDE.md). Since it's Sunday, a heavier catalog
pass was allowed, so tonight's focus was clearing out accessories stuck at
"2 of 3 sources" in the review queue — a batch of new accessories was added
recently and many are sitting just short of a published AccScore.

- **Scores published for the first time** (found a genuine, independent 3rd
  source — Holt's Cigar Company's own customer-rating average, distinct from
  the retailers already on file for each item — and recomputed):
  - Xikar 009 Punch Cutter: AccScore 95.8 (Holt's: 4.67/5 across 3 reviews)
  - HUMI-CARE Crystal Gel Humidification Jar (4 oz): AccScore 96.7 (Holt's:
    5.00/5 across 8 reviews)
  - Colibri V-Cut Cutter: AccScore 97.3 (Holt's: 5.00/5 across 5 reviews,
    listed there in a Black/Gold finish rather than the Black/Chrome variant
    already on file — same underlying product line)
- **Researched but not used**: tried to find a genuine 3rd numeric source for
  Xikar Volta, Xikar EX, Xikar PuroTemp Digital Hygrometer, Boveda 65% RH
  Size 60, Xikar 10-Cigar Travel Humidor, and the Nathan Scott Lester Cigar
  Log Book. Found real editorial write-ups (Blind Man's Puff, Developing
  Palates) but they gave only qualitative "highly recommend"-style verdicts
  with no numeric score to record — recording a made-up number to hit the
  minimum would violate the "never invent a score" rule, so these stay
  queued. A couple of retailer pages that might have had star ratings
  blocked the fetch (Thompson Cigar, Cigars International, Neptune Cigar on
  some pages). One Blind Man's Puff hygrometer review turned out to cover a
  different (wireless) Xikar product, not the one in our database, so it
  wasn't used either.
- **Errors**: none otherwise. Site builds cleanly (3,309 pages).

- **Prices checked** (5 accessories, all first-ever checks so nothing to
  compare against and nothing flagged): Xikar 009 Punch Cutter ($113.00,
  Humidor Discount), Colibri Quasar Table Lighter ($155.00, Walmart), Vertigo
  Cyclone by Lotus ($14.99, Lotus's own site), Xikar Volta tabletop lighter
  ($164.99, eLighters.com), Colibri V-Cut Cutter ($80.00, Humidor Discount).
  Tried a few more (Palio Cutter, Prestige Import Group Onyx Humidor, Mantello
  Royal Glass-Top Humidor, NewAir CC-300H, HUMI-CARE Crystal Gel Jar) but
  every retailer page tried for those either blocked the fetch or didn't
  show a price in what came back — skipped rather than guess.
- **News**: added one brief — Biz New Orleans' coverage of CigarBros
  unveiling the FreshBox, a roughly 50-cigar desktop humidor system (made
  from recyclable expanded polypropylene, magnetic stacking, 69% Boveda
  humidification) at the April 2026 PCA Trade Show, priced $99.99-$199
  depending on series. It's a whole new system/brand rather than a single
  product we already catalog, so the brief stands alone with no linked
  accessory page for now.
- **Review queue**: unchanged tonight (108 items still waiting on you,
  mostly accessories sitting at "1 or 2 of 3 sources" after last week's
  batch of new additions — no rush, skim whenever you have a few minutes).
- **Errors**: none. Site builds cleanly (3,309 pages) after every step
  tonight. That's everything for tonight's accessories-focus run.

## 2026-07-18 — Weekday run: cigars night — 1 news brief, 3 price checks, 1 release logged
Today was a "cigars" night on the 3-way rotation with accessories and
lounges (day-of-month mod 3 = 0, see CLAUDE.md). Kept it light since it's
a weekday.

- **News**: added one brief — halfwheel's coverage of E.P. Carrillo's new
  Encore Noir II, an all-Nicaraguan limited blend built in the same
  Celestial No. 2 size as our existing Encore Celestial vitola but a
  genuinely different product (mainly international, with a 250-box U.S.
  allotment going to Two Guys Cigars in New Hampshire at $17/cigar for a
  July 24-25 launch event). Didn't link it to the existing Encore Celestial
  page since it's a distinct blend, not the same cigar.
- **Prices checked** (all first-ever checks for these three, so nothing to
  compare against and nothing flagged): Davidoff Nicaragua Toro
  ($306.00/box of 12, Atlantic Cigar Company), Foundation Charter Oak
  Rothschild ($127.99/box of 20, Cigars.com), H. Upmann 1844 Reserve
  Robusto ($207.99/box of 25, Thompson Cigar).
- **Release calendar**: the Encore Noir II news brief is itself a release
  report, so it's now also logged on `/calendar` (E.P. Carrillo Encore Noir
  II, expected July 2026), cross-linked back to the news brief.
- **Reviews / scores**: looked for a third source on the queued Arturo
  Fuente Añejo Reserva No. 48 (currently 2: Cigar Aficionado, Stogies on
  the Rocks). Found general Añejo-line coverage from halfwheel and Cigar
  Dojo, but nothing with a numeric score for this exact No. 48 vitola, and
  no retailer user-rating average either — didn't use it, stays queued.
- **Errors**: none. Site builds cleanly (2770 pages). Stopping here for
  tonight given the weekday budget.

## 2026-07-17 — Weekday run: lounges night — 1 lounge crosses LoungeScore threshold
Today was a "lounges" night on the 3-way rotation with cigars and
accessories (see CLAUDE.md). Kept it light since it's a weekday. Lounges
don't have a price-refresh step (no pricing on lounge pages), so tonight's
work focused on finding new cited ratings for existing lounges.

- **Ratings found**: added a TripAdvisor rating for Grand Havana Room
  (Beverly Hills) — 5.0/5 from 7 reviews, cited via OverlookMaps.com. That
  was its third independent source (it already had Google and Yelp), so it
  published a LoungeScore for the first time tonight: 94.7.
- **Tried and couldn't confirm**: looked for a third source on BURN by
  Rocky Patel (Naples, currently at 2: Google + TripAdvisor). Found a 2020
  Cigar Journal editorial feature on the lounge, but it carries no numeric
  score, so it can't feed the aggregate — skipped rather than force a
  number that isn't there. Also tried to confirm exact Yelp/TripAdvisor
  star ratings for Casa de Montecristo's Manhattan (2nd Ave) location
  (currently at 1: Google only) and Corona Cigar Company & Diamond Crown
  Lounge in Orlando (also at 1), but couldn't verify exact numbers from
  what was reachable tonight — several review sites blocked automated
  fetches. Left both queued as before rather than guess at a figure.
- **New lounges/cities**: none proposed tonight — stayed focused on
  pushing existing "insufficient data" lounges toward the 3-source minimum
  given the weekday budget.
- **Errors**: TripAdvisor and Yelp blocked direct page fetches (403) for
  a couple of lookups tonight; worked around it via search snippets and an
  aggregator site (OverlookMaps.com) where the numbers could be
  cross-confirmed, and skipped anywhere they couldn't be. Site builds
  cleanly (2287 pages). Stopping here for tonight given the weekday budget.

## 2026-07-16 — Weekday run, part 1: cigars night — 1 news brief, 2 price checks
Today was a "cigars" night on the even/odd alternation with the accessories
side (see CLAUDE.md).

- **News**: added one brief — halfwheel's coverage of E.P. Carrillo's Deep
  Blue Limited Edition 2026, a single 6 x 56 "Hades" toro extra (Jalapa,
  Nicaragua wrapper, Honduran binder, Nicaraguan filler), $22/stick, capped
  at 2,500 numbered boxes of 20. E.P. Carrillo is already in our database
  but this Deep Blue line isn't yet, so the brief stands alone with no
  linked cigar page.
- **Prices checked** (both first-ever checks for these two, so nothing to
  compare against and nothing flagged): Camacho Corojo Robusto ($185.99/box
  of 20, JR Cigars), Alec Bradley Prensado Robusto ($292.99/box of 24, JR
  Cigars). Couldn't pin down a clean box price for Davidoff Nicaragua Toro
  (most retailers listed it in boxes of 12 without a clear box total, or the
  page 404'd) — skipped rather than guess.
- Site builds cleanly (1448 pages) after these additions.

**Update, same run**: found a genuine third source for the queued Oliva
Serie V Maduro Toro (only 2 sources before) — a Holt's Cigar Company staff
review (92/100, dated 2021-05-20) confirmed to carry a real numeric score.
That brings it to 3 independent sources, so StickScore is now published:
95.3. Rewrote its summary review and consensus tasting notes to reflect the
new score (all three sources single out consistent construction and
maduro-driven sweetness). Removed it from the review queue. Didn't attempt
sub-scores (flavor/construction/complexity/value) — the source text doesn't
give enough detail to back all four honestly, so left them unset rather than
guess. Site still builds cleanly (1448 pages).

If an entry starts with **NEEDS-ATTENTION**, something didn't go cleanly and
is worth a look. Otherwise, everything below was routine.

Check `data/review-queue.json` weekly for anything waiting on your approval —
new brands/lines, unusual price swings, and low-confidence scores all land
there instead of publishing automatically.

---

## 2026-07-15 — Weekday run: accessories night
Today was an "accessories" night on the even/odd alternation with the cigar
side (see CLAUDE.md). Kept it light since it's a weekday.

- **News**: added one brief — Cigar Aficionado's coverage of Les Fines
  Lames' Flying Tigers Limited Edition accessories for America's 250th
  anniversary: a $199 Le Petit cigar knife and a $125 Duo leather cigar
  case, both finished in black with the WWII squadron's shark-mouth motif,
  only 250 of each made. Neither product is in our database yet, so the
  brief stands alone.
- **Prices checked**: Quality Importers Capri Glasstop Desktop Humidor —
  $20.00 (on sale from $49.99) at Wilke Pipe Tobacco, the first-ever price
  check for this item, so nothing to compare against and nothing flagged.
  Tried to also price the Prestige Import Group Onyx humidor and the Xikar
  Xi1 cutter, but every retailer page I tried (Walmart, Pipes and Cigars,
  Best Cigar Prices, Humidor Enthusiast, Xikar's own site) either blocked
  the fetch (403/429) or didn't render pricing — skipped both rather than
  guess.
- **Reviews / scores**: found a genuine third independent source for the
  queued Xikar Xi2 cutter — Holt's Cigar Co. (4.71/5, 7 verified-buyer
  ratings), joining HumidorDiscount.com and Famous Smoke Shop. That crosses
  the 3-source minimum, so it now has a published AccScore of 88.7 and has
  been removed from the review queue. Also looked for a third source on the
  Xikar Volta table lighter (still stuck at 2: Holt's, Wayfair) but didn't
  find anything new — stays queued as before.
- **Errors**: none. Site builds cleanly (1,427 pages). Stopping here for
  tonight given the weekday budget.

## 2026-07-13 — Weekday run, part 1: accessories night — 1 news brief, 2 price checks
Today was an "accessories" night on the even/odd alternation with the cigar
side (see CLAUDE.md).

- **News**: added one brief — Cigar Aficionado's coverage of J.C. Newman's
  America250 Cigar Humidor, a $2,750, 50-piece limited run made with Milwaukee
  Humidor Co. featuring a marquetry map of the U.S. and shipping with 50 of a
  new all-American cigar, The American Perfecto. Neither the humidor nor
  J.C. Newman is in our database yet, so the brief stands alone with no linked
  product page.
- **Prices checked** (both first-ever checks, so nothing to compare against
  and nothing flagged): TISFA Acrylic Desktop Cigar Humidor ($19.98 at XIFEI,
  the maker's own site) and Blazer PB207 "The Torch" ($49.00 at Simrell
  Collection). Tried three different retailer pages for the Xikar Volta table
  lighter (Cigar.com, CigarPlace.biz, Quality Importers, BestCigarPrices) —
  all blocked the fetch (403) or didn't show a usable price, so it was
  skipped rather than guessed.
- **Reviews / scores**: looked for a genuine third source for the Xikar Volta
  (currently has 2: Holt's Cigar Co., Wayfair). Found a listing on
  humidorenthusiast.com and a Neptune Cigar product page, but neither carries
  a customer rating or review — just retailer listings with no reviews
  submitted. A "cigaraccessories.review" result from search didn't resolve to
  a real site, so it wasn't used. No new score added; stays queued as
  insufficient sources.
- **Errors**: none otherwise. Site builds cleanly.

## 2026-07-12 — Sunday catalog pass, part 1: 1 news brief, 6 price checks
Today's Sunday, so a heavier catalog pass was allowed — more price checks than
a typical weekday.

- **News**: one brief — nine premium cigar makers (including Arturo Fuente,
  Oliva, My Father Cigars, Padrón, and Rocky Patel, all brands we carry) sued
  the FDA in the U.S. Court of Federal Claims for $10M+ in user-fee refunds,
  following the industry's earlier win exempting premium cigars from FDA
  regulation. Source: halfwheel, July 10.
- **Prices checked** (all recorded, none flagged as unusual swings):
  AJ Fernandez New World Toro ($167.99/box of 21, JR Cigars, first-ever
  check), AJ Fernandez San Lotano Requiem Toro ($174.99/box of 20, JR Cigars,
  first-ever check — matched to the Habano wrapper variant specifically,
  since that's the one that's actually 6"x54 like our record), Montecristo
  Classic No. 2 Torpedo ($415.99/box of 20, JR Cigars, first-ever check),
  Padrón 1964 Anniversary Exclusivo Maduro ($409.99/box of 25, JR Cigars),
  Arturo Fuente Hemingway Short Story ($178.99/box of 25, JR Cigars), Rocky
  Patel Decade Toro ($256.99/box of 20, JR Cigars).
- **Skipped, not guessed**: Davidoff Yamasa Toro — two retailers' pages
  wouldn't reveal a clean price tied to a specific box size. Romeo Añejo
  Piramide — kept finding a same-named-but-different "Romeo by Romeo y
  Julieta" line instead of the actual Añejo line; skipped rather than record
  a mismatched price. Oliva Serie V Melanio Robusto — found the right JR
  Cigars product page but couldn't get pricing off it. None of these were
  guessed at.
## 2026-07-12 — Sunday catalog pass, part 2: spec conflict resolved, no new scores
- **Davidoff Nicaragua Toro spec conflict resolved**: last night's queue item
  flagged that JR Cigars showed 5.5"x50 while our database says 5.5"x54.
  Checked two more independent sources (Neptune Cigar's listing and a
  broader search including Davidoff's own specs) — both confirm 5.5"x54.
  Our database was right; JR Cigars' page appears to be the outlier (maybe
  a mislabeled listing). Removed the queue item — nothing for you to decide
  here. Didn't record a new price against it tonight since I couldn't get a
  clean price from a source I'd already confirmed matches on size; that can
  happen another night.
- **Reviews / scores**: tried to find genuine third sources for two
  cigars close to the 3-source threshold — AJ Fernandez New World Toro
  (needs 1 more) and Rocky Patel Decade Toro (needs 1 more). For New World,
  everything findable was for different sub-lines (Dorado, Connecticut,
  Puro Especial) rather than the plain Toro in our database. For Decade,
  found a Holt's Cigar Co. staff review but its score covered the whole
  Decade line, not the Toro vitola specifically. Didn't use either — same
  "must match the exact vitola" standard as previous nights. No new scores
  added; both stay queued as before.
- **Errors**: none. Site builds cleanly (380 pages). That's everything for
  tonight's heavier Sunday pass — a fuller batch of price checks than usual,
  one industry news brief, and one queue item cleared.

## 2026-07-04 — Weekday run: 1 price, 1 news brief
Kept it light since it's a weekday. What happened:

- **Prices checked**: Oliva Serie V Melanio Robusto — $98.95 for a box of 10
  from Famous Smoke Shop (currently on a 35%-off sale). This is the first
  price ever recorded for this one, so there was nothing to compare against
  and nothing got flagged.
- **Also checked but skipped**: Rocky Patel Vintage 1990 Toro (the retailer
  page showed a suspiciously high single-stick price with box options that
  wouldn't resolve, so I didn't trust it) and Davidoff Nicaragua Toro (the
  site that had a clear price blocked the request). Rather than guess, both
  are left for another night.
- **News**: added one brief — halfwheel's report that Drew Estate's CEO,
  Glenn Wolfson, passed away on June 29 at age 70. No changes expected to
  Liga Privada or Undercrown lines.
- **Reviews / scores**: no new critic reviews found tonight, so no
  StickScores changed.
- **Errors**: none. Site builds cleanly.
- Nothing new was added to `data/review-queue.json` this run — it still has
  23 items waiting on you whenever you have a few minutes.

## 2026-07-04 — NEEDS-ATTENTION: fallback commit
The nightly run left uncommitted changes (Claude exit code: 1).
Committed automatically so nothing is lost; please check this run's logs in the Actions tab.

## 2026-07-04 — Weekday run: 3 prices, 1 news brief
Kept it light since it's a weekday. What happened:

- **Prices checked**: Padron 1964 Anniversary Exclusivo Maduro ($409.99/box of
  25), Arturo Fuente Hemingway Short Story ($178.99/box of 25), and Rocky
  Patel Decade Toro ($256.99/box of 20) — all from JR Cigars. These are the
  first price checks ever recorded for these three, so there was nothing to
  compare against and nothing got flagged.
- **Also checked but skipped**: Oliva Serie V Melanio Robusto and Liga Privada
  No. 9 Toro — the retailer pages I could reach didn't clearly state the box
  size for the price shown, so rather than guess I skipped both. They can be
  rechecked another night.
- **News**: added one brief — Cigar Aficionado's report that Casa Carrillo is
  bringing back its "Pledge of Allegiance" Toro for July 4th this year.
- **Reviews / scores**: no new critic reviews were added tonight. I looked for
  additional independent sources for a few of the cigars sitting in your
  review queue (waiting on a 3rd source) but couldn't confirm real scores
  with dates and links I was confident in, so I left the queue as-is rather
  than risk adding shaky data. That catch-up work is better suited to the
  heavier Sunday session.
- **Errors**: none. Site builds cleanly.
- Nothing new was added to `data/review-queue.json` this run — it still has
  23 items waiting on you whenever you have a few minutes.

## 2026-07-04 — NEEDS-ATTENTION: fallback commit
The nightly run left uncommitted changes (Claude exit code: 1).
Committed automatically so nothing is lost; please check this run's logs in the Actions tab.

## 2026-07-06 — NEEDS-ATTENTION: run did not finish cleanly
This is a quota issue, not a bug: the nightly automation shares your Claude Pro usage limit with your own daytime use, and tonight's budget was already used up. Nothing to fix — it'll work again once your quota resets. Nothing was changed or committed tonight.

## 2026-07-07 — Weekday run: 3 prices, 1 news brief
Kept it light since it's a weekday. What happened:

- **Prices checked**: Padrón 1926 Serie No. 35 Maduro ($391.99/box of 24),
  My Father Flor de las Antillas Toro ($166.99/box of 20), and Montecristo
  White Series Toro ($412.99/box of 27) — all from JR Cigars. These are the
  first price checks ever recorded for these three, so there was nothing to
  compare against and nothing got flagged.
- **News**: added one brief — halfwheel's report that Arturo Fuente's 2026
  Father & Son sampler (shipped June 12, $275 MSRP) includes two new cigars:
  a Fuente Fuente OpusX 25 Double Robusto and a new Don Carlos The Man
  honoring the line's 50th anniversary.
- **Reviews / scores**: tried to find a third independent source for a few
  cigars sitting in your review queue (waiting on one more source each), but
  halfwheel's site blocked every page fetch tonight (a "payment required"
  response, same kind of block seen on other sites in past runs). Rather
  than guess at a score, I left the queue as-is. Worth another try on a
  future night, ideally the heavier Sunday session.
- **Errors**: none otherwise. Site builds cleanly.
- Nothing new was added to `data/review-queue.json` this run — it still has
  23 items waiting on you whenever you have a few minutes.

## 2026-07-08 — Weekday run: 3 prices, 1 news brief
Kept it light since it's a weekday. What happened:

- **Prices checked**: Rocky Patel Vintage 1990 Toro ($216.99/box of 20),
  Liga Privada No. 9 Toro ($429.99/box of 24), and Romeo y Julieta Reserva
  Real Toro ($253.99/box of 25) — all from JR Cigars. These are the first
  price checks ever recorded for these three, so there was nothing to
  compare against and nothing got flagged.
- **News**: added one brief — Cigar Aficionado's report that Davidoff's
  parent company posted 2.5% sales growth for 2025 (545.3 million Swiss
  francs, about $680 million) and made over 36 million cigars, crediting
  the Davidoff and Zino lines plus expanded production in the Dominican
  Republic and Honduras.
- **Reviews / scores**: found a lead on a possible new Cigar Aficionado
  score for My Father Le Bijou 1922 Toro (93 points, May/June 2026 issue),
  but when I checked the cigar's actual rating page directly it still
  showed the same 90-point review from 2021 already in the database — so
  the "93" wasn't a confirmed, distinct data point and I didn't add it
  rather than risk a wrong score. No new critic reviews added tonight, and
  no vitola had enough new sources to recompute its StickScore. halfwheel
  was blocked again tonight (payment-required response), same as recent
  runs.
- **Errors**: none. Site builds cleanly.
- Nothing new was added to `data/review-queue.json` this run — it still has
  23 items waiting on you whenever you have a few minutes.

## 2026-07-06/08 — Manual catch-up session (owner-requested, not automated)
The automation had been failing (quota limits, then a scheduling bug, both
now fixed), so the owner asked to do a session of the same work by hand
instead of waiting further. The automation started succeeding on its own
partway through this session and kept running nightly while this work was
in progress — this entry's numbers are reconciled against all of that,
not just a single snapshot.

- **New reviews found**: 8 of 13 cigars stuck at "2 of 3 sources" got a
  genuine 3rd independent review and now have real StickScores for the
  first time, with sub-scores and rewritten summaries: Hemingway Short
  Story, Serie V Melanio Robusto, Flor de las Antillas Toro, My Father
  Robusto, Rocky Patel Vintage 1990 Toro, Liga Privada No. 9 Toro,
  Undercrown Maduro Gran Toro, and Davidoff Nicaragua Toro. The other 5
  (Añejo Reserva No. 48, Serie V Maduro Toro, Decade Toro, New World Toro,
  Montecristo White Series) stay queued.
- **Prices checked**: 8 more vitolas got a price check. A few turned out to
  overlap with prices the automation checked independently on its own
  nightly runs around the same time — all landed on the same real prices,
  a good consistency signal. Both are kept; price history is meant to
  accumulate checks over time.
- **News**: added two more briefs (Wildfire Cigar Co.'s Radio Octave, and a
  new AJ Fernandez-made Romeo y Julieta Reserva Real Nicaragua Profundo —
  a different product from the Reserva Real already in this database, not
  linked to it).
- **Review queue**: 23 → 15 items.
- Lesson for future sessions: when doing manual work alongside an active
  automation, `git fetch` and reconcile immediately before every commit,
  not just once — real work can land from either side at any time, and
  price/critic-review data is additive by design so overlaps are rarely
  a real conflict, just something to check for.

## 2026-07-09 — NEEDS-ATTENTION: run did not finish cleanly
This is a quota issue, not a bug: the nightly automation shares your Claude Pro usage limit with your own daytime use, and tonight's budget was already used up. Nothing to fix — it'll work again once your quota resets. Nothing was changed or committed tonight.

## 2026-07-09 — Weekday run, part 1: 3 prices, 1 news brief, 1 spec conflict queued
Quota was available for a second try tonight. Kept it light since it's a weekday.

- **News**: added one brief — Cigar Aficionado's report from the 2026 PCA
  Trade Show that Oliva will release a Serie V Melanio Edición Año 2026 in a
  tapered Perfecto Round shape, expected this fall.
- **Prices checked**: My Father Le Bijou 1922 Toro ($261.99/box of 23),
  Liga Privada T52 Toro ($429.99/box of 24), and Montecristo Epic Toro
  ($172.99/box of 10) — all from JR Cigars, all first-ever price checks for
  these three, so nothing to compare against and nothing flagged.
- **Spec conflict found and queued, not guessed**: tried to check a price
  for Davidoff Nicaragua Toro, but JR Cigars lists that vitola as 5.5" x 50
  ring gauge while our database has it as 5.5" x 54. Rather than record a
  price against a size that might not match, I skipped it and added it to
  the review queue for you to confirm which is correct.
- **Reviews / scores**: looked for a third source on a couple of queued
  cigars (Arturo Fuente Añejo Reserva No. 48, Montecristo Epic Toro).
  Found a Cigar Dojo review, but it turned out to be for a different
  sub-line (Epic Vintage 12, not the regular Epic) so I didn't use it.
  Another candidate source (CigarSense.com) blocked the fetch. No new
  scores added tonight.
- **Errors**: none otherwise. Site builds cleanly. That's everything for
  tonight — kept it deliberately light since it's a weekday.

## 2026-07-10 — Weekday run: 1 news brief, 3 first-ever price checks
Kept it light again since it's a weekday. Today was a "cigars" night on the
even/odd alternation with the accessories side (see CLAUDE.md).

- **News**: added one brief — halfwheel's review of the E.P. Carrillo (Casa
  Carrillo) Deep Blue Limited Edition 2026, a 6 x 56 toro extra with a
  Jalapa, Nicaragua wrapper. This brand isn't in our database yet, so the
  brief stands alone with no linked cigar page.
- **Prices checked** (all first-ever checks for these three, so nothing to
  compare against and nothing flagged): My Father No. 1 Robusto ($232.99/box
  of 23, JR Cigars), Undercrown Maduro Gran Toro ($225.99/box of 25, JR
  Cigars), Romeo y Julieta 1875 Bully ($177.99/box of 25, JR Cigars).
- **Reviews / scores**: tried to find a genuine third source for a couple of
  queued "insufficient sources" cigars (Montecristo Epic Toro, Rocky Patel
  Decade Toro). For Epic, everything findable was for the Vintage 12 or
  Craft Cured sub-lines, not the plain Epic Toro already in our database —
  didn't use it, since it's a different product. For Decade, only saw an
  unverifiable secondhand mention of a Cigar Snob score with no reviewable
  page behind it — skipped rather than record a score I couldn't confirm
  firsthand. No new scores added tonight; both stay queued as before.
- **Errors**: none. Site builds cleanly. Stopping here for tonight given the
  weekday budget — nothing left mid-task.

## 2026-07-11 — Weekday run, part 1: accessories night — 1 news brief, 1 price check
Today was an "accessories" night on the even/odd alternation with the cigar
side (see CLAUDE.md).

- **News**: added one brief — halfwheel's coverage from the PCA 2026 trade
  show of a Brizard & Co. collaboration with Arturo Fuente, Florence
  marquetry artisan Christian Maccarrone, and S.T. Dupont: a $5,700
  limited-edition (99 pieces) Le Grand lighter. No accessory in our database
  yet to link it to, so the brief stands alone.
- **Prices checked**: Case Elegance Renzo Glass Top Humidor — $97.65 on the
  maker's own site (on sale from $114.99), the first-ever price check for
  this item, so nothing to compare against and nothing flagged. Couldn't
  find a listed price on Bespoke Post to add a second retailer.
- **Reviews / scores**: the Renzo already has 3 sources and a published
  AccScore (99.4); didn't go looking for more since it already clears the
  minimum.
- **Errors**: none. Site builds cleanly.

## 2026-07-13 — NEEDS-ATTENTION: run did not finish cleanly
The run exited with code 1. Check this run's logs in the Actions tab for details. Whatever partial work was done is committed below.

## 2026-07-14 — Weekday run: cigars night
Today was a "cigars" night on the even/odd alternation with the accessories
side (see CLAUDE.md). Kept it light since it's a weekday.

- **News**: added one brief — halfwheel's coverage of CAO's limited-edition
  America 250th Anniversary, an all-American-tobacco 5.5 x 55 box-pressed
  robusto (broadleaf/Connecticut shade wrapper, Connecticut habano binder,
  broadleaf/Pennsylvania filler) rolled in Nicaragua, $9.99/stick in boxes
  of 10. CAO is already in our database but this America line isn't yet, so
  the brief stands alone with no linked cigar page.
- **Prices checked** (all first-ever checks for these three, so nothing to
  compare against and nothing flagged): Ashton VSG Robusto ($353.28/box of
  24, Casa de Montecristo), Tatuaje Black Label Corona Gorda ($189.00/box of
  20, Atlantic Cigar Company), Illusione Epernay Le Taureau ($324.00/box of
  25, Atlantic Cigar Company).
- **Reviews / scores**: looked for a third source on the queued Liga Privada
  T52 Toro (currently only 1 source, Cigar Aficionado). Found halfwheel
  reviews, but for different vitolas (Parejo, Double Corona) not the Toro in
  our database, and a Cigar Coop mention with no numeric score attached —
  didn't use either. No new scores added tonight; stays queued.
- **Errors**: none. Site builds cleanly (916 pages). Stopping here for
  tonight given the weekday budget.

## 2026-07-17 — NEEDS-ATTENTION: run did not finish cleanly
The run exited with code 1. Check this run's logs in the Actions tab for details. Nothing was changed or committed tonight.

## 2026-07-20 — Weekday run: lounges night
Today was a "lounges" night on the 3-way rotation with cigars and
accessories (see CLAUDE.md). Kept it light since it's a weekday. Lounges
have no prices, so the Price refresh step doesn't apply on a lounges night —
skipped, nothing to check.

- **Ratings**: tried to push two lounges that already have 2 sources or
  close to it over the 3-source minimum needed to publish a LoungeScore.
  For BURN by Rocky Patel (Naples) — currently Google + TripAdvisor, needs
  just 1 more — checked Yelp, Facebook, and a couple of aggregator sites for
  a third independent number, but Yelp's real page blocked automated
  fetching and the aggregator sites either didn't disclose where their
  rating came from or gave inconsistent counts, so nothing was recorded
  rather than guess. Also checked Casa de Montecristo (Manhattan 2nd Ave)
  for a second source; same problem — Yelp shows 217 reviews but the actual
  star number wasn't retrievable. Both stay at their current source counts,
  still "insufficient data."
- **New lounge proposed**: found Churchill's Fine Cigars in Phoenix, AZ (a
  real, walk-in, indoor-smoking-welcomed cigar lounge — address, phone, and
  hours confirmed from the lounge's own site) — Phoenix isn't in our
  directory yet. Queued it for your review rather than adding it directly,
  per the rules for a brand-new city. No ratings for it yet either way.
- **Errors**: none. Site builds cleanly (12,981 pages). Stopping here for
  tonight given the weekday budget.

## 2026-07-22 — Weekday run: accessories night
Today was an "accessories" night on the 3-way rotation with cigars and
lounges (see CLAUDE.md). Kept it light since it's a weekday.

- **Reviews / scores**: went looking for a third independent source on a
  batch of accessories that already have 2 sources and just need 1 more to
  clear the 3-source minimum (Xikar Volta, NewAir CC-300H humidor, Palio
  Cutter, Boveda 65% RH Size 60, Colibri V-Cut). Found several candidate
  review pages, but none held up: two gave only qualitative verdicts with no
  numeric score to record (Blind Man's Puff on the Xikar Volta, SmokeDock and
  CigarWeekly on the NewAir — the latter also blocked automated fetching),
  one product-identity match was too uncertain to use (a "CAO Palio Cutter"
  page that may or may not be the same item as our "Palio Cutter"), one only
  had reviews for a different pack size (HumidorDiscount's Boveda 320g, not
  our Size 60), and one looked like an automated sentiment-aggregator site of
  uncertain credibility rather than a genuine editorial source (a "9.88/10"
  figure on bestviewsreviews.com for the Colibri V-Cut). Didn't use any of
  them rather than guess. All five stay at their current source counts,
  still "insufficient data."
- **Prices checked** (both first-ever checks for these two, so nothing to
  compare against and nothing flagged): Xikar Xi1 cutter ($67.99, Cigars
  International), Lotus Brawn torch lighter ($46.99, Cigars International).
  Tried a few more (NewAir CC-300H, Zico ZD-60, Xikar EX) but couldn't get a
  clean current price from a reachable page, so skipped them rather than
  guess.
- **News**: added one brief — Cigar Journal's coverage of Quality Importers'
  April 2026 PCA trade-show lineup (redesigned Xikar Allume lighters, a $199
  leather travel case, two new cabinet humidor models, new Stinky ashtray
  colorways). No specific new SKUs added to the catalog yet since exact model
  names and independent reviews aren't confirmed.
- **Queue**: nothing new proposed tonight; no owner-approved items were
  waiting to act on.
- **Errors**: none. Site builds cleanly (67,819 pages). Stopping here for
  tonight given the weekday budget.

## 2026-07-24 — NEEDS-ATTENTION: run did not finish cleanly
The run exited with code 1. Check this run's logs in the Actions tab for details. Whatever partial work was done is committed below.

## 2026-07-25 — NEEDS-ATTENTION: run did not finish cleanly
The run exited with code 0. Check this run's logs in the Actions tab for details. Whatever partial work was done is committed below.

## 2026-07-25 — NEEDS-ATTENTION: run did not finish cleanly
The run exited with code 0. Check this run's logs in the Actions tab for details. Whatever partial work was done is committed below.

## 2026-07-25 — NEEDS-ATTENTION: run did not finish cleanly
The run exited with code 0. Check this run's logs in the Actions tab for details. Whatever partial work was done is committed below.

## 2026-07-25 — NEEDS-ATTENTION: run did not finish cleanly
The run exited with code 0. Check this run's logs in the Actions tab for details. Whatever partial work was done is committed below.

## 2026-07-25 — NEEDS-ATTENTION: run did not finish cleanly
The run exited with code 0. Check this run's logs in the Actions tab for details. Whatever partial work was done is committed below.

## 2026-07-26 — NEEDS-ATTENTION: run did not finish cleanly
This is a quota issue, not a bug: the nightly automation shares your Claude Pro usage limit with your own daytime use, and tonight's budget was already used up. Nothing to fix — it'll work again once your quota resets. Nothing was changed or committed tonight.

## 2026-07-28 — Weekday run: accessories night
Tonight was an "accessories" night on the 3-way rotation with cigars and
lounges (see CLAUDE.md). Kept it light since it's a weekday.

- **Scores**: looked for a genuine 3rd independent numeric-score source for
  three accessories stuck at 2 sources (Xikar EX soft-flame lighter, Xikar
  PuroTemp Digital Hygrometer — rectangular model, and Xikar Crystal Gel
  Humidifier Jar 4oz). Retailer product pages (Neptune Cigar) didn't expose
  ratings to an automated fetch, and Amazon blocked the request outright, so
  none of the three could be confirmed tonight. All three stay "insufficient
  data" rather than guessing at a number.
- **Prices checked**: one clean price found and recorded — Zippo Yellow Flame
  Butane Lighter Insert, $16.96 at Chicago Knife Works (first-ever check for
  this item, so nothing to compare against). Also tried the Palio Cutter and
  Visol Arnold Crystal 4-Cigar Ashtray, but couldn't get a clean current price
  from a reachable page (and for Palio, couldn't confirm which specific Palio
  cutter model our listing matches), so skipped both rather than guess.
- **News**: no accessory news item added tonight. The one clearly-sourced
  candidate found (Daniel Marshall's two humidor collaborations with Arnold
  Schwarzenegger) turned out to be from October 2025, not new. A more recent
  lead (CigarBros' FreshBox humidor system, via halfwheel) couldn't be
  confirmed with a real publish date after the article itself returned a
  paywall error, so it was left out rather than guessing at a date.
- **Queue**: nothing new proposed tonight; no owner-approved items were
  waiting to act on.
- **Errors**: none. Site builds cleanly (334,507 pages). Stopping here for
  tonight given the weekday budget.

## 2026-07-30 — Weekday run: cigars night
Today is a "cigars" night on the 3-way rotation with accessories and lounges
(see CLAUDE.md). Kept it light since it's a weekday.

- **News**: added one brief — Cigar Aficionado's coverage of My Father's new
  Le Bijou 1922 100 Años Corona Especial, a 6 1/2 x 44 limited edition
  ($14/cigar, boxes of 22, limited to 1,922 boxes, rolled in Estelí,
  Nicaragua). Le Bijou 1922 is already in our database but this specific
  limited-edition size isn't yet cataloged, so the brief stands alone with
  no linked cigar page for now.
- **Scores**: looked for a third independent source on the queued Liga
  Privada T52 Toro (stuck at 1 source, Cigar Aficionado). Found only a
  Cigar Coop piece confirming it was their 2009 Cigar of the Year, with no
  numeric score attached, and no Cigar Dojo/Cigar Snob review of the Toro
  size specifically — stays queued, nothing added.
- **Prices checked**: picked three never-before-checked vitolas. Romeo y
  Julieta Romeo Añejo Piramide was skipped — every retailer page tried
  (Cigar Country, Atlantic Cigar) either 403'd or returned data that looked
  like a fetch/parsing error (identical single and box price). The other
  two came back clean, both first-ever checks so nothing to compare
  against: Crowned Heads Le Carême Robusto, $238.99/box of 24 at JR Cigars
  (currently listed as sold out, but that's a stock-status detail our price
  history doesn't track); Plasencia Alma Fuerte Generación V, $247.99/box of
  10 (their current sale price) at Famous Smoke Shop.
- **Errors**: none. Site builds cleanly. Stopping here for tonight given the
  weekday budget — score recompute had nothing new to act on since no new
  critic reviews were confirmed tonight.

## 2026-08-05 — Weekday run: lounges night
Today is a "lounges" night on the 3-way rotation with cigars and accessories
(see CLAUDE.md). Kept it light since it's a weekday. Not a Sunday, so no
queue triage this run.

- **Ratings**: tried to find a 3rd independent numeric-score source for
  lounges sitting at 1-2 sources — closest was Casa de Montecristo by JR
  Cigar (Mooresville, NC), already at 2 (Google, Foursquare) and just
  needing one more. Yelp and TripAdvisor both blocked automated access
  (403) for every lounge tried, same pattern as accessory retailer pages in
  past runs, and search-summary tools gave inconsistent, unverifiable
  numbers for the same listing on repeat queries — since a rating is a
  factual claim I won't publish a number I can't confirm directly from the
  source page. No lounge scores changed tonight.
- **New lounge/city proposed**: Washington, DC has no lounges in our
  directory yet. Found Shelly's Back Room, a well-known DC cigar lounge
  covered by Cigar Aficionado, and confirmed its address/phone directly
  from the business's own site plus DC's official tourism listing. Queued
  it (reason: new_lounge_city) rather than adding it directly, since new
  cities always need your sign-off first — hours, walk-in-vs-membership,
  and smoking policy still need sourcing before it could actually be added.
- **Errors**: none. Site builds cleanly (18,390 pages). Stopping here for
  tonight given the weekday budget.

## 2026-08-09 — Sunday run: cigars night (heavier catalog pass, plus weekly queue triage)
Today is a "cigars" night on the 3-way rotation with accessories and lounges
(see CLAUDE.md). It's Sunday, so a heavier catalog pass was allowed, and
this is also queue-triage day — more on that below. Writing this in pieces
as the run goes, per tonight's instructions, so nothing gets lost if the
turn budget runs out.

- **News**: added one brief — Room101's 17th Anniversary cigar (an
  AJ Fernandez-blended all-Nicaraguan puro, 6 x 52 toro, $15.89/cigar),
  which began shipping August 7, 2026, confirmed via Cigar Snob Magazine.
  Also logged it on the release calendar and linked the two together.
- **Scores**: looked for a third independent source on Ashton VSG Robusto
  (stuck at 2 sources). Found a halfwheel review and a Cigar Dojo review,
  but on closer look the halfwheel one was for the "Robusto Especial" and
  the Cigar Dojo one was for the Belicoso — different vitolas, so neither
  could be counted without risking mixing data across products. Stays
  queued, nothing added.
- **Prices checked** (4 vitolas, all first-ever checks so nothing to
  compare against yet): Liga Privada No. 9 Robusto, $406.99/box of 24 at JR
  Cigars; Fuente Fuente OpusX Double Corona, $74.99 single / $2,399.99/box
  of 32 at Cigars Direct (currently sold out there, but that's a
  stock-status detail our price history doesn't track); Montecristo
  Classic Robusto, $309.99/box of 20 at JR Cigars; Rocky Patel Decade
  Robusto, $111.99 for a 10-count pack at JR Cigars (also currently sold
  out there); My Father Flor de las Antillas Robusto, $161.99/box of 20 at
  JR Cigars. Two more were attempted and skipped: Davidoff Nicaragua
  Robusto (couldn't find a working current product page after several
  tries) and Undercrown Maduro Corona Doble (the only "Corona Doble" page
  found at JR was actually the Undercrown 10th Anniversary line — 7 x 50,
  different wrapper spec from our catalog's 7 x 54 Mexican San Andrés
  Corona Doble — so it was skipped rather than risk recording the wrong
  product's price).
- **Score recompute**: nothing to recompute tonight — no new critic reviews
  were confirmed.
- **Weekly queue triage** (Sundays only): the queue had 256 items, but only
  one was a genuinely-new-entity proposal needing a decision — everything
  else was informational (insufficient-sources gap notes, conflicting-facts
  notes, etc.) and left alone as instructed. The one decision:
  - **Approved and added**: Shelly's Back Room, a cigar tavern in
    Washington, DC, queued last Sunday (2026-08-05). Re-checked all three
    of that entry's sources tonight — the venue's own site, Cigar
    Aficionado's feature, and DC's official tourism listing — and all
    three are still live and still say what the queue entry claimed:
    real address (1331 F Street NW), real phone, a genuine cigar lounge.
    Nothing in git history or past run-log entries conflicts with adding
    it. Added it as our first Washington, DC lounge with the facts that
    were cleanly sourced (address, phone, website, overview, and indoor
    smoking marked "allowed" — DC's tourism site describes the venue's own
    ventilation system as built "for smokers & non-smokers alike," and
    Cigar Aficionado's writer describes smoking there). Two things stayed
    unset rather than guessed: hours and walk-in-vs-membership status —
    the venue's own site doesn't state either, and two secondary listing
    sites gave conflicting hours, so I queued a small follow-up note
    (not a decision item, just a gap tracker, same pattern as a missing
    factory founded_year) instead of picking one arbitrarily. No LoungeScore
    yet — that needs 3 independent cited ratings, none gathered tonight.
  - Nothing was rejected, and nothing was left for you to decide on tonight
    — the one item was clear enough to act on directly.

## 2026-08-10 — NEEDS-ATTENTION: run did not finish cleanly
The run exited with code 1. Check this run's logs in the Actions tab for details. Nothing was changed or committed tonight.

## 2026-08-13 — accessories night: 2 price checks
Tonight's rotation focus (day-of-month 13 mod 3 = 1): accessories.

**Price refresh:**
- Case Elegance Renzo Glass Top Humidor — added a current price of $91.99 from the manufacturer's own site (caseelegance.com), a sale price off the $114.99 regular price.
- Xikar 009 Punch Cutter — added a current price of $61.99 from CIGAR.com.

Several other retailer pages (Thompson Cigar, Cigars International, Pipes and Cigars) blocked automated fetches (403), so those price checks were skipped rather than guessed at.

**New sources (score recompute):** looked for a 3rd independent source to push the NewAir CC-300H Climate-Controlled Cabinet Humidor (currently 2 sources: Cigar Dojo, Amazon) over the 3-source AccScore minimum, and for a scoreable numeric rating on the Colibri Julius soft-flame lighter (currently qualitative-only sources). Neither turned up a source with a clear, confirmable numeric score — smaller review blogs found in search either gave no explicit rating or couldn't be verified by direct fetch. Both remain queued as insufficient_sources; no score published.

No new brands/lines/categories proposed tonight, so nothing new went to the review queue. This is a lean weekday run — keeping it to price checks and source-hunting within budget.

## 2026-08-14 — Friday run: lounges night
Today is a "lounges" night on the 3-way rotation with cigars and
accessories (day-of-month 14 mod 3 = 2, see CLAUDE.md). Weekday, so kept
it lean. Not a Sunday, so no queue triage this run.

**Pushing existing lounges over the 3-source LoungeScore minimum:** looked
for a new cited rating on the five lounges closest to the 3-source
threshold — The Debonair Cigar Lounge (LA, 1 source), Casa de Montecristo
Manhattan (1), Casa de Montecristo Boca Raton (1), Casa de Montecristo
Mooresville (2), and BURN by Rocky Patel Atlanta (2). No luck tonight:
Yelp and TripAdvisor both blocked automated fetches (403) for every one of
these venues, same problem the accessories run hit with retailer sites two
nights ago. Secondary aggregator sites (Wanderlog, RestaurantGuru,
Chamber of Commerce listings) that did load turned out to just be
re-reporting the same Google number already on file for that lounge, not
an independent source, so nothing new was added. Cigar Aficionado has a
real 2019 feature on BURN Atlanta but it doesn't carry a numeric score, so
it's not usable for LoungeScore either. All five stay queued as
insufficient_sources — nothing published, nothing lost.

**New lounge/city proposal:** found that Casa de Montecristo (already in
our directory in five other cities) has a real location in Southfield, MI
(metro Detroit), a city we have no lounge for yet. Queued it rather than
adding it directly, per the new-entity rule — item is "Casa de Montecristo
Southfield (Southfield/Detroit, MI)" in the review queue, with the
address/phone/hours sourced from the chain's own site. Left indoor-smoking
status unset rather than guessing — the official page doesn't state it,
and a secondary search surfaced an unsourced, conflicting claim not solid
enough to record as fact. Only one rating source was found for it so far
(a single review on CigarScore.com), well short of the 3 needed for a
LoungeScore even after approval.

No ratings added, no lounges added directly (both would need either your
approval or Sunday triage first). Build checked clean before committing.

## 2026-08-15 — NEEDS-ATTENTION: run did not finish cleanly
The run exited with code 1. Check this run's logs in the Actions tab for details. Nothing was changed or committed tonight.

## 2026-08-16 — Sunday: accessories night + weekly queue triage
Today is an "accessories" night on the 3-way rotation (day-of-month 16 mod
3 = 1, see CLAUDE.md). It's Sunday, so a heavier catalog pass plus the
weekly queue triage is allowed — committing progress after each major
step tonight since the turn budget is tight for everything on the list.

**Price refresh:**
- Case Elegance Flint Travel Leather Cigar Case — added a current price of
  $99.77 from the manufacturer's own site (caseelegance.com).
- Cigar Oasis Magna 3.0 Electronic Humidification System — added a current
  price of $269.00 (sale price, down from $289.00) from the manufacturer's
  own site (cigaroasis.com).

Several other candidates were attempted (NewAir CC-300H, Xikar PuroTemp
Digital Hygrometer, Xikar Executive Ashtray Can, Quality Importers
Traveler 20, IM Corona Old Boy) but every retailer page either blocked the
automated fetch (403), 404'd, or — for IM Corona — only showed prices for
different finishes/variants that couldn't be confidently matched to our
exact catalog entry, so those were skipped rather than guessed at.

**New sources (score recompute):** looked for a 3rd independent review
source on four accessories currently sitting at 2 sources each — NewAir
CC-300H Humidor, Xikar Volta table lighter, Xikar EX lighter, and Cigars
International Large Analog Hygrometer (HYG7). Found several real,
independent review blogs (smokedock.com, cigarcraig.com, blindmanspuff.com)
that hadn't been used as sources before, but none of them published an
actual numeric or star rating — just qualitative writeups ("Great,
Highly Recommend" with no number attached) — so nothing was added rather
than inventing a score to match a qualitative verdict. knifecenter.com and
thompsoncigar.com (candidates for the EX and HYG7) both blocked the fetch.
All four remain at 2 sources, queued as insufficient_sources.

Build checked clean (`npm run build`) before this commit.

## 2026-08-16 — Sunday weekly queue triage
The queue had 255 items after tonight's price-check commit, but only two
were genuinely-new-entity proposals needing a decision — everything else
was informational (insufficient-sources gap notes, conflicting-facts
notes, unverified-award notes, etc.) and left alone, as instructed.

Both decisions:
- **Approved and added**: The Occidental Cigar Club, San Francisco, CA
  (queued 2026-08-11). Re-checked both of its sources tonight — the
  venue's own site and Cigar Journal's coverage — both still live and
  still say what the queue entry claimed (real Financial District address,
  legal indoor smoking as an owner-operated tobacconist business). Added
  with the facts the sources supported. No LoungeScore yet — needs 3 cited
  ratings, none gathered tonight.
- **Approved and added**: Casa de Montecristo Southfield, MI (queued
  2026-08-14). Re-checked the chain's own Southfield page and the
  CigarScore.com listing tonight — both still live and matching. Added
  with address/phone/hours/website sourced. Left indoor_smoking_status
  unset, same as the original queue entry recommended — Michigan's
  smoke-free law exemption for this specific venue wasn't independently
  confirmed (our other Casa de Montecristo locations each have a
  researched jurisdiction-specific note; this one doesn't yet). Queued a
  small follow-up gap-note for that instead of guessing. No LoungeScore
  yet either.

Nothing was rejected, and nothing was left for you to decide on tonight —
both items cleared the same live-source bar as everything else on the
site and neither raised a legal/scope question only you could settle.

Build checked clean (`npm run build`) before this commit.

## 2026-08-16 — news brief: XIKAR Allume 2/3 shipping
One accessory news item added tonight: XIKAR has begun shipping its
redesigned Allume 2 (double-jet, $69.99) and Allume 3 (triple-jet, $99.99)
lighters, per an August 1, 2026 Cigar Journal report. A single-jet Allume 1
is expected by end of month. This is a real product launch from an
established outlet, so it's an auto-published news brief — not yet added
as a full catalog accessory entry, since no independent review sources
exist yet for a lighter that just started shipping (AccScore needs 3
independent sources, and pros/cons need real review content to synthesize
from, not just a manufacturer announcement). Worth revisiting once
reviews start appearing.

## 2026-08-17 — lounge night: one LoungeScore published, two lounges nudged forward
Tonight's rotation (day-of-month mod 3) landed on lounges. Weekday, so no
weekly queue triage — that's Sundays only. Focus was the folding
instruction: look for new cited ratings on existing lounges rather than
propose new ones.

- **The Occidental Cigar Club (San Francisco, CA)** — was sitting at zero
  ratings. Found three independent, currently-live platform aggregates on
  a single RestaurantGuru listing: Google (4.6/5, 550 reviews),
  Foursquare (8.6/10, 106 reviews), and TripAdvisor (4/5, 45 reviews) —
  skipped the same listing's Facebook figure since it only had 3 reviews
  behind it, too thin to trust. That's 3 independent sources, so
  LoungeScore is now live for this lounge: **86**.
- **Boston Cigar Club & Shop (Boston, MA)** and **Churchill's Fine Cigars
  (Phoenix, AZ)** — each got one verified Google rating added (4.8/5,
  510 reviews via RestaurantGuru; 4.7/5, 191 reviews via Wanderlog,
  respectively). Both still sit at "insufficient data" — only 1 of the
  required 3 independent sources each so far. Left as-is rather than
  guessing at more; worth another pass on a future lounge night.
- Tried to find a third independent source for two lounges that were
  already at 2 (BURN by Rocky Patel Atlanta, Casa de Montecristo
  Mooresville) to push them over the line tonight. No luck: Yelp,
  TripAdvisor, and Chamber of Commerce all blocked automated access
  (403) for both, and the only extra numbers I could find (via search
  summaries, not a verified page) weren't something I was willing to
  record without confirming them directly. Left both as-is rather than
  publish an unverified number — worth a retry with different sources
  next lounge night.
- No new lounges/cities were proposed to the queue tonight — turn budget
  went to nudging existing thin entries forward instead, per tonight's
  priority.

Build checked clean (`npm run build`) before each commit tonight.

Build checked clean (`npm run build`) before this commit.

## 2026-08-18 — Tuesday run: cigars night
Day-of-month rotation (18 mod 3 = 0) landed on cigars tonight. Weekday, so
kept this run lean, and today's turn budget was unusually small — spent it
on a couple of small, real, fully-verified items rather than stretching
thin across everything the cigars rotation normally covers.

- **News**: added one auto-published brief — AJ Fernandez has launched a
  new full-time Diesel line, "Uncaged," a Nicaraguan puro (habano criollo
  wrapper, all Fernandez-grown leaf) in three sizes under $8, shipping to
  stores this month. Sourced from halfwheel, cross-checked against Cigar
  Aficionado, Cigar Coop, and Cigar Dojo coverage for the same facts before
  writing it up. Diesel isn't yet a brand in our catalog, so this is a news
  brief only — no catalog entry was added.
- **Trying to clear queued "insufficient data" items**: looked for a third
  independent source on the Fuente Fuente OpusX Robusto (queued at 0
  sources) and a second/third on the My Father Le Bijou 1922 Toro (queued
  at 1 source). For OpusX, every halfwheel/Cigar Coop review I could find
  was for a different variant (Angel's Share, Rosado Oscuro Oro) — not the
  standard Robusto our page is actually about, so nothing was added rather
  than risk attributing the wrong cigar's review. For Le Bijou 1922, I
  could only find matches for other sizes (Toro Fino, Torpedo, Robusto) or
  sources outside the site's named critic list (Stogie Guys, CigarScore).
  Left both queued as-is rather than force a match.
- **Price refresh**: checked 2 vitolas against current retailer listings —
  Padrón 1964 Anniversary Exclusivo Maduro (JR Cigar, $409.99/box of 25,
  ~$16.40/stick) and Liga Privada T52 Toro (Famous Smoke Shop, $428.99/box
  of 24, ~$17.87/stick). Both added as new price_point rows, no swing
  flags. A third check (Romeo y Julieta 1875 Bully at Famous Smoke) turned
  up a sale price with an ambiguous pack size on the page, so it was
  skipped rather than recorded as a guess.
- No score recomputes were needed tonight (no new critic reviews cleared
  the sourcing bar). No new brands/lines/lounges/categories were queued or
  added.

Build checked clean (`npm run build`) before this commit.

## 2026-08-19 — Wednesday run: accessories night
Day-of-month rotation (19 mod 3 = 1) landed on accessories tonight.
Weekday, so kept it lean; not a Sunday, so no queue triage. Cigar-growth
flag was off tonight, so no new cigars were added either.

- **Price refresh**: checked live prices for three accessories. The Xikar
  PuroTemp Digital Hygrometer (rectangular) had never had a price
  recorded — confirmed $36.99 at Famous Smoke Shop and added it. Also
  re-checked the Boveda 65% RH (Size 60) pack and the Colibri Quasar
  Table Lighter; both matched their existing on-file prices exactly (a
  search summary had suggested a much lower Boveda figure, but fetching
  the actual retailer page directly confirmed the on-file $45.99 was
  still correct — worth flagging that search snippets can be misleading
  and the direct page fetch is what actually matters), so no new price
  rows were needed for those two.
- **Trying to clear "insufficient data" accessories**: several accessories
  sit at 2 of the required 3 independent AccScore sources (Xikar Volta
  table lighter, Xikar PuroTemp hygrometer, Case Elegance Flint travel
  case, among others). Looked for a third source for each. Found real
  editorial reviews for the Volta (Blind Man's Puff) and the PuroTemp
  (Famous Smoke's Cigar Advisor), but neither gives a numeric score —
  just a qualitative verdict — and AccScore requires a real numeric
  score, so nothing was added rather than invent one. Retailer
  star-rating pages that might have supplied a numeric third source
  (Walmart, Neptune Cigar, Cigars International, Amazon) either blocked
  automated access, 404'd, or had zero reviews yet on the specific page
  checked. None of these three accessories moved off "insufficient data"
  tonight — worth another pass with different sources on a future
  accessories night.
- No new accessory categories, accessories, or news items were queued or
  added tonight — turn budget went to the price/review work above.

Build checked clean (`npm run build`) before this commit.

## 2026-08-20 — NEEDS-ATTENTION: run did not finish cleanly
The run exited with code 1. Check this run's logs in the Actions tab for details. Nothing was changed or committed tonight.

## 2026-08-20 — Thursday run: lounges night + cigar growth
Day-of-month rotation (20 mod 3 = 2) landed on lounges tonight. Weekday, so
kept it lean; not a Sunday, so no queue triage. Cigar-growth flag was on
(even day), so that ran independently too — see below. (Yesterday's run
exited uncleanly with nothing committed; this is a fresh run.)

- **Lounges — pushing thin entries over the 3-source line**: BURN by Rocky
  Patel (Atlanta) was sitting at 2 independent sources (Google via
  cigarlounges.co, Foursquare). Found a third, genuinely independent
  platform aggregate — Restaurantji, 4.2/5 from 422 ratings — and added
  it. That's enough to publish a LoungeScore for this lounge: **84.3**.
  Tried the same for Casa de Montecristo by JR Cigar (Mooresville, NC),
  also at 2 sources, but couldn't land a clean third: Yelp and TripAdvisor
  both blocked automated fetches, and search snippets only offered vague
  figures ("4.6 based on 58 reviews on another platform") without a
  reliably attributable source page, so nothing was added there rather
  than risk a fuzzy citation. Left for a future lounges night.

- **New cigar growth (target 3, cigar-growth flag on tonight)**: added 3
  new vitolas, each extending a brand already in the catalog with a real
  size it actually offers that we didn't have on file — checked directly
  against the DB first for exact-slug and near-duplicate collisions, then
  verified each is real via live search before adding:
  - **Alec Bradley Prensado Torpedo** (6⅛ x 52) — the brand's flagship
    Honduran-puro-adjacent blend (Trojes Corojo wrapper, Nicaraguan
    binder, Honduran/Nicaraguan filler); we already had the Robusto and
    Churchill, this size was clearly missing. Tasting notes drawn from
    retailer/reviewer consensus (cinnamon toast, dark chocolate, espresso,
    leather). Also landed a real critic citation — Cigar Aficionado, 91/100
    (Oct 2020) — though the vitola still shows "insufficient data" until
    2 more independent sources are found, same rule as everywhere else.
  - **AVO XO Preludio** (6 x 40) — a slim size in AVO's XO line (Dominican
    filler/binder, Ecuadorian Connecticut wrapper); we only had the
    Intermezzo (5 x 50) on file, and Preludio's dimensions are far enough
    from it to be a clean, non-duplicate addition. Tasting notes from
    reviewer consensus (earth, leather, toasted bread, cedar, sweet fruit).
  - **Camacho Corojo Toro** (6 x 50) — we only had the Robusto (5 x 50);
    Corojo is Camacho's three-priming Honduran puro. Tasting notes from
    reviewer consensus (black/red pepper, cedar, leather, earth, cinnamon).
    Found real Cigar Aficionado scores (93-94) for "Camacho Corojo" in
    general but couldn't confirm they were rated for the Toro vitola
    specifically, so no critic citation was added for this one rather than
    risk attributing the wrong size's score.
  - **Skipped as too close to an existing entry**: AVO XO "Notturno/Nocturne"
    (5 x 54) — same 5" length as our existing Intermezzo (5 x 50) with only
    a 4-ring-gauge difference, inside this project's near-duplicate risk
    band, so left uncatalogued rather than risk it actually being a
    tubos/packaging variant of Intermezzo rather than a distinct blend.
  - No cigar_release entries were waiting on any of these three
    brand/lines, so no calendar links were needed.

Build checked clean (`npm run build`) before this commit.

**Stopping here for tonight.** Both of tonight's focus items (lounges
rotation night, cigar growth) are done and pushed in the two commits
above. Skipped the general price-refresh/news-ingest pass this run to
stay within a lean weekday budget after the research/verification work
above — no swings or brand-new news items were checked tonight. No
errors, nothing left half-done. Next lounges-focus night: revisit Casa de
Montecristo by JR Cigar (Mooresville) for a clean third source, and
consider proposing a new lounge/city candidate via the queue.

## 2026-08-22 — nightly run

**Cigar growth (independent of rotation):** Added 3 new vitolas, all extending
brands already in the catalog (cheaper to verify, lower duplicate risk):
- AVO XO Maestoso (7 x 48, churchill) — dimensions and consensus tasting notes
  (cedar, earth, leather, toasted bread, dried fruit, vanilla) confirmed
  against CigarObsession, Gotham Cigars, and JR Cigar listings.
- Camacho Corojo Churchill (7 x 48) — confirmed via JR Cigar and Cigar
  Aficionado; also found Cigar Aficionado rated it 94/100 (#5 in their Top 25
  of 2010) but skipped adding that as a critic_review since no exact
  publication date could be confirmed (only the year) — didn't want to guess
  a day/month. Left as best-effort; still shows "insufficient data" until a
  dated citation turns up.
- Alec Bradley Prensado Corona Gorda (5 5/8 x 46) — confirmed via Famous
  Smoke, Mike's Cigars, and Cigar Coop; flavor notes (dark-roasted coffee,
  pepper, chocolate, leather, spice) drawn from those listings.

Checked all three against existing vitolas on file for exact-slug and
near-duplicate collisions (within ~0.25" length / a few ring-gauge points)
before adding — none were close enough to flag. Skipped Alec Bradley
Prensado "Gran Toro" (6 x 54) as a likely near-duplicate of the existing
Torpedo (6 1/8 x 52) — too close on both length and ring gauge to feel safe
adding without a stronger differentiator.

Build verified clean (`npm run build`) before committing.

**Accessories (tonight's rotation focus — day-of-month 22 mod 3 = 1):**
Tried to push a few 2-source accessories over the 3-source AccScore minimum
(Xikar Volta, Colibri Quasar) and refresh stale prices on a couple of
never-priced items (Mantello Royal Glass-Top Humidor, NewAir CC-300H
Humidor). Search snippets turned up plausible extra sources (a halfwheel
review of the Colibri Quasar, a CIGAR.com customer rating for the Xikar
Volta, listed prices for the other two), but the actual pages returned
402/403/expired-certificate errors on fetch, so none of it could be
independently confirmed — per the "never invent a score/price, skip
unreachable sources" rule, none of it was added. No accessory-side database
changes tonight; still exactly where they were yesterday. Today's slice of
the turn budget went entirely to research that didn't pan out — nothing
broken, just no new accessory data to show for it.

**Cigars/lounges rotation:** not this run's focus (day-of-month picked
accessories); no cigar-side or lounge-side rotation work beyond the
independent cigar-growth batch above.

**Weekly queue triage:** skipped — today (Saturday) isn't Sunday.

No errors, nothing queued tonight, no NEEDS-ATTENTION items. Turn budget
mostly spent; stopping here rather than starting a new line of work.

## 2026-08-24 — nightly run

**Cigar growth (independent of rotation, standing owner-approved exception):**
Added 3 new vitolas, all extending brands already in the catalog (cheaper to
verify, lower duplicate risk than a brand-new brand):
- Tatuaje Black Label Robusto (5 x 50) — confirmed via Fox Cigar, Neptune
  Cigar, and Stogie Guys listings/reviews; tasting notes (oak, cinnamon,
  smoked almond, cocoa, black cherry, cedar, coffee, leather) drawn from
  Holt's and Stogie Guys reviews.
- Illusione Original Documents Corojo Robusto (5 x 52) — confirmed via
  Neptune Cigar and Illusione's own site; tasting notes (leather, black
  cherry, earthy spice, nuts, cedar, cream, white pepper, toffee, cocoa)
  drawn from retailer/review copy. Found a Cigar Aficionado score (93) for
  an Illusione Original Documents Corojo, but couldn't confirm it was
  specifically for the Robusto vitola (vs. Corona Gorda/Toro) or pin an
  exact review date, so skipped adding it as a critic_review rather than
  guess — still shows "insufficient data" until a clearly-dated,
  vitola-specific citation turns up.
- Crowned Heads Le Carême Cosacos (5 3/8 x 42) — confirmed via Cigars.com
  and Blind Man's Puff review; tasting notes (vegetal, caramel, leather,
  espresso, cedar, burnt toast, bitter coffee) drawn from that review.

Checked all three against existing vitolas on file for exact-slug and
near-duplicate collisions (within ~0.25" length / a few ring-gauge points)
before adding — none were close enough to flag (e.g. Le Carême Cosacos at
5 3/8 x 42 is well clear of the existing Robusto at 5 x 50 and Hermoso No. 1
at 6.5 x 48). Checked cigar_release for unlinked entries matching these
brands — none found, nothing to link.

Build verified clean (`npm run build`) before committing.

**Cigars rotation (day-of-month 24 mod 3 = 0) — price refresh:** targeted a
handful of never-priced vitolas rather than the full 30-vitola slice tonight,
to leave headroom for the cigar-growth batch above on a lean weekday budget.
Added one confirmed price: Diesel Unholy Cocktail (5 x 56) at $31.99 single
from Famous Smoke Shop, dimensions and retailer both confirmed against the
listing. Checked three more candidates but skipped all of them rather than
risk bad data: Romeo y Julieta Añejo Piramide (the only price found was for
a differently-sized 4½ x 52 pyramid, not our catalogued 6⅛ x 52 — dimension
mismatch), RoMa Craft CroMagnon Knuckle Dragger (search results mixed
several different wrapper variants — Aquitaine, PA Broadleaf, V2 — at
different price points and couldn't confidently isolate the plain
Connecticut Broadleaf Maduro blend actually on file), and Hoyo de Monterrey
Excalibur No. III (no specific price surfaced in search results).

**News ingest:** found real August 2026 cigar news via halfwheel search
results (Camacho Limited Edition 2026, Creekside's Queen of the West launch,
Tatuaje Creature Monster Series release, Undercrown 15th-anniversary LE,
among others) but the halfwheel article page itself returned an HTTP 402
error on fetch when trying to confirm an exact publish date and full
details, so per the "skip unreachable sources, don't guess" rule, no
news_item was added tonight — didn't want to invent a publish date. Worth
another look on a future cigars-focus night.

No errors otherwise. Nothing queued tonight beyond what was already in the
queue. Turn budget spent conservatively on a weekday — stopping here with
everything committed and pushed rather than starting new work.

## 2026-08-26 — NEEDS-ATTENTION: run did not finish cleanly
The run exited with code 1. Check this run's logs in the Actions tab for details. Nothing was changed or committed tonight.

## 2026-08-28 — nightly run (in progress)

Weekday, lean budget (40 turns). Day-of-month rotation (28 mod 3 = 1) points
at **accessories** tonight. Cigar-growth flag is on (28 is even), so an
independent cigar batch follows below regardless of rotation. Not Sunday, so
no queue triage this run.

**Accessories (tonight's rotation focus):** a rough night for new data,
consistent with recent accessories nights — several sites that carry our
thinner-sourced items (cigarsinternational.com, pipesandcigars.com) returned
403s on fetch again tonight. Tried to push Xikar EX (2 reviews) over the
3-source line — found plenty of customer commentary but no actual numeric
score/star rating to aggregate, so skipped rather than invent one. Also
checked "The Cigar Log Book" (2 reviews on file: Amazon.sg, Goodreads) —
found an Amazon.com reviews page, but that's the same platform as the
Amazon.sg citation already on file, not a genuinely independent source, so
skipped it (learning from the duplicate-citation near-miss logged on
2026-08-27). Checked prices for S.T. Dupont Ligne 2 (too many finish/price
variants — $1,395 to $8,450+ — with no way to confirm which matches our
catalogued item, skipped) and IM Corona Old Boy (same problem: $114-$170
across untracked finish variants). Heartfelt Industries humidity beads: a
search snippet suggested $43/4oz but the actual product page wouldn't
surface a confirmed price on fetch, so skipped rather than guess.

One accessory price point did land cleanly: **Vertigo by Lotus Attaché 2**
(soft-flame lighter) at $17.99 from Lotus's own official site
(lotuslighters.com), confirmed via direct fetch — this accessory had zero
price points on file before tonight.

Build verified clean (`npm run build`). Committing this now; cigar-growth
batch follows in a separate commit below.

**Cigar growth (independent of rotation, standing owner-approved exception):**
Targeted 3, landed 2 verified additions this run — stopped early on turn
budget rather than rushing a third. Both extend brands already in the
catalog (cheaper to verify, lower duplicate risk):
- Southern Draw Jacob's Ladder Robusto (5.5 x 54) — confirmed via a Blind
  Man's Puff review (Pennsylvania Broadleaf wrapper, Ecuadorian Maduro
  binder, Nicaraguan filler); tasting notes (dark chocolate, espresso,
  black pepper, cedar, rich leather) drawn from that review. The line
  already had Toro (6x52) and Gordo (6.5x60) on file — checked both for
  near-duplicate collision against this 5.5x54 Robusto and it's clear on
  both length (0.5"+ ) and ring gauge. The review also gave the cigar a
  score (92, "Great") but didn't include a specific review date, so per
  the "never guess a date" rule no critic_review citation was added —
  still shows "insufficient data" until a dated citation turns up.
- Espinosa Murcielago Toro (6 x 52, box-pressed) — size corroborated by
  three independent retailer listings (Neptune Cigar, Corona Cigar,
  CigarCountry.com) though several of their full product pages returned
  403/522 errors on fetch. Blend (Mexican San Andrés Capa Negra wrapper,
  Nicaraguan binder/filler) is already recorded at the line level from the
  existing Robusto vitola. No vitola-specific tasting notes could be
  confirmed for the Toro specifically (sources describing flavor were all
  unreachable), so per the "write a plainer summary from the confirmed
  blend rather than invent descriptors" rule, this entry's summary
  describes the blend/construction only, no invented tasting notes.
  Checked against the existing Robusto (5x54) on file — clear on both
  length (1") and ring gauge (2pt, plus the length gap already clears it).

Checked cigar_release for unlinked entries matching Southern Draw or
Espinosa — none found, nothing to link.

Build verified clean (`npm run build`) before this commit.

**Wrapping up:** stopping here on turn budget. No queue additions tonight
(weekday, cigar-growth exception is the only unqueued catalog growth, both
items independently verified per that exception's sourcing bar). No
NEEDS-ATTENTION items — everything attempted either landed cleanly or was
skipped with a documented reason above, nothing left half-finished.

## 2026-08-29 — NEEDS-ATTENTION: run did not finish cleanly
This is a quota issue, not a bug: the nightly automation shares your Claude Pro usage limit with your own daytime use, and tonight's budget was already used up. Nothing to fix — it'll work again once your quota resets. Nothing was changed or committed tonight.

## 2026-08-29 — nightly run (retry, in progress)

Weekday, lean budget (40 turns). This is a fresh attempt for tonight after
the earlier quota-exhaustion entry above. Day-of-month rotation (29 mod 3 =
2) points at **lounges** tonight. Cigar-growth flag is off tonight (29 is
odd, matching the every-other-day cadence), so no independent cigar batch
this run. Not Sunday, so no queue triage.

**Price refresh:** kept small tonight since lounges is the focus. Checked
five never-before-priced vitolas (Romeo Añejo Piramide, RoMa Craft
CroMagnon Knuckle Dragger, Hoyo de Monterrey Excalibur No. III, Room101
Farce "It Is a Robusto", Cohiba Black Robusto). Only one produced a clean,
unambiguous single-retailer price: **Hoyo de Monterrey Excalibur No. III**
— box of 20 for $151.92 at Atlantic Cigar (one of our tracked retailers),
confirmed by direct fetch of their product page, matching our line's
Connecticut Shade wrapper (their "Natural" listing). The other four were
skipped: RoMa Craft's Neptune Cigar page loaded but didn't expose a price
in the fetched content, and JR Cigars' CroMagnon listing 404'd; Room101
Farce's Famous Smoke page confirmed the right size (5x52) but couldn't
confirm whether their "Original" wrapper matches our line's Ecuadorian
Habano-seed wrapper, so skipped rather than guess; Romeo Añejo Piramide and
Cohiba Black Robusto only turned up prices from retailers outside our
tracked list (JR Cigars, Famous Smoke, Neptune Cigar, Atlantic Cigar), so
skipped per the "never guess/never substitute" rule.

Build verified clean (`npm run build`). Committing this now; lounge-focus
work follows in a separate commit below.

**Lounges (tonight's rotation focus):** tried to push two lounges that are
just one source short of the 3-source minimum over the line — Casa de
Montecristo by JR Cigar (Mooresville, NC; has Google + Foursquare) and
Boston Cigar Club & Shop (has Google + TripAdvisor already). Neither
landed: Yelp returned 403 Forbidden on direct fetch for both, and
Foursquare's venue page required a login to see the actual score (only a
"Log in to Foursquare" wall came back). Also tried Iwan Ries & Co.
(Chicago) — currently zero ratings on file — hoping for an easy TripAdvisor
or Yelp number; TripAdvisor's page also 403'd on fetch, and search-result
snippets described individual reviews but never surfaced the actual
aggregate star count, so nothing citable was captured. This is the same
site-blocking pattern noted on recent accessories nights
(cigarsinternational.com, pipesandcigars.com returning 403s) — tonight it
hit the lounge platforms instead. No new lounge ratings added, no new
lounges/cities queued (didn't get far enough to identify a good candidate
before running low on turns).

**NEEDS-ATTENTION: ran out of turns before finishing cigar news ingest.**
With this much of the budget spent on price refresh and blocked lounge
research, there wasn't enough left to safely start the news-ingest step
without risking a hard cutoff mid-write. Skipping it cleanly tonight rather
than starting something that might get killed half-done. No cigar-growth
batch tonight (flag off, matching the every-other-day/even-day cadence —
today is odd). No queue triage (not Sunday).

Build verified clean (`npm run build`) before this commit. Everything
above is committed and pushed; nothing is left half-written in the repo.

## 2026-08-30 — Sunday run: cigars night (heavier catalog pass + queue triage)

Sunday, larger budget (90 turns). Day-of-month rotation (30 mod 3 = 0)
points at **cigars** tonight. Cigar-growth flag is on tonight, so a
new-cigar batch runs independently of the rotation too (target 6, Sunday
size) — see below. Sunday also means the weekly queue triage runs after
the regular work.

**Price refresh:** checked a batch of never-before-priced vitolas against
our four tracked retailers (JR Cigars, Famous Smoke Shop, Neptune Cigar,
Atlantic Cigar). Landed clean, size/wrapper-confirmed prices on 10:

- Illusione Epernay Le Ferme — box of 25, $267.75 (Atlantic Cigar)
- Hoyo de Monterrey Excalibur No. II (Natural) — box of 20, $153.32 (Atlantic Cigar)
- Partagás Classic No. 10 — box of 10, $88.99 (JR Cigars)
- New World by AJ Fernandez Robusto (Oscuro) — box of 21, $101.87 (Atlantic Cigar)
- Liga Privada No. 9 Belicoso — box of 24, $452.58 (Atlantic Cigar)
- Crowned Heads Le Pâtissier Senadores — box of 20, $104.95 (Atlantic Cigar)
- Padrón 1926 Series No. 9 Maduro — box of 10, $245.00 (Atlantic Cigar)
- Dunbarton Tobacco & Trust Sobremesa Short Churchill — box of 14, $168.99 (Famous Smoke Shop)
- Plasencia Alma Fuerte Nestor IV — box of 10, $224.99 (Famous Smoke Shop)
- E.P. Carrillo Encore Celestial — box of 20, $259.99 (Famous Smoke Shop)

All ten matched exact length/ring-gauge (and wrapper, where relevant)
against what's already on file — no guessing on ambiguous sizes. Skipped
Davidoff Nicaragua Robusto: the only listing found was a "Box-Pressed"
variant at 5x48, while our line's vitola is a plain (non-box-pressed)
5x50 — different product, not our SKU, so left alone rather than risk
mixing data across two distinct Davidoff Nicaragua releases. H. Upmann
1844 Reserve Toro also skipped: the only price surfaced ($46.95 "single")
was implausible for a single stick and looked like a bundle price
mislabeled by the search summary — not confident enough to publish.

No price swung >25% off trailing averages, so nothing went to the queue
from this step.

Build verified clean (`npm run build`) before this commit.

**News + cigar growth (7 new vitolas, target was 6):** found four real,
independently-sourced new products and added all of them — extending
existing brands where possible, per the preference in CLAUDE.md:

- **Brick House Maduro — The Commodore** (5.5x70 gordo, new widest vitola
  for an existing line) — confirmed shipping via halfwheel; tasting notes
  drawn from a June 2026 review (cocoa, charred wood, espresso, dark
  tobacco, molasses-like sweetness, black pepper). This also resolved the
  existing queue item that had flagged this exact vitola as unverified —
  it's real, so the queue entry is now removed. Linked to a matching
  release-calendar entry.
- **Diesel Uncaged** (new line, 3 vitolas: Robusto 5.5x52, Toro 6x52,
  Gigante 6x60) — a new full-time blend for the existing Diesel brand,
  confirmed via halfwheel and Cigar Coop. Nicaraguan habano criollo
  wrapper, made by A.J. Fernandez.
- **Knuckle Sandwich Avant-Garde** (new line under the existing Espinosa
  Premium Cigars brand, 1 vitola: Toro 6x54) — a deliberately milder blend
  in Erik Espinosa's Guy Fieri collaboration, confirmed via halfwheel.
- **United Cigars — Independence** (brand-new brand, 1 new line, 2
  vitolas: Robusto 4.875x50, Toro 5.875x50) — United Cigars wasn't in our
  catalog at all; confirmed the company's real background (owned by David
  Garofalo of Two Guys Cigars, multi-factory) via Cigar Journal and
  Premium Cigar Association coverage before adding it. `founded_year` left
  null — no source gave a founding date for the modern company, so it's
  not guessed. Independence began as a limited "Firecracker" tin and just
  became a regular-production line; rolled at Magia Cubana, Dominican
  Republic.

Each addition got a matching news brief (citing halfwheel/Cigar Dojo) and
a cigar_release entry linked to its vitola. Checked all four against
existing catalog entries for exact and near-duplicate dimensions first —
no collisions. None of these have a critic score yet (best-effort search
for Brick House Commodore found no numeric rating from our tracked
sources), so all show "insufficient data," same as any other
freshly-added vitola — no invented scores.

**Skipped as unverifiable:** the queued "Nub Maduro 466 (4x66)" candidate
— couldn't find any source confirming this specific size exists, and even
if it did, 4x66 sits within a few ring-gauge points of the already-catalogued
464 Torpedo (4x64), the exact near-duplicate pattern this file warns about.
Left the queue entry as-is rather than resolve it without real confirmation.

Build verified clean (`npm run build`) before this commit.

**Score recompute:** found a real third independent source for
Montecristo White Series Toro (a JR Cigars customer-review average, 4.45/5
across 352 reviews) — it previously had only Cigar Aficionado and The
Cigar Authority, one short of the 3-source minimum. Added it, which
published a StickScore of 89.1 for the first time; also filled in sub-scores
from the same review text (flavor/construction/complexity/value) and
rewrote the summary to drop the old "insufficient data" framing. Removed
the matching queue entry since the gap it flagged no longer exists. Tried
the same move for Arturo Fuente Añejo Reserva No. 48 (also one source
short) but couldn't find a usable third source — Famous Smoke's product
page 404'd and no other tracked retailer showed a review average — so
that one stays queued.

**Weekly queue triage (Sunday):** read through all 253 items currently in
data/review-queue.json looking specifically for genuinely-new-entity
proposals (new brand/line/lounge/city/factory/accessory-category
candidates) per this week's triage instructions. Found none — every item
in the queue right now is one of: insufficient-source tracking notes,
conflicting-fact notes, missing brand/factory citation gaps, or
fact-verification flags from an old submission audit (unverified/
mismatched vitolas and awards on cigars already in the catalog). None of
those are "propose a new catalog entity" decisions — they're informational
gap-tracking the way this file describes as fine to leave alone. So there
was nothing to approve, reject, or explicitly bounce to the owner this
week; the two resolutions above (Brick House Commodore, Montecristo White
Series Toro) happened as part of the regular cigars work, not the triage
pass. Queue count net change tonight: 255 → 253 (two resolved, as noted
above; no new items added).

Build verified clean (`npm run build`) before this commit — final check
for tonight. Everything above is committed and pushed. No NEEDS-ATTENTION
items: every step planned for tonight (ingest/news, price refresh, score
recompute, cigar growth, weekly triage) was completed, not cut short by
the turn budget.

## 2026-08-31 — accessories night (price refresh + review sourcing)

Weekday, lean run. Tonight's rotation slot (day-of-month mod 3) landed on
**accessories**; the cigar-growth flag was off tonight so that batch was
skipped entirely, and it's a weekday so no weekly queue triage either.

**Price refresh:** added real, sourced current prices for three
accessories that had never had a price checked before: Visol Arnold
Crystal 4-Cigar Ashtray (Home Depot, $36.00), Cigars International Large
Analog Hygrometer (CI's own site, $15.39, marked down from $21.99), and
Mantello Royal Glass-Top Cigar Humidor (Walmart, $39.99 — Walmart shows it
out of stock right now, but that's still the real listed price). All
three are brand-new price_point rows, nothing overwritten.

**Review sourcing — caught my own mistake before it shipped:** tried to
push two accessories over the 3-source minimum (NewAir CC-300H humidor
and the Colibri Quasar table lighter, both sitting at 2 sources). For
both, the "new" source I found turned out to be the same retailer already
on file under a slightly different name — JR Cigars' customer-review
average for the Quasar was already recorded, and I nearly recorded it a
second time as "JR Cigars (customer reviews)," which would have
incorrectly counted as a third *independent* source when it's really the
same citation twice. Caught it by checking the existing rows before
trusting the search results, deleted both erroneous entries immediately
(same run, before any commit — not touching real historical data), and
recomputed both scores back to their correct "insufficient data" state.
Also tried a genuine third source for the Case Elegance Flint Travel
Leather Cigar Case and the Xikar PuroTemp hygrometer; found real editorial
coverage (Blind Man's Puff) for two of tonight's candidates but neither
gave an explicit numeric score/rating to record, and Amazon's page for the
Case Elegance case wouldn't load for a star-rating check — so those stay
queued at their current source count rather than guessing at a score. Net
effect: no new reviews added tonight, but no bad data went in either.

Build verified clean (`npm run build`) before this commit. Nothing left
outstanding from tonight's slice — no NEEDS-ATTENTION.

