# United Cigars — Database Research Batch 5

Researched against the live catalog at https://cigar-site.vercel.app on 2026-09-20.

## This batch is structurally different from every previous one — read this first

Every prior batch (Rocky Patel, Joya de Nicaragua, Lampert, Casa Carrillo) was "one Mac folder = one
brand's product lines." **United Cigars is not that.** It's an umbrella distribution company (New
Hampshire, owned by David Garofalo, who also runs Two Guys Cigars retail) that makes and/or distributes
20+ *separate cigar brands* across Dominican Republic, Honduras, Nicaragua, and Costa Rica factories. Your
Mac folder reflects this: it has 14 sub-brand subfolders (Abuelo, Alfonso, Atabey, Bandolero, Byron,
Firecracker, Garofalo, Gold Star, Hightower, La Gianna, Montosa, Red Anchor, Terra Nova, United, YaYa),
each a flat folder of that sub-brand's own product photos — not vitola-organized subfolders like previous
batches had.

The site's own "United Cigars" brand page (`/brands/united-cigars/`) currently lists **only one line:
Independence**. So almost this entire folder is a gap, but the gaps fall into three different categories
depending on whether each sub-brand already has its own presence on the site:

## 1. Three new LINES nesting under the existing "United Cigars" brand

The site already has a "United Cigars" brand entry (just very incomplete). These 3 files omit the `brand`
object per the established schema convention:

- `abuelo.json` — Abuelo (Honduran puro, 4 vitolas: Gran Abuelo, Padre, Nieto, Nieta)
- `alfonso-extra-anejo.json` + `alfonso-gran-seleccion.json` — Alfonso's two sub-lines (6 vitolas + 5
  vitolas). **Correction to my own working assumption going in:** I initially assumed "Alfonso" was a
  historic 1979 brand tied to Nestor Plasencia/JC Newman — my research agent found no evidence for that
  and instead confirmed (via Cigar Aficionado, Cigar Coop, halfwheel) this is a 2022-launched Selected
  Tobacco S.A. line named after Nelson Alfonso Egüed. Don't trust any pre-2022 Alfonso backstory.
- `united-flagship.json` — the "United" own-name flagship blend (confirmed genuinely different from
  Independence, not a rename of it)

## 2. Gap-fill supplements for TWO sub-brands that are already their OWN separate brands on the site

Atabey and Byron are **not** United Cigars lines in the site's data model — they're independent
standalone brand entries the site already has. Same pattern as Lampert's Ocean Breeze/Oro Line
supplements: these are vitola/edition gaps within existing site brands, not new brand or line records.

- `_atabey-additional-vitolas.json` — 7 missing vitolas (Dioses, Duendes, Hechizos, Idolos, Misticos,
  Benditos, Brujos) plus one entirely missing sub-line, Atabey Black (Black Ritos)
- `_byron-additional-vitolas.json` — the whole "1850" series (6 items), several 19th/20th/21st Century
  vitolas the site is missing, and the limited 175th Anniversary tribute set

## 3. Ten genuinely new brands, not on the site in any form

These don't nest under United Cigars OR any existing site brand — they needed full `brand` objects (name,
description, origin, founding) since the nested schema has nothing to omit them into:

- `bandolero.json` — 4 sub-lines (Serie A/C/T + Premium), 15 vitolas total. Actually made by Selected
  Tobacco (Nelson Alfonso), distributed by United Cigars.
- `firecracker.json` — 2 lines (Connecticut, Independence Firecracker)
- `garofalo-la-famiglia.json` — 1 line, named after David Garofalo's own family, made by Perdomo
- `gold-star.json` — 1 line, revived 2024/2025 (originally 1995), supports the Navy SEAL Gold Star Program
- `hightower.json` — **flagged, low confidence on brand attribution.** Every independent source ties this
  to "Jose Dominguez" (JD Hightower), not United Cigars. It's sold via Two Guys Cigars (same owner), which
  likely explains the "UC-" filename prefix, but I could not confirm United Cigars actually makes or owns
  this brand. Recommend you verify before treating it as a United Cigars product in the database.
- `la-gianna.json` — La Gianna Havana, 4 sub-lines (Natural, Maduro, Angelic, 30th Anniversary), named
  after Garofalo's daughter
- `montosa.json` — 2 lines (Natural, Maduro); actually made by Arnold André, distributed by United Cigars
- `red-anchor.json` — 1 line, nautical-rank-themed vitola names (Admiral, Captain, Gunner, etc.), made at
  Kelner Boutique Factory
- `terra-nova.json` — 2 lines (Araperique, Dark Fired Kentucky); actually made by Arnold André,
  distributed by United Cigars
- `yaya.json` — 1 line, created by Carlos Guillermo, U.S. debut via United Cigars at PCA 2022

## Sub-brands whose true manufacturer isn't United Cigars

Several of these "United Cigars" sub-brands are actually manufactured by a different company and merely
distributed/retailed through United Cigars / Two Guys Cigars: **Bandolero** and **Atabey** (Selected
Tobacco, Nelson Alfonso), **Montosa** and **Terra Nova** (Arnold André), and possibly **Hightower** (Jose
Dominguez, unconfirmed link to United Cigars at all). I kept them in this batch since that's how your Mac
has them organized, but flagged the true manufacturer in each file's `brand.description` — worth deciding
in your database schema whether "distributed by" should be tracked separately from "made by."

## `_image_manifest.json`

Structured differently from previous batches — instead of mapping researched line slugs to individual
photo files, it maps each researched line/brand to its **source sub-brand folder** on the Mac, since those
folders are flat/unsorted (unlike previous batches' clean per-vitola subfolders) and couldn't be reliably
split file-by-file to individual vitolas without risking guessing. 240 photos across the 16 files
(15 line/brand files + Atabey/Byron supplements... see manifest for the exact breakdown).

## Not yet covered

Your Mac's United Cigars folder still has `_Needs Research` with **2,724 files** untouched — by far the
largest backlog of any brand folder. Not addressed in this batch.

## Sourcing

Facts came from halfwheel, Cigar Coop, Cigar Aficionado, Cigar Journal, Cigar Dojo, Blind Man's Puff, The
Cigar Authority, premiumcigars.org, and official sites (unitedcigargroup.com, 2guyscigars.com,
terranova-cigar.com). This was the largest and most complex batch so far — 10 parallel research agents
covering 14 sub-brands. Where blend specifics (especially binder) were undisclosed/proprietary across all
sources — common for Bandolero and Atabey in particular — fields are `null` rather than guessed, and it's
called out in each file's notes.
