import React, { useEffect, useState } from 'react';
import styles from './HeroWidget.module.css';

export default function HeroWidget() {
  const [heroData, setHeroData] = useState({
    headline: 'CREATE YOUR FOOTBALL LEGACY',
    rank: 'Global Rank: 4,521',
    rating: 'Team OVR: 86',
    status: 'Season 1 Active'
  });

  useEffect(() => {
    // TODO: Phase 2 REST Wiring
    /*
    fetch('/api/v1/dashboard/hero')
      .then(res => res.json())
      .then(data => setHeroData(data))
      .catch(err => console.error("Error fetching hero data", err));
    */
  }, []);

  const handlePlayMatch = () => {
    console.log("PLAY MATCH clicked! Navigation pending Phase 2.");
    alert("Draft Room coming soon!");
  };

  const handleCreateRoom = () => {
    console.log("CREATE ROOM clicked!");
  };

  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        
        {/* Placeholder for the player composite image */}
        <div className={styles.playerCompositePlaceholder}>
          <span className={styles.placeholderText}>[ Player Graphic Placeholder ]</span>
        </div>
        
        <div className={styles.heroOverlay}>
          <div className={styles.statsPanel}>
            <span className={styles.statItem}>{heroData.status}</span>
            <span className={styles.statItem}>{heroData.rating}</span>
            <span className={styles.statItem}>{heroData.rank}</span>
          </div>
          <h1 className={styles.headline}>{heroData.headline}</h1>
          <div className={styles.secondaryActions}>
            <button className={styles.secondaryBtn} onClick={handleCreateRoom}>
              Create Room
            </button>
          </div>
        </div>
      </div>

      {/* Overlapping Primary CTA */}
      <button className={styles.primaryCta} onClick={handlePlayMatch}>
        PLAY MATCH
      </button>
    </div>
  );
}
