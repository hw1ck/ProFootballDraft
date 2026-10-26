'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '../../components/navigation/Header';
import { Footer } from '../../components/footer/Footer';
import { API_BASE } from '../../utils/apiConfig';
import {
  Search,
  Star,
  StarOff,
  Filter,
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
  Coins,
  Shield,
  Zap,
  Globe,
  Sparkles,
  Trophy,
  CheckCircle2,
  ListFilter
} from 'lucide-react';

interface Player {
  playerId: string | number;
  name: string;
  displayName?: string;
  surname?: string;
  position: string;
  subPositions?: string[];
  club: string;
  league: string;
  nationality: string;
  nationalityCode?: string;
  age: number;
  preferredFoot: string;
  competitions: string[];
  basePrice: number;
  estimatedValue: number;
  rarity: string;
  photoUrl?: string;
  stats: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
    overall: number;
  };
}

const COMPETITIONS = [
  { id: 'ALL', name: 'All Competitions', count: 569, flag: '🌐' },
  { id: 'PREMIER_LEAGUE', name: 'Premier League', count: 162, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'LA_LIGA', name: 'La Liga', count: 114, flag: '🇪🇸' },
  { id: 'SERIE_A', name: 'Serie A', count: 138, flag: '🇮🇹' },
  { id: 'BUNDESLIGA', name: 'Bundesliga', count: 112, flag: '🇩🇪' },
  { id: 'CHAMPIONS_LEAGUE', name: 'UEFA Champions League', count: 314, flag: '⭐' },
  { id: 'WORLD_CUP', name: 'FIFA World Cup', count: 508, flag: '🌍' }
];

export default function PoolPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'pool' | 'shortlist'>('pool');
  const [selectedComp, setSelectedComp] = useState<string>('ALL');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'rating' | 'estValue' | 'name'>('rating');

  // Shortlist State (stored in localStorage)
  const [shortlistIds, setShortlistIds] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem('profootballdraft_shortlist');
      if (saved) {
        setShortlistIds(new Set(JSON.parse(saved)));
      }
    } catch {}
  }, []);

  const toggleShortlist = (id: string | number) => {
    setShortlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem('profootballdraft_shortlist', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  // Fetch players from API
  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (positionFilter !== 'ALL') params.append('position', positionFilter);
      if (selectedComp !== 'ALL') params.append('competition', selectedComp);
      params.append('sortBy', sortBy);

      const res = await fetch(`${API_BASE}/api/players?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPlayers(data.players || []);
        }
      } else {
        // Fallback directly to client data if server unreachable
        const fallback = await import('../../data/players-2026-27.json');
        setPlayers((fallback.default || []) as any);
      }
    } catch {
      try {
        const fallback = await import('../../data/players-2026-27.json');
        setPlayers((fallback.default || []) as any);
      } catch {}
    } finally {
      setLoading(false);
    }
  }, [search, positionFilter, selectedComp, sortBy]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  // Shortlisted Players
  const shortlistedPlayers = useMemo(() => {
    return players.filter((p) => shortlistIds.has(p.playerId || (p as any)._id));
  }, [players, shortlistIds]);

  // Shortlist summary stats
  const shortlistStats = useMemo(() => {
    if (shortlistedPlayers.length === 0) return null;
    const avgOvr = Math.round(
      shortlistedPlayers.reduce((acc, p) => acc + (p.stats?.overall || 80), 0) / shortlistedPlayers.length
    );
    const totalEst = shortlistedPlayers.reduce((acc, p) => acc + (p.estimatedValue || 100), 0);
    const gks = shortlistedPlayers.filter((p) => p.position === 'GK').length;
    const defs = shortlistedPlayers.filter((p) => ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.position)).length;
    const mids = shortlistedPlayers.filter((p) => ['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(p.position)).length;
    const fwds = shortlistedPlayers.filter((p) => ['ST', 'CF', 'LW', 'RW'].includes(p.position)).length;

    return { avgOvr, totalEst, gks, defs, mids, fwds };
  }, [shortlistedPlayers]);

  const displayedPlayers = activeTab === 'shortlist' ? shortlistedPlayers : players;

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col font-sans selection:bg-[#00F0FF] selection:text-black">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Title & Mode Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1c2438] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] tracking-wider uppercase font-semibold mb-1">
              <Sparkles className="w-4 h-4 text-[#00F0FF]" />
              Official 2026-27 Player Database
            </div>
            <h1 className="pixel-text text-2xl sm:text-3xl font-black text-white">
              DRAFT POOL & SHORTLIST
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Browse 569 verified stars across 7 leagues with real EA FC player faces, roles, and stats.
            </p>
          </div>

          {/* Tab Switcher: Full Pool vs My Shortlist */}
          <div className="flex bg-[#111728] border border-[#222f46] p-1 rounded-2xl shrink-0 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('pool')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'pool'
                  ? 'bg-gradient-to-r from-[#00F0FF] to-[#10E7B2] text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>All Players ({players.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shortlist')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'shortlist'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Shortlist ({shortlistIds.size})</span>
            </button>
          </div>
        </div>

        {/* Shortlist Intelligence Summary Card (shown when on Shortlist tab) */}
        {activeTab === 'shortlist' && (
          <div className="bg-gradient-to-r from-[#1b152d] via-[#131b2e] to-[#0e1424] border border-amber-400/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider block mb-1">
                  TACTICAL SHORTLIST INTELLIGENCE
                </span>
                <h3 className="text-lg font-black text-white">
                  Target Transfer Blueprint ({shortlistedPlayers.length} Bookmarked)
                </h3>
                <p className="text-xs text-slate-300">
                  Monitor estimated price targets, positional coverage, and star rating.
                </p>
              </div>

              {shortlistStats && (
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                  <div className="bg-[#0b0f1b] border border-[#23314f] px-3.5 py-2 rounded-xl text-center">
                    <span className="text-[10px] text-slate-500 block uppercase">Average OVR</span>
                    <span className="text-[#00F0FF] font-black text-base">{shortlistStats.avgOvr}</span>
                  </div>
                  <div className="bg-[#0b0f1b] border border-[#23314f] px-3.5 py-2 rounded-xl text-center">
                    <span className="text-[10px] text-slate-500 block uppercase">Total Est. Coins</span>
                    <span className="text-amber-400 font-black text-base">{shortlistStats.totalEst}c</span>
                  </div>
                  <div className="bg-[#0b0f1b] border border-[#23314f] px-3.5 py-2 rounded-xl text-center">
                    <span className="text-[10px] text-slate-500 block uppercase">Pos Breakdown</span>
                    <span className="text-emerald-400 font-bold text-xs">
                      {shortlistStats.gks} GK · {shortlistStats.defs} DEF · {shortlistStats.mids} MID · {shortlistStats.fwds} FWD
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filters Bar: Competition, Search, Position, Sort */}
        <div className="bg-[#111728] border border-[#222f46] p-4 rounded-2xl space-y-3 shadow-md">
          {/* Competitions Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {COMPETITIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedComp(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
                  selectedComp === c.id
                    ? 'bg-[#00F0FF] text-black border-[#00F0FF] font-bold shadow-sm'
                    : 'bg-[#0a0e1a] text-slate-300 border-[#223049] hover:border-slate-500'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
                <span className="text-[10px] opacity-70">({c.count})</span>
              </button>
            ))}
          </div>

          {/* Search, Position & Sort */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by player name, club, nationality, role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0a0e1a] border border-[#223049] focus:border-[#00F0FF] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none"
              />
            </div>

            <div className="flex gap-2 shrink-0">
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="bg-[#0a0e1a] border border-[#223049] text-xs text-slate-300 rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-[#00F0FF]"
              >
                <option value="ALL">All Positions</option>
                <option value="GK">Goalkeepers (GK)</option>
                <option value="CB">Center Backs (CB)</option>
                <option value="LB">Left Backs (LB)</option>
                <option value="RB">Right Backs (RB)</option>
                <option value="CDM">Defensive Mid (CDM)</option>
                <option value="CM">Center Mid (CM)</option>
                <option value="CAM">Attacking Mid (CAM)</option>
                <option value="LW">Left Wing (LW)</option>
                <option value="RW">Right Wing (RW)</option>
                <option value="ST">Strikers (ST)</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#0a0e1a] border border-[#222f46] text-xs text-slate-300 rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-[#00F0FF]"
              >
                <option value="rating">Sort: OVR Rating (High-Low)</option>
                <option value="estValue">Sort: Est. Coins (High-Low)</option>
                <option value="name">Sort: Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Players Grid */}
        {loading ? (
          <div className="p-16 text-center rounded-2xl bg-[#111728] border border-[#222f46] text-slate-400 font-mono text-xs">
            Loading player cards from 2026-27 pool...
          </div>
        ) : displayedPlayers.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-[#111728] border border-[#222f46] space-y-3">
            <span className="text-3xl">⚽</span>
            <h3 className="text-white font-bold text-sm">
              {activeTab === 'shortlist'
                ? 'Your shortlist is currently empty'
                : 'No players match your search filters'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {activeTab === 'shortlist'
                ? 'Click the Star icon on any player card in the Draft Pool to bookmark them for quick tactical reference.'
                : 'Try adjusting your search criteria or switching competition pools.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedPlayers.map((p) => {
              const id = p.playerId || (p as any)._id;
              const isShortlisted = shortlistIds.has(id);
              const faceUrl = p.photoUrl || `/player_faces/${id}.png`;

              return (
                <div
                  key={id}
                  className={`rounded-2xl border transition-all p-4 relative flex flex-col justify-between overflow-hidden group shadow-md ${
                    isShortlisted
                      ? 'bg-[#151c2e] border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                      : 'bg-[#111728] border-[#222f46] hover:border-[#00F0FF]/50'
                  }`}
                >
                  {/* Top Bar: Rating, Position, Star Bookmark Button */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="pixel-text text-2xl font-black text-white font-mono">
                        {p.stats?.overall || 80}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30">
                        {p.position}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                        {p.nationalityCode || p.nationality?.slice(0, 3)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleShortlist(id)}
                      title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isShortlisted
                          ? 'bg-amber-400 text-black shadow-md'
                          : 'bg-[#18233a] text-slate-400 hover:text-amber-400 hover:bg-[#202d4a]'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Cutout Face & Name */}
                  <div className="flex items-center gap-3.5 my-3">
                    <div className="w-16 h-16 rounded-xl bg-[#0b101c] border border-[#1e2a42] overflow-hidden flex items-end justify-center shrink-0">
                      <img
                        src={faceUrl}
                        alt={p.name}
                        className="w-full h-full object-contain object-bottom filter drop-shadow"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-white text-sm truncate uppercase font-mono">
                        {p.surname || p.displayName || p.name}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">{p.club}</p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-1">
                        <span>{p.age} yrs</span>
                        <span>•</span>
                        <span>{p.preferredFoot} foot</span>
                      </div>
                    </div>
                  </div>

                  {/* 6 Attribute Meters Grid */}
                  <div className="grid grid-cols-6 gap-1 bg-[#090d18] p-2 rounded-xl text-center font-mono text-[9px] mb-3">
                    <div>
                      <span className="text-slate-500 block text-[8px]">PAC</span>
                      <span className="font-bold text-white">{p.stats?.pace || 75}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">SHO</span>
                      <span className="font-bold text-white">{p.stats?.shooting || 75}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">PAS</span>
                      <span className="font-bold text-white">{p.stats?.passing || 75}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">DRI</span>
                      <span className="font-bold text-white">{p.stats?.dribbling || 75}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">DEF</span>
                      <span className="font-bold text-white">{p.stats?.defending || 75}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">PHY</span>
                      <span className="font-bold text-white">{p.stats?.physical || 75}</span>
                    </div>
                  </div>

                  {/* Bottom: Estimated Value & Base Opening Bid */}
                  <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#1c263c]">
                    <span className="text-slate-400 text-[11px]">Est. Value:</span>
                    <span className="text-amber-400 font-bold font-mono">
                      ~{p.estimatedValue} coins
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
