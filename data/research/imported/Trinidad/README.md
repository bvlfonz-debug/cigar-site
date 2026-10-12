# Trinidad — Database Research Batch (Altadis USA reorganization, part 4)

Checked against the site's live brand index at https://cigar-site.vercel.app/brands/ on 2026-09-30 —
**Trinidad is confirmed completely absent**, not just a wrong slug. This batch includes a full new `brand`
object (included in the first line file, `trinidad-espiritu-series-no1.json`, per this project's schema
convention).

## Context: part of the Altadis USA reorganization

Trinidad's Mac folder was consolidated during the large-scale Altadis USA distributor-umbrella
reorganization (see the Altadis USA batch notes for the full story). No file renames were needed.

## Brand background and disambiguation

"Trinidad" was originally created in 1969 at Cuba's El Laguito factory as a diplomatic-gift-only brand — the
Cuban "Trinidad" (Habanos S.A.) is a separate, embargoed product not covered here. This batch covers the
**non-Cuban Trinidad distributed by Altadis USA**, whose modern relaunch began circa 2017 with Trinidad
Santiago. No single founding year exists for the non-Cuban version specifically — the brand object records
1969 (the Cuban original's founding) with an explanatory `founded_note` rather than asserting a false precise
date for the Altadis version.

## 5 new lines

- `trinidad-espiritu-series-no1.json`, `trinidad-espiritu-series-no2.json`,
  `trinidad-espiritu-series-no3.json` — three genuinely distinct blends within one numbered "Espiritu" series
  (2019/2021/2024), each themed around a different country's tobacco (Nicaragua, Brazil, Mexico
  respectively). **Flagged**: Series No.1's Toro size conflicts between two sources (6x52 vs 6x54), unresolved.
- `trinidad-santiago.json` — Dominican puro, released 2017, the line that kicked off Altadis's Trinidad
  relaunch.
- `trinidad-x-tommy-bahama-island-collection.json` — **important correction**: the Mac folder was named
  "Trinidad Tommy Breeze," but research confirmed "Breeze" is a *vitola* within a line actually called
  "Trinidad x Tommy Bahama Island Collection," not a standalone line. Modeled correctly here as one line with
  3 vitolas (Harbor, Breeze, Marlin). **Flagged**: Harbor's size conflicts between sources (5x52 vs 6x52),
  unresolved.

## Sourcing

Cigar Aficionado, Wikipedia (for well-documented Cuban-brand history only), Altadis USA's own site, Cigar
Coop, Halfwheel, JR Cigars. Full per-fact URLs are in each JSON file's `sources`/`research_sources` fields.
