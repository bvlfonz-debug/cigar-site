# Kristoff — Database Research Batch (2026-10-11)

## Context

Kristoff already exists on Cigar Codex with 3 lines catalogued. This batch is a **gap-fill pass**: it cross-references the Mac photo library (`Cigar Images/Kristoff`, a flat folder with cryptic abbreviated filenames — not pre-organized) against the site's existing Kristoff catalog.

No `brand` object is included in any file this batch — Kristoff is already on the site.

## New lines added (5)

1. **Kristoff Guardrail** (`kristoff-guardrail.json`) — Robusto, 5.25x54.
   - **Correction to an initial assumption:** the Mac filename "Kri-Guard-Rob" was first assumed to mean "Guardian of the Farm" — that name belongs to an unrelated brand entirely. The real product is **Kristoff Guardrail**, debuted 2022, ranked #8 on Cigar Coop's 2023 Cigar of the Year countdown.
   - Flagged: only one size was found in sourcing this pass — may not be the line's only vitola, not confirmed either way.

2. **Kristoff Nicaragua** (`kristoff-nicaragua.json`) — Robusto 5x50, Toro 6.25x54, 6x60. Confirmed distinct from the already-listed Kristoff San Andres; debuted 2023 PCA.

3. **Kristoff TAA Exclusive 2023** (`kristoff-taa-exclusive-2023.json`) — Double Perfecto, 6.25x60. An annual exclusive-retailer release ("TAA" = Tobacconists' Association of America; "23" = 2023). **Thin sourcing flag:** wrapper/binder/filler/factory could not be found this session and are left `null` rather than guessed.

4. **Kristoff Tres Compadres** (`kristoff-tres-compadres.json`) — Robusto 5x50, Toro 6.25x54, Gordo 6x60. Introduced at 2023 PCA alongside Kristoff Nicaragua, honoring Glen Case's friends Rolando Villamil and Chuck Finch.

5. **Kristoff PCA 2024 Signature Series** (`kristoff-pca-2024-signature-series.json`) — single box-pressed Toro vitola, 6.5x54. The official PCA 2024 trade-show-exclusive release.

## Unresolved — not published

**Kristoff "Vente"** (`_kristoff-vente-UNRESOLVED.json`) — the Mac photo `Kristoff_Vente-Robusto_01.jpg` could not be matched to any confirmed Kristoff product. No source anywhere confirms what "Vente" refers to. A plausible but **unconfirmed** theory is offered (Spanish "Veinte" = twenty → possibly "Kristoff Twentieth Anniversary," which does have a confirmed Robusto 5x50 vitola) but this is **not** asserted as fact and **not** published as a real line. This is recorded as an explicit `not_added_flag` per the project's standing no-fabrication policy, with candidate theories listed for a future follow-up pass (ideally a visual band comparison against Twentieth Anniversary, Ligero Criollo, and Connecticut band art).

## File handling

No Mac file renames were performed this batch — the flat folder structure was left as-is.

## Sourcing

Primary sources: halfwheel, Cigar Coop, JR Cigars, Cigar Aficionado, Smoke-King, Cigar Inspector, CGARS Ltd. See each JSON file's `research_sources` array for the full list.
