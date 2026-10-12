# Perdomo — Database Research Batch 11

Researched against the live catalog at https://cigar-site.vercel.app/brands/perdomo/ on 2026-09-30.

## First: this folder got reorganized before research even started

Perdomo's Mac folder was flat — all 62 files loose with abbreviated, inconsistent names (two different naming
conventions for what turned out to be the same Legacy line: "Leg-Rob-Ct" and "Per-Leg-Rob-Ct"). Rather than
research blind or put it on hold like Padrón, you asked me to decode and reorganize it first. I researched
every abbreviation against halfwheel, Cigar Coop, Perdomo's own site, and retailers, then created 8 per-line
subfolders and renamed every file to its real product name. That reorganization is done and is a separate
piece of work from the JSON research below — see the folder itself for the results.

## The site drastically undercounts several lines

Perdomo's site listing is thin in a specific way: most lines show only their Epicure vitola, and two entire
wrapper editions (Habano Bourbon Barrel-Aged Connecticut, and standalone 10th Anniversary Maduro/Sun Grown)
aren't listed at all, even though their sibling wrapper editions are.

## 5 new lines

- `reserve-10th-anniversary-maduro.json` and `reserve-10th-anniversary-sun-grown.json` — bourbon-barrel-aged
  Nicaraguan wrapper editions of the 10th Anniversary line, parallel to the site's Connecticut ("Champagne")
  version. **Flagged for review:** these might already be represented by the site's existing "Reserve 10th
  Anniversary Box-Pressed Maduro" entry under a different vitola set — I couldn't determine if that's the same
  product or a separate one, so I didn't merge them. Only Epicure (plus Robusto for Maduro) could be verified;
  I didn't assume the full 6-vitola Champagne range carries over.
- `perdomo-40th-anniversary-two-guys-exclusive.json` — **not a Perdomo company anniversary.** This is a
  August 2025 retailer-exclusive for Two Guys Smoke Shop's own 40th anniversary, limited to 400 ten-count
  boxes. Flagged clearly in the line name and description since it's a one-off, not a standing catalog line —
  your call whether it belongs in a general database.
- `perdomo-fresco.json` — a real, long-running budget-tier line (in production since at least 2007) that
  isn't on the site's 9 listed lines at all. Vitola sizes (Robusto, Toro) couldn't be verified from any source
  found — left as `null` rather than guessed.
- `perdomo-habano-bourbon-barrel-aged-connecticut.json` — the site has "Habano Bourbon Barrel-Aged **Sun
  Grown**" but not the Connecticut edition, which is an equally real, current parallel product with its own
  5-vitola range.
- `perdomo-legacy.json` — the big one. A whole line (launched PCA 2025) not on the site at all: 5 vitolas ×
  3 wrappers (Connecticut, Maduro, and **Shade Grown** — not "Sun Grown," a common mislabel I initially made
  too, corrected against Perdomo's own site and halfwheel/Cigar Coop). 14 of 15 possible combinations have
  photo evidence; Churchill Maduro is the one missing combination and wasn't assumed to exist.
- `perdomo-legacy-father-and-son.json` — a separate, newer (2026) limited collaboration between Nick Perdomo
  Jr. and Nick Perdomo III, one box-pressed gran figurado vitola (6 x 48/60/52) across the same 3 wrappers.

## 3 gap-fill supplements

- `_reserve-10th-anniversary-champagne-additional-vitolas.json` — adds Corona Extra (5.625x46) and Magnum 50
  Tubo (6x50, individually tubed — genuinely distinct from the already-listed Super Toro despite similar
  length). One more photo, labeled "Supremo," couldn't be matched to any verified vitola name in this or any
  other current Perdomo line — excluded, flagged as unresolved.
- `_30th-anniversary-connecticut-additional-vitolas.json` and `_30th-anniversary-maduro-additional-vitolas.json`
  — the site lists only Epicure for each of these two wrapper editions; the Mac photos add Churchill, Gordo,
  and Torpedo to Connecticut, and Churchill, Gordo, Robusto, and Torpedo to Maduro (7 new vitola entries total).

## 2 unresolved items, not included in output

- One photo (now filed in `_Unclear - Connecticut (verify which line)`) couldn't be confidently matched to
  any of Perdomo's three real Connecticut-wrapper lines (Habano Connecticut, 10th Anniversary Champagne, or
  BBA Connecticut) — left out rather than guessed.
- The "Supremo" vitola photo mentioned above.

## Sourcing

Facts came primarily from halfwheel, Cigar Coop, and Perdomo's own site (perdomocigars.com), supplemented by
retailers (Neptune Cigar, Corona Cigar, Atlantic Cigar, Smoke Inn, Casa de Montecristo, Cigars International,
CIGAR.com, Cigar Country, Gotham Cigars, Cuban Crafters, Miami Humidor). Fresco's exact vitola dimensions and
the full vitola range for 10th Anniversary Maduro/Sun Grown beyond Epicure/Robusto could not be resolved and
are flagged rather than guessed.
