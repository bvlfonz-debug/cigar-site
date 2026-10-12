# Rocky Patel — Database Research Batch 1

Researched against the live catalog at https://cigar-site.vercel.app (brand page:
`/brands/rocky-patel/`) on 2026-09-17. Rocky Patel was chosen first because it has the most
fully-organized, verified product photos of any brand on this Mac (1,033 renamed files across
22 confirmed lines, zero unsorted backlog).

## Schema used

These files follow the **nested schema Claude Code sent** (brand / line / vitolas, with
`sources` per fact), not the flatter `batch_info` example — it's the one Claude Code will
actually consume, and it carries per-fact provenance (URLs) which the flat schema doesn't.
Each line file omits the `brand` object entirely, per Claude Code's own instructions, since
"Rocky Patel Premium Cigars" already exists in the site's brand catalog.

## What's in this folder

- One JSON file per missing line: `bold.json`, `dark-star.json`, `emerald.json`,
  `gold-label.json`, `sapphire.json`, `30th-anniversary.json`, `quarter-century.json`,
  `twentieth-anniversary.json`, `vintage-1999.json`, `year-of-the-dragon.json`,
  `year-of-the-snake.json`.
- Each file has `line` (matches Claude Code's schema exactly) and `vitolas` (array, matches
  schema exactly — `critic_reviews` populated wherever a real published review score was
  found, otherwise an empty array; nothing fabricated).
- Two extra fields per file, **outside** the strict schema, for your own QA — strip these
  before upload if Claude Code's loader is strict about unknown keys: `research_sources`
  (every URL actually used, with a note on what fact it supports) and `research_notes` (any
  caveat worth knowing, e.g. an unverifiable release year, a paywalled review, a similarly-named
  product that's actually different).
- `_image_manifest.json` — the schema you were sent has no photo field, so this is a companion
  file mapping each line slug to its available photos, as relative paths under
  `Cigar Images/Rocky Patel/` on your Mac (e.g. `Cigar Images/Rocky Patel/Rocky Patel Bold/
  Rocky-Patel_Bold_01.jpg`). 70 photos total across the 11 lines. Whoever writes the photo-upload
  step can point straight at this.

## How these 11 were chosen

I pulled every Rocky Patel line folder you have organized on the Mac (22 total) and diffed it
against what `/brands/rocky-patel/` currently lists (19 lines). 11 of your folders don't match
anything on the site. The other 11 of your folders (Decade, ALR → A.L.R. Second Edition,
Disciple, Fifteenth Anniversary, Fifty-Five, Number 6, Royale, Sixty, Tavicusa, Vintage 1990)
already match an existing site entry, so I left those alone — no need to re-research what's
already there.

## Flagged, not included: "Rocky Patel Edge"

Your Mac has one generic **`Rocky Patel Edge`** folder (9 photos), but the site lists **two**
separate lines — "The Edge Corojo" and "The Edge Maduro" — as already in the catalog. I didn't
touch this one: the photos aren't wrapper-labeled, so I can't tell which Edge variant (or both)
they show without opening and visually inspecting each one, and it might turn out everything in
there is already covered by the two existing site entries. Flagging it rather than guessing —
let me know if you want me to sort those photos by wrapper next.

## Lines your Mac has zero photos for

The site's Rocky Patel catalog also includes Conviction, Grand Reserve, Olde World Reserve
Maduro, Sun Grown, Sun Grown Maduro, and White Label — all already on the site, so nothing to
research there regardless.

## Sources

Every fact came from cigar retailer/review sites (Halfwheel, Cigar Coop, Cigar Aficionado,
Cigars International, JR Cigars, Famous Smoke, Rocky Patel's own site, and similar) — see each
line's `research_sources` array for the exact URL behind every field. Nothing was invented;
anything unverifiable is `null` with a note in `research_notes`.
