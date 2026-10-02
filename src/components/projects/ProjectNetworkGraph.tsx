import React, { useRef, useEffect, useState } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { soundFX } from '../../utils/soundEffects';

interface ProjectNetworkGraphProps {
  onProjectSelect: (id: string) => void;
  selectedId: string;
}

interface NodeData {
  id: string;
  label: string;
  sub: string;
  angle: number;
  radius: number;
}

export const ProjectNetworkGraph: React.FC<ProjectNetworkGraphProps> = ({
  onProjectSelect,
  selectedId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const hoveredRef = useRef<string | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<{ id: string; label: string; sub: string; x: number; y: number } | null>(null);

  const projects = portfolioData.projects;

  const getNodes = (cx: number, cy: number): NodeData[] => {
    return projects.map((p, i) => {
      const angle = (i / projects.length) * Math.PI * 2 - Math.PI / 2;
      const radius = Math.min(cx, cy) * 0.68;
      return {
        id: p.id,
        label: p.title,
        sub: p.subtitle,
        angle,
        radius,
      };
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = canvas.parentElement?.clientWidth || 500;
    let H = canvas.parentElement?.clientHeight || 420;

    const resize = () => {
      W = canvas.parentElement?.clientWidth || 500;
      H = canvas.parentElement?.clientHeight || 420;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
    };
    resize();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cx = W / 2;
      const cy = H / 2;
      const nodes = getNodes(cx, cy);
      for (const node of nodes) {
        const nx = cx + Math.cos(node.angle) * node.radius;
        const ny = cy + Math.sin(node.angle) * node.radius;
        const dist = Math.sqrt((mx - nx) ** 2 + (my - ny) ** 2);
        if (dist < 40) {
          soundFX.playClick();
          onProjectSelect(node.id);
        }
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('click', handleClick);
    window.addEventListener('resize', resize, { passive: true });

    let t = 0;

    const render = () => {
      animRef.current = requestAnimationFrame(render);
      t += 0.015;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const nodes = getNodes(cx, cy);

      // Detect hover
      let newHovered: string | null = null;
      for (const node of nodes) {
        const nx = cx + Math.cos(node.angle) * node.radius;
        const ny = cy + Math.sin(node.angle) * node.radius;
        const dist = Math.sqrt((mouseRef.current.x - nx) ** 2 + (mouseRef.current.y - ny) ** 2);
        if (dist < 42) {
          newHovered = node.id;
          break;
        }
      }

      if (newHovered !== hoveredRef.current) {
        hoveredRef.current = newHovered;
        if (newHovered) {
          const node = nodes.find(n => n.id === newHovered);
          if (node) {
            const nx = cx + Math.cos(node.angle) * node.radius;
            const ny = cy + Math.sin(node.angle) * node.radius;
            setTooltip({ id: node.id, label: node.label, sub: node.sub, x: nx, y: ny });
            soundFX.playHover();
          }
        } else {
          setTooltip(null);
        }
      }

      // Draw connecting lines
      for (const node of nodes) {
        const nx = cx + Math.cos(node.angle) * node.radius;
        const ny = cy + Math.sin(node.angle) * node.radius;
        const isActive = node.id === selectedId || node.id === hoveredRef.current;

        // Pulse animation along line
        const pulsePct = ((t * 0.8 + node.angle) % (Math.PI * 2)) / (Math.PI * 2);
        const pulseX = cx + (nx - cx) * pulsePct;
        const pulseY = cy + (ny - cy) * pulsePct;

        // Connecting line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.strokeStyle = isActive ? 'rgba(0,240,255,0.6)' : 'rgba(0,180,216,0.2)';
        ctx.lineWidth = isActive ? 1.5 : 1;
        ctx.stroke();

        if (isActive) {
          // Pulsing dot traveling along the line
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,240,255,0.9)';
          ctx.fill();
        }
      }

      // Center glowing core
      const coreRadius = 28 + Math.sin(t * 2) * 3;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 3);
      coreGrad.addColorStop(0, 'rgba(0,240,255,0.55)');
      coreGrad.addColorStop(0.4, 'rgba(0,200,230,0.25)');
      coreGrad.addColorStop(1, 'rgba(0,240,255,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 3, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,240,255,0.2)';
      ctx.strokeStyle = 'rgba(0,240,255,0.8)';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      // Orbital rings around center
      [50, 70].forEach((r, i) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r + Math.sin(t + i) * 2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,240,255,${0.12 - i * 0.04})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Project nodes
      for (const node of nodes) {
        const nx = cx + Math.cos(node.angle) * node.radius;
        const ny = cy + Math.sin(node.angle) * node.radius;
        const isActive = node.id === selectedId;
        const isHovered = node.id === hoveredRef.current;
        const nodeR = 20 + (isActive || isHovered ? 6 : 0) + Math.sin(t + node.angle) * 1.5;

        // Node glow
        if (isActive || isHovered) {
          const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, nodeR * 2.5);
          glow.addColorStop(0, 'rgba(0,240,255,0.4)');
          glow.addColorStop(1, 'rgba(0,240,255,0)');
          ctx.beginPath();
          ctx.arc(nx, ny, nodeR * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Node body
        ctx.beginPath();
        ctx.arc(nx, ny, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? 'rgba(0,240,255,0.25)' : 'rgba(6,11,20,0.9)';
        ctx.strokeStyle = isActive || isHovered ? 'rgba(0,240,255,0.9)' : 'rgba(0,180,216,0.4)';
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.fill();
        ctx.stroke();

        // Project initial letter
        ctx.fillStyle = isActive || isHovered ? '#00f0ff' : '#788ea6';
        ctx.font = `bold ${11}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label.charAt(0), nx, ny);

        // Label below node
        ctx.fillStyle = isActive || isHovered ? '#e2f8ff' : '#42556b';
        ctx.font = `${9}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const labelMaxW = 80;
        let label = node.label;
        if (ctx.measureText(label).width > labelMaxW) {
          // Truncate long names
          while (ctx.measureText(label + '...').width > labelMaxW && label.length > 0) {
            label = label.slice(0, -1);
          }
          label += '...';
        }
        ctx.fillText(label, nx, ny + nodeR + 5);
        ctx.fillStyle = '#42556b';
        ctx.font = `${8}px 'JetBrains Mono', monospace`;
        ctx.fillText(node.sub, nx, ny + nodeR + 15);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resize);
    };
  }, [selectedId]); // eslint-disable-line

  return (
    <div className="relative w-full h-[360px] sm:h-[420px]">
      <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />
      {tooltip && (
        <div
          className="absolute pointer-events-none font-mono text-[10px] text-cyber-cyan bg-cyber-bgLight/80 border border-cyber-cyan/30 px-3 py-1.5 rounded-sm tracking-wider"
          style={{
            left: Math.min(tooltip.x + 20, 200),
            top: tooltip.y - 30,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="text-cyber-cyan uppercase font-semibold">{tooltip.label}</div>
          <div className="text-cyber-textDim">{tooltip.sub}</div>
        </div>
      )}
    </div>
  );
};
