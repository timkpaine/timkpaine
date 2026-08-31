/**
 * Renders Open Graph cards (1200x630) with the browser Playwright already
 * installs for the e2e suite.
 *
 *   node scripts/og.mjs                       # default card -> static/og.png
 *   node scripts/og.mjs --posts               # one card per post -> static/og/<slug>.png
 *
 * Point a post at its own card with `image: /og/<slug>.png` in the frontmatter.
 */
import { chromium } from '@playwright/test';
import { mkdir, readdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WRITING_DIR = resolve(root, 'src/routes/writing');

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const card = ({ title, eyebrow }) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; margin: 0; }
      body {
        width: 1200px; height: 630px; display: flex; flex-direction: column;
        justify-content: space-between; padding: 76px 84px;
        background: #f2f0e9; color: #121411;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      }
      .eyebrow {
        font-size: 21px; text-transform: uppercase; letter-spacing: 0.16em;
        color: #6b6b63; display: flex; align-items: center; gap: 14px;
      }
      .dot { width: 13px; height: 13px; border-radius: 999px; background: #cf4b2e; }
      h1 { font-size: 84px; line-height: 1.02; letter-spacing: -0.045em; font-weight: 500; max-width: 15ch; }
      .foot { display: flex; justify-content: space-between; align-items: flex-end; font-size: 23px; color: #6b6b63; }
      .name { color: #121411; font-weight: 600; }
    </style>
  </head>
  <body>
    <p class="eyebrow"><span class="dot"></span>${escapeHtml(eyebrow)}</p>
    <h1>${escapeHtml(title)}</h1>
    <div class="foot"><span class="name">Tim Paine</span><span>tim.paine.nyc</span></div>
  </body>
</html>`;

const readFrontmatter = async (file) => {
  const raw = await readFile(file, 'utf8');
  const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!block) return null;
  const entry = (key) =>
    block[1]
      .match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]
      .trim()
      .replace(/^["']|["']$/g, '');
  return { title: entry('title'), draft: entry('draft') === 'true' };
};

const collectPosts = async () => {
  const entries = await readdir(WRITING_DIR, { withFileTypes: true });
  const posts = [];
  for (const entry of entries.filter((candidate) => candidate.isDirectory())) {
    const meta = await readFrontmatter(resolve(WRITING_DIR, entry.name, '+page.svx')).catch(() => null);
    if (meta?.title) posts.push({ slug: entry.name, ...meta });
  }
  return posts;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

const shoot = async (html, out) => {
  await mkdir(dirname(out), { recursive: true });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: out });
  console.log(`wrote ${out.replace(`${root}/`, '')}`);
};

await shoot(
  card({ eyebrow: 'Software engineer · Open-source maintainer', title: 'Notes on software and the work around it.' }),
  resolve(root, 'static/og.png')
);

if (process.argv.includes('--posts')) {
  for (const post of await collectPosts()) {
    await shoot(card({ eyebrow: 'Writing', title: post.title }), resolve(root, `static/og/${post.slug}.png`));
  }
}

await browser.close();
