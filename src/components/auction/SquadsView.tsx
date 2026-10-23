'use client';

import React, { useEffect, useState } from 'react';
import { formatCoins, getPositionBadgeColor } from '../../utils/formatters';
import { SQUAD_SIZE, calculateMaxBid, hasGoalkeeper, isBargain } from '../../utils/auctionMath';
import { AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { API_BASE } from '../../utils/apiConfig';

interface SquadPlayer {
  _id: string;
  name: string;
  position: string;
  role: string;
  currentPrice: number;
  basePrice: number;
  estimatedValue?: number;
  nationality: string;
  stats?: {
    overall: number;
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  };
}

interface TeamRoster {
  _id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  budget: number;
  spent: number;
  remainingBudget: number;
  maxPlayers: number;
  players: SquadPlayer[];
}


export const SquadsView: React.FC = () => {
  const [teams, setTeams] = useState<TeamRoster[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/teams`);
        const data = await res.json();
        if (data.success && data.teams.length > 0) {
          setTeams(data.teams);
          setSelectedTeamId(data.teams[0]._id);
        }
      } catch (e) {
        console.error('Error loading squads:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeTeam = teams.find((t) => t._id === selectedTeamId) || teams[0];

  if (loading || !activeTeam) {
    return (
      <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-8 text-center text-xs font-mono text-slate-400">
        Loading 18-man rosters...
      </div>
    );
  }

  const players = activeTeam.players || [];
  const squadCount = players.length;
  const remainingCoins = Math.max(0, activeTeam.budget - activeTeam.spent);
  const maxBid = calculateMaxBid(remainingCoins, squadCount, SQUAD_SIZE);
  const keeperPresent = hasGoalkeeper(players);

  return (
    <div className="space-y-4">
      {/* Club Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {teams.map((t) => {
          const isSelected = t._id === activeTeam._id;
          const count = t.players?.length || 0;
          return (
            <button
              key={t._id}
              onClick={() => setSelectedTeamId(t._id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all flex-shrink-0 ${
                isSelected
                  ? 'bg-[#1e1e26] border-emerald-500 text-white shadow-md'
                  : 'bg-[#18181f] border-[#2c2c35] text-slate-400 hover:text-white'
              }`}
            >
              <span
                className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-white"
                style={{ backgroundColor: t.color || '#10B981' }}
              >
                {t.logo || t.shortName.slice(0, 2)}
              </span>
              <span>{t.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#121216] text-slate-400">
                {count}/18
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Club Summary */}
      <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl border font-bold"
            style={{
              borderColor: activeTeam.color || '#10B981',
              backgroundColor: `${activeTeam.color}25`,
            }}
          >
            {activeTeam.logo || '⚽'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-mono font-bold text-base sm:text-lg text-white">
                {activeTeam.name}
              </h3>
              {keeperPresent ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>GK Secured</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Needs GK</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Squad: <strong className="text-white">{squadCount}</strong> / 18 players signed ({18 - squadCount} slots left)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Spent</span>
            <span className="text-white font-bold text-sm">{formatCoins(activeTeam.spent)} 🪙</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Remaining Purse</span>
            <span className="text-emerald-400 font-bold text-sm">{formatCoins(remainingCoins)} 🪙</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Max Valid Bid</span>
            <span className="text-cyan-400 font-bold text-sm">{formatCoins(maxBid)} 🪙</span>
          </div>
        </div>
      </div>

      {/* 18-Slot Progress Indicator */}
      <div className="p-3 bg-[#121216] rounded-xl border border-[#2c2c35]">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
          <span>18-Man Squad Blueprint</span>
          <span>{squadCount}/18 Filled</span>
        </div>
        <div className="grid grid-cols-18 gap-1.5 w-full">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all ${
                i < squadCount
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                  : 'bg-[#232330] border border-[#333344]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Player Roster Grid */}
      {players.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#2c2c35] bg-[#18181f]/40 p-12 text-center">
          <span className="text-3xl block mb-2">📋</span>
          <h4 className="font-mono font-bold text-sm text-slate-300">NO ACQUISITIONS YET</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {activeTeam.name} has not signed any players in the auction yet. Head over to the Arena to start bidding!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {players.map((p) => {
            const badge = getPositionBadgeColor(p.position);
            const price = p.currentPrice || p.basePrice || 10;
            const estVal = p.estimatedValue || 100;
            const bargain = isBargain(price, estVal);

            return (
              <div
                key={p._id}
                className="rounded-xl border border-[#2c2c35] bg-[#121216] p-4 flex flex-col justify-between hover:border-slate-500 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase border ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {p.position}
                    </span>
                    <span className="font-mono text-lg font-bold text-amber-400">
                      {p.stats?.overall || 80}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2">{p.name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {p.role} • {p.nationality}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2c2c35] flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Acquired For</span>
                    <span className="font-bold text-emerald-400">{formatCoins(price)} 🪙</span>
                  </div>

                  {bargain && (
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      <Sparkles className="w-3 h-3" />
                      <span>Bargain</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
