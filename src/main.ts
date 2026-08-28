import './styles.css';
import { CSV_HEADER, gamesToCsv, parseCsv } from './csv';
import { createPicklist, monthsSince } from './picker';
import type { AppData, Game, Pick, Rotation, Setup, Tonight } from './types';

const REAL_STORAGE_KEY = 'shelf-rotation-picklist:v1';
const DEMO_STORAGE_KEY = 'demo:shelf-rotation-picklist:v1';
const SITE_URL = 'https://shelf-rotation-picklist.sociobot.in';
const defaultTonight: Tonight = { players: 2, maxMinutes: 90, maxSetup: 'medium', tag: '', shortlistSize: 3 };
const defaultData: AppData = { games: [], savedRotations: [], tonight: defaultTonight, theme: 'light' };
const app = document.querySelector<HTMLDivElement>('#app')!;
let demoMode = window.location.pathname.replace(/\/$/, '') === '/demo' || new URLSearchParams(window.location.search).get('demo') === '1';

function storageKey(): string { return demoMode ? DEMO_STORAGE_KEY : REAL_STORAGE_KEY; }

function sampleData(): AppData {
  const now = new Date().toISOString();
  const games = [
    ['Cardboard Cartographers', null, 1, 4, 35, 'light', ['draw', 'quiet']],
    ['Orbital Orchard', '2025-10-12', 2, 4, 75, 'medium', ['strategy', 'space']],
    ['Lantern Keepers', '2026-07-30', 2, 5, 45, 'light', ['co-op', 'family']],
    ['Moss & Mortar', '2024-11-08', 3, 5, 110, 'heavy', ['strategy', 'build']],
    ['Pocket Tides', null, 1, 2, 20, 'light', ['cards', 'quick']],
  ].map(([title, lastPlayed, minPlayers, maxPlayers, minutes, setup, sampleTags]) => ({ id: crypto.randomUUID(), title: String(title), lastPlayed: lastPlayed as string | null, minPlayers: Number(minPlayers), maxPlayers: Number(maxPlayers), minutes: Number(minutes), setup: setup as Setup, tags: sampleTags as string[], available: true, createdAt: now }));
  return { ...structuredClone(defaultData), games };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] ?? char);
}

function loadData(): AppData {
  try {
    const value = localStorage.getItem(storageKey());
    if (!value) return demoMode ? sampleData() : structuredClone(defaultData);
    const parsed = JSON.parse(value) as Partial<AppData>;
    return {
      games: Array.isArray(parsed.games) ? parsed.games : [],
      savedRotations: Array.isArray(parsed.savedRotations) ? parsed.savedRotations.slice(0, 10) : [],
      tonight: { ...defaultTonight, ...parsed.tonight },
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
    };
  } catch {
    return structuredClone(defaultData);
  }
}

let data = loadData();
let initialDemoResult = demoMode ? createPicklist(data.games, data.tonight) : undefined;
let currentPicks: Pick[] = initialDemoResult?.picks ?? [];
let currentExclusionCount = initialDemoResult?.exclusions.length ?? 0;
let search = '';

function persist(message?: string): void {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(data));
    if (message) announce(message);
  } catch {
    announce('Your change could not be saved. Browser storage may be full or disabled.', true);
  }
}

function announce(message: string, error = false): void {
  const region = document.querySelector<HTMLElement>('#status-live');
  if (!region) return;
  region.textContent = message;
  region.classList.toggle('is-error', error);
}

function tags(): string[] {
  return [...new Set(data.games.flatMap((game) => game.tags.map((tag) => tag.trim())).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

function formatDate(value: string | null): string {
  if (!value) return 'Never played';
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

function download(content: string, filename: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function setRouteMeta(title: string, description: string, path: string): void {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) document.querySelector(selector)?.setAttribute('content', title);
  for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) document.querySelector(selector)?.setAttribute('content', description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${SITE_URL}${path}`);
}

function header(): string {
  return `<header class="site-header compact"><a class="brand" href="/" aria-label="Shelf Rotation Picklist home">SRP<span>///</span></a><nav class="site-nav" aria-label="Site"><a href="/demo">Demo</a><a href="/#shelf">Shelf</a><a href="/#tonight">Tonight</a><a href="/privacy">Privacy</a></nav><button class="theme-label" id="theme-toggle" type="button">${data.theme === 'light' ? 'Dark theme' : 'Light theme'}</button></header>`;
}

function renderLegal(kind: 'privacy' | 'terms'): void {
  const privacy = kind === 'privacy';
  setRouteMeta(`${privacy ? 'Privacy' : 'Terms'} — Shelf Rotation Picklist`, privacy ? 'Learn what Shelf Rotation Picklist stores in your browser.' : 'Read the terms for Shelf Rotation Picklist.', `/${kind}`);
  app.innerHTML = `
    ${header()}
    <main id="main" class="legal-shell">
      <p class="eyebrow">Plain-language policy · 27 August 2026</p>
      <h1 tabindex="-1">${privacy ? 'Your shelf stays on your device.' : 'Terms for Shelf Rotation Picklist'}</h1>
      ${privacy ? `
        <section><h2>What is stored</h2><p>Your game shelf, tonight’s limits, theme, and saved picklists stay in this browser. We do not receive them.</p></section>
        <section><h2>What leaves your device</h2><p>Games you add, import, and rank are not uploaded. There are no accounts, analytics, or remote game catalog requests.</p></section>
        <section><h2>Your control</h2><div><p>Export your shelf as CSV at any time. Clearing local data permanently removes this product’s saved browser data. Clearing browser storage does the same.</p><button class="button secondary legal-clear" id="clear-local-data" type="button">Clear local data</button></div></section>
        <section><h2>Contact</h2><p>For privacy questions, email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></section>` : `
        <section><h2>The tool</h2><p>Shelf Rotation Picklist is free. It ranks games from the shelf data and limits you provide. Your group makes the final choice.</p></section>
        <section><h2>Your data</h2><p>You are responsible for the collection data you enter or import. Do not upload material you do not have permission to use. The product does not scrape or provide third-party game catalog data.</p></section>
        <section><h2>No warranty</h2><p>The software is provided “as is” without warranties. To the extent permitted by law, Sociobot is not liable for losses resulting from use of the tool.</p></section>
        <section><h2>Open source</h2><p>The source is offered under the MIT License. These terms do not remove rights granted by that license.</p></section>`}
    </main>
    ${footer()}`;
  document.querySelector('#clear-local-data')?.addEventListener('click', () => {
    if (!window.confirm('Delete your shelf, saved picklists, and picker settings from this browser? This cannot be undone.')) return;
    localStorage.removeItem(REAL_STORAGE_KEY);
    const button = document.querySelector<HTMLButtonElement>('#clear-local-data');
    if (button) { button.disabled = true; button.textContent = 'Local data cleared'; }
  });
}

function footer(): string {
  return `<footer class="site-footer"><p><strong>Shelf Rotation Picklist</strong><br><span>Pick neglected board games for tonight.</span></p><nav aria-label="Legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav><p class="made-note">Built by Param Factory · build ${import.meta.env.VITE_BUILD_ID ?? 'polish-1'}<br><a href="https://github.com/B-Divyesh/sf-shelf-rotation-picklist">MIT source</a></p></footer>`;
}

function renderApp(): void {
  document.documentElement.dataset.theme = data.theme;
  setRouteMeta(demoMode ? 'Demo — Shelf Rotation Picklist' : 'Shelf Rotation Picklist — pick board games tonight', demoMode ? 'Try a sample board-game picklist without saving data.' : 'Pick neglected board games that fit tonight’s players, time, and setup.', demoMode ? '/demo' : '/');
  const allTags = tags();
  app.innerHTML = `
    <div id="offline-banner" class="offline-banner" role="status" hidden>Offline mode — your shelf and picker still work.</div>
    ${demoMode ? `<div class="demo-banner"><strong>Demo — sample data, nothing is saved</strong><span><button class="text-button" id="reset-demo" type="button">Reset demo</button><button class="text-button" id="start-real" type="button">Start for real</button></span></div>` : ''}
    ${header()}
    <main id="main">
      ${demoMode ? `<section class="demo-results station" aria-labelledby="demo-title"><header class="station-heading"><p class="station-number">SAMPLE / READY</p><div><h1 id="demo-title" tabindex="-1">Sample board-game picklist</h1><p>Five sample games are ranked for two players, 90 minutes, and medium setup.</p></div></header><h2 class="sr-only">Sample picks</h2><div id="results" class="results" aria-live="polite">${resultsContent()}</div></section>` : `<section class="hero" id="top" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">A picklist for tonight</p>
          <h1 id="hero-title" tabindex="-1">Pick neglected <mark>board games</mark> for tonight</h1>
          <p class="hero-lede">For board-game collectors choosing from a crowded shelf, get 3–5 picks that fit tonight’s players, time, and setup.</p>
          <a class="button primary hero-action" href="/demo">Try it with sample data <span aria-hidden="true">→</span></a><p class="action-note">See five games ranked by tonight’s limits.</p>
          <ul class="proof-strip" aria-label="Product facts"><li>Free</li><li>Works offline after the first visit</li><li>Shelf data stays in this browser</li></ul>
        </div>
        <figure class="hero-art">
          <picture>
            <source media="(max-width: 900px)" srcset="/assets/hero-shelf-760.avif" type="image/avif">
            <source media="(max-width: 900px)" srcset="/assets/hero-shelf-760.webp" type="image/webp">
            <source srcset="/assets/hero-shelf-1200.avif" type="image/avif">
            <source srcset="/assets/hero-shelf-1200.webp" type="image/webp">
            <img src="/assets/hero-shelf-1200.jpg" width="1200" height="800" alt="Unbranded cardboard game boxes rotate out of a small shelf onto a fluorescent paper picklist." fetchpriority="high" decoding="async">
          </picture>
          <figcaption><span>FIG. 01</span> Games rise by the published score.</figcaption>
        </figure>
      </section>`}

      <section class="station" id="shelf" aria-labelledby="shelf-title">
        <header class="station-heading"><p class="station-number">01 / SHELF</p><div><h2 id="shelf-title">Add your board games</h2><p>Add games one at a time or import a CSV. Add only games you want to rotate.</p></div></header>
        <div class="tool-row">
          <button class="button primary" id="open-game-dialog" type="button">+ Add one game</button>
          <label class="button secondary file-button" for="csv-file">Import CSV<input id="csv-file" type="file" accept=".csv,text/csv"></label>
          <button class="text-button" id="download-template" type="button">Download template</button>
          ${data.games.length ? `<button class="text-button" id="export-shelf" type="button">Export shelf</button>` : ''}
        </div>
        <div id="import-errors" class="notice error-notice" role="alert" tabindex="-1" hidden></div>
        ${shelfContent()}
      </section>

      <section class="station tonight-station" id="tonight" aria-labelledby="tonight-title">
        <header class="station-heading"><p class="station-number">02 / TONIGHT</p><div><h2 id="tonight-title">Set tonight’s limits</h2><p>Games outside your limits are excluded. Limits do not change points.</p></div></header>
        <form id="tonight-form" class="constraint-grid">
          <label><span>Players</span><input id="players" name="players" type="number" min="1" max="20" inputmode="numeric" value="${data.tonight.players}" required></label>
          <label><span>Time ceiling</span><span class="input-suffix"><input id="max-minutes" name="maxMinutes" type="number" min="10" max="600" step="5" inputmode="numeric" value="${data.tonight.maxMinutes}" required><i>min</i></span></label>
          <label><span>Most setup</span><select id="max-setup" name="maxSetup"><option value="light" ${data.tonight.maxSetup === 'light' ? 'selected' : ''}>Light only</option><option value="medium" ${data.tonight.maxSetup === 'medium' ? 'selected' : ''}>Up to medium</option><option value="heavy" ${data.tonight.maxSetup === 'heavy' ? 'selected' : ''}>Any setup</option></select></label>
          <label><span>Must-have tag</span><select id="tag" name="tag"><option value="">Any tag</option>${allTags.map((tag) => `<option value="${escapeHtml(tag)}" ${data.tonight.tag === tag ? 'selected' : ''}>${escapeHtml(tag)}</option>`).join('')}</select></label>
          <fieldset><legend>List size</legend><div class="segmented">${[3, 4, 5].map((size) => `<label><input type="radio" name="shortlistSize" value="${size}" ${data.tonight.shortlistSize === size ? 'checked' : ''}><span>${size}</span></label>`).join('')}</div></fieldset>
        </form>
        <div class="scoring-rule"><p><strong>THE RULE</strong> Picks score up to 85 points: neglect 50 + never played 20 + easy setup 10 + tag variety 5.</p><button class="text-button" id="open-score-dialog" type="button">See scoring details →</button></div>
      </section>

      <section class="station rotation-station" id="rotation" aria-labelledby="rotation-title">
        <header class="station-heading"><p class="station-number">03 / PICKLIST</p><div><h2 id="rotation-title" tabindex="-1">Generate tonight’s picklist</h2><p>Games are ranked by the published score. Your group makes the final choice.</p></div></header>
        <button class="button generate" id="generate" type="button" ${data.games.length ? '' : 'disabled'}>Make my picklist <span aria-hidden="true">→</span></button>
        ${demoMode ? '' : `<div id="results" class="results" aria-live="polite">${resultsContent()}</div>`}
        ${savedContent()}
      </section>
      <section class="station privacy-station" aria-labelledby="privacy-title"><header class="station-heading"><p class="station-number">PRIVATE / CLEAR</p><div><h2 id="privacy-title">What stays private</h2><p>Shelf data stays in this browser. CSV files and game details are not uploaded.</p></div></header><div class="boundary-grid"><p><strong>Export or clear</strong><br>Export your shelf as CSV. Clear all real data from the Privacy page.</p><p><strong>No remote catalog</strong><br>This tool does not fetch game ratings, prices, or catalog data.</p><p><strong>No account</strong><br>Use the picker without signing in.</p></div></section>
    </main>
    ${footer()}
    ${gameDialog()}
    ${scoreDialog()}
    <p id="status-live" class="sr-only sr-status" aria-live="polite" aria-atomic="true"></p>`;
  bindEvents();
  updateOnlineState();
}

function shelfContent(): string {
  if (!data.games.length) return `
    <div class="empty-shelf">
      <div class="empty-stamp" aria-hidden="true">0<br><span>BOXES</span></div>
      <div><h3>No games added.</h3><p>Add a board game or try a ready-made sample picklist.</p><a class="text-button" href="/demo">Try it with sample data →</a></div>
    </div>`;
  return `
    <div class="shelf-toolbar"><label for="shelf-search">Find a game</label><input id="shelf-search" type="search" value="${escapeHtml(search)}" placeholder="Search ${data.games.length} games"><span>${data.games.filter((game) => game.available).length}/${data.games.length} available tonight</span></div>
    <ul class="game-list">${gameListContent()}</ul>`;
}

function gameListContent(): string {
  const filtered = data.games.filter((game) => game.title.toLowerCase().includes(search.toLowerCase()));
  return filtered.length ? filtered.map(gameRow).join('') : `<li class="no-match">No game matches “${escapeHtml(search)}”.</li>`;
}

function gameRow(game: Game): string {
  const months = monthsSince(game.lastPlayed);
  return `<li class="game-row" data-id="${game.id}">
    <label class="availability"><input class="availability-input" type="checkbox" ${game.available ? 'checked' : ''}><span aria-hidden="true"></span><b>${game.available ? 'IN' : 'OUT'}</b><em class="sr-only">${escapeHtml(game.title)} is ${game.available ? 'available' : 'unavailable'} tonight</em></label>
    <div class="game-title"><h3>${escapeHtml(game.title)}</h3><p>${escapeHtml(game.tags.join(' · ') || 'untagged')}</p></div>
    <dl><div><dt>Players</dt><dd>${game.minPlayers}–${game.maxPlayers}</dd></div><div><dt>Time</dt><dd>${game.minutes} min</dd></div><div><dt>Setup</dt><dd>${game.setup}</dd></div><div><dt>Last played</dt><dd>${formatDate(game.lastPlayed)}${months !== null ? ` <small>(${months}mo)</small>` : ''}</dd></div></dl>
    <button class="row-delete icon-button" type="button" aria-label="Remove ${escapeHtml(game.title)}">×</button>
  </li>`;
}

function resultsContent(): string {
  if (!currentPicks.length) return `<div class="empty-results"><p aria-hidden="true">[&nbsp;&nbsp;&nbsp;]</p><h3>No picklist yet.</h3><span>${data.games.length ? 'Set tonight’s limits, then make the picklist.' : 'Add at least one shelf game to begin.'}</span></div>`;
  return `
    <p class="result-notice">Picklist ready with ${currentPicks.length} pick${currentPicks.length === 1 ? '' : 's'}.</p>
    <div class="result-summary"><p><strong>${currentPicks.length} picks</strong> · ${currentExclusionCount} excluded by tonight’s limits</p><div><button class="button secondary" id="save-rotation" type="button">Save picklist</button><button class="text-button" id="print-rotation" type="button">Print / PDF</button></div></div>
    <ol class="pick-list">${currentPicks.map(pickCard).join('')}</ol>`;
}

function pickCard(pick: Pick, index: number): string {
  return `<li class="pick-card pick-card--${index + 1}"><span class="pick-index">0${index + 1}</span><div class="pick-main"><div class="pick-heading"><div><p>${pick.game.minPlayers}–${pick.game.maxPlayers}P · ${pick.game.minutes} MIN · ${pick.game.setup.toUpperCase()} SETUP</p><h3>${escapeHtml(pick.game.title)}</h3></div><strong class="score"><span>${pick.score.total}</span>/85</strong></div><ul class="reason-list">${pick.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join('')}</ul>${pick.game.tags.length ? `<p class="pick-tags">${pick.game.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</p>` : ''}</div></li>`;
}

function savedContent(): string {
  if (!data.savedRotations.length) return '';
  return `<details class="saved-rotations"><summary>Saved picklists <span>${data.savedRotations.length}</span></summary><div>${data.savedRotations.map((rotation) => `<article><p><strong>${new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(rotation.createdAt))}</strong><br>${rotation.tonight.players} players · ${rotation.tonight.maxMinutes} min</p><ol>${rotation.picks.map((pick) => `<li>${escapeHtml(pick.game.title)}</li>`).join('')}</ol><button class="text-button delete-rotation" data-id="${rotation.id}" type="button">Delete saved picklist</button></article>`).join('')}</div></details>`;
}

function gameDialog(): string {
  return `<dialog id="game-dialog" aria-labelledby="game-dialog-title"><form id="game-form" method="dialog"><header><p class="eyebrow">Game details</p><h2 id="game-dialog-title">Add a game</h2><button class="dialog-close icon-button" value="cancel" formmethod="dialog" aria-label="Close">×</button></header><div class="form-grid">
    <label class="full"><span>Title</span><input name="title" type="text" maxlength="100" autocomplete="off" required autofocus></label>
    <label><span>Last played <small>(blank = never)</small></span><input name="lastPlayed" type="date" max="${new Date().toISOString().slice(0, 10)}"></label>
    <label><span>Minutes</span><input name="minutes" type="number" min="1" max="600" inputmode="numeric" required></label>
    <label><span>Minimum players</span><input name="minPlayers" type="number" min="1" max="20" value="1" inputmode="numeric" required></label>
    <label><span>Maximum players</span><input name="maxPlayers" type="number" min="1" max="20" value="4" inputmode="numeric" required></label>
    <label><span>Setup</span><select name="setup"><option value="light">Light · under 5 min</option><option value="medium">Medium · 5–15 min</option><option value="heavy">Heavy · over 15 min</option></select></label>
    <label><span>Tags <small>(separate with commas)</small></span><input name="tags" type="text" maxlength="160" placeholder="co-op, cards"></label>
    <label class="check-row full"><input name="available" type="checkbox" checked><span>Available tonight</span></label>
  </div><p id="game-form-error" class="form-error" role="alert"></p><footer><button class="button secondary" value="cancel" formmethod="dialog">Cancel</button><button class="button primary" type="submit">Add to shelf</button></footer></form></dialog>`;
}

function scoreDialog(): string {
  return `<dialog id="score-dialog" aria-labelledby="score-dialog-title"><article><header><p class="eyebrow">Published scoring</p><h2 id="score-dialog-title">How the score works</h2><button class="dialog-close icon-button" aria-label="Close scoring dialog">×</button></header><div class="score-table" role="table" aria-label="Scoring rules"><div role="row"><strong role="cell">Neglect</strong><span role="cell">+5 per full month since played, capped at +50</span></div><div role="row"><strong role="cell">Never played</strong><span role="cell">+20 on top of maximum neglect</span></div><div role="row"><strong role="cell">Setup ease</strong><span role="cell">Light +10 · medium +5 · heavy +0</span></div><div role="row"><strong role="cell">Tag variety</strong><span role="cell">+5 if a pick introduces a tag not already in the picklist</span></div></div><p>Availability, players, time, setup limit, and must-have tag exclude games. They do not alter points. Ties are alphabetical, so results repeat.</p><button class="button primary dialog-done">Close scoring details</button></article></dialog>`;
}

function bindEvents(): void {
  document.querySelector('#reset-demo')?.addEventListener('click', () => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    data = sampleData();
    const result = createPicklist(data.games, data.tonight);
    currentPicks = result.picks;
    currentExclusionCount = result.exclusions.length;
    persist('Demo reset.');
    renderApp();
  });
  document.querySelector('#start-real')?.addEventListener('click', () => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    navigate('/');
  });
  document.querySelector('#open-game-dialog')?.addEventListener('click', () => (document.querySelector<HTMLDialogElement>('#game-dialog'))?.showModal());
  document.querySelector('#open-score-dialog')?.addEventListener('click', () => (document.querySelector<HTMLDialogElement>('#score-dialog'))?.showModal());
  document.querySelectorAll<HTMLButtonElement>('#score-dialog .dialog-close, #score-dialog .dialog-done').forEach((button) => button.addEventListener('click', () => document.querySelector<HTMLDialogElement>('#score-dialog')?.close()));
  document.querySelectorAll<HTMLDialogElement>('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }));
  document.querySelector('#game-form')?.addEventListener('submit', addGame);
  document.querySelector('#download-template')?.addEventListener('click', () => download(`${CSV_HEADER}\nExample Game,2026-01-15,1,4,45,light,cards|co-op,true\nNever Played Game,,2,5,90,medium,strategy,true\n`, 'shelf-rotation-template.csv', 'text/csv'));
  document.querySelector('#export-shelf')?.addEventListener('click', () => download(gamesToCsv(data.games), 'my-shelf.csv', 'text/csv'));
  document.querySelector<HTMLInputElement>('#csv-file')?.addEventListener('change', importCsv);
  document.querySelector('#load-sample')?.addEventListener('click', loadSamples);
  document.querySelector<HTMLInputElement>('#shelf-search')?.addEventListener('input', (event) => { search = (event.currentTarget as HTMLInputElement).value; const list = document.querySelector('.game-list'); if (list) list.innerHTML = gameListContent(); bindGameRows(); });
  bindGameRows();
  document.querySelector('#tonight-form')?.addEventListener('change', updateTonight);
  document.querySelector('#generate')?.addEventListener('click', generateRotation);
  document.querySelector('#save-rotation')?.addEventListener('click', saveRotation);
  document.querySelector('#print-rotation')?.addEventListener('click', () => window.print());
  document.querySelectorAll<HTMLButtonElement>('.delete-rotation').forEach((button) => button.addEventListener('click', () => { data.savedRotations = data.savedRotations.filter((rotation) => rotation.id !== button.dataset.id); persist('Saved picklist deleted.'); renderApp(); }));
  window.addEventListener('online', updateOnlineState, { once: true });
  window.addEventListener('offline', updateOnlineState, { once: true });
}

function bindGameRows(): void {
  document.querySelectorAll<HTMLElement>('.game-row').forEach((row) => {
    row.querySelector<HTMLInputElement>('.availability-input')?.addEventListener('change', (event) => {
      const game = data.games.find((item) => item.id === row.dataset.id);
      if (!game) return;
      game.available = (event.currentTarget as HTMLInputElement).checked;
      currentPicks = [];
      persist(`${game.title} marked ${game.available ? 'available' : 'unavailable'} tonight.`);
      renderApp();
    });
    row.querySelector<HTMLButtonElement>('.row-delete')?.addEventListener('click', () => {
      const game = data.games.find((item) => item.id === row.dataset.id);
      if (!game || !window.confirm(`Remove “${game.title}” from this shelf?`)) return;
      data.games = data.games.filter((item) => item.id !== game.id);
      currentPicks = [];
      persist(`${game.title} removed.`);
      renderApp();
    });
  });
}

function addGame(event: Event): void {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const title = String(values.get('title')).trim();
  const titleInput = form.elements.namedItem('title') as HTMLInputElement;
  const error = document.querySelector('#game-form-error');
  if (!title) {
    if (error) error.textContent = 'Enter a game title, not only spaces.';
    titleInput.focus();
    return;
  }
  const minPlayers = Number(values.get('minPlayers'));
  const maxPlayers = Number(values.get('maxPlayers'));
  if (maxPlayers < minPlayers) { if (error) error.textContent = 'Maximum players must be at least the minimum.'; return; }
  if (data.games.some((game) => game.title.toLowerCase() === title.toLowerCase())) { if (error) error.textContent = 'A game with that title is already on the shelf.'; return; }
  data.games.push({ id: crypto.randomUUID(), title, lastPlayed: String(values.get('lastPlayed')) || null, minPlayers, maxPlayers, minutes: Number(values.get('minutes')), setup: String(values.get('setup')) as Setup, tags: String(values.get('tags')).split(',').map((tag) => tag.trim()).filter(Boolean), available: values.get('available') === 'on', createdAt: new Date().toISOString() });
  persist(`${title} added to the shelf.`);
  (document.querySelector<HTMLDialogElement>('#game-dialog'))?.close();
  renderApp();
}

function importCsv(event: Event): void {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  if (file.size > 2_000_000) { showImportErrors(['That file is over 2 MB. Split it into a smaller CSV and try again.']); return; }
  const reader = new FileReader();
  reader.onerror = () => showImportErrors(['The file could not be read. Save it as a UTF-8 CSV and try again.']);
  reader.onload = () => {
    const result = parseCsv(String(reader.result));
    const existing = new Set(data.games.map((game) => game.title.toLowerCase()));
    const unique = result.games.filter((game) => {
      const title = game.title.toLowerCase();
      if (existing.has(title)) return false;
      existing.add(title);
      return true;
    });
    const duplicates = result.games.length - unique.length;
    data.games.push(...unique);
    persist(`Imported ${unique.length} game${unique.length === 1 ? '' : 's'}${duplicates ? `; skipped ${duplicates} duplicate title${duplicates === 1 ? '' : 's'}` : ''}.`);
    renderApp();
    if (result.errors.length) showImportErrors(result.errors);
  };
  reader.readAsText(file);
}

function showImportErrors(errors: string[]): void {
  const notice = document.querySelector<HTMLElement>('#import-errors');
  if (!notice) return;
  notice.hidden = false;
  notice.innerHTML = `<strong>Some rows need attention</strong><ul>${errors.slice(0, 8).map((error) => `<li>${escapeHtml(error)}</li>`).join('')}</ul>${errors.length > 8 ? `<p>And ${errors.length - 8} more.</p>` : ''}`;
  notice.focus();
}

function loadSamples(): void {
  data = sampleData();
  persist('Five fictional sample games added.');
  renderApp();
}

function updateTonight(event: Event): void {
  const form = event.currentTarget as HTMLFormElement;
  const values = new FormData(form);
  data.tonight = { players: Number(values.get('players')), maxMinutes: Number(values.get('maxMinutes')), maxSetup: String(values.get('maxSetup')) as Setup, tag: String(values.get('tag')), shortlistSize: Number(values.get('shortlistSize')) };
  currentPicks = [];
  persist('Tonight’s limits updated. Generate a fresh picklist.');
  const results = document.querySelector('#results');
  if (results) results.innerHTML = resultsContent();
}

function generateRotation(): void {
  const form = document.querySelector<HTMLFormElement>('#tonight-form');
  if (!form?.reportValidity()) { announce('Check tonight’s player and time values.', true); return; }
  updateTonight({ currentTarget: form } as unknown as Event);
  const result = createPicklist(data.games, data.tonight);
  currentPicks = result.picks;
  currentExclusionCount = result.exclusions.length;
  const results = document.querySelector('#results');
  if (results) results.innerHTML = currentPicks.length ? resultsContent() : `<div class="notice no-eligible"><h3>Nothing fits all limits.</h3><p>${result.exclusions.length} game${result.exclusions.length === 1 ? '' : 's'} excluded. Loosen a hard limit or mark another game available.</p><details><summary>See exclusion reasons</summary><ul>${result.exclusions.slice(0, 10).map((item) => `<li><strong>${escapeHtml(item.game.title)}:</strong> ${escapeHtml(item.reasons.join('; '))}</li>`).join('')}</ul></details></div>`;
  bindResultEvents();
  document.querySelector<HTMLElement>('#rotation-title')?.focus({ preventScroll: true });
  document.querySelector('#results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  announce(currentPicks.length ? `Picklist ready with ${currentPicks.length} picks.` : 'No games fit all of tonight’s limits.');
}

function bindResultEvents(): void {
  document.querySelector('#save-rotation')?.addEventListener('click', saveRotation);
  document.querySelector('#print-rotation')?.addEventListener('click', () => window.print());
}

function saveRotation(): void {
  if (!currentPicks.length) return;
  const rotation: Rotation = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), tonight: structuredClone(data.tonight), picks: structuredClone(currentPicks) };
  data.savedRotations.unshift(rotation);
  data.savedRotations = data.savedRotations.slice(0, 10);
  persist('Picklist saved in this browser.');
  renderApp();
}

function updateOnlineState(): void {
  const banner = document.querySelector<HTMLElement>('#offline-banner');
  if (banner) banner.hidden = navigator.onLine;
}

function routePath(): string { return window.location.pathname.replace(/\/$/, '') || '/'; }

function renderRoute(moveFocus = false): void {
  const path = routePath();
  demoMode = path === '/demo' || new URLSearchParams(window.location.search).get('demo') === '1';
  data = loadData();
  const demoResult = demoMode ? createPicklist(data.games, data.tonight) : undefined;
  currentPicks = demoResult?.picks ?? [];
  currentExclusionCount = demoResult?.exclusions.length ?? 0;
  if (path === '/privacy' || path === '/terms') renderLegal(path.slice(1) as 'privacy' | 'terms');
  else if (path === '/' || path === '/demo') renderApp();
  else renderNotFound();
  bindRouteLinks();
  document.querySelector('#theme-toggle')?.addEventListener('click', () => { data.theme = data.theme === 'light' ? 'dark' : 'light'; persist(); renderRoute(); });
  if (moveFocus) requestAnimationFrame(() => {
    const heading = document.querySelector<HTMLElement>('main h1');
    heading?.focus();
    announce(`Opened ${heading?.textContent?.trim() ?? 'page'}.`);
  });
}

function renderNotFound(): void {
  setRouteMeta('Page not found — Shelf Rotation Picklist', 'This Shelf Rotation Picklist page does not exist.', window.location.pathname);
  app.innerHTML = `${header()}<main id="main" class="legal-shell not-found"><p class="eyebrow">404 / MISSING</p><h1 tabindex="-1">This page does not exist</h1><p>Return to the board-game picker and make a picklist.</p><a class="button primary" href="/">Go to the picker</a></main>${footer()}<p id="status-live" class="sr-only" aria-live="polite" aria-atomic="true"></p>`;
}

function navigate(url: string): void {
  window.history.pushState({}, '', url);
  renderRoute(true);
}

function bindRouteLinks(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => link.addEventListener('click', (event) => {
    const href = link.getAttribute('href') ?? '';
    if (!href.startsWith('/') || link.target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (href.startsWith('/#')) return;
    event.preventDefault();
    navigate(href);
  }));
}

window.addEventListener('popstate', () => renderRoute(true));
renderRoute();

if ('serviceWorker' in navigator && import.meta.env.PROD) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
