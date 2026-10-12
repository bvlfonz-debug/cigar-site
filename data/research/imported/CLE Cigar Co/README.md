# CLE Cigar Co — Database Research Batch 15

Researched against the live catalog at https://cigar-site.vercel.app/brands/cle-cigar-company/ on 2026-09-30.
(Note: the correct slug is `/brands/cle-cigar-company/`, not `/brands/cle-cigar-co/`, which 404s.)

## Two brands hiding in one Mac folder

The Mac's single "CLE Cigar Co" folder actually covers two separate brand identities: **CLE Cigar Company**
itself (Christian Eiroa's namesake line - Connecticut, Corojo, Maduro subfolders), and **Asylum** (six
subfolders), which CLE manufactures but which is sold under its own standalone name. The site has a "CLE Cigar
Company" brand entry but nothing for "Asylum" at all - not even a brand listing - so this batch includes a
full new brand object for Asylum.

## Folder cleanup first

All 10 line subfolders used cryptic internal shorthand filenames (`Ct-18`, `Asy-550`, `Mad-660`, etc.) - I
ran two research passes to decode every code and renamed all files in place to their real vitola names. I
also pulled one clearly misfiled photo (`Asy-Insan-Lat`) out of the "Asylum Insidious" folder into a new
"_Unclear" folder: no source confirms an Insidious vitola matching that name, and it more likely belongs to
the separate "Serenity Now, Insanity Later" release. I couldn't delete the now-empty Insidious folder (no
delete permission in this session) so it's left in place as an empty placeholder.

## The site's existing CLE Cigar Company entry is very sparse

It lists only two products: "CLE Corojo 2012" (11/18, 6x54) and "CLE Prieto" (52x6). Three more real, current
CLE lines turned up in the Mac photos that aren't on the site at all.

## 3 new lines under CLE Cigar Company (brand already exists on site - omitted from these files)

- `cle-connecticut.json` — 5 vitolas (11/18, 40x4, 60x6, Robusto, Toro), all verified against clecigars.com
  and major retailers.
- `cle-maduro.json` — a newly launched (2025 PCA) line, 4 vitolas (11/18, 40x4, Robusto, 60x6) - the 60x6 size
  I'd only tentatively pattern-matched before research confirmed it directly off CLE's own shop page.
- `cle-corojo.json` — **flag worth your attention.** This is a plain "CLE Corojo" line distinct from the
  site's existing "Corojo 2012" entry (which only lists 11/18). Research strongly suggests the 2012 release is
  the historical ancestor of today's 5-vitola "CLE Corojo" line, but no source explicitly confirms a formal
  rename/consolidation - I've flagged this relationship as plausible-but-unconfirmed rather than asserting it.
  Only the one Mac-photographed vitola (60x6) is included as a formal entry; four more sizes exist per CLE's
  own shop page but weren't photographed, so they're noted but not formally added.

## 6 new lines under a new brand: Asylum (not on the site at all)

- `asylum-eleven.json` — **flag worth your attention.** The Mac folder/filenames claim a "70" (as in 7x70),
  but no source documents an Asylum Eleven vitola at that size - confirmed sizes are a 6x48/54/48 perfecto
  shape. Recorded the size as unconfirmed rather than guessing; recommend a visual check against the box.
- `asylum-13.json` — the flagship line. 3 Mac-photographed vitolas: a 2017 TAA-exclusive Box-Pressed 70x7,
  and two round sizes the Mac's shorthand called "550"/"660" - no source uses those exact numeric strings as
  official names, so I recorded them by their actual retailer vitola-shape names ("Fifty," "Sixty") instead.
- `asylum-13-cool-brew.json` — coffee-infused variant, Toro + Robusto.
- `asylum-13-the-ogre.json` — barber-pole-wrapped 7x70 gigante.
- `asylum-serenity-now-insanity-later.json` — a 2024 release packaging two distinct blends (mild Connecticut
  "Serenity Now" / bold San Andres "Insanity Later") in one 100-count box. Binder/filler details are only
  partially disclosed by the manufacturer for both blends - left as null/unknown rather than guessed.
- `asylum-13-split-personality.json` — despite the name, halfwheel confirms this 2025 release is actually one
  blend (a banana-split-flavored Honduran puro), not two. Robusto + Toro photographed.
- **Not added:** Asylum Insidious is a real, current line (Connecticut Shade and Maduro variants) but has zero
  Mac photos after the misfiled one was removed, so no JSON was created for it - flagged in the manifest only.

## Sourcing

Facts came from CLE's own site (clecigars.com), halfwheel, Cigar Aficionado, Cigar Coop, and numerous
retailers (Famous Smoke, JR Cigars, Neptune Cigar, Cigars International, Mike's Cigars, GQ Tobaccos,
Smokeinn, Hiland's, Corona Cigar, Cigar Spartan). This was a research-heavy batch given how much of both
brands' current lineups were completely absent from the site.
