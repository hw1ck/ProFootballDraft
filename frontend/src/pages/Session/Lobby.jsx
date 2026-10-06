import React from 'react';
import styles from './Lobby.module.css';

export default function Lobby({ roomId, participants, config, onReadyToggle, sessionState }) {
  const currentUserId = 'u1'; 
  const currentUser = participants.find(p => p.id === currentUserId);
  const maxPlayers = config?.options?.playerCount || 4;

  return (
    <>
      <div className={styles.lobbyContainer}>
        <div className={styles.header}>
          <div className={styles.joinLabel}>Join Code</div>
          <div className={styles.roomCode} onClick={() => navigator.clipboard.writeText(roomId)}>
            {roomId}
          </div>
        </div>

        <div className={styles.participantsGrid}>
          {participants.map(p => (
            <div key={p.id} className={`${styles.participantCard} ${p.isReady ? styles.ready : ''}`}>
              <div className={styles.avatar}>👤</div>
              <div className={styles.name}>{p.name} {p.id === currentUserId ? '(You)' : ''}</div>
              <div className={styles.statusBadge}>
                {p.isReady ? 'READY' : 'WAITING'}
              </div>
            </div>
          ))}

          {Array.from({ length: Math.max(0, maxPlayers - participants.length) }).map((_, i) => (
            <div key={`empty-${i}`} className={styles.emptySlot}>
              WAITING FOR PLAYER...
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button 
            className={`${styles.readyUpBtn} ${currentUser?.isReady ? styles.isActive : ''}`}
            onClick={() => onReadyToggle(currentUserId)}
          >
            {currentUser?.isReady ? 'READY!' : 'READY UP'}
          </button>
        </div>
      </div>

      {sessionState === 'readyCheck' && (
        <div className={styles.countdownOverlay}>
          <div className={styles.countdownNumber}>STARTING</div>
        </div>
      )}
    </>
  );
}
