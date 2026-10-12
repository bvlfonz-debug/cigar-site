# Montecristo — Database Research Batch (Altadis USA reorganization, part 1)

Researched against the live catalog at https://cigar-site.vercel.app/brands/montecristo/ on 2026-09-30.

## Context: part of the Altadis USA reorganization

Montecristo's Mac folder was consolidated during the large-scale Altadis USA distributor-umbrella
reorganization (see the Altadis USA batch notes for the full story). A handful of loose files that were
previously sitting directly under the old "Altadis USA/Montecristo" path were merged into this brand's main,
already-existing top-level "Montecristo" folder. No filenames needed correction in this batch — they were
already clear.

Montecristo already exists in the site's catalog (Classic, Epic, White Series), so no `brand` object is
included in any of these files — only new `line` objects and one `additional_vitolas` supplement.

## 5 new lines, 1 supplement

- `montecristo-1935-anniversary.json` — a family of releases (not one blend): Edicion Diamante (6 vitolas,
  all-Nicaraguan) plus a newer, separately-priced Edicion Doble Diamante sub-release. Only one Doble Diamante
  vitola (Toro) could be confirmed — its fuller lineup is flagged unverified rather than guessed.
- `montecristo-espada.json` — three genuinely distinct sub-lines under the Espada name: original Espada,
  Espada Oscuro, and Espada Signature (only one Signature vitola, "Valiente," could be confirmed).
- `montecristo-m.json` — made by A.J. Fernandez in Esteli, Nicaragua; 4 vitolas.
- `montecristo-nicaragua-series.json` — 100% Nicaraguan, made by A.J. Fernandez. Flagged a possible
  relationship to a separately-named "Montecristo 1935 Anniversary Nicaragua" mentioned in some sources —
  not resolved, so kept as its own line under its own distinct name and vitola set.
- `montecristo-platinum.json` — 6 vitolas, sourced directly from Altadis's own product page.
- `_montecristo-classic-additional-vitolas.json` — supplement to the site's existing Classic line (which
  lists Churchill, Especial No.1, No.2 Torpedo, Robusto). A Mac photo is explicitly labeled "Classic_Toro,"
  but no independent retailer source could confirm a Toro as an official Classic vitola in this research
  pass — added with its size marked UNVERIFIED and sourced only to the photo, per project policy of
  recording rather than silently dropping photographed evidence.

## Not added — "Montecristo Original"

A Mac folder is labeled "Montecristo Original" (2 photos). Research found no line officially branded
"Montecristo Original" at any retailer checked. One retailer (JR Cigars) lists a standalone, Cigar
Aficionado-rated "Montecristo" (Dominican-made) that may be what the photos depict — but it's unclear whether
this is a distinct product or just an informal/older name for the already-listed "Montecristo Classic" line.
Documented as a `not_added_flag` inside `_montecristo-classic-additional-vitolas.json` rather than added as
its own line, and listed under `not_added` in the image manifest. Flagging for a future, more targeted
research pass rather than guessing.

## Not re-researched this batch (already on site, no gaps checked)

Epic and White Series are already listed on the site and their Mac photos appear consistent with already-
catalogued vitolas — this batch focused on lines and sub-lines completely absent from the site, so these two
were not checked for additional-vitola gaps. One White Series photo ("Artisan Series Batch II") appears to
depict a separate limited release not covered here. See the image manifest's `already_on_site_no_action`
section.

## Sourcing

halfwheel, Cigar Coop, Corona Cigar, Altadis USA's own product pages, and JR Cigars. Full per-fact URLs are
in each JSON file's `sources`/`research_sources` fields.
