# AVO — Database Research Batch (2026-10-11)

## Context

AVO already exists on Cigar Codex with 14 lines catalogued. This batch is a **gap-fill pass**: it cross-references the Mac photo library (`Cigar Images/AVO`, a flat folder with cryptic abbreviated filenames — not pre-organized) against the site's existing AVO catalog and researches only the lines that are genuinely missing.

No `brand` object is included in any file this batch — AVO is already on the site.

## New lines added (2)

1. **AVO Expresivo** (`avo-expresivo.json`) — Robusto 5x52, Toro 6x54, Churchill 7x48.
   - **Correction to an initial assumption:** the Mac filename prefix "Exp" was first assumed to mean "AVO Expression," a long-running line. Research found no such line exists. The real product is **AVO Expresivo**, a brand-new regular-production line debuting at PCA 2026 and launching in US stores June 25, 2026 — the opposite of long-running. It's notable as the first AVO made outside the Dominican Republic (produced at Davidoff's Diadema Cigars de Honduras factory in Honduras).
   - **Flag:** because this is a mid-2026 launch, the Mac photo's capture/acquisition date should ideally be checked against the release timeline before treating this as a fully settled catalog entry — not done this session, left for the user's awareness.

2. **AVO Syncro 10th Anniversary Limited Edition** (`avo-syncro-10th-anniversary-le.json`) — single Diadema/Diademas Finas vitola, 6.625x50, box-pressed.
   - A one-off 2025 limited edition marking 10 years since AVO Syncro Nicaragua's 2015 debut (not a new permanent Syncro variant).
   - **Size discrepancy flagged:** Cigar Coop's own announcement states "60 x 6-5/8," which reads as a transposition/garbling error rather than a genuine 60-ring cigar. Three independent retailers agree on 6.625 x 50, which was used as the reliable figure.
   - Wrapper/filler details carry minor single-source caveats (noted in the JSON's `wrapper`/`filler` fields) — recorded as-is rather than smoothed over.

## Not re-researched / no action

- **AVO Classic No. 2** — 1 Mac photo (`AVO_Classic-No-2_01.jpg`). Already listed on the site under the existing Classic line. No gap, no action taken.

## File handling

No Mac file renames were performed this batch — the flat folder structure was left as-is since only these specific files needed identifying, not a full reorganization.

## Sourcing

Primary sources: Davidoff's own store, halfwheel, Cigar Aficionado, Cigar Coop, and specialty retailers (Cigars Direct, Hilands Cigars). See each JSON file's `research_sources` array for the full list. No fabricated data — all specs either matched 2+ independent sources or are flagged as single-sourced where noted.
