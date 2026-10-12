# Aganorsa Leaf — Database Research Batch 8

Researched against the live catalog at https://cigar-site.vercel.app/brands/aganorsa-leaf/ on 2026-09-20.

## The biggest and messiest batch yet — lots of misfiled photos, lots of gaps

Aganorsa Leaf's Mac folder has 14 clean-looking line subfolders, but nearly every one of them turned out
to contain photos for OTHER products mixed in — sometimes another genuine Aganorsa line, sometimes a
different brand entirely. The site's per-line vitola lists are also unusually thin (1-2 vitolas per line),
so this batch found more gaps than any prior one except United Cigars.

## 4 new lines

- `la-validacion.json` — **the single biggest find.** Aganorsa's 2022 rebrand/repackaging of its four core
  lines (Corojo, Maduro, Connecticut, Habano) under one unified "La Validación" band and 3 shared vitolas.
  Its photos were scattered across all 4 of those folders. I couldn't confirm from sources whether the
  site's existing "Aniversario Corojo"/"Aniversario Maduro"/"Connecticut"/"Habano" entries should be
  replaced by this or coexist alongside it — flagged for your judgment.
- `new-cuba-superior.json` — a Connecticut-wrapped, box-pressed expansion of an older "New Cuba" Aganorsa
  product, launched 2023. Do not confuse with the site's separate plain "Connecticut" line.
- `jfr-lunatic-habano.json` — a Habano-wrapped JFR Lunatic sub-line (vitola: Hombre Libre) the site's JFR
  family list is missing entirely.
- `rare-leaf.json` — genuinely separate from "Rare Leaf Reserve" (already on the site) despite the very
  similar name. Sold in Corojo and Maduro wrapper expressions with their own vitola sets.

## 8 gap-fill supplements (existing lines, missing vitolas/editions)

- `_aniversario-maduro-additional-vitolas.json` — adds a 25th-anniversary limited edition (Toro).
- `_guardian-of-the-farm-additional-vitolas.json` — adds Campeon and Rambo to the regular line, Orpheus to
  Nightwatch. Flagged: "Campeon" may also exist as a *separate*, differently-sized Nightwatch vitola beyond
  what I could confirm — worth a follow-up look.
- `_jfr-maduro-additional-vitolas.json` — adds a 2025 "JFR 20th Anniversary" release (4 vitolas) and the
  "JFR 770" bundle vitola.
- `_jfr-corojo-additional-vitolas.json` — adds JFR Corojo 770.
- `_jfr-lunatic-maduro-additional-vitolas.json` — adds two oversized vitolas, El Grande and Bellicoso.
- `_signature-selection-additional-vitolas.json` — adds a distinct Corojo wrapper expression (4 sizes) and
  a Robusto vitola.
- `_supreme-leaf-additional-vitolas.json` — adds Corona Gorda and a 2025 Gran Toro release.
- `_rare-leaf-reserve-additional-vitolas.json` — adds a Corojo Lonsdale.

## 1 separate brand entirely: Mi Querida

Sitting right next to the Aganorsa Leaf folders on your Mac is a "Mi Querida" folder — **this is NOT an
Aganorsa Leaf product.** It's Dunbarton Tobacco & Trust's own brand (Steve Saka, ex-Drew Estate), made at
a Nicaraguan factory (NACSA) that I could not independently confirm has any Aganorsa ownership link,
despite the folder placement suggesting one. `mi-querida.json` models it as its own full brand. One
vitola, "Gordo," couldn't be matched with confidence to an official product name — flagged rather than
guessed.

## Misfiled photos worth fixing on your end

Several photos are sitting in the wrong line folder — most notably "La Validación" and "Rare Leaf"
(non-Reserve) photos inside "Aniversario Corojo"/"Aniversario Maduro"/"Connecticut"/"Habano." I worked
around this by tracing each photo to the correct product rather than trusting the folder name, but the
`_image_manifest.json` notes exactly which folder each file actually lives in versus which product it
belongs to — worth reorganizing those specific files if you want the Mac folders to match reality.

## Sourcing

Facts came primarily from halfwheel and Cigar Coop, aganorsaleaf.com, and multiple retailers (Neptune
Cigar, Atlantic Cigar, Cigars International, JR Cigars). A few specs (La Validación's wrapper/binder/
filler, one Guardian of the Farm Campeon size) rest on manufacturer or retailer copy alone without an
independent halfwheel review — flagged in the relevant files rather than presented as fully corroborated.
