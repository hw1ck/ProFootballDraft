// Mathematical Domain Rules for Football Auction Platform
// Strictly enforces the verified specifications from football_auction_implementation_roadmap.md

export const SQUAD_SIZE = 18;
export const MIN_OPENING_BID = 10;
export const ANTI_SNIPE_THRESHOLD_SECONDS = 3;
export const ANTI_SNIPE_RESET_SECONDS = 5;
export const DEFAULT_STARTING_BUDGET = 1000;
export const DEFAULT_BID_TIMER = 30;
export const QUICK_BID_INCREMENTS = [10, 25, 50, 100] as const;

export type QuickBidIncrement = (typeof QUICK_BID_INCREMENTS)[number];

/**
 * Max Bid Safety Constraint:
 * Must reserve 10 coins per remaining empty slot.
 * Formula: Max Bid = Balance - ((18 - N_current - 1) * 10)
 * If squad is already full (18/18), Max Bid is 0.
 */
export function calculateMaxBid(
  currentBalance: number,
  currentSquadCount: number,
  totalSlots: number = SQUAD_SIZE,
  minReservePerSlot: number = MIN_OPENING_BID
): number {
  if (currentSquadCount >= totalSlots) return 0;
  const remainingSlotsAfterCurrentLot = totalSlots - currentSquadCount - 1;
  const requiredReserve = Math.max(0, remainingSlotsAfterCurrentLot * minReservePerSlot);
  return Math.max(0, currentBalance - requiredReserve);
}

export interface QuickBidTarget {
  increment: QuickBidIncrement;
  targetAmount: number;
  disabled: boolean;
}

/**
 * Quick-Bid Calculation Semantics:
 * When currentLeadingBid === 0 (no bids yet), buttons submit absolute bids of 10, 25, 50, 100.
 * Once an active bid exists, buttons submit currentLeadingBid + increment (+10, +25, +50, +100).
 * Disabled if targetAmount > maxBid.
 */
export function calculateQuickBidTargets(
  currentLeadingBid: number,
  maxBid: number
): QuickBidTarget[] {
  return QUICK_BID_INCREMENTS.map((inc) => {
    const targetAmount = currentLeadingBid === 0 ? inc : currentLeadingBid + inc;
    return {
      increment: inc,
      targetAmount,
      disabled: targetAmount > maxBid || targetAmount < MIN_OPENING_BID,
    };
  });
}

/**
 * Transfer Classification:
 * Bargain: Price <= Math.floor(estimatedValue / 3)
 * Overpay: Price >= 2.0 * estimatedValue
 */
export function classifyTransfer(
  pricePaid: number,
  estimatedValue: number
): 'BARGAIN' | 'OVERPAY' | 'FAIR' {
  if (estimatedValue <= 0) return 'FAIR';
  if (pricePaid * 3 <= estimatedValue) {
    return 'BARGAIN';
  }
  if (pricePaid >= 2.0 * estimatedValue) {
    return 'OVERPAY';
  }
  return 'FAIR';
}

export function isBargain(pricePaid: number, estimatedValue: number): boolean {
  return classifyTransfer(pricePaid, estimatedValue) === 'BARGAIN';
}

export function isOverpay(pricePaid: number, estimatedValue: number): boolean {
  return classifyTransfer(pricePaid, estimatedValue) === 'OVERPAY';
}

/**
 * Checks if squad contains at least one Goalkeeper ('GK')
 */
export function hasGoalkeeper(players: Array<{ position: string }> | undefined | null): boolean {
  if (!players || players.length === 0) return false;
  return players.some((p) => p.position === 'GK');
}

/**
 * Squad Evaluation Composite:
 * 0.55 * StartingXI_OVR + 0.25 * ChemistryScore + 0.20 * TacticsFitScore
 */
export function calculateSquadScore(
  startingXiOvr: number,
  chemistryScore: number,
  tacticsScore: number
): number {
  const composite = 0.55 * startingXiOvr + 0.25 * chemistryScore + 0.20 * tacticsScore;
  return Math.round(composite * 10) / 10;
}
