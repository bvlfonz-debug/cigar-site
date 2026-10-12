# RoMa Craft Tobac — Database Research Batch 20

Researched against the live catalog at https://cigar-site.vercel.app/brands/roma-craft-tobac/ on 2026-09-30.

## A folder-naming wrinkle, not a full misfiling this time

The "Cromagnon" subfolder's 2 photos are actually **Aquitaine** - a distinct, differently-wrappered
sub-blend (Ecuador Habano Ligero over Cameroon binder vs. CroMagnon's Connecticut Broadleaf), which the site
already lists as its own standalone line ("RoMa Craft Aquitaine"). Unlike the La Aurora/J.C. Newman cases,
this isn't a different manufacturer - just the wrong RoMa Craft sub-line - so I filed the supplement under
the existing Aquitaine line rather than moving folders around.

## 11 files decoded and renamed

All the cryptic shorthand filenames across both subfolders (`Aqu-Knu`, `Ba-Breach`, `Whis-Mcf`, etc.) are
now renamed to their real vitola names.

## 2 gap-fill supplements

- `_aquitaine-additional-vitolas.json` — site lists only "EMH" (5x56). Adds Knuckle Dragger and Pestera
  Muierilor. **Flag**: Aquitaine's "Knuckle Dragger" shares its exact name and size with the site's existing
  plain CroMagnon "Knuckle Dragger" - same vitola name, different wrapper blend. Worth a visual check before
  deciding how to represent that in the database (duplicate name, not duplicate product).
- `_intemperance-ba-xxi-additional-vitolas.json` — site lists only "Breach of the Peace" (matches a Mac
  photo exactly). Adds Envy (confirmed size) and Intrigue (name confirmed via halfwheel, but I couldn't find
  a retailer spec sheet with exact dimensions - flagged rather than guessed).

## 2 new lines

- `intemperance-ec-xviii.json` — a sibling Intemperance sub-blend (Ecuadorian Connecticut wrapper, "XVIII"
  for the 18th Amendment) not on the site at all. 3 vitolas: The Faith (size unverified, flagged), Reverence,
  Virtue.
- `intemperance-whiskey-rebellion-1794.json` — a third Intemperance sub-blend, named for the actual 1794
  Whiskey Rebellion rather than an amendment. 3 vitolas named for historical figures: Hamilton, Jefferson,
  McFarlane.

## Sourcing

halfwheel, Cigar Coop, Atlantic Cigar, Neptune Cigar, JR Cigars, Smokingpipes. Two vitola sizes (BA XXI
Intrigue, EC XVIII The Faith) couldn't be pinned down in this pass despite the names being well-confirmed -
flagged rather than guessed at.
