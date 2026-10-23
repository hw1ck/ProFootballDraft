const fs = require('fs');
const path = require('path');

function removeAccents(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const manifestPath = path.join(__dirname, '..', 'public', 'player faces', 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('manifest.json not found');
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const targetDirs = [
  path.join(__dirname, '..', 'public', 'player faces'),
  path.join(__dirname, '..', 'public', 'player_faces'),
  path.join(__dirname, '..', 'data', 'player faces')
];

let aliasCount = 0;

for (const [id, item] of Object.entries(manifest)) {
  // Try to find any existing file for this player
  let buffer = null;
  const primaryIdFile = path.join(targetDirs[0], `${id}.png`);
  if (fs.existsSync(primaryIdFile)) {
    buffer = fs.readFileSync(primaryIdFile);
  } else if (item.files && item.files.length > 0) {
    for (const f of item.files) {
      const p = path.join(targetDirs[0], path.basename(f));
      if (fs.existsSync(p)) {
        buffer = fs.readFileSync(p);
        break;
      }
    }
  }

  if (!buffer) continue;

  const namesToAlias = new Set([
    item.wikiTitle,
    item.displayName,
    item.name,
    removeAccents(item.wikiTitle),
    removeAccents(item.displayName),
    removeAccents(item.name)
  ]);

  for (const name of namesToAlias) {
    if (!name || name.length < 2) continue;
    const clean = name.replace(/["'<>:/\\|?*]/g, '').trim();
    if (!clean) continue;

    const variants = [
      `${clean}.png`,
      `${clean.replace(/\s+/g, '_')}.png`
    ];

    for (const v of variants) {
      for (const dir of targetDirs) {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const dest = path.join(dir, v);
        if (!fs.existsSync(dest)) {
          fs.writeFileSync(dest, buffer);
          aliasCount++;
        }
      }
    }
  }
}

console.log(`Successfully generated ${aliasCount} friendly aliases across all directories.`);
