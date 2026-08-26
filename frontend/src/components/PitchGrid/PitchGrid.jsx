import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { getCoordinates } from '../../utils/positionMap';
import PlayerCard from '../PlayerCard/PlayerCard';
import './PitchGrid.css';

export default function PitchGrid({ formation, squad, onSlotClick }) {
  if (!formation) return null;

  return (
    <div className="pitch-container">
      <div className="pitch">
        {/* CSS Pitch Markings */}
        <div className="pitch-halfway-line"></div>
        <div className="pitch-center-circle"></div>
        <div className="pitch-center-spot"></div>
        <div className="pitch-penalty-box top-box"></div>
        <div className="pitch-penalty-box bottom-box"></div>
        <div className="pitch-goal-box top-goal"></div>
        <div className="pitch-goal-box bottom-goal"></div>

        {/* Render Slots */}
        {formation.positions.map((pos, i) => {
          const coords = getCoordinates(pos, i, formation.positions);
          const player = squad[i];

          return (
            <DroppableSlot key={i} index={i} pos={pos} coords={coords}>
              {player ? (
                <DraggablePlayer player={player} />
              ) : (
                <div className="slot-empty">
                  <div className="slot-plus">+</div>
                  <div className="slot-pos">{pos}</div>
                </div>
              )}
            </DroppableSlot>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------
// Subcomponents for DnD
// ----------------------

function DroppableSlot({ index, pos, coords, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `pitch-slot-${index}`,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`pitch-slot ${isOver ? 'scale-110' : ''}`}
      style={{ 
        top: coords.top, 
        left: coords.left,
        transition: 'transform 0.2s',
        filter: isOver ? 'drop-shadow(0 0 10px rgba(0,255,0,0.5))' : 'none'
      }}
    >
      {children}
    </div>
  );
}

function DraggablePlayer({ player }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: player.id,
    data: { type: 'PITCH' }
  });

  return (
    <div 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes} 
      className={`slot-filled w-full h-full transition-opacity ${isDragging ? 'opacity-30' : 'opacity-100'}`}
      style={{ zIndex: isDragging ? 0 : 10 }}
    >
      <PlayerCard player={player} isMini={true} />
    </div>
  );
}
