'use client';

import React from 'react';
import Link from 'next/link';

export const Hero: React.FC = () => {
  const scrollToRoom = () => {
    const el = document.getElementById('room-lobby');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-8 pt-2">
      {/* Mini Live Draft Widget Card */}
      <div className="bg-[#101626]/90 backdrop-blur-md border border-[#00F0FF]/25 hover:border-[#00F0FF]/40 rounded-2xl p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-all max-w-xl mx-auto">
        {/* Live Draft Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#00F0FF]/15 text-xs text-[#94a3b8]">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#10E7B2] shadow-[0_0_8px_#10E7B2] animate-pulse"></span>
            <span className="text-white font-bold tracking-wider">LIVE DRAFT #409</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#182138] border border-[#00F0FF]/20 px-3 py-1 rounded-md text-[#00F0FF] font-mono text-[11px] shadow-[0_0_10px_rgba(0,240,255,0.1)]">
            <span className="material-symbols-outlined text-xs">timer</span>
            <span>00:18s</span>
          </div>
        </div>

        {/* Player Card Inner */}
        <div className="bg-[#141b2d] border border-[#8B5CF6]/30 rounded-xl p-3.5 sm:p-4 my-3 flex items-center gap-3 sm:gap-4 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#00F0FF]/10 rounded-full blur-xl pointer-events-none"></div>

          {/* Card Thumbnail Badge */}
          <div className="w-16 h-20 rounded-lg bg-gradient-to-b from-[#2E1E5E] via-[#1D173B] to-[#111326] border border-[#8B5CF6]/60 p-1.5 flex flex-col justify-between shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.25)] relative">
            <div className="flex items-start justify-between">
              <span className="pixel-text text-sm font-bold text-[#F59E0B] drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]">
                91
              </span>
              <span className="text-[9px] font-bold text-[#00F0FF] bg-[#0B0E17]/80 px-1 rounded border border-[#00F0FF]/30">
                ST
              </span>
            </div>
            <div className="flex justify-center py-1">
              <span className="material-symbols-outlined text-[#00F0FF] text-base drop-shadow-[0_0_4px_#00F0FF]">
                sports_soccer
              </span>
            </div>
            <div className="text-[8px] font-mono text-center text-[#c7d2fe] uppercase tracking-tighter truncate font-bold">
              HAALAND
            </div>
          </div>

          {/* Player Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-white text-sm sm:text-base truncate">Erling Haaland</h4>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#EC4899] bg-[#EC4899]/10 border border-[#EC4899]/30 px-2 py-0.5 rounded tracking-wider uppercase shrink-0">
                FINISHER
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#94a3b8] mb-2.5 sm:mb-3 font-mono truncate">
              Manchester City · Norway
            </p>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-[#0B0F1A]/90 p-2 rounded-lg border border-[#00F0FF]/15 text-center font-mono">
              <div>
                <span className="text-[9px] sm:text-[10px] text-[#64748b] block font-semibold">PAC</span>
                <span className="text-[#00F0FF] font-bold text-xs drop-shadow-[0_0_4px_rgba(0,240,255,0.4)]">
                  89
                </span>
              </div>
              <div>
                <span className="text-[9px] sm:text-[10px] text-[#64748b] block font-semibold">SHO</span>
                <span className="text-[#F59E0B] font-bold text-xs drop-shadow-[0_0_4px_rgba(245,158,11,0.4)]">
                  93
                </span>
              </div>
              <div>
                <span className="text-[9px] sm:text-[10px] text-[#64748b] block font-semibold">PHY</span>
                <span className="text-[#10E7B2] font-bold text-xs drop-shadow-[0_0_4px_rgba(16,231,178,0.4)]">
                  88
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 text-xs text-[#94a3b8] font-mono">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shadow-[0_0_5px_#8B5CF6]"></span>
            <span>Pick 4 of 16 · Classic</span>
          </div>
          <span className="text-[#00F0FF] font-bold text-[11px] sm:text-xs tracking-wide drop-shadow-[0_0_6px_rgba(0,240,255,0.5)]">
            TURN: YOUR PICK
          </span>
        </div>
      </div>

      {/* Hero Headline & Subtext */}
      <div className="text-center space-y-4 pt-4">
        <h1 className="pixel-text text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00F0FF] to-[#8B5CF6] font-black leading-tight tracking-tight drop-shadow-[0_0_20px_rgba(0,240,255,0.25)]">
          DRAFT. BUILD.<br />WIN.
        </h1>
        <p className="text-xs sm:text-sm text-[#94a3b8] max-w-md mx-auto leading-relaxed px-2">
          Draft with friends, build a winning squad, and prove who built the best team in competitive real-time battles.
        </p>

        {/* CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 max-w-md mx-auto w-full px-2">
          <Link
            href="/auction"
            className="w-full sm:w-auto flex-1 bg-gradient-to-r from-[#00F0FF] via-[#6366F1] to-[#8B5CF6] hover:brightness-110 active:scale-[0.99] text-[#0B0E17] py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 cyber-glow-btn transition-all font-mono tracking-wide cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <span className="material-symbols-outlined text-base text-[#0B0E17]">sports_soccer</span>
            <span className="font-bold text-black uppercase tracking-wider">Play Now - Join Draft</span>
          </Link>
          <button
            type="button"
            onClick={scrollToRoom}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-semibold text-[#00F0FF] hover:text-white bg-[#121829]/80 hover:bg-[#1a233b] border border-[#00F0FF]/30 hover:border-[#00F0FF] px-5 py-3.5 rounded-full transition-all shadow-[0_0_12px_rgba(0,240,255,0.15)] font-mono cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]"></span>
            <span>JOIN A ROOM</span>
          </button>
        </div>
      </div>
    </section>
  );
};
