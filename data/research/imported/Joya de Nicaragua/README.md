# Joya de Nicaragua — Database Research Batch 2

Researched against the live catalog at https://cigar-site.vercel.app (brand page: `/brands/joya-de-nicaragua/`)
on 2026-09-17. Joya de Nicaragua was chosen second — after Rocky Patel — because it has the second-most
fully-organized product photos of any brand on this Mac (697 renamed files across 23 confirmed line folders).

## Schema used

Same as the Rocky Patel batch: the **nested schema Claude Code sent** (`line` + `vitolas`, with `sources`
per fact). Every file omits the `brand` object, since "Joya de Nicaragua" already exists in the site's brand
catalog. Two extra fields per file, outside the strict schema — `research_notes` and `research_sources` —
for your own QA; strip these before upload if Claude Code's loader is strict about unknown keys.

## What's in this folder

- **10 standard line files**: `cyb.json`, `rosalones.json`, `rosalones-reserva.json`, `clasico-medio-siglo.json`,
  `cuatro-cinco-edicion-europa.json`, `cuatro-cinco-pata-negra.json`, `cuatro-cinco-secret-cask.json`,
  `flor-de-nicaragua-ventus-aurum.json`, `rosalones-seleccion-bodegas-2023.json`, `cinco-decadas-fundador.json`.
- **1 special-case file**: `jewel-collection.json` — this is a **sampler**, not a normal blend (see below),
  so it does NOT follow the `line`/`vitolas` shape. It uses `{"is_sampler": true, "sampler_details": {...}}`
  instead. Whoever writes the Claude Code loader will need a branch for this shape, or it can be handled
  manually as a one-off bundle product.
- `_image_manifest.json` — companion file (the schema has no photo field) mapping each researched line to
  its available photos, as relative paths under `Cigar Images/Joya de Nicaragua/` on your Mac. 68 photos
  across the 11 JSON-backed lines, plus 3 more photos under `unverified_line_photos.soho-house-edition`
  (see flag below).
- No file for **Soho House Edition** — research could not confirm this product exists at all (see below).

## How these 11 were chosen

I pulled all 23 Joya de Nicaragua line folders you have organized on the Mac and diffed them against what
`/brands/joya-de-nicaragua/` currently lists (14 lines). 12 of your folders don't cleanly match an existing
site entry — 11 became normal line files, 1 (Jewel Collection) turned out to be a sampler rather than a
blend, and 1 (Soho House Edition) could not be verified to exist. The other 12 of your folders already match
an existing site entry and were left alone: 200 Aniversario (= site's "Dos Cientos"), Antaño 1970, Antaño CT,
Antaño Dark Corojo, Antaño Gran Reserva, Black, Cabinetta, Cinco de Cinco, Clásico Original, Cuatro Cinco
Reserva Especial, Número Uno, Red, Silver.

## Flagged: "Jewel Collection" is a sampler, not a blend

Confirmed via JDN's own site and multiple retailers: "The Ultimate Jewel Collection" is a limited-edition
14-cigar sampler box (released March 2024), pulling one vitola from each of 14 existing JDN lines — it is
not its own unique blend. See `jewel-collection.json` for the full list of what it contains. Your 3 photos
of this folder are almost certainly of the sampler box/packaging itself, not a new product.

## Flagged, not included: "Soho House Edition"

Your Mac has a **`Joya de Nicaragua Soho House Edition`** folder (3 photos), but I could not find any
evidence this product exists — not on JDN's official site, not at any major retailer (Cigars International,
JR Cigars, Famous Smoke, Cigar Aficionado), not in cigar trade press, and not via general web search for
any JDN × Soho House collaboration. I did not write a line file for it, and did not guess at specs. The 3
photos are listed under `unverified_line_photos` in the image manifest rather than the main `lines` object.
**Recommend you personally double-check this folder** — it's possible the photos are mislabeled (e.g. a
misnamed folder for an existing line, or a private/custom order not sold at retail) rather than evidence of
a real catalog gap.

## Ambiguous cases resolved through extra research (not assumption)

- **Rosalones vs. Rosalones Reserva**: confirmed as two genuinely separate blends (different wrapper —
  Ecuador Connecticut-seed vs. Nicaraguan Habano Criollo Colorado), not a packaging variant. Both are on
  the site as of the 2026 U.S. launch. Note: your Mac's single Rosalones Reserva photo lives inside the same
  physical folder as the 17 plain-Rosalones photos — see the image manifest for the split.
- **Clásico Medio Siglo "Pata Negra"**: confirmed this is a variant/vitola *within* Clásico Medio Siglo
  (JDN's annual Spain-exclusive "Pata Negra" prestige series applied to that blend for 2023), not a separate
  line. Correctly folded into `clasico-medio-siglo.json` as one of its vitolas rather than split out.
- **Cuatro Cinco Edición Europa / Pata Negra / Secret Cask**: confirmed as three independently distinct
  blends despite sharing the "Cuatro Cinco" family name — each has its own wrapper, format, and story
  (Europa: rum-barrel-aged ligero, 7x52 box-press; Pata Negra: Spain-exclusive annual edition, 4.88x56;
  Secret Cask: returns to the original 2013 all-Nicaraguan puro recipe, spirit-cask-aged filler, 6x54).
- **Cinco Décadas Fundador**: confirmed (via my own WebSearch/WebFetch, not a subagent) as a distinct 2019
  annual-edition release within the "Cinco Décadas" series — different from the site's current "El General"
  edition, so it stays in scope as a genuine gap.

## Lines your Mac has zero photos for

The site's JDN catalog also lists other lines you don't have organized folders for — nothing to research
there since there's no local photo backlog for this batch pass.

## Sourcing

Facts came from cigar retailer/review sites (halfwheel, Cigar Coop, Cigar Aficionado, Blind Man's Puff,
Cigar Journal, Cigar Smoker Club) and Joya de Nicaragua's own official site (joyacigars.com). See each
line's `research_sources` array for the exact URL behind every field. Nothing was invented; anything
unverifiable is `null`/empty with a note in `research_notes`. Two lines (Flor de Nicaragua Ventus Aurum,
Rosalones Selección Bodegas 2023) are Spain/Europe-market-only products with thin English-language press
coverage — their files have more `null`s than the U.S.-market lines as a result, not because research was
skipped.
