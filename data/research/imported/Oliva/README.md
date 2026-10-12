# Oliva — Database Research Batch 12

Researched against the live catalog at https://cigar-site.vercel.app/brands/oliva/ on 2026-09-30.

## Cleanest batch in a while — light cleanup, then small, well-verified gaps

Oliva's Mac folder was already organized into 9 clean per-line subfolders, plus 8 loose files at the top
level that were really an unorganized 10th line. Before researching I did two small fixes: grouped those 8
loose "Oli-O-\*" files into a new "Oliva O" subfolder with clear names, and moved 2 Serie V Melanio photos
(a banner and a Maduro Churchill infocard) out of the plain "Serie V" folder where they'd been misfiled.

After that, everything lined up well against the site — Oliva O's 8 photos all matched vitolas the site
already lists under Serie O / Serie O Maduro, so no new file was needed there at all.

## 1 new line

- `serie-g-maduro.json` — a full parallel Maduro-wrapper line to the site's existing "Serie G" entry, not
  just a wrapper flag on the same vitolas. Its lineup is genuinely different: 7 vitolas here (including a
  Presidente and Torpedo the standard line doesn't have) versus 5 on the standard Serie G listing, and some
  names don't map 1:1. Worth a look at whether the site's plain Serie G list itself needs a refresh, since the
  two lines' compositions seem to have diverged over time rather than being a clean wrapper-only split.

## 2 gap-fill supplements

- `_connecticut-reserve-additional-vitolas.json` — the site lists only Toro (6x50); adds Double Toro (6x60),
  confirmed real and current.
- `_serie-o-additional-vitolas.json` — adds Corona (6x46), a 7th vitola the site's 6-item Serie O list is
  missing. Only applies to plain Serie O — no photo evidence of a Corona in the separate Serie O Maduro line,
  so it wasn't added there.

## 1 resolved non-gap, worth noting

- A photo in the Serie V folder is labeled just "Churchill" (no "Extra"). I checked whether this was an
  older/discontinued vitola distinct from the site's "Churchill Extra" (7x52) — research confirmed it's the
  same product; "Churchill" is just the vitola-shape name and "Extra" is part of the marketed line name, not
  a separate size. No new entry added.

## Sourcing

Facts came from halfwheel, Cigar Aficionado, Oliva's own site (olivacigar.com), and several retailers (JR
Cigars, Neptune Cigar, Atlantic Cigar, Famous Smoke, Cigars International, Casa de Montecristo, Mike's
Cigars, Gotham Cigars, Cigar Country). One minor discrepancy left unresolved: Serie G Maduro's Torpedo is
listed as both 6x52 and 6.5x52 across sources — flagged in that file rather than picked arbitrarily.
