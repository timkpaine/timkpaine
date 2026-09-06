import { expect, test } from '@playwright/test';

/**
 * The site's palette overflows at the ordinary viewport - 27 commands, 700px of
 * content in a 486px list - so this is the path a reader actually takes. The
 * fix lives in the UI package; these guard the symptom where it was seen.
 */

const OPEN = process.platform === 'darwin' ? 'Meta+k' : 'Control+k';

async function openPalette(page: import('@playwright/test').Page) {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-command-palette', 'ready');
  await page.keyboard.press(OPEN);
  await expect(page.getByTestId('command-palette-input')).toBeFocused();
}

test('the command list overflows, so the rest of this file is meaningful', async ({ page }) => {
  await openPalette(page);
  const overflows = await page.getByTestId('command-palette-list').evaluate((el) => el.scrollHeight > el.clientHeight);
  expect(overflows).toBe(true);
});

test('arrowing through the whole list advances one row at a time', async ({ page }) => {
  await openPalette(page);
  const input = page.getByTestId('command-palette-input');
  const total = await page.getByTestId('command-palette-option').count();

  for (let i = 1; i < total; i++) {
    await page.keyboard.press('ArrowDown');
    await expect(input).toHaveAttribute('aria-activedescendant', `command-palette-option-${i}`);
  }
  // And back up again, one at a time.
  for (let i = total - 2; i >= 0; i--) {
    await page.keyboard.press('ArrowUp');
    await expect(input).toHaveAttribute('aria-activedescendant', `command-palette-option-${i}`);
  }
});

test('the selection is not dragged back by a pointer resting on the list', async ({ page }) => {
  await openPalette(page);
  const input = page.getByTestId('command-palette-input');
  const box = (await page.getByTestId('command-palette-list').boundingBox())!;
  const x = Math.round(box.x + box.width / 2);
  const y = Math.round(box.y + 20);

  await page.mouse.move(x, y);
  for (let i = 0; i < 12; i++) await page.keyboard.press('ArrowDown');
  const before = await input.getAttribute('aria-activedescendant');

  // What a browser emits when the list scrolls beneath a stationary pointer.
  await page.evaluate(
    ([x, y]) => {
      const el = document.elementFromPoint(x as number, y as number) as HTMLElement | null;
      el?.closest('[data-testid="command-palette-option"]')?.dispatchEvent(
        new MouseEvent('mousemove', { bubbles: true, clientX: x as number, clientY: y as number })
      );
    },
    [x, y]
  );

  expect(await input.getAttribute('aria-activedescendant')).toBe(before);
});

test('stepping through the list never scrolls the page behind it', async ({ page }) => {
  await openPalette(page);
  const before = await page.evaluate(() => window.scrollY);
  for (let i = 0; i < 20; i++) await page.keyboard.press('ArrowDown');
  expect(await page.evaluate(() => window.scrollY)).toBe(before);
});

test('the selection stays inside the list at every step', async ({ page }) => {
  await openPalette(page);
  const total = await page.getByTestId('command-palette-option').count();
  for (let i = 1; i < total; i++) {
    await page.keyboard.press('ArrowDown');
    const inside = await page.evaluate(() => {
      const list = document.querySelector('[data-testid="command-palette-list"]')!;
      const option = list.querySelector('[aria-selected="true"]');
      if (!option) return false;
      const l = list.getBoundingClientRect();
      const o = option.getBoundingClientRect();
      return o.top >= l.top - 1 && o.bottom <= l.bottom + 1;
    });
    expect(inside).toBe(true);
  }
});

test('a genuine pointer move still selects', async ({ page }) => {
  await openPalette(page);
  const option = page.getByTestId('command-palette-option').nth(4);
  const box = (await option.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.getByTestId('command-palette-input')).toHaveAttribute(
    'aria-activedescendant',
    'command-palette-option-4'
  );
});
