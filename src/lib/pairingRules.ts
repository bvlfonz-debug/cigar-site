// Type-A "profile-based heuristic" pairing rules — see CLAUDE.md "Cigar
// Pairings". This is a plain, human-editable list, not a black box: every
// suggestion traces back to one row here. Add/remove/reword rows freely;
// nothing else in the codebase needs to change.
//
// IMPORTANT — every `guidance` string must read as a general tendency about a
// CATEGORY of cigar, never as a claim about one specific cigar. "Full-bodied
// maduros are commonly paired with aged rum," not "This cigar pairs with rum."
//
// Wrapper/tasting-note matching is substring-based against a normalized
// (lowercased, diacritic-stripped, parenthetical-stripped) version of the
// real text, checked in array order — put more specific phrases (e.g.
// "connecticut broadleaf") before their shorter fallback ("broadleaf") since
// live data contains both. Real `line.wrapper` values are wildly varied free
// text (confirmed by sampling 38 distinct values in the live database) —
// this list intentionally does NOT try to force every wrapper into a bucket.
// Uncommon/ambiguous wrappers (e.g. plain "Brazilian (Arapiraca region)")
// simply produce no wrapper-based suggestion rather than a guessed one;
// strength- and tasting-note-based rules still contribute independently.

export type PairingCategory = 'whiskey' | 'rum' | 'coffee' | 'beer' | 'wine' | 'cocktail';

export interface PairingRule {
  id: string;
  attribute: 'strength' | 'wrapper' | 'tasting_note';
  match: string;
  category: PairingCategory;
  guidance: string;
}

export const PAIRING_RULES: PairingRule[] = [
  // --- Strength (line.strength is a NOT NULL 5-value enum — always fires) ---
  {
    id: 'strength-mild',
    attribute: 'strength',
    match: 'mild',
    category: 'coffee',
    guidance: 'Mild-bodied cigars are commonly paired with a light roast or breakfast-blend coffee, so the coffee doesn’t overpower the cigar’s subtler notes.',
  },
  {
    id: 'strength-mild-medium',
    attribute: 'strength',
    match: 'mild-medium',
    category: 'beer',
    guidance: 'Mild-to-medium cigars are commonly paired with a session beer or pale ale — enough character to hold up without competing.',
  },
  {
    id: 'strength-medium',
    attribute: 'strength',
    match: 'medium',
    category: 'whiskey',
    guidance: 'Medium-bodied cigars are commonly paired with a blended scotch or a straightforward bourbon.',
  },
  {
    id: 'strength-medium-full',
    attribute: 'strength',
    match: 'medium-full',
    category: 'whiskey',
    guidance: 'Medium-to-full cigars are commonly paired with bourbon or a lightly peated single malt.',
  },
  {
    id: 'strength-full',
    attribute: 'strength',
    match: 'full',
    category: 'whiskey',
    guidance: 'Full-bodied cigars are commonly paired with cask-strength bourbon or a heavily peated Islay scotch — strong enough to stand up to the cigar rather than get lost behind it.',
  },

  // --- Wrapper (line.wrapper is NOT NULL free text; order = most specific first) ---
  {
    id: 'wrapper-connecticut-broadleaf',
    attribute: 'wrapper',
    match: 'connecticut broadleaf',
    category: 'rum',
    guidance: 'Connecticut Broadleaf wrappers, dark and full-flavored, are commonly paired with an aged or spiced rum.',
  },
  {
    id: 'wrapper-connecticut-shade',
    attribute: 'wrapper',
    match: 'connecticut shade',
    category: 'cocktail',
    guidance: 'Connecticut Shade wrappers, light and mild, are commonly paired with a lighter cocktail (gin, a pilsner) rather than something that would overpower them.',
  },
  {
    id: 'wrapper-san-andres',
    attribute: 'wrapper',
    match: 'san andres',
    category: 'rum',
    guidance: 'Mexican San Andrés wrappers, dark and earthy, are commonly paired with an aged rum or dark spiced rum.',
  },
  {
    id: 'wrapper-broadleaf',
    attribute: 'wrapper',
    match: 'broadleaf',
    category: 'rum',
    guidance: 'Broadleaf wrappers, dark and full-flavored, are commonly paired with an aged or spiced rum.',
  },
  {
    id: 'wrapper-oscuro',
    attribute: 'wrapper',
    match: 'oscuro',
    category: 'rum',
    guidance: 'Oscuro wrappers, among the darkest and richest, are commonly paired with a dark rum or cognac.',
  },
  {
    id: 'wrapper-maduro',
    attribute: 'wrapper',
    match: 'maduro',
    category: 'rum',
    guidance: 'Maduro wrappers, dark and sweeter, are commonly paired with an aged or spiced rum.',
  },
  {
    id: 'wrapper-rosado',
    attribute: 'wrapper',
    match: 'rosado',
    category: 'whiskey',
    guidance: 'Rosado wrappers, reddish and medium-to-full in character, are commonly paired with a bourbon.',
  },
  {
    id: 'wrapper-habano',
    attribute: 'wrapper',
    match: 'habano',
    category: 'whiskey',
    guidance: 'Habano-seed wrappers, medium-bodied and often spicy, are commonly paired with a rye whiskey.',
  },
  {
    id: 'wrapper-corojo',
    attribute: 'wrapper',
    match: 'corojo',
    category: 'whiskey',
    guidance: 'Corojo wrappers, medium-bodied and peppery, are commonly paired with a rye whiskey.',
  },
  {
    id: 'wrapper-criollo',
    attribute: 'wrapper',
    match: 'criollo',
    category: 'whiskey',
    guidance: 'Criollo wrappers, medium-bodied, are commonly paired with a bourbon or rye.',
  },
  {
    id: 'wrapper-sumatra',
    attribute: 'wrapper',
    match: 'sumatra',
    category: 'whiskey',
    guidance: 'Sumatra-seed wrappers, medium-bodied, are commonly paired with a bourbon.',
  },
  {
    id: 'wrapper-cameroon',
    attribute: 'wrapper',
    match: 'cameroon',
    category: 'whiskey',
    guidance: 'Cameroon wrappers, medium-bodied with a peppery edge, are commonly paired with a rye whiskey.',
  },
  {
    id: 'wrapper-claro',
    attribute: 'wrapper',
    match: 'claro',
    category: 'cocktail',
    guidance: 'Claro wrappers, light and mild, are commonly paired with a lighter cocktail rather than something that would overpower them.',
  },
  {
    id: 'wrapper-connecticut-fallback',
    attribute: 'wrapper',
    match: 'connecticut',
    category: 'cocktail',
    guidance: 'Connecticut-family wrappers, generally on the lighter side, are commonly paired with a lighter cocktail or pilsner.',
  },

  // --- Tasting notes (vitola.tasting_notes can be [] — these only fire when notes exist) ---
  {
    id: 'note-chocolate',
    attribute: 'tasting_note',
    match: 'chocolate',
    category: 'wine',
    guidance: 'Cigars with chocolate or cocoa notes are commonly paired with a port wine or a dark stout.',
  },
  {
    id: 'note-cocoa',
    attribute: 'tasting_note',
    match: 'cocoa',
    category: 'wine',
    guidance: 'Cigars with chocolate or cocoa notes are commonly paired with a port wine or a dark stout.',
  },
  {
    id: 'note-coffee',
    attribute: 'tasting_note',
    match: 'coffee',
    category: 'coffee',
    guidance: 'Cigars with coffee or espresso notes are commonly paired with an espresso or coffee liqueur.',
  },
  {
    id: 'note-espresso',
    attribute: 'tasting_note',
    match: 'espresso',
    category: 'coffee',
    guidance: 'Cigars with coffee or espresso notes are commonly paired with an espresso or coffee liqueur.',
  },
  {
    id: 'note-pepper',
    attribute: 'tasting_note',
    match: 'pepper',
    category: 'rum',
    guidance: 'Cigars with peppery or spiced notes are commonly paired with a spiced rum or rye whiskey.',
  },
  {
    id: 'note-spice',
    attribute: 'tasting_note',
    match: 'spice',
    category: 'rum',
    guidance: 'Cigars with peppery or spiced notes are commonly paired with a spiced rum or rye whiskey.',
  },
  {
    id: 'note-citrus',
    attribute: 'tasting_note',
    match: 'citrus',
    category: 'cocktail',
    guidance: 'Cigars with bright citrus or fruit notes are commonly paired with a lighter rum or gin cocktail.',
  },
  {
    id: 'note-fruit',
    attribute: 'tasting_note',
    match: 'fruit',
    category: 'cocktail',
    guidance: 'Cigars with bright citrus or fruit notes are commonly paired with a lighter rum or gin cocktail.',
  },
  {
    id: 'note-caramel',
    attribute: 'tasting_note',
    match: 'caramel',
    category: 'whiskey',
    guidance: 'Cigars with caramel, vanilla, or honey notes are commonly paired with a bourbon, whose own barrel sweetness tends to echo them.',
  },
  {
    id: 'note-vanilla',
    attribute: 'tasting_note',
    match: 'vanilla',
    category: 'whiskey',
    guidance: 'Cigars with caramel, vanilla, or honey notes are commonly paired with a bourbon, whose own barrel sweetness tends to echo them.',
  },
  {
    id: 'note-cedar',
    attribute: 'tasting_note',
    match: 'cedar',
    category: 'whiskey',
    guidance: 'Cigars with cedar or woody notes are commonly paired with a single malt scotch or bourbon.',
  },
  {
    id: 'note-leather',
    attribute: 'tasting_note',
    match: 'leather',
    category: 'rum',
    guidance: 'Cigars with leather or earthy notes are commonly paired with an aged rum or dark bourbon.',
  },
  {
    id: 'note-earth',
    attribute: 'tasting_note',
    match: 'earth',
    category: 'rum',
    guidance: 'Cigars with leather or earthy notes are commonly paired with an aged rum or dark bourbon.',
  },
];

export interface PairingSuggestion {
  category: PairingCategory;
  guidance: string;
  matchedOn: string[];
}

interface StrengthLike {
  strength: string;
}

interface WrapperLike {
  wrapper: string;
}

interface TastingNotesLike {
  tasting_notes: string;
}

// Lowercases, strips diacritics (NFD-normalize then drop combining marks),
// and strips parenthetical asides — so "Mexican San Andrés" and
// "Connecticut Broadleaf (Grade A Dark)" both match cleanly against the
// plain-ASCII keywords above.
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\([^)]*\)/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Computes Type-A profile-based pairing suggestions for a cigar from its own
 * attributes. Never guesses: strength/wrapper rules always evaluate (both
 * fields are NOT NULL on every line), tasting-note rules only fire when
 * tasting_notes is non-empty, so a thin-data cigar simply gets fewer
 * suggestions rather than a fabricated one.
 */
export function getPairingSuggestions(line: StrengthLike & WrapperLike, vitola: TastingNotesLike): PairingSuggestion[] {
  const suggestions: PairingSuggestion[] = [];
  const seenCategories = new Set<string>();

  function addSuggestion(rule: PairingRule, matchedOn: string) {
    const key = `${rule.category}:${rule.guidance}`;
    const existing = suggestions.find((s) => `${s.category}:${s.guidance}` === key);
    if (existing) {
      if (!existing.matchedOn.includes(matchedOn)) existing.matchedOn.push(matchedOn);
      return;
    }
    suggestions.push({ category: rule.category, guidance: rule.guidance, matchedOn: [matchedOn] });
    seenCategories.add(rule.category);
  }

  const strengthRule = PAIRING_RULES.find((r) => r.attribute === 'strength' && r.match === line.strength);
  if (strengthRule) addSuggestion(strengthRule, `${line.strength} body`);

  const normalizedWrapper = normalize(line.wrapper);
  const wrapperRule = PAIRING_RULES.find((r) => r.attribute === 'wrapper' && normalizedWrapper.includes(r.match));
  if (wrapperRule) addSuggestion(wrapperRule, `${line.wrapper} wrapper`);

  let tastingNotes: string[] = [];
  try {
    tastingNotes = JSON.parse(vitola.tasting_notes);
  } catch {
    tastingNotes = [];
  }
  for (const note of tastingNotes) {
    const normalizedNote = normalize(note);
    const noteRule = PAIRING_RULES.find((r) => r.attribute === 'tasting_note' && normalizedNote.includes(r.match));
    if (noteRule) addSuggestion(noteRule, `notes of ${note}`);
  }

  return suggestions;
}

/**
 * Returns the normalized wrapper-family keyword (if any) a given wrapper
 * string matches, for use by getCigarsByProfile()'s "example cigars" filter
 * — keeps the guide pages and the rule engine agreeing on what counts as
 * e.g. "a maduro-style wrapper."
 */
export function wrapperMatchesKeywords(wrapper: string, keywords: string[]): boolean {
  const normalizedWrapper = normalize(wrapper);
  return keywords.some((k) => normalizedWrapper.includes(normalize(k)));
}
