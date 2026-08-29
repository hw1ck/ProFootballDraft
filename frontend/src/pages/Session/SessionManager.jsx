import React, { useEffect } from 'react';
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
