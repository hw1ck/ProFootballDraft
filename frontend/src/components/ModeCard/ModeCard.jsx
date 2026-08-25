import React from 'react';
import styles from './ModeCard.module.css';

export default function ModeCard({ mode }) {
  return (
    <div className={styles.card}>
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
      <button className={styles.ctaBtn}>{mode.cta}</button>
    </div>
  );
}
