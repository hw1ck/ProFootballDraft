'use client';

import React, { useState } from 'react';

export const BuildSquadSection: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>('ST');

  const nodes = [
    { id: 'LW', row: 'att', label: 'LW', active: activeNode === 'LW' },
    { id: 'ST', row: 'att', label: 'ST', active: activeNode === 'ST' },
    { id: 'RW', row: 'att', label: 'RW', active: activeNode === 'RW' },
    { id: 'CM1', row: 'mid', label: 'CM', active: activeNode === 'CM1' },
    { id: 'CDM', row: 'mid', label: 'CDM', active: activeNode === 'CDM' },
    { id: 'CM2', row: 'mid', label: 'CM', active: activeNode === 'CM2' },
    { id: 'LB', row: 'def', label: 'LB', active: activeNode === 'LB' },
    { id: 'CB1', row: 'def', label: 'CB', active: activeNode === 'CB1' },
    { id: 'CB2', row: 'def', label: 'CB', active: activeNode === 'CB2' },
    { id: 'RB', row: 'def', label: 'RB', active: activeNode === 'RB' },
  ];

  return (
    <section className="space-y-5">
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="pixel-text text-base sm:text-xl text-white font-bold tracking-tight">
          BUILD YOUR SQUAD
        </h2>
        <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
          Big names aren't enough. Find the right positions, discover synergies, and turn your drafted talent into a winning XI.
        </p>
      </div>

      {/* Tactical Pitch Board Card */}
      <div className="bg-[#101626]/90 backdrop-blur-md border border-[#00F0FF]/20 rounded-2xl p-4 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
        <div className="relative w-full h-72 sm:h-80 bg-[#0B0F1A] border border-[#00F0FF]/25 rounded-xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden pitch-grid-bg shadow-inner">
          {/* Pitch Center Circle / Arcs Decor */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 sm:w-36 h-32 sm:h-36 rounded-full border border-[#00F0FF]/25 shadow-[0_0_15px_rgba(0,240,255,0.1)]"></div>
            <div className="absolute w-full h-[1px] bg-[#00F0FF]/25 shadow-[0_0_8px_rgba(0,240,255,0.2)]"></div>
          </div>

          {/* Connecting Synergy Lines between Midfield */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path
              className="drop-shadow-[0_0_6px_#00F0FF]"
              d="M 120 160 Q 200 110 280 160"
              fill="none"
              stroke="#00F0FF"
              strokeDasharray="3,3"
              strokeWidth="1.5"
            ></path>
          </svg>

          {/* Attackers Row (LW, ST, RW) */}
          <div className="relative z-10 flex justify-around px-2 sm:px-4 pt-1">
            <button
              type="button"
              onClick={() => setActiveNode('LW')}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                activeNode === 'LW'
                  ? 'bg-gradient-to-b from-[#2E1E5E] to-[#1C183B] border-2 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_14px_rgba(0,240,255,0.6)]'
                  : 'bg-[#151C33] border border-[#8B5CF6]/50 hover:border-[#8B5CF6] text-[#c7d2fe] shadow-[0_0_10px_rgba(139,92,246,0.3)]'
              }`}
            >
              LW
            </button>
            <button
              type="button"
              onClick={() => setActiveNode('ST')}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                activeNode === 'ST'
                  ? 'bg-gradient-to-b from-[#2E1E5E] to-[#1C183B] border-2 border-[#00F0FF] text-[#F59E0B] shadow-[0_0_14px_rgba(0,240,255,0.6)]'
                  : 'bg-[#151C33] border border-[#8B5CF6]/50 hover:border-[#8B5CF6] text-[#c7d2fe] shadow-[0_0_10px_rgba(139,92,246,0.3)]'
              }`}
            >
              ST
            </button>
            <button
              type="button"
              onClick={() => setActiveNode('RW')}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                activeNode === 'RW'
                  ? 'bg-gradient-to-b from-[#2E1E5E] to-[#1C183B] border-2 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_14px_rgba(0,240,255,0.6)]'
                  : 'bg-[#151C33] border border-[#8B5CF6]/50 hover:border-[#8B5CF6] text-[#c7d2fe] shadow-[0_0_10px_rgba(139,92,246,0.3)]'
              }`}
            >
              RW
            </button>
          </div>

          {/* Midfielders Row (CM, CDM, CM) */}
          <div className="relative z-10 flex justify-around px-2 items-center my-auto">
            <button
              type="button"
              onClick={() => setActiveNode('CM1')}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                activeNode === 'CM1'
                  ? 'bg-gradient-to-b from-[#281A50] to-[#161B30] border-2 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                  : 'bg-[#151C33] border border-[#00F0FF]/40 text-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.2)]'
              }`}
            >
              CM
            </button>
            <button
              type="button"
              onClick={() => setActiveNode('CDM')}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                activeNode === 'CDM'
                  ? 'bg-gradient-to-b from-[#281A50] to-[#161B30] border-2 border-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]'
                  : 'bg-[#151C33] border border-[#8B5CF6]/40 text-white/90 shadow-[0_0_8px_rgba(139,92,246,0.2)]'
              }`}
            >
              CDM
            </button>
            <button
              type="button"
              onClick={() => setActiveNode('CM2')}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                activeNode === 'CM2'
                  ? 'bg-gradient-to-b from-[#281A50] to-[#161B30] border-2 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                  : 'bg-[#151C33] border border-[#00F0FF]/40 text-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.2)]'
              }`}
            >
              CM
            </button>
          </div>

          {/* Defenders Row (LB, CB, CB, RB) */}
          <div className="relative z-10 flex justify-between px-3 sm:px-6 pb-1">
            <button
              type="button"
              onClick={() => setActiveNode('LB')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#11172A] border border-[#202E4E] hover:border-[#00F0FF]/50 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-[#94a3b8] hover:text-white cursor-pointer transition-all"
            >
              LB
            </button>
            <button
              type="button"
              onClick={() => setActiveNode('CB1')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#151C33] border border-[#8B5CF6]/50 hover:border-[#8B5CF6] flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white shadow-[0_0_6px_rgba(139,92,246,0.25)] cursor-pointer transition-all"
            >
              CB
            </button>
            <button
              type="button"
              onClick={() => setActiveNode('CB2')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#151C33] border border-[#8B5CF6]/50 hover:border-[#8B5CF6] flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white shadow-[0_0_6px_rgba(139,92,246,0.25)] cursor-pointer transition-all"
            >
              CB
            </button>
            <button
              type="button"
              onClick={() => setActiveNode('RB')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#11172A] border border-[#202E4E] hover:border-[#00F0FF]/50 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-[#94a3b8] hover:text-white cursor-pointer transition-all"
            >
              RB
            </button>
          </div>
        </div>

        {/* Formation & Role Synergy Footer Info Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-4 text-xs font-mono border-t border-[#00F0FF]/15 mt-4">
          <div>
            <span className="text-white font-bold block text-xs tracking-wider">
              FORMATION: <span className="text-[#00F0FF]">4-3-3</span>
            </span>
            <span className="text-[#EC4899] text-[10px] font-semibold tracking-wide">ATTACKING</span>
          </div>
          <div className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#00F0FF]/20 border border-[#00F0FF]/40 px-3.5 sm:px-4 py-1.5 rounded-full text-[#00F0FF] font-bold text-[10px] sm:text-[11px] tracking-wider shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            ROLE SYNERGY ACTIVE
          </div>
        </div>
      </div>
    </section>
  );
};
