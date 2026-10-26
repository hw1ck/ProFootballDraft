'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundEffects';
import { useAuth, TeamData } from './AuthContext';
import { calculateMaxBid } from '../utils/auctionMath';
import { SOCKET_SERVER } from '../utils/apiConfig';

export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  overall: number;
}

export interface PlayerData {
  _id: string;
  id?: string;
  name: string;
  displayName?: string;
  surname?: string;
  age: number;
  preferredFoot?: string;
  jerseyNumber?: string;
  position: string;
  subPositions?: string[];
  role: string;
  nationality: string;
  nationalityCode?: string;
  club: string;
  league?: string;
  basePrice: number;
  estimatedValue?: number;
  currentPrice: number;
  status: 'upcoming' | 'in_auction' | 'sold' | 'unsold';
  soldTo?: TeamData | null;
  stats: PlayerStats;
  rarity?: string;
  photoUrl?: string;
  orderIndex: number;
}

export interface BidHistoryItem {
  teamId: string;
  teamName: string;
  teamShort: string;
  teamColor: string;
  amount: number;
  timestamp: string | Date;
}

export interface ActivityFeedItem {
  text: string;
  type?: 'bid' | 'sold' | 'unsold' | 'skip' | 'anti_snipe' | 'info';
  timestamp: string | Date;
}

export interface LastSoldInfo {
  player: PlayerData;
  team: {
    _id: string;
    name: string;
    shortName: string;
    logo?: string;
    color?: string;
  };
  amount: number;
  isBargain: boolean;
  isOverpay: boolean;
  estimatedValue: number;
}

export interface AuctionStateData {
  _id?: string;
  status: 'idle' | 'bidding' | 'paused' | 'sold' | 'unsold' | 'completed';
  competition?: string;
  lotNumber?: number;
  totalLots?: number;
  currentPlayer: PlayerData | null;
  currentBid: number;
  currentBidder: TeamData | null;
  timerSeconds: number;
  initialTimer: number;
  antiSnipe?: boolean;
  antiSnipeTriggered?: boolean;
  isTimerRunning: boolean;
  skippedManagers?: Array<{ _id: string; name?: string } | string>;
  bidHistory: BidHistoryItem[];
  activityFeed?: ActivityFeedItem[];
  lastSold?: LastSoldInfo | null;
  message: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'bid' | 'sold' | 'unsold' | 'info' | 'warning';
  timestamp: string | Date;
}

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  auctionState: AuctionStateData | null;
  timerSeconds: number;
  notifications: NotificationItem[];
  lastSoldInfo: LastSoldInfo | null;
  clearLastSold: () => void;
  lastBidTeam: Partial<TeamData> | null;
  isMuted: boolean;
  toggleMute: () => void;
  placeBid: (amount: number) => void;
  skipCurrentLot: () => void;
  startAuction: (playerId?: string) => void;
  pauseAuction: () => void;
  resumeAuction: () => void;
  hammerSell: () => void;
  passPlayer: () => void;
  nextPlayer: () => void;
  setAuctionPlayer: (playerId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);


export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [auctionState, setAuctionState] = useState<AuctionStateData | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [lastBidTeam, setLastBidTeam] = useState<Partial<TeamData> | null>(null);
  const [lastSoldInfo, setLastSoldInfo] = useState<LastSoldInfo | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const { user, refreshProfile } = useAuth();

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const clearLastSold = () => {
    setLastSoldInfo(null);
  };

  useEffect(() => {
    const s = io(SOCKET_SERVER, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    s.on('connect', () => {
      console.log('✅ Connected to live auction socket:', s.id);
      setConnected(true);
    });

    s.on('disconnect', () => {
      console.log('❌ Disconnected from auction socket');
      setConnected(false);
    });

    s.on('auction:state_update', (state: AuctionStateData) => {
      setAuctionState(state);
      if (typeof state.timerSeconds === 'number') {
        setTimerSeconds(state.timerSeconds);
      }
      if (state.lastSold) {
        setLastSoldInfo(state.lastSold);
      }
    });

    s.on('timer:tick', (data: { seconds: number; initialTimer: number }) => {
      setTimerSeconds(data.seconds);
      if (data.seconds <= 5 && data.seconds > 0) {
        soundManager.playTickSound(true);
      } else if (data.seconds <= 10 && data.seconds > 5) {
        soundManager.playTickSound(false);
      }
    });

    s.on('bid:success', (data: { bid: any; team: any; amount: number; state: AuctionStateData }) => {
      setAuctionState(data.state);
      setLastBidTeam(data.team);
      soundManager.playBidSound();
    });

    s.on('bid:error', (error: { message: string }) => {
      soundManager.playErrorSound();
      addNotification('BID REJECTED', error.message, 'warning');
    });

    s.on('auction:sold', (data: { player: any; team: any; amount: number; state: AuctionStateData; lastSold?: LastSoldInfo }) => {
      setAuctionState(data.state);
      soundManager.playGavelSound();
      if (data.lastSold) {
        setLastSoldInfo(data.lastSold);
      } else {
        setLastSoldInfo({
          player: data.player,
          team: data.team,
          amount: data.amount,
          isBargain: (data as any).isBargain || false,
          isOverpay: (data as any).isOverpay || false,
          estimatedValue: data.player?.estimatedValue || 100,
        });
      }

      // Celebrate with confetti if current user's team won
      if (user?.team?._id && (user.team._id === data.team._id || user.team.id === data.team._id)) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#b4ff39', '#10B981', '#ffffff', '#38bdf8'],
        });
      }

      refreshProfile();
    });

    s.on('auction:unsold', (data: { player: any; message: string; state: AuctionStateData }) => {
      setAuctionState(data.state);
      soundManager.playErrorSound();
    });

    s.on('auction:notification', (notification: NotificationItem) => {
      addNotification(notification.title, notification.message, notification.type);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [user, refreshProfile]);

  const addNotification = (title: string, message: string, type: NotificationItem['type'] = 'info') => {
    const item: NotificationItem = {
      id: Date.now() + Math.random(),
      title,
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications((prev) => [item, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== item.id));
    }, 4500);
  };

  const placeBid = useCallback(
    (amount: number) => {
      if (!socket || !connected) {
        alert('Socket connection disconnected. Reconnecting...');
        return;
      }
      if (!user?.team?._id && !user?.team?.id) {
        alert('You must be managing a team to bid!');
        return;
      }

      const teamId = user.team._id || user.team.id;
      socket.emit('bid:place', {
        teamId,
        amount,
        userId: user._id || user.id,
      });
    },
    [socket, connected, user]
  );

  const skipCurrentLot = useCallback(() => {
    if (!socket || !connected) return;
    if (!user?.team?._id && !user?.team?.id) return;

    const teamId = user.team._id || user.team.id;
    socket.emit('bid:skip', { teamId });
  }, [socket, connected, user]);

  const startAuction = useCallback(
    (playerId?: string) => {
      if (!socket) return;
      socket.emit('auction:start', { playerId });
    },
    [socket]
  );

  const pauseAuction = useCallback(() => {
    if (!socket) return;
    socket.emit('auction:pause');
  }, [socket]);

  const resumeAuction = useCallback(() => {
    if (!socket) return;
    socket.emit('auction:resume');
  }, [socket]);

  const hammerSell = useCallback(() => {
    if (!socket) return;
    socket.emit('auction:hammer');
  }, [socket]);

  const passPlayer = useCallback(() => {
    if (!socket) return;
    socket.emit('auction:pass');
  }, [socket]);

  const nextPlayer = useCallback(() => {
    if (!socket) return;
    socket.emit('auction:next_player');
  }, [socket]);

  const setAuctionPlayer = useCallback(
    (playerId: string) => {
      if (!socket) return;
      socket.emit('auction:set_player', { playerId });
    },
    [socket]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        auctionState,
        timerSeconds,
        notifications,
        lastSoldInfo,
        clearLastSold,
        lastBidTeam,
        isMuted,
        toggleMute,
        placeBid,
        skipCurrentLot,
        startAuction,
        pauseAuction,
        resumeAuction,
        hammerSell,
        passPlayer,
        nextPlayer,
        setAuctionPlayer,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const DEFAULT_SOCKET_FALLBACK: SocketContextType = {
  socket: null,
  connected: false,
  auctionState: null,
  timerSeconds: 30,
  notifications: [],
  lastSoldInfo: null,
  clearLastSold: () => {},
  lastBidTeam: null,
  isMuted: false,
  toggleMute: () => {},
  placeBid: () => {},
  skipCurrentLot: () => {},
  startAuction: () => {},
  pauseAuction: () => {},
  resumeAuction: () => {},
  hammerSell: () => {},
  passPlayer: () => {},
  nextPlayer: () => {},
  setAuctionPlayer: () => {}
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    return DEFAULT_SOCKET_FALLBACK;
  }
  return context;
};
