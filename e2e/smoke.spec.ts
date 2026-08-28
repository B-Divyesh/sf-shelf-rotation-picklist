import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('@claim:demo-isolation opens a ready picklist and never reads or writes real data', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('shelf-rotation-picklist:v1', JSON.stringify({ games: [{ title: 'MY REAL PRIVATE GAME' }] })));
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('.pick-card')).toHaveCount(3);
  await expect(page.getByText('MY REAL PRIVATE GAME')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('shelf-rotation-picklist:v1'))).toContain('MY REAL PRIVATE GAME');
  expect(await page.evaluate(() => localStorage.getItem('demo:shelf-rotation-picklist:v1'))).toBeNull();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate(() => localStorage.getItem('shelf-rotation-picklist:v1'))).toContain('MY REAL PRIVATE GAME');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => localStorage.getItem('demo:shelf-rotation-picklist:v1'))).toBeNull();
});

test('@claim:picklist-filters-and-reasons excludes limits and explains every pick', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('.pick-card')).toHaveCount(3);
  expect(await page.locator('.pick-card .reason-list li').count()).toBeGreaterThanOrEqual(3);
  await page.locator('#players').fill('20');
  await page.getByRole('button', { name: /make my picklist/i }).click();
  await expect(page.getByText('Nothing fits all limits.')).toBeVisible();
  await page.getByText('See exclusion reasons').click();
  await expect(page.getByText(/needs 1–4 players/)).toBeVisible();
});

test('@claim:score-points uses the published 85-point formula', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: /see scoring details/i }).click();
  await expect(page.getByText('+5 per full month since played, capped at +50')).toBeVisible();
  await expect(page.getByText('+20 on top of maximum neglect')).toBeVisible();
  await expect(page.getByText('Light +10 · medium +5 · heavy +0')).toBeVisible();
  await page.getByRole('button', { name: 'Close scoring details' }).click();
  const scores = await page.locator('.pick-card .score').allTextContents();
  expect(scores[0]).toContain('85');
  scores.forEach(score => expect(Number(score.split('/')[0])).toBeLessThanOrEqual(85));
});

test('@claim:csv-io imports valid rows, reports invalid rows, and exports CSV', async ({ page }) => {
  await page.goto('/demo');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export shelf' }).click();
  expect((await download).suggestedFilename()).toBe('my-shelf.csv');
  const template = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download template' }).click();
  expect((await template).suggestedFilename()).toBe('shelf-rotation-template.csv');
  await page.locator('#csv-file').setInputFiles({ name: 'mixed.csv', mimeType: 'text/csv', buffer: Buffer.from('title,last_played,min_players,max_players,minutes,setup\nGood,2024-02-29,2,4,30,medium\nBad,2026-02-30,2,4,30,medium') });
  await expect(page.getByRole('heading', { name: 'Good' })).toBeVisible();
  await expect(page.locator('#import-errors')).toContainText('Row 3');
});

test('@claim:privacy-local only uses same-origin requests and browser storage', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: /save picklist/i }).click();
  expect(requests.every(url => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  expect(await page.evaluate(() => localStorage.getItem('demo:shelf-rotation-picklist:v1'))).toContain('savedRotations');
});

test('@claim:saved-picklists retains ten saved picklists and prints on request', async ({ page }) => {
  await page.goto('/demo');
  await page.evaluate(() => { window.print = () => { document.body.dataset.printed = 'yes'; }; });
  for (let index = 0; index < 11; index += 1) await page.getByRole('button', { name: /save picklist/i }).click();
  await expect(page.locator('.saved-rotations summary')).toContainText('10');
  await page.getByRole('button', { name: 'Print / PDF' }).click();
  await expect.poll(() => page.locator('body').getAttribute('data-printed')).toBe('yes');
});

test('@claim:free-no-account needs no sign-in or payment to use the sample', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('.pick-card')).toHaveCount(3);
  expect(await page.locator('input[type="password"], input[type="email"]').count()).toBe(0);
  expect(await page.getByText(/payment|subscribe|sign in/i).count()).toBe(0);
});

test('@claim:clear-local-data removes only the real shelf namespace after confirmation', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('shelf-rotation-picklist:v1', JSON.stringify({ games: [{ title: 'Keep no more' }] })));
  await page.goto('/privacy');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Clear local data' }).click();
  await expect(page.getByRole('button', { name: 'Local data cleared' })).toBeDisabled();
  expect(await page.evaluate(() => localStorage.getItem('shelf-rotation-picklist:v1'))).toBeNull();
});

test('@claim:offline-reload reloads the demo and its picklist offline', async ({ page, context }) => {
  await page.goto('/demo');
  await expect.poll(() => page.evaluate(async () => Boolean(navigator.serviceWorker?.controller))).toBe(true);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#offline-banner')).toBeVisible();
  await expect(page.locator('.pick-card')).toHaveCount(3);
  await context.setOffline(false);
});

test('@claim:themes-and-accessibility keeps routes, focus, dark theme, and mobile reflow usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.getByRole('button', { name: 'Dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByLabel('Site').getByRole('link', { name: 'Privacy' }).click();
  await expect(page.getByRole('heading', { name: /your shelf stays/i })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: /pick neglected board games/i })).toBeFocused();
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('@claim:routing-metadata-and-provenance gives every page a route title and a useful 404', async ({ page }) => {
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Shelf Rotation Picklist');
  await page.goto('/not-a-real-route');
  await expect(page.getByRole('heading', { name: 'This page does not exist' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /not-a-real-route$/);
  await page.goto('/sitemap.xml');
  await expect(page.locator('body')).toContainText('shelf-rotation-picklist.sociobot.in/demo');
});
