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
