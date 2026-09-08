import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSession } from '../../session/useSession';
import { getGamemodeDef } from '../../session/gamemodes';
import SessionSetup from './SessionSetup';
import Lobby from './Lobby';
import MockGamemode from './MockGamemode';
import ClassicDraftEngine from './ClassicDraftEngine';
import BoardRoom from '../BoardRoom/BoardRoom';

export default function SessionManager() {
  const { modeId } = useParams();
  const modeConfig = getGamemodeDef(modeId);
  
  const {
    sessionState, config, participants, roomId, results,
    initSession, toggleReady, startReadyCheck, completeSession, startBoardroom
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
        modeId === 'classic_draft' 
          ? <ClassicDraftEngine config={config} onComplete={(res) => {
              if (res.status === 'BOARDROOM') {
                startBoardroom(res.squad);
              } else {
                completeSession(res);
              }
            }} />
          : <MockGamemode config={config} onComplete={(res) => completeSession(res)} />
      )}
      {sessionState === 'boardroom' && (
        <BoardRoom 
          initialLockerRoom={results?.draftedSquad} 
          onLockIn={(finalSquad) => {
            const starters = finalSquad.filter(p => p !== null);
            const avgOvr = Math.round(starters.reduce((acc, p) => acc + (p.overallRating || 0), 0) / starters.length) || 0;
            completeSession({ score: avgOvr, squad: starters, status: 'WIN' });
          }} 
        />
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
