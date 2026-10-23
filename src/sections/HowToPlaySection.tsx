'use client';

import React from 'react';

export const HowToPlaySection: React.FC = () => {
  return (
    <section className="space-y-5">
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="pixel-text text-base sm:text-xl text-white font-bold tracking-tight">
          HOW TO PLAY
        </h2>
        <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
          Three simple steps: draft, build, and rank.
        </p>
      </div>

      {/* 3 Stacked Step Cards */}
      <div className="space-y-3.5">
        {/* Step 01 */}
        <div className="bg-[#101626]/90 backdrop-blur-md border border-[#00F0FF]/15 hover:border-[#00F0FF]/40 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] group hover:scale-[1.01]">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#141C30] border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF] font-mono text-sm font-bold shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            01
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white">Pick a Draft</h4>
            <p className="text-xs text-[#94a3b8] mt-0.5 leading-normal">
              Classic Draft, Merge Draft, and more formats with live friend lobbies.
            </p>
          </div>
        </div>

        {/* Step 02 */}
        <div className="bg-[#101626]/90 backdrop-blur-md border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] group hover:scale-[1.01]">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#1D173B] border border-[#8B5CF6]/40 flex items-center justify-center text-[#A855F7] font-mono text-sm font-bold shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.25)]">
            02
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white">Draft with Friends</h4>
            <p className="text-xs text-[#94a3b8] mt-0.5 leading-normal">
              Draft 16 players, then optimize your tactical chemistry in the Locker Room.
            </p>
          </div>
        </div>

        {/* Step 03 */}
        <div className="bg-[#101626]/90 backdrop-blur-md border border-[#EC4899]/20 hover:border-[#EC4899]/50 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] group hover:scale-[1.01]">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#26132A] border border-[#EC4899]/40 flex items-center justify-center text-[#EC4899] font-mono text-sm font-bold shrink-0 shadow-[0_0_10px_rgba(236,72,153,0.25)]">
            03
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white">Rank Your Squad</h4>
            <p className="text-xs text-[#94a3b8] mt-0.5 leading-normal">
              Lock your team. Once everyone locks, final head-to-head metrics settle the rivalry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
