#!/usr/bin/env node
// Add (or replace) one line's photo: resizes the source image without
// cropping (see scripts/lib/image-pipeline.mjs for the dimension rules),
// saves it under public/, and records image_url/image_width/image_height/
// image_source_name/image_source_url/image_checked_at on the line row.
//
// Usage: node scripts/add-line-image.mjs <sourceImagePath> <lineId> <sourceSiteUrl>
//
// This does NOT decide whether an image is a good match for the line --
// that verification (does the pictured product actually match, no
// third-party watermarks, no wrong sub-edition, etc.) has to happen before
// this is called. See CLAUDE.md's "Cigar imagery" section.
import { openDb, resizeAndSaveCigarImage, writeLineImageRecord } from './lib/image-pipeline.mjs';

const [sourcePath, lineIdArg, siteUrl] = process.argv.slice(2);
if (!sourcePath || !lineIdArg || !siteUrl) {
  console.error('Usage: node scripts/add-line-image.mjs <sourceImagePath> <lineId> <sourceSiteUrl>');
  process.exit(1);
}
const lineId = Number(lineIdArg);

const db = openDb();
const line = db
  .prepare('SELECT l.id, l.name, l.slug AS line_slug, b.slug AS brand_slug FROM line l JOIN brand b ON b.id = l.brand_id WHERE l.id = ?')
  .get(lineId);
if (!line) {
  console.error(`No line found with id ${lineId}`);
  process.exit(1);
}

const { publicPath, width, height } = await resizeAndSaveCigarImage(sourcePath, line.brand_slug, line.line_slug);
const { domain } = writeLineImageRecord(db, { lineId, publicPath, width, height, siteUrl });

console.log(`${line.name}: saved ${publicPath} (${width}x${height}) from ${domain}.`);
db.close();
