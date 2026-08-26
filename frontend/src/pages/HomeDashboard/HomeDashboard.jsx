import React, { useState, useEffect } from 'react';
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
                mode={mode}
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
                 <h3>Team Rating: {hubData.teamRating}</h3>
                 <p>Upcoming: {hubData.upcomingMatch}</p>
                 <p>Objectives: {hubData.objectivesCompleted} / {hubData.objectivesTotal}</p>
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
