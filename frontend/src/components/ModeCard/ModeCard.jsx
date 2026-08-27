import React from 'react';
import styles from './ModeCard.module.css';

export default function ModeCard({ mode }) {
  // Determine button styling based on mode type and CTA text
  const isPremium = mode.title && mode.title.toUpperCase().includes('TOTY');
  const isPlayNow = mode.cta && mode.cta.toLowerCase() === 'play now';
  
  let btnClass = styles.ctaBtn;
  if (isPremium) {
    btnClass += ` ${styles.premiumBtn}`;
  } else if (isPlayNow) {
    btnClass += ` ${styles.primaryBtn}`;
  } else {
    btnClass += ` ${styles.primaryOutlineBtn}`;
  }

  return (
    <div className={`${styles.card} ios-glass-panel ios-squircle`}>
      <div className={styles.iconPlaceholder}>
        <span className={styles.iconText}>{mode.icon}</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{mode.title}</h3>
        <p className={styles.subtitle}>{mode.subtitle}</p>
        
        {mode.status && (
          <div className={styles.statusBadge}>{mode.status}</div>
        )}
      </div>
      <button className={btnClass}>{mode.cta}</button>
    </div>
  );
}
