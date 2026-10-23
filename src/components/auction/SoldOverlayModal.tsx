'use client';

import React, { useEffect, useState } from 'react';
import { PlayerCard } from '../player/PlayerCard';
import { LastSoldInfo } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCoins } from '../../utils/formatters';
import { CheckCircle2, Sparkles, AlertTriangle, X } from 'lucide-react';

interface SoldOverlayModalProps {
  soldInfo: LastSoldInfo | null;
  onClose: () => void;
}

export const SoldOverlayModal: React.FC<SoldOverlayModalProps> = ({ soldInfo, onClose }) => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (soldInfo) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [soldInfo, onClose]);

  if (!visible || !soldInfo) return null;

  const isUserWinner = Boolean(
    user?.team?._id &&
      (user.team._id === soldInfo.team._id || user.team.id === soldInfo.team._id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0f141c] border-2 border-[#2b3a4d] rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            setVisible(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-[#18202c] hover:bg-[#222d3d] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Left: Tilted EA FC Player Card */}
          <div className="sm:col-span-5 flex justify-center">
            <div className="transform -rotate-6 hover:rotate-0 transition-transform duration-300 scale-95 sm:scale-100">
              <PlayerCard
                ovr={soldInfo.player.stats?.overall || 82}
                position={soldInfo.player.position}
                name={soldInfo.player.name}
                surname={soldInfo.player.surname}
                club={soldInfo.player.club}
                nation={soldInfo.player.nationality}
                nationCode={soldInfo.player.nationalityCode}
                role={soldInfo.player.role}
                rarity={soldInfo.player.rarity || 'RARE'}
                pac={soldInfo.player.stats?.pace || 75}
                sho={soldInfo.player.stats?.shooting || 75}
                pas={soldInfo.player.stats?.passing || 75}
                dri={soldInfo.player.stats?.dribbling || 75}
                def={soldInfo.player.stats?.defending || 75}
                phy={soldInfo.player.stats?.physical || 75}
                photoUrl={soldInfo.player.photoUrl}
              />
            </div>
          </div>

          {/* Right: Gavel Stamp & Acquisition Details */}
          <div className="sm:col-span-7 space-y-4 text-center sm:text-left">
            {/* Red Neon Stamp */}
            <div className="inline-block transform -rotate-2 px-4 py-1.5 rounded-lg border-2 border-rose-500 bg-rose-500/20 text-rose-400 font-mono font-black text-2xl tracking-widest shadow-[0_0_20px_rgba(244,63,94,0.4)]">
              SOLD!
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                {soldInfo.player.name}
              </h2>
              <p className="text-xs font-mono text-slate-400">
                {soldInfo.player.position} · {soldInfo.player.club}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#141b24] border border-[#222e3e] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase">SOLD TO:</span>
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <span>{soldInfo.team.logo || '⚽'}</span>
                  <span>{soldInfo.team.name}</span>
                  {isUserWinner && (
                    <span className="ml-1 px-1.5 py-0.2 rounded bg-emerald-500 text-black font-black text-[10px]">
                      YOU!
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase">PURCHASE PRICE:</span>
                <span className="text-lg font-black font-mono text-emerald-400">
                  {formatCoins(soldInfo.amount)} coins
                </span>
              </div>
            </div>

            {/* Valuation Classification Pill */}
            {soldInfo.isBargain && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>🟢 Bargain · est. value {formatCoins(soldInfo.estimatedValue)}</span>
              </div>
            )}

            {soldInfo.isOverpay && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>⚠️ Overpay · est. value {formatCoins(soldInfo.estimatedValue)}</span>
              </div>
            )}

            {!soldInfo.isBargain && !soldInfo.isOverpay && (
              <div className="text-[11px] font-mono text-slate-400">
                Fair market deal · est. value {formatCoins(soldInfo.estimatedValue)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
