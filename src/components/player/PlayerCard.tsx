'use client';

import React from 'react';
import { getPositionBadgeColor } from '../../utils/formatters';

interface PlayerCardProps {
  ovr: number;
  position: string;
  name: string;
  surname?: string;
  club?: string;
  nation?: string;
  nationCode?: string;
  role?: string;
  rarity?: string;
  pac?: number;
  sho?: number;
  pas?: number;
  dri?: number;
  def?: number;
  phy?: number;
  photoUrl?: string;
  isTopPick?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  ovr,
  position,
  name,
  surname,
  club,
  nation,
  nationCode,
  role,
  rarity = 'RARE',
  pac = 75,
  sho = 75,
  pas = 75,
  dri = 75,
  def = 75,
  phy = 75,
  photoUrl,
  isTopPick,
}) => {
  const displaySurname = surname || name.split(' ').pop()?.toUpperCase() || name.toUpperCase();
  const posStyle = getPositionBadgeColor(position);

  return (
    <div className="relative w-full max-w-[240px] aspect-[1/1.45] rounded-2xl p-1 bg-gradient-to-b from-[#1e2a38] via-[#121c27] to-[#0a1017] border border-[#2e4057] shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-white select-none flex flex-col justify-between overflow-hidden">
      {/* Top Gold / Glow Accent Line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent opacity-80" />

      {/* Rarity Ribbon */}
      <div className="pt-2 text-center">
        <span className="text-[9px] font-mono tracking-widest text-[#7dd3fc] uppercase font-semibold">
          — {rarity} —
        </span>
      </div>

      {/* Header: Rating, Position, Nation, Club Crest + Player Cutout */}
      <div className="px-3 pt-1 flex items-start justify-between">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black font-mono leading-none tracking-tight text-white drop-shadow">
            {ovr}
          </span>
          <span className="text-xs font-black font-mono mt-0.5 text-[#38bdf8] uppercase">
            {position}
          </span>
          {nationCode && (
            <span className="text-[10px] font-mono text-slate-300 mt-1 uppercase font-bold">
              {nationCode}
            </span>
          )}
        </div>

        {/* Player Image / Silhouette */}
        <div className="relative w-28 h-28 flex items-end justify-center overflow-hidden">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="w-full h-full object-contain object-bottom filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)]"
              onError={(e) => {
                // Fallback to silhouette
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#1b2533] border border-[#2a384c] flex items-center justify-center text-3xl mb-4">
              ⚽
            </div>
          )}
        </div>
      </div>

      {/* Name and Club */}
      <div className="text-center px-2 py-1">
        <h3 className="text-base font-black font-mono tracking-wide uppercase truncate text-white drop-shadow">
          {displaySurname}
        </h3>
        <p className="text-[10px] font-mono text-slate-300 truncate uppercase tracking-wider">
          {club || 'FREE AGENT'}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-4 h-[1px] bg-gradient-to-r from-transparent via-[#2e4057] to-transparent" />

      {/* 2x3 Attribute Grid */}
      <div className="px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[10px]">PAC</span>
          <span className="font-bold text-white">{pac}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[10px]">DRI</span>
          <span className="font-bold text-white">{dri}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[10px]">SHO</span>
          <span className="font-bold text-white">{sho}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[10px]">DEF</span>
          <span className="font-bold text-white">{def}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[10px]">PAS</span>
          <span className="font-bold text-white">{pas}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[10px]">PHY</span>
          <span className="font-bold text-white">{phy}</span>
        </div>
      </div>

      {/* License Footer */}
      <div className="pb-1.5 text-center text-[8px] font-mono text-slate-500 uppercase tracking-widest">
        EA SPORTS FC™ 2026-27
      </div>
    </div>
  );
};
