export const tierConfig = {
  green: {
    color: '#a3e635',
    glow: 'rgba(163, 230, 53, 0.15)',
    // Card surface gradient stops: corner-to-corner diagonal foil
    gradientFrom: 'rgba(30, 50, 10, 0.95)',
    gradientMid:  'rgba(20, 38, 8, 0.97)',
    gradientTo:   'rgba(12, 28, 4, 1)',
    // Top-edge accent band
    accentStop:   'rgba(163, 230, 53, 0.25)',
  },
  blue: {
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.15)',
    gradientFrom: 'rgba(8, 30, 52, 0.95)',
    gradientMid:  'rgba(5, 20, 40, 0.97)',
    gradientTo:   'rgba(2, 12, 28, 1)',
    accentStop:   'rgba(56, 189, 248, 0.25)',
  },
  red: {
    color: '#fb7185',
    glow: 'rgba(251, 113, 133, 0.15)',
    gradientFrom: 'rgba(50, 10, 20, 0.95)',
    gradientMid:  'rgba(38, 6, 14, 0.97)',
    gradientTo:   'rgba(22, 3, 8, 1)',
    accentStop:   'rgba(251, 113, 133, 0.25)',
  },
  gold: {
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.15)',
    gradientFrom: 'rgba(52, 36, 4, 0.95)',
    gradientMid:  'rgba(38, 25, 2, 0.97)',
    gradientTo:   'rgba(20, 12, 0, 1)',
    accentStop:   'rgba(251, 191, 36, 0.25)',
  }
};

export function getTierFromRating(rating) {
  if (rating < 70) return 'green';
  if (rating <= 79) return 'blue';
  if (rating <= 89) return 'red';
  return 'gold';
}
