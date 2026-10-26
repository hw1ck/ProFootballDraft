'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../../components/navigation/Header';
import { useAuth } from '../../../contexts/AuthContext';
import { API_BASE, SOCKET_URL } from '../../../utils/apiConfig';
import { io, Socket } from 'socket.io-client';
import {
  Users,
  Clock,
  Coins,
  Shield,
  Zap,
  Lock,
  Globe,
  Copy,
  Check,
  Play,
  Pause,
  AlertTriangle,
  Award,
  Trophy,
  ArrowLeft,
  Volume2,
  VolumeX,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Flame
} from 'lucide-react';
import { playSound } from '../../../utils/soundEffects';

interface ManagerSeat {
  userId: string;
  username: string;
  email?: string;
  isHost: boolean;
  connected: boolean;
  balance: number;
  spent: number;
  squad: any[];
  maxBid: number;
  status: 'THINKING' | 'WINNING' | 'SKIPPED';
  needsGoalkeeper: boolean;
}

interface RoomState {
  code: string;
  roomName: string;
  competition: string;
  season: string;
  roomSize: number;
  startingBudget: number;
  bidTimer: number;
  mode: string;
  isPublic: boolean;
  antiSnipe: boolean;
  phase: 'LOBBY' | 'AUCTION_ACTIVE' | 'AUCTION_PAUSED' | 'LOT_SOLD_TRANSITION' | 'COMPLETED';
  hostUserId: string;
  timerSeconds: number;
  currentLotIndex: number;
  totalLots: number;
  currentLot: {
    lotNumber: number;
    totalLots: number;
    player: any;
    currentBid: number;
    leadingBidderId: string | null;
    leadingBidderName: string | null;
    bidHistory: any[];
    skippedManagerIds: string[];
  } | null;
  lastSold: any;
  managers: ManagerSeat[];
  activityFeed: { text: string; type: string; timestamp: string }[];
  chatMessages: { id: string; userId: string; username: string; text: string; timestamp: string }[];
  standings?: any[];
}

function RoomContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const roomCode = String(params.code || '').toUpperCase();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // UI state
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [manualBidInput, setManualBidInput] = useState<string>('');
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Fallback current user
  const currentUser = useMemo(() => {
    return {
      id: user?._id || 'user-' + Date.now(),
      name: user?.name || 'Manager',
      email: user?.email || ''
    };
  }, [user]);

  // Initial Fetch Room State
  const fetchRoom = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/rooms/${roomCode}`);
      if (!res.ok) {
        setError('Room not found or no longer active.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.success && data.room) {
        setRoomState(data.room);
      }
    } catch {
      setError('Could not connect to room server.');
    } finally {
      setLoading(false);
    }
  }, [roomCode]);

  // Socket Connection and Event Listeners
  useEffect(() => {
    fetchRoom();

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('room:join', {
        roomCode,
        user: currentUser
      });
    });

    newSocket.on('room:state_update', (updatedState: RoomState) => {
      setRoomState(updatedState);
    });

    newSocket.on('room:timer_tick', ({ seconds }: { seconds: number }) => {
      setRoomState((prev) => (prev ? { ...prev, timerSeconds: seconds } : prev));
      if (seconds <= 3 && seconds > 0) {
        playSound('tick');
      }
    });

    newSocket.on('room:lot_sold', (soldData: any) => {
      playSound('hammer');
    });

    newSocket.on('room:chat_message', (msg: any) => {
      setRoomState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          chatMessages: [...(prev.chatMessages || []), msg]
        };
      });
    });

    return () => {
      newSocket.emit('room:leave', { roomCode, userId: currentUser.id });
      newSocket.disconnect();
    };
  }, [roomCode, currentUser, fetchRoom]);

  // My Manager Seat
  const mySeat = useMemo(() => {
    if (!roomState?.managers) return null;
    return (
      roomState.managers.find((m) => String(m.userId) === String(currentUser.id)) ||
      roomState.managers.find((m) => m.username === currentUser.name) ||
      roomState.managers[0]
    );
  }, [roomState, currentUser]);

  const isHost = useMemo(() => {
    if (!roomState) return false;
    return (
      String(roomState.hostUserId) === String(currentUser.id) ||
      mySeat?.isHost === true
    );
  }, [roomState, currentUser, mySeat]);

  // Copy helpers
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/room/${roomCode}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  // Actions
  const handleStartAuction = () => {
    if (!socket || !isHost) return;
    playSound('bell');
    socket.emit('room:start', { roomCode, userId: currentUser.id });
  };

  const handlePauseToggle = () => {
    if (!socket || !isHost) return;
    socket.emit('room:pause_toggle', { roomCode, userId: currentUser.id });
  };

  const handlePlaceBid = (amount: number) => {
    if (!socket || !roomState?.currentLot) return;
    playSound('bid');
    socket.emit('room:bid', { roomCode, userId: currentUser.id, amount });
    setManualBidInput('');
  };

  const handleSkipLot = () => {
    if (!socket) return;
    playSound('pass');
    socket.emit('room:skip', { roomCode, userId: currentUser.id });
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !chatInput.trim()) return;
    socket.emit('room:chat', {
      roomCode,
      user: currentUser,
      text: chatInput.trim()
    });
    setChatInput('');
  };

  // Keyboard Shortcuts (1-4 quick bids, S for skip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag)) return;

      if (roomState?.phase !== 'AUCTION_ACTIVE' || !roomState?.currentLot || !mySeat) return;

      const currentLeading = roomState.currentLot.currentBid;
      const maxBid = mySeat.maxBid;

      if (e.key === '1') {
        const target = currentLeading === 0 ? 10 : currentLeading + 10;
        if (target <= maxBid) handlePlaceBid(target);
      } else if (e.key === '2') {
        const target = currentLeading === 0 ? 25 : currentLeading + 25;
        if (target <= maxBid) handlePlaceBid(target);
      } else if (e.key === '3') {
        const target = currentLeading === 0 ? 50 : currentLeading + 50;
        if (target <= maxBid) handlePlaceBid(target);
      } else if (e.key === '4') {
        const target = currentLeading === 0 ? 100 : currentLeading + 100;
        if (target <= maxBid) handlePlaceBid(target);
      } else if (e.key === 's' || e.key === 'S') {
        if (roomState.currentLot.leadingBidderId !== String(currentUser.id)) {
          handleSkipLot();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [roomState, mySeat, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-3 font-mono">
            <div className="w-10 h-10 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Entering arena room {roomCode}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !roomState) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-[#111728] border border-rose-500/30 p-8 rounded-3xl text-center space-y-4 shadow-xl">
            <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
            <h2 className="text-lg font-bold text-white">Room Unavailable</h2>
            <p className="text-xs text-slate-300 font-mono">{error || 'This room does not exist or has expired.'}</p>
            <Link
              href="/play"
              className="inline-flex items-center gap-2 bg-[#00F0FF] text-black font-bold font-mono text-xs px-5 py-2.5 rounded-xl transition-all"
            >
              <span>Back to Play Hub</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: PRE-AUCTION LOBBY (phase === 'LOBBY')
  // ==========================================
  if (roomState.phase === 'LOBBY') {
    const managers = roomState.managers || [];
    const openSeatsCount = Math.max(0, roomState.roomSize - managers.length);
    const canStart = managers.length >= 2;

    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col font-sans selection:bg-[#00F0FF] selection:text-black">
        <Header />

        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Top Return link */}
          <Link
            href="/play"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-mono transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Leave Lobby</span>
          </Link>

          {/* Lobby Hero Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111728] via-[#16213b] to-[#0e1424] border border-[#222f4b] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#222f46]">
              <div>
                <span className="text-[11px] font-mono text-[#00F0FF] uppercase tracking-wider font-bold block mb-1">
                  PRE-AUCTION LOBBY
                </span>
                <h1 className="pixel-text text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {roomState.roomName}
                </h1>
              </div>

              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold">
                <span className="px-2.5 py-1 rounded-lg bg-[#18233a] border border-[#2c3b5a] text-[#00F0FF]">
                  {roomState.competition.replace('_', ' ')}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#18233a] border border-[#2c3b5a] text-slate-300">
                  {roomState.season}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#18233a] border border-[#2c3b5a] text-amber-300">
                  {roomState.startingBudget} BUDGET
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#18233a] border border-[#2c3b5a] text-emerald-300">
                  {roomState.bidTimer}S PER PLAYER
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#18233a] border border-[#2c3b5a] text-purple-300">
                  18-MAN SQUADS
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#18233a] border border-[#2c3b5a] text-pink-300">
                  {roomState.antiSnipe ? 'ANTI-SNIPE ON' : 'ANTI-SNIPE OFF'}
                </span>
              </div>
            </div>

            {/* Room Code Display Box with Copy Actions */}
            <div className="bg-[#0b0f1b] border border-[#23314f] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono text-slate-400 block mb-1">INVITE CODE:</span>
                <span className="pixel-text text-3xl sm:text-4xl text-[#00F0FF] font-black tracking-widest drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                  {roomCode}
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-[#141d33] hover:bg-[#1a2642] border border-[#2c3d62] text-xs font-mono font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                  <span>{copiedCode ? 'COPIED CODE' : 'COPY CODE'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-[#00F0FF]/15 hover:bg-[#00F0FF] border border-[#00F0FF]/40 text-[#00F0FF] hover:text-black text-xs font-mono font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-current" />}
                  <span>{copiedLink ? 'LINK COPIED' : 'COPY INVITE LINK'}</span>
                </button>
              </div>
            </div>

            {/* Seat Grid: MANAGERS X/Y */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold tracking-wider">
                  MANAGERS {managers.length} / {roomState.roomSize}
                </span>
                <span className="text-slate-400">Quorum to start: 2 managers</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Occupied Seats */}
                {managers.map((m, index) => {
                  const isMe = String(m.userId) === String(currentUser.id) || m.username === currentUser.name;
                  return (
                    <div
                      key={m.userId || index}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                        isMe
                          ? 'bg-[#182642] border-[#00F0FF]/60 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                          : 'bg-[#101726] border-[#223049]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#142138] border border-[#00F0FF]/40 flex items-center justify-center font-black text-sm text-[#00F0FF]">
                          {m.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm">{m.username}</span>
                            {m.isHost && (
                              <span title="Host" className="text-amber-400 text-xs">👑</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                            {isMe && <span className="text-[#00F0FF] font-bold">(You)</span>}
                            <span>{m.isHost ? 'Host' : 'Manager'}</span>
                          </div>
                        </div>
                      </div>

                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10E7B2] animate-pulse" />
                    </div>
                  );
                })}

                {/* Open Seat Placeholders */}
                {Array.from({ length: openSeatsCount }).map((_, idx) => (
                  <div
                    key={`open-${idx}`}
                    className="p-4 rounded-2xl border border-dashed border-[#283754] bg-[#0c1220]/50 flex items-center justify-center text-center text-slate-500 font-mono text-xs"
                  >
                    <span>+ Open Seat</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quorum Gate & Start Auction Action */}
            <div className="pt-4 border-t border-[#222f46] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-400 text-center sm:text-left">
                {isHost ? (
                  canStart ? (
                    <span className="text-emerald-400 font-bold">
                      ✓ Quorum reached! You can start the auction whenever ready.
                    </span>
                  ) : (
                    <span className="text-amber-400 font-bold">
                      ⚠️ Need at least 2 managers seated to start the auction.
                    </span>
                  )
                ) : (
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                    Waiting for room host to initiate the auction...
                  </span>
                )}
              </div>

              {isHost && (
                <button
                  type="button"
                  onClick={handleStartAuction}
                  disabled={!canStart}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#00F0FF] via-[#10E7B2] to-[#b4ff39] hover:brightness-110 active:scale-[0.99] text-black font-black font-mono text-xs sm:text-sm px-8 py-3.5 rounded-2xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4 text-black fill-current" />
                  <span>START AUCTION</span>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: COMPLETED POST-AUCTION SUMMARY
  // ==========================================
  if (roomState.phase === 'COMPLETED') {
    const standings = roomState.standings || [];
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col font-sans selection:bg-[#00F0FF] selection:text-black">
        <Header />
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-[#00F0FF] tracking-wider uppercase font-bold">
              AUCTION FINISHED
            </span>
            <h1 className="pixel-text text-3xl sm:text-4xl font-black text-white">
              FINAL SQUAD STANDINGS
            </h1>
            <p className="text-xs text-slate-400">
              Ranked by composite squad score (55% Starting XI OVR, 25% Chemistry, 20% Tactical Fit).
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {standings.map((s, idx) => (
              <div
                key={s.userId || idx}
                className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  s.placement === 1
                    ? 'bg-gradient-to-r from-[#201838] to-[#12192f] border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-[#111728] border-[#222f46]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                      s.placement === 1
                        ? 'bg-amber-400 text-black shadow-md'
                        : s.placement === 2
                        ? 'bg-slate-300 text-black'
                        : s.placement === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-[#18233a] text-slate-400'
                    }`}
                  >
                    #{s.placement}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{s.username}</h3>
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-1">
                      <span>{s.squadCount} / 18 Players</span>
                      <span>Spent: {s.totalSpent} coins</span>
                      <span>Remaining: {s.balanceRemaining}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center font-mono">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Squad Score</span>
                    <span className="pixel-text text-2xl font-black text-[#00F0FF]">{s.squadScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/play"
              className="bg-gradient-to-r from-[#00F0FF] to-[#10E7B2] text-black font-bold font-mono text-xs px-6 py-3 rounded-xl shadow-lg"
            >
              Play Another Auction
            </Link>
            <Link
              href="/profile"
              className="bg-[#141d33] hover:bg-[#1a2642] border border-[#2c3d62] text-white font-bold font-mono text-xs px-6 py-3 rounded-xl"
            >
              View Career Profile
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: LIVE AUCTION ARENA (phase === 'AUCTION_ACTIVE' etc)
  // ==========================================
  const currentLot = roomState.currentLot;
  const player = currentLot?.player;
  const currentBid = currentLot?.currentBid || 0;
  const leadingBidderName = currentLot?.leadingBidderName;
  const isLeading = currentLot?.leadingBidderId === String(currentUser.id);
  const maxBid = mySeat?.maxBid || 0;
  const balance = mySeat?.balance || 0;
  const spent = mySeat?.spent || 0;
  const squad = mySeat?.squad || [];
  const needsGk = mySeat?.needsGoalkeeper ?? true;

  // Quick bid buttons logic from Step 3 of roadmap
  const quickBidTargets = [10, 25, 50, 100].map((inc) => {
    const target = currentBid === 0 ? inc : currentBid + inc;
    return {
      increment: inc,
      targetAmount: target,
      disabled: target > maxBid
    };
  });

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col font-sans selection:bg-[#00F0FF] selection:text-black">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0c101a]/95 backdrop-blur-md border-b border-[#1c2438] px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Competition & Lot */}
          <div className="flex items-center gap-3">
            <Link
              href="/play"
              className="text-slate-400 hover:text-white transition-colors"
              title="Exit Arena"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-[#141c30] border border-[#23314d] text-[#00F0FF] font-mono text-xs font-bold uppercase">
                {roomState.competition.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono text-slate-300">
                Lot <strong>{currentLot?.lotNumber || 1}</strong> of {currentLot?.totalLots || roomState.totalLots}
              </span>
            </div>
          </div>

          {/* Center: Room Code pill */}
          <div className="hidden sm:flex items-center gap-2 bg-[#121828] border border-[#222f46] px-3 py-1 rounded-full text-xs font-mono">
            <span className="text-slate-400">ROOM:</span>
            <span className="font-bold text-[#00F0FF] tracking-wider">{roomCode}</span>
          </div>

          {/* Right: Pause control & Sound & Chat */}
          <div className="flex items-center gap-2">
            {isHost && (
              <button
                type="button"
                onClick={handlePauseToggle}
                className="bg-[#18233a] hover:bg-[#202d4a] border border-[#2d3e62] text-xs font-mono px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all text-slate-200 cursor-pointer"
              >
                {roomState.phase === 'AUCTION_PAUSED' ? (
                  <>
                    <Play className="w-3 h-3 text-emerald-400 fill-current" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-amber-400 fill-current" />
                    <span>Pause</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setChatOpen(!chatOpen)}
              className="p-1.5 rounded-lg bg-[#121828] border border-[#222f46] text-slate-300 hover:text-white transition-all cursor-pointer relative"
              title="Toggle Live Chat"
            >
              <MessageSquare className="w-4 h-4" />
              {roomState.chatMessages?.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] absolute top-1 right-1" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main 3-Column Arena Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (3 cols): YOUR SQUAD Ledger */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#111728] border border-[#222f49] rounded-2xl p-4 space-y-3.5 shadow-md">
            <div className="flex items-center justify-between border-b border-[#1f2b42] pb-2.5">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                YOUR SQUAD ({squad.length}/18)
              </span>
              <span className="text-[11px] font-mono text-[#00F0FF] font-bold">
                {18 - squad.length} slots left
              </span>
            </div>

            {/* Balances */}
            <div className="bg-[#0b0f1b] border border-[#1b263b] p-3 rounded-xl space-y-1 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Purse Balance:</span>
                <span className="text-amber-400 font-bold text-sm">{balance} coins</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Total Spent:</span>
                <span className="text-slate-300">{spent} coins</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#1b263b]">
                <span className="text-slate-400">Max Bid Reserve:</span>
                <span className="text-[#00F0FF] font-bold">{maxBid} coins</span>
              </div>
            </div>

            {/* 18 Progress Dots */}
            <div className="grid grid-cols-6 gap-1.5 py-1">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i < squad.length ? 'bg-[#10E7B2] shadow-[0_0_6px_#10E7B2]' : 'bg-[#1b2438]'
                  }`}
                />
              ))}
            </div>

            {/* Goalkeeper Warning */}
            {needsGk && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl flex items-center gap-2 text-xs text-amber-300 font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>⚠️ You still need a goalkeeper!</span>
              </div>
            )}

            {/* Acquired Players List */}
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {squad.length === 0 ? (
                <p className="text-[11px] text-slate-500 font-mono text-center py-4">
                  No players signed yet. Your first acquisition will appear here.
                </p>
              ) : (
                squad.map((p, i) => (
                  <div
                    key={i}
                    className="bg-[#0a0e1a] border border-[#1c263c] p-2 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono font-bold text-[#00F0FF]">{p.stats?.overall || p.overall}</span>
                      <span className="font-mono text-slate-400 text-[10px]">{p.position}</span>
                      <span className="text-white truncate font-semibold">{p.displayName || p.name}</span>
                    </div>
                    <span className="font-mono text-amber-400 text-[11px] font-bold shrink-0">
                      {p.pricePaid}c
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Center Column (6 cols): Active Player Showcase & Bidding Stage */}
        <div className="lg:col-span-6 space-y-4">
          {player ? (
            <div className="bg-[#111728] border border-[#222f49] rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl relative overflow-hidden">
              {/* Player Showcase & Circular Countdown Ring */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* EA FC Stylized Card */}
                <div className="w-48 aspect-[1/1.4] rounded-2xl bg-gradient-to-b from-[#182844] via-[#101b30] to-[#0a1120] border border-[#2b4169] p-3 text-white flex flex-col justify-between shadow-2xl relative select-none">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-3xl font-black font-mono leading-none">
                        {player.stats?.overall || 80}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#00F0FF] block mt-0.5">
                        {player.position}
                      </span>
                      <span className="text-[10px] font-mono text-slate-300 font-bold">
                        {player.nationalityCode}
                      </span>
                    </div>
                    <div className="w-20 h-20 overflow-hidden flex items-end justify-center">
                      <img
                        src={player.photoUrl || `/player_faces/${player.playerId}.png`}
                        alt={player.name}
                        className="w-full h-full object-contain object-bottom filter drop-shadow-md"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-center py-1">
                    <h3 className="font-black font-mono text-sm uppercase tracking-wide truncate">
                      {player.surname || player.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 truncate">{player.club}</p>
                  </div>

                  {/* 6 stats grid */}
                  <div className="grid grid-cols-3 gap-1 bg-[#070b14]/90 p-1.5 rounded-lg text-center font-mono text-[10px]">
                    <div>
                      <span className="text-slate-500 block text-[8px]">PAC</span>
                      <span className="font-bold text-white">{player.stats?.pace || 75}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">SHO</span>
                      <span className="font-bold text-white">{player.stats?.shooting || 75}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">PAS</span>
                      <span className="font-bold text-white">{player.stats?.passing || 75}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">DRI</span>
                      <span className="font-bold text-white">{player.stats?.dribbling || 75}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">DEF</span>
                      <span className="font-bold text-white">{player.stats?.defending || 75}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">PHY</span>
                      <span className="font-bold text-white">{player.stats?.physical || 75}</span>
                    </div>
                  </div>
                </div>

                {/* Clock & Bidding Details */}
                <div className="flex-1 space-y-4 text-center sm:text-left">
                  {/* Countdown Timer Display */}
                  <div className="inline-flex items-center gap-3 bg-[#0a0e1a] border border-[#1f2c45] px-4 py-2.5 rounded-2xl">
                    <Clock className="w-5 h-5 text-[#00F0FF] animate-pulse" />
                    <span className="pixel-text text-2xl font-black text-white font-mono">
                      {roomState.timerSeconds} SECONDS
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <h2 className="text-lg font-black text-white">{player.name}</h2>
                    <p className="text-slate-400 font-mono text-xs">
                      {player.nationality} · {player.age} yrs · {player.preferredFoot} foot
                    </p>
                    <p className="text-xs font-mono text-emerald-400">
                      Est. Market Value: ~{player.estimatedValue} coins
                    </p>
                  </div>

                  {/* Current Bid Box */}
                  <div className="bg-[#0b101d] border border-[#23314d] p-3.5 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                      {currentBid === 0 ? 'OPENING BID' : 'CURRENT HIGH BID'}
                    </span>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-2xl">🪙</span>
                      <span className="pixel-text text-2xl sm:text-3xl font-black text-amber-400">
                        {currentBid === 0 ? 10 : currentBid}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-300 block truncate">
                      {leadingBidderName ? (
                        <>
                          Highest Bidder:{' '}
                          <strong className={isLeading ? 'text-emerald-400 font-bold' : 'text-white'}>
                            {leadingBidderName} {isLeading ? '(You)' : ''}
                          </strong>
                        </>
                      ) : (
                        'No bids placed yet'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Bid Buttons (+10, +25, +50, +100) */}
              <div className="space-y-2 pt-2 border-t border-[#1f2b42]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {quickBidTargets.map((qb, i) => (
                    <button
                      key={qb.increment}
                      type="button"
                      disabled={qb.disabled || roomState.phase !== 'AUCTION_ACTIVE'}
                      onClick={() => handlePlaceBid(qb.targetAmount)}
                      className="bg-[#131b2e] hover:bg-[#1a253e] disabled:opacity-30 border border-[#2b3c5e] hover:border-[#00F0FF] p-2.5 rounded-xl transition-all cursor-pointer flex flex-col items-center shadow-sm"
                    >
                      <span className="text-xs font-mono font-black text-[#00F0FF]">
                        +{qb.increment}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Bid {qb.targetAmount}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Manual Bid & Skip Controls */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="number"
                    min={currentBid === 0 ? 10 : currentBid + 1}
                    max={maxBid}
                    value={manualBidInput}
                    onChange={(e) => setManualBidInput(e.target.value)}
                    placeholder={`Min ${currentBid === 0 ? 10 : currentBid + 1} – Max ${maxBid}`}
                    className="flex-1 bg-[#0a0e1a] border border-[#263754] focus:border-[#00F0FF] rounded-xl px-3 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={!manualBidInput || Number(manualBidInput) > maxBid}
                    onClick={() => handlePlaceBid(Number(manualBidInput))}
                    className="bg-[#00F0FF] hover:bg-[#38bdf8] text-black font-black font-mono text-xs px-5 py-2.5 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
                  >
                    BID
                  </button>
                  <button
                    type="button"
                    disabled={isLeading || roomState.phase !== 'AUCTION_ACTIVE'}
                    onClick={handleSkipLot}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold font-mono text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-30"
                  >
                    SKIP (S)
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                  <span>Hotkeys: Keys 1–4 quick bid · S skip</span>
                  <span>Max Bid Reserve: {maxBid}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-[#111728] border border-[#222f49] text-slate-400 font-mono text-xs">
              Preparing next auction lot...
            </div>
          )}

          {/* Activity Feed */}
          <div className="bg-[#111728] border border-[#222f49] rounded-2xl p-4 space-y-2">
            <span className="text-[11px] font-mono font-bold text-slate-300 uppercase block">
              LIVE ARENA FEED
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs font-mono text-slate-300">
              {roomState.activityFeed?.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#00F0FF]">•</span>
                  <span className="truncate">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (3 cols): LIVE MANAGERS Roster */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#111728] border border-[#222f49] rounded-2xl p-4 space-y-3 shadow-md">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase block border-b border-[#1f2b42] pb-2">
              LIVE MANAGERS ({roomState.managers?.length || 0})
            </span>

            <div className="space-y-2">
              {roomState.managers?.map((m, idx) => {
                const isMe = String(m.userId) === String(currentUser.id) || m.username === currentUser.name;
                return (
                  <div
                    key={m.userId || idx}
                    className={`p-3 rounded-xl border space-y-1.5 text-xs ${
                      isMe ? 'bg-[#152138] border-[#00F0FF]/50' : 'bg-[#0b101c] border-[#1d273a]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{m.username}</span>
                        {m.isHost && <span className="text-amber-400 text-xs">👑</span>}
                        {isMe && <span className="text-[10px] text-[#00F0FF] font-mono font-bold">(You)</span>}
                      </div>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          m.status === 'WINNING'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                            : m.status === 'SKIPPED'
                            ? 'bg-slate-700 text-slate-400'
                            : 'bg-cyan-500/15 text-[#00F0FF]'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{m.balance} coins left</span>
                      <span>{m.squad?.length || 0}/18 players</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Chat Panel (if open) */}
          {chatOpen && (
            <div className="bg-[#111728] border border-[#222f49] rounded-2xl p-4 space-y-3 shadow-md">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase block border-b border-[#1f2b42] pb-2">
                ROOM CHAT
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs font-mono">
                {roomState.chatMessages?.map((msg) => (
                  <div key={msg.id} className="text-slate-300">
                    <strong className="text-[#00F0FF]">{msg.username}:</strong> {msg.text}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Chat with managers..."
                  className="flex-1 bg-[#0a0e1a] border border-[#23314d] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
                />
                <button
                  type="submit"
                  className="bg-[#00F0FF] text-black font-bold text-xs px-3 py-1.5 rounded-xl font-mono"
                >
                  SEND
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* SOLD! Full-Screen Overlay Modal */}
      {roomState.phase === 'LOT_SOLD_TRANSITION' && roomState.lastSold && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-gradient-to-b from-[#182138] to-[#0d1424] border-2 border-rose-500 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-[0_0_50px_rgba(244,63,94,0.4)]">
            <span className="pixel-text text-3xl sm:text-4xl font-black text-rose-500 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(244,63,94,0.8)] block animate-bounce">
              SOLD!
            </span>

            <div className="text-white space-y-1">
              <h3 className="text-xl font-black uppercase tracking-wide">
                {roomState.lastSold.player?.name}
              </h3>
              <p className="text-xs font-mono text-slate-400">
                {roomState.lastSold.player?.club} · {roomState.lastSold.player?.position}
              </p>
            </div>

            <div className="bg-[#090e1a] border border-[#1f2b42] p-4 rounded-2xl space-y-2">
              <span className="text-xs font-mono text-slate-400 block uppercase">
                SIGNED BY
              </span>
              <span className="text-lg font-black text-[#00F0FF] block">
                {roomState.lastSold.buyerName}
              </span>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {roomState.lastSold.price} COINS
              </div>
            </div>

            {roomState.lastSold.isBargain && (
              <div className="inline-block bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs px-3 py-1 rounded-full font-bold">
                🟢 Bargain · est. value {roomState.lastSold.estimatedValue}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RoomPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0d14] text-white flex items-center justify-center p-8 font-mono text-xs text-slate-400">
          Entering arena room...
        </div>
      }
    >
      <RoomContent />
    </Suspense>
  );
}
