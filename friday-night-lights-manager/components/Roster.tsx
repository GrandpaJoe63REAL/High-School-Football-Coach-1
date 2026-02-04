
import React, { useState } from 'react';
import { Player, Position } from '../types';

interface RosterProps {
  roster: Player[];
}

const Roster: React.FC<RosterProps> = ({ roster }) => {
  const [filter, setFilter] = useState<Position | 'ALL'>('ALL');

  const filteredRoster = filter === 'ALL' ? roster : roster.filter(p => p.position === filter);
  const sortedRoster = [...filteredRoster].sort((a, b) => b.overall - a.overall);

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex flex-wrap gap-2">
        <FilterButton active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="All" />
        {Object.values(Position).map(pos => (
          // Fixed: FilterButton now accepts key prop correctly via React.FC typing
          <FilterButton key={pos} active={filter === pos} onClick={() => setFilter(pos)} label={pos} />
        ))}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Player</th>
              <th className="px-6 py-4">Pos</th>
              <th className="px-6 py-4">Grade</th>
              <th className="px-6 py-4 text-center">OVR</th>
              <th className="px-6 py-4 text-center">POT</th>
              <th className="px-6 py-4 text-center">ACAD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {sortedRoster.map(player => (
              <tr key={player.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-100">{player.name}</div>
                  <div className="text-xs text-slate-500 italic">Work Ethic: {player.workEthic}%</div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-slate-900 px-2 py-1 rounded text-xs font-mono font-bold text-indigo-400">
                    {player.position}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {player.grade === 9 ? 'FR' : player.grade === 10 ? 'SO' : player.grade === 11 ? 'JR' : 'SR'}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-lg font-black ${player.overall >= 80 ? 'text-emerald-400' : player.overall >= 70 ? 'text-yellow-400' : 'text-slate-300'}`}>
                    {player.overall}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm text-slate-500 font-bold">
                  {player.potential}
                </td>
                <td className="px-6 py-4 text-center">
                   <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${player.academics > 80 ? 'bg-emerald-500' : player.academics > 65 ? 'bg-yellow-500' : 'bg-rose-500'}`} style={{ width: `${player.academics}%` }}></div>
                   </div>
                   <div className="text-[10px] font-bold mt-1 uppercase text-slate-500">{player.academics}%</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* Added React.FC typing to resolve TypeScript error on 'key' property usage in Roster component loop */
const FilterButton: React.FC<{ active: boolean, onClick: () => void, label: string }> = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${active ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
  >
    {label}
  </button>
);

export default Roster;
