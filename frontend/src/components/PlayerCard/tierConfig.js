export const tierConfig = {
  green: {
    color: '#a3e635', // Website lime
    glow: 'rgba(163, 230, 53, 0.15)'
  },
  blue: {
    color: '#38bdf8', // Sleek cyan
    glow: 'rgba(56, 189, 248, 0.15)'
  },
  red: {
    color: '#fb7185', // Soft rose
    glow: 'rgba(251, 113, 133, 0.15)'
  },
  gold: {
    color: '#fbbf24', // Warm amber
    glow: 'rgba(251, 191, 36, 0.15)'
  }
};

export function getTierFromRating(rating) {
  if (rating < 70) return 'green';
  if (rating <= 79) return 'blue';
  if (rating <= 89) return 'red';
  return 'gold';
}
