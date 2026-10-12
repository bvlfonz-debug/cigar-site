# Romeo y Julieta — Database Research Batch (Altadis USA reorganization, part 2)

Researched against the live catalog at https://cigar-site.vercel.app/brands/romeo-y-julieta/ on 2026-09-30.

## Context: part of the Altadis USA reorganization

Romeo y Julieta's Mac folder was consolidated during the large-scale Altadis USA distributor-umbrella
reorganization (see the Altadis USA batch notes for the full story). One loose file previously sitting
directly under the old "Altadis USA/Romeo y Julieta" path was merged into this brand's main, already-existing
top-level "Romeo y Julieta" folder. No filenames needed correction in this batch.

Romeo y Julieta already exists in the site's catalog (1875, Reserva Real, Romeo Añejo, and others), so no
`brand` object is included in any of these files — only new `line` objects and one `additional_vitolas`
supplement.

## 3 new lines, 1 supplement

- `romeo-y-julieta-150th-anniversary.json` — commemorates the brand's 1875 founding; launched by Altadis USA,
  debuted at Procigar February 2025, national launch at the PCA Trade Show April 2025. Named halfwheel's 2025
  #2 Cigar of the Year. 4 vitolas, including a limited "Reconciliation" belicoso exclusive to a special
  35-cigar anniversary humidor.
- `romeo-y-julieta-reserve.json` — a genuinely distinct line from the site's existing "Reserva Real": Reserve
  is Honduran-made (vs. Reserva Real's Dominican origin), confirming a different product rather than a naming
  variant. Flagged one retailer's use of "Habana Reserve" for the same Churchill vitola as an unresolved
  possible naming variant.
- `romeo-y-julieta-vintage.json` — a long-running Dominican line; 9 vitolas (Corona Glass Tubes through
  Vintage VII), though some show as out-of-stock/restock at retail rather than confirmed-discontinued.
- `_romeo-anejo-additional-vitolas.json` — supplement to the site's existing "Romeo Añejo" line (which lists
  only Piramide, 6.125x52). A Mac photo confirms a Toro (6x54, Connecticut Broadleaf wrapper) also exists in
  this line. A possible Robusto vitola appeared in one retailer's catalog listing but wasn't independently
  confirmed — not added.

## Not re-researched this batch (already on site, no gaps checked)

1875 and Reserva Real are already listed on the site. This batch focused on lines completely absent from the
site, so neither was checked for additional-vitola gaps — despite several photographed variants (1875's
"Bully," "CT-Nicaragua," "Nicaragua Magnum"; Reserva Real's "Nicaragua Midnight Twist," "Twisted") that were
not cross-checked against the site's current vitola lists. Flagged as candidates for a future
additional-vitolas pass rather than guessed at now. See the image manifest's `already_on_site_no_action`
section for the full file lists.

## Sourcing

halfwheel, Cigar Coop, Cigars International, Cigar Aficionado, Cigar Country, Neptune Cigar. Full per-fact
URLs are in each JSON file's `sources`/`research_sources` fields.
