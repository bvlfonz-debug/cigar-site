// Shared cigar-image processing pipeline. This is the ONLY place the resize
// parameters live -- both the single-image and batch upload scripts import
// this so there is exactly one definition of "how a cigar photo gets sized."
//
// The rule: a photo is always resized to fit within a bounding box, never
// cropped to force a particular shape. `fit: 'inside'` scales the whole
// image down (preserving its native aspect ratio) until it fits inside
// MAX_LONG_EDGE x MAX_LONG_EDGE, so the short edge comes out however the
// source image's own proportions dictate -- nothing outside the box is ever
// discarded, and nothing inside it is ever stretched or upscaled.
import { DatabaseSync } from 'node:sqlite';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const MAX_LONG_EDGE = 1200; // px -- neither dimension of a stored photo exceeds this
export const JPEG_QUALITY = 82;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const dbPath = path.join(__dirname, '..', '..', 'data', 'cigars.db');
export const publicDir = path.join(__dirname, '..', '..', 'public');

/**
 * Resize a source image (never cropping) and save it as a JPEG under
 * public/images/cigars/<brandSlug>/<lineSlug>.jpg. Returns the site-relative
 * public path plus the final pixel dimensions.
 */
export async function resizeAndSaveCigarImage(sourcePath, brandSlug, lineSlug) {
  const destDir = path.join(publicDir, 'images', 'cigars', brandSlug);
  fs.mkdirSync(destDir, { recursive: true });
  const destFile = path.join(destDir, `${lineSlug}.jpg`);

  await sharp(fs.readFileSync(sourcePath))
    .rotate() // apply EXIF orientation before resizing
    .resize({ width: MAX_LONG_EDGE, height: MAX_LONG_EDGE, fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: JPEG_QUALITY })
    .toFile(destFile + '.tmp');
  fs.renameSync(destFile + '.tmp', destFile);

  const meta = await sharp(destFile).metadata();
  return {
    publicPath: `/images/cigars/${brandSlug}/${lineSlug}.jpg`,
    width: meta.width,
    height: meta.height,
  };
}

/** Writes the image fields onto a `line` row. Does not touch any other column. */
export function writeLineImageRecord(db, { lineId, publicPath, width, height, siteUrl }) {
  const domain = new URL(siteUrl).hostname.replace(/^www\./, '');
  const checkedAt = new Date().toISOString().slice(0, 10);
  db.prepare(
    `UPDATE line SET image_url = ?, image_source_name = ?, image_source_url = ?, image_checked_at = ?, image_width = ?, image_height = ? WHERE id = ?`
  ).run(publicPath, domain, siteUrl, checkedAt, width, height, lineId);
  return { domain, checkedAt };
}

export function openDb() {
  return new DatabaseSync(dbPath);
}
