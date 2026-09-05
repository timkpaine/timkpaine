import { expect, test } from '@playwright/test';

/**
 * Regression guard. The clickable-row hit area was once a pseudo-element
 * stretched across the row. A table row is not a dependable containing block,
 * and where a browser disagrees the overlay covers the whole page, so clicking
 * anywhere navigates to a row's link. Runs on every project, at every viewport.
 */

const PAGES = ['/', '/talks/', '/writing/'];

for (const path of PAGES) {
  test(`no row link covers the page on ${path}`, async ({ page }) => {
    await page.goto(path);
    const covered = await page.evaluate(() => {
      const boxes = Array.from(document.querySelectorAll('tbody tr')).map((row) => row.getBoundingClientRect());
      const insideARow = (x: number, y: number) =>
        boxes.some((b) => x >= b.left && x <= b.right && y >= b.top && y <= b.bottom);

      const hits: string[] = [];
      for (let x = 6; x < window.innerWidth; x += 32) {
        for (let y = 6; y < window.innerHeight; y += 32) {
          if (insideARow(x, y)) continue;
          const el = document.elementFromPoint(x, y) as HTMLElement | null;
          if (el?.closest('[data-testid="row-link"]')) hits.push(`${x},${y}`);
        }
      }
      return hits;
    });
    expect(covered).toEqual([]);
  });
}

test('clicking the page outside a table does not navigate', async ({ page }) => {
  await page.goto('/writing/');
  const start = page.url();
  // The heading, then well below the last row.
  await page.getByRole('heading', { name: 'Writing', level: 1 }).click();
  expect(page.url()).toBe(start);

  const viewport = page.viewportSize()!;
  await page.mouse.click(viewport.width / 2, viewport.height - 8);
  expect(page.url()).toBe(start);
});

test('clicking a row still opens the post', async ({ page }) => {
  await page.goto('/writing/');
  const row = page.getByTestId('row-link').first().locator('xpath=ancestor::tr');
  const box = (await row.boundingBox())!;
  await page.mouse.click(box.x + box.width - 12, box.y + box.height / 2);
  await expect(page).toHaveURL(/\/writing\/[^/]+\/$/);
});
