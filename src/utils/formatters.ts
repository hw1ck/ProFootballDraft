export function formatMoney(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '0 🪙';
  return `${amount.toLocaleString()} 🪙`;
}

export function formatCoins(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '0';
  return amount.toLocaleString();
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function getPositionBadgeColor(pos: string): { bg: string; text: string; border: string } {
  const upper = (pos || '').toUpperCase();
  switch (upper) {
    case 'FWD':
    case 'ST':
    case 'CF':
    case 'LW':
    case 'RW':
      return { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/40' };
    case 'MID':
    case 'CAM':
    case 'CM':
    case 'CDM':
    case 'LM':
    case 'RM':
      return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40' };
    case 'DEF':
    case 'CB':
    case 'LB':
    case 'RB':
    case 'LWB':
    case 'RWB':
      return { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/40' };
    case 'GK':
      return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/40' };
    default:
      return { bg: 'bg-slate-500/15', text: 'text-slate-300', border: 'border-slate-500/40' };
  }
}
