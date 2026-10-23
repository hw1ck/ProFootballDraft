const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { removeBackground } = require('@imgly/background-removal-node');

// 1. Target Directories
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const PRIMARY_DIR = path.join(PUBLIC_DIR, 'player faces');
const SECONDARY_DIR = path.join(PUBLIC_DIR, 'player_faces');
const DATA_DIR = path.join(__dirname, '..', 'data', 'player faces');
const ROOT_DIR = path.join(__dirname, '..', 'player faces');

// Ensure all target directories exist
[PRIMARY_DIR, SECONDARY_DIR, DATA_DIR, ROOT_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper: Clean string of non-latin characters and extra quotes
function cleanName(str) {
  if (!str) return '';
  let cleaned = str.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '').trim();
  cleaned = cleaned.replace(/["',]/g, '').trim();
  return cleaned;
}

function removeAccents(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function sanitizeFilename(name) {
  return name.replace(/[<>:"/\\|?*]/g, '').trim();
}

// Generate candidate search names for a player
function getSearchCandidates(player) {
  const candidates = [];
  const display = cleanName(player.display_name);
  const longName = cleanName(player.long_name);

  if (!/^[A-Z]\.\s+/.test(display) && display.length > 3) {
    candidates.push(display);
  }

  const longWords = longName.split(/\s+/).filter(Boolean);
  if (longWords.length >= 2) {
    candidates.push(`${longWords[0]} ${longWords[longWords.length - 1]}`);
    if (longWords.length > 2) {
      candidates.push(`${longWords[0]} ${longWords[1]}`);
    }
  }

  if (/^[A-Z]\.\s+/.test(display)) {
    const surname = display.replace(/^[A-Z]\.\s+/, '');
    if (longWords.length > 0) {
      candidates.push(`${longWords[0]} ${surname}`);
    }
  }

  if (display.includes('Vini Jr')) candidates.unshift('Vinícius Júnior');
  if (display.includes('Rodri')) candidates.unshift('Rodri');
  if (display.includes('Pedri')) candidates.unshift('Pedri');
  if (display.includes('Gavi')) candidates.unshift('Gavi');

  candidates.push(display);
  candidates.push(longName);

  return [...new Set(candidates.filter((c) => c && c.length >= 3))];
}

function parseAuctionCSV() {
  const csvPath = path.join(__dirname, '..', 'data', 'auction_pool_top5_leagues.csv');
  if (!fs.existsSync(csvPath)) return [];

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.trim().split('\n');
  const players = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    let inQuotes = false;
    let field = '';
    const row = [];
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(field);
        field = '';
      } else {
        field += char;
      }
    }
    row.push(field);

    players.push({
      player_id: row[0],
      display_name: row[1],
      long_name: row[2],
      position: row[3],
      overall: parseInt(row[5], 10) || 75,
      club_name: row[9] || '',
      league_name: row[10] || ''
    });
  }
  return players;
}

function loadSeedPlayers() {
  try {
    const seed = require('../server/data/seedData.js');
    if (seed && seed.players) {
      return seed.players.map((p, idx) => ({
        player_id: `seed_${idx + 1}`,
        display_name: p.displayName || p.name,
        long_name: p.name,
        position: p.position,
        overall: p.stats ? p.stats.overall : 85,
        club_name: p.club || '',
        league_name: p.league || '',
        isSeed: true
      }));
    }
  } catch (e) {
    console.warn('Could not load seedData:', e.message);
  }
  return [];
}

async function findWikiImage(player, existingManifest) {
  // Check if we already have the verified unscaled URL in manifest
  const id = player.player_id;
  if (existingManifest && id && existingManifest[id] && existingManifest[id].wikiImageUrl) {
    return {
      pageTitle: existingManifest[id].wikiTitle,
      imageUrl: existingManifest[id].wikiImageUrl
    };
  }

  const candidates = getSearchCandidates(player);

  for (const candidate of candidates) {
    try {
      const directUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(candidate.replace(/\s+/g, '_'))}`;
      const res = await fetch(directUrl, {
        headers: { 'User-Agent': 'ProFootballDraft/1.0 (contact@profootballdraft.com)' }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.type !== 'disambiguation' && (data.originalimage || data.thumbnail)) {
          const imgUrl = (data.originalimage && data.originalimage.source) || (data.thumbnail && data.thumbnail.source);
          return {
            pageTitle: data.title,
            imageUrl: imgUrl
          };
        }
      }

      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(candidate + ' footballer')}&utf8=&format=json`;
      const sRes = await fetch(searchUrl, {
        headers: { 'User-Agent': 'ProFootballDraft/1.0 (contact@profootballdraft.com)' }
      });

      if (sRes.ok) {
        const sData = await sRes.json();
        if (sData.query && sData.query.search && sData.query.search.length > 0) {
          const topMatch = sData.query.search[0];
          const pageTitle = topMatch.title;

          const pRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle.replace(/\s+/g, '_'))}`, {
            headers: { 'User-Agent': 'ProFootballDraft/1.0 (contact@profootballdraft.com)' }
          });

          if (pRes.ok) {
            const pData = await pRes.json();
            if (pData.originalimage || pData.thumbnail) {
              const imgUrl = (pData.originalimage && pData.originalimage.source) || (pData.thumbnail && pData.thumbnail.source);
              return {
                pageTitle: pData.title,
                imageUrl: imgUrl
              };
            }
          }
        }
      }
    } catch (e) {
      // Continue
    }
  }

  return null;
}

// Download image buffer using original unscaled source
async function downloadImageBuffer(url) {
  let targetUrl = url;
  // If thumbnail url with query parameters, strip parameters or clean up
  targetUrl = targetUrl.split('?')[0];

  const res = await fetch(targetUrl, {
    headers: { 'User-Agent': 'ProFootballDraft/1.0 (contact@profootballdraft.com)' }
  });
  if (!res.ok) {
    throw new Error(`Failed to download image: ${res.status}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

// AI Background removal + waist level sticker formatting
async function createWaistLevelSticker(imageBuffer) {
  // Pre-downscale to height 800 with sharp for fast, high-quality AI isolation
  const scaled = await sharp(imageBuffer)
    .resize({ height: 800, withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();

  const inputBlob = new Blob([scaled], { type: 'image/jpeg' });
  const outBlob = await removeBackground(inputBlob);
  const cutoutBuffer = Buffer.from(await outBlob.arrayBuffer());

  // Trim transparent excess margins, and ensure transparent background
  const sticker = await sharp(cutoutBuffer)
    .trim()
    .resize({
      width: 380,
      height: 480,
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ quality: 95 })
    .toBuffer();

  return sticker;
}

// Save sticker with all relevant aliases
function saveStickerFiles(stickerBuffer, player, wikiTitle) {
  const cleanLong = cleanName(player.long_name);
  const cleanDisplay = cleanName(player.display_name);
  const safeWiki = cleanName(wikiTitle);

  const namesToSave = new Set([
    cleanLong,
    cleanDisplay,
    safeWiki,
    removeAccents(cleanLong),
    removeAccents(cleanDisplay),
    removeAccents(safeWiki)
  ]);

  const fileVariations = new Set();
  for (const n of namesToSave) {
    if (!n || n.length < 2) continue;
    const safe = sanitizeFilename(n);
    if (!safe) continue;
    fileVariations.add(`${safe}.png`);
    fileVariations.add(`${safe.replace(/\s+/g, '_')}.png`);
  }

  if (player.player_id && !player.player_id.startsWith('seed_')) {
    fileVariations.add(`${player.player_id}.png`);
  }

  const dirs = [PRIMARY_DIR, SECONDARY_DIR, DATA_DIR, ROOT_DIR];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    for (const filename of fileVariations) {
      fs.writeFileSync(path.join(dir, filename), stickerBuffer);
    }
  }

  return Array.from(fileVariations);
}

async function main() {
  console.log('=== Starting Waist-Level Football Player Sticker Harvester ===');
  console.log('Stickers will have background REMOVED so the card design is the background!');
  console.log('Target directories:');
  console.log(' - ' + PRIMARY_DIR);
  console.log(' - ' + SECONDARY_DIR);
  console.log(' - ' + DATA_DIR);
  console.log(' - ' + ROOT_DIR);

  const seedPlayers = loadSeedPlayers();
  const auctionPlayers = parseAuctionCSV();

  const playerMap = new Map();
  seedPlayers.forEach((p) => {
    playerMap.set(cleanName(p.long_name).toLowerCase(), p);
  });

  auctionPlayers.forEach((p) => {
    const key = cleanName(p.long_name).toLowerCase();
    if (!playerMap.has(key)) {
      playerMap.set(key, p);
    } else {
      const existing = playerMap.get(key);
      existing.player_id = p.player_id;
    }
  });

  const allPlayers = Array.from(playerMap.values()).sort((a, b) => (b.overall || 0) - (a.overall || 0));
  console.log(`Total popular player pool candidates: ${allPlayers.length}`);

  const manifestPath = path.join(PRIMARY_DIR, 'manifest.json');
  let manifest = {};
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (e) {}
  }

  // We harvest the popular pool. To ensure completion in reasonable time, process seed players first + top rated players
  let successCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < allPlayers.length; i++) {
    const player = allPlayers[i];
    const cleanCandidate = cleanName(player.long_name) || cleanName(player.display_name);

    console.log(`[${i + 1}/${allPlayers.length}] Processing sticker for: ${cleanCandidate} (OVR: ${player.overall}, Club: ${player.club_name})`);

    try {
      const wikiInfo = await findWikiImage(player, manifest);
      if (!wikiInfo || !wikiInfo.imageUrl) {
        console.log(`  [SKIP] ${cleanCandidate} - No suitable Wikipedia/Wikimedia on-field photo found`);
        skippedCount++;
        continue;
      }

      console.log(`  [DOWNLOADING] ${wikiInfo.pageTitle}...`);
      const imgBuffer = await downloadImageBuffer(wikiInfo.imageUrl);

      console.log(`  [REMOVING BACKGROUND] Isolating player till waist level...`);
      const stickerBuffer = await createWaistLevelSticker(imgBuffer);

      const savedFiles = saveStickerFiles(stickerBuffer, player, wikiInfo.pageTitle);

      manifest[player.player_id || cleanCandidate] = {
        playerId: player.player_id,
        name: cleanCandidate,
        displayName: player.display_name,
        club: player.club_name,
        overall: player.overall,
        wikiTitle: wikiInfo.pageTitle,
        wikiImageUrl: wikiInfo.imageUrl,
        isSticker: true,
        style: 'waist_level_cutout',
        license: 'Wikimedia Commons (Creative Commons / Public Domain)',
        files: savedFiles.map((f) => `/player faces/${f}`)
      };

      successCount++;
      console.log(`  ✓ [SAVED STICKER] ${cleanCandidate} (${savedFiles.length} file aliases created)`);
    } catch (err) {
      console.error(`  [SKIP/ERROR] ${cleanCandidate}: ${err.message}`);
      skippedCount++;
    }

    // Save manifest incrementally
    if (successCount % 5 === 0) {
      [PRIMARY_DIR, SECONDARY_DIR, DATA_DIR, ROOT_DIR].forEach((dir) => {
        fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Final manifest save
  [PRIMARY_DIR, SECONDARY_DIR, DATA_DIR, ROOT_DIR].forEach((dir) => {
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  });

  console.log('\n=============================================');
  console.log('✓ STICKER HARVEST COMPLETE');
  console.log(`Successfully converted to stickers: ${successCount}`);
  console.log(`Skipped:                           ${skippedCount}`);
  console.log(`Total active sticker faces:        ${Object.keys(manifest).length}`);
  console.log('=============================================\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
