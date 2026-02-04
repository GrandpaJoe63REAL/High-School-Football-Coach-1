
export enum SeasonPhase {
  OFFSEASON = 'OFFSEASON',
  PRESEASON = 'PRESEASON',
  REGULAR_SEASON = 'REGULAR_SEASON',
  PLAYOFFS = 'PLAYOFFS',
  GRADUATION = 'GRADUATION'
}

export enum Position {
  QB = 'QB',
  RB = 'RB',
  WR = 'WR',
  TE = 'TE',
  OL = 'OL',
  DL = 'DL',
  LB = 'LB',
  CB = 'CB',
  S = 'S',
  K = 'K'
}

export interface Player {
  id: string;
  name: string;
  grade: number; // 9, 10, 11, 12
  position: Position;
  overall: number;
  potential: number;
  workEthic: number;
  stats: {
    passingYds: number;
    passingTDs: number;
    rushingYds: number;
    rushingTDs: number;
    tackles: number;
    ints: number;
  };
  academics: number; // 0-100
  behavior: number; // 0-100
  morale: number; // 0-100
}

export interface Team {
  id: string;
  name: string;
  mascot: string;
  prestige: number;
  roster: Player[];
  wins: number;
  losses: number;
  isUser: boolean;
  budget: number;
  offenseRating: number;
  defenseRating: number;
}

export interface Game {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  week: number;
  played: boolean;
  log: string[];
}

export interface Prospect {
  id: string;
  name: string;
  position: Position;
  potential: number;
  stars: number;
  interest: number; // 0-100
}
