
import { School, GameResult, Player, Position } from '../types';

export const simulateGame = (home: School, away: School, week: number): GameResult => {
  const playByPlay: string[] = [];
  
  // Calculate power ratings
  const getTeamRating = (s: School) => s.roster.reduce((acc, p) => acc + p.rating, 0) / s.roster.length;
  const homePower = getTeamRating(home) + 3; // Home field advantage
  const awayPower = getTeamRating(away);

  // Score simulation logic
  const homeScore = Math.max(0, Math.floor(homePower / 3 + Math.random() * 21));
  const awayScore = Math.max(0, Math.floor(awayPower / 3 + Math.random() * 21));

  playByPlay.push(`Kickoff at ${home.name} Stadium!`);
  playByPlay.push(`Weather is clear. A great night for high school football.`);
  
  // Simple narrative injection
  const starPlayers = (s: School) => s.roster.sort((a, b) => b.rating - a.rating).slice(0, 2);
  const hStars = starPlayers(home);
  const aStars = starPlayers(away);

  playByPlay.push(`Scouts are here watching ${hStars[0].firstName} ${hStars[0].lastName} (${home.name}).`);
  playByPlay.push(`${aStars[0].firstName} ${aStars[0].lastName} is looking explosive for ${away.name}.`);

  if (homeScore > awayScore) {
    playByPlay.push(`The crowd erupts as the ${home.mascot} seal the victory!`);
  } else if (awayScore > homeScore) {
    playByPlay.push(`Silence falls over the home crowd as the ${away.mascot} take the win.`);
  } else {
    playByPlay.push(`An incredible battle ends in a draw.`);
  }

  return {
    homeId: home.id,
    awayId: away.id,
    homeScore,
    awayScore,
    week,
    isCompleted: true,
    playByPlay
  };
};
