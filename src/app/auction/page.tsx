'use client';

import React, { useState } from 'react';
import { AuthProvider } from '../../contexts/AuthContext';
import { SocketProvider, useSocket } from '../../contexts/SocketContext';
import { AuctionNavbar } from '../../components/auction/AuctionNavbar';
import { ActivePlayerSpotlight } from '../../components/auction/ActivePlayerSpotlight';
import { BiddingControls } from '../../components/auction/BiddingControls';
import { BidHistoryStream } from '../../components/auction/BidHistoryStream';
import { AdminAuctionPanel } from '../../components/auction/AdminAuctionPanel';
import { LeaderboardView } from '../../components/auction/LeaderboardView';
import { SquadsView } from '../../components/auction/SquadsView';
import { DraftPoolView } from '../../components/auction/DraftPoolView';
import { AnalyticsView } from '../../components/auction/AnalyticsView';
import { NotificationToast } from '../../components/auction/NotificationToast';
import { DemoUserModal } from '../../components/auction/DemoUserModal';
import { SoldOverlayModal } from '../../components/auction/SoldOverlayModal';

function AuctionArenaContent() {
  const [activeTab, setActiveTab] = useState<'arena' | 'leaderboard' | 'squads' | 'pool' | 'analytics'>('arena');
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  const { auctionState, lastSoldInfo, clearLastSold } = useSocket();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col font-sans">
      <AuctionNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDemoModal={() => setDemoModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Arena Tab */}
        {activeTab === 'arena' && (
          <div className="space-y-6">
            {/* Live Arena ticker / announcement */}
            {auctionState?.message && (
              <div className="px-4 py-2.5 rounded-xl bg-[#161b22] border border-[#2c3545] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 font-mono text-slate-300 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-emerald-400">LOT STATUS:</span>
                  <span className="truncate">{auctionState.message}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-[#21262d] text-emerald-400 border border-emerald-500/20">
                    2026-27 SEASON
                  </span>
                  <span className="hidden sm:inline px-2 py-0.5 rounded bg-[#21262d] text-cyan-400 border border-cyan-500/20">
                    ANTI-SNIPE ON
                  </span>
                </div>
              </div>
            )}

            {/* Arena Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Active Player EA FC Card Spotlight */}
              <div className="lg:col-span-7">
                <ActivePlayerSpotlight
                  player={auctionState?.currentPlayer || null}
                  auctionState={auctionState}
                />
              </div>

              {/* Right Column: Bidding Controls & Real-Time Feed */}
              <div className="lg:col-span-5 space-y-4">
                <BiddingControls onOpenDemoModal={() => setDemoModalOpen(true)} />
                <BidHistoryStream />
              </div>
            </div>

            {/* Admin / Host Command Deck */}
            <AdminAuctionPanel />
          </div>
        )}

        {/* Standings Tab */}
        {activeTab === 'leaderboard' && <LeaderboardView />}

        {/* Squads Tab */}
        {activeTab === 'squads' && <SquadsView />}

        {/* Draft Pool Tab */}
        {activeTab === 'pool' && (
          <DraftPoolView onPlayerQueued={() => setActiveTab('arena')} />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && <AnalyticsView />}
      </main>

      {/* Full-Screen SOLD! Overlay Modal */}
      <SoldOverlayModal soldInfo={lastSoldInfo} onClose={clearLastSold} />

      {/* Floating Notifications & Role Picker Modal */}
      <NotificationToast />
      <DemoUserModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </div>
  );
}

export default function AuctionPage() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AuctionArenaContent />
      </SocketProvider>
    </AuthProvider>
  );
}
