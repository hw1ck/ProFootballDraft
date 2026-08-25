import React from 'react';
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
