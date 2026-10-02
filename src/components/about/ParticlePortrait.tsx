import React, { useRef, useEffect, useCallback } from 'react';
import { Particle } from '../../utils/particleUtils';

interface ParticlePortraitProps {
  particles: Particle[];
  width: number;
  height: number;
  isAssembling?: boolean;
  assemblyProgress?: number; // 0 to 1
}

export const ParticlePortrait: React.FC<ParticlePortraitProps> = ({
  particles,
  width,
  height,
  isAssembling = false,
  assemblyProgress = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const timeRef = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: null, y: null };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const render = () => {
      timeRef.current += 1;
      const t = timeRef.current;

      ctx.clearRect(0, 0, width, height);

      // Subtle ambient cyan vignette on the portrait
      const grad = ctx.createRadialGradient(
        width * 0.5, height * 0.45, 0,
        width * 0.5, height * 0.45, width * 0.65
      );
      grad.addColorStop(0, 'rgba(0,240,255,0.03)');
      grad.addColorStop(1, 'rgba(4,7,13,0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Scanning beam
      const scanY = ((t * 1.2) % (height + 30)) - 15;
      ctx.fillStyle = 'rgba(0,240,255,0.04)';
      ctx.fillRect(0, scanY, width, 10);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // During assembly, particles fly into position based on progress
        let effectiveProgress = assemblyProgress;
        if (isAssembling) {
          // Each particle has a staggered reveal threshold
          const particleThreshold = (i / particles.length) * 0.6;
          effectiveProgress = Math.max(0, Math.min(1, (assemblyProgress - particleThreshold) / 0.4));
        }

        // Interpolate between scatter position and origin
        const drawX = isAssembling
          ? p.x + (p.originX - p.x) * effectiveProgress
          : p.x;
        const drawY = isAssembling
          ? p.y + (p.originY - p.y) * effectiveProgress
          : p.y;

        if (!isAssembling) {
          p.update(mouseRef.current.x, mouseRef.current.y, 80, 3.5, 0.07, 0.85, t * 0.05);
        }

        const alpha = isAssembling
          ? p.alpha * effectiveProgress
          : p.alpha * (0.85 + 0.15 * Math.sin(t * p.driftSpeed + p.driftPhase));

        // Depth scale from z
        const depthScale = 1.0 + (p.originZ / 60);
        const drawSize = p.size * depthScale;

        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

        if (p.isCyan) {
          // Glow for cyan particles
          const grd = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawSize * 2.5);
          grd.addColorStop(0, `rgba(0,240,255,${Math.min(0.9, alpha)})`);
          grd.addColorStop(1, 'rgba(0,240,255,0)');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(drawX, drawY, drawSize * 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#00f0ff';
        } else {
          ctx.fillStyle = '#e0f0ff';
        }

        ctx.beginPath();
        ctx.arc(drawX, drawY, drawSize * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animRef.current);
  }, [particles, width, height, isAssembling, assemblyProgress]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="max-w-full cursor-crosshair"
      aria-label="Interactive particle portrait - move your mouse to interact"
    />
  );
};
