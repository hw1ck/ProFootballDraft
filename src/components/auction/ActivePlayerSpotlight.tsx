'use client';

import React from 'react';
import { PlayerCard } from '../player/PlayerCard';
import { PlayerData, AuctionStateData } from '../../contexts/SocketContext';
import { formatCoins, getPositionBadgeColor } from '../../utils/formatters';
import { Shield, Sparkles, TrendingUp, Info } from 'lucide-react';

interface ActivePlayerSpotlightProps {
  player: PlayerData | null;
  auctionState: AuctionStateData | null;
}

export const ActivePlayerSpotlight: React.FC<ActivePlayerSpotlightProps> = ({ player, auctionState }) => {
  if (!player) {
    return (
      <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-8 text-center flex flex-col items-center justify-center min-h-[380px]">
        <div className="w-16 h-16 rounded-2xl bg-[#1e1e26] border border-[#2c2c35] flex items-center justify-center text-3xl mb-4 text-slate-500">
          ⚽
        </div>
        <h3 className="font-mono font-bold text-lg text-slate-300">AUCTION ARENA IDLE</h3>
        <p className="text-xs text-slate-400 mt-2 max-w-sm">
          {auctionState?.message || 'Waiting for the host to queue or start the live bidding lot.'}
        </p>
      </div>
    );
  }

  const posStyle = getPositionBadgeColor(player.position);
  const isBidding = auctionState?.status === 'bidding';
  const isSold = auctionState?.status === 'sold' || player.status === 'sold';
  const isUnsold = auctionState?.status === 'unsold' || player.status === 'unsold';

  const estVal = player.estimatedValue || 100;

  return (
    <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] overflow-hidden shadow-2xl relative">
      {/* Top Status Banner */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-[#1e1e26] border-b border-[#2c2c35] text-xs">
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}
          >
            {player.position}
          </span>
          {player.role && (
            <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-wider bg-[#282834] text-slate-300 border border-[#2c2c35]">
              {player.role}
            </span>
          )}
          {auctionState?.lotNumber && (
            <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#161b24] text-emerald-400 border border-emerald-500/30">
              LOT #{auctionState.lotNumber}
            </span>
          )}
        </div>

        <div>
          {isBidding && (
            <span className="flex items-center space-x-1.5 text-emerald-400 font-bold font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>LIVE LOT</span>
            </span>
          )}
          {isSold && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold font-mono text-[11px]">
              🔨 SOLD
            </span>
          )}
          {isUnsold && (
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold font-mono text-[11px]">
              PASSED (UNSOLD)
            </span>
          )}
          {auctionState?.status === 'paused' && (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold font-mono text-[11px]">
              ⏸️ PAUSED
            </span>
          )}
          {auctionState?.status === 'idle' && (
            <span className="px-2 py-0.5 rounded bg-slate-500/20 text-slate-400 border border-slate-500/40 font-bold font-mono text-[11px]">
              QUEUED
            </span>
          )}
        </div>
      </div>

      {/* Main Player Display */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Official FIFA/EA FC PlayerCard */}
        <div className="md:col-span-5 flex flex-col items-center text-center">
          <PlayerCard
            ovr={player.stats?.overall || 82}
            position={player.position}
            name={player.displayName || player.name}
            surname={player.surname}
            club={player.club}
            nation={player.nationality}
            nationCode={player.nationalityCode}
            role={player.role}
            rarity={player.rarity || 'RARE'}
            pac={player.stats?.pace || 75}
            sho={player.stats?.shooting || 75}
            pas={player.stats?.passing || 75}
            dri={player.stats?.dribbling || 75}
            def={player.stats?.defending || 75}
            phy={player.stats?.physical || 75}
            photoUrl={player.photoUrl}
          />
        </div>

        {/* Right: Comprehensive Scouting Dossier */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                {player.league || 'Top League'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">{player.nationality}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight mt-0.5">
              {player.name}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {player.club} • #{player.jerseyNumber || '10'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#121216] border border-[#2c2c35] text-center">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Age</span>
              <span className="text-sm font-bold font-mono text-slate-200">{player.age} yrs</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#121216] border border-[#2c2c35] text-center">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Foot</span>
              <span className="text-sm font-bold font-mono text-slate-200">{player.preferredFoot || 'Right'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#121216] border border-[#2c2c35] text-center">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Est. Value</span>
              <span className="text-sm font-bold font-mono text-emerald-400">~{formatCoins(estVal)}</span>
            </div>
          </div>

          {/* Valuation Intelligence Info Box */}
          <div className="p-3 rounded-xl bg-[#161a22] border border-[#232c3d] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">Bargain Threshold:</span>
                <span className="text-[11px] text-slate-400">
                  Sign for ≤ {Math.floor(estVal / 3)} coins to trigger a 🟢 Bargain!
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              ≤ {Math.floor(estVal / 3)} 🪙
            </span>
          </div>

          {/* Opening Bid Info */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>Opening Reserve: 10 coins</span>
            <span>Season: 2026-27</span>
          </div>
        </div>
      </div>
    </div>
  );
};
