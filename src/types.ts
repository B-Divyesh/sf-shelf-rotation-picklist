export type Setup = 'light' | 'medium' | 'heavy';

export interface Game {
  id: string;
  title: string;
  lastPlayed: string | null;
  minPlayers: number;
  maxPlayers: number;
  minutes: number;
  setup: Setup;
  tags: string[];
  available: boolean;
  createdAt: string;
}

export interface Tonight {
  players: number;
  maxMinutes: number;
  maxSetup: Setup;
  tag: string;
  shortlistSize: number;
}

export interface ScoreBreakdown {
  neglect: number;
  neverPlayed: number;
  ease: number;
  variety: number;
  total: number;
}

export interface Pick {
  game: Game;
  score: ScoreBreakdown;
  reasons: string[];
}

export interface Exclusion {
  game: Game;
  reasons: string[];
}

export interface Rotation {
  id: string;
  createdAt: string;
  tonight: Tonight;
  picks: Pick[];
}

export interface AppData {
  games: Game[];
  savedRotations: Rotation[];
  tonight: Tonight;
  theme: 'light' | 'dark';
}
