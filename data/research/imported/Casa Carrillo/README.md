# E.P. Carrillo (Casa Carrillo) — Database Research Batch 4

Researched against the live catalog at https://cigar-site.vercel.app (brand page: `/brands/ep-carrillo/`)
on 2026-09-20. This is the brand your Mac calls "Casa Carrillo"; the actual brand name on the site and
everywhere else is "E.P. Carrillo" (founded 2009 by Ernesto Perez-Carrillo, Dominican Republic).

## Schema used

Same as previous batches: the nested schema Claude Code sent (`line` + `vitolas`, `sources` per fact).
Files omit the `brand` object since E.P. Carrillo already exists in the site's brand catalog.
`research_notes`/`research_sources` are extra QA fields, strip if the loader is strict about unknown keys.

## What's in this folder

**20 new line files.** This is the largest gap of any batch so far — the site currently lists only 24
E.P. Carrillo lines, but the Mac folder has 39 organized line subfolders (1,556 more files still sit in
`_Needs Research`, untouched). `_image_manifest.json` covers 81 photos across all 20 new lines.

## How these were chosen

Diffed the Mac's 39 line folders against the site's 24 listed lines. 15 folders already matched a site
entry cleanly and were left alone (Allegiance, Capa del Sol/Capa de Sol, Cardinal Impact Natural,
Core Plus Maduro, Dusk, Elencos, Encore, INCH Maduro, INCH Natural, INCH Nicaragua, La Historia,
New Wave Conneticut/Connecticut, New Wave Reserva, Pledge, Pledge of Allegiance, Seleccion Oscuro,
Short Run Retro 2021). The remaining 24 folders needed individual research; of those, 20 turned out to
be genuine gaps (written as line files) and 4 turned out to be the same product as something the site
already has under a different name — see below.

## 4 folders that are NOT new lines (same product, different name)

- **Core Plus Natural** → confirmed to be the current name for the site's "Core Line Natural" (halfwheel:
  "The Core line has now been changed to the Core Plus line"). No new file written.
- **Core Plus Maduro Caja** → "Caja" just means "box" in Spanish; this is standard packaging photography
  for the existing "Core Plus Maduro" line, not a separate product. No new file written.
- **Honduras** → confirmed to be trade-press shorthand for the site's existing "Essence Honduras" line
  (same product, different name in headlines). No new file written.
- **La Alianza TAA Exclusive 2021** → **1 photo exists in this folder but the product doesn't appear to
  exist under this name.** The real 2021 TAA-exclusive release is branded "E.P. Carrillo TAA 2021" and,
  despite being made at the Tabacalera La Alianza factory, was never marketed as part of the "La Alianza"
  retail line (which is Natural/Rosado only). This looks like a mix-up between the factory name and the
  product-line name. **Recommend you double-check that one photo** — it may belong under a different
  folder, or the product name should be corrected to "E.P. Carrillo TAA 2021" if you want it researched
  properly as its own entry.

## Notable judgment calls in the 20 new lines

- **Maverick and Rebellious** are technically two wrapper-based vitola families within ONE line called
  "E.P. Carrillo Original Rebel" (Maverick = natural wrapper, Rebellious = maduro/broadleaf), not two
  fully independent blends. I wrote them as two separate files (`original-rebel-maverick.json`,
  `original-rebel-rebellious.json`) since your Mac folders separate them, but flagging this for your
  judgment — you may prefer to merge them into one "Original Rebel" line record with two vitola groups
  when this goes into the database.
- Your "Revellious" folder name is a typo — the correct product name is **"Rebellious."** Written under
  the corrected name/slug; consider renaming the Mac folder to match.
- **Interlude Maduro and Interlude Natural** are confirmed to be two genuinely separate blends (not
  wrapper variants of one recipe) that happen to share a line name and vitola sizes.
- **Grand Prize** (your folder: "La Alianza Grand Prize") is actually a separate product called simply
  "Grand Prize by E.P. Carrillo" — made at the same Tabacalera La Alianza factory as the real La Alianza
  line, but not branded or blended as part of it. Written under its correct name.
- **La Historia TAA 656** (your folder: "La Historia TAA Exclusive") uses the same blend as the regular
  La Historia line already on the site, just in an exclusive vitola/packaging — kept as its own entry
  since it's a distinct SKU, but flagged as blend-identical to plain La Historia in case you'd rather fold
  it in as an extra vitola instead of a separate line.
- **Short Run Nicaragua** → the real product name is "Short Run 2016 Edición Nicaragua," a 2016-vintage
  variant, not an evergreen "Short Run Nicaragua" sub-line independent of the dated annual series.
- **Encore TAA Exclusive** → most precisely the 2020 "Encore TAA 656" release. E.P. Carrillo has released
  a different, non-Encore-branded TAA exclusive in other years (e.g. 2022) — don't conflate those.

## Sourcing

Facts came from halfwheel, Cigar Coop, Cigar Aficionado, Cigar Journal, Blind Man's Puff, and E.P.
Carrillo's own official sites (casacarrillocigars.com, epcarrillo.com). Several 2016-era "Factory Series"
and Dimension Series lines (La Alianza, Grand Prize, Interlude, Maverick/Rebellious) have thin critic
review coverage relative to blend/vitola facts — where a review couldn't be found or a page returned an
access error (406/402/404), the field is left `null`/empty rather than guessed, and it's noted per-file.
