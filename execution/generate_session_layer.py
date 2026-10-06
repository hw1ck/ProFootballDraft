import os

def create_directory(path):
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"Created directory: {path}")

def write_file(filepath, content):
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Generated file: {filepath}")

def main():
    print("--- Starting Session Layer Generation ---")
    
    # 1. Directories
    session_logic_dir = "frontend/src/session"
    session_ui_dir = "frontend/src/pages/Session"
    
    create_directory(session_logic_dir)
    create_directory(session_ui_dir)

    # 2. Gamemodes Registry
    gamemodes_content = """/**
 * Central registry of all gamemodes in the application.
 * The Session/Lobby architecture reads these configs dynamically to render 
 * the Setup UI and orchestrate handoffs.
 */

export const GAMEMODES = {
  mock_mode: {
    id: 'mock_mode',
    name: 'Mock Gamemode',
    description: 'A dummy gamemode used purely to validate the session and lobby handoff mechanics.',
    supportsSolo: true,
    supportsMultiplayer: true,
    multiplayerMode: 'parallel',
    playerCount: {
      fixed: false,
      min: 2,
      max: 10,
      default: 4
    },
    readyRequired: true,
    extraOptions: [
      {
        id: 'fastTimer',
        label: 'Fast Timer (15s)',
        type: 'boolean',
        defaultValue: false
      }
    ]
  }
};

export function getGamemodeDef(id) {
  return GAMEMODES[id] || null;
}
"""
    write_file(f"{session_logic_dir}/gamemodes.js", gamemodes_content)

    # 3. Session State Hook
    usesession_content = """import { useState, useCallback } from 'react';

export function useSession() {
  const [sessionState, setSessionState] = useState('setup');
  const [config, setConfig] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [results, setResults] = useState(null);

  const initSession = useCallback((modeConfig, setupOptions) => {
    setConfig({ mode: modeConfig, options: setupOptions });
    setSessionState('created');
    
    // MOCK: instantly transition to lobby and generate a code
    setTimeout(() => {
      setRoomId('PRO-DRAFT-1234');
      setParticipants([
        { id: 'u1', name: 'Host Player', isHost: true, isReady: false }
      ]);
      setSessionState('lobby');
    }, 500);
  }, []);

  const toggleReady = useCallback((userId) => {
    setParticipants(prev => prev.map(p => 
      p.id === userId ? { ...p, isReady: !p.isReady } : p
    ));
  }, []);

  const startReadyCheck = useCallback(() => {
    setSessionState('readyCheck');
    setTimeout(() => {
      setSessionState('inProgress');
    }, 3000);
  }, []);

  const completeSession = useCallback((finalResults) => {
    setResults(finalResults);
    setSessionState('completed');
  }, []);

  return {
    sessionState,
    config,
    participants,
    roomId,
    results,
    initSession,
    toggleReady,
    startReadyCheck,
    completeSession
  };
}
"""
    write_file(f"{session_logic_dir}/useSession.js", usesession_content)

    # 4. SessionSetup.module.css
    setup_css_content = """.setupContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
  animation: fadeIn 0.5s ease-out;
}

.panel {
  background-color: var(--bg-secondary);
  border: var(--border-subtle);
  border-radius: var(--radius-card);
  padding: 2.5rem;
  width: 100%;
  max-width: 600px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.formGroup {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.1rem;
}

.toggleGroup {
  display: flex;
  background-color: rgba(0,0,0,0.4);
  border-radius: 8px;
  padding: 0.3rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.toggleBtn {
  flex: 1;
  padding: 0.8rem;
  border-radius: 6px;
  font-size: 1rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.toggleBtn.active {
  background-color: rgba(140, 255, 26, 0.15);
  color: var(--accent-lime);
  box-shadow: var(--glow-lime);
  border: 1px solid rgba(140, 255, 26, 0.3);
}

.sliderContainer {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider {
  flex: 1;
  accent-color: var(--accent-lime);
}

.sliderValue {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--accent-lime);
  min-width: 40px;
  text-align: center;
}

.checkboxLabel {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 1.1rem;
  padding: 0.8rem;
  background-color: rgba(255,255,255,0.03);
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.2s ease;
}

.checkboxLabel:hover {
  background-color: rgba(255,255,255,0.08);
}

.ctaWrapper {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
}

.primaryCta {
  background: linear-gradient(135deg, var(--accent-lime) 0%, #6abf10 100%);
  color: var(--bg-primary);
  font-size: 1.5rem;
  font-weight: 800;
  padding: 1rem 4rem;
  border-radius: 30px;
  box-shadow: 0 10px 25px rgba(140, 255, 26, 0.4), inset 0 2px 0 rgba(255,255,255,0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.primaryCta:hover {
  transform: scale(1.05);
}
"""
    write_file(f"{session_ui_dir}/SessionSetup.module.css", setup_css_content)

    # 5. SessionSetup.jsx
    setup_jsx_content = """import React, { useState } from 'react';
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
"""
    write_file(f"{session_ui_dir}/SessionSetup.jsx", setup_jsx_content)

    # 6. Lobby.module.css
    lobby_css_content = """.lobbyContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
  animation: fadeIn 0.5s ease-out;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.joinLabel {
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.roomCode {
  font-family: var(--font-heading);
  font-size: 4.5rem;
  font-weight: 900;
  color: var(--text-primary);
  background: rgba(255,255,255,0.05);
  padding: 0.5rem 3rem;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  letter-spacing: 4px;
  cursor: pointer;
}

.participantsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1000px;
}

.participantCard {
  background-color: var(--bg-secondary);
  border: var(--border-subtle);
  border-radius: var(--radius-card);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.participantCard.ready {
  border-color: rgba(140, 255, 26, 0.4);
  box-shadow: 0 0 15px rgba(140, 255, 26, 0.15);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a2234 0%, #111622 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.name {
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.statusBadge {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 700;
  background-color: rgba(255,255,255,0.1);
  color: var(--text-secondary);
}

.ready .statusBadge {
  background-color: rgba(140, 255, 26, 0.15);
  color: var(--accent-lime);
}

.emptySlot {
  border: 2px dashed rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  border-radius: var(--radius-card);
  color: var(--text-secondary);
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.readyUpBtn {
  background: rgba(255,255,255,0.05);
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 900;
  padding: 1.2rem 5rem;
  border-radius: 40px;
  border: 2px solid rgba(255,255,255,0.2);
}

.readyUpBtn.isActive {
  background: linear-gradient(135deg, var(--accent-lime) 0%, #6abf10 100%);
  color: var(--bg-primary);
  border: none;
}

.countdownOverlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(10, 14, 20, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.countdownNumber {
  font-family: var(--font-heading);
  font-size: 8rem;
  color: var(--accent-lime);
}
"""
    write_file(f"{session_ui_dir}/Lobby.module.css", lobby_css_content)

    # 7. Lobby.jsx
    lobby_jsx_content = """import React from 'react';
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
"""
    write_file(f"{session_ui_dir}/Lobby.jsx", lobby_jsx_content)

    # 8. MockGamemode.jsx
    mock_jsx_content = """import React, { useState, useEffect } from 'react';

export default function MockGamemode({ config, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete({ score: 88, status: 'WIN' });
    }
  }, [timeLeft, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', color: 'white' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--accent-lime)' }}>
        IN PROGRESS: {config?.mode?.name}
      </h1>
      <div style={{ fontSize: '4rem', color: 'var(--accent-lime)', marginTop: '2rem' }}>
        {timeLeft}
      </div>
    </div>
  );
}
"""
    write_file(f"{session_ui_dir}/MockGamemode.jsx", mock_jsx_content)

    # 9. SessionManager.jsx
    manager_jsx_content = """import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSession } from '../../session/useSession';
import { getGamemodeDef } from '../../session/gamemodes';
import SessionSetup from './SessionSetup';
import Lobby from './Lobby';
import MockGamemode from './MockGamemode';

export default function SessionManager() {
  const { modeId } = useParams();
  const modeConfig = getGamemodeDef(modeId);
  
  const {
    sessionState, config, participants, roomId, results,
    initSession, toggleReady, startReadyCheck, completeSession
  } = useSession();

  useEffect(() => {
    if (sessionState === 'lobby' && participants.length > 0) {
      const allReady = participants.every(p => p.isReady);
      if (allReady) {
        startReadyCheck();
      }
    }
  }, [participants, sessionState, startReadyCheck]);

  if (!modeConfig) return <div style={{ color: 'white' }}>Error: Gamemode not found.</div>;

  return (
    <>
      {sessionState === 'setup' && (
        <SessionSetup modeConfig={modeConfig} onCompleteSetup={(opts) => initSession(modeConfig, opts)} />
      )}
      {(sessionState === 'lobby' || sessionState === 'readyCheck') && (
        <Lobby roomId={roomId} participants={participants} config={config} onReadyToggle={toggleReady} sessionState={sessionState} />
      )}
      {sessionState === 'inProgress' && (
        <MockGamemode config={config} onComplete={(res) => completeSession(res)} />
      )}
      {sessionState === 'completed' && (
        <div style={{ color: 'white', textAlign: 'center', padding: '4rem' }}>
          <h1 style={{ color: 'var(--accent-lime)' }}>SESSION COMPLETE</h1>
          <p>Final Result: {results?.score} OVR</p>
        </div>
      )}
    </>
  );
}
"""
    write_file(f"{session_ui_dir}/SessionManager.jsx", manager_jsx_content)
    
    print("--- Completed Session Layer Generation ---")

if __name__ == "__main__":
    main()
