'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '../../components/navigation/Header';
import { Footer } from '../../components/footer/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE } from '../../utils/apiConfig';
import {
  Trophy,
  Award,
  Zap,
  Flame,
  Shield,
  Coins,
  TrendingUp,
  Clock,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Achievement {
  code: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
  title: string;
  desc: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const username = user?.name || 'Pep Guardiola';
        const res = await fetch(`${API_BASE}/api/profile/${encodeURIComponent(username)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.profile) {
            setProfile(data.profile);
            return;
          }
        }
      } catch {
        // Fallback demo profile
      } finally {
        setLoading(false);
      }

      // Fallback state if server not running yet
      setProfile({
        username: user?.name || 'Pep Guardiola',
        elo: 1248,
        globalRank: 3,
        memberSince: 'October 2026',
        favoriteLeague: 'Premier League',
        preferredFormation: '4-3-3',
        stats: {
          ranked: {
            games: 8,
            wins: 5,
            podiums: 7,
            winRate: 62.5,
            avgScore: 86.4,
            bestScore: 92.1
          },
          casual: {
            games: 4,
            wins: 3,
            podiums: 4,
            winRate: 75.0,
            avgScore: 84.8,
            bestScore: 89.6
          }
        },
        last3Games: [
          { matchId: 'm1', squadScore: 81.0, isWin: false, competition: 'Bundesliga auction' },
          { matchId: 'm2', squadScore: 85.4, isWin: true, competition: 'La Liga auction' },
          { matchId: 'm3', squadScore: 89.2, isWin: true, competition: 'Premier League auction' }
        ],
        transferHabits: {
          avgSpend: 48,
          bargains: 7,
          overpays: 2,
          bestBargain: 'Florian Wirtz — 35 for ~370',
          recordSigning: 'Pedri — 390',
          formations: [
            { name: '4-3-3', count: 7, percentage: 58 },
            { name: '4-1-2-1-2', count: 3, percentage: 25 },
            { name: '4-4-2', count: 2, percentage: 17 }
          ]
        },
        achievements: [
          { code: 'FIRST_WHISTLE', tier: 'BRONZE', title: 'First Whistle', desc: 'Finish your first game.', unlocked: true, unlockedAt: '10/12/2026' },
          { code: 'BARGAIN_HUNTER', tier: 'BRONZE', title: 'Bargain Hunter', desc: 'Sign a player for a third of their value (or less).', unlocked: true, unlockedAt: '10/14/2026' },
          { code: 'CHAMPION', tier: 'BRONZE', title: 'Champion', desc: 'Win an auction match.', unlocked: true, unlockedAt: '10/14/2026' },
          { code: 'ON_THE_PODIUM', tier: 'BRONZE', title: 'On the Podium', desc: 'Finish top 3 in a room of 4 or more.', unlocked: true, unlockedAt: '10/16/2026' },
          { code: 'BIG_SPENDER', tier: 'BRONZE', title: 'Big Spender', desc: 'Spend 40% of budget on a single player.', unlocked: false, unlockedAt: null },
          { code: 'UNDERDOG', tier: 'SILVER', title: 'Underdog', desc: 'Win with the lowest-rated squad in the room.', unlocked: false, unlockedAt: null },
          { code: 'SHREWD_OPERATOR', tier: 'SILVER', title: 'Shrewd Operator', desc: 'Win while spending half your budget or less.', unlocked: false, unlockedAt: null },
          { code: 'PERFECT_FIT', tier: 'SILVER', title: 'Perfect Fit', desc: 'Every starter in natural or secondary position.', unlocked: false, unlockedAt: null },
          { code: 'CHEMISTRY_LAB', tier: 'SILVER', title: 'Chemistry Lab', desc: 'Reach 80+ squad chemistry.', unlocked: true, unlockedAt: '10/18/2026' },
          { code: 'MASTER_TACTICIAN', tier: 'SILVER', title: 'Master Tactician', desc: 'Score 97+ for tactical fit.', unlocked: false, unlockedAt: null },
          { code: 'HAT_TRICK', tier: 'SILVER', title: 'Hat Trick', desc: 'Win 3 games.', unlocked: true, unlockedAt: '10/22/2026' },
          { code: 'VETERAN', tier: 'SILVER', title: 'Veteran', desc: 'Play 10 games.', unlocked: false, unlockedAt: null },
          { code: 'FULL_HOUSE', tier: 'GOLD', title: 'Full House', desc: 'Win a 6-manager room.', unlocked: false, unlockedAt: null },
          { code: 'GIANT_KILLER', tier: 'GOLD', title: 'Giant Killer', desc: 'Win against someone 100+ ELO above you.', unlocked: false, unlockedAt: null },
          { code: 'GALACTICOS', tier: 'GOLD', title: 'Galácticos', desc: 'Field a starting XI averaging 86+ OVR.', unlocked: false, unlockedAt: null },
          { code: 'ELITE_MANAGER', tier: 'GOLD', title: 'Elite Manager', desc: 'Reach 1,400 ranked ELO.', unlocked: false, unlockedAt: null }
        ],
        unlockedCount: 6,
        totalAchievements: 16,
        recentMatches: [
          { id: '1', competition: 'Premier League auction', placement: 1, date: 'Oct 26, 2026', squadScore: 89.2 },
          { id: '2', competition: 'La Liga auction', placement: 1, date: 'Oct 25, 2026', squadScore: 85.4 },
          { id: '3', competition: 'Bundesliga auction', placement: 2, date: 'Oct 24, 2026', squadScore: 81.0 }
        ]
      });
    }

    loadProfile();
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8 font-mono text-xs text-slate-400">
          Loading Manager Career Profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col font-sans selection:bg-[#00F0FF] selection:text-black">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Manager Identity Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111728] via-[#16213b] to-[#0e1424] border border-[#222f4b] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#00F0FF]/20 to-[#10E7B2]/10 border-2 border-[#00F0FF] flex items-center justify-center text-2xl sm:text-3xl font-black text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.3)] shrink-0">
              {profile.username?.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider font-bold block">
                MANAGER · YOU
              </span>
              <h1 className="pixel-text text-2xl sm:text-3xl font-black text-white">
                {profile.username}
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Member since {profile.memberSince} · loves {profile.favoriteLeague} · plays {profile.preferredFormation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto font-mono">
            <div className="flex-1 md:flex-initial bg-[#0b0f1b] border border-[#222f49] px-5 py-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">RANKED ELO</span>
              <span className="pixel-text text-2xl font-black text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
                {profile.elo}
              </span>
            </div>
            <div className="flex-1 md:flex-initial bg-[#0b0f1b] border border-[#222f49] px-5 py-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">GLOBAL RANK</span>
              <span className="pixel-text text-2xl font-black text-amber-400">
                #{profile.globalRank}
              </span>
            </div>
          </div>
        </div>

        {/* Split Mode Cards: RANKED vs CASUAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ranked ⚡ */}
          <div className="bg-[#111728] border border-[#222f46] rounded-3xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#1f2b42] pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00F0FF]" />
                <h3 className="font-bold text-white text-base font-mono">RANKED ⚡ STATS</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">ELO ON THE LINE</span>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-center">
              <div className="bg-[#0b0f1b] p-3 rounded-xl border border-[#1b263b]">
                <span className="text-[10px] text-slate-500 block uppercase">GAMES</span>
                <span className="text-white font-bold text-base">{profile.stats?.ranked?.games}</span>
              </div>
              <div className="bg-[#0b0f1b] p-3 rounded-xl border border-[#1b263b]">
                <span className="text-[10px] text-slate-500 block uppercase">WINS</span>
                <span className="text-amber-400 font-bold text-base">{profile.stats?.ranked?.wins}</span>
              </div>
              <div className="bg-[#0b0f1b] p-3 rounded-xl border border-[#1b263b]">
                <span className="text-[10px] text-slate-500 block uppercase">PODIUMS</span>
                <span className="text-[#00F0FF] font-bold text-base">{profile.stats?.ranked?.podiums}</span>
              </div>
              <div className="bg-[#0b0f1b] p-3 rounded-xl border border-[#1b263b]">
                <span className="text-[10px] text-slate-500 block uppercase">WIN RATE</span>
                <span className="text-emerald-400 font-bold text-base">{profile.stats?.ranked?.winRate}%</span>
              </div>
              <div className="bg-[#0b0f1b] p-3 rounded-xl border border-[#1b263b]">
                <span className="text-[10px] text-slate-500 block uppercase">AVG SCORE</span>
                <span className="text-white font-bold text-base">{profile.stats?.ranked?.avgScore}</span>
              </div>
              <div className="bg-[#0b0f1b] p-3 rounded-xl border border-[#1b263b]">
                <span className="text-[10px] text-slate-500 block uppercase">BEST SCORE</span>
                <span className="text-purple-400 font-bold text-base">{profile.stats?.ranked?.bestScore}</span>
              </div>
            </div>
          </div>

          {/* Casual */}
          <div className="bg-[#111728] border border-[#222f46] rounded-3xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#1f2b42] pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" />
                <h3 className="font-bold text-white text-base font-mono">CASUAL STATS</h3>
              </div>
              <span className="text-xs font-mono text-slate-400 font-bold">PRACTICE & FRIENDS</span>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-center">
              <div className="bg-[#0b0f1b] p-3 rounded-xl border border-[#1b263b]">
                <span className="text-[10px] text-slate-500 block uppercase">GAMES</span>
                <span className="text-white font-bold text-base">{profile.stats?.casual?.games}</span>
              </div>
              <div className="bg-[#0b0f1b] p-3 rounded-xl border border-[#1b263b]">
                <span className="text-[10px] text-slate-500 block uppercase">WINS</span>
                <span className="text-amber-400 font-bold text-base">{profile.stats?.casual?.wins}</span>
              </div>
              <div className="bg-[#0b0f1b] p-3 rounded-xl border border-[#1b263b]">
                <span className="text-[10px] text-slate-500 block uppercase">PODIUMS</span>
                <span className="text-[#00F0FF] font-bold text-base">{profile.stats?.casual?.podiums}</span>
              </div>
              <div className="bg-[#0b0f1b] p-3 rounded-xl border border-[#1b263b]">
                <span className="text-[10px] text-slate-500 block uppercase">WIN RATE</span>
                <span className="text-emerald-400 font-bold text-base">{profile.stats?.casual?.winRate}%</span>
              </div>
              <div className="bg-[#0b0f1b] p-3 rounded-xl border border-[#1b263b]">
                <span className="text-[10px] text-slate-500 block uppercase">AVG SCORE</span>
                <span className="text-white font-bold text-base">{profile.stats?.casual?.avgScore}</span>
              </div>
              <div className="bg-[#0b0f1b] p-3 rounded-xl border border-[#1b263b]">
                <span className="text-[10px] text-slate-500 block uppercase">BEST SCORE</span>
                <span className="text-purple-400 font-bold text-base">{profile.stats?.casual?.bestScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Squad Score Last 3 Games Chart & Transfer Habits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Trend Chart (6 cols) */}
          <div className="lg:col-span-6 bg-[#111728] border border-[#222f46] rounded-3xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#1f2b42] pb-3">
              <span className="font-bold text-white text-sm font-mono uppercase">
                SQUAD SCORE · LAST 3 GAMES
              </span>
              <span className="text-[11px] font-mono text-slate-400">Filled dots are wins</span>
            </div>

            {/* SVG Trend Line */}
            <div className="relative h-44 w-full flex items-end pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120">
                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="#1c2538" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="#1c2538" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="300" y2="100" stroke="#1c2538" strokeDasharray="3 3" />

                {/* Score Line */}
                <polyline
                  fill="none"
                  stroke="#10E7B2"
                  strokeWidth="3"
                  points="30,80 150,55 270,30"
                />

                {/* Data Points */}
                {profile.last3Games?.map((g: any, i: number) => {
                  const x = 30 + i * 120;
                  const y = 120 - (g.squadScore - 70) * 3.5;
                  return (
                    <g key={i}>
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill={g.isWin ? '#10E7B2' : '#0a0d14'}
                        stroke="#10E7B2"
                        strokeWidth="3"
                      />
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        fill="#00F0FF"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {g.squadScore}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-[#1f2b42]">
              <span>Match 1 (81.0)</span>
              <span>Match 2 (85.4)</span>
              <span>Match 3 (89.2)</span>
            </div>
          </div>

          {/* Transfer Habits (6 cols) */}
          <div className="lg:col-span-6 bg-[#111728] border border-[#222f46] rounded-3xl p-6 space-y-4 shadow-md font-mono">
            <span className="font-bold text-white text-sm uppercase block border-b border-[#1f2b42] pb-3">
              TRANSFER HABITS INTELLIGENCE
            </span>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#0b0f1b] p-3 rounded-xl border border-[#1b263b]">
                <span className="text-[10px] text-slate-500 block uppercase">AVG SPEND</span>
                <span className="text-white font-bold text-base">{profile.transferHabits?.avgSpend}c</span>
              </div>
              <div className="bg-[#0b0f1b] p-3 rounded-xl border border-[#1b263b]">
                <span className="text-[10px] text-slate-500 block uppercase">BARGAINS</span>
                <span className="text-emerald-400 font-bold text-base">{profile.transferHabits?.bargains}</span>
              </div>
              <div className="bg-[#0b0f1b] p-3 rounded-xl border border-[#1b263b]">
                <span className="text-[10px] text-slate-500 block uppercase">OVERPAYS</span>
                <span className="text-rose-400 font-bold text-base">{profile.transferHabits?.overpays}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between bg-[#0b0f1b] p-2.5 rounded-xl border border-[#1b263b]">
                <span className="text-emerald-400">🟢 Best Bargain:</span>
                <span className="text-white font-bold">{profile.transferHabits?.bestBargain}</span>
              </div>
              <div className="flex items-center justify-between bg-[#0b0f1b] p-2.5 rounded-xl border border-[#1b263b]">
                <span className="text-amber-400">💰 Record Signing:</span>
                <span className="text-white font-bold">{profile.transferHabits?.recordSigning}</span>
              </div>
            </div>

            {/* Formations Distribution */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] text-slate-400 block uppercase font-bold">
                FAVORITE FORMATIONS
              </span>
              {profile.transferHabits?.formations?.map((f: any) => (
                <div key={f.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white">{f.name}</span>
                    <span className="text-slate-400">{f.count} games ({f.percentage}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1b2438] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00F0FF] to-[#10E7B2] rounded-full"
                      style={{ width: `${f.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 16 Achievements Matrix */}
        <div className="bg-[#111728] border border-[#222f46] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1f2b42] pb-3">
            <div>
              <h2 className="pixel-text text-base sm:text-lg font-bold text-white tracking-wide">
                ACHIEVEMENTS MATRIX
              </h2>
              <p className="text-xs text-slate-400">
                Unlock 16 career badges across Bronze, Silver, and Gold milestones.
              </p>
            </div>
            <div className="bg-[#18233a] border border-[#2c3d62] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-amber-400">
              {profile.unlockedCount} / {profile.totalAchievements} UNLOCKED
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {profile.achievements?.map((ach: Achievement) => (
              <div
                key={ach.code}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  ach.unlocked
                    ? 'bg-[#152036] border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'bg-[#0b0f1a] border-[#1d273a] opacity-50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase ${
                        ach.tier === 'GOLD'
                          ? 'bg-amber-400 text-black'
                          : ach.tier === 'SILVER'
                          ? 'bg-slate-300 text-black'
                          : 'bg-amber-700 text-white'
                      }`}
                    >
                      {ach.tier}
                    </span>
                    {ach.unlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <h4 className="font-bold text-white text-sm">{ach.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ach.desc}</p>
                </div>

                <div className="pt-3 border-t border-[#1c2842] mt-3 text-[10px] font-mono">
                  {ach.unlocked ? (
                    <span className="text-emerald-400 font-bold">Unlocked {ach.unlockedAt}</span>
                  ) : (
                    <span className="text-slate-500">Locked</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Matches List */}
        <div className="bg-[#111728] border border-[#222f46] rounded-3xl p-6 space-y-4 shadow-md font-mono">
          <span className="font-bold text-white text-sm uppercase block border-b border-[#1f2b42] pb-3">
            RECENT AUCTION MATCHES
          </span>

          <div className="space-y-3">
            {profile.recentMatches?.map((m: any) => (
              <div
                key={m.id}
                className="bg-[#0b0f1b] border border-[#1b263b] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                      m.placement === 1
                        ? 'bg-amber-400 text-black'
                        : m.placement === 2
                        ? 'bg-slate-300 text-black'
                        : 'bg-[#18233a] text-slate-400'
                    }`}
                  >
                    #{m.placement}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{m.competition}</h4>
                    <span className="text-slate-400 text-[11px]">{m.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">Squad Score</span>
                    <span className="text-lg font-black text-[#00F0FF]">{m.squadScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
