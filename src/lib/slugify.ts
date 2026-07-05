// Turns a free-text facet value (wrapper, country) into a clean URL segment.
// Not stored in the DB — derived at build time for /rankings routes.
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
