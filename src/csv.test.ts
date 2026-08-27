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

  it('round-trips exported games', () => {
    const first = parseCsv('title,min_players,max_players,minutes,setup\nGood,2,4,30,medium');
    expect(parseCsv(gamesToCsv(first.games)).games[0].title).toBe('Good');
  });
});
