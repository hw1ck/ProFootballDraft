const express = require('express');
const router = express.Router();

const ACHIEVEMENTS_DEF = [
  { code: 'FIRST_WHISTLE', tier: 'BRONZE', title: 'First Whistle', desc: 'Finish your first game in any mode.', icon: 'whistle' },
  { code: 'BARGAIN_HUNTER', tier: 'BRONZE', title: 'Bargain Hunter', desc: 'Sign a player for a third of their estimated value (or less).', icon: 'tag' },
  { code: 'CHAMPION', tier: 'BRONZE', title: 'Champion', desc: 'Win an auction room with the highest squad valuation.', icon: 'trophy' },
  { code: 'ON_THE_PODIUM', tier: 'BRONZE', title: 'On the Podium', desc: 'Finish top 3 in a room of 4 or more managers.', icon: 'medal' },
  { code: 'BIG_SPENDER', tier: 'BRONZE', title: 'Big Spender', desc: 'Spend 40% of your total budget on a single superstar.', icon: 'coins' },
  { code: 'UNDERDOG', tier: 'SILVER', title: 'Underdog', desc: 'Win with the lowest-rated squad overall in the room.', icon: 'shield-alert' },
  { code: 'SHREWD_OPERATOR', tier: 'SILVER', title: 'Shrewd Operator', desc: 'Win an auction while spending half your starting budget or less.', icon: 'wallet' },
  { code: 'PERFECT_FIT', tier: 'SILVER', title: 'Perfect Fit', desc: 'Field every starter in their natural or secondary position.', icon: 'puzzle' },
  { code: 'CHEMISTRY_LAB', tier: 'SILVER', title: 'Chemistry Lab', desc: 'Reach 80+ squad chemistry across all 18 positions.', icon: 'flask-conical' },
  { code: 'MASTER_TACTICIAN', tier: 'SILVER', title: 'Master Tactician', desc: 'Achieve a tactics fit score of 97 or higher.', icon: 'target' },
  { code: 'HAT_TRICK', tier: 'SILVER', title: 'Hat Trick', desc: 'Win 3 competitive auction matches.', icon: 'flame' },
  { code: 'VETERAN', tier: 'SILVER', title: 'Veteran', desc: 'Complete 10 live auction tournaments.', icon: 'award' },
  { code: 'FULL_HOUSE', tier: 'GOLD', title: 'Full House', desc: 'Outsmart the competition to win a 6-manager room.', icon: 'crown' },
  { code: 'GIANT_KILLER', tier: 'GOLD', title: 'Giant Killer', desc: 'Defeat a manager rated 100+ ELO above you in Ranked mode.', icon: 'sword' },
  { code: 'GALACTICOS', tier: 'GOLD', title: 'Galácticos', desc: 'Assemble a starting XI averaging 86+ overall rating.', icon: 'sparkles' },
  { code: 'ELITE_MANAGER', tier: 'GOLD', title: 'Elite Manager', desc: 'Climb the global ranks to reach 1,400+ Ranked ELO.', icon: 'zap' }
];

// In-memory stats storage with rich defaults
const managerProfiles = new Map();

function getOrCreateProfile(username = 'Pep Guardiola') {
  const key = username.toLowerCase();
  if (!managerProfiles.has(key)) {
    managerProfiles.set(key, {
      username: username,
      elo: 1248,
      globalRank: 3,
      memberSince: 'October 2026',
      favoriteLeague: 'Premier League',
      preferredFormation: '4-3-3',
      stats: {
        ranked: {
          games: 8,
          wins: 5,
          podiums: 7,
          winRate: 62.5,
          avgScore: 86.4,
          bestScore: 92.1
        },
        casual: {
          games: 4,
          wins: 3,
          podiums: 4,
          winRate: 75.0,
          avgScore: 84.8,
          bestScore: 89.6
        }
      },
      last3Games: [
        { matchId: 'm1', squadScore: 81.0, isWin: false, competition: 'Bundesliga auction', playedAt: '2 days ago' },
        { matchId: 'm2', squadScore: 85.4, isWin: true, competition: 'La Liga auction', playedAt: 'Yesterday' },
        { matchId: 'm3', squadScore: 89.2, isWin: true, competition: 'Premier League auction', playedAt: 'Today' }
      ],
      transferHabits: {
        avgSpend: 48,
        bargains: 7,
        overpays: 2,
        bestBargain: 'Florian Wirtz — 35 for ~370',
        recordSigning: 'Pedri — 390',
        formations: [
          { name: '4-3-3', count: 7, percentage: 58 },
          { name: '4-1-2-1-2', count: 3, percentage: 25 },
          { name: '4-4-2', count: 2, percentage: 17 }
        ]
      },
      unlockedAchievements: [
        { code: 'FIRST_WHISTLE', unlockedAt: '10/12/2026' },
        { code: 'BARGAIN_HUNTER', unlockedAt: '10/14/2026' },
        { code: 'CHAMPION', unlockedAt: '10/14/2026' },
        { code: 'ON_THE_PODIUM', unlockedAt: '10/16/2026' },
        { code: 'CHEMISTRY_LAB', unlockedAt: '10/18/2026' },
        { code: 'HAT_TRICK', unlockedAt: '10/22/2026' }
      ],
      recentMatches: [
        {
          id: 'rm-1',
          competition: 'Premier League auction',
          placement: 1,
          date: 'Oct 26, 2026',
          participants: 4,
          squadScore: 89.2,
          startingXiOvr: 87,
          chemistry: 88,
          tactics: 95,
          totalSpent: 920,
          bargains: 3
        },
        {
          id: 'rm-2',
          competition: 'La Liga auction',
          placement: 1,
          date: 'Oct 25, 2026',
          participants: 4,
          squadScore: 85.4,
          startingXiOvr: 85,
          chemistry: 82,
          tactics: 91,
          totalSpent: 970,
          bargains: 2
        },
        {
          id: 'rm-3',
          competition: 'Bundesliga auction',
          placement: 2,
          date: 'Oct 24, 2026',
          participants: 4,
          squadScore: 81.0,
          startingXiOvr: 82,
          chemistry: 78,
          tactics: 88,
          totalSpent: 1000,
          bargains: 1
        }
      ]
    });
  }
  return managerProfiles.get(key);
}

// @desc Get manager profile and stats
// @route GET /api/profile/:username
router.get('/:username', (req, res) => {
  try {
    const username = req.params.username || 'Pep Guardiola';
    const profile = getOrCreateProfile(username);

    // Merge achievement status with full achievement matrix
    const unlockedMap = new Map(profile.unlockedAchievements.map(a => [a.code, a.unlockedAt]));
    const achievements = ACHIEVEMENTS_DEF.map(ach => ({
      ...ach,
      unlocked: unlockedMap.has(ach.code),
      unlockedAt: unlockedMap.get(ach.code) || null
    }));

    return res.status(200).json({
      success: true,
      profile: {
        ...profile,
        achievements,
        unlockedCount: profile.unlockedAchievements.length,
        totalAchievements: ACHIEVEMENTS_DEF.length
      }
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc Get global leaderboard
// @route GET /api/leaderboard
router.get('/', (req, res) => {
  try {
    const leaderboard = [
      { rank: 1, username: 'Carlo Ancelotti', club: 'Real Madrid', elo: 1390, winRate: 78.5, games: 28, wins: 22, bestScore: 94.6, avatar: '👑' },
      { rank: 2, username: 'Mikel Arteta', club: 'Arsenal FC', elo: 1312, winRate: 70.0, games: 20, wins: 14, bestScore: 93.2, avatar: '🔴' },
      { rank: 3, username: 'Pep Guardiola', club: 'Manchester City', elo: 1248, winRate: 62.5, games: 12, wins: 8, bestScore: 92.1, avatar: '⚡' },
      { rank: 4, username: 'Hansi Flick', club: 'FC Barcelona', elo: 1215, winRate: 58.3, games: 24, wins: 14, bestScore: 91.0, avatar: '🔵' },
      { rank: 5, username: 'Simone Inzaghi', club: 'Inter Milan', elo: 1188, winRate: 55.0, games: 20, wins: 11, bestScore: 89.4, avatar: '🐍' },
      { rank: 6, username: 'Vincent Kompany', club: 'Bayern München', elo: 1160, winRate: 50.0, games: 16, wins: 8, bestScore: 88.7, avatar: '⭐' }
    ];

    return res.status(200).json({
      success: true,
      leaderboard
    });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
