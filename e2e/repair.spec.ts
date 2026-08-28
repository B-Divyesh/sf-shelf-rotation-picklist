import { expect, test, type Page, type Route } from '@playwright/test';

const strictCsp = "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";

async function applyStrictCsp(page: Page): Promise<void> {
  await page.route('**/*', async (route: Route) => {
    const response = await route.fetch();
    if (route.request().resourceType() !== 'document') return route.fulfill({ response });
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': strictCsp } });
  });
}

test('strict deployed CSP permits a generated shortlist with no inline styles or console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await applyStrictCsp(page);
  await page.goto('/');
  await page.getByRole('button', { name: /try five sample games/i }).click();
  await page.getByRole('button', { name: /make my picklist/i }).click();
  await expect(page.locator('.pick-card')).toHaveCount(3);
  expect(await page.locator('.pick-card').evaluateAll((cards) => cards.every((card) => !card.hasAttribute('style')))).toBe(true);
  expect(errors).toEqual([]);
});

test('whitespace-only manual titles remain invalid and are not persisted', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /add one game/i }).click();
  await page.locator('input[name="title"]').fill('   ');
  await page.locator('input[name="minutes"]').fill('1');
  await page.getByRole('button', { name: 'Add to shelf' }).click();
  await expect(page.getByText('Enter a game title, not only spaces.')).toBeVisible();
  await expect(page.locator('#game-dialog')).toBeVisible();
  await expect(page.locator('.game-row')).toHaveCount(0);
  expect((await page.evaluate(() => localStorage.getItem('shelf-rotation-picklist:v1'))) ?? '').not.toContain('"title":"   "');
});

test('CSV rejects impossible dates and reports same-file duplicate titles', async ({ page }) => {
  await page.goto('/');
  await page.locator('#csv-file').setInputFiles({
    name: 'broken-shelf.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('title,last_played,min_players,max_players,minutes,setup\nImpossible,2026-02-30,2,4,30,medium\nSame,,2,4,30,medium\nsame,,1,4,40,light\nValid,2024-02-29,2,4,30,medium'),
  });
  await expect(page.locator('#import-errors')).toContainText('Row 2: last_played must be YYYY-MM-DD or blank.');
  await expect(page.locator('#import-errors')).toContainText('Row 4: title duplicates row 3 (case-insensitive).');
  await expect(page.locator('.game-row')).toHaveCount(2);
  await expect(page.getByRole('heading', { name: 'Impossible' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Same' })).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Valid' })).toHaveCount(1);
});

test('every mobile footer link has a 44px touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const boxes = await page.locator('.site-footer a').evaluateAll((links) => links.map((link) => {
    const box = link.getBoundingClientRect();
    return { text: link.textContent?.trim(), width: box.width, height: box.height };
  }));
  expect(boxes).toEqual(expect.arrayContaining([
    expect.objectContaining({ text: 'Privacy' }),
    expect.objectContaining({ text: 'Terms' }),
    expect.objectContaining({ text: 'MIT source' }),
  ]));
  boxes.forEach(({ width, height }) => {
    expect(width).toBeGreaterThanOrEqual(44);
    expect(height).toBeGreaterThanOrEqual(44);
  });
});
