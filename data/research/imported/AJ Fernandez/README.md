# AJ Fernandez — Database Research Batch 6

Researched against the live catalog at https://cigar-site.vercel.app/brands/aj-fernandez/ on 2026-09-20.

## This batch was mostly good news — the site is already thorough on AJ Fernandez

Unlike every prior batch, almost all 12 of your Mac's AJ Fernandez line-folders matched an existing site
line exactly, vitola-for-vitola: Dias de Gloria, Bellas Artes (= site's "Bellas Artes Hybrid"), Enclave by
AJ Fernandez (= site's "Enclave Habano"), Enclave Broadleaf, New World, New World Connecticut, New World
Dorado, New World Puro Especial, Ramon Allones, and all three San Lotano Requiem variants + The Bull. No
new files needed for any of those.

The gaps that did exist came from two places: vitolas/wrapper-variants your photos show that the site's
listing is simply missing, and a few sub-lines whose photos were sitting loose inside a parent folder
(e.g. New World Oscuro's photos were mixed into the general "New World" folder) rather than getting their
own subfolder — so they didn't show up in the initial folder-name diff and needed a second pass through
each folder's file listing, same lesson as Lampert.

## 3 gap-fill supplements (existing lines, missing vitolas)

- `_last-call-additional-vitolas.json` — **the biggest find in this batch.** The site lists "Last Call by
  AJ Fernandez" with just one vitola (Geniales, no wrapper noted). Your photos show the line actually
  ships in TWO wrapper variants (Habano and Maduro) across FIVE vitolas (Chiquitas, Corticas, Flaquitas,
  Geniales, Pequeñas) — the site is missing the wrapper split entirely and 4 of 5 vitolas.
- `_bellas-artes-maduro-additional-vitolas.json` — adds a 5th vitola, Lancero (7x40), a 2019 limited
  release (2,000 boxes) the site's 4-vitola list doesn't have.
- `_new-world-cameroon-additional-vitolas.json` — adds a Torpedo (6.5x52), a genuine figurado shape
  confirmed by multiple retailers but missing from the site's 6-vitola Cameroon list.

## 3 new lines (not on the site at all, nest under the existing AJ Fernandez brand)

- `new-world-oscuro.json` — a full New World sub-line (5 vitolas: Robusto, Belicoso, Gordo, Toro Redondo,
  Double Corona) that's absent from the site's New World family entirely. Nicaraguan puro, reportedly the
  first blend AJ Fernandez developed with his father. Note: I treated the Mac's separate "Toro" and
  "Toro-Redondo" photos as duplicates of one vitola (official name is "Toro Redondo") — no evidence of a
  distinct plain "Toro" in this line.
- `enclave-connecticut.json` — a 4th Enclave wrapper variant (alongside Habano/Broadleaf), originally an
  international-markets-only release. Your Mac only has 1 photo for it (a logo/banner) which matches its
  thin documentation — confirmed real via halfwheel/Cigar Aficionado, but I couldn't find a strength
  rating anywhere, so that field is null.
- `san-lotano-dominicano.json` — a genuine, Dominican-made San Lotano sub-line (contrasting with the
  Nicaraguan-made Requiem), made at Tabacalera Palma. Confirmed via halfwheel.

## Sourcing

Facts came from halfwheel, Cigar Aficionado, Cigar Coop, JR Cigars, Neptune Cigar, Atlantic Cigar,
CigarPlace, and official/retailer product pages. This was a comparatively clean batch — most facts had
solid corroboration across halfwheel plus 2-3 retailers. Where a strength rating specifically couldn't be
found (Enclave Connecticut), it's left `null` rather than guessed.
