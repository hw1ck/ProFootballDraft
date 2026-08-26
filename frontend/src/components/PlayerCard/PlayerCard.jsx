import React from 'react';
import './PlayerCard.css';
import { tierConfig, getTierFromRating } from './tierConfig';

// SVG hex grid pattern — same pattern used across the design system, scaled to card size.
// It's encoded as a data URI so it works without an extra file and renders inside overflow:hidden.
const HEX_PATTERN_URI = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Cpath d='M14 2 L26 8 L26 20 L14 26 L2 20 L2 8 Z' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='0.8'/%3E%3C/svg%3E")`;

// Glare/shine layer — a static diagonal highlight across the top-right corner.
// This is what gives it the "foil" feel at small sizes without being distracting.
const GLARE_GRADIENT = `linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0) 60%)`;

export default function PlayerCard({ player, isMini = false, showStats = false }) {
  const tierKey = getTierFromRating(player.overallRating);
  const theme = tierConfig[tierKey];

  const handleImageError = (e) => {
    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
    e.target.classList.add('fallback-avatar');
  };

  const handleClubError = (e) => {
    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
  };

  // Card surface: corner-to-corner diagonal foil derived from tierConfig.
  // gradientFrom (top-left) → gradientMid (centre) → gradientTo (bottom-right).
  const cardBackground = `linear-gradient(135deg, ${theme.gradientFrom} 0%, ${theme.gradientMid} 50%, ${theme.gradientTo} 100%)`;

  // Thin top-edge accent band using the tier accent stop — mimics the shimmer 
  // line you'd see on a physical foil card viewed at an angle.
  const topEdge = `linear-gradient(180deg, ${theme.accentStop} 0%, transparent 100%)`;

  return (
    <div
      className={`modern-card relative flex flex-col overflow-hidden select-none ${isMini ? 'is-mini' : ''}`}
      style={{
        '--tier-color': theme.color,
        // CLEAN solid border — no box-shadow, no blur, just a crisp line.
        border: `1.5px solid ${theme.color}`,
        background: cardBackground,
      }}
    >
      {/* Hex pattern texture — sits on top of the gradient, very low opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: HEX_PATTERN_URI,
          backgroundRepeat: 'repeat',
          opacity: isMini ? 0.5 : 0.7,
        }}
      />

      {/* Glare / foil shine layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: GLARE_GRADIENT }}
      />

      {/* Top accent band */}
      <div
        className={`absolute top-0 left-0 w-full pointer-events-none`}
        style={{
          height: isMini ? '30%' : '35%',
          background: topEdge,
          opacity: 0.6,
        }}
      />

      {/* Card content */}
      <div className={`relative z-10 w-full h-full flex flex-col justify-between ${isMini ? 'p-1.5' : 'p-4'}`}>

        {/* Header: Rating & Position */}
        <div className={`flex justify-between items-start ${isMini ? 'mb-0.5' : 'mb-2'}`}>
          <div className="flex flex-col items-center leading-none">
            <span
              className={`${isMini ? 'text-[15px]' : 'text-3xl'} font-black leading-none tracking-tighter`}
              style={{ color: theme.color }}
            >
              {player.overallRating}
            </span>
            <span className={`${isMini ? 'text-[7px]' : 'text-[10px]'} uppercase tracking-widest font-bold`} style={{ color: theme.color, opacity: 0.75 }}>
              {player.position}
            </span>
          </div>

          {/* Badges — only on full-size cards */}
          {!isMini && (
            <div className="flex gap-1.5 items-center bg-black/40 rounded-full px-2 py-1 border border-white/10">
              <div className="w-5 h-4 overflow-hidden rounded-sm relative">
                <img src={player.nation?.flagUrl} alt={player.nation?.name} className="w-full h-full object-cover absolute top-0 left-0" onError={handleClubError} />
              </div>
              <img src={player.league?.crestUrl} alt={player.league?.name} className="w-4 h-4 object-contain" onError={handleClubError} />
              <img src={player.club?.crestUrl} alt={player.club?.name} className="w-5 h-5 object-contain" onError={handleClubError} />
            </div>
          )}
        </div>

        {/* Player Photo */}
        <div className={`flex-grow flex justify-center items-center relative ${isMini ? 'my-0' : '-mt-2'}`}>
          {/* Subtle tier-tinted radial glow behind photo */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none ${isMini ? 'w-10 h-10 blur-md' : 'w-28 h-28 blur-2xl'}`}
            style={{ background: theme.color, opacity: isMini ? 0.15 : 0.25 }}
          />
          <div className={`relative z-10 ${isMini ? 'w-[78%] h-full flex items-end' : 'w-[120px] h-[120px]'}`}>
            <img
              src={player.photoUrl}
              alt={player.name || player.lastName}
              className={`player-photo absolute bottom-0 left-1/2 -translate-x-1/2 object-contain ${isMini ? 'w-full h-[120%]' : 'w-full h-full drop-shadow-xl'}`}
              onError={handleImageError}
            />
          </div>
        </div>

        {/* Player Name */}
        <div className={`text-center w-full z-20 ${isMini ? (showStats ? 'mb-1' : 'pb-1') : 'mb-3'}`}>
          {(() => {
            const rawName = player.name || player.lastName;
            // Option A approach: if it's mini, and the name is one of our known aliases, use it.
            const display = isMini 
              ? (player.shortName || (rawName === 'Alexander-Arnold' ? 'ARNOLD' : rawName === 'Vinícius Jr.' ? 'VINI JR' : rawName) || player.lastName)
              : rawName;
            
            const len = display.length;
            let nameClasses = '';
            
            // Tighter thresholds and smaller fonts to prevent truncation on 80px cards
            if (len <= 7) {
              nameClasses = isMini ? 'text-[8px] tracking-wide' : 'text-lg tracking-widest';
            } else if (len <= 10) {
              nameClasses = isMini ? 'text-[7px] tracking-normal' : 'text-base tracking-wide';
            } else {
              nameClasses = isMini ? 'text-[6px] tracking-tighter' : 'text-sm tracking-tighter';
            }

            return (
              <h2 className={`${nameClasses} font-black uppercase text-white leading-tight truncate whitespace-nowrap`}>
                {display}
              </h2>
            );
          })()}
          {/* Tier-colored underline */}
          <div
            className={`mx-auto rounded-full ${isMini ? 'w-5 h-[1px] mt-0.5' : 'w-14 h-[2px] mt-1'}`}
            style={{ background: theme.color, opacity: 0.6 }}
          />
        </div>

        {/* ── Stats Grid ──────────────────────────────────── */}
        {/* Visible on full-size always; visible on mini only when showStats=true */}
        {(!isMini || showStats) && player.stats && (
          <div
            className={`w-full z-20 rounded-md overflow-hidden ${isMini ? '' : 'mb-0'}`}
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {/* Row 1: PAC · SHO · PAS */}
            <div className={`grid grid-cols-3 ${isMini ? 'py-0.5' : 'py-1.5'}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {[['PAC', player.stats.pac], ['SHO', player.stats.sho], ['PAS', player.stats.pas]].map(([label, val], i) => (
                <div key={label} className="flex flex-col items-center justify-center" style={{ borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                  <span className={`uppercase tracking-widest font-semibold text-white/40 leading-none ${isMini ? 'text-[4px] mb-[1px]' : 'text-[8px] mb-0.5'}`}>{label}</span>
                  <span className={`font-black leading-none tracking-tighter ${isMini ? 'text-[9px]' : 'text-[15px]'}`} style={{ color: theme.color }}>{val}</span>
                </div>
              ))}
            </div>
            {/* Row 2: DRI · DEF · PHY */}
            <div className={`grid grid-cols-3 ${isMini ? 'py-0.5' : 'py-1.5'}`}>
              {[['DRI', player.stats.dri], ['DEF', player.stats.def], ['PHY', player.stats.phy]].map(([label, val], i) => (
                <div key={label} className="flex flex-col items-center justify-center" style={{ borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                  <span className={`uppercase tracking-widest font-semibold text-white/40 leading-none ${isMini ? 'text-[4px] mb-[1px]' : 'text-[8px] mb-0.5'}`}>{label}</span>
                  <span className={`font-black leading-none tracking-tighter ${isMini ? 'text-[9px]' : 'text-[15px]'}`} style={{ color: theme.color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
