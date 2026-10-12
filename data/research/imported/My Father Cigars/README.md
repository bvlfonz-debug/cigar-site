# My Father Cigars — Database Research Batch 9

Researched against the live catalog at https://cigar-site.vercel.app/brands/my-father/ on 2026-09-20.

## The big finding: a mislabeled folder hiding a real gap

The Mac has a separate top-level "Flor de Selva" folder (distinct from "My Father Cigars") containing one
subfolder: "Flor de Selva Maduro." Every single file inside it is actually prefixed
`Flor_de_las_Antillas_Maduro_*` — not `Flor_de_Selva_*`. This is a My Father Cigars product (Flor de las
Antillas Maduro), filed under the wrong brand's folder entirely. The good news: Flor de Selva itself is
already fully covered on the site (all 3 of its lines are listed), so it needs **no** new files from this
batch — only Flor de las Antillas Maduro does. `flor-de-las-antillas-maduro.json` treats these photos as
what they actually show. Recommend renaming/moving this folder on your end so the Mac structure matches
reality — details in `_image_manifest.json`.

## 5 new lines

- `don-pepin-garcia-erh.json` — "El Rey de los Habanos," a 2025 reformulated revival of a 2014-era Don
  Pepin Garcia release. 3 vitolas (Robusto, Toro, Toro Gordo).
- `flor-de-las-antillas-maduro.json` — see above. 4 vitolas.
- `fonseca-mexico-edition.json` — Mexican San Andrés-wrapped Fonseca expression, debuted 2020. 4 vitolas.
- `la-gran-oferta.json` — **found misfiled inside the "My Father La Opulencia" Mac folder**, but this is a
  genuinely separate 2018 value/everyday line, not part of La Opulencia. 5 vitolas.
- `la-duena.json` — **also found misfiled inside "My Father La Opulencia."** A ~2011 line blended by Jaime
  Garcia with Pete Johnson (Tatuaje), named as a tribute to Janny Garcia. Connecticut Broadleaf wrapper, 6
  numbered vitolas.

All 5 nest under the existing "My Father" site brand — no `brand` object needed for any of them.

## 4 gap-fill supplements

- `_vegas-cubanas-additional-vitolas.json` — adds Invictos (5x50) and Toro Gordo (6x60), the current
  post-2023-PCA-rebrand vitola set. **Flag:** the site's existing "Delicias" entry appears to reflect the
  older, pre-rebrand SKU list per a Cigar Coop rebrand article — worth checking whether it should be
  retired or kept as a legacy/discontinued size.
- `_fonseca-by-my-father-additional-vitolas.json` — adds Cosacos (5.375x42, sold in 5-count tins, launched
  August 2020).
- `_jaime-garcia-reserva-especial-additional-vitolas.json` — adds Corona Grande (6.25x48) and Figurado J.G.
  (5.625x48/52).
- `_my-father-connecticut-corrected-line.json` — **not a plain addition, a flag.** The Mac's "My Father
  Connecticut" folder photos are, per research, actually "Jaime Garcia Reserva Especial Connecticut" (a
  line released nationally in August 2024) — the wrapper/binder/filler/vitola specs match that product,
  not the site's existing "My Father Connecticut" entry (Toro, 6.5x54). There's also a third possibility: an
  older, separate "My Father Connecticut" line reviewed since 2014 that *also* doesn't cleanly match the
  site's 6.5x54 spec. I could not confidently determine which of the three the site's current entry is
  meant to represent, so I did not silently merge or overwrite it — this file documents what the photos
  actually show (Jaime Garcia R.E. Connecticut) and flags the discrepancy for your judgment, following the
  same "corrected line" pattern used for Fratello's Camo in an earlier batch.

## 2 unresolved items (not included in JSON, flagged instead of guessed)

- **"Don-Pepin-Nicaragua_\*" filenames** (Corona, Petit-Robusto, Robusto, Toro, Toro Gordo) sitting in the
  Don Pepin Garcia Original folder — research could not confidently match these to E.R.H., Original, or any
  other confirmed product. Excluded from output; documented in `_image_manifest.json` in case you want to
  identify them by checking the photos' box art/bands directly.
- **Don Pepin Garcia Series JJ "Toros" filename** — the site lists only Belicoso, Selectos, and Sublime for
  this line, with no "Toro"/"Toros" vitola. This is a single minor item I did not dispatch a research agent
  for; flagged as unresolved rather than guessed at. Worth a quick look if you want it resolved.

## Sourcing

Facts came primarily from myfathercigars.com (the manufacturer's own site), halfwheel, and Cigar Coop,
supplemented by retailers (Cigars International, JR Cigars, Neptune Cigar, Casa de Montecristo, Corona
Cigar, Holt's, The Cigar Authority) and Cigar Aficionado. The Vegas Cubanas rebrand and the Jaime Garcia
R.E. Connecticut release date both rest on Cigar Coop reporting specifically, since neither is a
halfwheel-reviewed release as of this research.
