const Team = require('../models/Team');
const Player = require('../models/Player');

// @desc Get all teams with squad details and stats
// @route GET /api/teams
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('players')
      .populate('manager', 'name email role')
      .sort({ spent: -1 });

    const formatted = teams.map(team => {
      const squad = team.players || [];
      const totalRating = squad.reduce((sum, p) => sum + (p.stats?.overall || 0), 0);
      const avgRating = squad.length > 0 ? Math.round(totalRating / squad.length) : 0;

      const positions = {
        GK: squad.filter(p => p.position === 'GK').length,
        DEF: squad.filter(p => p.position === 'DEF').length,
        MID: squad.filter(p => p.position === 'MID').length,
        FWD: squad.filter(p => p.position === 'FWD').length
      };

      return {
        ...team.toObject(),
        remainingBudget: Math.max(0, team.budget - team.spent),
        playerCount: squad.length,
        avgRating,
        totalRating,
        positions
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      teams: formatted
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching teams' });
  }
};

// @desc Get single team by ID
// @route GET /api/teams/:id
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('players')
      .populate('manager', 'name email');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const squad = team.players || [];
    const totalRating = squad.reduce((sum, p) => sum + (p.stats?.overall || 0), 0);
    const avgRating = squad.length > 0 ? Math.round(totalRating / squad.length) : 0;

    return res.status(200).json({
      success: true,
      team: {
        ...team.toObject(),
        remainingBudget: Math.max(0, team.budget - team.spent),
        playerCount: squad.length,
        avgRating,
        totalRating
      }
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc Create team
// @route POST /api/teams
exports.createTeam = async (req, res) => {
  try {
    const team = await Team.create(req.body);
    return res.status(201).json({ success: true, team });
  } catch (error) {
    console.error('Error creating team:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error creating team' });
  }
};

// @desc Update team
// @route PUT /api/teams/:id
exports.updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('players')
      .populate('manager', 'name email');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }
    return res.status(200).json({ success: true, team });
  } catch (error) {
    console.error('Error updating team:', error);
    return res.status(500).json({ success: false, message: 'Server error updating team' });
  }
};
