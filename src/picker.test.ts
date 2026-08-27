import { describe, expect, it } from 'vitest';
import { createPicklist, exclusionReasons, scoreGame } from './picker';
import type { Game, Tonight } from './types';

const now = new Date('2026-08-27T12:00:00Z');
const base: Game = {
  id: '1', title: 'Old Game', lastPlayed: '2025-08-27', minPlayers: 1, maxPlayers: 4,
  minutes: 45, setup: 'light', tags: ['cards'], available: true, createdAt: now.toISOString(),
};
const tonight: Tonight = { players: 2, maxMinutes: 90, maxSetup: 'medium', tag: '', shortlistSize: 3 };

describe('transparent picker', () => {
  it('rewards neglect, never played games, and easy setup', () => {
    expect(scoreGame(base, now).total).toBe(65);
    expect(scoreGame({ ...base, lastPlayed: null }, now).total).toBe(85);
  });

  it('hard-filters unavailable and incompatible games with reasons', () => {
    const reasons = exclusionReasons({ ...base, available: false, minPlayers: 3, minutes: 120, setup: 'heavy' }, tonight);
    expect(reasons).toEqual([
      'marked unavailable tonight', 'needs 3–4 players', '120 min exceeds the time limit', 'heavy setup exceeds the setup limit',
    ]);
  });

  it('returns requested count in deterministic score order', () => {
    const games = [base, { ...base, id: '2', title: 'Never', lastPlayed: null }, { ...base, id: '3', title: 'Recent', lastPlayed: '2026-08-20' }];
    expect(createPicklist(games, { ...tonight, shortlistSize: 2 }, now).picks.map((pick) => pick.game.title)).toEqual(['Never', 'Old Game']);
  });
});
