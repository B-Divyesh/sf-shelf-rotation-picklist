import type { Exclusion, Game, Pick, ScoreBreakdown, Setup, Tonight } from './types';

export const setupRank: Record<Setup, number> = { light: 1, medium: 2, heavy: 3 };

export interface PickResult {
  picks: Pick[];
  exclusions: Exclusion[];
}

const DAY = 86_400_000;

export function monthsSince(date: string | null, now = new Date()): number | null {
  if (!date) return null;
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.max(0, Math.floor((now.getTime() - parsed.getTime()) / (DAY * 30.4375)));
}

export function exclusionReasons(game: Game, tonight: Tonight): string[] {
  const reasons: string[] = [];
  if (!game.available) reasons.push('marked unavailable tonight');
  if (tonight.players < game.minPlayers || tonight.players > game.maxPlayers) {
    reasons.push(`needs ${game.minPlayers}–${game.maxPlayers} players`);
  }
  if (game.minutes > tonight.maxMinutes) reasons.push(`${game.minutes} min exceeds the time limit`);
  if (setupRank[game.setup] > setupRank[tonight.maxSetup]) reasons.push(`${game.setup} setup exceeds the setup limit`);
  if (tonight.tag && !game.tags.some((tag) => tag.toLowerCase() === tonight.tag.toLowerCase())) {
    reasons.push(`does not have the “${tonight.tag}” tag`);
  }
  return reasons;
}

export function scoreGame(game: Game, now = new Date(), chosenTags: Set<string> = new Set()): ScoreBreakdown {
  const months = monthsSince(game.lastPlayed, now);
  const neverPlayed = game.lastPlayed ? 0 : 20;
  const neglect = game.lastPlayed ? Math.min(50, (months ?? 0) * 5) : 50;
  const ease = game.setup === 'light' ? 10 : game.setup === 'medium' ? 5 : 0;
  const variety = game.tags.some((tag) => !chosenTags.has(tag.toLowerCase())) ? 5 : 0;
  return { neglect, neverPlayed, ease, variety, total: neglect + neverPlayed + ease + variety };
}

export function explainPick(game: Game, score: ScoreBreakdown, now = new Date()): string[] {
  const reasons: string[] = [];
  const months = monthsSince(game.lastPlayed, now);
  if (!game.lastPlayed) reasons.push('Never played: +20');
  if (game.lastPlayed && months === 0) reasons.push('Played within the last month: +0 neglect');
  else reasons.push(`${game.lastPlayed ? `${months} months waiting` : 'Maximum neglect'}: +${score.neglect}`);
  if (score.ease) reasons.push(`${game.setup[0].toUpperCase()}${game.setup.slice(1)} setup: +${score.ease}`);
  if (score.variety) reasons.push(`Adds tag variety: +${score.variety}`);
  return reasons;
}

export function createPicklist(games: Game[], tonight: Tonight, now = new Date()): PickResult {
  const exclusions: Exclusion[] = [];
  const eligible: Game[] = [];

  for (const game of games) {
    const reasons = exclusionReasons(game, tonight);
    if (reasons.length) exclusions.push({ game, reasons });
    else eligible.push(game);
  }

  const chosenTags = new Set<string>();
  const picks: Pick[] = [];
  const remaining = [...eligible];
  while (picks.length < tonight.shortlistSize && remaining.length) {
    const scored = remaining
      .map((game) => ({ game, score: scoreGame(game, now, chosenTags) }))
      .sort((a, b) => b.score.total - a.score.total || a.game.title.localeCompare(b.game.title));
    const next = scored[0];
    picks.push({ game: next.game, score: next.score, reasons: explainPick(next.game, next.score, now) });
    next.game.tags.forEach((tag) => chosenTags.add(tag.toLowerCase()));
    remaining.splice(remaining.findIndex((game) => game.id === next.game.id), 1);
  }

  return { picks, exclusions };
}
