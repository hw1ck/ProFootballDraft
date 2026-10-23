const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function getDoku() {
  const url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/J%C3%A9r%C3%A9my_Doku_USMNT_v_Belgium_Mar_28_2026-27_%28cropped%29.jpg/500px-J%C3%A9r%C3%A9my_Doku_USMNT_v_Belgium_Mar_28_2026-27_%28cropped%29.jpg';
  const res = await fetch(url, { headers: { 'User-Agent': 'ProFootballDraft/1.0 (contact@profootballdraft.com)' } });
  const buf = Buffer.from(await res.arrayBuffer());
  const size = 256;

  const mask = Buffer.from(`
    <svg width="${size}" height="${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="white" />
    </svg>
  `);
  const ring = Buffer.from(`
    <svg width="${size}" height="${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 3}" fill="none" stroke="rgba(56, 189, 248, 0.55)" stroke-width="2.5" />
    </svg>
  `);

  const out = await sharp(buf)
    .resize(size, size, { fit: 'cover', position: sharp.gravity.north })
    .composite([
      { input: mask, blend: 'dest-in' },
      { input: ring, blend: 'over' }
    ])
    .png()
    .toBuffer();

  const names = ['Jérémy Doku.png', 'Jérémy_Doku.png', 'Jeremy Doku.png', 'Jeremy_Doku.png', 'Doku.png', '254544.png'];
  const dirs = [
    path.join(__dirname, '..', 'public', 'player faces'),
    path.join(__dirname, '..', 'public', 'player_faces'),
    path.join(__dirname, '..', 'data', 'player faces')
  ];

  dirs.forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    names.forEach(n => {
      fs.writeFileSync(path.join(d, n), out);
    });
  });

  console.log('Saved Doku successfully!');
}

getDoku().catch(console.error);
