# Lampert Cigars — Database Research Batch 3

Researched against the live catalog at https://cigar-site.vercel.app (brand page: `/brands/lampert/`)
on 2026-09-18. Lampert was chosen third. Note: I actually paused before Lampert to check Padrón first
(554 photos, next-highest count), but Padrón's folder turned out to be a flat, unsorted mix of product
photos and site marketing/history images rather than clean per-line subfolders — you asked me to hold
off on Padrón until you clean that folder up, so I moved to Lampert (369 renamed photos, organized into
8 per-line subfolders) instead.

## Schema used

Same as the previous two batches: the **nested schema Claude Code sent** (`line` + `vitolas`, with
`sources` per fact). Files omit the `brand` object since "Lampert" already exists in the site's brand
catalog. Two extra fields per file — `research_notes` and `research_sources` — for your own QA.

## What's in this folder

- **7 new line/edition files**: `lampert-1593.json`, `lampert-baba-yaga.json`,
  `lampert-family-reserve.json`, `lampert-lawyer.json`, `lampert-limitada.json`,
  `lampert-1675-edicion-morado.json`, `lampert-1675-edicion-verde.json`.
- **2 supplementary files for lines that already exist on the site** — `_ocean-breeze-additional-vitolas.json`
  and `_oro-line-additional-vitolas.json`. These are NOT new lines; the site already lists "Ocean Breeze"
  and "Oro Line" as Lampert products, but our Mac photos revealed several vitolas the site's catalog is
  missing. These files carry corrections/additions to merge into the existing site records rather than
  full new `line` objects. See "Deeper-than-usual research" below for why this batch needed this extra step.
- `_image_manifest.json` — 91 photos across the 7 new line files, plus 23 more photos for the
  additional-vitola supplements (Ocean Breeze Gordito, Oro Line Señorito/Gatsby/Short-Perfecto/Kingpin).

## How these were chosen — and why this batch went deeper than Rocky Patel/JDN

Lampert's Mac folder has 8 line subfolders: 1593, 1675, Baba Yaga, Family Reserve, Lawyer, Limitada,
Ocean Breeze, Oro Line. The site's `/brands/lampert/` page currently lists only 3 lines: 1675, Ocean
Breeze, Oro Line — so on the surface, 5 folders (1593, Baba Yaga, Family Reserve, Lawyer, Limitada) were
straightforward gaps, same as previous batches.

But unlike Rocky Patel and JDN, Lampert's "1675", "Ocean Breeze", and "Oro Line" folders on the Mac
contained noticeably MORE product variety than what the site currently catalogs for those same 3 lines —
the site's version of each looks like a minimal/early snapshot. So this batch required a second pass:
checking each already-matched line for missing editions/vitolas within it, not just checking for entirely
missing lines. That's where the two `_*-additional-vitolas.json` files and 2 of the "new" files
(`lampert-1675-edicion-morado.json`, `lampert-1675-edicion-verde.json`) came from.

## "Lampert 1675" — confirmed edition gaps

Site currently lists only "Edición Azul" (Toro) and "Edición Rojo" (Robusto) under 1675. The Mac folder
also has photos for three more 1675 editions:

- **Edición Morado** — CONFIRMED as a genuine, distinct 1675 blend (Mexican San Andrés wrapper, darker/
  fuller than Azul). Written as its own line file since it has its own wrapper/blend identity and product
  page, same pattern as the other Ediciónes.
- **Edición Verde** — CONFIRMED, the 5th blend in the 1675 series (Mexican San Andrés Negro, full-bodied,
  debuted at InterTabac 2025). Also written as its own line file. Note: there's a *separate* product called
  "Lampert 1593 Edición Verde" — different numbered series, don't conflate the two "Verde" cigars.
- **Edición El Chapo** — **NOT included.** Your Mac has 2 photos labeled this, but I could not verify this
  product exists anywhere: not on Lampert's official site, not at halfwheel/Cigar Coop, not at any
  mainstream retailer. The only hit tying "El Chapo" to Lampert at all was one small European retailer
  listing it as a variant tag on the *1593* line (not 1675), which couldn't be corroborated by a second
  source. Recommend you personally check those 2 photos — they may be mislabeled, an unofficial retailer
  nickname, or simply not a real catalog product.

## "Ocean Breeze" and "Oro Line" — vitola-level corrections/additions

- **Ocean Breeze**: the site's one listed vitola, "Robusto Extra" (5x54), appears to be a **naming
  mismatch** — Lampert's own site calls this exact 5x54 size "Robusto Grande," and no source anywhere uses
  "Robusto Extra." Recommend renaming rather than treating as two different vitolas (flagged, not auto-fixed,
  in `_ocean-breeze-additional-vitolas.json`). Also confirmed a genuine additional vitola, **Gordito** (4x58),
  which your Mac has one photo for.
- **Oro Line**: confirmed 3 more genuine vitolas within the existing blend — **Señorito** (Half Corona),
  **Gatsby** (Torpedo), and **Small Batch Short Perfecto** (your folder's "Short-Perfecto" and "Small-Batch"
  filenames are the same vitola, not two). Also found **Kingpin** — flagged separately because it appears to
  be marketed under the Oro name but is actually a *different sub-blend* (different wrapper, bands, aging)
  rather than just another shape, per halfwheel. Several other names in your Oro Line folder — Continental-52,
  Platino, Corona, Culebra, El-Jefe, Emperador, La-Senora, Maduro, and a plain "Toro-Grande" — could **not**
  be verified as real Oro Line products anywhere. Continental-52 and Platino seem tied to a separate
  "Lampert Black Card" membership program instead. **Recommend you double-check these specific photos** —
  see `_oro-line-additional-vitolas.json`'s `unverified_not_added` list.

## Lines matched to the site, left alone (no gap)

None of Lampert's 8 Mac folders are a *full* match with nothing missing — even the 3 that exist on the
site (1675, Ocean Breeze, Oro Line) had internal gaps as described above.

## Not yet covered — flagged for a follow-up pass

Your "Lampert 1593" folder also has ~19 photos for an **"Edición Oscura"** variant. Research confirmed this
edition genuinely exists (Blind Man's Puff and others cover it), but it wasn't fully detailed in this research
pass — only `lampert-1593.json`'s `research_notes` flags its existence. If you want it fully researched and
written up as its own line/vitola file, let me know and I'll run that as a follow-up.

## Sourcing

Facts came from cigar retailer/review sites (halfwheel, Cigar Coop, Cigar Journal, Blind Man's Puff,
various specialty retailers) and Lampert's own official site (lampertcigars.com). Lampert is a small,
newer brand (founded 2017, U.S. debut 2021), so several lines — especially Lawyer and the newest Baba
Yaga — have thin or no independent critic coverage; where that's the case, fields are `null`/empty rather
than guessed, and it's called out in each file's `research_notes`.
