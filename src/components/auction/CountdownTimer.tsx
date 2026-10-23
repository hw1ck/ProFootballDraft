'use client';

import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';

export const CountdownTimer: React.FC = () => {
  const { timerSeconds, auctionState } = useSocket();

  const initialTimer = auctionState?.initialTimer || 25;
  const isRunning = auctionState?.isTimerRunning || false;
  const isUrgent = timerSeconds <= 5 && timerSeconds > 0 && isRunning;
  const isPaused = auctionState?.status === 'paused';

  // Calculate SVG circle progress
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timerSeconds / initialTimer) * circumference;

  const getTimerColor = () => {
    if (isUrgent) return '#EF4444'; // Red
    if (timerSeconds <= 10) return '#F59E0B'; // Amber
    return '#10B981'; // Emerald
  };

  return (
    <div className={`rounded-2xl border p-4 flex flex-col items-center justify-center transition-all duration-300 ${
      isUrgent
        ? 'border-rose-500/60 bg-rose-500/10 shadow-lg shadow-rose-500/20 animate-pulse'
        : 'border-[#2c2c35] bg-[#18181f]'
    }`}>
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="#2c2c35"
            strokeWidth="7"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke={getTimerColor()}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={isNaN(strokeDashoffset) ? 0 : strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Center digital readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span className={`font-['Silkscreen',monospace] text-3xl font-black ${
            isUrgent ? 'text-rose-400 scale-110' : timerSeconds <= 10 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {timerSeconds}
          </span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 uppercase">SECONDS</span>
        </div>
      </div>

      <div className="mt-3 text-center">
        {isUrgent && (
          <div className="flex items-center justify-center space-x-1 text-rose-400 text-xs font-bold font-mono">
            <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
            <span>FINAL CALL!</span>
          </div>
        )}
        {isPaused && (
          <span className="text-amber-400 text-xs font-mono font-bold">TIMER PAUSED</span>
        )}
        {!isUrgent && !isPaused && isRunning && (
          <span className="text-slate-400 text-xs font-mono">Bidding Window Active</span>
        )}
        {!isRunning && !isPaused && (
          <span className="text-slate-500 text-xs font-mono">Timer Stopped</span>
        )}
      </div>
    </div>
  );
};
