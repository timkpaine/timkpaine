import { devices, expect, test } from '@playwright/test';

// A real phone. The `mobile` project is desktop Chrome at a narrow width and has
// no touch events, a fine pointer, and hover available, so it cannot catch any
// of this.
test.use({ ...devices['Pixel 7'] });

const HIGHLIGHT = 'rgb(200, 255, 53)';

test('tapping anywhere on a writing row opens the post', async ({ page }) => {
  await page.goto('/writing/');
  const row = page.getByTestId('row-link').first().locator('xpath=ancestor::tr');
  const box = (await row.boundingBox())!;
  // The far end of the row, well past the title text.
  await page.touchscreen.tap(box.x + box.width - 12, box.y + box.height / 2);
  await expect(page).toHaveURL(/\/writing\/[^/]+\/$/);
});

test('the highlight does not latch after a tap', async ({ page }) => {
  await page.goto('/');
  // The résumé table has no row links, so a tap cannot navigate away.
  const row = page.getByTestId('data-table').first().locator('tbody tr').first();
  await row.tap();
  const background = await row
    .locator('td')
    .nth(1)
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(background).not.toBe(HIGHLIGHT);
});

test('rows are comfortable touch targets', async ({ page }) => {
  await page.goto('/');
  const rows = page.getByTestId('data-table').first().locator('tbody tr');
  for (const row of await rows.all()) {
    expect((await row.boundingBox())!.height).toBeGreaterThanOrEqual(32);
  }
});

test('the palette is reachable without a keyboard', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-command-palette', 'ready');
  await expect(page.getByTestId('palette-hint')).toHaveText(/Go to/);
  await page.getByTestId('palette-hint').tap();
  await expect(page.getByTestId('command-palette')).toBeVisible();
});

test('the palette can navigate on a phone', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-command-palette', 'ready');
  await page.getByTestId('palette-hint').tap();
  await page.getByTestId('command-palette-input').fill('talks');
  await page.getByTestId('command-palette-option').first().tap();
  await expect(page).toHaveURL(/\/talks\/$/);
});
