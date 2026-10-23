// Mathematical Domain Rules for Football Auction Platform (Server CommonJS)
// Strictly enforces the verified specifications from football_auction_implementation_roadmap.md

const SQUAD_SIZE = 18;
const MIN_OPENING_BID = 10;
const ANTI_SNIPE_THRESHOLD_SECONDS = 3;
const ANTI_SNIPE_RESET_SECONDS = 5;
const DEFAULT_STARTING_BUDGET = 1000;
const DEFAULT_BID_TIMER = 30;
const QUICK_BID_INCREMENTS = [10, 25, 50, 100];

function calculateMaxBid(
  currentBalance,
  currentSquadCount,
  totalSlots = SQUAD_SIZE,
  minReservePerSlot = MIN_OPENING_BID
) {
  if (currentSquadCount >= totalSlots) return 0;
  const remainingSlotsAfterCurrentLot = totalSlots - currentSquadCount - 1;
  const requiredReserve = Math.max(0, remainingSlotsAfterCurrentLot * minReservePerSlot);
  return Math.max(0, currentBalance - requiredReserve);
}

function calculateQuickBidTargets(currentLeadingBid, maxBid) {
  return QUICK_BID_INCREMENTS.map((inc) => {
    const targetAmount = currentLeadingBid === 0 ? inc : currentLeadingBid + inc;
    return {
      increment: inc,
      targetAmount,
      disabled: targetAmount > maxBid || targetAmount < MIN_OPENING_BID,
    };
  });
}

function classifyTransfer(pricePaid, estimatedValue) {
  if (estimatedValue <= 0) return 'FAIR';
  if (pricePaid * 3 <= estimatedValue) {
    return 'BARGAIN';
  }
  if (pricePaid >= 2.0 * estimatedValue) {
    return 'OVERPAY';
  }
  return 'FAIR';
}

function isBargain(pricePaid, estimatedValue) {
  return classifyTransfer(pricePaid, estimatedValue) === 'BARGAIN';
}

function isOverpay(pricePaid, estimatedValue) {
  return classifyTransfer(pricePaid, estimatedValue) === 'OVERPAY';
}

function hasGoalkeeper(players) {
  if (!players || players.length === 0) return false;
  return players.some((p) => p.position === 'GK');
}

module.exports = {
  SQUAD_SIZE,
  MIN_OPENING_BID,
  ANTI_SNIPE_THRESHOLD_SECONDS,
  ANTI_SNIPE_RESET_SECONDS,
  DEFAULT_STARTING_BUDGET,
  DEFAULT_BID_TIMER,
  QUICK_BID_INCREMENTS,
  calculateMaxBid,
  calculateQuickBidTargets,
  classifyTransfer,
  isBargain,
  isOverpay,
  hasGoalkeeper,
};
