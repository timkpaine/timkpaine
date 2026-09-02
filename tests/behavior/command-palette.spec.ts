import { expect, test } from '@playwright/test';

const OPEN = process.platform === 'darwin' ? 'Meta+k' : 'Control+k';

/** The shortcut only works once the palette has hydrated. */
async function ready(page: import('@playwright/test').Page) {
  await expect(page.locator('html')).toHaveAttribute('data-command-palette', 'ready');
}

test('the palette opens on every page', async ({ page }) => {
  for (const route of ['/', '/talks/', '/writing/']) {
    await page.goto(route);
    await ready(page);
    await page.keyboard.press(OPEN);
    await expect(page.getByTestId('command-palette')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('command-palette')).toBeHidden();
  }
});

test('it navigates to a page', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  await page.keyboard.press(OPEN);
  await expect(page.getByTestId('command-palette-input')).toBeFocused();
  await page.keyboard.type('talks');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/talks\/$/);
  await expect(page.getByRole('heading', { name: 'Talks', level: 1 })).toBeVisible();
});

test('it navigates to a writing post', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  await page.keyboard.press(OPEN);
  await expect(page.getByTestId('command-palette-input')).toBeFocused();
  await page.keyboard.type('iMac');
  const first = page.getByTestId('command-palette-option').first();
  await expect(first).toContainText(/iMac/i);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/writing\/[^/]+\/$/);
});

test('talks are reachable with their media kind', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  await page.keyboard.press(OPEN);
  await expect(page.getByTestId('command-palette-input')).toBeFocused();
  await page.keyboard.type('copier');
  const options = page.getByTestId('command-palette-option');
  await expect(options.first()).toContainText('Copier');
  // The same talk appears once per medium, labelled by which.
  await expect(page.getByTestId('command-palette-list')).toContainText('slides');
});

test('external commands show their host', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  await page.keyboard.press(OPEN);
  await expect(page.getByTestId('command-palette-input')).toBeFocused();
  await page.keyboard.type('linkedin');
  await expect(page.getByTestId('command-palette-option').first()).toContainText('linkedin.com');
});

test('it switches the theme', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('theme', 'light'));
  await page.reload();
  await ready(page);
  await page.keyboard.press(OPEN);
  await expect(page.getByTestId('command-palette-input')).toBeFocused();
  await page.keyboard.type('theme dark');
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('the table keyboard layer is reachable by tabbing', async ({ page }) => {
  await page.goto('/');
  const reached: string[] = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    reached.push(
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.getAttribute('data-testid') ?? '')
    );
  }
  expect(reached).toContain('table-region');
});
