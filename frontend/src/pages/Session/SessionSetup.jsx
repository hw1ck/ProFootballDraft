import React, { useState } from 'react';
import styles from './SessionSetup.module.css';

export default function SessionSetup({ modeConfig, onCompleteSetup }) {
  const [isMultiplayer, setIsMultiplayer] = useState(modeConfig.supportsMultiplayer);
  const [playerCount, setPlayerCount] = useState(modeConfig.playerCount.default || 4);
  
  const [extraOptions, setExtraOptions] = useState(() => {
    const opts = {};
    if (modeConfig.extraOptions) {
      modeConfig.extraOptions.forEach(opt => {
        opts[opt.id] = opt.defaultValue;
      });
    }
    return opts;
  });

  const handleExtraOptionChange = (id, value) => {
    setExtraOptions(prev => ({ ...prev, [id]: value }));
  };

  const handleStart = () => {
    const finalConfig = {
      isMultiplayer,
      playerCount: isMultiplayer ? playerCount : 1,
      ...extraOptions
    };
    onCompleteSetup(finalConfig);
  };

  return (
    <div className={styles.setupContainer}>
      <div className={styles.panel}>
        <h1 className={styles.title}>{modeConfig.name}</h1>
        <p className={styles.subtitle}>{modeConfig.description}</p>

        {modeConfig.supportsSolo && modeConfig.supportsMultiplayer && (
          <div className={styles.formGroup}>
            <span className={styles.label}>Mode</span>
            <div className={styles.toggleGroup}>
              <button 
                className={`${styles.toggleBtn} ${!isMultiplayer ? styles.active : ''}`}
                onClick={() => setIsMultiplayer(false)}
              >
                Solo Play
              </button>
              <button 
                className={`${styles.toggleBtn} ${isMultiplayer ? styles.active : ''}`}
                onClick={() => setIsMultiplayer(true)}
              >
                Multiplayer
              </button>
            </div>
          </div>
        )}

        {isMultiplayer && !modeConfig.playerCount.fixed && (
          <div className={styles.formGroup}>
            <span className={styles.label}>Max Players</span>
            <div className={styles.sliderContainer}>
              <input 
                type="range" 
                className={styles.slider}
                min={modeConfig.playerCount.min} 
                max={Math.min(modeConfig.playerCount.max, 10)} 
                value={playerCount}
                onChange={(e) => setPlayerCount(parseInt(e.target.value))}
              />
              <span className={styles.sliderValue}>{playerCount}</span>
            </div>
          </div>
        )}

        {modeConfig.extraOptions && modeConfig.extraOptions.map(opt => (
          <div key={opt.id} className={styles.formGroup}>
            {opt.type === 'boolean' && (
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox"
                  checked={extraOptions[opt.id]}
                  onChange={(e) => handleExtraOptionChange(opt.id, e.target.checked)}
                />
                {opt.label}
              </label>
            )}
          </div>
        ))}

        <div className={styles.ctaWrapper}>
          <button className={styles.primaryCta} onClick={handleStart}>
            {isMultiplayer ? 'CREATE ROOM' : 'START SOLO'}
          </button>
        </div>
      </div>
    </div>
  );
}
