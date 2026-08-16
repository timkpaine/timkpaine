import { expect, test } from '@playwright/test';

test('resume link serves a PDF', async ({ page }) => {
  await page.goto('/');

  const links = page.getByRole('link', { name: 'Résumé ↗' });
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toHaveAttribute('href', '/rsc/TPCV.pdf');
  await expect(links.nth(1)).toHaveAttribute('href', '/rsc/TPCV.pdf');

  const response = await page.request.get('/rsc/TPCV.pdf');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toBe('application/pdf');
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
});
