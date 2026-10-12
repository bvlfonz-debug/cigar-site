# La Flor Dominicana — Database Research Batch (2026-10-11)

## Context

La Flor Dominicana (LFD) already exists on Cigar Codex with 4 lines catalogued (Air Bender, Andalusian Bull, Double Ligero, Reserva Especial). This batch is a **gap-fill pass**: it cross-references the Mac photo library (`Cigar Images/La Flor Dominicana`, a flat folder with cryptic abbreviated filenames prefixed "Lfd-"/"LFD-" — not pre-organized) against that catalog.

No `brand` object is included in any file this batch — La Flor Dominicana is already on the site.

## New lines added (5)

1. **La Flor Dominicana La Nox** (`la-flor-dominicana-la-nox.json`) — Toro, 6.5x50. Unveiled at the 2015 IPCPR Trade Show. **Flag:** the Mac filename implies a "Petit" vitola, but no source anywhere confirms a Petit size exists for this line — only the 6.5x50 Toro is documented, so the line is published with just that vitola rather than fabricating a Petit entry.

2. **La Flor Dominicana Capítulo II (Chapter Two)** (`la-flor-dominicana-capitulo-ii.json`) — Chisel, box-pressed, 6.5x58. Confirmed as its **own** limited-edition line (the follow-up to a previous "Chapter One"), **not** part of Double Ligero — despite sharing the "Lfd-" filename prefix with the Double Ligero photos.

3. **La Flor Dominicana Ligero** (`la-flor-dominicana-ligero.json`) — L300 (5.75x50), L400 (5.75x54), L500 (5.75x60, no matching photo this batch but included for lineup completeness). Confirmed as a genuinely **separate** numbered series from the already-listed "Double Ligero" — the plain "L" prefix (vs. "DL") reflects two distinct lines, not a numbering variant of the same one.

4. **La Flor Dominicana La Volcada** (`la-flor-dominicana-la-volcada.json`) — Churchill, 7x48. Shown at 2017 IPCPR, explicitly described by the brand as part of a limited-production series. A 4.25x42 Short Corona was announced for 2019 but could not be confirmed to have ever actually shipped — included with that caveat rather than asserted as fact.

5. **La Flor Dominicana Oro** (`la-flor-dominicana-oro.json`) — No. 5 (6x48), No. 6 (6x54), No. 7 (7.5x52), No. 8 (7x60). Originally launched 2012 with 3 sizes; actively expanded with 3 new sizes in October 2025 (current, non-limited, actively growing line).

## Additional-vitola supplement (1)

- **Double Ligero** (`_double-ligero-additional-vitolas.json`): adds DL-452, DL-600 (Maduro + Natural), DL-654, Chisel, and DL-700 to the existing line. **Flag:** DL-452's ring gauge conflicts between a 2013 preview source (42) and current retail listings (52) — recorded as an open discrepancy rather than resolved by guessing. Also found in sourcing but with no matching Mac photo this batch (not added): DL-660, DL-854, DL-Churchill Oscuro Natural Especial.

## Not re-researched / no action

- **Andalusian Bull photo** — matches the already-listed line exactly (6.5x64), confirmed, no gap.
- **Air Bender marketing/magazine stock image** — generic promotional image of the already-listed line, no new data.

## File handling

No Mac file renames were performed this batch — the flat folder structure was left as-is.

## Sourcing

Primary sources: Cigar Coop, halfwheel, Cigar Aficionado, Cigars Lover, Tobacconist of Greenwich, Corona Cigar, The Cigar Authority, cgarsltd.co.uk. See each JSON file's `research_sources` array for the full list.
