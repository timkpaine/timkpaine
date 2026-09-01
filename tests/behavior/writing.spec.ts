import { expect, test } from '@playwright/test';

/**
 * `example-post` is a permanent draft that exercises every feature of the
 * writing pipeline. It is unlisted, so these tests address it directly.
 */
const POST = '/writing/example-post/';

test('markdown and Figure images both render as responsive pictures', async ({ page }) => {
  await page.goto(POST);

  const pictures = page.locator('article picture');
  await expect(pictures).toHaveCount(2);

  for (const format of ['image/avif', 'image/webp']) {
    await expect(page.locator(`article picture source[type="${format}"]`)).toHaveCount(2);
  }

  // Intrinsic dimensions keep the page from shifting as images load.
  for (const img of await page.locator('article picture img').all()) {
    expect(Number(await img.getAttribute('width'))).toBeGreaterThan(0);
    expect(Number(await img.getAttribute('height'))).toBeGreaterThan(0);
    await expect(img).toHaveAttribute('alt', /\S/);
  }

  await expect(page.locator('article figcaption')).toHaveCount(1);
});

test('images are served, not just referenced', async ({ page }) => {
  await page.goto(POST);

  const src = await page.locator('article picture img').first().getAttribute('src');
  expect(src).toBeTruthy();

  const response = await page.request.get(src!);
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('image/');
});

test('footnotes render and link both ways', async ({ page }) => {
  await page.goto(POST);

  const refs = page.locator('article .footnote-ref');
  await expect(refs).toHaveCount(2);
  await expect(page.locator('article .footnotes')).toBeVisible();

  // Markers must be numbered to match the ordered list they point into.
  await expect(refs.first()).toHaveText('1');
  await expect(refs.nth(1)).toHaveText('2');

  const target = await refs.first().getAttribute('href');
  expect(target).toMatch(/^#/);
  await expect(page.locator(`article ${target}`)).toBeVisible();

  // Every footnote offers a way back to where it was cited.
  await expect(page.locator('article .footnote-backref')).toHaveCount(2);
  const backref = await page.locator('article .footnote-backref').first().getAttribute('href');
  await expect(page.locator(`article ${backref}`)).toBeVisible();
});

test('posts are badged as human written', async ({ page }) => {
  await page.goto(POST);

  const badge = page.getByTestId('human-written');
  await expect(badge).toBeVisible();
  // The text carries the meaning; there is no decorative icon.
  await expect(badge).toHaveText(/written by a human/i);
});

test('headings expose stable anchors', async ({ page }) => {
  await page.goto(POST);

  for (const id of ['frontmatter', 'images', 'code']) {
    await expect(page.locator(`article h2#${id}`)).toBeVisible();
  }
});

test('reference-style links resolve to their definition', async ({ page }) => {
  await page.goto(POST);
  await expect(page.locator('article a[href="https://mdsvex.pngwn.io"]')).toBeVisible();
});

test('post emits article metadata exactly once', async ({ page }) => {
  await page.goto(POST);

  const single = async (selector: string, expected: string | RegExp) => {
    const tag = page.locator(selector);
    await expect(tag).toHaveCount(1);
    await expect(tag).toHaveAttribute('content', expected);
  };

  await single('meta[property="og:type"]', 'article');
  await single('meta[name="twitter:card"]', 'summary_large_image');
  await single('meta[property="og:image"]', /^https:\/\/tim\.paine\.nyc\//);
  await single('meta[property="article:published_time"]', /^2026-08-29/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/writing\/example-post\/$/);

  // Drafts must never be indexed.
  await single('meta[name="robots"]', /noindex/);
});

test('post publishes valid BlogPosting structured data', async ({ page }) => {
  await page.goto(POST);

  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(raw ?? '{}');

  expect(data['@type']).toBe('BlogPosting');
  expect(data.headline).toBeTruthy();
  expect(data.author.name).toBe('Tim Paine');
  expect(data.url).toContain('/writing/example-post/');
  expect(new Date(data.datePublished).toString()).not.toBe('Invalid Date');
});

test('post renders a readable date rather than a raw timestamp', async ({ page }) => {
  await page.goto(POST);

  const time = page.locator('article time').first();
  await expect(time).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
  await expect(time).toHaveText(/^\w+ \d{1,2}, \d{4}$/);
});

test('drafts are flagged in the index and never syndicated', async ({ page }) => {
  await page.goto('/writing/');

  // This preview build sets VITE_INCLUDE_DRAFTS so the tests can reach the
  // post. A production build lists no drafts at all, so nothing links to them
  // and they are never prerendered.
  const link = page.locator('a[href="/writing/example-post/"]');
  await expect(link).toHaveCount(1);
  // The index is a table; the draft marker rides in the row's title cell.
  await expect(page.locator('tr', { has: link })).toContainText('(draft)');

  // Drafts are withheld from the feed and sitemap even when they are listed.
  const feed = await (await page.request.get('/writing/rss.xml')).text();
  expect(feed).not.toContain('example-post');

  const sitemap = await (await page.request.get('/sitemap.xml')).text();
  expect(sitemap).not.toContain('example-post');
});

test('feed is well formed and discoverable', async ({ page }) => {
  await page.goto('/writing/');
  await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute(
    'href',
    '/writing/rss.xml'
  );

  const response = await page.request.get('/writing/rss.xml');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('xml');

  const body = await response.text();
  expect(body.startsWith('<?xml')).toBe(true);
  expect(body).toContain('<atom:link href="https://tim.paine.nyc/writing/rss.xml"');
  expect(body).not.toContain('Invalid Date');
});

test('sitemap lists the public pages with absolute URLs', async ({ page }) => {
  const body = await (await page.request.get('/sitemap.xml')).text();

  for (const path of ['/', '/talks/', '/writing/']) {
    expect(body).toContain(`<loc>https://tim.paine.nyc${path}</loc>`);
  }
  expect(body).not.toContain('<loc>/');
});
