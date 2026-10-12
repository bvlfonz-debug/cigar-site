# Onyx — Database Research Batch (Altadis USA reorganization, part 7)

Checked against the site's live brand index on 2026-09-30 — **Onyx is confirmed completely absent**. This
batch includes a full new `brand` object (in `onyx-reserve.json`).

## Context

Part of the Altadis USA distributor-umbrella reorganization; folder was already top-level, no renames needed.

## Brand background

Founded 2000, named for its original dark, near-black Connecticut Broadleaf wrapper. Now a 3-line portfolio
spanning Dominican (Reserve) and Nicaraguan-puro (Bold Nicaragua, Vintage Nicaragua) expressions.

## 3 new lines

- `onyx-reserve.json` — the original/legacy Dominican maduro blend, several vitolas square-pressed.
- `onyx-bold-nicaragua.json` — released 2020, a bolder Nicaraguan-puro-adjacent expression with a dark San
  Andres wrapper.
- `onyx-vintage-nicaragua.json` — released 2023, a fully Nicaraguan-puro blend with a deliberately lighter
  wrapper, distinguishing it from the brand's traditional dark look. **QA flag**: shares identical vitola
  names/dimensions with Bold Nicaragua despite being a different blend — corroborated by two independent
  sources, so treated as verified rather than a duplication error, but noted as an unusual coincidence.

## Sourcing

Altadis USA's own product pages, Cigar Aficionado, halfwheel, Cigar Coop, JR Cigars. Full per-fact URLs are
in each JSON file's `sources`/`research_sources` fields.
