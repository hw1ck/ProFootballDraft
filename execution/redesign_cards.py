import os

FRONTEND_DIR = "frontend"
SRC_DIR = os.path.join(FRONTEND_DIR, "src")
COMPONENTS_DIR = os.path.join(SRC_DIR, "components")
PLAYER_CARD_DIR = os.path.join(COMPONENTS_DIR, "PlayerCard")
PAGES_DIR = os.path.join(SRC_DIR, "pages")
SANDBOX_DIR = os.path.join(PAGES_DIR, "Sandbox")

INDEX_CSS = """@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Website Base Theme Colors */
  --bg-primary: #0a0e14;
  --bg-secondary: rgba(25, 30, 40, 0.7);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  
  /* Brand Accents */
  --accent-lime: #a3e635; /* Sleek lime green */
  --glow-lime: 0 0 15px rgba(163, 230, 53, 0.3);
  
  /* UI Elements */
  --border-subtle: 1px solid rgba(255, 255, 255, 0.1);
  --radius-card: 16px;
  
  /* Fonts */
  --font-heading: 'Inter', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  
  font-family: var(--font-body);
  line-height: 1.5;
  font-weight: 400;
  color: var(--text-primary);
  background-color: var(--bg-primary);
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background-color: var(--bg-primary);
}
"""

TIER_CONFIG_JS = """export const tierConfig = {
  green: {
    color: '#a3e635', // Website lime
    glow: 'rgba(163, 230, 53, 0.15)'
  },
  blue: {
    color: '#38bdf8', // Sleek cyan
    glow: 'rgba(56, 189, 248, 0.15)'
  },
  red: {
    color: '#fb7185', // Soft rose
    glow: 'rgba(251, 113, 133, 0.15)'
  },
  gold: {
    color: '#fbbf24', // Warm amber
    glow: 'rgba(251, 191, 36, 0.15)'
  }
};

export function getTierFromRating(rating) {
  if (rating < 70) return 'green';
  if (rating <= 79) return 'blue';
  if (rating <= 89) return 'red';
  return 'gold';
}
"""

PLAYER_CARD_JSX = """import React from 'react';
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
"""

PLAYER_CARD_CSS = """/* Modern Squircle Card Base */
.modern-card {
  width: 220px;
  height: 320px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px var(--tier-glow);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
  background-color: var(--bg-secondary);
}

.modern-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), 0 0 30px var(--tier-glow);
  border-color: rgba(255, 255, 255, 0.15);
}

/* Glassmorphic inner background */
.modern-card-bg {
  background: linear-gradient(
    135deg, 
    rgba(255, 255, 255, 0.05) 0%, 
    rgba(255, 255, 255, 0.01) 100%
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Masking the bottom of the photo softly */
.player-photo {
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
}

.fallback-avatar {
  border-radius: 50%;
  -webkit-mask-image: none;
  mask-image: none;
  opacity: 0.7;
}
"""

SANDBOX_JSX = """import React from 'react';
import PlayerCard from '../../components/PlayerCard/PlayerCard';

// 4 Mock Players targeting the 4 tiers
const mockPlayers = [
  {
    name: "SMITH",
    overallRating: 65, // Green Tier (<70)
    position: "CB",
    club: { name: "AFC Richmond", crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png" },
    nation: { name: "England", flagUrl: "https://flagcdn.com/w40/gb-eng.png" },
    league: { name: "Premier League", crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/1200px-Premier_League_Logo.svg.png" },
    photoUrl: "https://cdn.sofifa.net/players/243/630/23_120.png",
    cardType: "BRONZE BASE",
    stats: { pac: 55, sho: 32, pas: 45, dri: 48, def: 67, phy: 72 }
  },
  {
    name: "JONES",
    overallRating: 76, // Blue Tier (70-79)
    position: "CDM",
    club: { name: "Generic FC", crestUrl: "invalid_url_test" }, // test club fallback
    nation: { name: "USA", flagUrl: "https://flagcdn.com/w40/us.png" },
    league: { name: "MLS", crestUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/MLS_crest_logo_RGB_gradient.svg/1200px-MLS_crest_logo_RGB_gradient.svg.png" },
    photoUrl: "https://cdn.sofifa.net/players/232/363/23_120.png",
    cardType: "SILVER INFORM",
    stats: { pac: 70, sho: 60, pas: 75, dri: 72, def: 74, phy: 80 }
  },
  {
    name: "VANCE",
    overallRating: 88, // Red Tier (80-89)
    position: "CM",
    club: { name: "Real Madrid", crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png" },
    nation: { name: "Spain", flagUrl: "https://flagcdn.com/w40/es.png" },
    league: { name: "La Liga", crestUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/LaLiga_logo_2023.svg/1200px-LaLiga_logo_2023.svg.png" },
    photoUrl: "invalid_photo_url", // test player fallback
    cardType: "FEATURE",
    brandBadge: "FUT",
    stats: { pac: 84, sho: 82, pas: 89, dri: 88, def: 76, phy: 79 }
  },
  {
    name: "PELE",
    overallRating: 98, // Gold Tier (>=90)
    position: "CAM",
    club: { name: "Icons", crestUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg" },
    nation: { name: "Brazil", flagUrl: "https://flagcdn.com/w40/br.png" },
    league: { name: "Legends", crestUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg" },
    photoUrl: "https://cdn.sofifa.net/players/237/067/23_120.png",
    cardType: "ICON",
    stats: { pac: 95, sho: 96, pas: 93, dri: 96, def: 60, phy: 76 }
  }
];

export default function Sandbox() {
  return (
    <div className="p-10 min-h-[calc(100vh-80px)] font-sans" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>Modern Player Card Demo</h1>
      <p className="text-center mb-10" style={{ color: 'var(--text-secondary)' }}>Clean Squircle Design with Glassmorphism</p>
      
      <div className="flex flex-wrap justify-center gap-10">
        {mockPlayers.map((player, idx) => (
          <PlayerCard key={idx} player={player} />
        ))}
      </div>
    </div>
  );
}
"""

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"[+] Wrote {path}")

def setup():
    # Update index.css
    write_file(os.path.join(SRC_DIR, "index.css"), INDEX_CSS)
    
    # Update Components
    write_file(os.path.join(PLAYER_CARD_DIR, "tierConfig.js"), TIER_CONFIG_JS)
    write_file(os.path.join(PLAYER_CARD_DIR, "PlayerCard.jsx"), PLAYER_CARD_JSX)
    write_file(os.path.join(PLAYER_CARD_DIR, "PlayerCard.css"), PLAYER_CARD_CSS)
    
    # Update Sandbox
    write_file(os.path.join(SANDBOX_DIR, "Sandbox.jsx"), SANDBOX_JSX)
        
    print("Modern Redesign scaffolding complete!")

if __name__ == "__main__":
    setup()
