'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/navigation/Header';
import { Footer } from '../../components/footer/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE } from '../../utils/apiConfig';
import {
  Users,
  Clock,
  Coins,
  Shield,
  Zap,
  Lock,
  Globe,
  RefreshCw,
  ArrowRight,
  PlusCircle,
  Trophy,
  CheckCircle2
} from 'lucide-react';

interface PublicRoom {
  code: string;
  roomName: string;
  competition: string;
  season: string;
  roomSize: number;
  managerCount: number;
  startingBudget: number;
  bidTimer: number;
  mode: string;
  antiSnipe: boolean;
  isPublic: boolean;
  hostName: string;
}

const COMPETITIONS = [
  { id: 'PREMIER_LEAGUE', name: 'Premier League', short: 'PL', count: 162, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#38bdf8' },
  { id: 'LA_LIGA', name: 'La Liga', short: 'LL', count: 114, flag: '🇪🇸', color: '#f59e0b' },
  { id: 'SERIE_A', name: 'Serie A', short: 'SA', count: 138, flag: '🇮🇹', color: '#10b981' },
  { id: 'BUNDESLIGA', name: 'Bundesliga', short: 'BL', count: 112, flag: '🇩🇪', color: '#ef4444' },
  { id: 'CHAMPIONS_LEAGUE', name: 'UEFA Champions League', short: 'UCL', count: 314, flag: '⭐', color: '#8b5cf6' },
  { id: 'WORLD_CUP', name: 'FIFA World Cup', short: 'WC', count: 508, flag: '🌍', color: '#ec4899' },
  { id: 'GLOBAL', name: 'Global — All Players', short: 'GLB', count: 569, flag: '🌐', color: '#00f0ff' }
];

export default function PlayPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Play Now Queue state
  const [playNowComp, setPlayNowComp] = useState<string>('ANY');
  const [playNowMode, setPlayNowMode] = useState<'RANKED' | 'CASUAL'>('RANKED');
  const [isMatchmaking, setIsMatchmaking] = useState<boolean>(false);

  // Public Rooms
  const [publicRooms, setPublicRooms] = useState<PublicRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Join Room with Code
  const [joinCode, setJoinCode] = useState<string>('');
  const [joinError, setJoinError] = useState<string>('');

  // Host Create Room State
  const [roomName, setRoomName] = useState<string>('');
  const [selectedComp, setSelectedComp] = useState<string>('PREMIER_LEAGUE');
  const [roomSize, setRoomSize] = useState<number>(4);
  const [startingBudget, setStartingBudget] = useState<number>(1000);
  const [bidTimer, setBidTimer] = useState<number>(30);
  const [mode, setMode] = useState<'RANKED' | 'CASUAL'>('RANKED');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [antiSnipe, setAntiSnipe] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string>('');

  useEffect(() => {
    if (user && !roomName) {
      setRoomName(`${user.name}'s Arena`);
    }
  }, [user, roomName]);

  // Fetch Public Rooms
  const fetchPublicRooms = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/rooms/public`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPublicRooms(data.rooms || []);
          setLastRefreshed(new Date());
        }
      }
    } catch {
      // offline or server starting
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicRooms();
    const interval = setInterval(fetchPublicRooms, 5000);
    return () => clearInterval(interval);
  }, [fetchPublicRooms]);

  // Play Now Quick Match
  const handlePlayNow = async () => {
    try {
      setIsMatchmaking(true);
      const res = await fetch(`${API_BASE}/api/rooms/play-now`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competition: playNowComp,
          mode: playNowMode,
          user: {
            id: user?._id || 'user-' + Date.now(),
            name: user?.name || 'Manager',
            email: user?.email || ''
          }
        })
      });

      const data = await res.json();
      if (data.success && data.code) {
        router.push(`/room/${data.code}`);
      }
    } catch (e) {
      console.error('Play now error:', e);
    } finally {
      setIsMatchmaking(false);
    }
  };

  // Join Room by Code
  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) {
      setJoinError('Please enter a valid 6-character room code.');
      return;
    }

    try {
      setJoinError('');
      const res = await fetch(`${API_BASE}/api/rooms/${code}`);
      if (!res.ok) {
        setJoinError('Room not found or no longer active.');
        return;
      }
      router.push(`/room/${code}`);
    } catch {
      setJoinError('Could not connect to room server.');
    }
  };

  // Create Room
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      setCreateError('');

      const res = await fetch(`${API_BASE}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: roomName || `${user?.name || 'Manager'}'s Arena`,
          competition: selectedComp,
          season: '2026-27',
          roomSize,
          startingBudget,
          bidTimer,
          mode,
          isPublic,
          antiSnipe,
          user: {
            id: user?._id || 'user-' + Date.now(),
            name: user?.name || 'Manager',
            email: user?.email || ''
          }
        })
      });

      const data = await res.json();
      if (data.success && data.code) {
        router.push(`/room/${data.code}`);
      } else {
        setCreateError(data.message || 'Failed to create room.');
      }
    } catch (err: any) {
      setCreateError(err.message || 'Network error creating room.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col font-sans selection:bg-[#00F0FF] selection:text-black">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111728] via-[#161f36] to-[#0e1424] border border-[#222f4b] p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-[#00F0FF]/10 via-[#10E7B2]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] tracking-wider uppercase font-semibold mb-2">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
                Matchmaking Hub · Season 2026-27
              </div>
              <h1 className="pixel-text text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#dbfcff] to-[#00F0FF]">
                WELCOME, {user?.name?.toUpperCase() || 'MANAGER'}
              </h1>
              <p className="text-sm text-slate-300 mt-2 max-w-xl">
                Jump straight into an open public auction or configure a custom stadium arena for your friends.
              </p>
            </div>

            {/* Quick Play Now Action Bar */}
            <div className="w-full md:w-auto bg-[#0a0e1a]/90 border border-[#222f46] p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-lg">
              <select
                value={playNowComp}
                onChange={(e) => setPlayNowComp(e.target.value)}
                className="bg-[#121829] border border-[#2c3a54] text-xs text-white rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-[#00F0FF]"
              >
                <option value="ANY">Any Competition</option>
                {COMPETITIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name} ({c.count})
                  </option>
                ))}
              </select>

              <div className="flex bg-[#121829] border border-[#2c3a54] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPlayNowMode('CASUAL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    playNowMode === 'CASUAL'
                      ? 'bg-slate-700 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Casual
                </button>
                <button
                  type="button"
                  onClick={() => setPlayNowMode('RANKED')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    playNowMode === 'RANKED'
                      ? 'bg-gradient-to-r from-[#00F0FF] to-[#10E7B2] text-black font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3 h-3 text-current" />
                  <span>Ranked ⚡</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handlePlayNow}
                disabled={isMatchmaking}
                className="bg-gradient-to-r from-[#00F0FF] via-[#10E7B2] to-[#b4ff39] hover:brightness-110 text-black font-black font-mono text-xs px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isMatchmaking ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <>
                    <span>PLAY NOW</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Public Rooms & Join by Code */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Open Public Rooms */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00F0FF]" />
                <h2 className="pixel-text text-sm sm:text-base font-bold text-white tracking-wide">
                  OPEN PUBLIC ROOMS
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10E7B2] animate-pulse" />
                <span>Refreshes every 5s</span>
              </div>
            </div>

            {loadingRooms ? (
              <div className="p-8 text-center rounded-2xl bg-[#111728] border border-[#1f2b42] text-slate-400 font-mono text-xs">
                Scanning stadium network for active rooms...
              </div>
            ) : publicRooms.length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-2xl bg-[#111728]/70 border border-[#1f2b42] space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#162138] border border-[#2a3c5e] flex items-center justify-center mx-auto text-xl">
                  🏟️
                </div>
                <h3 className="text-white font-bold text-sm">No open public rooms right now</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Press <strong>Play Now</strong> above to quickly queue into a room, or create your own custom public arena below!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {publicRooms.map((r) => {
                  const compObj = COMPETITIONS.find((c) => c.id === r.competition);
                  return (
                    <div
                      key={r.code}
                      className="bg-[#12192c] hover:bg-[#16213b] border border-[#23314d] hover:border-[#00F0FF]/50 rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{compObj?.flag || '⚽'}</span>
                          <h4 className="font-bold text-white text-sm">{r.roomName}</h4>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              r.mode === 'RANKED'
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                            }`}
                          >
                            {r.mode} ⚡
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
                          <span className="flex items-center gap-1 text-[#00F0FF]">
                            <Users className="w-3.5 h-3.5" />
                            {r.managerCount} / {r.roomSize} Managers
                          </span>
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Coins className="w-3.5 h-3.5" />
                            {r.startingBudget} Budget
                          </span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <Clock className="w-3.5 h-3.5" />
                            {r.bidTimer}s Timer
                          </span>
                          <span>Host: {r.hostName}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => router.push(`/room/${r.code}`)}
                        className="self-end sm:self-center bg-[#00F0FF]/15 hover:bg-[#00F0FF] border border-[#00F0FF]/40 text-[#00F0FF] hover:text-black font-bold font-mono text-xs px-4 py-2 rounded-xl transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)] flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <span>JOIN</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Join by 6-char Code */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#10E7B2]" />
              <h2 className="pixel-text text-sm sm:text-base font-bold text-white tracking-wide">
                JOIN WITH CODE
              </h2>
            </div>

            <form
              onSubmit={handleJoinByCode}
              className="bg-[#12192c] border border-[#23314d] rounded-2xl p-5 sm:p-6 space-y-4 shadow-md"
            >
              <p className="text-xs text-slate-300">
                Have a 6-character invite code from a friend? Enter it below to join their lobby:
              </p>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="F B A 7 K 2"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#0a0e1a] border border-[#2a3b59] focus:border-[#00F0FF] rounded-xl px-4 py-3 text-center text-lg font-mono font-black tracking-widest text-[#00F0FF] placeholder-slate-600 focus:outline-none uppercase"
                />
                {joinError && <p className="text-xs text-rose-400 mt-2 font-mono">{joinError}</p>}
              </div>

              <button
                type="submit"
                disabled={!joinCode.trim()}
                className="w-full bg-[#10E7B2] hover:bg-[#15f5bd] text-black font-bold font-mono text-xs py-3 rounded-xl transition-all shadow-[0_0_12px_rgba(16,231,178,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <span>ENTER ROOM</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </form>
          </div>
        </div>

        {/* Section: Host — Create a Room (Custom Configurator) */}
        <div className="rounded-3xl bg-[#111728] border border-[#222f4b] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-[#222f46]">
            <PlusCircle className="w-5 h-5 text-[#00F0FF]" />
            <div>
              <h2 className="pixel-text text-base sm:text-lg font-bold text-white tracking-wide">
                HOST — CREATE A ROOM
              </h2>
              <p className="text-xs text-slate-400">
                Customize competition pool, coin budget, timer duration, and rules.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateRoom} className="space-y-6">
            {/* Room Name */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5 uppercase">
                Room Name
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g. Champions Arena"
                required
                className="w-full max-w-lg bg-[#0a0e1a] border border-[#273652] focus:border-[#00F0FF] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none"
              />
            </div>

            {/* Competition Pool Cards (7 cards grid) */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
                Competition — The Player Pool
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {COMPETITIONS.map((c) => {
                  const isSelected = selectedComp === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedComp(c.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#18253f] border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-[#0d1322] border-[#223049] hover:border-[#33466a]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-2xl">{c.flag}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                        )}
                      </div>
                      <div className="mt-3">
                        <h4 className="font-bold text-white text-xs sm:text-sm">{c.name}</h4>
                        <span className="text-[11px] font-mono font-semibold text-[#00F0FF]">
                          {c.count} players
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parameters Grid: Season, Room Size, Starting Budget, Bid Timer, Mode, Visibility */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {/* Season */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
                  Season
                </label>
                <div className="inline-block bg-[#162138] border border-[#2a3c5e] text-emerald-400 font-mono text-xs px-4 py-2 rounded-xl font-bold">
                  2026–27 Official
                </div>
              </div>

              {/* Room Size (2-6) */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
                  Room Size (Managers)
                </label>
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRoomSize(num)}
                      className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                        roomSize === num
                          ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-sm'
                          : 'bg-[#121829] text-slate-300 border-[#25344d] hover:border-slate-500'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Starting Budget */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
                  Starting Purse (Coins)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[500, 750, 1000, 1500, 2000].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setStartingBudget(b)}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                        startingBudget === b
                          ? 'bg-amber-400 text-black border-amber-400 shadow-sm'
                          : 'bg-[#121829] text-slate-300 border-[#25344d] hover:border-slate-500'
                      }`}
                    >
                      {b.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bid Timer */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
                  Turn Timer
                </label>
                <div className="flex gap-2">
                  {[15, 20, 30, 45].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBidTimer(t)}
                      className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                        bidTimer === t
                          ? 'bg-[#10E7B2] text-black border-[#10E7B2] shadow-sm'
                          : 'bg-[#121829] text-slate-300 border-[#25344d] hover:border-slate-500'
                      }`}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
                  Mode
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('CASUAL')}
                    className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                      mode === 'CASUAL'
                        ? 'bg-slate-700 text-white border-slate-600'
                        : 'bg-[#121829] text-slate-400 border-[#25344d]'
                    }`}
                  >
                    Casual
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('RANKED')}
                    className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all border flex items-center justify-center gap-1 ${
                      mode === 'RANKED'
                        ? 'bg-gradient-to-r from-[#00F0FF] to-[#10E7B2] text-black border-[#00F0FF]'
                        : 'bg-[#121829] text-slate-400 border-[#25344d]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Ranked ⚡</span>
                  </button>
                </div>
              </div>

              {/* Visibility Toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
                  Visibility
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPublic(true)}
                    className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                      isPublic
                        ? 'bg-[#00F0FF] text-black border-[#00F0FF]'
                        : 'bg-[#121829] text-slate-400 border-[#25344d]'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Public</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPublic(false)}
                    className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                      !isPublic
                        ? 'bg-amber-400 text-black border-amber-400'
                        : 'bg-[#121829] text-slate-400 border-[#25344d]'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Private · code</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Anti-snipe Checkbox */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="antiSnipeCheckbox"
                checked={antiSnipe}
                onChange={(e) => setAntiSnipe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 text-[#00F0FF] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="antiSnipeCheckbox" className="text-xs text-slate-300 select-none cursor-pointer">
                <strong>Anti-snipe rule:</strong> A bid placed in the last 3s automatically resets the clock to 5s.
              </label>
            </div>

            {createError && (
              <p className="text-xs text-rose-400 font-mono">{createError}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-[#00F0FF] via-[#10E7B2] to-[#b4ff39] hover:brightness-110 active:scale-[0.99] text-black font-black font-mono text-sm py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isCreating ? (
                <RefreshCw className="w-5 h-5 animate-spin text-black" />
              ) : (
                <>
                  <PlusCircle className="w-5 h-5 text-black" />
                  <span>CREATE ROOM & ENTER LOBBY</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
