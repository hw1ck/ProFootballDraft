'use client';

import React, { useState } from 'react';
import { Play, Pause, Gavel, SkipForward, RotateCcw, Database, AlertOctagon, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { API_BASE } from '../../utils/apiConfig';

export const AdminAuctionPanel: React.FC<{ onRefreshData?: () => void }> = ({ onRefreshData }) => {
  const { isAdmin } = useAuth();
  const {
    auctionState,
    startAuction,
    pauseAuction,
    resumeAuction,
    hammerSell,
    passPlayer,
    nextPlayer
  } = useSocket();

  const [loadingAction, setLoadingAction] = useState<boolean>(false);

  if (!isAdmin) {
    return null; // Only for Admin
  }

  const isBidding = auctionState?.status === 'bidding';
  const isPaused = auctionState?.status === 'paused';
  const hasBidder = !!auctionState?.currentBidder;

  const handleResetAuction = async () => {
    if (!window.confirm('Reset auction progress? This will reset all sold players, bids, and team expenditures.')) {
      return;
    }
    setLoadingAction(true);
    try {
      const res = await fetch(`${API_BASE}/api/auction/reset`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Auction reset successfully!');
        if (onRefreshData) onRefreshData();
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error resetting';
      alert('Error resetting auction: ' + msg);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleReSeed = async () => {
    if (!window.confirm('Re-seed entire database? This wipes all changes and restores default star players & clubs.')) {
      return;
    }
    setLoadingAction(true);
    try {
      const res = await fetch(`${API_BASE}/api/auction/seed`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Database seeded with fresh clubs, star players, and accounts!');
        if (onRefreshData) onRefreshData();
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error seeding';
      alert('Error seeding database: ' + msg);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleImportCsv = async () => {
    if (!window.confirm('Import top EA FC stars from normalized CSV dataset?')) {
      return;
    }
    setLoadingAction(true);
    try {
      const res = await fetch(`${API_BASE}/api/players/import-csv`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'CSV stars imported successfully!');
        if (onRefreshData) onRefreshData();
      } else {
        alert(data.message);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error importing';
      alert('Error importing from CSV: ' + msg);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-[#18181f] p-5 shadow-lg shadow-amber-500/5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#2c2c35]">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <h3 className="text-xs sm:text-sm font-['Silkscreen',monospace] font-bold tracking-wider text-amber-300">
            AUCTIONEER COMMAND DECK
          </h3>
        </div>
        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono">
          Admin Master Deck
        </span>
      </div>

      {/* Main Gavel Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Start / Resume */}
        {!isBidding && !isPaused ? (
          <button
            onClick={() => startAuction()}
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[#121216] font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-md active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-[#121216]" />
            <span>Open Bidding</span>
          </button>
        ) : isBidding ? (
          <button
            onClick={pauseAuction}
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-amber-500 text-[#121216] font-black text-xs uppercase tracking-wider hover:bg-amber-400 shadow-md active:scale-95 transition-all"
          >
            <Pause className="w-4 h-4 fill-[#121216]" />
            <span>Pause Timer</span>
          </button>
        ) : (
          <button
            onClick={resumeAuction}
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-500 text-[#121216] font-black text-xs uppercase tracking-wider hover:bg-emerald-400 shadow-md active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-[#121216]" />
            <span>Resume Bids</span>
          </button>
        )}

        {/* Sell / Hammer Gavel */}
        <button
          onClick={hammerSell}
          disabled={!hasBidder}
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
            hasBidder
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-[#121216] shadow-md hover:opacity-95 active:scale-95'
              : 'bg-[#121216] border border-[#2c2c35] text-slate-500 opacity-50 cursor-not-allowed'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>Hammer (Sold)</span>
        </button>

        {/* Pass / Unsold */}
        <button
          onClick={passPlayer}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-bold uppercase tracking-wider active:scale-95 transition-all"
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Mark Unsold</span>
        </button>

        {/* Next Player */}
        <button
          onClick={nextPlayer}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#1e1e26] hover:bg-[#282834] text-slate-200 border border-[#2c2c35] text-xs font-bold uppercase tracking-wider active:scale-95 transition-all"
        >
          <SkipForward className="w-4 h-4" />
          <span>Next in Queue</span>
        </button>
      </div>

      {/* Auxiliary actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#2c2c35] justify-between items-center text-xs">
        <span className="text-slate-400 font-mono text-[11px]">System Maintenance:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleImportCsv}
            disabled={loadingAction}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#121216] hover:bg-[#1e1e26] text-cyan-400 border border-[#2c2c35] transition-colors font-mono text-[11px]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Load CSV Stars</span>
          </button>
          <button
            onClick={handleResetAuction}
            disabled={loadingAction}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#121216] hover:bg-[#1e1e26] text-slate-300 border border-[#2c2c35] transition-colors font-mono text-[11px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
          <button
            onClick={handleReSeed}
            disabled={loadingAction}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#121216] hover:bg-[#1e1e26] text-emerald-400 border border-[#2c2c35] transition-colors font-mono text-[11px]"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Fresh Seed</span>
          </button>
        </div>
      </div>
    </div>
  );
};
