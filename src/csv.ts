import type { Game, Setup } from './types';

export interface CsvResult {
  games: Game[];
  errors: string[];
}

export const CSV_HEADER = 'title,last_played,min_players,max_players,minutes,setup,tags,available';

function parseRow(line: string): string[] {
  const cells: string[] = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(value.trim());
      value = '';
    } else value += char;
  }
  cells.push(value.trim());
  return cells;
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
}

export function parseCsv(text: string, now = new Date()): CsvResult {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.trim());
  if (!lines.length) return { games: [], errors: ['The CSV is empty.'] };
  const headers = parseRow(lines[0]).map((cell) => cell.toLowerCase().replaceAll(' ', '_'));
  const required = ['title', 'min_players', 'max_players', 'minutes', 'setup'];
  const missing = required.filter((name) => !headers.includes(name));
  if (missing.length) return { games: [], errors: [`Missing columns: ${missing.join(', ')}.`] };

  const games: Game[] = [];
  const errors: string[] = [];
  lines.slice(1).forEach((line, offset) => {
    const rowNumber = offset + 2;
    const values = parseRow(line);
    const get = (name: string) => values[headers.indexOf(name)]?.trim() ?? '';
    const title = get('title');
    const lastPlayedRaw = get('last_played');
    const minPlayers = Number(get('min_players'));
    const maxPlayers = Number(get('max_players'));
    const minutes = Number(get('minutes'));
    const setup = get('setup').toLowerCase() as Setup;
    const rowErrors: string[] = [];
    if (!title) rowErrors.push('title is blank');
    if (!Number.isInteger(minPlayers) || minPlayers < 1) rowErrors.push('min_players must be a positive whole number');
    if (!Number.isInteger(maxPlayers) || maxPlayers < minPlayers) rowErrors.push('max_players must be at least min_players');
    if (!Number.isInteger(minutes) || minutes < 1) rowErrors.push('minutes must be a positive whole number');
    if (!['light', 'medium', 'heavy'].includes(setup)) rowErrors.push('setup must be light, medium, or heavy');
    if (lastPlayedRaw && !validDate(lastPlayedRaw)) rowErrors.push('last_played must be YYYY-MM-DD or blank');
    if (lastPlayedRaw && new Date(`${lastPlayedRaw}T12:00:00`) > now) rowErrors.push('last_played cannot be in the future');
    if (rowErrors.length) {
      errors.push(`Row ${rowNumber}: ${rowErrors.join('; ')}.`);
      return;
    }
    games.push({
      id: crypto.randomUUID(),
      title,
      lastPlayed: lastPlayedRaw || null,
      minPlayers,
      maxPlayers,
      minutes,
      setup,
      tags: get('tags').split('|').map((tag) => tag.trim()).filter(Boolean),
      available: !['false', 'no', '0'].includes(get('available').toLowerCase()),
      createdAt: now.toISOString(),
    });
  });
  return { games, errors };
}

function escapeCell(value: string | number | boolean | null): string {
  const text = value === null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function gamesToCsv(games: Game[]): string {
  const rows = games.map((game) => [
    game.title,
    game.lastPlayed,
    game.minPlayers,
    game.maxPlayers,
    game.minutes,
    game.setup,
    game.tags.join('|'),
    game.available,
  ].map(escapeCell).join(','));
  return [CSV_HEADER, ...rows].join('\n');
}
