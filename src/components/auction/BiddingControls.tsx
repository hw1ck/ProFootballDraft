'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Gavel, CheckCircle, AlertTriangle, ShieldAlert, FastForward, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { formatCoins } from '../../utils/formatters';
import {
  SQUAD_SIZE,
  MIN_OPENING_BID,
  calculateMaxBid,
  calculateQuickBidTargets,
  hasGoalkeeper
} from '../../utils/auctionMath';

interface BiddingControlsProps {
  onOpenDemoModal: () => void;
}

export const BiddingControls: React.FC<BiddingControlsProps> = ({ onOpenDemoModal }) => {
  const { user, isAuthenticated, isManager } = useAuth();
  const { auctionState, timerSeconds, placeBid, skipCurrentLot } = useSocket();
  const [customBid, setCustomBid] = useState<string>('');

  const currentBid = auctionState?.currentBid || 0;
  const isBiddingOpen = auctionState?.status === 'bidding';
  const myTeam = user?.team;

  const squadPlayers = myTeam?.players || [];
  const squadCount = squadPlayers.length;
  const slotsRemaining = Math.max(0, SQUAD_SIZE - squadCount);
  const remainingBalance = myTeam ? Math.max(0, myTeam.budget - (myTeam.spent || 0)) : 0;
  const maxBid = calculateMaxBid(remainingBalance, squadCount);

  const needsKeeper = !hasGoalkeeper(squadPlayers);
  const isCurrentLeader = Boolean(
    myTeam &&
      auctionState?.currentBidder?._id &&
      (auctionState.currentBidder._id === myTeam._id || auctionState.currentBidder._id === myTeam.id)
  );

  const hasSkipped = useMemo(() => {
    if (!myTeam || !auctionState?.skippedManagers) return false;
    const teamIdStr = (myTeam._id || myTeam.id || '').toString();
    return auctionState.skippedManagers.some((m) => {
      const id = typeof m === 'object' && m !== null ? (m as any)._id : m;
      return id?.toString() === teamIdStr;
    });
  }, [myTeam, auctionState?.skippedManagers]);

  const quickBidTargets = useMemo(() => {
    return calculateQuickBidTargets(currentBid, maxBid);
  }, [currentBid, maxBid]);

  const minValidBid = currentBid === 0 ? MIN_OPENING_BID : currentBid + 1;

  // Handle Quick Bid
  const handleQuickBid = (targetAmount: number) => {
    if (!isBiddingOpen) return;
    if (squadCount >= SQUAD_SIZE) {
      alert('Squad is already full (18/18)!');
      return;
    }
    if (targetAmount > maxBid) {
      alert(`Bid exceeds your Max Bid safety limit of ${maxBid} coins! Must reserve 10 coins per empty slot.`);
      return;
    }
    placeBid(targetAmount);
  };

  // Handle Custom Bid Submit
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBiddingOpen) return;
    const amount = Number(customBid);
    if (!amount || isNaN(amount)) return;

    if (amount < minValidBid) {
      alert(`Minimum valid bid is ${minValidBid} coins.`);
      return;
    }
    if (amount > maxBid) {
      alert(`Bid exceeds your Max Bid limit of ${maxBid} coins! Must reserve 10 coins per empty slot.`);
      return;
    }
    placeBid(amount);
    setCustomBid('');
  };

  // Handle Skip Lot
  const handleSkip = () => {
    if (!isBiddingOpen || isCurrentLeader || hasSkipped) return;
    skipCurrentLot();
  };

  // Keyboard Shortcuts Binding: 1-4 for quick bids, S for skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Suppress when typing in inputs/textareas
      const activeTag = (document.activeElement?.tagName || '').toUpperCase();
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) {
        return;
      }

      if (!isBiddingOpen || !myTeam || squadCount >= SQUAD_SIZE) return;

      if (e.key === '1' && quickBidTargets[0] && !quickBidTargets[0].disabled) {
        e.preventDefault();
        handleQuickBid(quickBidTargets[0].targetAmount);
      } else if (e.key === '2' && quickBidTargets[1] && !quickBidTargets[1].disabled) {
        e.preventDefault();
        handleQuickBid(quickBidTargets[1].targetAmount);
      } else if (e.key === '3' && quickBidTargets[2] && !quickBidTargets[2].disabled) {
        e.preventDefault();
        handleQuickBid(quickBidTargets[2].targetAmount);
      } else if (e.key === '4' && quickBidTargets[3] && !quickBidTargets[3].disabled) {
        e.preventDefault();
        handleQuickBid(quickBidTargets[3].targetAmount);
      } else if ((e.key === 's' || e.key === 'S') && !isCurrentLeader && !hasSkipped) {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBiddingOpen, myTeam, squadCount, quickBidTargets, isCurrentLeader, hasSkipped]);

  // Countdown timer circle calculations
  const initialTimer = auctionState?.initialTimer || 30;
  const isUrgent = timerSeconds <= 5 && timerSeconds > 0 && auctionState?.isTimerRunning;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timerSeconds / initialTimer) * circumference;

  if (!isAuthenticated || !isManager || !myTeam) {
    return (
      <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-6 text-center">
        <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto mb-2" />
        <h4 className="font-mono font-bold text-base text-slate-200">Spectator Mode</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          You are currently spectating the live auction. Switch to a Club Manager account to place bids and build your 18-man squad!
        </p>
        <button
          onClick={onOpenDemoModal}
          className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[#121216] font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md active:scale-95 transition-all"
        >
          Select Manager Seat
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-4 sm:p-5 space-y-4">
      {/* 1. SQUAD & BUDGET HEADER */}
      <div className="bg-[#121216] rounded-xl p-3.5 border border-[#2c2c35] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border font-bold"
              style={{
                borderColor: myTeam.color || '#10B981',
                backgroundColor: `${myTeam.color}25`,
              }}
            >
              {myTeam.logo || '⚽'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">{myTeam.name}</h4>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  YOU
                </span>
                {/* Live Manager Status Pill */}
                {isCurrentLeader ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    WINNING
                  </span>
                ) : hasSkipped ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
                    SKIPPED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    THINKING
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                spent {formatCoins(myTeam.spent || 0)} · max bid{' '}
                <strong className="text-emerald-400 font-bold">{formatCoins(maxBid)}</strong>
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Remaining Purse</span>
            <span className="text-base sm:text-lg font-black font-mono text-emerald-400">
              {formatCoins(remainingBalance)}
            </span>
          </div>
        </div>

        {/* 18 Visual Progress Dots */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span>
              Squad: <strong className="text-white">{squadCount}</strong>/18
            </span>
            <span>{slotsRemaining} slots left</span>
          </div>
          <div className="grid grid-cols-18 gap-1 w-full">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i < squadCount
                    ? 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.7)]'
                    : 'bg-[#262633] border border-[#343444]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Goalkeeper Warning Banner */}
        {needsKeeper && (
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center space-x-2 text-[11px] text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
            <span>⚠️ You still need a goalkeeper</span>
          </div>
        )}
      </div>

      {/* 2. TIMER & BID STATUS CENTER */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-[#121216] p-3 rounded-xl border border-[#2c2c35]">
        {/* Countdown Ring */}
        <div className="sm:col-span-4 flex items-center justify-center space-x-3">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r={radius} stroke="#2c2c35" strokeWidth="5" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke={isUrgent ? '#EF4444' : timerSeconds <= 10 ? '#F59E0B' : '#10B981'}
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={isNaN(strokeDashoffset) ? 0 : strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
              <span
                className={`font-mono text-xl font-black ${
                  isUrgent ? 'text-rose-400 animate-pulse' : timerSeconds <= 10 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {timerSeconds}
              </span>
              <span className="text-[8px] font-mono text-slate-400 uppercase">SEC</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Timer</span>
            <span className="text-xs font-bold text-slate-200">
              {auctionState?.status === 'paused' ? '⏸️ PAUSED' : isBiddingOpen ? 'ACTIVE' : 'WAITING'}
            </span>
            {auctionState?.antiSnipe && (
              <span className="text-[9px] font-mono text-cyan-400 block mt-0.5">⚡ Anti-snipe on</span>
            )}
          </div>
        </div>

        {/* Current Bid Display */}
        <div className="sm:col-span-8 flex flex-col justify-center px-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              {currentBid === 0 ? 'OPENING BID' : 'CURRENT BID'}
            </span>
            {isCurrentLeader && (
              <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>HIGHEST BIDDER</span>
              </span>
            )}
          </div>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="text-2xl font-black font-mono text-white">
              {currentBid === 0 ? '10' : currentBid.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">coins</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            {auctionState?.currentBidder ? (
              <span>
                Leader: <strong className="text-slate-200">{auctionState.currentBidder.name}</strong>
              </span>
            ) : (
              <span className="text-slate-500 italic">No bids yet</span>
            )}
          </p>
        </div>
      </div>

      {/* 3. QUICK-BID BUTTONS (4 Neon Buttons with hotkeys 1-4) */}
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickBidTargets.map((qb, idx) => (
            <button
              key={qb.increment}
              onClick={() => handleQuickBid(qb.targetAmount)}
              disabled={!isBiddingOpen || qb.disabled || squadCount >= SQUAD_SIZE}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                qb.disabled || !isBiddingOpen || squadCount >= SQUAD_SIZE
                  ? 'bg-[#14141a] border-[#22222c] text-slate-600 cursor-not-allowed opacity-50'
                  : 'bg-[#1b221b] border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 active:scale-95 shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-1">
                <span className="font-mono text-sm font-black">+{qb.increment}</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/40 text-slate-300">
                  [{idx + 1}]
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-300 mt-0.5">
                {qb.targetAmount} coins
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. MANUAL NUMERIC INPUT + BID & SKIP BUTTONS */}
      <form onSubmit={handleCustomSubmit} className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="number"
              value={customBid}
              onChange={(e) => setCustomBid(e.target.value)}
              placeholder={`${minValidBid}–${maxBid}`}
              min={minValidBid}
              max={maxBid}
              disabled={!isBiddingOpen || squadCount >= SQUAD_SIZE}
              className="w-full bg-[#121216] border border-[#2c2c35] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500">
              coins
            </span>
          </div>

          <button
            type="submit"
            disabled={!isBiddingOpen || squadCount >= SQUAD_SIZE || !customBid || Number(customBid) < minValidBid || Number(customBid) > maxBid}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-[#202028] disabled:text-slate-600 disabled:border-[#2c2c35] disabled:cursor-not-allowed border border-emerald-400/50 text-[#0d1117] font-mono font-bold text-xs uppercase flex items-center space-x-1.5 transition-all active:scale-95"
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>BID</span>
          </button>

          <button
            type="button"
            onClick={handleSkip}
            disabled={!isBiddingOpen || isCurrentLeader || hasSkipped}
            className="px-3.5 py-2.5 rounded-xl bg-[#221a1f] hover:bg-[#2e1d24] disabled:bg-[#15151c] disabled:text-slate-600 disabled:border-[#22222d] disabled:cursor-not-allowed border border-rose-500/40 text-rose-400 font-mono font-bold text-xs uppercase flex items-center space-x-1 transition-all active:scale-95"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>SKIP [S]</span>
          </button>
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
          <span>Keys: 1–4 quick bid · S skip</span>
          <span>Max bid {formatCoins(maxBid)}</span>
        </div>
      </form>
    </div>
  );
};
