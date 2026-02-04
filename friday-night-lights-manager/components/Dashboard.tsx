
import React from 'react';
import { Team, Game } from '../types';

interface DashboardProps {
  team: Team;
  schedule: Game[];
  currentWeek: number;
  news: string;
}

const Dashboard: React.FC<DashboardProps> = ({ team, schedule, currentWeek }) => {
  const nextGame = schedule.find(g => !g.played && (g.homeTeamId === team.id || g.awayTeamId === team.id));
  const recentGames = schedule.filter(g => g.played && (g.homeTeamId === team.id || g.awayTeamId === team.id)).slice(-3).reverse();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Team Info Card */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
        <h3 className="text-slate-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
          <i className="fa-solid fa-school text-indigo-500"></i> Program Status
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-3xl font-black text-white">{team.name}</div>
              <div className="text-sm text-slate-400">{team.mascot}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-indigo-400">{team.wins}-{team.losses}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Season Record</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase">Prestige</div>
              <div className="text-xl font-bold">{team.prestige}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase">Budget</div>
              <div className="text-xl font-bold text-emerald-400">${team.budget.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Matchup */}
      <div className="bg-indigo-900/20 rounded-2xl p-6 border border-indigo-500/30 shadow-xl backdrop-blur-sm">
        <h3 className="text-indigo-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
          <i className="fa-solid fa-football text-indigo-400"></i> Next Game
        </h3>
        {nextGame ? (
          <div className="flex flex-col items-center justify-center h-full pb-4">
            <div className="flex items-center gap-6 mb-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2">VS</div>
                <div className="text-sm font-bold uppercase tracking-tighter">Week {nextGame.week}</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">Upcoming Rivalry</div>
              <div className="text-sm text-slate-400">Scouting report indicates a strong offensive line.</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 italic">No games remaining this season.</div>
        )}
      </div>

      {/* Recent Performance */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl lg:col-span-1">
        <h3 className="text-slate-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
          <i className="fa-solid fa-history text-indigo-500"></i> Recent Results
        </h3>
        <div className="space-y-3">
          {recentGames.length > 0 ? recentGames.map(g => {
            const isHome = g.homeTeamId === team.id;
            const userScore = isHome ? g.homeScore : g.awayScore;
            const oppScore = isHome ? g.awayScore : g.homeScore;
            const won = userScore > oppScore;
            return (
              <div key={g.id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-black ${won ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {won ? 'W' : 'L'}
                  </div>
                  <div className="text-sm font-bold">Week {g.week}</div>
                </div>
                <div className="text-sm font-mono font-bold">
                  {userScore} - {oppScore}
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-8 text-slate-500 italic">No games played yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
