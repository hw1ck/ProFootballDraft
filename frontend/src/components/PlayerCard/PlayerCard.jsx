import React from 'react';
import './PlayerCard.css';
import { tierConfig, getTierFromRating } from './tierConfig';

export default function PlayerCard({ player }) {
  const tierKey = getTierFromRating(player.overallRating);
  const theme = tierConfig[tierKey];

  const handleImageError = (e) => {
    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
    e.target.classList.add('fallback-avatar');
  };

  const handleClubError = (e) => {
    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
  };
  
  return (
    <div 
      className="modern-card relative flex flex-col overflow-hidden select-none"
      style={{
        '--tier-color': theme.color,
        '--tier-glow': theme.glow,
      }}
    >
      {/* Background Gradient/Glass */}
      <div className="modern-card-bg absolute inset-0"></div>
      
      {/* Top Edge Glow */}
      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: 'var(--tier-color)', boxShadow: '0 0 10px var(--tier-color)' }}></div>

      <div className="relative z-10 w-full h-full flex flex-col p-4">
        
        {/* Header: Rating & Position */}
        <div className="flex justify-between items-start mb-2">
           <div className="flex flex-col items-center">
             <span className="text-3xl font-bold leading-none tracking-tighter" style={{ color: 'var(--tier-color)' }}>
               {player.overallRating}
             </span>
             <span className="text-xs text-white/60 tracking-wider font-semibold">
               {player.position}
             </span>
           </div>
           
           <div className="flex gap-1.5 items-center bg-black/40 rounded-full px-2 py-1 border border-white/10 shadow-sm">
             <div className="w-5 h-4 overflow-hidden rounded-sm relative">
                <img src={player.nation.flagUrl} alt={player.nation.name} className="w-full h-full object-cover absolute top-0 left-0" onError={handleClubError}/>
             </div>
             <img src={player.league.crestUrl} alt={player.league.name} className="w-4 h-4 object-contain" onError={handleClubError} />
             <img src={player.club.crestUrl} alt={player.club.name} className="w-5 h-5 object-contain" onError={handleClubError} />
           </div>
        </div>
        
        {/* Player Photo */}
        <div className="flex-grow flex justify-center items-center relative -mt-2">
           {/* Subtle radial glow behind photo */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-2xl opacity-40" style={{ background: 'var(--tier-color)' }}></div>
           
           <div className="w-[120px] h-[120px] relative z-10">
             <img 
               src={player.photoUrl} 
               alt={player.name} 
               className="player-photo absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full object-contain drop-shadow-xl" 
               onError={handleImageError}
             />
           </div>
        </div>
        
        {/* Player Name */}
        <div className="text-center w-full mb-3 z-20">
          <h2 className="text-lg font-bold tracking-wide truncate text-white uppercase">{player.name}</h2>
          <div className="w-12 h-[2px] mx-auto mt-1 rounded-full opacity-50" style={{ background: 'var(--tier-color)' }}></div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-center bg-black/20 rounded-xl py-2 px-1 border border-white/5 z-20">
           <div className="flex flex-col">
             <span className="text-white/50 text-[10px] font-semibold">PAC</span>
             <span className="font-bold text-sm">{player.stats.pac}</span>
           </div>
           <div className="flex flex-col border-l border-white/10">
             <span className="text-white/50 text-[10px] font-semibold">SHO</span>
             <span className="font-bold text-sm">{player.stats.sho}</span>
           </div>
           <div className="flex flex-col border-l border-white/10">
             <span className="text-white/50 text-[10px] font-semibold">PAS</span>
             <span className="font-bold text-sm">{player.stats.pas}</span>
           </div>
           <div className="flex flex-col">
             <span className="text-white/50 text-[10px] font-semibold">DRI</span>
             <span className="font-bold text-sm">{player.stats.dri}</span>
           </div>
           <div className="flex flex-col border-l border-white/10">
             <span className="text-white/50 text-[10px] font-semibold">DEF</span>
             <span className="font-bold text-sm">{player.stats.def}</span>
           </div>
           <div className="flex flex-col border-l border-white/10">
             <span className="text-white/50 text-[10px] font-semibold">PHY</span>
             <span className="font-bold text-sm">{player.stats.phy}</span>
           </div>
        </div>
      </div>
    </div>
  );
}
