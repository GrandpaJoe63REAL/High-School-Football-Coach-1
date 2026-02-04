
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Users, 
  Settings, 
  BarChart3, 
  Play, 
  GraduationCap, 
  Calendar,
  ChevronRight,
  ChevronLeft,
  Search,
  School as SchoolIcon,
  ShieldAlert,
  Dumbbell
} from 'lucide-react';
// Added Scheme and DefenseScheme to the imports from types.ts
import { School, Player, SeasonState, SeasonPhase, GameResult, Grade, Position, Scheme, DefenseScheme } from './types';
import { generateWorld } from './utils/generation';
import { simulateGame } from './utils/gameEngine';

// --- Sub-components ---

const SidebarItem: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-semibold">{label}</span>
  </button>
);

const StatCard: React.FC<{ label: string; value: string | number; subValue?: string; icon: React.ElementType }> = ({ label, value, subValue, icon: Icon }) => (
  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</span>
      <Icon size={18} className="text-indigo-400" />
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    {subValue && <div className="text-indigo-400 text-sm font-medium">{subValue}</div>}
  </div>
);

// --- Main App ---

const App: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [season, setSeason] = useState<SeasonState>({ year: 2024, week: 1, phase: SeasonPhase.REGULAR_SEASON });
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [games, setGames] = useState<GameResult[]>([]);
  const [news, setNews] = useState<string[]>(["Welcome to the new season, Coach! Your squad is ready to work."]);

  // Initialization
  useEffect(() => {
    const world = generateWorld();
    setSchools(world);
  }, []);

  const userTeam = useMemo(() => schools.find(s => s.isUser), [schools]);
  
  const handleAdvanceWeek = () => {
    if (season.week >= 10) {
      // End season logic
      setNews(prev => ["Season is over. Congratulations on your effort!", ...prev]);
      return;
    }

    // Simulate all games for the week
    const weeklyResults: GameResult[] = [];
    const pairedSchools = [...schools];
    while (pairedSchools.length > 1) {
      const h = pairedSchools.shift()!;
      const a = pairedSchools.pop()!;
      const res = simulateGame(h, a, season.week);
      weeklyResults.push(res);
      
      // Update school records
      setSchools(current => current.map(s => {
        if (s.id === res.homeId) return { ...s, wins: s.wins + (res.homeScore > res.awayScore ? 1 : 0), losses: s.losses + (res.homeScore < res.awayScore ? 1 : 0) };
        if (s.id === res.awayId) return { ...s, wins: s.wins + (res.awayScore > res.homeScore ? 1 : 0), losses: s.losses + (res.awayScore < res.homeScore ? 1 : 0) };
        return s;
      }));
    }

    setGames(prev => [...prev, ...weeklyResults]);
    setSeason(prev => ({ ...prev, week: prev.week + 1 }));
    setNews(prev => [`Week ${season.week} complete. Your team record updated.`, ...prev]);
  };

  const renderContent = () => {
    if (!userTeam) return <div className="flex items-center justify-center h-full">Loading Program...</div>;

    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Record" value={`${userTeam.wins}-${userTeam.losses}`} subValue="Conference North" icon={Trophy} />
              <StatCard label="Prestige" value={userTeam.prestige} subValue="B+ National Ranking" icon={BarChart3} />
              <StatCard label="Facilities" value={userTeam.facilities} subValue="Level 2 Weight Room" icon={Dumbbell} />
              <StatCard label="Academic Health" value="3.1 GPA" subValue="1 Ineligible Player" icon={ShieldAlert} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                  <h3 className="font-bold flex items-center gap-2"><Calendar size={18} className="text-indigo-400" /> Season Timeline</h3>
                  <button 
                    onClick={handleAdvanceWeek}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                  >
                    <Play size={14} fill="currentColor" /> Advance Week {season.week}
                  </button>
                </div>
                <div className="p-0">
                  {games.filter(g => g.homeId === userTeam.id || g.awayId === userTeam.id).length === 0 ? (
                    <div className="p-10 text-center text-slate-500">No games played yet. Click Advance to begin.</div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                        <tr>
                          <th className="px-6 py-3">Week</th>
                          <th className="px-6 py-3">Opponent</th>
                          <th className="px-6 py-3">Result</th>
                          <th className="px-6 py-3">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {games.filter(g => g.homeId === userTeam.id || g.awayId === userTeam.id).map((g, i) => {
                          const isHome = g.homeId === userTeam.id;
                          const opponent = schools.find(s => s.id === (isHome ? g.awayId : g.homeId))?.name;
                          const won = isHome ? g.homeScore > g.awayScore : g.awayScore > g.homeScore;
                          return (
                            <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                              <td className="px-6 py-4 font-mono text-indigo-400">{g.week}</td>
                              <td className="px-6 py-4 font-semibold">{opponent}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${won ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                  {won ? 'W' : 'L'}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-mono">{g.homeScore} - {g.awayScore}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col">
                <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                  <h3 className="font-bold flex items-center gap-2 text-rose-400"><ShieldAlert size={18} /> Scouting Report</h3>
                </div>
                <div className="p-4 flex-1 space-y-4 overflow-y-auto max-h-[400px]">
                  {news.map((item, i) => (
                    <div key={i} className="flex gap-3 text-sm border-l-2 border-indigo-500 pl-3 py-1">
                      <div className="text-slate-100">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'Roster':
        return (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
             <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg w-full sm:w-64">
                  <Search size={16} className="text-slate-500" />
                  <input type="text" placeholder="Search athletes..." className="bg-transparent border-none text-sm focus:ring-0 w-full" />
                </div>
                <div className="flex gap-2">
                  <button className="text-xs font-bold bg-slate-700 px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition-colors">Depth Chart</button>
                  <button className="text-xs font-bold bg-slate-700 px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition-colors">Scheme Fit</button>
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-tighter">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Pos</th>
                      <th className="px-6 py-4">Grade</th>
                      <th className="px-6 py-4">OVR</th>
                      <th className="px-6 py-4">POT</th>
                      <th className="px-6 py-4">GPA</th>
                      <th className="px-6 py-4">Morale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {userTeam.roster.sort((a,b) => b.rating - a.rating).map(player => (
                      <tr key={player.id} className="hover:bg-indigo-600/5 transition-colors cursor-pointer group">
                        <td className="px-6 py-4 flex flex-col">
                          <span className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{player.firstName} {player.lastName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-700 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded">{player.position}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">{player.grade}th</td>
                        <td className="px-6 py-4">
                          <div className={`text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-slate-700 ${player.rating > 80 ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                            {player.rating}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-indigo-400">{player.potential}</td>
                        <td className={`px-6 py-4 text-sm font-bold ${player.academics < 2.0 ? 'text-rose-500 animate-pulse' : 'text-slate-300'}`}>
                          {player.academics.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                           <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${player.morale}%` }}></div>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>
        );
      case 'Program':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><Settings className="text-indigo-400" /> Offensive Identity</h3>
              <div className="space-y-3">
                {Object.values(Scheme).map(scheme => (
                  <button 
                    key={scheme} 
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${userTeam.scheme === scheme ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-slate-600'}`}
                  >
                    <div className="font-bold">{scheme}</div>
                    <div className="text-xs text-slate-400">Optimal for {scheme === 'Spread' ? 'High Speed WRs' : 'Power OL and RBs'}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><ShieldAlert className="text-rose-400" /> Defensive Scheme</h3>
              <div className="space-y-3">
                {Object.values(DefenseScheme).map(scheme => (
                  <button 
                    key={scheme} 
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${userTeam.defenseScheme === scheme ? 'border-rose-500 bg-rose-500/10' : 'border-slate-700 hover:border-slate-600'}`}
                  >
                    <div className="font-bold">{scheme}</div>
                    <div className="text-xs text-slate-400">Balanced coverage and pass rush containment.</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return <div className="p-10 text-center text-slate-500">Coming soon in next update...</div>;
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Trophy className="text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tighter leading-none">FRIDAY NIGHT</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">High School GM</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem icon={BarChart3} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
          <SidebarItem icon={Users} label="Roster" active={activeTab === 'Roster'} onClick={() => setActiveTab('Roster')} />
          <SidebarItem icon={GraduationCap} label="Recruiting" active={activeTab === 'Recruiting'} onClick={() => setActiveTab('Recruiting')} />
          <SidebarItem icon={Settings} label="Program" active={activeTab === 'Program'} onClick={() => setActiveTab('Program')} />
          <SidebarItem icon={Trophy} label="Standings" active={activeTab === 'Standings'} onClick={() => setActiveTab('Standings')} />
        </nav>

        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
            <SchoolIcon size={14} /> ACTIVE SCHOOL
          </div>
          <p className="font-bold text-slate-100 truncate">{userTeam?.name || 'Generating...'}</p>
          <p className="text-[10px] text-indigo-400 font-mono mt-1">EST. {season.year}</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">{activeTab}</h2>
            <p className="text-slate-400 text-sm font-medium">Season {season.year} • Week {season.week}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-500 uppercase">Booster Mood</p>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div className="h-full bg-emerald-500 w-3/4"></div>
                </div>
                <span className="text-xs font-bold text-emerald-400 uppercase">Strong</span>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Users size={18} />
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
