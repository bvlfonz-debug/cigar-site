# Saint Luis Rey — Database Research Batch (Altadis USA reorganization, part 5)

Checked against the site's live brand index at https://cigar-site.vercel.app/brands/ on 2026-09-30 —
**Saint Luis Rey is confirmed completely absent**, not just a wrong slug. This batch includes a full new
`brand` object (included in the first line file, `saint-luis-rey-carenas.json`, per this project's schema
convention).

## Context: part of the Altadis USA reorganization

Saint Luis Rey's Mac folder was consolidated during the large-scale Altadis USA distributor-umbrella
reorganization (see the Altadis USA batch notes for the full story). No file renames were needed.

## Brand background and disambiguation

There are two distinct trademarks both called "Saint Luis Rey." A Cuban version (Habanos S.A., Briones
Montoto factory, Havana) is a separate, embargoed product not covered here. This batch covers the **non-Cuban
Saint Luis Rey distributed by Altadis USA**, whose modern Honduran blend was created in 1996 by Christian
Eiroa. The Saint Luis Rey name itself traces to a Cuban trademark registered in the 1940s and nationalized in
1960 — unrelated corporate lineage to the current Altadis product, documented in the brand's `founded_note`
rather than conflated.

## 6 new lines

- `saint-luis-rey-carenas.json` and `saint-luis-rey-carenas-ultramar.json` — Ultramar is confirmed to be a
  genuinely distinct sub-line/blend (different wrapper and binder) rather than just a vitola name within
  Carenas.
- `saint-luis-rey-original.json` — Altadis's own product-page title for the brand's core/base line (the Mac
  folder was simply named "Core"). **Flagged**: vitola size ordering (length vs. ring gauge) was ambiguous in
  the source page's extracted text — normalized to the conventional format but unverified; recommend a
  cross-check before final load.
- `saint-luis-rey-reserva-especial.json` — a "super premium" tier; confirmed Maduro is a wrapper option
  applied across the vitola range, not a separately named vitola ("Maduro Churchill" = Churchill vitola,
  maduro wrapper). **Flagged**: binder not stated on the source page — left `null` rather than guessed.
- `saint-luis-rey-serie-g-maduro.json` — fuller-bodied maduro line with large ring gauges ("G" for "gigante").
  A separate natural-wrapper "Serie G Natural" SKU exists but wasn't independently researched (no supporting
  Mac photo either). Same size-ordering caveat as Original applies to the No.6 vitola.
- `saint-luis-rey-tabacales.json` — **important flag**: unlike every other Saint Luis Rey line, Tabacales is
  made in the Dominican Republic (Tabacalera de García), not Honduras — the brand's first-ever Dominican-made
  release (August 2025), confirmed across 3 independent sources. Does not inherit the brand's default
  Honduran origin/factory.

## Sourcing

Altadis USA's own product pages (primary source for most lines), Cigar Aficionado, Cigar Coop, Halfwheel,
JR Cigars, Wikipedia (for the Cuban-trademark disambiguation history only). Full per-fact URLs are in each
JSON file's `sources`/`research_sources` fields.
