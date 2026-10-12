# Illusione — Database Research Batch 10

Researched against the live catalog at https://cigar-site.vercel.app/brands/illusione/ on 2026-09-22.

## Correction to my own working assumption: Illusione isn't a My Father/Fratello brand

Before researching, I'd been assuming Illusione was connected to the My Father Cigars/Fratello family
(likely bleed-over from working through those batches earlier in this project). Every research agent
independently corrected this: **Illusione is independently owned by founder Dion Giolito**, made at TABSA
(Estelí, Nicaragua) and Raíces Cubanas (Danlí, Honduras) depending on the line. This doesn't change anything
in the output — Illusione already exists as its own brand on the site, so no `brand` object was needed
either way — but flagging it in case ownership/maker fields exist elsewhere in your database.

## Small, clean folder — only 4 lines organized, but real gaps in every one

Illusione's Mac folder is much smaller than recent batches: just 4 clean subfolders (Epernay, Original
Documents, R Rothchildes, Ultra) covering 76 photos, plus 557 files still in `_Needs Research`. All 4
folders' filenames matched their folder names correctly — no misfiling this batch — but each one turned up
real gaps against the site's very thin per-line listings.

## 1 new line: Epernay Tuonela

`epernay-tuonela.json` — a May 2025 San Andrés-wrapper variant of Epernay. It's not a single vitola; it
reuses 4 of the standard Epernay vitola names (Le Ferme, Le Taureau, Le Grande, Le Monde) with a different
wrapper/blend, so I modeled it as its own line rather than folding it into standard Epernay's vitola list.

## 3 gap-fill supplements

- `_epernay-additional-vitolas.json` — adds 5 more genuinely distinct, verified Epernay "Serie 2009"
  vitolas beyond the site's 6: L'Alpiniste, L'Excellence, La Vie, Le Elegance, Le Voyage. One flagged
  discrepancy: sources disagree whether Le Voyage is 9.25x48 or 9.25x49 — left both since I couldn't
  resolve it.
- `_original-documents-additional-vitolas.json` — the biggest finding this batch. The site lists just 2
  Original Documents vitolas (Corojo Robusto, MJ12), but Original Documents is actually a family of 5+
  wrapper editions per Illusione's own site (Candela, Corojo, Habano, Maduro, Ultra), each with its own
  multi-size lineup. I only added the Robusto (5x52) size per new wrapper edition since that's all the photo
  evidence supports — the fuller per-wrapper size catalogs exist on illusionecigars.com if you want them
  added later. Also flagged: "MJ12" on the site has no wrapper attached, but research shows it's sold across
  multiple wrappers (at least Corojo and Maduro) — left as-is rather than guessed at.
- `_r-rothchildes-additional-vitolas.json` — adds the Connecticut wrapper edition (4.5x50, confirmed 2016
  release). The Mac's "Maduro" photo likely corresponds to the site's existing unqualified "Rothschild"
  listing (which appears to be the original Mexican San Andrés/maduro blend) rather than a new gap — no new
  vitola added for that one, just a note.

## The "Ultra" mix-up — not a misfiling, but worth understanding

The Mac's separate "Illusione Ultra" folder contains one photo, but its filename is
`Illusione_Original-Documents_Ultra_02.png` — confirming it actually depicts **Original Documents Ultra**
(a Corojo/Café Colorado wrapper edition within the Original Documents family), not the site's existing,
genuinely separate "Illusione Ultra" line (OP No. 9, 5.5x56, Colorado maduro, box-pressed). These are two
different real products that happen to share the word "Ultra." I filed this photo's content under the
Original Documents supplement rather than the standalone Ultra line, and flagged in `_image_manifest.json`
that the site's real "Illusione Ultra" (OP No. 9) line still has no matching Mac photo at all.

## Sourcing

Facts came from Illusione's own site (illusionecigars.com), halfwheel, Cigar Coop, Cigar Aficionado, and
several retailers (Atlantic Cigar, Neptune Cigar, Corona Cigar, Famous Smoke, Small Batch Cigar,
Smokingpipes, Cigar Spots). A few specifics — Le Voyage's exact ring gauge, and one retailer's Café
Colorado/Raíces Cubanas language on the base Rothchildes page that conflicts with more authoritative
sourcing — could not be fully resolved and are flagged in the relevant files rather than picked arbitrarily.
