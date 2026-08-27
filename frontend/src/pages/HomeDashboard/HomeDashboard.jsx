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
          <div className={`${styles.sidebarPanel} ios-glass-panel ios-squircle`}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>MY HUB</h2>
            </div>
            <div className={styles.widgetsList}>
              {hubData ? (
                <>
                  <div className={styles.hubRow}>
                    <div className={styles.rowIcon}>📊</div>
                    <div className={styles.rowContent}>
                      <span className={styles.rowLabel}>Team Rating</span>
                      <span className={styles.rowValue}>{hubData.teamRating}</span>
                    </div>
                  </div>
                  <div className={styles.hubRow}>
                    <div className={styles.rowIcon}>🗓️</div>
                    <div className={styles.rowContent}>
                      <span className={styles.rowLabel}>Upcoming Matches</span>
                      <span className={styles.rowValue}>{hubData.upcomingMatch}</span>
                    </div>
                  </div>
                  <div className={styles.hubRow}>
                    <div className={styles.rowIcon}>🎯</div>
                    <div className={styles.rowContent}>
                      <span className={styles.rowLabel}>Active Objectives</span>
                      <span className={styles.rowValue}>{hubData.objectivesCompleted} / {hubData.objectivesTotal} Objectives</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className={`${styles.widgetPlaceholder} ios-glass-panel ios-squircle`}>
                  <h3>Sign In</h3>
                  <p>Log in to view your team stats and history.</p>
                </div>
              )}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
