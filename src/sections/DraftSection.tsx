'use client';

import React, { useState } from 'react';

interface DraftCard {
  id: string;
  name: string;
  ovr: number;
  pos: string;
  role: string;
  roleColor: string;
  isTopPick?: boolean;
}

const DRAFT_CARDS: DraftCard[] = [
  {
    id: 'haaland',
    name: 'Haaland',
    ovr: 91,
    pos: 'ST',
    role: 'FINISHER',
    roleColor: '#EC4899',
    isTopPick: true,
  },
  {
    id: 'bellingham',
    name: 'Bellingham',
    ovr: 90,
    pos: 'CM',
    role: 'BOX-TO-BOX',
    roleColor: '#8B5CF6',
  },
  {
    id: 'saka',
    name: 'Saka',
    ovr: 88,
    pos: 'RW',
    role: 'WINGER',
    roleColor: '#10E7B2',
  },
];

export const DraftSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('haaland');

  return (
    <section className="space-y-5">
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="pixel-text text-base sm:text-xl text-white font-bold tracking-tight">
          DRAFT WITH FRIENDS
        </h2>
        <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
          Five cards. One choice. Draft 16 players in Classic Draft. Every pick shapes your squad.
        </p>
      </div>

      {/* Card Picker Component Container */}
      <div className="bg-[#101626]/90 backdrop-blur-md border border-[#00F0FF]/20 rounded-2xl p-4 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between pb-3.5 sm:pb-4 text-xs font-mono border-b border-[#00F0FF]/15 mb-4">
          <span className="text-[#00F0FF] font-bold text-xs tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]"></span>
            PICK YOUR CARD
          </span>
          <span className="text-[#94a3b8] text-[11px] sm:text-xs bg-[#151D30] px-2.5 py-1 rounded-md border border-[#202E4E]">
            ROUND 3 / 16
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
          {DRAFT_CARDS.map((card) => {
            const isSelected = selectedId === card.id;

            return (
              <div
                key={card.id}
                onClick={() => setSelectedId(card.id)}
                className={`relative rounded-xl p-2.5 sm:p-4 text-center cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#251A4A] via-[#1A1836] to-[#0F1424] border-2 border-[#00F0FF] scale-[1.02] shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                    : 'bg-[#121829] border border-[#202E4E] hover:border-[#8B5CF6]/60 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                }`}
              >
                {card.isTopPick && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] text-[#0B0E17] pixel-text text-[6px] sm:text-[7px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded shadow-[0_0_10px_rgba(0,240,255,0.5)] whitespace-nowrap z-10">
                    TOP PICK
                  </div>
                )}
                <div>
                  <div
                    className={`text-xl sm:text-3xl font-black mt-1 sm:mt-2 ${
                      isSelected
                        ? 'text-[#F59E0B] drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                        : 'text-white'
                    }`}
                  >
                    {card.ovr}
                  </div>
                  <div
                    className={`text-[9px] sm:text-[10px] font-mono font-bold mb-2 sm:mb-3 ${
                      isSelected ? 'text-[#00F0FF]' : 'text-[#94a3b8]'
                    }`}
                  >
                    {card.pos}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] sm:text-sm font-bold text-white truncate">
                    {card.name}
                  </div>
                  <div
                    className="text-[8px] sm:text-[10px] font-mono uppercase tracking-tighter mt-1 font-semibold truncate"
                    style={{ color: card.roleColor }}
                  >
                    {card.role}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
