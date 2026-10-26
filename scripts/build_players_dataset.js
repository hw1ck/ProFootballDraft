const fs = require('fs');
const path = require('path');

function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.trim().split(/\r?\n/);
  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h.trim()] = values[idx] ? values[idx].trim() : '';
    });
    rows.push(obj);
  }
  return rows;
}

function parseLine(line) {
  const result = [];
  let inQuotes = false;
  let cur = '';
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

// Country code mapping
const NATION_CODES = {
  'France': 'FR',
  'Egypt': 'EG',
  'England': 'GB-ENG',
  'Norway': 'NO',
  'Spain': 'ES',
  'Netherlands': 'NL',
  'Germany': 'DE',
  'Brazil': 'BR',
  'Belgium': 'BE',
  'Portugal': 'PT',
  'Uruguay': 'UY',
  'Morocco': 'MA',
  'Italy': 'IT',
  'Argentina': 'AR',
  'Poland': 'PL',
  'Sweden': 'SE',
  'Slovenia': 'SI',
  'Croatia': 'HR',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Senegal': 'SN',
  'Nigeria': 'NG',
  'Colombia': 'CO',
  'Denmark': 'DK',
  'Japan': 'JP',
  'Korea Republic': 'KR',
  'United States': 'US',
  'Canada': 'CA',
  'Ghana': 'GH',
  'Côte d\'Ivoire': 'CI',
  'Cameroon': 'CM',
  'Algeria': 'DZ',
  'Scotland': 'GB-SCT',
  'Wales': 'GB-WLS',
  'Serbia': 'RS',
  'Czech Republic': 'CZ',
  'Turkey': 'TR',
  'Türkiye': 'TR',
  'Ukraine': 'UA',
  'Georgia': 'GE'
};

function getNationCode(nation) {
  return NATION_CODES[nation] || nation.substring(0, 3).toUpperCase();
}

function calculateEstimatedValue(overall, age, valueEur) {
  // Estimated value in coins (between 25 and 450)
  if (valueEur && Number(valueEur) > 0) {
    const millions = Number(valueEur) / 1000000;
    // Map 10M to ~80, 50M to ~200, 150M to ~420
    const est = Math.round(Math.min(450, Math.max(25, 20 + millions * 2.5)));
    return est;
  }
  const est = Math.round(Math.min(450, Math.max(25, Math.pow(overall / 10, 2.5))));
  return est;
}

function main() {
  console.log('Reading players CSVs...');
  const poolPlayers = parseCsv(path.join(__dirname, '..', 'data', 'auction_pool_top5_leagues.csv'));
  const allPlayers = parseCsv(path.join(__dirname, '..', 'data', 'players.csv'));

  console.log(`Pool players loaded: ${poolPlayers.length}`);
  console.log(`All players loaded: ${allPlayers.length}`);

  // Create a map by player_id
  const playerMap = new Map();

  // Load from pool first
  for (const p of poolPlayers) {
    const id = p.player_id;
    if (!id) continue;
    playerMap.set(id, {
      ...p,
      source: 'pool'
    });
  }

  // Also index allPlayers
  const additionalByLeague = {
    'Premier League': [],
    'La Liga': [],
    'Serie A': [],
    'Bundesliga': [],
    'Other': []
  };

  for (const p of allPlayers) {
    const id = p.player_id;
    if (!playerMap.has(id)) {
      const league = p.league_name;
      if (additionalByLeague[league]) {
        additionalByLeague[league].push(p);
      } else {
        additionalByLeague['Other'].push(p);
      }
    }
  }

  // Target pool sizes:
  // PREMIER_LEAGUE: 162
  // LA_LIGA: 114
  // SERIE_A: 138
  // BUNDESLIGA: 112
  // CHAMPIONS_LEAGUE: 314
  // WORLD_CUP: 508
  // GLOBAL: 569

  // Group current pool players by league
  const pl = [];
  const ll = [];
  const sa = [];
  const bl = [];
  const others = [];

  for (const p of playerMap.values()) {
    const league = p.league_name;
    if (league === 'Premier League') pl.push(p);
    else if (league === 'La Liga') ll.push(p);
    else if (league === 'Serie A') sa.push(p);
    else if (league === 'Bundesliga') bl.push(p);
    else others.push(p);
  }

  console.log(`Initial league counts from pool: PL=${pl.length}, LL=${ll.length}, SA=${sa.length}, BL=${bl.length}, Others=${others.length}`);

  // Sort each by overall descending
  const byOvrDesc = (a, b) => Number(b.overall || 0) - Number(a.overall || 0);
  pl.sort(byOvrDesc);
  ll.sort(byOvrDesc);
  sa.sort(byOvrDesc);
  bl.sort(byOvrDesc);
  additionalByLeague['Premier League'].sort(byOvrDesc);
  additionalByLeague['La Liga'].sort(byOvrDesc);
  additionalByLeague['Serie A'].sort(byOvrDesc);
  additionalByLeague['Bundesliga'].sort(byOvrDesc);

  // Fill up or trim each league to target:
  // PL: 162
  while (pl.length < 162 && additionalByLeague['Premier League'].length > 0) {
    pl.push(additionalByLeague['Premier League'].shift());
  }
  const finalPl = pl.slice(0, 162);

  // La Liga: 114
  while (ll.length < 114 && additionalByLeague['La Liga'].length > 0) {
    ll.push(additionalByLeague['La Liga'].shift());
  }
  const finalLl = ll.slice(0, 114);

  // Serie A: 138
  while (sa.length < 138 && additionalByLeague['Serie A'].length > 0) {
    sa.push(additionalByLeague['Serie A'].shift());
  }
  const finalSa = sa.slice(0, 138);

  // Bundesliga: 112
  while (bl.length < 112 && additionalByLeague['Bundesliga'].length > 0) {
    bl.push(additionalByLeague['Bundesliga'].shift());
  }
  const finalBl = bl.slice(0, 112);

  // Combine top 4 leagues: 162 + 114 + 138 + 112 = 526 players
  const combined526 = [...finalPl, ...finalLl, ...finalSa, ...finalBl];
  console.log(`Top 4 leagues combined total: ${combined526.length}`);

  // We need 569 total players for GLOBAL (569 - 526 = 43 more star players from Ligue 1 / other top clubs)
  const remainingNeeded = 569 - combined526.length; // 43
  const poolOthers = [...others, ...additionalByLeague['Other']].filter(p => !combined526.some(c => c.player_id === p.player_id));
  poolOthers.sort(byOvrDesc);
  const extraStars = poolOthers.slice(0, remainingNeeded);

  const global569 = [...combined526, ...extraStars];
  console.log(`Global total: ${global569.length}`);

  // Assign competitions:
  // PREMIER_LEAGUE (162)
  // LA_LIGA (114)
  // SERIE_A (138)
  // BUNDESLIGA (112)
  // CHAMPIONS_LEAGUE (314): Top 314 players who play in UCL clubs
  // WORLD_CUP (508): Top 508 players who play in international national teams
  // GLOBAL (569): All 569 players

  // Sort global by overall
  global569.sort(byOvrDesc);

  // For UCL: take top 314
  const uclIds = new Set(global569.slice(0, 314).map(p => p.player_id));
  // For World Cup: take top 508
  const wcIds = new Set(global569.slice(0, 508).map(p => p.player_id));
  const plIds = new Set(finalPl.map(p => p.player_id));
  const llIds = new Set(finalLl.map(p => p.player_id));
  const saIds = new Set(finalSa.map(p => p.player_id));
  const blIds = new Set(finalBl.map(p => p.player_id));

  // Check goalkeeper counts in each
  const isGk = (p) => (p.position === 'GK' || (p.player_positions && p.player_positions.includes('GK')));

  // Verify cards and format
  const publicFacesDir = path.join(__dirname, '..', 'public', 'player_faces');

  const formattedPlayers = global569.map((p, index) => {
    const id = p.player_id;
    const comps = ['GLOBAL'];
    if (plIds.has(id)) comps.push('PREMIER_LEAGUE');
    if (llIds.has(id)) comps.push('LA_LIGA');
    if (saIds.has(id)) comps.push('SERIE_A');
    if (blIds.has(id)) comps.push('BUNDESLIGA');
    if (uclIds.has(id)) comps.push('CHAMPIONS_LEAGUE');
    if (wcIds.has(id)) comps.push('WORLD_CUP');

    const name = p.display_name || p.short_name || p.long_name || 'Player';
    const surname = p.long_name ? p.long_name.split(' ').pop().toUpperCase() : name.split(' ').pop().toUpperCase();
    const position = p.position || (p.player_positions ? p.player_positions.split(',')[0].trim() : 'CM');
    const subPositions = p.player_positions ? p.player_positions.split(',').map(s => s.trim()).filter(s => s !== position) : [];

    const ovr = parseInt(p.overall) || 80;
    const pace = Math.round(parseFloat(p.pace) || (position === 'GK' ? 50 : 75));
    const shooting = Math.round(parseFloat(p.shooting) || (position === 'GK' ? 30 : 70));
    const passing = Math.round(parseFloat(p.passing) || (position === 'GK' ? 60 : 72));
    const dribbling = Math.round(parseFloat(p.dribbling) || (position === 'GK' ? 45 : 74));
    const defending = Math.round(parseFloat(p.defending) || (position === 'GK' ? 35 : 70));
    const physical = Math.round(parseFloat(p.physic) || (position === 'GK' ? 70 : 72));

    // Specific overrides from specification
    let estimatedValue = calculateEstimatedValue(ovr, p.age, p.value_eur);
    if (name.includes('Doku') || surname.includes('DOKU')) {
      estimatedValue = 125;
    } else if (name.includes('Wirtz') || surname.includes('WIRTZ')) {
      estimatedValue = 370;
    } else if (name.includes('Pedri') || surname.includes('PEDRI')) {
      estimatedValue = 390;
    }

    // Photo check
    const localFacePath = `/player_faces/${id}.png`;
    const fullLocalPath = path.join(publicFacesDir, `${id}.png`);
    const hasLocalFace = fs.existsSync(fullLocalPath);
    const photoUrl = hasLocalFace ? localFacePath : (p.player_face_url || localFacePath);

    return {
      playerId: id,
      name,
      displayName: p.display_name || p.short_name || name,
      surname,
      age: parseInt(p.age) || 25,
      preferredFoot: p.preferred_foot || 'Right',
      jerseyNumber: p.club_jersey_number || String(index + 1),
      position,
      subPositions,
      role: ovr >= 88 ? 'ICONIC STAR' : ovr >= 84 ? 'FIRST TEAM REGULAR' : 'SQUAD PLAYER',
      nationality: p.nationality_name || 'Global',
      nationalityCode: getNationCode(p.nationality_name || ''),
      club: p.club_name || 'Free Agent',
      league: p.league_name || 'Top Division',
      competitions: comps,
      basePrice: 10,
      estimatedValue,
      currentPrice: 10,
      status: 'upcoming',
      stats: {
        pace,
        shooting,
        passing,
        dribbling,
        defending,
        physical,
        overall: ovr
      },
      rarity: ovr >= 88 ? 'LEGENDARY' : ovr >= 84 ? 'RARE' : 'COMMON',
      photoUrl,
      orderIndex: index + 1
    };
  });

  // Verify pool counts:
  const counts = {
    PREMIER_LEAGUE: formattedPlayers.filter(p => p.competitions.includes('PREMIER_LEAGUE')).length,
    LA_LIGA: formattedPlayers.filter(p => p.competitions.includes('LA_LIGA')).length,
    SERIE_A: formattedPlayers.filter(p => p.competitions.includes('SERIE_A')).length,
    BUNDESLIGA: formattedPlayers.filter(p => p.competitions.includes('BUNDESLIGA')).length,
    CHAMPIONS_LEAGUE: formattedPlayers.filter(p => p.competitions.includes('CHAMPIONS_LEAGUE')).length,
    WORLD_CUP: formattedPlayers.filter(p => p.competitions.includes('WORLD_CUP')).length,
    GLOBAL: formattedPlayers.filter(p => p.competitions.includes('GLOBAL')).length
  };

  console.log('Final Pool Counts:', counts);

  // Write to server/data/players-2026-27.json
  const outDir = path.join(__dirname, '..', 'server', 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'players-2026-27.json');
  fs.writeFileSync(outPath, JSON.stringify(formattedPlayers, null, 2));
  console.log(`Successfully generated ${formattedPlayers.length} players to ${outPath}`);
}

main();
