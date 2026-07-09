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
