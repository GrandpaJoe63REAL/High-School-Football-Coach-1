
import React from 'react';
import { Team } from '../types';

interface OffseasonViewProps {
  teams: Team[];
  onAdvance: () => void;
}

const OffseasonView: React.FC<OffseasonViewProps> = ({ teams, onAdvance }) => {
  const userTeam = teams.find(t => t.isUser)!;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <div className="inline-block bg-indigo-600/20 text-indigo-400 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-500/20">
          Season Recap
        </div>
        <h2 className="text-5xl font-black tracking-tighter">Class of {new Date().getFullYear()} Graduates</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          The seniors have played their final down. Now we look to the underclassmen to step up and the incoming freshmen to carry the torch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
          <h3 className="text-sm font-black text-slate-500 uppercase mb-4 flex items-center gap-2">
            <i className="fa-solid fa-trophy text-yellow-500"></i> Final Standings
          </h3>
          <div className="space-y-2">
            {[...teams].sort((a, b) => b.wins - a.wins).map((t, idx) => (
              <div key={t.id} className={`flex justify-between items-center p-2 rounded ${t.isUser ? 'bg-indigo-600/20 border border-indigo-500/30' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500 w-4">{idx + 1}.</span>
                  <span className="font-bold text-sm">{t.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-400">{t.wins} - {t.losses}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col">
          <h3 className="text-sm font-black text-slate-500 uppercase mb-4 flex items-center gap-2">
            <i className="fa-solid fa-graduation-cap text-indigo-500"></i> Offseason Agenda
          </h3>
          <div className="flex-1 space-y-4">
             <div className="flex items-start gap-3">
                <i className="fa-solid fa-check-circle text-emerald-500 mt-1"></i>
                <div>
                  <div className="text-sm font-bold">Player Progression</div>
                  <p className="text-xs text-slate-500">Underclassmen have spent the spring in the weight room.</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <i className="fa-solid fa-check-circle text-emerald-500 mt-1"></i>
                <div>
                  <div className="text-sm font-bold">Graduation Ceremony</div>
                  <p className="text-xs text-slate-500">Seniors are moving on to college. Your prestige helps them get offers.</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <i className="fa-solid fa-circle text-indigo-500 mt-1"></i>
                <div>
                  <div className="text-sm font-bold">Incoming Freshmen</div>
                  <p className="text-xs text-slate-500">The local youth league is sending over a new crop of talent.</p>
                </div>
             </div>
          </div>
          <button 
            onClick={onAdvance}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-indigo-900/40"
          >
            Begin Training Camp
          </button>
        </div>
      </div>
    </div>
  );
};

export default OffseasonView;
