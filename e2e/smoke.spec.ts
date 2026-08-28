import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Download, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';

const DEMO_KEY = 'demo:shelf-rotation-picklist:v1';
const REAL_KEY = 'shelf-rotation-picklist:v1';

async function downloadText(download: Download): Promise<string> {
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

async function writeDemoState(page: Page, state: object): Promise<void> {
  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: DEMO_KEY, value: state });
  await page.reload();
}

test('@claim:demo-isolation opens a ready picklist and never reads or writes real data', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('shelf-rotation-picklist:v1', JSON.stringify({ games: [{ title: 'MY REAL PRIVATE GAME' }] })));
  await page.goto('/?demo=1');
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
  const today = new Date().toISOString().slice(0, 10);
  const game = (id: string, title: string, changes: Record<string, unknown> = {}) => ({
    id, title, lastPlayed: today, minPlayers: 1, maxPlayers: 4, minutes: 45,
    setup: 'light', tags: ['target'], available: true, createdAt: new Date().toISOString(), ...changes,
  });
  const tonight = { players: 2, maxMinutes: 90, maxSetup: 'heavy', tag: '', shortlistSize: 3 };
  await page.addInitScript(({ key, state }) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(state));
  }, {
    key: DEMO_KEY,
    state: {
      games: [
        game('1', 'Never Light', { lastPlayed: null }),
        game('2', 'Recent Medium', { setup: 'medium' }),
        game('3', 'Recent Heavy', { setup: 'heavy', tags: [] }),
      ],
      savedRotations: [], tonight, theme: 'light',
    },
  });
  await page.goto('/demo');
  await expect(page.locator('.pick-card')).toHaveCount(3);
  const card = (title: string) => page.locator('.pick-card').filter({ has: page.getByRole('heading', { name: title, exact: true }) });
  await expect(card('Never Light').locator('.reason-list li')).toHaveText(['Never played: +20', 'Maximum neglect: +50', 'Light setup: +10', 'Adds tag variety: +5']);
  await expect(card('Recent Medium').locator('.reason-list li')).toHaveText(['Played within the last month: +0 neglect', 'Medium setup: +5']);
  await expect(card('Recent Heavy').locator('.reason-list li')).toHaveText(['Played within the last month: +0 neglect']);
  const unchangedScore = await card('Recent Medium').locator('.score').textContent();

  await page.locator('#players').fill('3');
  await page.locator('#players').dispatchEvent('change');
  await page.locator('#max-minutes').fill('60');
  await page.locator('#max-minutes').dispatchEvent('change');
  await page.locator('#max-setup').selectOption('heavy');
  await page.locator('#tag').selectOption('target');
  await page.getByRole('button', { name: /make my picklist/i }).click();
  await expect(card('Recent Medium').locator('.score')).toHaveText(unchangedScore ?? '');

  const assertExcluded = async (state: object, reason: RegExp) => {
    await writeDemoState(page, state);
    const generate = page.getByRole('button', { name: /make my picklist/i });
    await expect(generate).toBeEnabled();
    await generate.click();
    await expect(page.getByText('Nothing fits all limits.')).toBeVisible();
    await page.getByText('See exclusion reasons').click();
    await expect(page.locator('.no-eligible')).toContainText(reason);
  };
  const state = (target: object, limits: object = tonight, extras: object[] = []) => ({ games: [target, ...extras], savedRotations: [], tonight: limits, theme: 'light' });
  await assertExcluded(state(game('10', 'Unavailable', { available: false })), /marked unavailable tonight/);
  await assertExcluded(state(game('11', 'Player Boundary', { minPlayers: 3 })), /needs 3–4 players/);
  await assertExcluded(state(game('12', 'Time Boundary', { minutes: 120 })), /120 min exceeds the time limit/);
  await assertExcluded(state(game('13', 'Setup Boundary', { setup: 'heavy' }), { ...tonight, maxSetup: 'medium' }), /heavy setup exceeds the setup limit/);
  await assertExcluded(state(game('14', 'Tag Boundary'), { ...tonight, tag: 'cards' }, [game('15', 'Tag Source', { tags: ['cards'], available: false })]), /does not have the “cards” tag/);
});

test('@claim:score-points uses the published 85-point formula', async ({ page }) => {
  await page.addInitScript(() => {
    const today = new Date().toISOString().slice(0, 10);
    const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
    const game = (id: string, title: string, lastPlayed: string | null, setup: 'light' | 'medium' | 'heavy', tags: string[]) => ({ id, title, lastPlayed, minPlayers: 2, maxPlayers: 4, minutes: 45, setup, tags, available: true, createdAt: today });
    localStorage.setItem('demo:shelf-rotation-picklist:v1', JSON.stringify({
      games: [
        game('1', 'Never Light', null, 'light', ['fresh']),
        game('2', 'Zero Months', today, 'heavy', []),
        game('3', 'One Month', daysAgo(31), 'heavy', []),
        game('4', 'Two Months', daysAgo(62), 'heavy', []),
        game('5', 'Ten Months', daysAgo(306), 'heavy', []),
        game('6', 'Over Ten Months', daysAgo(366), 'heavy', []),
        game('7', 'Capped Medium', '2024-01-01', 'medium', ['fresh']),
        game('8', 'Variety Light', today, 'light', ['new']),
        game('9', 'Heavy Recent', today, 'heavy', ['fresh']),
      ],
      savedRotations: [],
      tonight: { players: 2, maxMinutes: 90, maxSetup: 'heavy', tag: '', shortlistSize: 9 },
      theme: 'light',
    }));
  });
  await page.goto('/demo');
  const card = (title: string) => page.locator('.pick-card').filter({ has: page.getByRole('heading', { name: title, exact: true }) });
  await expect(card('Never Light').locator('.score')).toHaveText('85/85');
  await expect(card('Never Light').locator('.reason-list li')).toHaveText(['Never played: +20', 'Maximum neglect: +50', 'Light setup: +10', 'Adds tag variety: +5']);
  await expect(card('Zero Months').locator('.reason-list')).toContainText('Played within the last month: +0 neglect');
  await expect(card('One Month').locator('.reason-list')).toContainText('1 month waiting: +5');
  await expect(card('Two Months').locator('.reason-list')).toContainText('2 months waiting: +10');
  await expect(card('Ten Months').locator('.reason-list')).toContainText('10 months waiting: +50');
  await expect(card('Over Ten Months').locator('.reason-list')).toContainText(/\+50/);
  await expect(card('Capped Medium').locator('.score')).toHaveText('55/85');
  await expect(card('Capped Medium').locator('.reason-list')).toContainText(/waiting: \+50/);
  await expect(card('Capped Medium').locator('.reason-list')).toContainText('Medium setup: +5');
  await expect(card('Variety Light').locator('.score')).toHaveText('15/85');
  await expect(card('Variety Light').locator('.reason-list li')).toHaveText(['Played within the last month: +0 neglect', 'Light setup: +10', 'Adds tag variety: +5']);
  await expect(card('Heavy Recent').locator('.score')).toHaveText('0/85');
});

test('@claim:picklist-size returns the selected three, four, or five picks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo');
  await expect(page.locator('.game-row')).toHaveCount(5);
  const generate = page.getByRole('button', { name: /make my picklist/i });
  await expect(generate).toBeEnabled();
  for (const size of [3, 4, 5]) {
    await page.locator(`#tonight-form input[value="${size}"]`).check();
    await expect(generate).toBeEnabled();
    await generate.click();
    await expect(page.locator('.pick-card')).toHaveCount(size);
  }
});

test('@claim:repeatable-picklist returns the same order and points for unchanged data', async ({ page }) => {
  await page.goto('/demo');
  const snapshot = async () => ({
    titles: await page.locator('.pick-card h3').allTextContents(),
    scores: await page.locator('.pick-card .score').allTextContents(),
  });
  const first = await snapshot();
  await page.getByRole('button', { name: /make my picklist/i }).click();
  expect(await snapshot()).toEqual(first);
});

test('@claim:tie-breaks orders equal-score games alphabetically', async ({ page }) => {
  await page.addInitScript(() => {
    const today = new Date().toISOString().slice(0, 10);
    const games = ['Zulu', 'Bravo', 'Alpha'].map((title, index) => ({ id: String(index), title, lastPlayed: today, minPlayers: 2, maxPlayers: 4, minutes: 45, setup: 'medium', tags: ['same'], available: true, createdAt: today }));
    localStorage.setItem('demo:shelf-rotation-picklist:v1', JSON.stringify({ games, savedRotations: [], tonight: { players: 2, maxMinutes: 90, maxSetup: 'medium', tag: '', shortlistSize: 3 }, theme: 'light' }));
  });
  await page.goto('/demo');
  await expect(page.locator('.pick-card h3')).toHaveText(['Alpha', 'Bravo', 'Zulu']);
});

test('@claim:csv-io imports valid rows, reports invalid rows, and exports CSV', async ({ page }) => {
  await page.goto('/demo');
  const template = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download template' }).click();
  const templateDownload = await template;
  expect(templateDownload.suggestedFilename()).toBe('shelf-rotation-template.csv');
  expect(await downloadText(templateDownload)).toBe('title,last_played,min_players,max_players,minutes,setup,tags,available\nExample Game,2026-01-15,1,4,45,light,cards|co-op,true\nNever Played Game,,2,5,90,medium,strategy,true\n');

  await page.getByRole('button', { name: 'Add one game' }).click();
  await page.getByLabel('Title').fill('Manual Marker 731');
  await page.getByLabel('Last played').fill('2024-02-29');
  await page.getByLabel('Minutes').fill('55');
  await page.getByLabel('Minimum players').fill('1');
  await page.getByLabel('Maximum players').fill('6');
  await page.locator('#game-dialog').getByLabel('Setup').selectOption('medium');
  await page.getByLabel('Tags').fill('manual, co-op');
  await page.getByRole('button', { name: 'Add to shelf' }).click();
  await expect(page.getByRole('heading', { name: 'Manual Marker 731' })).toBeVisible();

  const csv = [
    'title,last_played,min_players,max_players,minutes,setup,tags,available',
    'True Marker,,1,4,30,light,cards|quick,true',
    'False Marker,2024-02-29,1,4,30,medium,strategy,false',
    'Yes Marker,,1,4,30,heavy,party,yes',
    'No Marker,,1,4,30,light,party,no',
    'One Marker,,1,4,30,medium,party,1',
    'Zero Marker,,1,4,30,heavy,party,0',
    'Bad Date,2026-02-30,1,4,30,light,bad,true',
    'Bad Setup,,1,4,30,huge,bad,true',
  ].join('\n');
  await page.locator('#csv-file').setInputFiles({ name: 'documented-values.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  for (const title of ['True Marker', 'False Marker', 'Yes Marker', 'No Marker', 'One Marker', 'Zero Marker']) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }
  await expect(page.locator('.game-row').filter({ has: page.getByRole('heading', { name: 'False Marker' }) })).toContainText('OUT');
  await expect(page.locator('.game-row').filter({ has: page.getByRole('heading', { name: 'No Marker' }) })).toContainText('OUT');
  await expect(page.locator('.game-row').filter({ has: page.getByRole('heading', { name: 'Zero Marker' }) })).toContainText('OUT');
  await expect(page.locator('#import-errors')).toContainText('Row 8: last_played must be YYYY-MM-DD or blank.');
  await expect(page.locator('#import-errors')).toContainText('Row 9: setup must be light, medium, or heavy.');

  const exported = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export shelf' }).click();
  const exportDownload = await exported;
  expect(exportDownload.suggestedFilename()).toBe('my-shelf.csv');
  const exportText = await downloadText(exportDownload);
  expect(exportText.split('\n')[0]).toBe('title,last_played,min_players,max_players,minutes,setup,tags,available');
  expect(exportText).toContain('Manual Marker 731,2024-02-29,1,6,55,medium,manual|co-op,true');
  expect(exportText).toContain('False Marker,2024-02-29,1,4,30,medium,strategy,false');
});

test('@claim:privacy-local only uses same-origin requests and browser storage', async ({ page }) => {
  const requests: { url: string; body: string }[] = [];
  await page.addInitScript(({ realKey }) => {
    localStorage.setItem(realKey, JSON.stringify({ games: [{ title: 'REAL PRIVATE MARKER 419' }], theme: 'light' }));
  }, { realKey: REAL_KEY });
  page.on('request', request => requests.push({ url: request.url(), body: request.postData() ?? '' }));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add one game' }).click();
  await page.getByLabel('Title').fill('MANUAL PRIVATE MARKER 419');
  await page.getByLabel('Minutes').fill('45');
  await page.getByRole('button', { name: 'Add to shelf' }).click();
  await page.locator('#csv-file').setInputFiles({
    name: 'private-marker.csv', mimeType: 'text/csv',
    buffer: Buffer.from('title,min_players,max_players,minutes,setup,tags,available\nCSV PRIVATE MARKER 419,1,4,30,light,secret,true'),
  });
  await expect(page.getByRole('heading', { name: 'CSV PRIVATE MARKER 419' })).toBeVisible();
  await page.getByRole('button', { name: 'Use dark theme' }).click();
  await page.locator('#players').fill('3');
  await page.locator('#players').dispatchEvent('change');
  await page.getByRole('button', { name: /make my picklist/i }).click();
  await page.getByRole('button', { name: /save picklist/i }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export shelf' }).click();
  expect(await downloadText(await download)).toContain('MANUAL PRIVATE MARKER 419');
  const stored = await page.evaluate(({ demoKey, realKey }) => ({
    keys: Object.keys(localStorage).sort(),
    demo: JSON.parse(localStorage.getItem(demoKey) ?? '{}'),
    real: localStorage.getItem(realKey),
  }), { demoKey: DEMO_KEY, realKey: REAL_KEY });
  expect(stored.keys).toEqual([DEMO_KEY, REAL_KEY].sort());
  expect(Object.keys(stored.demo).sort()).toEqual(['games', 'savedRotations', 'theme', 'tonight']);
  expect(stored.demo.theme).toBe('dark');
  expect(stored.demo.tonight.players).toBe(3);
  expect(stored.real).toContain('REAL PRIVATE MARKER 419');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate(key => localStorage.getItem(key), DEMO_KEY)).not.toContain('PRIVATE MARKER 419');
  await page.getByRole('button', { name: 'Start for real' }).click();
  expect(await page.evaluate(key => localStorage.getItem(key), DEMO_KEY)).toBeNull();
  expect(await page.evaluate(key => localStorage.getItem(key), REAL_KEY)).toContain('REAL PRIVATE MARKER 419');

  expect(requests.every(({ url }) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  expect(requests.every(({ url, body }) => !`${url}\n${body}`.includes('PRIVATE MARKER 419'))).toBe(true);
  expect(requests.every(({ url }) => !/analytics|telemetry|collect/i.test(url))).toBe(true);
  expect(await page.locator('script[src^="http"], link[rel="stylesheet"][href^="http"]').count()).toBe(0);
});

test('@claim:no-remote-catalog fetches no catalog, ratings, prices, or third-party data', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: /make my picklist/i }).click();
  await page.getByRole('button', { name: /save picklist/i }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export shelf' }).click();
  await download;
  expect(requests.every((url) => {
    const parsed = new URL(url);
    return parsed.origin === 'http://127.0.0.1:4173' && !/catalog|rating|price/i.test(parsed.pathname);
  })).toBe(true);
});

test('@claim:saved-picklists retains ten saved picklists and prints on request', async ({ page }) => {
  await page.goto('/demo');
  await page.evaluate(() => { window.print = () => { document.body.dataset.printed = 'yes'; }; });
  for (let index = 0; index < 11; index += 1) await page.getByRole('button', { name: /save picklist/i }).click();
  await expect(page.locator('.saved-rotations summary')).toContainText('10');
  await page.getByRole('button', { name: 'Print picklist' }).click();
  await expect.poll(() => page.locator('body').getAttribute('data-printed')).toBe('yes');
});

test('@claim:free-no-account needs no sign-in or payment to use the sample', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('.pick-card')).toHaveCount(3);
  expect(await page.locator('input[type="password"], input[type="email"]').count()).toBe(0);
  expect(await page.getByText(/payment|subscribe|sign in/i).count()).toBe(0);
});

test('@claim:clear-local-data clears the real shelf without overstating other browser data', async ({ page }) => {
  await page.addInitScript(({ realKey, demoKey }) => {
    localStorage.setItem(realKey, JSON.stringify({ games: [{ title: 'Keep no more' }] }));
    localStorage.setItem(demoKey, JSON.stringify({ games: [{ title: 'Demo remains separate' }] }));
    sessionStorage.setItem('shelf-rotation-picklist:scroll:test', '120');
  }, { realKey: REAL_KEY, demoKey: DEMO_KEY });
  await page.goto('/privacy');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Clear shelf data' }).click();
  await expect(page.getByRole('button', { name: 'Shelf data cleared' })).toBeDisabled();
  expect(await page.evaluate(key => localStorage.getItem(key), REAL_KEY)).toBeNull();
  expect(await page.evaluate(key => localStorage.getItem(key), DEMO_KEY)).toContain('Demo remains separate');
  expect(await page.evaluate(() => sessionStorage.getItem('shelf-rotation-picklist:scroll:test'))).toBe('120');
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
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo');
  expect(await page.locator('.pick-card').first().evaluate((card) => parseFloat(getComputedStyle(card).animationDuration))).toBeLessThanOrEqual(0.00001);
  await page.goto('/');
  await expect(page.locator('.hero-action')).toHaveAttribute('href', '/?demo=1');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  const darkTheme = page.getByRole('button', { name: 'Use dark theme' });
  await darkTheme.hover();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await darkTheme.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const lightTheme = page.getByRole('button', { name: 'Use light theme' });
  await expect(lightTheme).toHaveText('Use light theme');
  expect(await lightTheme.evaluate((button) => getComputedStyle(button).fontSize)).not.toBe('0px');
  await lightTheme.hover();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await lightTheme.focus();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByLabel('Site').getByRole('link', { name: 'Privacy' }).click();
  const privacyHeading = page.getByRole('heading', { name: /your shelf stays/i });
  await expect(privacyHeading).toBeFocused();
  await expect(page.locator('#status-live')).toContainText('Opened Your shelf stays on your device');
  await page.getByLabel('Legal').getByRole('link', { name: 'Terms' }).click();
  const termsHeading = page.getByRole('heading', { name: 'Terms for Shelf Rotation Picklist' });
  await expect(termsHeading).toBeFocused();
  await expect(page.locator('#status-live')).toHaveText('Opened Terms for Shelf Rotation Picklist.');
  await page.goBack();
  await expect(privacyHeading).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('heading', { name: /pick neglected board games/i })).toBeFocused();
  await page.goForward();
  await expect(page.getByRole('heading', { name: /your shelf stays/i })).toBeFocused();
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'Terms for Shelf Rotation Picklist' })).toBeFocused();
  await page.goto('/');
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('mobile demo controls meet touch and route-restoration requirements', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  for (const name of ['Reset demo', 'Start for real']) {
    const box = await page.getByRole('button', { name }).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  }
  await page.goto('/');
  const sampleLink = page.locator('.empty-shelf').getByRole('link', { name: /try it with sample data/i });
  await expect(sampleLink).toHaveAttribute('href', '/?demo=1');
  const sampleBox = await sampleLink.boundingBox();
  expect(sampleBox?.height).toBeGreaterThanOrEqual(44);
  expect(sampleBox?.width).toBeGreaterThanOrEqual(44);
  await page.goto('/#tonight');
  await expect(page.getByRole('heading', { name: 'Set tonight’s limits' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
  const before = await page.evaluate(() => window.scrollY);
  await page.getByLabel('Site').getByRole('link', { name: 'Privacy' }).click();
  await expect(page.getByRole('heading', { name: /your shelf stays/i })).toBeVisible();
  await page.goBack();
  const tonight = page.getByRole('heading', { name: 'Set tonight’s limits' });
  await expect(tonight).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(before - 4);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(before - 4);
  expect((await tonight.boundingBox())?.y).toBeLessThan(180);
});

test('@claim:routing-metadata-and-provenance gives every page a route title and a useful 404', async ({ page }) => {
  const buildId = execFileSync('git', ['rev-parse', '--short=8', 'HEAD'], { encoding: 'utf8' }).trim();
  for (const route of [
    ['/', 'Shelf Rotation Picklist — pick board games tonight'],
    ['/demo', 'Demo — Shelf Rotation Picklist'],
    ['/privacy', 'Privacy — Shelf Rotation Picklist'],
    ['/terms', 'Terms — Shelf Rotation Picklist'],
  ]) {
    const response = await page.goto(route[0]);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(route[1]);
    expect((await page.title()).length).toBeLessThanOrEqual(60);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length).toBeGreaterThan(0);
    expect(description?.length).toBeLessThanOrEqual(155);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', route[1]);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', route[1]);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-shelf-1200x630\.jpg$/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${route[0] === '/' ? '/$' : `${route[0]}$`}`));
    await expect(page.getByLabel('Legal').getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    await expect(page.getByLabel('Legal').getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
    await expect(page.locator('.made-note')).toContainText(`build ${buildId}`);
    await expect(page.locator('.made-note')).not.toContainText('polish-1');
  }

  const missingResponse = await page.goto('/not-a-real-route');
  expect(missingResponse?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'This page does not exist' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /not-a-real-route$/);
  await expect(page.getByRole('link', { name: 'Go to the picker' })).toHaveAttribute('href', '/');
  await expect(page.locator('.made-note')).toContainText(`build ${buildId}`);
  expect((await new AxeBuilder({ page }).analyze()).violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);

  const touchIcon = await page.request.get('/apple-touch-icon.png');
  expect(touchIcon.status()).toBe(200);
  expect(touchIcon.headers()['content-type']).toContain('image/png');
  const png = await touchIcon.body();
  expect(png.readUInt32BE(16)).toBe(180);
  expect(png.readUInt32BE(20)).toBe(180);
  await page.goto('/');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('sizes', '180x180');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
  await page.goto('/sitemap.xml');
  await expect(page.locator('body')).toContainText('shelf-rotation-picklist.sociobot.in/demo');
});

test('desktop first screen shows the audience, action, next result, and all three facts', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const selector of ['.hero-lede', '.hero-action', '.action-note', '.proof-strip']) {
    const box = await page.locator(selector).boundingBox();
    expect(box, `${selector} should be rendered`).not.toBeNull();
    expect((box?.y ?? 901) + (box?.height ?? 0), `${selector} should fit above the fold`).toBeLessThanOrEqual(900);
  }
});
