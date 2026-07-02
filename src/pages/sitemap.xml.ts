import type { APIRoute } from 'astro';
import { getAllCigarSlugs, getAllBrandSlugs } from '../lib/db';

export const GET: APIRoute = ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? '';

  const staticPaths = ['/', '/search/', '/brands/'];
  const brandPaths = getAllBrandSlugs().map((slug) => `/brands/${slug}/`);
  const cigarPaths = getAllCigarSlugs().map(
    ({ brand, line, vitola }) => `/cigars/${brand}/${line}/${vitola}/`
  );

  const urls = [...staticPaths, ...brandPaths, ...cigarPaths];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${base}${path}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
