/**
 * Prepares post photographs for the web.
 *
 * Camera originals are far larger than this site can use. The build derives its
 * responsive widths from the source, so an oversized original produces an
 * oversized variant for every visitor on a high-density display. This caps the
 * long edge and re-encodes to WebP, which also drops the EXIF block that
 * cameras and phones attach.
 *
 *   node scripts/optimize-images.mjs src/routes/writing/1-imac
 *
 * Converted files are written alongside the originals and references in the
 * post are rewritten. Originals are left on disk; delete them once the pages
 * look right.
 */
import sharp from 'sharp';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';

const MAX_WIDTH = 1600;
const QUALITY = 82;
const CONVERTIBLE = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff']);

const kb = (bytes) => `${Math.round(bytes / 1024)}kB`;

const args = process.argv.slice(2);
/** Convert photographs the post does not reference yet, so they are ready to drop in. */
const all = args.includes('--all');
const directories = args.filter((arg) => !arg.startsWith('--'));

if (!directories.length) {
  console.error('usage: node scripts/optimize-images.mjs [--all] <post directory> [...]');
  process.exit(1);
}

for (const directory of directories) {
  const post = join(directory, '+page.svx');
  let markdown = await readFile(post, 'utf8').catch(() => null);
  if (markdown === null) {
    console.error(`skipping ${directory}: no +page.svx`);
    continue;
  }

  const entries = await readdir(directory);
  const sources = entries.filter((entry) => CONVERTIBLE.has(extname(entry).toLowerCase()));
  let savedBefore = 0;
  let savedAfter = 0;

  for (const source of sources) {
    const name = basename(source, extname(source));
    const target = `${name}.webp`;

    const referenced = markdown.includes(`./${source}`);
    if (!referenced && !all) {
      console.log(`  skip     ${source} (not referenced)`);
      continue;
    }

    const input = join(directory, source);
    const output = join(directory, target);
    const before = (await stat(input)).size;

    const image = sharp(input).rotate();
    const { width = 0 } = await image.metadata();

    // A PNG source is nearly always a screenshot or diagram, where soft text is
    // obvious in a way it never is on a photograph. Give those more bits.
    const screenshot = extname(source).toLowerCase() === '.png';

    await image
      .resize({ width: Math.min(width, MAX_WIDTH), withoutEnlargement: true })
      .webp({ quality: screenshot ? 94 : QUALITY })
      .toFile(output);

    const after = (await stat(output)).size;
    savedBefore += before;
    savedAfter += after;

    markdown = markdown.replaceAll(`./${source}`, `./${target}`);
    console.log(`  convert  ${source} -> ${target}  ${kb(before)} -> ${kb(after)}`);
  }

  await writeFile(post, markdown);
  if (savedBefore) {
    console.log(`${directory}: ${kb(savedBefore)} -> ${kb(savedAfter)}`);
  }
}
