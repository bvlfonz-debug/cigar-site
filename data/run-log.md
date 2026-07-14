# Nightly run log

This file is your window into what the automation does each night. Each entry
is dated, plain English, and short — no code, no jargon. Skim it whenever
you're curious; you don't need to check it daily.

If an entry starts with **NEEDS-ATTENTION**, something didn't go cleanly and
is worth a look. Otherwise, everything below was routine.

Check `data/review-queue.json` weekly for anything waiting on your approval —
new brands/lines, unusual price swings, and low-confidence scores all land
there instead of publishing automatically.

---

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
