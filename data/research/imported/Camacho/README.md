# Camacho — Database Research Batch (2026-10-11)

## Context

Camacho already exists on Cigar Codex with 5 lines catalogued. This batch is a **gap-fill pass**: it cross-references the Mac photo library (`Cigar Images/Camacho`, a flat folder with cryptic abbreviated filenames — not pre-organized) against the site's existing Camacho catalog.

No `brand` object is included in any file this batch — Camacho is already on the site.

## Important correction: misfiled "Charter Oak" photos

4 of the 17 original files in the Camacho folder were photos of **Charter Oak**, a completely unrelated brand made by Foundation Cigar Company (no corporate or production connection to Camacho or Davidoff). This was discovered during research into the "Charter Oak" filename fragments rather than assumed from the folder they were sitting in.

These 4 files were physically moved to a new top-level `Charter Oak` folder (with 2 line subfolders) and renamed with corrected, descriptive filenames. Charter Oak is written up as its own full brand batch — see `Cigar Images/_Database Research/Charter Oak/`. The `_image_manifest.json` here documents the `moved_out` details (old path → new path, per file).

## New lines added (2)

1. **Camacho Limited Edition 2025** (`camacho-limited-edition-2025.json`) — single Toro vitola, 6x52.
   - **Correction to an initial assumption:** the Mac filenames "25-Le"/"Cam-Le-25" were first assumed to indicate a 25th-anniversary release. Research found "25" instead refers to the year 2025, not an anniversary milestone — no verified 25th-anniversary Camacho release exists. This is Davidoff/Camacho's annual limited-edition release, successor to the long-running "Liberty Series" (2002–2024).

2. **Camacho Broadleaf** (`camacho-broadleaf.json`) — Robusto 5x50, Toro 6x50, Gordo 6x60.
   - Confirmed as a genuinely distinct line, **not** another name for the already-listed Camacho Triple Maduro. Triple Maduro uses a Connecticut Broadleaf wrapper; Camacho Broadleaf uses **Honduran-grown** broadleaf — a different origin. Announced July 2023, released September 2023.

## Additional-vitola supplements (3)

Site lines missing vitolas confirmed present in the Mac photos:

- **Corojo** (`_camacho-corojo-additional-vitolas.json`): adds BXP Toro (box-pressed, 6x50) and Gigante (6.5x54 — confirmed distinct from the separately-listed Gordo 6x60).
- **Connecticut** (`_camacho-connecticut-additional-vitolas.json`): adds Churchill (7x48) and Toro (6x50).
- **Triple Maduro** (`_camacho-triple-maduro-additional-vitolas.json`): adds Gordo (6x60) and Toro (6x50).

## Not re-researched / no action

- Corojo Robusto/Toro and Connecticut Robusto photos — already-listed vitolas, no gap.
- One marketing/magazine stock image (`CamachoConnecticut_EssentialCigars_CigarPressMagazine.png`) — not a product photo, no database entry needed.

## Sourcing

Primary sources: Cigar Coop, halfwheel, zigarren.zone, Casa de Montecristo, and specialty retailers (Mike's Cigars, Wooden Cork, Corona Cigar, Cigars International). See each JSON file's `research_sources` array for the full list.
