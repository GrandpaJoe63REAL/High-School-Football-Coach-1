
import React from 'react';
import { Prospect } from '../types';

interface RecruitingProps {
  prospects: Prospect[];
  points: number;
  onSpend: (id: string, points: number) => void;
}

const Recruiting: React.FC<RecruitingProps> = ({ prospects, points, onSpend }) => {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl flex justify-between items-center overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">Recruiting Trail</h2>
          <p className="text-indigo-100 text-sm">Focus your efforts on the local middle school stars.</p>
        </div>
        <div className="text-right relative z-10">
          <div className="text-4xl font-black">{points}</div>
          <div className="text-xs uppercase font-bold text-indigo-200">Weekly Points Left</div>
        </div>
        <i className="fa-solid fa-bullseye absolute -right-4 -bottom-4 text-8xl text-indigo-500/30 rotate-12"></i>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prospects.map(prospect => (
          <div key={prospect.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-indigo-500/50 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-lg">{prospect.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-slate-900 px-2 py-0.5 rounded text-indigo-400">{prospect.position}</span>
                  <div className="flex text-yellow-500 text-[10px]">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fa-solid fa-star ${i < prospect.stars ? '' : 'text-slate-600'}`}></i>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-400">{prospect.interest}%</div>
                <div className="text-[10px] uppercase text-slate-500 font-black">Interest</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Potential: {prospect.potential}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  disabled={points < 10}
                  onClick={() => onSpend(prospect.id, 10)}
                  className="bg-slate-700 hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-slate-700 text-white py-2 rounded-lg text-xs font-bold transition-colors"
                >
                  Visit (10 pts)
                </button>
                <button 
                  disabled={points < 25}
                  onClick={() => onSpend(prospect.id, 25)}
                  className="bg-slate-700 hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-slate-700 text-white py-2 rounded-lg text-xs font-bold transition-colors"
                >
                  Offer (25 pts)
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recruiting;
