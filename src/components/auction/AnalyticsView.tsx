'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Award, Users } from 'lucide-react';
import { formatMoney, getPositionBadgeColor } from '../../utils/formatters';
import { API_BASE } from '../../utils/apiConfig';

interface AnalyticsData {
  totalPlayers: number;
  soldCount: number;
  unsoldCount: number;
  upcomingCount: number;
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  averagePlayerPrice: number;
  positionSpend: {
    GK: { count: number; spent: number };
    DEF: { count: number; spent: number };
    MID: { count: number; spent: number };
    FWD: { count: number; spent: number };
  };
  topBuys: Array<{
    id: string;
    name: string;
    position: string;
    role: string;
    rating: number;
    club: string;
    basePrice: number;
    soldPrice: number;
    inflation: number;
    team?: {
      name: string;
      shortName: string;
      color: string;
      logo: string;
    };
  }>;
}


export const AnalyticsView: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/auction/analytics`);
        const json = await res.json();
        if (json.success) {
          setData(json.analytics);
        }
      } catch (e) {
        console.error('Error loading analytics:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-8 text-center text-xs font-mono text-slate-400">
        Loading auction analytics & market insights...
      </div>
    );
  }

  const positions = ['GK', 'DEF', 'MID', 'FWD'] as const;

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-4">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Market Spend</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-1 block">
            {formatMoney(data.totalSpent)}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
            Out of {formatMoney(data.totalBudget)} league pool
          </span>
        </div>

        <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-4">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Average Transfer Fee</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-cyan-400 mt-1 block">
            {formatMoney(data.averagePlayerPrice)}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
            Across {data.soldCount} completed signings
          </span>
        </div>

        <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-4">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Draft Clearance Rate</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-amber-400 mt-1 block">
            {data.totalPlayers > 0 ? Math.round((data.soldCount / data.totalPlayers) * 100) : 0}%
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
            {data.soldCount} Sold • {data.unsoldCount} Unsold
          </span>
        </div>

        <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-4">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Remaining Talent Pool</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-purple-400 mt-1 block">
            {data.upcomingCount}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
            Players waiting in queue
          </span>
        </div>
      </div>

      {/* Position Breakdown */}
      <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-5">
        <h3 className="font-['Silkscreen',monospace] text-sm text-white mb-4">
          CAPITAL ALLOCATION BY POSITION
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {positions.map((pos) => {
            const pData = data.positionSpend[pos] || { count: 0, spent: 0 };
            const badge = getPositionBadgeColor(pos);
            const pct = data.totalSpent > 0 ? Math.round((pData.spent / data.totalSpent) * 100) : 0;

            return (
              <div key={pos} className="rounded-xl border border-[#2c2c35] bg-[#121216] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {pos}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">{pData.count} signed</span>
                </div>

                <div>
                  <span className="text-lg font-black font-mono text-white block">
                    {formatMoney(pData.spent)}
                  </span>
                  <div className="w-full bg-[#1e1e26] h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                    {pct}% of market expenditure
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 5 Record Buys */}
      <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-5">
        <h3 className="font-['Silkscreen',monospace] text-sm text-white mb-3">
          TOP RECORD TRANSFERS
        </h3>

        {data.topBuys.length === 0 ? (
          <div className="text-center text-xs font-mono text-slate-500 py-8">
            No sales recorded yet. Once players are hammered down, top transfers will appear here.
          </div>
        ) : (
          <div className="space-y-2">
            {data.topBuys.map((p, idx) => (
              <div
                key={p.id}
                className="p-3 rounded-xl border border-[#2c2c35] bg-[#121216] flex items-center justify-between hover:border-slate-500 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-['Silkscreen',monospace] font-bold text-amber-400 text-sm w-4">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white">{p.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1e1e26] text-amber-300">
                        {p.rating} OVR
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      {p.position} • {p.club}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-emerald-400 block">
                    {formatMoney(p.soldPrice)}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    +{p.inflation}% over base ({p.team?.shortName || 'Club'})
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
