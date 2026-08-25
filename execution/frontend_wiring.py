import os

FRONTEND_DIR = "frontend"
VITE_CONFIG_PATH = os.path.join(FRONTEND_DIR, "vite.config.js")
HOME_DASHBOARD_PATH = os.path.join(FRONTEND_DIR, "src", "pages", "HomeDashboard", "HomeDashboard.jsx")

VITE_CONFIG_CONTENT = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
"""

HOME_DASHBOARD_CONTENT = """import React, { useState, useEffect } from 'react';
import HeroWidget from '../../components/HeroWidget/HeroWidget';
import ModeCard from '../../components/ModeCard/ModeCard';
import styles from './HomeDashboard.module.css';

export default function HomeDashboard() {
  const [modesData, setModesData] = useState([]);
  const [hubData, setHubData] = useState(null);
  
  useEffect(() => {
    // Fetch Modes from Java Backend
    fetch('/api/v1/dashboard/modes')
      .then(res => res.json())
      .then(data => setModesData(data))
      .catch(err => console.error("Error fetching modes data", err));

    // Fetch Hub Data from Java Backend
    // HARDCODED NOTE: Authentication is missing. Once implemented, this will send an Auth header.
    fetch('/api/v1/dashboard/hub')
      .then(res => res.json())
      .then(data => setHubData(data))
      .catch(err => console.error("Error fetching hub data", err));
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
              <ModeCard key={mode.id} mode={mode} />
            ))}
          </div>
        </section>

        {/* Supporting Widgets Grid */}
        <aside className={styles.sidebarSection}>
          <h2 className={styles.sectionTitle}>Hub</h2>
          <div className={styles.widgetsList}>
            
            <div className={styles.widgetPlaceholder}>
              <h3>My Team</h3>
              <p>Overall: {hubData ? hubData.teamRating : '--'}</p>
            </div>
            
            <div className={styles.widgetPlaceholder}>
              <h3>Daily Objectives</h3>
              <p>{hubData ? `${hubData.objectivesCompleted} / ${hubData.objectivesTotal} Completed` : 'Loading...'}</p>
            </div>
            
            <div className={styles.widgetPlaceholder}>
              <h3>Upcoming Matches</h3>
              <p>{hubData ? hubData.upcomingMatch : 'Loading...'}</p>
            </div>
            
          </div>
        </aside>
      </div>
    </div>
  );
}
"""

def write_file(path, content):
    with open(path, 'w') as f:
        f.write(content)
    print(f"[+] Updated {path}")

if __name__ == "__main__":
    # Ensure frontend dir exists before attempting to write
    if os.path.exists(HOME_DASHBOARD_PATH):
        write_file(VITE_CONFIG_PATH, VITE_CONFIG_CONTENT)
        write_file(HOME_DASHBOARD_PATH, HOME_DASHBOARD_CONTENT)
    else:
        print(f"[-] Could not find {HOME_DASHBOARD_PATH}")
