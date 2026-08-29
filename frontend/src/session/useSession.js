import { useState, useCallback } from 'react';

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
