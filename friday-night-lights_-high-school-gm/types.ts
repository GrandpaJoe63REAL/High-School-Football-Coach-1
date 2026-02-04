
export enum Position {
  QB = 'QB',
  RB = 'RB',
  WR = 'WR',
  TE = 'TE',
  OL = 'OL',
  DL = 'DL',
  LB = 'LB',
  DB = 'DB',
  K = 'K'
}

export enum Grade {
  Freshman = 9,
  Sophomore = 10,
  Junior = 11,
  Senior = 12
}

export interface PlayerStats {
  passingYards: number;
  passingTds: number;
  rushingYards: number;
  rushingTds: number;
  receptions: number;
  receivingYards: number;
  receivingTds: number;
  tackles: number;
  sacks: number;
  ints: number;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: Position;
  grade: Grade;
  rating: number; // Current OVR
  potential: number; // Potential peak OVR
  speed: number;
  strength: number;
  iq: number;
  academics: number; // GPA scale 0.0 - 4.0
  morale: number; // 0-100
  discipline: number; // 0-100
  stats: PlayerStats;
  ineligible?: boolean;
}

export enum Scheme {
  SPREAD = 'Spread',
  WING_T = 'Wing-T',
  PRO_STYLE = 'Pro-Style',
  AIR_RAID = 'Air Raid',
  TRIPLE_OPTION = 'Triple Option'
}

export enum DefenseScheme {
  D_43 = '4-3 Base',
  D_34 = '3-4 Base',
  D_335 = '3-3-5 Stack',
  D_425 = '4-2-5'
}

export interface School {
  id: string;
  name: string;
  mascot: string;
  prestige: number; // 1-100
  facilities: number; // 1-100
  wins: number;
  losses: number;
  scheme: Scheme;
  defenseScheme: DefenseScheme;
  isUser: boolean;
  roster: Player[];
}

export interface GameResult {
  homeId: string;
  awayId: string;
  homeScore: number;
  awayScore: number;
  week: number;
  isCompleted: boolean;
  playByPlay: string[];
}

export enum SeasonPhase {
  PRESEASON = 'Preseason',
  REGULAR_SEASON = 'Regular Season',
  POSTSEASON = 'Postseason',
  OFFSEASON = 'Offseason'
}

export interface SeasonState {
  year: number;
  week: number;
  phase: SeasonPhase;
}
