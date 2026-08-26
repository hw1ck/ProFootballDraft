import { useState, useCallback } from 'react';

export function useSquadBuilder(initialLockerRoom = []) {
  const [squad, setSquad] = useState(Array(11).fill(null));
  const [lockerRoom, setLockerRoom] = useState(initialLockerRoom);

  const clearSquad = useCallback(() => {
    const benchedPlayers = squad.filter(Boolean);
    if (benchedPlayers.length > 0) {
      setLockerRoom(prev => [...prev, ...benchedPlayers]);
      setSquad(Array(11).fill(null));
    }
  }, [squad]);

  const changeFormation = useCallback(() => {
    clearSquad();
  }, [clearSquad]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    // Scenario 6: Invalid Drop (Void)
    if (!over) return;

    const activeId = active.id;
    const overId = over.id; // e.g., 'pitch-slot-3' or 'locker-room'

    setSquad((prevSquad) => {
      setLockerRoom((prevLocker) => {
        // Find where the dragged player came from
        const lockerIndex = prevLocker.findIndex(p => p.id === activeId);
        const pitchIndex = prevSquad.findIndex(p => p?.id === activeId);
        
        let draggedPlayer = null;
        let isFromLocker = false;
        let isFromPitch = false;

        if (lockerIndex !== -1) {
          draggedPlayer = prevLocker[lockerIndex];
          isFromLocker = true;
        } else if (pitchIndex !== -1) {
          draggedPlayer = prevSquad[pitchIndex];
          isFromPitch = true;
        }

        if (!draggedPlayer) return prevLocker; // Should never happen

        // Case A: Dropped onto the Locker Room
        if (overId === 'locker-room') {
          if (isFromPitch) {
            // Scenario 5: Pitch Slot -> Locker Room (Bench Player)
            const newSquad = [...prevSquad];
            newSquad[pitchIndex] = null;
            setSquad(newSquad);
            return [...prevLocker, draggedPlayer];
          }
          // Locker -> Locker does nothing
          return prevLocker;
        }

        // Case B: Dropped onto a Pitch Slot
        if (String(overId).startsWith('pitch-slot-')) {
          const targetSlotIndex = parseInt(String(overId).replace('pitch-slot-', ''), 10);
          const occupyingPlayer = prevSquad[targetSlotIndex];

          const newSquad = [...prevSquad];
          let newLocker = [...prevLocker];

          if (isFromLocker) {
            // Remove from locker
            newLocker.splice(lockerIndex, 1);
            
            if (occupyingPlayer) {
              // Scenario 2: Locker -> Occupied Pitch Slot (Swap)
              newLocker.push(occupyingPlayer);
            }
            // Scenario 1 & 2: Place new player in slot
            newSquad[targetSlotIndex] = draggedPlayer;
          } 
          else if (isFromPitch) {
            // Scenario 3 & 4: Pitch -> Pitch
            if (occupyingPlayer) {
              // Scenario 4: Swap players on pitch
              newSquad[pitchIndex] = occupyingPlayer;
              newSquad[targetSlotIndex] = draggedPlayer;
            } else {
              // Scenario 3: Move player to empty slot
              newSquad[pitchIndex] = null;
              newSquad[targetSlotIndex] = draggedPlayer;
            }
          }

          setSquad(newSquad);
          return newLocker;
        }

        return prevLocker;
      });
    });
  }, []);

  return {
    squad,
    lockerRoom,
    handleDragEnd,
    clearSquad,
    changeFormation
  };
}
