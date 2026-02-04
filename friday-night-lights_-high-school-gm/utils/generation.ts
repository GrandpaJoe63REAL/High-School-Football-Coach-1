
import { Player, Position, Grade, School, Scheme, DefenseScheme, PlayerStats } from '../types';
import { FIRST_NAMES, LAST_NAMES, SCHOOL_NAMES, MASCOTS } from '../constants';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
const randomChoice = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generatePlayer = (grade: Grade, baseRating: number = 50): Player => {
  const id = Math.random().toString(36).substr(2, 9);
  const position = randomChoice(Object.values(Position));
  const rating = Math.min(99, Math.max(40, baseRating + randomInt(-10, 15)));
  const potential = Math.min(99, rating + randomInt(5, 30));
  
  return {
    id,
    firstName: randomChoice(FIRST_NAMES),
    lastName: randomChoice(LAST_NAMES),
    position,
    grade,
    rating,
    potential,
    speed: randomInt(40, 99),
    strength: randomInt(40, 99),
    iq: randomInt(40, 99),
    academics: parseFloat((Math.random() * (4.0 - 1.5) + 1.5).toFixed(2)),
    morale: 80,
    discipline: 80,
    stats: {
      passingYards: 0, passingTds: 0, rushingYards: 0, rushingTds: 0,
      receptions: 0, receivingYards: 0, receivingTds: 0,
      tackles: 0, sacks: 0, ints: 0
    }
  };
};

export const generateSchool = (name: string, isUser: boolean = false): School => {
  const id = Math.random().toString(36).substr(2, 9);
  const prestige = isUser ? 30 : randomInt(20, 80);
  const roster: Player[] = [];

  // Generate a balanced roster
  const counts = {
    [Position.QB]: 2, [Position.RB]: 3, [Position.WR]: 5, [Position.TE]: 2,
    [Position.OL]: 8, [Position.DL]: 6, [Position.LB]: 5, [Position.DB]: 6, [Position.K]: 1
  };

  Object.entries(counts).forEach(([pos, count]) => {
    for (let i = 0; i < count; i++) {
      const p = generatePlayer(randomChoice([Grade.Freshman, Grade.Sophomore, Grade.Junior, Grade.Senior]), prestige);
      p.position = pos as Position;
      roster.push(p);
    }
  });

  return {
    id,
    name,
    mascot: randomChoice(MASCOTS),
    prestige,
    facilities: randomInt(10, 50),
    wins: 0,
    losses: 0,
    scheme: randomChoice(Object.values(Scheme)),
    defenseScheme: randomChoice(Object.values(DefenseScheme)),
    isUser,
    roster
  };
};

export const generateWorld = () => {
  const schools: School[] = SCHOOL_NAMES.map((name, idx) => generateSchool(name, idx === 0));
  return schools;
};
