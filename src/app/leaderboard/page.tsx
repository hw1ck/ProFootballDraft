'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '../../components/navigation/Header';
import { Footer } from '../../components/footer/Footer';
import { API_BASE } from '../../utils/apiConfig';
import {
  Trophy,
  Medal,
  Zap,
  ArrowRight,
  Sparkles,
  Shield,
  Star
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  club: string;
  elo: number;
  winRate: number;
  games: number;
  wins: number;
  bestScore: number;
  avatar: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await fetch(`${API_BASE}/api/leaderboard`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.leaderboard) {
            setLeaderboard(data.leaderboard);
            return;
          }
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }

      // Default mock leaderboard
      setLeaderboard([
        { rank: 1, username: 'Carlo Ancelotti', club: 'Real Madrid', elo: 1390, winRate: 78.5, games: 28, wins: 22, bestScore: 94.6, avatar: '👑' },
        { rank: 2, username: 'Mikel Arteta', club: 'Arsenal FC', elo: 1312, winRate: 70.0, games: 20, wins: 14, bestScore: 93.2, avatar: '🔴' },
        { rank: 3, username: 'Pep Guardiola', club: 'Manchester City', elo: 1248, winRate: 62.5, games: 12, wins: 8, bestScore: 92.1, avatar: '⚡' },
        { rank: 4, username: 'Hansi Flick', club: 'FC Barcelona', elo: 1215, winRate: 58.3, games: 24, wins: 14, bestScore: 91.0, avatar: '🔵' },
        { rank: 5, username: 'Simone Inzaghi', club: 'Inter Milan', elo: 1188, winRate: 55.0, games: 20, wins: 11, bestScore: 89.4, avatar: '🐍' },
        { rank: 6, username: 'Vincent Kompany', club: 'Bayern München', elo: 1160, winRate: 50.0, games: 16, wins: 8, bestScore: 88.7, avatar: '⭐' }
      ]);
    }

    loadLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col font-sans selection:bg-[#00F0FF] selection:text-black">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111728] via-[#16213b] to-[#0e1424] border border-[#222f4b] p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] tracking-wider uppercase font-semibold mb-1">
              <Trophy className="w-4 h-4 text-[#00F0FF]" />
              Official Ranked Standings · Season 2026-27
            </div>
            <h1 className="pixel-text text-2xl sm:text-3xl font-black text-white">
              GLOBAL LEADERBOARD
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-lg">
              Compete in Ranked auctions to climb the ELO rating ladder and earn Elite Manager status.
            </p>
          </div>

          <Link
            href="/play"
            className="self-start sm:self-center bg-gradient-to-r from-[#00F0FF] via-[#10E7B2] to-[#b4ff39] hover:brightness-110 text-black font-black font-mono text-xs px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>PLAY RANKED</span>
          </Link>
        </div>

        {/* Leaderboard Table / Cards */}
        <div className="bg-[#111728] border border-[#222f46] rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#1f2b42] flex items-center justify-between text-xs font-mono text-slate-400 uppercase font-bold">
            <span>Rank & Manager</span>
            <div className="flex items-center gap-6 sm:gap-12">
              <span className="hidden sm:inline">Win Rate</span>
              <span className="hidden sm:inline">Best Score</span>
              <span className="text-[#00F0FF]">Ranked ELO</span>
            </div>
          </div>

          <div className="divide-y divide-[#182338]">
            {leaderboard.map((item) => (
              <div
                key={item.rank}
                className="p-4 hover:bg-[#141d33] transition-colors flex items-center justify-between gap-4 font-mono text-xs"
              >
                {/* Left: Rank & Avatar & Name */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      item.rank === 1
                        ? 'bg-amber-400 text-black shadow-md'
                        : item.rank === 2
                        ? 'bg-slate-300 text-black'
                        : item.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-[#18233a] text-slate-400'
                    }`}
                  >
                    #{item.rank}
                  </div>

                  <span className="text-xl shrink-0">{item.avatar}</span>

                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-1.5 font-sans">
                      {item.username}
                      {item.rank <= 3 && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                    </h3>
                    <p className="text-[11px] text-slate-400">{item.club}</p>
                  </div>
                </div>

                {/* Right: Metrics */}
                <div className="flex items-center gap-6 sm:gap-12">
                  <span className="hidden sm:inline text-emerald-400 font-bold">
                    {item.winRate}% ({item.wins}/{item.games})
                  </span>
                  <span className="hidden sm:inline text-purple-400 font-bold">
                    {item.bestScore}
                  </span>
                  <div className="text-right">
                    <span className="pixel-text text-base sm:text-lg font-black text-[#00F0FF]">
                      {item.elo}
                    </span>
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
