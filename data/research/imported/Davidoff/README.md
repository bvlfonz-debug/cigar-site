# Davidoff — Database Research Batch (2026-10-11)

## Context

Davidoff already exists on Cigar Codex with 9 lines catalogued (Escurio, Grand Cru, Millennium, Nicaragua, Signature, Winston Churchill Limited Edition 2019, Winston Churchill The Late Hour, Winston Churchill The Original Collection, Yamasá). This batch is a **gap-fill pass**: it cross-references the Mac photo library (`Cigar Images/Davidoff`, a flat folder with cryptic abbreviated filenames — not pre-organized) against that catalog.

No `brand` object is included in any file this batch — Davidoff is already on the site.

## New lines added (3)

1. **Davidoff Chefs Edition 2025** (`davidoff-chefs-edition-2025.json`) — single Toro vitola. The 4th installment of an ongoing "Chefs Edition" collaboration series with 5 Michelin-starred chefs (11 stars total). Limited edition, 17,500 boxes worldwide. **Flag:** the exact toro dimension conflicts between sources (6.25x52 vs. 6x54 in different places on the same retailer's own listing) — recorded as an open discrepancy rather than resolved by guessing.

2. **Davidoff Escurio 10th Anniversary Limited Edition 2025** (`davidoff-escurio-10th-anniversary-le-2025.json`) — single Gran Toro vitola, 6x56. A one-off limited blend marking 10 years since Escurio's 2015 debut. The blend materially differs from standard Escurio (added Ecuadorian wrapper, Brazilian binder, bourbon-cask-aged filler), so it's recorded as its own entry rather than silently folded into the base Escurio line.

3. **Davidoff Year of the Horse Limited Edition 2026** (`davidoff-year-of-the-horse-le-2026.json`) — Toro Especial 6.5x55 and a Flagship Exclusive torpedo 6x52.
   - **Decode, not a guess:** the Mac filename "Yoth" was confirmed via multiple independent cigar-news sources to mean "Year of the Horse" — the newest entry in Davidoff's long-running Lunar New Year/zodiac limited-edition series (since 2013).
   - Wrapper, binder, and factory could not be confirmed in any source found and are left `null`.
   - A Gift Set and a Masterpiece Humidor from the same release were found in research but have no matching Mac photo, so were not added as separate entries this pass.

## Not re-researched / no action

- **5 Millennium pack photos** (Petit Corona, Piramide, Robusto, Robusto Tubo, Toro) — all decoded and confirmed to be the already-listed Millennium line's current, standard vitola lineup. No gap, no action.
- **4 generic marketing/magazine stock images** (Anniversario, AVO XO, Millennium Blend, Winston Churchill) — not usable as evidence for a specific new database entry; not researched as products.

## File handling

No Mac file renames were performed this batch — the flat folder structure was left as-is.

## Sourcing

Primary sources: Regency Cigar, Mike's Cigars, Cigars Lover, Cigar Coop, Cigar Aficionado, Cigar Inspector, Cigar Journal, James Fox, Tobacconist of Greenwich, The Cigar Authority. See each JSON file's `research_sources` array for the full list.
