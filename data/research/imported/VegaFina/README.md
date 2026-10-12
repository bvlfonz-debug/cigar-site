# VegaFina — Database Research Batch (Altadis USA reorganization, part 6)

Checked against the site's live brand index on 2026-09-30 — **VegaFina is confirmed completely absent**. This
batch includes a full new `brand` object (in `vegafina-original.json`).

## Context

Part of the Altadis USA distributor-umbrella reorganization; folder was already top-level, no renames needed.

## Brand background — flag an unstable ownership/supply situation

VegaFina was named for its 1998 founding year, historically much stronger in Europe than the US. **Flagging
explicitly**: as of this research (September 2026), Altadis USA's ownership and its manufacturing partner
Tabacalera de García were both affected by a major, very recent event — US sanctions announced October 2025
against Tabacalera de García's majority shareholder disrupted production, with Altadis temporarily shifting
some manufacturing to AJ Fernandez/Plasencia before shipments resumed under temporary licenses. The brand
object records this rather than asserting a single fixed "current factory" as settled fact.

## 2 new lines

- `vegafina-original.json` — the core line, 7 vitolas (one, Lonsdale, manufacturer-only/not retailer-confirmed).
- `vegafina-1998.json` — aged tobaccos, a step up from the core line. **Flagged**: VF54's exact length
  conflicts across 3 sources (54 ring gauge is consistent); VF46 and VF56 found only in a CA DOJ tobacco
  registry filing, not the current manufacturer page — may be discontinued or regional-only, not asserted as
  currently in production.

## Sourcing

Altadis USA, Cigar Aficionado, JR Cigars, halfwheel, Cigar Coop, and the California DOJ's tobacco product
registry (for two otherwise-undocumented vitola codes). Full per-fact URLs are in each JSON file's
`sources`/`research_sources` fields.
