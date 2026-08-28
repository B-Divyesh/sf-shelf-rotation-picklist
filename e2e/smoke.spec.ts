import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('desktop workflow is keyboard-operable and has no axe violations', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await page.getByRole('button', { name: /try five sample games/i }).click();
  await page.getByRole('button', { name: /make my picklist/i }).click();
  await expect(page.getByRole('heading', { name: 'Print the night’s contenders.' })).toBeFocused();
  await page.waitForTimeout(250);
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test('mobile layout does not overflow and stays local-first', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { name: 'Your shelf stays on your device.' })).toBeVisible();
  await page.goto('/terms');
  await expect(page.getByRole('heading', { name: 'Use it, adapt it, play something.' })).toBeVisible();
});

test('service worker serves the shell offline and clears an old cache on update', async ({ page, context }) => {
  await context.addInitScript(() => caches.open('shelf-rotation-v1').then((cache) => cache.put('/stale', new Response('stale'))));
  await page.goto('/');
  await expect.poll(() => page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    await navigator.serviceWorker.ready;
    return Boolean(navigator.serviceWorker.controller);
  })).toBe(true);
  await expect.poll(() => page.evaluate(() => caches.keys())).toEqual(['shelf-rotation-v2']);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#offline-banner')).toBeVisible();
  await expect(page.getByRole('heading', { name: /stop scrolling/i })).toBeVisible();
  await context.setOffline(false);
});

test('reduced motion removes ticket animation movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: /try five sample games/i }).click();
  await page.getByRole('button', { name: /make my picklist/i }).click();
  await expect(page.locator('.pick-card').first()).toHaveCSS('animation-duration', '1e-05s');
});
