import React, { useState } from 'react';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import TopStatusBar from '../../components/TopStatusBar/TopStatusBar';
import PitchGrid from '../../components/PitchGrid/PitchGrid';
import SidebarControls from '../../components/SidebarControls/SidebarControls';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import formationsData from '../../../../data/formations.json';
import { useSquadBuilder } from '../../hooks/useSquadBuilder';
import { mockLockerRoom } from '../../data/mockLockerRoom';

export default function BoardRoom() {
  const [formationName, setFormationName] = useState('4-3-3');
  const [activePlayer, setActivePlayer] = useState(null);
  
  // Use our custom pure-logic hook for drag/drop
  const { squad, lockerRoom, handleDragEnd, clearSquad, changeFormation } = useSquadBuilder(mockLockerRoom);

  const currentFormation = formationsData.formations.find(f => f.name === formationName) || formationsData.formations[0];

  const handleFormationChange = (name) => {
    setFormationName(name);
    changeFormation(name); // Clears the squad on formation change
  };

  const onDragStart = (event) => {
    const { active } = event;
    const id = active.id;
    const player = lockerRoom.find(p => p.id === id) || squad.find(p => p?.id === id);
    setActivePlayer(player || null);
  };

  const onDragEnd = (event) => {
    setActivePlayer(null);
    handleDragEnd(event);
  };

  // Configure touch and mouse sensors for mobile-first support
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-dark-bg text-white flex flex-col font-sans relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-blue/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-pink/20 blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col h-screen">
          <TopStatusBar />
          
          <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
            {/* Main Pitch Area */}
            <div className="flex-grow flex items-center justify-center p-4 md:p-8 overflow-y-auto">
              <PitchGrid 
                formation={currentFormation} 
                squad={squad} 
              />
            </div>

            {/* Sidebar Area */}
            <div className="w-full md:w-96 shrink-0 p-4 md:p-8 md:pl-0 overflow-y-auto border-t md:border-t-0 md:border-l border-white/10 bg-black/20 backdrop-blur-md flex flex-col">
              <SidebarControls 
                selectedFormationName={formationName}
                onFormationChange={handleFormationChange}
                lockerRoom={lockerRoom}
                onClearSquad={clearSquad}
              />
            </div>
          </div>
        </div>
      </div>
      
      <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activePlayer ? (
          <div className="w-[120px] opacity-90 scale-110 drop-shadow-2xl">
            <PlayerCard player={activePlayer} isMini={true} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
