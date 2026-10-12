# Casa de Garcia — Database Research Batch (Altadis USA reorganization, part 8)

Checked against the site's live brand index on 2026-09-30 — **Casa de Garcia is confirmed completely absent**.
This batch includes a full new `brand` object (in `casa-de-garcia-connecticut.json`).

## Context: discovered entirely through the Altadis USA reorganization

Unlike every other brand in this project, Casa de Garcia's folder didn't exist as such before this session —
all 14 photos were **misfiled under 3 wrongly-named Altadis USA subfolders** ("Flor de Selva Maduro," "Joya de
Nicaragua Red," "La Aroma de Cuba Connecticut") discovered mid-reorganization by inspecting actual filenames
rather than trusting the folder names. They've been consolidated into a correct, new top-level "Casa de
Garcia" folder with 6 sub-folders, one per wrapper variant/sub-line.

## Brand background — budget/bundle tier, thin sourcing

Casa de Garcia is a budget cigar brand distributed by Altadis USA (~$1-2/stick, sold largely in bundles), made
at the same factories that produce Montecristo, Romeo y Julieta, and Saint Luis Rey. **Founding year is
unverified** — not found in any source checked, including Wikipedia's list of cigar brands, which doesn't
list this brand at all. Trade-press coverage (halfwheel, Cigar Aficionado, Cigar Snob) is essentially
nonexistent, consistent with the budget tier — retailer pages are the best available sourcing here, as
expected for this category.

**Correction to an initial assumption**: research found no support for Honduran manufacture. The 4 core
wrapper-variant lines (Connecticut, Maduro, Sumatra, Nicaragua) are made in the **Dominican Republic**; the 2
Centenario lines are made in **Nicaragua** by the Plasencia family. Honduran-grown filler tobacco appears in
several blends, which may be the source of the Honduras assumption, but it isn't the factory/origin country.

## 6 lines (all new — brand wasn't on the site at all)

- `casa-de-garcia-connecticut.json`, `casa-de-garcia-maduro.json`, `casa-de-garcia-sumatra.json` — wrapper
  variants of one core blend. Sumatra's full vitola list is thinly/inconsistently sourced — only 2 vitolas
  confirmed on a primary retailer page.
- `casa-de-garcia-nicaragua.json` — a genuinely distinct, fuller-bodied blend (not just a wrapper variant).
  Only 1 vitola (Belicoso) independently confirmed; a fuller size run appears in a secondary source but wasn't
  added without manufacturer confirmation.
- `casa-de-garcia-centenario-red-label.json` and `casa-de-garcia-centenario-gold-label.json` — a newer,
  genuinely distinct pair of sub-lines made at a different factory (Plasencia family, Nicaragua). **Important
  correction**: the Mac folder for Gold Label was named "Centenario Yellow," but exhaustive research across
  Altadis's own site and 8 retailers found only a confirmed "Centenario Gold Label" — no "Yellow" product
  exists anywhere. Mapped to the real product name; flagged prominently rather than inventing a "Yellow" line.
  A physical band check is recommended to fully settle this.

## Sourcing

Altadis USA's own product pages, JR Cigars, Cigars.com, Famous Smoke/Cigar Advisor, Gotham Cigars, Cigar
Century, StogieReview, CCCrafter. Full per-fact URLs are in each JSON file's `sources`/`research_sources`
fields.
