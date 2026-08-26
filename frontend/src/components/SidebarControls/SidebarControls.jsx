import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import formationsData from '../../../../data/formations.json';
import PlayerCard from '../PlayerCard/PlayerCard';

export default function SidebarControls({ selectedFormationName, onFormationChange, lockerRoom, onClearSquad }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'locker-room',
  });

  return (
    <div className="glass-panel p-6 flex flex-col gap-6 h-full border border-white/10 rounded-2xl bg-black/30 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1 tracking-wide font-display">TACTICS BOARD</h2>
          <div className="h-[2px] w-12 bg-neon-blue rounded-full mb-1 shadow-[0_0_10px_#00f0ff]"></div>
        </div>
        <button 
          onClick={onClearSquad}
          className="text-xs font-bold text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-full transition-colors uppercase tracking-wider"
        >
          Clear Squad
        </button>
      </div>

      <div className="flex flex-col gap-3 shrink-0">
        <label className="text-sm text-white/60 font-semibold uppercase tracking-wider">Select Formation</label>
        
        <div className="relative">
          <select 
            className="w-full appearance-none bg-black/50 border border-white/10 hover:border-white/30 rounded-xl p-4 text-white font-bold tracking-wide focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all cursor-pointer shadow-inner"
            value={selectedFormationName}
            onChange={(e) => onFormationChange(e.target.value)}
          >
            {formationsData.formations.slice(0, 12).map(f => (
              <option key={f.name} value={f.name} className="bg-gray-900 text-white py-2 font-sans font-bold">
                {f.name}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neon-blue">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-grow overflow-hidden pt-4 border-t border-white/10">
        <div className="flex justify-between items-end">
          <label className="text-sm text-white/60 font-semibold uppercase tracking-wider">Locker Room</label>
          <span className="text-xs font-bold text-neon-blue">{lockerRoom?.length || 0} Players</span>
        </div>
        
        <div 
          ref={setNodeRef} 
          className={`flex-grow bg-black/40 border-2 rounded-xl p-4 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-3 transition-colors duration-200 ${
            isOver ? 'border-neon-blue shadow-[inset_0_0_20px_rgba(0,240,255,0.2)]' : 'border-white/5'
          }`}
        >
          {lockerRoom?.map(player => (
            <DraggableLockerPlayer key={player.id} player={player} />
          ))}
          {(!lockerRoom || lockerRoom.length === 0) && (
            <div className="col-span-full flex items-center justify-center text-white/30 text-sm font-semibold h-24">
              Locker Room is empty.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DraggableLockerPlayer({ player }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: player.id,
    data: { type: 'LOCKER' }
  });

  return (
    <div 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes} 
      className={`cursor-grab active:cursor-grabbing hover:scale-105 transition-all ${isDragging ? 'opacity-30 scale-90' : 'opacity-100'}`}
    >
      <PlayerCard player={player} isMini={true} showStats={true} />
    </div>
  );
}
