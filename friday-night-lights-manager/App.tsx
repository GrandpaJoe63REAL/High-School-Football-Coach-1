
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Team, Game, Player, SeasonPhase, Prospect } from './types';
import { 
  generateTeams, 
  generateSchedule, 
  simulateGame, 
  runProgression, 
  handleGraduation,
  generateProspects 
} from './gameLogic';

// UI Components
import Dashboard from './components/Dashboard';
import Roster from './components/Roster';
import Recruiting from './components/Recruiting';
import Schedule from './components/Schedule';
import GameView from './components/GameView';
import OffseasonView from './components/OffseasonView';

const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [schedule, setSchedule] = useState<Game[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [phase, setPhase] = useState<SeasonPhase>(SeasonPhase.REGULAR_SEASON);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roster' | 'recruiting' | 'schedule'>('dashboard');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [recruitingPoints, setRecruitingPoints] = useState(100);
  const [news, setNews] = useState<string>("Welcome to the season Coach! The community is excited for Friday night.");

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

  // Initialize Game
  useEffect(() => {
    const initialTeams = generateTeams();
    setTeams(initialTeams);
    setSchedule(generateSchedule(initialTeams));
    setProspects(generateProspects(20));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userTeam = teams.find(t => t.isUser);

  const generateNews = useCallback(async (gameResult?: string) => {
    try {
      const prompt = gameResult 
        ? `Write a one-sentence high school sports headline about this result: ${gameResult}. Be dramatic and focus on the school atmosphere.`
        : `Write a one-sentence teaser for the upcoming high school football season for ${userTeam?.name} ${userTeam?.mascot}.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setNews(response.text || "The lights are shining bright on the gridiron.");
    } catch (e) {
      setNews("The stadium is packed and the band is playing.");
    }
  }, [ai, userTeam]);

  const advanceWeek = useCallback(() => {
    const currentWeekGames = schedule.filter(g => g.week === currentWeek);
    const updatedSchedule = [...schedule];
    const updatedTeams = [...teams];

    currentWeekGames.forEach(game => {
      const simmed = simulateGame(game, updatedTeams);
      const homeTeam = updatedTeams.find(t => t.id === simmed.homeTeamId)!;
      const awayTeam = updatedTeams.find(t => t.id === simmed.awayTeamId)!;
      
      if (simmed.homeScore > simmed.awayScore) {
        homeTeam.wins++;
        awayTeam.losses++;
      } else {
        awayTeam.wins++;
        homeTeam.losses++;
      }

      const idx = updatedSchedule.findIndex(g => g.id === simmed.id);
      updatedSchedule[idx] = simmed;
    });

    setSchedule(updatedSchedule);
    setTeams(updatedTeams);

    const userGame = currentWeekGames.find(g => g.homeTeamId === userTeam?.id || g.awayTeamId === userTeam?.id);
    if (userGame) {
      const simResult = updatedSchedule.find(g => g.id === userGame.id);
      if (simResult) {
        generateNews(`${userTeam?.name} vs its opponent: ${simResult.homeScore} to ${simResult.awayScore}`);
      }
    }

    if (currentWeek < 8) {
      setCurrentWeek(prev => prev + 1);
      setRecruitingPoints(100);
    } else {
      setPhase(SeasonPhase.OFFSEASON);
    }
  }, [currentWeek, schedule, teams, userTeam, generateNews]);

  const advanceToNextSeason = useCallback(() => {
    const progressedTeams = runProgression(teams);
    const graduatedTeams = handleGraduation(progressedTeams);
    setTeams(graduatedTeams);
    setSchedule(generateSchedule(graduatedTeams));
    setCurrentWeek(1);
    setPhase(SeasonPhase.REGULAR_SEASON);
    setProspects(generateProspects(20));
    setActiveTab('dashboard');
  }, [teams]);

  const handleSpendPoints = (prospectId: string, points: number) => {
    if (recruitingPoints >= points) {
      setRecruitingPoints(prev => prev - points);
      setProspects(prev => prev.map(p => 
        p.id === prospectId ? { ...p, interest: Math.min(100, p.interest + (points / 2)) } : p
      ));
    }
  };

  if (!userTeam) return <div className="p-8 text-center">Loading School Program...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-2xl font-black">
              {userTeam.name[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold">{userTeam.name} {userTeam.mascot}</h1>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                {userTeam.wins}-{userTeam.losses} • Week {currentWeek} • {phase}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-indigo-400">OFF {userTeam.offenseRating} / DEF {userTeam.defenseRating}</div>
              <div className="text-xs text-slate-400">Prestige: {userTeam.prestige}</div>
            </div>
            {phase === SeasonPhase.REGULAR_SEASON && (
              <button 
                onClick={advanceWeek}
                className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-full font-bold transition-all shadow-lg shadow-indigo-900/40 flex items-center gap-2"
              >
                <i className="fa-solid fa-forward"></i>
                Sim Week
              </button>
            )}
            {phase === SeasonPhase.OFFSEASON && (
              <button 
                onClick={advanceToNextSeason}
                className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-full font-bold transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2"
              >
                <i className="fa-solid fa-calendar-plus"></i>
                New Season
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 overflow-hidden flex flex-col">
        {/* News Ticker */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 mb-6 flex items-center gap-3">
          <span className="bg-indigo-600 text-[10px] font-black uppercase px-2 py-0.5 rounded">Breaking</span>
          <p className="text-sm italic text-slate-300 truncate">{news}</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll pr-2">
          {phase === SeasonPhase.REGULAR_SEASON ? (
            <>
              {activeTab === 'dashboard' && <Dashboard team={userTeam} schedule={schedule} currentWeek={currentWeek} news={news} />}
              {activeTab === 'roster' && <Roster roster={userTeam.roster} />}
              {activeTab === 'recruiting' && <Recruiting prospects={prospects} onSpend={handleSpendPoints} points={recruitingPoints} />}
              {activeTab === 'schedule' && <Schedule schedule={schedule} teams={teams} userTeamId={userTeam.id} onOpenGame={setActiveGameId} />}
            </>
          ) : (
            <OffseasonView teams={teams} onAdvance={advanceToNextSeason} />
          )}
        </div>
      </main>

      {/* Navigation Footer */}
      <nav className="bg-slate-800 border-t border-slate-700 p-2">
        <div className="max-w-2xl mx-auto flex justify-around">
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="fa-chart-line" label="Hub" />
          <NavButton active={activeTab === 'roster'} onClick={() => setActiveTab('roster')} icon="fa-users" label="Roster" />
          <NavButton active={activeTab === 'recruiting'} onClick={() => setActiveTab('recruiting')} icon="fa-bullseye" label="Recruit" />
          <NavButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon="fa-calendar-days" label="Schedule" />
        </div>
      </nav>

      {/* Modals */}
      {activeGameId && (
        <GameView 
          game={schedule.find(g => g.id === activeGameId)!} 
          teams={teams} 
          onClose={() => setActiveGameId(null)} 
        />
      )}
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center p-2 rounded-xl transition-colors w-20 ${active ? 'text-indigo-400 bg-slate-700/50' : 'text-slate-400 hover:text-slate-200'}`}
  >
    <i className={`fa-solid ${icon} text-lg mb-1`}></i>
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
