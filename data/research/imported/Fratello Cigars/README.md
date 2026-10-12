# Fratello Cigars — Database Research Batch 7

Researched against the live catalog at https://cigar-site.vercel.app/brands/fratello-cigars/ on 2026-09-20.

## Small folder, disproportionately large findings

Fratello's Mac folder only has 5 clean per-line subfolders (Bianco, Camo, Classico, Navetta, Oro) and the
site already lists all 5 line names — but each site entry is extremely thin (1-2 vitolas each), and
digging into the actual photo files turned up real gaps and one likely site data error. All 5 outputs are
supplement files (no new lines needed, all 5 line names already exist on the site):

## The "Fuoco" discovery — one shared vitola, not a missing 4th line

Photos labeled "Fratello_Fuoco_*" were sitting inside three different folders (Bianco, Classico, Oro),
which initially looked like an entirely separate line whose photos got scattered. Research clarified:
**"Fuoco" isn't a line at all — it's a shared 3.5x50 short-robusto format Fratello released simultaneously
across Bianco, Classico, and Oro**, each using that line's own existing blend. So its photos being split
across those 3 folders is actually correct, not a filing error — I added "Bianco Fuoco" / "Classico Fuoco"
/ "Oro Fuoco" as one additional vitola to each of those 3 lines' supplement files rather than writing a
4th line.

- `_bianco-additional-vitolas.json` — adds Bianco Fuoco, plus **Bianco Nero Riserva** (6x58 box-pressed
  Perfecto, maduro wrapper) — a genuine limited reimagining of Bianco that shipped December 2024, 500
  boxes only.
- `_classico-additional-vitolas.json` — adds Classico Fuoco.
- `_oro-additional-vitolas.json` — adds Oro Fuoco (the best-documented of the three, with full
  wrapper/binder/filler specs).

## Camo — the site's listing appears to be simply wrong

The site lists Camo's only vitola as "Camo Cameroon Robusto" (5x50). **No source anywhere — halfwheel,
Cigar Coop, retailers, or Fratello's own site — mentions a Cameroon-wrapper Camo product.** Camo is
actually a budget/bundle line sold in color-named variants: Camo Blue (maduro), Camo Rosso (habano), Camo
Verde (Connecticut), and Camo Sweet (flavor-infused), each in Robusto/Toro. `_camo-corrected-line.json`
flags the site's current entry as likely incorrect and documents the real variant structure instead of
just adding "on top of" what's there — recommend reviewing this one specifically before merging, since
it's a correction rather than a pure addition. Binder/filler are genuinely undisclosed by Fratello for
every Camo variant (not a research gap on my end — halfwheel notes this repeatedly).

## Navetta — a likely site data error plus 3 real missing editions

The site lists Navetta's two vitolas as "Discovery" and "Inception." **I could not find any evidence
"Inception" is a real Fratello product anywhere.** Meanwhile the Mac folder has photos for 3 more real,
verified editions the site is missing entirely: Atlantis, Endeavour, and Enterprise. All 4 real editions
(Discovery + these 3) share one blend and launched together in 2017, each named after a real NASA Space
Shuttle — the line's creator, Omar de Frias, is a former NASA engineer. `_navetta-additional-vitolas.json`
adds the 3 missing editions and flags "Inception" for you to double-check (possibly confused with an
unrelated "Navetta Inverso" line). Note: Enterprise was discontinued per a 2024 halfwheel article — I
included it anyway for completeness but flagged its current-production status.

## Sourcing

Facts came primarily from halfwheel and Cigar Coop, which cover Fratello extensively, plus Fratello's own
site (fratellocigar.com), Cigar Aficionado, and several retailers. Camo's blend details are undisclosed by
the maker across every source, not a gap in my research.
