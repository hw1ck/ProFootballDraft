// Position to Top (Y) coordinate mapping
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
