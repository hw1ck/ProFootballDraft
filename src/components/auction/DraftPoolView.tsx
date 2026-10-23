'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Search, Play, Filter, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useSocket, PlayerData } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatMoney, getPositionBadgeColor } from '../../utils/formatters';
import { API_BASE } from '../../utils/apiConfig';

export const DraftPoolView: React.FC<{ onPlayerQueued?: () => void }> = ({ onPlayerQueued }) => {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [search, setSearch] = useState<string>('');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [loading, setLoading] = useState<boolean>(true);

  const { isAdmin } = useAuth();
  const { setAuctionPlayer, startAuction } = useSocket();

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (positionFilter !== 'ALL') params.append('position', positionFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (sortBy) params.append('sortBy', sortBy);

      const res = await fetch(`${API_BASE}/api/players?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPlayers(data.players);
      }
    } catch (e) {
      console.error('Error fetching players pool:', e);
    } finally {
      setLoading(false);
    }
  }, [search, positionFilter, statusFilter, sortBy]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const handleQueuePlayer = (player: PlayerData) => {
    setAuctionPlayer(player._id);
    if (onPlayerQueued) onPlayerQueued();
  };

  const handleStartPlayer = (player: PlayerData) => {
    startAuction(player._id);
    if (onPlayerQueued) onPlayerQueued();
  };

  return (
    <div className="space-y-4">
      {/* Controls: Search, Filters, Sort */}
      <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by player name, club, role, nation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121216] border border-[#2c2c35] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="bg-[#121216] border border-[#2c2c35] text-xs text-slate-300 rounded-xl px-3 py-2 font-mono focus:outline-none"
            >
              <option value="ALL">All Positions</option>
              <option value="GK">Goalkeepers (GK)</option>
              <option value="DEF">Defenders (DEF)</option>
              <option value="MID">Midfielders (MID)</option>
              <option value="FWD">Forwards (FWD)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#121216] border border-[#2c2c35] text-xs text-slate-300 rounded-xl px-3 py-2 font-mono focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="in_auction">In Auction</option>
              <option value="sold">Sold</option>
              <option value="unsold">Unsold</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#121216] border border-[#2c2c35] text-xs text-slate-300 rounded-xl px-3 py-2 font-mono focus:outline-none"
            >
              <option value="rating">Sort: OVR Rating</option>
              <option value="price">Sort: Base Price</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Players Grid */}
      {loading ? (
        <div className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-8 text-center text-xs font-mono text-slate-400">
          Loading player pool...
        </div>
      ) : players.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#2c2c35] bg-[#18181f]/40 p-12 text-center text-xs font-mono text-slate-400">
          No players found matching current search and filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {players.map((p) => {
            const badge = getPositionBadgeColor(p.position);
            return (
              <div
                key={p._id}
                className="rounded-2xl border border-[#2c2c35] bg-[#18181f] p-4 flex flex-col justify-between hover:border-slate-500 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {p.position}
                    </span>

                    {p.status === 'sold' && (
                      <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Sold</span>
                      </span>
                    )}
                    {p.status === 'unsold' && (
                      <span className="flex items-center space-x-1 text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                        <XCircle className="w-3 h-3" />
                        <span>Unsold</span>
                      </span>
                    )}
                    {p.status === 'in_auction' && (
                      <span className="flex items-center space-x-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>Live</span>
                      </span>
                    )}
                    {p.status === 'upcoming' && (
                      <span className="text-[10px] font-mono text-slate-400 bg-[#121216] px-2 py-0.5 rounded border border-[#2c2c35]">
                        Upcoming
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{p.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {p.club} • {p.nationality}
                      </p>
                    </div>
                    <span className="font-['Silkscreen',monospace] text-2xl font-black text-amber-400 leading-none">
                      {p.stats?.overall || 80}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center space-x-1 font-mono text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-[#121216] border border-[#2c2c35]">
                      {p.role || 'STAR'}
                    </span>
                    {p.jerseyNumber && (
                      <span className="px-1.5 py-0.5 rounded bg-[#121216] border border-[#2c2c35]">
                        #{p.jerseyNumber}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2c2c35] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-slate-500 block">Base Price</span>
                    <span className="font-mono font-bold text-xs text-slate-200">
                      {formatMoney(p.basePrice)}
                    </span>
                  </div>

                  {isAdmin && p.status === 'upcoming' && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleQueuePlayer(p)}
                        className="px-2.5 py-1 rounded-lg bg-[#121216] hover:bg-[#1e1e26] border border-[#2c2c35] text-[10px] font-mono font-bold text-slate-300 transition-colors"
                      >
                        Queue
                      </button>
                      <button
                        onClick={() => handleStartPlayer(p)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#121216] text-[10px] font-mono font-bold transition-colors flex items-center space-x-1"
                      >
                        <Play className="w-3 h-3 fill-[#121216]" />
                        <span>Start</span>
                      </button>
                    </div>
                  )}

                  {p.status === 'sold' && p.soldTo && (
                    <div className="text-right">
                      <span className="text-[9px] font-mono uppercase text-slate-500 block">Acquired By</span>
                      <span className="font-bold text-xs text-emerald-400">
                        {p.soldTo.shortName || p.soldTo.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
