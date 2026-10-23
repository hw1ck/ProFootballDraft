'use client';

import React from 'react';
import Link from 'next/link';

export const FinalCTASection: React.FC = () => {
  return (
    <section className="pt-4">
      <div className="relative bg-gradient-to-b from-[#121A2F] to-[#0D1220] border border-[#00F0FF]/30 rounded-3xl p-6 sm:p-10 text-center space-y-5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Corner ambient glow */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#00F0FF]/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-[#8B5CF6]/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Trophy Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#18233D] border border-[#F59E0B]/50 flex items-center justify-center text-[#F59E0B] shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <span className="material-symbols-outlined text-2xl">trophy</span>
        </div>

        <h3 className="pixel-text text-sm sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00F0FF] to-[#8B5CF6] font-bold leading-relaxed max-w-md mx-auto drop-shadow-[0_0_12px_rgba(0,240,255,0.25)]">
          READY TO BUILD YOUR WINNING SQUAD?
        </h3>

        <p className="text-xs sm:text-sm text-[#94a3b8] max-w-sm mx-auto leading-relaxed">
          Join a room, draft 16 players, and see how your squad ranks among friends.
        </p>

        <div className="pt-2">
          <Link
            href="/auction"
            className="w-full max-w-sm bg-gradient-to-r from-[#00F0FF] via-[#6366F1] to-[#8B5CF6] hover:brightness-110 active:scale-[0.99] text-[#0B0E17] py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 mx-auto cyber-glow-btn transition-all font-mono tracking-wide cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <span className="material-symbols-outlined text-base text-[#0B0E17]">rocket_launch</span>
            <span className="font-bold text-black uppercase tracking-wider">Join Draft</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
