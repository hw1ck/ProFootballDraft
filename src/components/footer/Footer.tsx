'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-8 text-center space-y-5 border-t border-[#00F0FF]/10 mt-16">
      <div className="pixel-text text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00F0FF] to-[#8B5CF6] font-bold">
        ProFootballDraft
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#94a3b8] font-mono">
        <a className="hover:text-[#00F0FF] transition-colors" href="#terms">
          Terms
        </a>
        <a className="hover:text-[#00F0FF] transition-colors" href="#privacy">
          Privacy
        </a>
        <a className="hover:text-[#00F0FF] transition-colors" href="#support">
          Support
        </a>
        <Link className="hover:text-[#00F0FF] transition-colors" href="/auction">
          Auction Arena
        </Link>
        <a className="hover:text-[#00F0FF] transition-colors" href="#discord">
          Discord Community
        </a>
      </div>
      <p className="text-xs text-[#64748b] font-mono">
        © 2025 ProFootballDraft. All rights reserved.
      </p>
    </footer>
  );
};
