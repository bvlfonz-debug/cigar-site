// Editorial content for /pairings/[slug]/ topic pages. Kept in its own
// module (not inline in the .astro file) because Astro's getStaticPaths()
// runs in an isolated scope that can't reliably see a sibling top-level
// const declared later in the same file — importing avoids that entirely.

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GuidanceSection {
  heading: string;
  body: string;
}

export interface PairingTopic {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  guidance: GuidanceSection[];
  exampleStrengths: string[];
  exampleWrapperKeywords: string[];
  faqs: FaqItem[];
  ownerNotes: string[];
}

export const PAIRING_TOPICS: PairingTopic[] = [
  {
    slug: 'cigars-and-whiskey',
    title: 'Cigars and Whiskey',
    metaDescription:
      'General guidance for matching cigar strength and wrapper to bourbon, rye, and scotch — a profile-based tendency, not a claim about any one specific cigar.',
    intro:
      "Whiskey and cigars are commonly paired by matching intensity to intensity: a delicate cigar next to a cask-strength pour tends to disappear, and a bold cigar next to a light blend tends to overwhelm it. The guidance below is a general tendency based on a cigar's strength and wrapper, not a first-hand claim about any specific cigar — see each cigar's own page for its profile-based suggestions plus any real cited or community pairings we've collected.",
    guidance: [
      {
        heading: 'Mild to medium cigars',
        body: "Milder, Connecticut-shade-leaning cigars are commonly paired with a blended scotch or a lighter bourbon — something that won't overpower the cigar's subtler notes.",
      },
      {
        heading: 'Medium-full to full cigars',
        body: 'Fuller-bodied cigars, often with a maduro, habano, or corojo-family wrapper, are commonly paired with a cask-strength bourbon, a rye, or a peated single malt — spirits with enough character to stand up to the cigar rather than get lost behind it.',
      },
      {
        heading: 'Peated scotch specifically',
        body: 'Heavily peated Islay scotches are commonly paired with the fullest-bodied, darkest-wrappered cigars — both are intense enough that a milder counterpart would be overwhelmed by either one.',
      },
    ],
    exampleStrengths: ['medium', 'medium-full', 'full'],
    exampleWrapperKeywords: ['habano', 'corojo', 'criollo', 'sumatra', 'rosado', 'cameroon'],
    faqs: [],
    ownerNotes: [
      "Add a real, cited claim here about WHY whiskey and cigars interact the way they do (e.g. a sourced explanation of how alcohol affects palate perception of tannins/oils) if you want one — do not let me invent a food-science claim.",
      "If you have a favorite real critic or publication's whiskey-pairing recommendation for a specific cigar in our catalog, that belongs as a \"Recommended by critics\" entry on that cigar's own page (via add-pairing-citation), not as an invented claim here.",
    ],
  },
  {
    slug: 'cigars-and-rum',
    title: 'Cigars and Rum',
    metaDescription:
      'General guidance for matching cigar wrapper and strength to aged, spiced, and dark rum — a profile-based tendency, not a claim about any one specific cigar.',
    intro:
      "Rum is commonly reached for alongside dark-wrappered cigars — maduro, broadleaf, oscuro, and San Andrés wrappers all trend sweeter and richer, and rum's own sugar and barrel notes are a natural tonal match. As with every guide here, this is general profile-based guidance, not a claim about one specific cigar.",
    guidance: [
      {
        heading: 'Maduro and broadleaf wrappers',
        body: "Dark, sweeter wrappers like maduro and Connecticut Broadleaf are commonly paired with an aged rum, whose own caramel and dried-fruit notes tend to echo the wrapper.",
      },
      {
        heading: 'Oscuro and San Andrés wrappers',
        body: 'Among the darkest, earthiest wrappers, oscuro and Mexican San Andrés are commonly paired with a dark or spiced rum, or occasionally a cognac.',
      },
      {
        heading: 'Peppery or spiced notes',
        body: 'Cigars with peppery or spiced tasting notes are commonly paired with a spiced rum specifically, rather than an unspiced aged rum.',
      },
    ],
    exampleStrengths: [],
    exampleWrapperKeywords: ['maduro', 'broadleaf', 'oscuro', 'san andres'],
    faqs: [],
    ownerNotes: [
      'A real, sourced comparison of specific rum styles (e.g. Jamaican pot-still vs. Bajan blended) against cigar wrapper types would go well here if you want to write or source one — left out rather than invented.',
    ],
  },
  {
    slug: 'cigars-and-coffee',
    title: 'Cigars and Coffee',
    metaDescription:
      'General guidance for matching cigar strength to coffee roast level — a profile-based tendency, not a claim about any one specific cigar.',
    intro:
      "Coffee is one of the most common cigar pairings, mostly because roast intensity maps cleanly onto cigar strength — a delicate morning cigar next to a triple-shot espresso is as mismatched as the reverse. This is general profile-based guidance, not a claim about one specific cigar.",
    guidance: [
      {
        heading: 'Mild cigars',
        body: "Mild-bodied cigars are commonly paired with a light roast or breakfast-blend coffee, so the coffee doesn't overpower the cigar's subtler notes.",
      },
      {
        heading: 'Medium to full cigars',
        body: 'Medium-to-full cigars, especially ones with coffee or espresso in their own tasting notes, are commonly paired with a dark roast or a straight espresso.',
      },
      {
        heading: 'Chocolate or cocoa notes',
        body: 'Cigars with chocolate or cocoa tasting notes are commonly paired with a coffee liqueur or a coffee-forward dessert-style drink rather than plain black coffee.',
      },
    ],
    exampleStrengths: ['mild'],
    exampleWrapperKeywords: [],
    faqs: [],
    ownerNotes: [
      'If you want to cite a specific real study or expert explanation of why coffee and tobacco flavor compounds interact the way they do, add it here — left blank rather than invented.',
    ],
  },
  {
    slug: 'cigars-and-cocktails',
    title: 'Cigars and Cocktails',
    metaDescription:
      'General guidance for matching lighter cigars to cocktails, gin, and pilsners — a profile-based tendency, not a claim about any one specific cigar.',
    intro:
      "Cocktails and lighter beer styles are commonly reached for alongside milder, lighter-wrappered cigars — a Connecticut Shade or claro wrapper is easily overwhelmed by something as intense as a cask-strength spirit. This is general profile-based guidance, not a claim about one specific cigar.",
    guidance: [
      {
        heading: 'Connecticut Shade and claro wrappers',
        body: 'Light, mild wrappers are commonly paired with a lighter cocktail (gin and tonic, a classic daiquiri) or a pilsner, rather than something bold enough to overpower them.',
      },
      {
        heading: 'Bright citrus or fruit notes',
        body: 'Cigars with citrus or fruit-forward tasting notes are commonly paired with a lighter rum or gin cocktail that shares that brighter profile.',
      },
    ],
    exampleStrengths: ['mild', 'mild-medium'],
    exampleWrapperKeywords: ['connecticut shade', 'claro', 'connecticut'],
    faqs: [],
    ownerNotes: [],
  },
];
