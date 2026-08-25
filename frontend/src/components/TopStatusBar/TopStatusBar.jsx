import React, { useState, useEffect } from 'react';
import styles from './TopStatusBar.module.css';

export default function TopStatusBar() {
  const [userData, setUserData] = useState({
    username: 'Manager',
    level: 1,
    xp: 25,
    coins: 0,
    gems: 0,
    energy: 100
  });

  useEffect(() => {
    // TODO: Phase 2 REST Wiring
    /*
    fetch('/api/v1/users/me')
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.error("Error fetching user data", err));
    */
    
    // Using mock JSON data for now
    setUserData({
      username: 'AlexTheGreat',
      level: 14,
      xp: 75,
      coins: 14500,
      gems: 250,
      energy: 85
    });
  }, []);

  return (
    <div className={styles.statusBar}>
      <div className={styles.userSection}>
        <div className={styles.avatarPlaceholder}></div>
        <div className={styles.userInfo}>
          <span className={styles.username}>{userData.username}</span>
          <span className={styles.level}>Lvl {userData.level}</span>
        </div>
        <div className={styles.xpBarContainer}>
          <div className={styles.xpBarFill} style={{ width: `${userData.xp}%` }}></div>
        </div>
      </div>
      
      <div className={styles.resourcesSection}>
        <div className={styles.resourcePill}>
          <span className={styles.resourceIcon}>⚡</span>
          <span className={styles.resourceValue}>{userData.energy}/100</span>
          <button className={styles.addBtn}>+</button>
        </div>
        <div className={styles.resourcePill}>
          <span className={styles.resourceIcon}>🪙</span>
          <span className={styles.resourceValue}>{userData.coins.toLocaleString()}</span>
          <button className={styles.addBtn}>+</button>
        </div>
        <div className={styles.resourcePill}>
          <span className={styles.resourceIcon}>💎</span>
          <span className={styles.resourceValue}>{userData.gems.toLocaleString()}</span>
          <button className={styles.addBtn}>+</button>
        </div>
      </div>
    </div>
  );
}
