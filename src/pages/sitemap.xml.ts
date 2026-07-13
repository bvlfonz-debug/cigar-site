import type { APIRoute } from 'astro';
import {
  getAllCigarSlugs,
  getAllBrandSlugs,
  getSearchIndex,
  getAllComparePairSlugs,
  getAllAccessoryCategories,
  getAllAccessorySlugs,
} from '../lib/db';
import { slugify } from '../lib/slugify';

const GUIDE_SLUGS = [
  'best-humidors-for-beginners',
  'best-humidors-under-100',
  'best-humidors-under-200',
  'desktop-vs-cabinet-vs-travel-humidors',
  'best-torch-lighters',
  'best-cigar-cutters',
  'guillotine-vs-v-cut-vs-punch',
  'best-travel-cigar-cases',
  'best-hygrometers',
  'boveda-vs-beads-vs-gel',
  'best-cigar-ashtrays',
  'best-gifts-for-cigar-smokers',
  'how-to-set-up-your-first-humidor',
  'best-budget-cigar-starter-kits',
  'cigar-accessories-every-beginner-needs',
];

export const GET: APIRoute = ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? '';

  const staticPaths = ['/', '/search/', '/brands/', '/news/', '/rankings/', '/deals/', '/accessories/', '/guides/'];
  const brandPaths = getAllBrandSlugs().map((slug) => `/brands/${slug}/`);
  const cigarPaths = getAllCigarSlugs().map(
    ({ brand, line, vitola }) => `/cigars/${brand}/${line}/${vitola}/`
  );

  const index = getSearchIndex();
  const rankingPaths = [
    ...new Set(index.map((c) => `/rankings/wrapper/${slugify(c.wrapper)}/`)),
    ...new Set(index.map((c) => `/rankings/country/${slugify(c.country)}/`)),
    ...new Set(index.map((c) => `/rankings/strength/${slugify(c.strength)}/`)),
  ];

  const comparePaths = getAllComparePairSlugs().map((slug) => `/compare/${slug}/`);

  const accessoryCategoryPaths = getAllAccessoryCategories().map((c) => `/accessories/${c.slug}/`);
  const accessoryPaths = getAllAccessorySlugs().map(
    ({ category, accessory }) => `/accessories/${category}/${accessory}/`
  );
  const guidePaths = GUIDE_SLUGS.map((slug) => `/guides/${slug}/`);

  const urls = [
    ...staticPaths,
    ...brandPaths,
    ...cigarPaths,
    ...rankingPaths,
    ...comparePaths,
    ...accessoryCategoryPaths,
    ...accessoryPaths,
    ...guidePaths,
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${base}${path}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
