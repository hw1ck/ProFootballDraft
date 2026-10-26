const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Player = require('../models/Player');
const Team = require('../models/Team');
const AuctionState = require('../models/AuctionState');

// Map position string (e.g. 'CAM, CM' or 'ST') to primary bracket: GK, DEF, MID, FWD
function mapPosition(pos) {
  if (!pos) return 'MID';
  const first = pos.split(',')[0].trim().toUpperCase();
  if (['GK'].includes(first)) return 'GK';
  if (['CB', 'LB', 'RB', 'LWB', 'RWB', 'DEF'].includes(first)) return 'DEF';
  if (['CDM', 'CM', 'CAM', 'LM', 'RM', 'MID'].includes(first)) return 'MID';
  if (['ST', 'CF', 'LW', 'RW', 'FWD'].includes(first)) return 'FWD';
  return 'MID';
}

// Map role based on position and key stats
function deriveRole(pos, stats) {
  if (pos === 'GK') return 'WALL';
  if (pos === 'DEF') {
    return (stats.defending >= 85 && stats.physical >= 82) ? 'COLOSSUS' : 'BALL PLAYING DEFENDER';
  }
  if (pos === 'MID') {
    if (stats.defending > 75) return 'ANCHOR';
    if (stats.passing >= 85) return 'MAESTRO';
    return 'BOX TO BOX';
  }
  if (pos === 'FWD') {
    if (stats.shooting >= 88) return 'FINISHER';
    if (stats.pace >= 90) return 'SPEEDSTER';
    return 'TRICKSTER';
  }
  return 'VERSATILE';
}

// @desc Get all players with search, filter, sort
// @route GET /api/players
exports.getPlayers = async (req, res) => {
  try {
    const { search, position, status, minPrice, maxPrice, sortBy, sortOrder, competition } = req.query;

    let filter = {};

    if (competition && competition !== 'ALL' && competition !== 'ANY') {
      filter.competitions = competition;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
        { surname: { $regex: search, $options: 'i' } },
        { nationality: { $regex: search, $options: 'i' } },
        { club: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }

    if (position && position !== 'ALL') {
      filter.position = position;
    }

    if (status && status !== 'ALL') {
      filter.status = status;
    }

    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = Number(minPrice);
      if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }

    let sortOptions = { orderIndex: 1, createdAt: -1 };
    if (sortBy) {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'rating') sortOptions = { 'stats.overall': order };
      else if (sortBy === 'price') sortOptions = { basePrice: order };
      else if (sortBy === 'name') sortOptions = { name: order };
      else if (sortBy === 'estValue') sortOptions = { estimatedValue: order };
    }

    let players = await Player.find(filter)
      .populate('soldTo', 'name shortName logo color')
      .sort(sortOptions);

    // If database is empty or still seeding, fallback to local JSON dataset
    if (players.length === 0) {
      try {
        const poolPath = path.join(__dirname, '..', 'data', 'players-2026-27.json');
        if (fs.existsSync(poolPath)) {
          let pool = JSON.parse(fs.readFileSync(poolPath, 'utf8'));
          if (competition && competition !== 'ALL' && competition !== 'ANY') {
            pool = pool.filter(p => p.competitions && p.competitions.includes(competition));
          }
          if (position && position !== 'ALL') {
            pool = pool.filter(p => p.position === position);
          }
          if (search) {
            const q = search.toLowerCase();
            pool = pool.filter(p => (
              (p.name && p.name.toLowerCase().includes(q)) ||
              (p.club && p.club.toLowerCase().includes(q)) ||
              (p.nationality && p.nationality.toLowerCase().includes(q))
            ));
          }
          if (sortBy === 'rating') {
            pool.sort((a, b) => (sortOrder === 'asc' ? 1 : -1) * (a.stats.overall - b.stats.overall));
          } else if (sortBy === 'estValue') {
            pool.sort((a, b) => (sortOrder === 'asc' ? 1 : -1) * (a.estimatedValue - b.estimatedValue));
          }
          players = pool;
        }
      } catch (err) {
        console.warn('Fallback JSON read error:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      count: players.length,
      players
    });
  } catch (error) {
    console.error('Error fetching players:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching players' });
  }
};

// @desc Get single player by ID
// @route GET /api/players/:id
exports.getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('soldTo', 'name shortName logo color');
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }
    return res.status(200).json({ success: true, player });
  } catch (error) {
    console.error('Error fetching player by id:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc Create new player
// @route POST /api/players
exports.createPlayer = async (req, res) => {
  try {
    const count = await Player.countDocuments();
    const player = await Player.create({
      ...req.body,
      orderIndex: count + 1
    });
    return res.status(201).json({ success: true, player });
  } catch (error) {
    console.error('Error creating player:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error creating player' });
  }
};

// @desc Update player
// @route PUT /api/players/:id
exports.updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('soldTo', 'name shortName logo color');
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }
    return res.status(200).json({ success: true, player });
  } catch (error) {
    console.error('Error updating player:', error);
    return res.status(500).json({ success: false, message: 'Server error updating player' });
  }
};

// @desc Delete player
// @route DELETE /api/players/:id
exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }
    if (player.soldTo) {
      await Team.findByIdAndUpdate(player.soldTo, {
        $pull: { players: player._id }
      });
    }
    await Player.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Player removed successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting player' });
  }
};

// @desc Ingest top 30 stars from contexts/popular_players_normalized.csv
// @route POST /api/players/import-csv
exports.importFromCsv = async (req, res) => {
  try {
    const csvPath = path.resolve(__dirname, '../../contexts/popular_players_normalized.csv');
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ success: false, message: 'CSV file not found at expected path' });
    }

    const rows = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => rows.push(data))
      .on('end', async () => {
        try {
          // Sort rows by overall descending and take top 25
          const sorted = rows
            .filter(r => r.display_name && r.overall)
            .sort((a, b) => Number(b.overall) - Number(a.overall))
            .slice(0, 25);

          let importedCount = 0;
          for (let i = 0; i < sorted.length; i++) {
            const r = sorted[i];
            const name = r.display_name || r.short_name;
            const primaryPos = mapPosition(r.player_positions);
            const overall = Number(r.overall) || 80;
            const basePrice = Math.max(10000000, (overall - 70) * 2000000);

            const stats = {
              pace: Math.round(Number(r.pace)) || 75,
              shooting: Math.round(Number(r.shooting)) || 75,
              passing: Math.round(Number(r.passing)) || 75,
              dribbling: Math.round(Number(r.dribbling)) || 75,
              defending: Math.round(Number(r.defending)) || 75,
              physical: Math.round(Number(r.physic)) || 75,
              overall
            };

            await Player.findOneAndUpdate(
              { name },
              {
                name,
                displayName: r.short_name || name,
                age: Number(r.age) || 25,
                jerseyNumber: String(r.club_jersey_number || ''),
                position: primaryPos,
                subPositions: (r.player_positions || '').split(',').map(s => s.trim()),
                role: deriveRole(primaryPos, stats),
                nationality: r.nationality_name || 'Global',
                club: r.club_name || 'Free Agent',
                league: r.league_name || 'Top League',
                basePrice,
                currentPrice: basePrice,
                status: 'upcoming',
                stats,
                orderIndex: i + 1
              },
              { upsert: true, new: true }
            );
            importedCount++;
          }

          return res.status(200).json({
            success: true,
            message: `Successfully imported ${importedCount} top EA FC stars from dataset!`,
            count: importedCount
          });
        } catch (err) {
          console.error('Error inserting CSV players:', err);
          return res.status(500).json({ success: false, message: err.message });
        }
      });
  } catch (error) {
    console.error('Error importing CSV:', error);
    return res.status(500).json({ success: false, message: 'Server error during CSV import' });
  }
};
