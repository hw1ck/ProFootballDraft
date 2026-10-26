'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Volume2, VolumeX, Sparkles, User, Trophy, ListFilter, PlayCircle, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { DemoUserModal } from '../auction/DemoUserModal';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // Safely use socket context if wrapped, else local fallback
  let isMuted = false;
  let toggleMute = () => {};
  try {
    const socketCtx = useSocket();
    if (socketCtx) {
      isMuted = socketCtx.isMuted;
      toggleMute = socketCtx.toggleMute;
    }
  } catch {
    // context not available on this route
  }

  // Safely use auth context
  let user = { name: 'Pep Guardiola', email: 'city@profootballdraft.com', role: 'manager' };
  try {
    const authCtx = useAuth();
    if (authCtx && authCtx.user) {
      user = authCtx.user;
    }
  } catch {
    // fallback default
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/play', label: 'Play & Rooms', icon: PlayCircle, highlight: true },
    { href: '/auction', label: 'Live Arena', pulse: true },
    { href: '/pool', label: 'Draft Pool', icon: ListFilter },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0d14]/90 backdrop-blur-md border-b border-[#1c2436] px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#111728] border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_14px_rgba(0,240,255,0.25)] transition-transform group-hover:scale-105">
            <span className="text-lg">⚽</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="pixel-text text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-white via-[#dbfcff] to-[#00F0FF] font-bold tracking-tight">
              ProFootballDraft
            </span>
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse"></span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#101626]/80 border border-[#1d273d] p-1 rounded-full text-xs font-semibold">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00F0FF] to-[#10E7B2] text-[#0A0D14] font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : item.highlight
                    ? 'text-[#00F0FF] hover:text-white hover:bg-[#18233a]'
                    : 'text-slate-300 hover:text-white hover:bg-[#18233a]'
                }`}
              >
                {item.pulse && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10E7B2] shadow-[0_0_6px_#10E7B2] animate-pulse" />
                )}
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Sound Toggle + Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Stadium FX' : 'Mute Sound'}
            type="button"
            className="w-8 h-8 rounded-full bg-[#121829] border border-[#222f46] hover:border-[#00F0FF]/60 flex items-center justify-center text-slate-300 hover:text-[#00F0FF] transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#10E7B2]" />}
          </button>

          {/* Manager Role Pill / Switcher */}
          <button
            type="button"
            onClick={() => setDemoModalOpen(true)}
            className="flex items-center gap-2 bg-[#121829] hover:bg-[#1a233b] border border-[#00F0FF]/30 hover:border-[#00F0FF] text-xs px-3 sm:px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.1)]"
          >
            <div className="w-5 h-5 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/60 flex items-center justify-center text-[10px] font-bold text-[#00F0FF]">
              {user.name.charAt(0)}
            </div>
            <span className="text-slate-200 font-mono text-[11px] max-w-[90px] sm:max-w-[120px] truncate">
              {user.name}
            </span>
            <span className="text-[10px] text-[#00F0FF] font-mono">⇄</span>
          </button>

          {/* Quick Play Action Button */}
          <Link
            href="/play"
            className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-[#00F0FF] to-[#10E7B2] hover:brightness-110 text-[#090d14] font-bold text-xs px-4 py-2 rounded-full shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all font-mono"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>PLAY</span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden pt-3 pb-2 border-t border-[#1d273d] mt-3 space-y-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                  isActive
                    ? 'bg-[#00F0FF]/15 text-[#00F0FF] font-bold'
                    : 'text-slate-300 hover:bg-[#121829]'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Role Picker Modal */}
      <DemoUserModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </header>
  );
};
