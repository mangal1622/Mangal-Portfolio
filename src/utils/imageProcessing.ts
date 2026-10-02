import { Particle, ParticlePoint } from './particleUtils';

export interface ImageProcessingOptions {
  sampleStep?: number;
  brightnessThreshold?: number;
  edgeThreshold?: number;
  maxParticles?: number;
  contrastBoost?: number;
}

// Convert an image (File or URL like /profile.png) into dynamic particle points
export async function processImageToParticles(
  source: File | string,
  targetWidth: number,
  targetHeight: number,
  options: ImageProcessingOptions = {},
  onProgress?: (stage: string, percent: number) => void
): Promise<Particle[]> {
  const {
    sampleStep = 2,
    brightnessThreshold = 25,
    edgeThreshold = 30,
    maxParticles = 5200,
    contrastBoost = 1.35,
  } = options;

  onProgress?.("READING USER PORTRAIT...", 20);

  const img = await loadImage(source);

  onProgress?.("ALLOCATING NEURAL MATRIX...", 40);

  const offCanvas = document.createElement('canvas');
  const analysisWidth = 240;
  const analysisHeight = Math.round(analysisWidth * (targetHeight / targetWidth));
  offCanvas.width = analysisWidth;
  offCanvas.height = analysisHeight;

  const ctx = offCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // Center crop image onto analysis canvas
  const imgAspect = img.width / img.height;
  const targetAspect = analysisWidth / analysisHeight;
  let sWidth = img.width;
  let sHeight = img.height;
  let sx = 0;
  let sy = 0;

  if (imgAspect > targetAspect) {
    sWidth = img.height * targetAspect;
    sx = (img.width - sWidth) / 2;
  } else {
    sHeight = img.width / targetAspect;
    sy = (img.height - sHeight) / 2;
  }

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, analysisWidth, analysisHeight);
  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, analysisWidth, analysisHeight);

  onProgress?.("FILTERING BLUE BACKGROUND...", 60);

  const imageData = ctx.getImageData(0, 0, analysisWidth, analysisHeight);
  const data = imageData.data;

  // Grayscale matrix with background segmentation
  const gray = new Float32Array(analysisWidth * analysisHeight);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Background blue circle detection:
    // In user's avatar, background is strong solid blue: high blue, lower red & green
    const isBlueBackground = b > 110 && b > r * 1.35 && b > g * 1.1;
    // Dark corner background
    const isDarkCorner = r < 25 && g < 25 && b < 25;
    // White sticker outline (subtle edge ok, but avoid heavy block)
    const isWhiteSticker = r > 240 && g > 240 && b > 240;

    let lum = 0;
    if (!isBlueBackground && !isDarkCorner) {
      if (isWhiteSticker) {
        // Keep white outline faint so it forms a subtle rim light
        lum = 70;
      } else {
        // Person's face, curly hair, eyes, teeth, suit, collar
        lum = 0.299 * r + 0.587 * g + 0.114 * b;
        // Contrast enhancement
        lum = ((lum / 255 - 0.5) * contrastBoost + 0.5) * 255;
        lum = Math.max(0, Math.min(255, lum));

        // Boost hair curls and eyes/smile
        if (r < 60 && g < 60 && b < 60) {
          // Curly hair - boost presence so it forms distinct silhouette
          lum = Math.max(lum, 45);
        }
      }
    }

    gray[i / 4] = lum;
  }

  // Sobel Edge Detection for curls, jawline, facial features
  onProgress?.("DETECTING FACIAL & HAIR CONTOURS...", 80);
  const edges = new Float32Array(analysisWidth * analysisHeight);
  for (let y = 1; y < analysisHeight - 1; y++) {
    for (let x = 1; x < analysisWidth - 1; x++) {
      const idx = y * analysisWidth + x;
      const gx =
        -1 * gray[idx - analysisWidth - 1] + 1 * gray[idx - analysisWidth + 1] +
        -2 * gray[idx - 1]                 + 2 * gray[idx + 1] +
        -1 * gray[idx + analysisWidth - 1] + 1 * gray[idx + analysisWidth + 1];

      const gy =
        -1 * gray[idx - analysisWidth - 1] - 2 * gray[idx - analysisWidth] - 1 * gray[idx - analysisWidth + 1] +
         1 * gray[idx + analysisWidth - 1] + 2 * gray[idx + analysisWidth] + 1 * gray[idx + analysisWidth + 1];

      edges[idx] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  onProgress?.("GENERATING PARTICLE MATRIX...", 95);

  const candidates: ParticlePoint[] = [];
  const scaleX = targetWidth / analysisWidth;
  const scaleY = targetHeight / analysisHeight;

  // Adaptive sampling
  for (let y = 0; y < analysisHeight; y += sampleStep) {
    for (let x = 0; x < analysisWidth; x += sampleStep) {
      const idx = y * analysisWidth + x;
      const lum = gray[idx];
      const edge = edges[idx];

      if (lum <= 10 && edge <= 15) continue;

      const score = lum * 0.7 + edge * 0.9;

      if (score > brightnessThreshold || edge > edgeThreshold) {
        const sampleProb = Math.min(1.0, (score / 255) * 1.6);
        if (Math.random() <= sampleProb) {
          const originX = x * scaleX + (Math.random() - 0.5) * sampleStep * scaleX;
          const originY = y * scaleY + (Math.random() - 0.5) * sampleStep * scaleY;
          // Depth based on brightness & face center
          const originZ = (lum / 255) * 40;

          // Highlights get electric cyan, midtones get crisp ice-white
          const isCyanHighlight = Math.random() < 0.35 || edge > 60 || lum > 170;
          const alpha = Math.min(0.95, Math.max(0.25, (score / 255) * 0.85 + 0.15));
          const size = 1.0 + (lum / 255) * 1.6;

          // Scatter initial position for assembly animation
          const scatterRadius = 150 + Math.random() * 240;
          const scatterAngle = Math.random() * Math.PI * 2;
          const initialX = originX + Math.cos(scatterAngle) * scatterRadius;
          const initialY = originY + Math.sin(scatterAngle) * scatterRadius;

          candidates.push({
            x: initialX,
            y: initialY,
            z: originZ,
            originX,
            originY,
            originZ,
            vx: 0,
            vy: 0,
            vz: 0,
            size,
            alpha,
            baseAlpha: alpha,
            color: isCyanHighlight ? '#00f0ff' : '#f0f9ff',
            isCyan: isCyanHighlight,
            driftPhase: Math.random() * Math.PI * 2,
            driftSpeed: 0.01 + Math.random() * 0.02,
          });
        }
      }
    }
  }

  let finalPoints = candidates;
  if (candidates.length > maxParticles) {
    finalPoints = shuffleArray(candidates).slice(0, maxParticles);
  }

  onProgress?.("ASSEMBLING COMPLETE", 100);

  return finalPoints.map(p => new Particle(p));
}

function loadImage(source: File | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${e}`));

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(source);
    }
  });
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
