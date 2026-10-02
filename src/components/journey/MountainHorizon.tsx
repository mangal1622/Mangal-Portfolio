import React, { useEffect, useRef } from 'react';

export const MountainHorizon: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    const H = (canvas.height = 240);

    const handleResize = () => {
      if (!canvas) return;
      W = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = H;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Generate mountains
    const generatePeaks = (pointsCount: number, baseY: number, roughness: number, seed: number) => {
      const pts: [number, number][] = [];
      for (let i = 0; i <= pointsCount; i++) {
        const x = (i / pointsCount) * W;
        const n = Math.sin((i + seed) * 1.7) * roughness 
                + Math.cos((i * 2.3 + seed)) * (roughness * 0.6)
                + Math.sin(i * 0.4 + seed) * (roughness * 1.2);
        pts.push([x, baseY - Math.abs(n)]);
      }
      return pts;
    };

    let farPeaks = generatePeaks(80, H * 0.68, 38, 4);
    let midPeaks = generatePeaks(65, H * 0.78, 28, 9);
    let nearPeaks = generatePeaks(50, H * 0.88, 18, 15);

    let t = 0;

    const render = () => {
      t += 0.01;
      ctx.clearRect(0, 0, W, H);

      // Sky gradient - dark blue-black with subtle atmospheric glow
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, 'rgba(4, 7, 13, 1)');
      skyGrad.addColorStop(0.6, 'rgba(6, 14, 25, 0.95)');
      skyGrad.addColorStop(0.85, 'rgba(0, 30, 48, 0.9)');
      skyGrad.addColorStop(1, 'rgba(4, 7, 13, 1)');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Twinkling stars in sky
      const starsCount = 20;
      for (let i = 0; i < starsCount; i++) {
        const sx = ((i * 137.5) % W);
        const sy = ((i * 83.2) % (H * 0.65));
        const blink = 0.3 + 0.7 * Math.sin(t * 1.5 + i);
        ctx.fillStyle = `rgba(0, 240, 255, ${Math.max(0.1, blink * 0.6)})`;
        ctx.fillRect(sx, sy, 1.2, 1.2);
      }

      // Far Mountain Layer (dark desaturated blue-gray)
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.lineTo(0, farPeaks[0][1]);
      for (let i = 1; i < farPeaks.length; i++) {
        ctx.lineTo(farPeaks[i][0], farPeaks[i][1]);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = '#060f1b';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Mid Mountain Layer
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.lineTo(0, midPeaks[0][1]);
      for (let i = 1; i < midPeaks.length; i++) {
        ctx.lineTo(midPeaks[i][0], midPeaks[i][1]);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = '#040b14';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.28)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Near Sharp Ridge (almost black with electric cyan rim)
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.lineTo(0, nearPeaks[0][1]);
      for (let i = 1; i < nearPeaks.length; i++) {
        ctx.lineTo(nearPeaks[i][0], nearPeaks[i][1]);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = '#02050a';
      ctx.fill();

      // Glowing electric cyan horizon crest
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.6;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Solitary Traveler Silhouette on right mountain peak (matching panel 06)
      const travelerX = W * 0.88;
      // find Y on nearPeaks near travelerX
      const peakIdx = Math.round((0.88) * (nearPeaks.length - 1));
      const peakY = nearPeaks[peakIdx] ? nearPeaks[peakIdx][1] : H * 0.82;
      const sY = peakY - 1;

      // Small cyan aura at traveler's feet
      const footAura = ctx.createRadialGradient(travelerX, sY, 0, travelerX, sY, 14);
      footAura.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
      footAura.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = footAura;
      ctx.beginPath();
      ctx.ellipse(travelerX, sY, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sharp human silhouette
      ctx.fillStyle = '#02050a';
      // Head
      ctx.beginPath();
      ctx.arc(travelerX, sY - 20, 3.5, 0, Math.PI * 2);
      ctx.fill();
      // Body / Jacket
      ctx.beginPath();
      ctx.moveTo(travelerX - 4, sY - 16);
      ctx.lineTo(travelerX + 4, sY - 16);
      ctx.lineTo(travelerX + 3, sY - 6);
      ctx.lineTo(travelerX - 3, sY - 6);
      ctx.closePath();
      ctx.fill();
      // Legs
      ctx.fillRect(travelerX - 3, sY - 6, 2.5, 7);
      ctx.fillRect(travelerX + 0.5, sY - 6, 2.5, 7);

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[240px] block" aria-hidden="true" />
    </div>
  );
};
