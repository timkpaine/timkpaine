import { expect, test } from '@playwright/test';

test('theme selection persists across navigation', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('theme'));
  await page.reload();

  const initial = await page.locator('html').getAttribute('data-theme');
  await page.getByTestId('theme-toggle').click();
  const expected = initial === 'dark' ? 'light' : 'dark';

  await expect(page.locator('html')).toHaveAttribute('data-theme', expected);
  await page.goto('/talks/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', expected);
});

test('primary navigation reaches the archive pages', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'talks', exact: true }).click();
  await expect(page).toHaveURL(/\/talks\/$/);
  await expect(page.getByRole('heading', { name: 'Talks', level: 1 })).toBeVisible();

  await page.getByRole('link', { name: 'writing', exact: true }).click();
  await expect(page).toHaveURL(/\/writing\/$/);
  await expect(page.getByRole('heading', { name: 'Writing', level: 1 })).toBeVisible();
});
