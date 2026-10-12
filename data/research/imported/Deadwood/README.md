# Deadwood — Database Research Batch (2026-10-11)

## Context

Deadwood is **not on the site at all** — confirmed absent from the site's full 112-brand index. A full new `brand` object is included.

## Important correction

The starting hypothesis was that "Deadwood" might be a Black Label Trading Company sub-line/line. Research ruled this out entirely — no source anywhere connects "Deadwood" to Black Label Trading Company. The real brand is **Deadwood Tobacco Co.**, produced and distributed by **Drew Estate**, rolled at La Gran Fabrica Drew Estate in Estelí, Nicaragua. It started as a South Dakota retail-exclusive brand and went national via Drew Estate around 2016, sold as "Deadwood by Drew Estate."

## Lines/sub-blends added (4)

1. **Deadwood Crazy Alice** (`deadwood-crazy-alice.json`) — one of the brand's 4 core "Wild Bunch" blends (Sweet Jane, Fat Bottom Betty, Crazy Alice, Leather Rose), debuted 2014. **Flag:** exact vitola dimensions and binder origin are inconsistent across retailers — recorded as an open discrepancy rather than resolved by guessing.

2. **Deadwood Sweet Jane Día de los Muertos Limited Edition 2024** (`deadwood-sweet-jane-dia-de-los-muertos-le-2024.json`) — Toro, 6x50. A limited-edition variant of the Sweet Jane blend, originally a 2019 Drew Estate Lounge exclusive, returned nationally in 2024 and again in 2025. Wrapper/binder/filler/factory could not be confirmed and are left `null`.

3. **Deadwood Dominicana Buenas Noches** (`deadwood-dominicana-buenas-noches.json`) — Gordo, 6x60. A newer (2025) sub-line departing from Deadwood's usual Nicaraguan tobacco toward Dominican-puro-oriented tobacco. Blend composition not found; left `null`.

4. **Deadwood Fat Bottom Betty** (`deadwood-fat-bottom-betty.json`) — Gordito 6x60 (matches the Mac photo), plus Robusto 5x54 and Toro 6x50 (found in sourcing, no matching photo, included for lineup completeness). Another of the 4 core "Wild Bunch" blends, debuted 2013; the Gordito is a 2019 size extension.

## File handling

No Mac file renames were performed this batch.

## Sourcing

Primary sources: Mike's Cigars, Corona Cigar, halfwheel, Cigar Coop, Drew Estate's own press releases, Cigars Direct. See each JSON file's `research_sources` array for the full list.
