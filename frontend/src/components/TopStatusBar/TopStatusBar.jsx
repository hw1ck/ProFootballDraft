import React, { useState } from 'react';

export default function TopStatusBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userData] = useState({
    username: 'AlexTheGreat',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  });

  return (
    <nav className="w-full bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between z-50">
      
      {/* Left: Website Name */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          <span className="text-white font-black italic">PFD</span>
        </div>
        <h1 className="text-xl font-black text-white tracking-wider uppercase hidden sm:block">
          Pro Football <span className="text-neon-blue">Draft</span>
        </h1>
      </div>

      {/* Middle: Navigation Options */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm font-bold text-white/90 hover:text-neon-blue transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-neon-blue after:rounded-full">Board Room</a>
        <a href="#" className="text-sm font-bold text-white/50 hover:text-white transition-colors">Squads</a>
        <a href="#" className="text-sm font-bold text-white/50 hover:text-white transition-colors">Market</a>
        <a href="#" className="text-sm font-bold text-white/50 hover:text-white transition-colors">Leaderboard</a>
      </div>

      {/* Right: Player Profile & Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full pl-2 pr-4 py-1.5 transition-all focus:outline-none focus:ring-1 focus:ring-neon-blue"
        >
          <img src={userData.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full bg-dark-bg" />
          <span className="text-sm font-bold text-white">{userData.username}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-white/50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-48 rounded-xl bg-[#0f141e] border border-white/10 shadow-2xl py-2 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 border-b border-white/5 mb-1">
              <p className="text-xs text-white/50 uppercase tracking-wider font-bold">Signed in as</p>
              <p className="text-sm text-white font-bold truncate">{userData.username}</p>
            </div>
            <button className="w-full text-left px-4 py-2 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors">View Profile</button>
            <button className="w-full text-left px-4 py-2 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors">My Teams</button>
            <button className="w-full text-left px-4 py-2 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors">Settings</button>
            <div className="h-px bg-white/5 my-1"></div>
            <button className="w-full text-left px-4 py-2 text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
