'use client';

import React from 'react';
import { useSocket, NotificationItem } from '../../contexts/SocketContext';
import { Gavel, TrendingUp, AlertCircle, Info } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications } = useSocket();

  if (notifications.length === 0) return null;

  // Show top 3 most recent
  const visibleToasts = notifications.slice(0, 3);

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'sold':
        return <Gavel className="w-4 h-4 text-emerald-400" />;
      case 'bid':
        return <TrendingUp className="w-4 h-4 text-cyan-400" />;
      case 'unsold':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <Info className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {visibleToasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto p-3 rounded-xl border border-[#2c2c35] bg-[#18181f]/95 backdrop-blur-md shadow-2xl flex items-start space-x-3 transition-all animate-in fade-in slide-in-from-bottom-3 duration-300"
        >
          <div className="mt-0.5">{getIcon(toast.type)}</div>
          <div className="flex-1 leading-tight">
            <h5 className="font-['Silkscreen',monospace] text-[11px] font-bold text-white tracking-wide">
              {toast.title}
            </h5>
            <p className="text-xs text-slate-300 mt-0.5">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
