import React, { useEffect, useRef } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { createPortal } from 'react-dom';

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

function lerpNum(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Colour along the beam: white-hot at the head, cooling through bright
 * cyan, fading toward a deeper blue at the tail tip. Alpha is applied
 * separately per-segment based on taper + age.
 */
function beamColorAt(t: number, alpha: number): string {
  const stops = [
    { t: 0, r: 255, g: 255, b: 255 },
    { t: 0.35, r: 195, g: 232, b: 255 },
    { t: 1, r: 95, g: 180, b: 240 },
  ];
  let s0 = stops[0];
  let s1 = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].t && t <= stops[i + 1].t) {
      s0 = stops[i];
      s1 = stops[i + 1];
      break;
    }
  }
  const span = s1.t - s0.t || 1;
  const localT = (t - s0.t) / span;
  const r = Math.round(lerpNum(s0.r, s1.r, localT));
  const g = Math.round(lerpNum(s0.g, s1.g, localT));
  const b = Math.round(lerpNum(s0.b, s1.b, localT));
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}

/**
 * Draws a pinched 4-point sparkle/star (✦) for the bright leading point —
 * this is what makes the head read as a "star" rather than a plain dot.
 */
function drawSparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  alpha: number,
  color: string
) {
  if (size <= 0.05 || alpha <= 0.01) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  const pinch = size * 0.18;
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(pinch, -pinch, size, 0);
  ctx.quadraticCurveTo(pinch, pinch, 0, size);
  ctx.quadraticCurveTo(-pinch, pinch, -size, 0);
  ctx.quadraticCurveTo(-pinch, -pinch, 0, -size);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

export const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const prefersReduced = useMediaQuery('(prefers-reduced-motion)');
  const isTouch = useMediaQuery('(pointer: coarse)');

  const cursor = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    speed: 0,
  });

  const trail = useRef<TrailPoint[]>([]);
  const lastFrameTime = useRef(performance.now());

  const CONFIG = {
    lerp: 0.22,
    trailMaxPoints: 30,
    trailPointLifeMs: 320,

    beamMaxWidth: 3.6,
    beamGlowBlur: 10,
    widthTaperPower: 1.0, // 1 = perfectly even, linear thinning head -> tip
    alphaTaperPower: 1.2, // lower = tail stays visible longer
    minWidth: 0.1, // tip almost comes to a point

    coreSize: 6.5,
    coreGlow: 30,
  };

  // Track raw mouse position
  useEffect(() => {
    if (prefersReduced || isTouch) return;
    const onMouseMove = (e: MouseEvent) => {
      cursor.current.targetX = e.clientX;
      cursor.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [prefersReduced, isTouch]);

  // Resize canvas for the current DPR
  useEffect(() => {
    if (prefersReduced || isTouch) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, [prefersReduced, isTouch]);

  // Main animation loop
  useEffect(() => {
    if (prefersReduced || isTouch) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const animate = () => {
      const now = performance.now();
      lastFrameTime.current = now;

      // --- Smooth cursor follow ---
      const dx = cursor.current.targetX - cursor.current.x;
      const dy = cursor.current.targetY - cursor.current.y;
      const dist = Math.hypot(dx, dy);
      const ease = CONFIG.lerp * (1 + Math.min(2, dist / 60));
      cursor.current.x += dx * ease;
      cursor.current.y += dy * ease;
      cursor.current.speed = dist;

      // --- Record trail history (this is the beam's backbone) ---
      trail.current.unshift({ x: cursor.current.x, y: cursor.current.y, timestamp: now });
      trail.current = trail.current.filter((p) => now - p.timestamp < CONFIG.trailPointLifeMs);
      if (trail.current.length > CONFIG.trailMaxPoints) {
        trail.current.length = CONFIG.trailMaxPoints;
      }

      // --- Clear frame ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      // --- Draw the single tapered shooting-star beam ---
      const pts = trail.current;
      const n = pts.length;
      if (n > 2) {
        const speedBoost = Math.min(1.7, 0.65 + cursor.current.speed / 55);

        for (let i = 0; i < n - 1; i++) {
          const p = pts[i];
          const prev = pts[Math.max(0, i - 1)];
          const next = pts[i + 1];
          const t = i / (n - 1); // 0 at the bright head, 1 at the tail tip

          const age = now - p.timestamp;
          const ageFade = Math.max(0, 1 - age / CONFIG.trailPointLifeMs);
          const widthTaper = Math.pow(1 - t, CONFIG.widthTaperPower);
          const alphaTaper = Math.pow(1 - t, CONFIG.alphaTaperPower);

          const width = Math.max(CONFIG.minWidth, CONFIG.beamMaxWidth * speedBoost * widthTaper);
          const alpha = Math.max(0, alphaTaper * ageFade * 0.95);
          if (alpha <= 0.012) continue;

          ctx.strokeStyle = beamColorAt(t, alpha);
          ctx.lineWidth = width;
          ctx.shadowColor = 'rgba(150, 220, 255, 0.85)';
          ctx.shadowBlur = CONFIG.beamGlowBlur * widthTaper;

          // Midpoint-to-midpoint curve keeps segments continuous
          const startX = i === 0 ? p.x : (prev.x + p.x) / 2;
          const startY = i === 0 ? p.y : (prev.y + p.y) / 2;
          const endX = (p.x + next.x) / 2;
          const endY = (p.y + next.y) / 2;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.quadraticCurveTo(p.x, p.y, endX, endY);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }

      // --- Bright head: soft bloom + sparkle flare ---
      const bloom = 0.85 + 0.15 * Math.sin(now * 0.006);
      const speedGlow = 0.85 + Math.min(0.6, cursor.current.speed / 90);
      const glowRadius = CONFIG.coreGlow * bloom * speedGlow;

      const glow = ctx.createRadialGradient(
        cursor.current.x,
        cursor.current.y,
        0,
        cursor.current.x,
        cursor.current.y,
        glowRadius
      );
      glow.addColorStop(0, 'rgba(255,255,255,0.95)');
      glow.addColorStop(0.25, 'rgba(180,228,255,0.55)');
      glow.addColorStop(1, 'rgba(120,200,250,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cursor.current.x, cursor.current.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      const coreRotation = now * 0.0015;
      drawSparkle(
        ctx,
        cursor.current.x,
        cursor.current.y,
        CONFIG.coreSize * bloom,
        coreRotation,
        1,
        'rgba(255,255,255,1)'
      );

      ctx.globalCompositeOperation = 'source-over';

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [prefersReduced, isTouch]);

  if (prefersReduced || isTouch) return null;

  const container = document.getElementById('cursor-trail-root');
  const canvasElem = (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        pointerEvents: 'none',
        touchAction: 'none',
      }}
      aria-hidden="true"
    />
  );

  return container ? createPortal(canvasElem, container) : canvasElem;
};