'use client';

import React, { useState } from 'react';
import { History, TrendingUp, Radio, AlertCircle } from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';
import { formatCoins } from '../../utils/formatters';

export const BidHistoryStream: React.FC = () => {
  const { auctionState } = useSocket();
  const [tab, setTab] = useState<'bids' | 'feed'>('bids');

  const bids = auctionState?.bidHistory || [];
  const feed = auctionState?.activityFeed || [];

  return (
    <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-4 flex flex-col h-full max-h-[380px]">
      <div className="flex items-center justify-between pb-3 border-b border-[#2c2c35] mb-3">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setTab('bids')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              tab === 'bids'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            BID LOG ({bids.length})
          </button>
          <button
            onClick={() => setTab('feed')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              tab === 'feed'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            LIVE FEED
          </button>
        </div>

        <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>REAL-TIME</span>
        </span>
      </div>

      <div className="overflow-y-auto space-y-2 flex-1 pr-1 custom-scrollbar">
        {tab === 'bids' ? (
          bids.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-center text-slate-500 text-xs font-mono">
              <span>No bids placed in this lot yet</span>
            </div>
          ) : (
            bids.map((b, idx) => (
              <div
                key={`${b.teamId}-${b.amount}-${idx}`}
                className={`p-2 rounded-xl border flex items-center justify-between transition-all text-xs ${
                  idx === 0
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-[#121216] border-[#2c2c35] text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: b.teamColor || '#10B981' }}
                  >
                    {b.teamShort?.slice(0, 2) || '⚽'}
                  </span>
                  <div>
                    <span className="font-bold block leading-tight">{b.teamName}</span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-sm block">
                    {formatCoins(b.amount)} 🪙
                  </span>
                  {idx === 0 && (
                    <span className="text-[9px] uppercase font-bold text-emerald-400 font-mono flex items-center justify-end space-x-0.5">
                      <TrendingUp className="w-2.5 h-2.5" />
                      <span>LEADER</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )
        ) : (
          feed.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-center text-slate-500 text-xs font-mono">
              <span>Feed is waiting for lot events</span>
            </div>
          ) : (
            feed.map((f, i) => (
              <div
                key={i}
                className="p-2 rounded-xl bg-[#121216] border border-[#23232e] text-[11px] font-mono text-slate-300 flex items-start space-x-2"
              >
                <span className="mt-0.5 text-xs">
                  {f.type === 'sold' ? '🔨' : f.type === 'anti_snipe' ? '⚡' : f.type === 'skip' ? '⏭️' : '•'}
                </span>
                <div className="flex-1">
                  <span>{f.text}</span>
                  <span className="block text-[9px] text-slate-600 mt-0.5">
                    {new Date(f.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};
