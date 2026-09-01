import { expect, test } from '@playwright/test';

test('resume link serves a PDF', async ({ page }) => {
  await page.goto('/');

  // Addressed by href: the visible name now carries the file type as a
  // separate span rather than an arrow glyph.
  const links = page.locator('a[href="/rsc/TPCV.pdf"]');
  await expect(links).toHaveCount(1);
  await expect(links.first()).toBeVisible();

  const response = await page.request.get('/rsc/TPCV.pdf');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toBe('application/pdf');
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
});
