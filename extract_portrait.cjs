const fs = require('fs');
const zlib = require('zlib');

function decodePNG(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.readUInt32BE(0) !== 0x89504E47) throw new Error('Not a PNG');

  let pos = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
      bitDepth = buf.readUInt8(pos + 16);
      colorType = buf.readUInt8(pos + 17);
    } else if (type === 'IDAT') {
      idatChunks.push(buf.subarray(pos + 8, pos + 8 + len));
    } else if (type === 'IEND') {
      break;
    }
    pos += 12 + len;
  }

  console.log(`PNG Info: ${width}x${height}, depth: ${bitDepth}, colorType: ${colorType}`);
  const compressed = Buffer.concat(idatChunks);
  const decompressed = zlib.inflateSync(compressed);

  // Unfilter scanlines (colorType 6 = RGBA)
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const rgba = Buffer.alloc(width * height * 4);

  let srcPos = 0;
  let dstPos = 0;

  for (let y = 0; y < height; y++) {
    const filterType = decompressed[srcPos++];
    const lineStart = dstPos;
    const prevLineStart = dstPos - stride;

    for (let x = 0; x < stride; x++) {
      let b = decompressed[srcPos++];
      const a = x >= bytesPerPixel ? rgba[lineStart + x - bytesPerPixel] : 0;
      const c = prevLineStart >= 0 ? rgba[prevLineStart + x] : 0;
      const d = (prevLineStart >= 0 && x >= bytesPerPixel) ? rgba[prevLineStart + x - bytesPerPixel] : 0;

      if (filterType === 1) {
        b = (b + a) & 0xff;
      } else if (filterType === 2) {
        b = (b + c) & 0xff;
      } else if (filterType === 3) {
        b = (b + Math.floor((a + c) / 2)) & 0xff;
      } else if (filterType === 4) {
        // Paeth
        const p = a + c - d;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - c);
        const pc = Math.abs(p - d);
        let pr = a;
        if (pb < pa && pb < pc) pr = c;
        else if (pc < pa) pr = d;
        b = (b + pr) & 0xff;
      }
      rgba[dstPos++] = b;
    }
  }

  return { width, height, data: rgba };
}

try {
  const { width, height, data } = decodePNG('public/profile.png');
  console.log('Successfully decoded PNG, processing pixels...');

  const targetW = 400;
  const targetH = 480;
  const candidates = [];

  // Downsample grid
  const step = 3;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      if (a < 50) continue;

      // Detect background blue circle:
      // In the image, blue badge is approx rgb(25, 100, 220) -> b is high, r and g are much lower
      const isBlue = b > 115 && b > r * 1.35 && b > g * 1.12;
      // Dark corner
      const isDark = r < 25 && g < 25 && b < 25;
      // White border
      const isWhiteSticker = r > 235 && g > 235 && b > 235;

      if (isBlue || isDark) continue;

      let lum = 0.299 * r + 0.587 * g + 0.114 * b;

      if (isWhiteSticker) {
        lum = 55; // faint rim
      } else {
        // Face, hair, shirt, suit
        lum = Math.min(255, lum * 1.3);
        // Boost dark curly hair texture
        if (r < 65 && g < 65 && b < 65) {
          lum = Math.max(lum, 50);
        }
      }

      if (lum > 28) {
        // Map to normalized target (0 to targetW, 0 to targetH)
        const normX = (x / width) * targetW;
        const normY = (y / height) * targetH;
        const normZ = (lum / 255) * 40;

        const isCyan = Math.random() < 0.35 || lum > 160;
        const alpha = Math.min(0.95, Math.max(0.28, (lum / 255) * 0.9 + 0.1));
        const size = 1.0 + (lum / 255) * 1.6;

        candidates.push({
          x: Math.round(normX * 10) / 10,
          y: Math.round(normY * 10) / 10,
          z: Math.round(normZ * 10) / 10,
          size: Math.round(size * 10) / 10,
          alpha: Math.round(alpha * 100) / 100,
          isCyan,
        });
      }
    }
  }

  console.log(`Extracted ${candidates.length} candidate particles for user portrait!`);

  // Cap to ~3800 for optimal 60fps performance
  let selected = candidates;
  if (candidates.length > 3800) {
    const stride = candidates.length / 3800;
    selected = [];
    for (let i = 0; i < candidates.length; i += stride) {
      selected.push(candidates[Math.floor(i)]);
    }
  }

  console.log(`Selected ${selected.length} particles. Writing to src/data/userPortraitData.ts...`);

  const tsContent = `// Precomputed particle point coordinates extracted from Mangal's uploaded portrait
export interface RawPortraitPoint {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  isCyan: boolean;
}

export const USER_PORTRAIT_PARTICLES: RawPortraitPoint[] = ${JSON.stringify(selected)};
`;

  fs.writeFileSync('src/data/userPortraitData.ts', tsContent);
  console.log('Successfully wrote src/data/userPortraitData.ts!');
} catch (e) {
  console.error('Error:', e);
}
