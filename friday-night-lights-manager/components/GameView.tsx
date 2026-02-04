
import React from 'react';
import { Game, Team } from '../types';

interface GameViewProps {
  game: Game;
  teams: Team[];
  onClose: () => void;
}

const GameView: React.FC<GameViewProps> = ({ game, teams, onClose }) => {
  const home = teams.find(t => t.id === game.homeTeamId)!;
  const away = teams.find(t => t.id === game.awayTeamId)!;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
            <i className="fa-solid fa-times text-xl"></i>
          </button>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-center w-1/3">
              <div className="text-4xl font-black mb-1">{game.homeScore}</div>
              <div className="text-sm font-bold uppercase tracking-widest text-indigo-200">{home.name}</div>
            </div>
            <div className="text-center w-1/3 flex flex-col items-center">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200 mb-2">Final</div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-black">VS</div>
              <div className="text-[10px] font-bold uppercase text-indigo-200 mt-2">Week {game.week}</div>
            </div>
            <div className="text-center w-1/3">
              <div className="text-4xl font-black mb-1">{game.awayScore}</div>
              <div className="text-sm font-bold uppercase tracking-widest text-indigo-200">{away.name}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
               <i className="fa-solid fa-list-check"></i> Play-by-Play Summary
            </h3>
            <div className="space-y-4">
              {game.log.map((entry, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded bg-slate-700 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    Q{Math.min(4, idx + 1)}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{entry}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
               <i className="fa-solid fa-chart-simple"></i> Team Comparison
            </h3>
            <div className="space-y-4">
              <StatRow label="Offense Rating" homeVal={home.offenseRating} awayVal={away.offenseRating} />
              <StatRow label="Defense Rating" homeVal={home.defenseRating} awayVal={away.defenseRating} />
              <StatRow label="Program Prestige" homeVal={home.prestige} awayVal={away.prestige} />
            </div>
          </section>
        </div>

        <div className="p-4 bg-slate-900/50 border-t border-slate-700 text-center">
          <button 
            onClick={onClose}
            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ label, homeVal, awayVal }: { label: string, homeVal: number, awayVal: number }) => (
  <div>
    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-1">
      <span>{homeVal}</span>
      <span>{label}</span>
      <span>{awayVal}</span>
    </div>
    <div className="flex h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
      <div 
        className="bg-indigo-500 h-full border-r border-slate-900" 
        style={{ width: `${(homeVal / (homeVal + awayVal)) * 100}%` }}
      ></div>
      <div 
        className="bg-slate-600 h-full" 
        style={{ width: `${(awayVal / (homeVal + awayVal)) * 100}%` }}
      ></div>
    </div>
  </div>
);

export default GameView;
