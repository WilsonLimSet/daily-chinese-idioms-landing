#!/usr/bin/env node
/**
 * One-shot lossy re-compression of raster images in /public.
 * Requires `sharp` — install ad-hoc with: npm install --no-save sharp
 *
 * Re-encodes JPEG via mozjpeg at quality 82 and PNG via sharp's palette/zlib
 * pipeline. Skips SVG and WebP. Overwrites originals only if the new file
 * is smaller than the old one.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const JPEG_QUALITY = 82;

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

async function compress(file) {
  const ext = path.extname(file).toLowerCase();
  const before = fs.statSync(file).size;
  let buf;

  if (ext === '.jpg' || ext === '.jpeg') {
    buf = await sharp(file).jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
  } else if (ext === '.png') {
    buf = await sharp(file).png({ compressionLevel: 9, palette: true, effort: 10 }).toBuffer();
  } else {
    return null;
  }

  const after = buf.length;
  if (after < before) {
    fs.writeFileSync(file, buf);
    return { file, before, after, saved: before - after };
  }
  return { file, before, after, saved: 0 };
}

(async () => {
  const files = walk(PUBLIC_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));
  let total = 0;
  let saved = 0;
  for (const f of files) {
    const r = await compress(f);
    if (!r) continue;
    total += r.before;
    saved += r.saved;
    const pct = r.before ? Math.round((r.saved / r.before) * 100) : 0;
    const rel = path.relative(PUBLIC_DIR, r.file);
    console.log(
      `${rel.padEnd(50)} ${(r.before / 1024).toFixed(0).padStart(6)} KB -> ${(r.after / 1024).toFixed(0).padStart(6)} KB  (-${pct}%)`,
    );
  }
  console.log(
    `\nTotal: ${(total / 1024).toFixed(0)} KB -> ${((total - saved) / 1024).toFixed(0)} KB  (saved ${(saved / 1024).toFixed(0)} KB, ${Math.round((saved / total) * 100)}%)`,
  );
})();
