import React, { useEffect, useState } from 'react';
import styles from './HeroWidget.module.css';

// Use Vite's import.meta.glob to dynamically import all images from the assets/hero folder.
// As you drop new images into this folder, they will automatically be added to the rotation!
const imageModules = import.meta.glob('../../assets/hero/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' });
const BACKGROUND_IMAGES = Object.values(imageModules);

export default function HeroWidget() {
  const [heroData, setHeroData] = useState({
    headline: 'CREATE YOUR FOOTBALL LEGACY',
    rank: 'Global Rank: 4,521',
    rating: 'Team OVR: 86',
    status: 'Season 1 Active'
  });

  const [currentBgImage, setCurrentBgImage] = useState("");

  useEffect(() => {
    if (BACKGROUND_IMAGES.length > 0) {
      // Pick a random image on mount/refresh
      const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
      setCurrentBgImage(BACKGROUND_IMAGES[randomIndex]);
    }


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
      <div className={`${styles.heroContent} ios-squircle ios-glass-panel`}>
        
        {/* Dynamic Background Image */}
        <div 
          className={styles.playerCompositePlaceholder}
          style={{ backgroundImage: `url(${currentBgImage})` }}
        >
        </div>
        
        <div className={styles.heroOverlay}>
          <div className={`${styles.statsPanel} ios-glass-panel`}>
            <span className={styles.statItem}>{heroData.status}</span>
            <div className={styles.statDivider}></div>
            <span className={styles.statItem}>{heroData.rating}</span>
            <div className={styles.statDivider}></div>
            <span className={styles.statItem}>{heroData.rank}</span>
          </div>
          <h1 className={styles.headline}>{heroData.headline}</h1>
        </div>
      </div>

      {/* Grouped Primary Actions */}
      <div className={styles.actionGroup}>
        <button className={`${styles.secondaryBtn} ios-glass-panel`} onClick={handleCreateRoom}>
          Create Room
        </button>
        <button className={styles.primaryCta} onClick={handlePlayMatch}>
          PLAY MATCH
        </button>
      </div>
    </div>
  );
}
