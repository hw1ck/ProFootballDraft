'use client';

import React, { useState } from 'react';

export const PlayTogetherSection: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const roomCode = 'X7K89';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section id="room-lobby" className="space-y-5 scroll-mt-24">
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="pixel-text text-base sm:text-xl text-white font-bold tracking-tight">
          PLAY TOGETHER
        </h2>
        <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
          Create a room, invite friends with a code, and start a draft together.
        </p>
      </div>

      {/* Room Lobby Card */}
      <div className="bg-[#101626]/90 backdrop-blur-md border border-[#00F0FF]/20 rounded-2xl p-4 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45)] space-y-4">
        <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-[#00F0FF]/15">
          <span className="text-white font-bold text-xs tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10E7B2] shadow-[0_0_6px_#10E7B2]"></span>
            ROOM LOBBY
          </span>
          <div className="bg-[#141C30] border border-[#00F0FF]/30 px-3 py-1 rounded-full text-[#00F0FF] text-[11px] font-bold">
            3 / 4 JOINED
          </div>
        </div>

        {/* Code Input Box */}
        <div className="bg-gradient-to-r from-[#201940] to-[#12192F] border border-[#8B5CF6]/40 rounded-xl px-4 py-3 flex items-center justify-between shadow-[0_0_15px_rgba(139,92,246,0.15)]">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[#00F0FF] font-bold text-sm">#</span>
            <span className="text-white font-bold text-base sm:text-lg tracking-widest">{roomCode}</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="bg-[#0B0E17] hover:bg-[#161D32] border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-mono font-bold px-3.5 py-1.5 rounded-lg transition-all shadow-[0_0_8px_rgba(0,240,255,0.2)] active:scale-95 cursor-pointer"
          >
            {copied ? 'COPIED!' : 'COPY'}
          </button>
        </div>

        {/* Joined Avatars & Host Text */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#3B82F6] border-2 border-[#101626] flex items-center justify-center text-[10px] font-bold text-[#0B0E17] shadow-md">
                JD
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] border-2 border-[#101626] flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                MK
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#EF4444] border-2 border-[#101626] flex items-center justify-center text-[10px] font-bold text-[#0B0E17] shadow-md">
                SL
              </div>
            </div>
            <span className="text-xs text-[#94a3b8] font-mono">Host starts the draft.</span>
          </div>
          <span className="text-[11px] text-[#10E7B2] font-mono font-semibold flex items-center gap-1.5 self-end sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10E7B2] animate-pulse"></span> Ready
          </span>
        </div>
      </div>
    </section>
  );
};
