import React from 'react';
import { useClassicDraft } from './useClassicDraft';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import styles from './ClassicDraftEngine.module.css';

export default function ClassicDraftEngine({ config, onComplete }) {
  const { squad, currentPack, round, isDrafting, loading, pickCard } = useClassicDraft(onComplete);

  if (!isDrafting) {
    return (
      <div className={styles.engineContainer}>
        <h1 className={styles.title}>DRAFT COMPLETE</h1>
        <p className={styles.subtitle}>Calculating Results...</p>
      </div>
    );
  }

  return (
    <div className={styles.engineContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Round {round} / 16</h1>
        <p className={styles.subtitle}>Select 1 player to add to your squad</p>
      </div>
      
      <div className={styles.packGrid} style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
        {currentPack.map(player => (
          <div key={player.id} className={styles.cardWrapper} onClick={() => pickCard(player)}>
            <PlayerCard player={player} />
          </div>
        ))}
      </div>

      <div className={styles.squadPanel}>
        <div className={styles.squadTitle}>Your Squad ({squad.length}/16)</div>
        <div className={styles.squadList}>
          {squad.map((p, i) => (
            <div key={i} className={styles.squadMiniCard}>
              <strong>{p.overallRating}</strong> {p.position} {p.firstName} {p.lastName}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
