'use client';

import React from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Radio, Shield, Users, BarChart3, ListFilter, Trophy, ArrowLeft } from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';

interface AuctionNavbarProps {
  activeTab: 'arena' | 'leaderboard' | 'squads' | 'pool' | 'analytics';
  setActiveTab: (tab: 'arena' | 'leaderboard' | 'squads' | 'pool' | 'analytics') => void;
  onOpenDemoModal: () => void;
}

export const AuctionNavbar: React.FC<AuctionNavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDemoModal
}) => {
  const { connected, isMuted, toggleMute, auctionState } = useSocket();
  const { user, isAdmin, isManager } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2c2c35] bg-[#121216]/95 backdrop-blur-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Connection */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
          <Link
            href="/"
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="text-xl">⚽</span>
            <span className="font-['Silkscreen',monospace] text-sm sm:text-base font-bold tracking-wider text-white">
              AUCTION<span className="text-emerald-400">.ARENA</span>
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#1e1e26] border border-[#2c2c35] text-[11px] font-mono">
            <Radio className={`w-3 h-3 ${connected ? 'text-emerald-400 animate-pulse' : 'text-rose-500'}`} />
            <span className={connected ? 'text-emerald-400' : 'text-rose-400'}>
              {connected ? 'LIVE' : 'CONNECTING'}
            </span>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center space-x-1 bg-[#18181f] p-1 rounded-xl border border-[#2c2c35] text-xs font-semibold overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('arena')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'arena'
                ? 'bg-emerald-500 text-[#121216] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🏟️ Arena</span>
            {auctionState?.status === 'bidding' && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-emerald-500 text-[#121216] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Clubs</span>
          </button>

          <button
            onClick={() => setActiveTab('squads')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'squads'
                ? 'bg-emerald-500 text-[#121216] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Squads</span>
          </button>

          <button
            onClick={() => setActiveTab('pool')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'pool'
                ? 'bg-emerald-500 text-[#121216] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Draft Pool</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'analytics'
                ? 'bg-emerald-500 text-[#121216] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Insights</span>
          </button>
        </nav>

        {/* Right: Sound, Role & Account Selector */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2 rounded-xl bg-[#1e1e26] hover:bg-[#282834] border border-[#2c2c35] text-slate-300 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onOpenDemoModal}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#1e1e26] hover:bg-[#282834] border border-[#2c2c35] text-xs transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            {user ? (
              <div className="text-left flex items-center space-x-1.5">
                {isAdmin && <Shield className="w-3.5 h-3.5 text-amber-400" />}
                {isManager && user.team && (
                  <span
                    className="w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: user.team.color || '#10B981' }}
                  >
                    {user.team.shortName.slice(0, 2)}
                  </span>
                )}
                <span className="font-semibold text-slate-200 truncate max-w-[110px]">
                  {user.team ? user.team.shortName : user.name}
                </span>
              </div>
            ) : (
              <span className="text-slate-300 font-medium">Select Role</span>
            )}
            <span className="text-[10px] text-emerald-400 font-mono">▼</span>
          </button>
        </div>
      </div>
    </header>
  );
};
