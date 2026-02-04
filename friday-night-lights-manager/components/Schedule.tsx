
import React from 'react';
import { Game, Team } from '../types';

interface ScheduleProps {
  schedule: Game[];
  teams: Team[];
  userTeamId: string;
  onOpenGame: (id: string) => void;
}

const Schedule: React.FC<ScheduleProps> = ({ schedule, teams, userTeamId, onOpenGame }) => {
  const userSchedule = schedule.filter(g => g.homeTeamId === userTeamId || g.awayTeamId === userTeamId);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black uppercase tracking-tight">Full Season Schedule</h2>
      <div className="grid grid-cols-1 gap-3">
        {userSchedule.map(game => {
          const home = teams.find(t => t.id === game.homeTeamId)!;
          const away = teams.find(t => t.id === game.awayTeamId)!;
          const isHome = game.homeTeamId === userTeamId;
          const opponent = isHome ? away : home;
          
          return (
            <div 
              key={game.id} 
              onClick={() => game.played && onOpenGame(game.id)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${game.played ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 cursor-pointer' : 'bg-slate-900/50 border-slate-800'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center font-black text-slate-300">
                  W{game.week}
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase">{isHome ? 'Home' : 'Away'} vs</div>
                  <div className="font-bold text-lg">{opponent.name} {opponent.mascot}</div>
                </div>
              </div>

              {game.played ? (
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className={`text-xl font-black ${(isHome ? game.homeScore > game.awayScore : game.awayScore > game.homeScore) ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isHome ? `${game.homeScore} - ${game.awayScore}` : `${game.awayScore} - ${game.homeScore}`}
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Final Score</div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-slate-600"></i>
                </div>
              ) : (
                <div className="bg-slate-800 px-3 py-1 rounded text-xs font-bold text-slate-500 uppercase">
                  Upcoming
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;
