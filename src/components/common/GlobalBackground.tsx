import React, { useEffect, useRef } from 'react';

export const GlobalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = (canvas.width = window.innerWidth * dpr);
    let height = (canvas.height = window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Micro stars / cyber dust
    const count = 30;
    const stars: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.15 + 0.05,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < count; i++) {
        const s = stars[i];
        s.y -= s.speed;
        if (s.y < 0) {
          s.y = height;
          s.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(0, 240, 255, ${s.alpha})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-cyber-bg">
      {/* Subtle cyan atmospheric glow spots */}
      <div 
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 blur-[140px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.4) 0%, rgba(4,7,13,0) 70%)' }}
      />
      <div 
        className="absolute top-1/3 -right-40 w-[700px] h-[700px] rounded-full opacity-15 blur-[160px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,180,216,0.35) 0%, rgba(4,7,13,0) 70%)' }}
      />
      <div 
        className="absolute -bottom-40 left-1/3 w-[800px] h-[800px] rounded-full opacity-15 blur-[180px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.25) 0%, rgba(4,7,13,0) 70%)' }}
      />

      {/* Cyber grid lines */}
      <div className="absolute inset-0 cyber-grid opacity-60" />

      {/* Subtle CRT scanline overlay */}
      <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />

      {/* Ambient micro-particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
    </div>
  );
};
