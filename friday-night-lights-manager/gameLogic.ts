
import { Player, Position, Team, Game, SeasonPhase, Prospect } from './types';

const FIRST_NAMES = ["James", "Robert", "John", "Michael", "David", "William", "Richard", "Joseph", "Thomas", "Christopher", "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kenneth", "Kevin", "Brian", "George", "Timothy", "Ronald", "Edward", "Jason", "Jeffrey", "Gary", "Ryan", "Nicholas", "Eric", "Stephen", "Jacob", "Larry", "Frank", "Scott", "Justin", "Brandon", "Raymond", "Gregory", "Samuel", "Benjamin", "Patrick", "Jack", "Alexander", "Dennis", "Jerry", "Tyler"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"];

const SCHOOLS = [
  { name: "Westside", mascot: "Wolverines" },
  { name: "Central", mascot: "Eagles" },
  { name: "Eastview", mascot: "Titans" },
  { name: "Lakeside", mascot: "Lions" },
  { name: "Mountain", mascot: "Rams" },
  { name: "Valley", mascot: "Vikings" },
  { name: "North", mascot: "Stars" },
  { name: "South", mascot: "Bulls" },
];

export const generatePlayer = (grade: number = 9, starLevel: number = 3): Player => {
  const baseRating = 40 + (grade - 9) * 5 + (starLevel * 5);
  const potential = 50 + Math.random() * 40;
  const positions = Object.values(Position);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
    grade,
    position: positions[Math.floor(Math.random() * positions.length)],
    overall: Math.min(99, baseRating + Math.floor(Math.random() * 10)),
    potential,
    workEthic: Math.floor(Math.random() * 100),
    academics: 60 + Math.floor(Math.random() * 40),
    behavior: 70 + Math.floor(Math.random() * 30),
    morale: 80,
    stats: {
      passingYds: 0,
      passingTDs: 0,
      rushingYds: 0,
      rushingTDs: 0,
      tackles: 0,
      ints: 0
    }
  };
};

export const generateTeams = (): Team[] => {
  return SCHOOLS.map((s, idx) => {
    const roster: Player[] = [];
    for (let i = 0; i < 35; i++) {
      roster.push(generatePlayer(9 + Math.floor(Math.random() * 4), 1 + Math.floor(Math.random() * 4)));
    }
    return {
      id: idx.toString(),
      name: s.name,
      mascot: s.mascot,
      prestige: 50,
      roster,
      wins: 0,
      losses: 0,
      isUser: idx === 0,
      budget: 10000,
      offenseRating: calculateUnitRating(roster, 'offense'),
      defenseRating: calculateUnitRating(roster, 'defense'),
    };
  });
};

const calculateUnitRating = (roster: Player[], unit: 'offense' | 'defense'): number => {
  const offensivePos = [Position.QB, Position.RB, Position.WR, Position.TE, Position.OL];
  const defensivePos = [Position.DL, Position.LB, Position.CB, Position.S];
  const targets = unit === 'offense' ? offensivePos : defensivePos;
  const filtered = roster.filter(p => targets.includes(p.position));
  if (filtered.length === 0) return 40;
  return Math.floor(filtered.reduce((sum, p) => sum + p.overall, 0) / filtered.length);
};

export const generateSchedule = (teams: Team[]): Game[] => {
  const games: Game[] = [];
  const numWeeks = 8;
  let gameIdCounter = 0;

  for (let w = 1; w <= numWeeks; w++) {
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffled.length; i += 2) {
      if (shuffled[i] && shuffled[i+1]) {
        games.push({
          id: (gameIdCounter++).toString(),
          homeTeamId: shuffled[i].id,
          awayTeamId: shuffled[i+1].id,
          homeScore: 0,
          awayScore: 0,
          week: w,
          played: false,
          log: []
        });
      }
    }
  }
  return games;
};

export const simulateGame = (game: Game, teams: Team[]): Game => {
  const home = teams.find(t => t.id === game.homeTeamId)!;
  const away = teams.find(t => t.id === game.awayTeamId)!;

  const homePower = (home.offenseRating + home.defenseRating) / 2 + 3; // Home field advantage
  const awayPower = (away.offenseRating + away.defenseRating) / 2;
  
  const homeScore = Math.floor(Math.max(0, (homePower - awayPower) / 2 + 21 + (Math.random() * 21 - 10)));
  const awayScore = Math.floor(Math.max(0, (awayPower - homePower) / 2 + 21 + (Math.random() * 21 - 10)));

  return {
    ...game,
    homeScore,
    awayScore,
    played: true,
    log: [
      `Kickoff! ${away.name} receives at their own 20.`,
      `The game is a hard-fought battle in the trenches.`,
      `${homeScore > awayScore ? home.name : away.name} takes control in the 4th quarter.`,
      `Final Score: ${home.name} ${homeScore}, ${away.name} ${awayScore}`
    ]
  };
};

export const runProgression = (teams: Team[]): Team[] => {
  return teams.map(team => {
    const updatedRoster = team.roster.map(player => {
      // Logic for progression: higher potential and work ethic = more growth
      const growthFactor = (player.potential - player.overall) * (player.workEthic / 100) * 0.15;
      const noise = Math.random() * 2;
      return {
        ...player,
        overall: Math.min(99, player.overall + Math.max(-1, Math.floor(growthFactor + noise)))
      };
    });

    return {
      ...team,
      roster: updatedRoster,
      offenseRating: calculateUnitRating(updatedRoster, 'offense'),
      defenseRating: calculateUnitRating(updatedRoster, 'defense'),
    };
  });
};

export const handleGraduation = (teams: Team[]): Team[] => {
  return teams.map(team => {
    // Players age up
    const newRoster = team.roster
      .map(p => ({ ...p, grade: p.grade + 1 }))
      .filter(p => p.grade <= 12); // Seniors graduate

    // Add new freshmen to maintain roster size
    while (newRoster.length < 35) {
      newRoster.push(generatePlayer(9, 1 + Math.floor(Math.random() * 3)));
    }

    return {
      ...team,
      roster: newRoster,
      wins: 0,
      losses: 0,
      offenseRating: calculateUnitRating(newRoster, 'offense'),
      defenseRating: calculateUnitRating(newRoster, 'defense'),
    };
  });
};

export const generateProspects = (count: number): Prospect[] => {
  const prospects: Prospect[] = [];
  for (let i = 0; i < count; i++) {
    const positions = Object.values(Position);
    prospects.push({
      id: Math.random().toString(36).substr(2, 9),
      name: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
      position: positions[Math.floor(Math.random() * positions.length)],
      stars: 1 + Math.floor(Math.random() * 5),
      potential: 60 + Math.floor(Math.random() * 35),
      interest: 10 + Math.floor(Math.random() * 40)
    });
  }
  return prospects;
};
