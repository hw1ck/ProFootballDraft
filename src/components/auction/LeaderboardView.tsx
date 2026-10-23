'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Trophy, TrendingUp, Users, DollarSign } from 'lucide-react';
import { formatMoney } from '../../utils/formatters';
import { API_BASE } from '../../utils/apiConfig';

interface TeamItem {
  _id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  budget: number;
  spent: number;
  remainingBudget: number;
  playerCount: number;
  maxPlayers: number;
  avgRating: number;
  totalRating: number;
  positions: {
    GK: number;
    DEF: number;
    MID: number;
    FWD: number;
  };
}


export const LeaderboardView: React.FC = () => {
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTeams = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/teams`);
      const data = await res.json();
      if (data.success) {
        setTeams(data.teams);
      }
    } catch (e) {
      console.error('Error fetching teams leaderboard:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
    const interval = setInterval(fetchTeams, 5000);
    return () => clearInterval(interval);
  }, [fetchTeams]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-8 text-center text-xs font-mono text-slate-400">
        Loading franchise standings...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['Silkscreen',monospace] text-base sm:text-lg text-white">
            FRANCHISE FINANCIAL STANDINGS
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time cap space, squad count, and roster ratings.
          </p>
        </div>
        <button
          onClick={fetchTeams}
          className="text-xs font-mono text-emerald-400 hover:underline px-3 py-1.5 rounded-lg bg-[#1e1e26] border border-[#2c2c35]"
        >
          Refresh Standings
        </button>
      </div>

      <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121216] border-b border-[#2c2c35] text-[10px] uppercase font-mono text-slate-400">
              <tr>
                <th className="py-3 px-4">Club</th>
                <th className="py-3 px-4">Squad</th>
                <th className="py-3 px-4">Position Split</th>
                <th className="py-3 px-4 text-right">Spent</th>
                <th className="py-3 px-4 text-right">Remaining Cap</th>
                <th className="py-3 px-4 text-center">Avg OVR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2c2c35]">
              {teams.map((t, idx) => (
                <tr key={t._id} className="hover:bg-[#1e1e26]/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-slate-500 font-bold w-4">{idx + 1}</span>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border"
                        style={{ borderColor: t.color || '#10B981', backgroundColor: `${t.color}20` }}
                      >
                        {t.logo || '⚽'}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{t.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{t.shortName}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-slate-200">
                      {t.playerCount} / {t.maxPlayers}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1 font-mono text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        GK {t.positions?.GK || 0}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        DEF {t.positions?.DEF || 0}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        MID {t.positions?.MID || 0}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        FWD {t.positions?.FWD || 0}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-300">
                    {formatMoney(t.spent)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                    {formatMoney(t.remainingBudget)}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="font-['Silkscreen',monospace] font-bold text-amber-400 text-sm">
                      {t.avgRating || '--'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
