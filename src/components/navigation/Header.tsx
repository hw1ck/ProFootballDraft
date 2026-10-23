'use client';

import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6 pb-4 flex items-center justify-between relative z-20">
      <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
        <div className="w-9 h-9 rounded-xl bg-[#111728] border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-transform group-hover:scale-105">
          <span className="material-symbols-outlined text-lg">sports_soccer</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="pixel-text text-xs sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-white via-[#dbfcff] to-[#00F0FF] font-bold tracking-tight">
            ProFootballDraft
          </span>
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse"></span>
        </div>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/auction"
          className="hidden xs:inline-flex items-center gap-1.5 bg-[#121829]/90 hover:bg-[#1a2238] border border-[#10E7B2]/40 hover:border-[#10E7B2] text-[#10E7B2] font-mono text-[11px] sm:text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all shadow-[0_0_10px_rgba(16,231,178,0.15)] cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#10E7B2] shadow-[0_0_6px_#10E7B2] animate-pulse"></span>
          <span>Live Arena</span>
        </Link>
        <button
          type="button"
          className="bg-[#121829]/90 hover:bg-[#1a2238] border border-[#00F0FF]/30 hover:border-[#00F0FF]/70 text-[#dbfcff] hover:text-[#00F0FF] font-semibold text-xs px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all shadow-[0_0_12px_rgba(0,240,255,0.12)] cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </header>
  );
};
