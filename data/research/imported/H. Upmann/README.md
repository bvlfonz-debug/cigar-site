# H. Upmann — Database Research Batch (Altadis USA reorganization, part 3)

Researched against the live catalog at https://cigar-site.vercel.app/brands/h-upmann/ on 2026-09-30.

## Context: part of the Altadis USA reorganization

H. Upmann's Mac folder was consolidated during the large-scale Altadis USA distributor-umbrella
reorganization (see the Altadis USA batch notes for the full story). No file renames were needed — existing
filenames were already clear.

H. Upmann already exists in the site's catalog (1844 Reserve, Herman's Batch, The Banker), so no `brand`
object is included in any of these files — only new `line` objects and one `additional_vitolas` supplement.

## 5 new lines, 1 supplement

- `h-upmann-by-ajf.json` — 2017 collaboration with A.J. Fernandez. **Flagged**: vitola sizes conflict between
  2017 trade-press launch coverage and current JR Cigars retail listings (possibly an unconfirmed later
  resize) — both versions documented, 2017 press treated as primary.
- `h-upmann-1844-anejo.json` — third selection in the "1844" portfolio, all tobaccos aged 5+ years. Made at
  Flor de Copán, Honduras (one outlier source claimed Dominican Republic — not used).
- `h-upmann-1844-classic.json` — released 2021, Ecuadorian Connecticut Shade wrapper. **Flagged**: vitola list
  is single-sourced to JR Cigars, not independently cross-verified.
- `h-upmann-nicaragua-ajf-heritage.json` — debuted TPE 2022, a distinct collaboration from "by AJF" above
  (different wrapper: Brazilian Mata Fina vs. Ecuadorian Sumatra).
- `h-upmann-vintage-cameroon.json` — **Flagged, production status ambiguous**: sold as current inventory by
  retailers, but the only detailed editorial coverage found is a 2006 review, with no current-decade trade
  press confirming active production. Recorded as "current (unverified)" rather than asserted as active.
- `_the-banker-additional-vitolas.json` — "Day Trader" is confirmed (via multiple retailers explicitly
  describing it as "the newest installment of the Banker line") to be a **sub-release of the already-existing
  Banker line**, not a standalone line — filed as a supplement rather than a new `line` object, adding Robusto,
  Toro, and Whale vitolas.

## Not re-researched this batch

1844 Reserve and the core Banker line (Annuity/Arbitrage/Currency) are already listed on the site with photos
consistent with the existing catalog — no gaps identified, no action taken.

## Sourcing

Cigar Aficionado, Cigar Dojo, JR Cigars, Famous Smoke, Atlantic Cigar, Halfwheel, Cigar Country, Neptune
Cigar, Blind Man's Puff. Full per-fact URLs are in each JSON file's `sources`/`research_sources` fields.
