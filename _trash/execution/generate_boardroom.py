import os

os.makedirs("frontend/src/pages/BoardRoom", exist_ok=True)
os.makedirs("frontend/src/components/PitchGrid", exist_ok=True)
os.makedirs("frontend/src/components/SidebarControls", exist_ok=True)
os.makedirs("frontend/src/components/PlayerSearchModal", exist_ok=True)
os.makedirs("frontend/src/utils", exist_ok=True)

# 1. positionMap.js
POSITION_MAP = """// Position to Top (Y) coordinate mapping
const Y_COORDS = {
  GK: '90%',
  CB: '78%',
  RB: '78%',
  LB: '78%',
  RWB: '70%',
  LWB: '70%',
  CDM: '62%',
  CM: '50%',
  RCM: '50%',
  LCM: '50%',
  RM: '45%',
  LM: '45%',
  CAM: '35%',
  RAM: '35%',
  LAM: '35%',
  RW: '25%',
  LW: '25%',
  ST: '15%',
};

// Computes X coordinates intelligently based on duplicates and specific roles
export function getCoordinates(position, index, allPositions) {
  const top = Y_COORDS[position] || '50%';
  
  // Find all identical positions to space them horizontally
  const identicalPositions = allPositions.filter(p => p === position);
  const myOccurrence = allPositions.slice(0, index).filter(p => p === position).length;
  
  let left = '50%';
  
  // Explicit Side mapping
  if (position.startsWith('R') && position !== 'RAM' && position !== 'RCM' && position !== 'RWB') {
     left = '80%';
  } else if (position.startsWith('L') && position !== 'LAM' && position !== 'LCM' && position !== 'LWB') {
     left = '20%';
  }
  
  if (position === 'RB' || position === 'RWB') left = '85%';
  if (position === 'LB' || position === 'LWB') left = '15%';
  if (position === 'RM' || position === 'RW') left = '85%';
  if (position === 'LM' || position === 'LW') left = '15%';
  
  if (position === 'RCM' || position === 'RAM') left = '65%';
  if (position === 'LCM' || position === 'LAM') left = '35%';

  // If there are multiple of the exact same position (e.g., 2 CBs, 2 STs)
  if (identicalPositions.length > 1) {
    if (identicalPositions.length === 2) {
      left = myOccurrence === 0 ? '65%' : '35%'; // Right then Left
    } else if (identicalPositions.length === 3) {
      if (myOccurrence === 0) left = '75%';
      if (myOccurrence === 1) left = '50%';
      if (myOccurrence === 2) left = '25%';
    }
  }

  return { top, left };
}
"""
with open("frontend/src/utils/positionMap.js", "w") as f:
    f.write(POSITION_MAP)


# 2. PitchGrid.jsx
PITCH_GRID_JSX = """import React from 'react';
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
            <div 
              key={i} 
              className="pitch-slot"
              style={{ top: coords.top, left: coords.left }}
              onClick={() => onSlotClick(i, pos)}
            >
              {player ? (
                <div className="slot-filled">
                  <PlayerCard player={player} isMini={true} />
                </div>
              ) : (
                <div className="slot-empty">
                  <div className="slot-plus">+</div>
                  <div className="slot-pos">{pos}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
"""
with open("frontend/src/components/PitchGrid/PitchGrid.jsx", "w") as f:
    f.write(PITCH_GRID_JSX)

# 3. PitchGrid.css
PITCH_GRID_CSS = """.pitch-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  aspect-ratio: 2 / 3;
  position: relative;
  padding: 1rem;
}

.pitch {
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    #2a6136,
    #2a6136 10%,
    #2e6b3b 10%,
    #2e6b3b 20%
  );
  border: 2px solid rgba(255,255,255,0.7);
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

/* Pitch Markings */
.pitch-halfway-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255,255,255,0.6);
  transform: translateY(-50%);
}

.pitch-center-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 25%;
  aspect-ratio: 1;
  border: 2px solid rgba(255,255,255,0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.pitch-center-spot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: rgba(255,255,255,0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.pitch-penalty-box {
  position: absolute;
  left: 20%;
  width: 60%;
  height: 15%;
  border: 2px solid rgba(255,255,255,0.6);
}

.pitch-penalty-box.top-box {
  top: 0;
  border-top: none;
}

.pitch-penalty-box.bottom-box {
  bottom: 0;
  border-bottom: none;
}

.pitch-goal-box {
  position: absolute;
  left: 35%;
  width: 30%;
  height: 5%;
  border: 2px solid rgba(255,255,255,0.6);
}

.pitch-goal-box.top-goal {
  top: 0;
  border-top: none;
}

.pitch-goal-box.bottom-goal {
  bottom: 0;
  border-bottom: none;
}

/* Slots */
.pitch-slot {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 12%; /* Scales with pitch width */
  min-width: 50px;
  aspect-ratio: 2/3;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slot-empty {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border: 1px dashed rgba(255,255,255,0.4);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.slot-empty:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255,255,255,0.8);
  box-shadow: 0 0 15px rgba(255,255,255,0.3);
  transform: scale(1.05);
}

.slot-plus {
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1;
}

.slot-pos {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.slot-filled {
  width: 100%;
  height: 100%;
  /* The player card will render inside here */
}
"""
with open("frontend/src/components/PitchGrid/PitchGrid.css", "w") as f:
    f.write(PITCH_GRID_CSS)

# 4. SidebarControls
SIDEBAR_JSX = """import React from 'react';
import formationsData from '../../../../data/formations.json';

export default function SidebarControls({ selectedFormationName, onFormationChange }) {
  return (
    <div className="glass-panel p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2 tracking-wide font-display">TACTICS BOARD</h2>
        <div className="h-[2px] w-12 bg-neon-blue rounded-full mb-4"></div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/60 font-semibold uppercase tracking-wider">Formation</label>
        <select 
          className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
          value={selectedFormationName}
          onChange={(e) => onFormationChange(e.target.value)}
        >
          {formationsData.formations.map(f => (
            <option key={f.name} value={f.name} className="bg-dark-bg">{f.name}</option>
          ))}
        </select>
      </div>

      {/* Placeholder for Tactics */}
      <div className="flex flex-col gap-2 opacity-50 mt-4">
        <label className="text-sm text-white/60 font-semibold uppercase tracking-wider">Tactics (Coming Soon)</label>
        <div className="bg-black/20 border border-white/5 rounded-lg p-4 text-center text-xs text-white/40">
          Select individual player roles and team mentality here.
        </div>
      </div>
    </div>
  );
}
"""
with open("frontend/src/components/SidebarControls/SidebarControls.jsx", "w") as f:
    f.write(SIDEBAR_JSX)

# 5. BoardRoom Page
BOARDROOM_JSX = """import React, { useState } from 'react';
import TopStatusBar from '../../components/TopStatusBar/TopStatusBar';
import PitchGrid from '../../components/PitchGrid/PitchGrid';
import SidebarControls from '../../components/SidebarControls/SidebarControls';
import formationsData from '../../../../data/formations.json';

export default function BoardRoom() {
  const [formationName, setFormationName] = useState('4-3-3');
  const [squad, setSquad] = useState(Array(11).fill(null));

  const currentFormation = formationsData.formations.find(f => f.name === formationName) || formationsData.formations[0];

  const handleFormationChange = (name) => {
    setFormationName(name);
    // Reset squad when formation changes to prevent mismatched positions for now
    setSquad(Array(11).fill(null));
  };

  const handleSlotClick = (index, position) => {
    alert(`Trigger PlayerSearchModal for position: ${position}`);
    // Dummy populate for testing
    const newSquad = [...squad];
    newSquad[index] = {
      name: "DUMMY",
      position: position,
      overallRating: 88,
      photoUrl: "",
      nation: { flagUrl: "", name: "Nation" },
      club: { crestUrl: "", name: "Club" },
      league: { crestUrl: "", name: "League" },
      stats: { pac:90, sho:80, pas:80, dri:90, def:40, phy:60 }
    };
    setSquad(newSquad);
  };

  return (
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
              onSlotClick={handleSlotClick} 
            />
          </div>

          {/* Sidebar Area */}
          <div className="w-full md:w-96 shrink-0 p-4 md:p-8 md:pl-0 overflow-y-auto border-t md:border-t-0 md:border-l border-white/10 bg-black/20 backdrop-blur-md">
            <SidebarControls 
              selectedFormationName={formationName}
              onFormationChange={handleFormationChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
"""
with open("frontend/src/pages/BoardRoom/BoardRoom.jsx", "w") as f:
    f.write(BOARDROOM_JSX)

print("Generated Phase 4.2 Boardroom components")
