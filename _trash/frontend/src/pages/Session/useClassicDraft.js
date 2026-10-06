import { useState, useEffect } from 'react';

export function useClassicDraft(onComplete) {
  const [squad, setSquad] = useState([]);
  const [currentPack, setCurrentPack] = useState([]);
  const [round, setRound] = useState(1);
  const [isDrafting, setIsDrafting] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      const savedSessionId = localStorage.getItem('draftSessionId');
      
      if (savedSessionId) {
        try {
          const res = await fetch(`/api/v1/draft/${savedSessionId}`);
          if (res.ok) {
            const data = await res.json();
            
            if (data.status === 'BOARDROOM') {
              localStorage.removeItem('draftSessionId');
              setIsDrafting(false);
              onComplete({ squad: data.squad, status: 'BOARDROOM' });
              return;
            }
            
            setSessionId(data.sessionId);
            setRound(data.round);
            setSquad(data.squad);
            setCurrentPack(data.currentPack);
            setLoading(false);
            return;
          } else {
            localStorage.removeItem('draftSessionId');
          }
        } catch (err) {
          console.error("Failed to resume draft", err);
          localStorage.removeItem('draftSessionId');
        }
      }

      // Start new draft if resume failed or no saved session
      try {
        const res = await fetch('/api/v1/draft/start', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        setSessionId(data.sessionId);
        localStorage.setItem('draftSessionId', data.sessionId);
        setRound(data.round);
        setSquad(data.squad);
        setCurrentPack(data.currentPack);
      } catch (err) {
        console.error("Failed to start draft", err);
      } finally {
        setLoading(false);
      }
    };
    
    initializeSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pickCard = async (player) => {
    if (loading || !sessionId) return;
    setLoading(true);
    
    try {
      const res = await fetch(`/api/v1/draft/${sessionId}/pick/${player.id}`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      
      setSquad(data.squad);
      setRound(data.round);
      
      if (data.status === 'BOARDROOM') {
        localStorage.removeItem('draftSessionId');
        setIsDrafting(false);
        onComplete({ squad: data.squad, status: 'BOARDROOM' });
      } else {
        setCurrentPack(data.currentPack);
      }
    } catch (err) {
      console.error("Failed to pick card", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    squad,
    currentPack,
    round,
    isDrafting,
    loading,
    pickCard
  };
}
