import { describe, expect, it } from 'vitest';
import { gamesToCsv, parseCsv } from './csv';

describe('CSV import', () => {
  it('parses quoted titles, tags, and blank dates', () => {
    const result = parseCsv('title,last_played,min_players,max_players,minutes,setup,tags,available\n"Maps, Ink",,1,4,40,light,draw|co-op,true');
    expect(result.errors).toEqual([]);
    expect(result.games[0]).toMatchObject({ title: 'Maps, Ink', lastPlayed: null, tags: ['draw', 'co-op'], available: true });
  });

  it('reports row-level errors and keeps valid rows', () => {
    const result = parseCsv('title,min_players,max_players,minutes,setup\nBroken,4,2,0,huge\nGood,2,4,30,medium');
    expect(result.errors[0]).toContain('Row 2');
    expect(result.games).toHaveLength(1);
  });

  it('rejects impossible calendar dates instead of normalising them', () => {
    const result = parseCsv('title,last_played,min_players,max_players,minutes,setup\nNot Real,2026-02-30,2,4,30,medium\nLeap Error,2024-02-30,2,4,30,medium\nReal Leap,2024-02-29,2,4,30,medium');
    expect(result.games.map((game) => game.title)).toEqual(['Real Leap']);
    expect(result.errors).toEqual([
      'Row 2: last_played must be YYYY-MM-DD or blank.',
      'Row 3: last_played must be YYYY-MM-DD or blank.',
    ]);
  });

  it('skips and reports duplicate titles from the same import', () => {
    const result = parseCsv('title,min_players,max_players,minutes,setup\nSame,2,4,30,medium\nsame,1,4,40,light');
    expect(result.games.map((game) => game.title)).toEqual(['Same']);
    expect(result.errors).toEqual(['Row 3: title duplicates row 2 (case-insensitive).']);
  });

  it('round-trips exported games', () => {
    const first = parseCsv('title,min_players,max_players,minutes,setup\nGood,2,4,30,medium');
    expect(parseCsv(gamesToCsv(first.games)).games[0].title).toBe('Good');
  });

  it('accepts every documented availability value', () => {
    const result = parseCsv('title,min_players,max_players,minutes,setup,available\nTrue,1,4,30,light,true\nFalse,1,4,30,light,false\nYes,1,4,30,light,yes\nNo,1,4,30,light,no\nOne,1,4,30,light,1\nZero,1,4,30,light,0');
    expect(result.errors).toEqual([]);
    expect(result.games.map(game => game.available)).toEqual([true, false, true, false, true, false]);
  });
});
