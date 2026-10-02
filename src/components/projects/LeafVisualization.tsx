import React, { useEffect, useRef } from 'react';

export const LeafVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 320;
    const H = 420;
    canvas.width = W;
    canvas.height = H;

    let t = 0;

    const drawLeaf = () => {
      ctx.clearRect(0, 0, W, H);

      // LEFT HALF: Organic leaf with soft greens
      ctx.save();
      ctx.beginPath();
      // Leaf outline - top center to right then back
      ctx.moveTo(W / 2, 40);
      ctx.bezierCurveTo(W * 0.85, 90, W * 0.92, 200, W / 2, 380);
      ctx.bezierCurveTo(W / 2, 380, W / 2, 380, W / 2, 380);
      ctx.lineTo(W / 2, 40);
      ctx.clip();

      // Organic green fill gradient
      const leafGrad = ctx.createLinearGradient(W / 2, 40, W * 0.92, 300);
      leafGrad.addColorStop(0, 'rgba(34,197,94,0.75)');
      leafGrad.addColorStop(0.4, 'rgba(22,163,74,0.65)');
      leafGrad.addColorStop(1, 'rgba(15,118,55,0.55)');
      ctx.fillStyle = leafGrad;
      ctx.fillRect(W / 2, 40, W / 2, 380);

      // Leaf veins - right half
      ctx.strokeStyle = 'rgba(20,83,45,0.5)';
      ctx.lineWidth = 1;
      // Central vein
      ctx.beginPath();
      ctx.moveTo(W / 2, 40);
      ctx.quadraticCurveTo(W * 0.6, 200, W / 2, 380);
      ctx.stroke();
      // Side veins
      [100, 150, 200, 250, 300, 340].forEach((y) => {
        ctx.beginPath();
        ctx.moveTo(W / 2 + 8, y);
        ctx.quadraticCurveTo(W * 0.75, y - 10, W * 0.85, y - 25);
        ctx.strokeStyle = 'rgba(20,83,45,0.35)';
        ctx.stroke();
      });

      ctx.restore();

      // RIGHT HALF: Cyan digital wireframe neural mesh
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(W / 2, 40);
      ctx.bezierCurveTo(W * 0.15, 90, W * 0.08, 200, W / 2, 380);
      ctx.lineTo(W / 2, 40);
      ctx.clip();

      // Dark digital background
      ctx.fillStyle = 'rgba(4,7,13,0.85)';
      ctx.fillRect(0, 40, W / 2, 380);

      // Coordinate grid
      ctx.strokeStyle = 'rgba(0,240,255,0.12)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W / 2; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 40; y < 380; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W / 2, y); ctx.stroke();
      }

      // Neural connection lines
      const nodes: [number, number][] = [
        [80, 100], [55, 150], [70, 200], [90, 255], [75, 305],
        [45, 120], [100, 175], [60, 225], [85, 280], [50, 340],
        [30, 180], [110, 145], [35, 260],
      ];

      ctx.strokeStyle = `rgba(0,240,255,${0.15 + 0.08 * Math.sin(t)})`;
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i][0] - nodes[j][0];
          const dy = nodes[i][1] - nodes[j][1];
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i][0], nodes[i][1]);
            ctx.lineTo(nodes[j][0], nodes[j][1]);
            ctx.stroke();
          }
        }
      }

      // Neural nodes
      nodes.forEach(([nx, ny], idx) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + idx * 0.6);
        ctx.beginPath();
        ctx.arc(nx, ny, 2.5 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,240,255,${0.5 + 0.5 * pulse})`;
        ctx.fill();
      });

      // Scanning beam
      const scanY = 40 + ((t * 20) % 340);
      ctx.fillStyle = 'rgba(0,240,255,0.07)';
      ctx.fillRect(0, scanY, W / 2, 8);
      ctx.strokeStyle = 'rgba(0,240,255,0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(W / 2, scanY);
      ctx.stroke();

      ctx.restore();

      // Center divider line
      ctx.strokeStyle = 'rgba(0,240,255,0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(W / 2, 40);
      ctx.lineTo(W / 2, 380);
      ctx.stroke();

      // Leaf outline (both halves)
      ctx.strokeStyle = 'rgba(0,240,255,0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(W / 2, 40);
      ctx.bezierCurveTo(W * 0.85, 90, W * 0.92, 200, W / 2, 380);
      ctx.bezierCurveTo(W * 0.15, 320, W * 0.08, 200, W / 2, 40);
      ctx.stroke();

      t += 0.04;
      animRef.current = requestAnimationFrame(drawLeaf);
    };

    drawLeaf();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 320, height: 420 }}
      className="max-w-full"
      aria-label="Crop Health AI - leaf scan visualization"
    />
  );
};
