import os
import shutil

FRONTEND_DIR = "frontend"
SRC_DIR = os.path.join(FRONTEND_DIR, "src")
BACKEND_DIR = "backend/src/main/java/com/profootballdraft/backend"

# --- FRONTEND REFACTOR ---

APP_JSX = """import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Sandbox from './pages/Sandbox/Sandbox';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<AppLayout />} />
        <Route path="/sandbox" element={<Sandbox />} />
      </Routes>
    </div>
  )
}

export default App
"""

MAIN_JSX = """import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
"""

API_JS = """// Centralized API Service

const BASE_URL = '/api/v1';

// Future: Add logic to retrieve and attach JWT tokens here
const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
    };
};

export const fetchModes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/dashboard/modes`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch modes');
        return await response.json();
    } catch (error) {
        console.error("Error fetching modes data:", error);
        return [];
    }
};

export const fetchHub = async () => {
    try {
        const response = await fetch(`${BASE_URL}/dashboard/hub`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch hub data');
        return await response.json();
    } catch (error) {
        console.error("Error fetching hub data:", error);
        return null;
    }
};
"""

HOME_DASHBOARD_JSX = """import React, { useState, useEffect } from 'react';
import HeroWidget from '../../components/HeroWidget/HeroWidget';
import ModeCard from '../../components/ModeCard/ModeCard';
import { fetchModes, fetchHub } from '../../services/api';
import styles from './HomeDashboard.module.css';

export default function HomeDashboard() {
  const [modesData, setModesData] = useState([]);
  const [hubData, setHubData] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      const modes = await fetchModes();
      setModesData(modes);
      
      const hub = await fetchHub();
      setHubData(hub);
    };
    
    loadData();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <HeroWidget />
      
      <div className={styles.contentGrid}>
        
        {/* Main Modes Grid */}
        <section className={styles.modesSection}>
          <h2 className={styles.sectionTitle}>Game Modes</h2>
          <div className={styles.modesGrid}>
            {modesData.map(mode => (
              <ModeCard 
                key={mode.id} 
                title={mode.title} 
                description={mode.description} 
                status={mode.status} 
              />
            ))}
          </div>
        </section>

        {/* Sidebar / Hub */}
        <aside className={styles.sidebarSection}>
          <h2 className={styles.sectionTitle}>Your Hub</h2>
          <div className={styles.widgetsList}>
            {hubData ? (
               <div className={styles.widgetPlaceholder}>
                 <h3>{hubData.userTeamName}</h3>
                 <p>Drafts Completed: {hubData.draftsCompleted}</p>
                 <p>Current Rank: {hubData.currentRank}</p>
               </div>
            ) : (
               <div className={styles.widgetPlaceholder}>
                 <h3>Sign In</h3>
                 <p>Log in to view your team stats and history.</p>
               </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
"""


# --- BACKEND REFACTOR ---

PLAYER_CONTROLLER = """package com.profootballdraft.backend.controllers;

import com.profootballdraft.backend.models.*;
import com.profootballdraft.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/players")
public class PlayerController {

    @Autowired private PlayerRepository playerRepository;
    @Autowired private ClubRepository clubRepository;
    @Autowired private NationRepository nationRepository;
    @Autowired private LeagueRepository leagueRepository;

    private Integer safeGetInteger(Map<String, Object> data, String key) {
        Object val = data.get(key);
        if (val instanceof Integer) return (Integer) val;
        if (val instanceof String) {
            try { return Integer.parseInt((String) val); } catch (NumberFormatException e) { return 0; }
        }
        return 0; // fallback safe default
    }

    @PostMapping("/batch")
    @Transactional
    public String batchImport(@RequestBody List<Map<String, Object>> playersData) {
        int count = 0;
        for (Map<String, Object> data : playersData) {
            
            // 1. Resolve League
            String leagueName = (String) data.getOrDefault("leagueName", "Unknown League");
            League league = leagueRepository.findByName(leagueName).orElseGet(() -> {
                League newLeague = new League();
                newLeague.setName(leagueName);
                return leagueRepository.save(newLeague);
            });

            // 2. Resolve Club
            String clubName = (String) data.getOrDefault("clubName", "Unknown Club");
            String clubLogo = (String) data.getOrDefault("clubLogoUrl", "");
            Club club = clubRepository.findByName(clubName).orElseGet(() -> {
                Club newClub = new Club();
                newClub.setName(clubName);
                newClub.setLogoUrl(clubLogo);
                newClub.setLeague(league);
                return clubRepository.save(newClub);
            });

            // 3. Resolve Nation
            String nationName = (String) data.getOrDefault("nationName", "Unknown Nation");
            String countryCode = (String) data.getOrDefault("countryCode", "xx");
            Nation nation = nationRepository.findByName(nationName).orElseGet(() -> {
                Nation newNation = new Nation();
                newNation.setName(nationName);
                newNation.setCountryCode(countryCode);
                return nationRepository.save(newNation);
            });

            // 4. Create Player (with safe casts)
            Player player = new Player();
            player.setFirstName((String) data.getOrDefault("firstName", ""));
            player.setLastName((String) data.getOrDefault("lastName", "Unknown"));
            player.setPosition((String) data.getOrDefault("position", "RES"));
            player.setPlayerImageUrl((String) data.getOrDefault("playerImageUrl", ""));
            
            player.setOverallRating(safeGetInteger(data, "overallRating"));
            player.setPace(safeGetInteger(data, "pace"));
            player.setShooting(safeGetInteger(data, "shooting"));
            player.setPassing(safeGetInteger(data, "passing"));
            player.setDribbling(safeGetInteger(data, "dribbling"));
            player.setDefending(safeGetInteger(data, "defending"));
            player.setPhysicality(safeGetInteger(data, "physicality"));
            
            player.setClub(club);
            player.setNation(nation);

            playerRepository.save(player);
            count++;
        }
        return "Successfully imported " + count + " players.";
    }
}
"""

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"[+] Wrote {path}")

def cleanup():
    # 1. Frontend
    write_file(os.path.join(SRC_DIR, "App.jsx"), APP_JSX)
    write_file(os.path.join(SRC_DIR, "main.jsx"), MAIN_JSX)
    write_file(os.path.join(SRC_DIR, "services", "api.js"), API_JS)
    write_file(os.path.join(SRC_DIR, "pages", "HomeDashboard", "HomeDashboard.jsx"), HOME_DASHBOARD_JSX)

    # 2. Backend
    write_file(os.path.join(BACKEND_DIR, "controllers", "PlayerController.java"), PLAYER_CONTROLLER)

    # 3. Execution Scripts Cleanup
    # We will remove initial generator scripts that are no longer needed
    files_to_remove = [
        "execution/generate_backend_code.py",
        "execution/generate_frontend_cards.py",
        "execution/build_backend_api.py",
        "execution/normalize_db.py",
        "execution/setup_fut_card.py"
    ]
    for f in files_to_remove:
        if os.path.exists(f):
            os.remove(f)
            print(f"[-] Removed {f}")

    print("Cleanup successful!")

if __name__ == "__main__":
    cleanup()
