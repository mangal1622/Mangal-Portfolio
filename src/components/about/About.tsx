import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { ParticlePortrait } from './ParticlePortrait';
import { Particle } from '../../utils/particleUtils';
import { USER_PORTRAIT_PARTICLES } from '../../data/userPortraitData';
import { portfolioData } from '../../data/portfolioData';
import { soundFX } from '../../utils/soundEffects';
import { useHoverEffect } from '../../hooks/useHoverEffect';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [portraitSize, setPortraitSize] = useState({ w: 400, h: 480 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAssembling, setIsAssembling] = useState(false);
  const [assemblyProgress, setAssemblyProgress] = useState(1);
  const { personal } = portfolioData;

  // useScrollReveal('.about-reveal', {
  //   y: 50,
  //   duration: 1,
  //   stagger: 0.12,
  // });

  useScrollReveal('.about-stats', {
    y: 50,
    duration: 1,
    start: 'top 95%',
  });

  // Responsive size calculation
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rawW = containerRef.current.clientWidth;
        const w = rawW > 50 ? Math.min(rawW, 440) : 400;
        setPortraitSize({ w, h: Math.round(w * 1.22) });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const buildParticles = (w: number, h: number) => {
    const scaleX = w / 400;
    const scaleY = h / 480;

    // Sample every 2nd particle to reduce count by ~50% for performance
    const sampled = USER_PORTRAIT_PARTICLES.filter((_, i) => i % 2 === 0);

    return sampled.map((p) => {
      const px = p.x * scaleX;
      const py = p.y * scaleY;
      const scatterRadius = 160 + Math.random() * 220;
      const scatterAngle = Math.random() * Math.PI * 2;

      return new Particle({
        x: px + Math.cos(scatterAngle) * scatterRadius,
        y: py + Math.sin(scatterAngle) * scatterRadius,
        z: p.z,
        originX: px,
        originY: py,
        originZ: p.z,
        vx: 0,
        vy: 0,
        vz: 0,
        size: p.size,
        alpha: p.alpha,
        baseAlpha: p.alpha,
        color: p.isCyan ? '#00f0ff' : '#f0f9ff',
        isCyan: p.isCyan,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.01 + Math.random() * 0.02,
      });
    });
  };

  const triggerAssembly = () => {
    setIsAssembling(true);
    setAssemblyProgress(0);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 0.024;
      setAssemblyProgress(prog);
      if (prog >= 1) {
        clearInterval(interval);
        setIsAssembling(false);
        setAssemblyProgress(1);
      }
    }, 16);
  };

  // Initialize particles from Mangal's portrait data
  useEffect(() => {
    const pts = buildParticles(portraitSize.w, portraitSize.h);
    setParticles(pts);
    triggerAssembly();
  }, [portraitSize.w, portraitSize.h]);

  const handleReassemble = () => {
    soundFX.playScan();
    const pts = buildParticles(portraitSize.w, portraitSize.h);
    setParticles(pts);
    triggerAssembly();
  };

  return (
    <section id="about" className="relative py-8 lg:py-10 overflow-hidden scroll-mt-16 md:scroll-mt-20" aria-label="About section">
      {/* Subtle section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-border to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">

          {/* ── LEFT: Text Content ── */}
          <div className="space-y-8 lg:space-y-10">
            {/* Clean section label without numbering */}
            <div className="about-reveal flex items-center gap-3">
              <div className="w-5 h-px bg-cyber-cyan" />
              <span className="font-mono text-xs tracking-[0.35em] text-cyber-cyan uppercase">
                &#123; ABOUT &#125;
              </span>
            </div>

            {/* Headline */}
            <h2 
              className="about-reveal font-display font-bold leading-tight text-white tracking-wide !mt-3 lg:!mt-4"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}

            >
              A MIND  
              <span> </span>
              <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(0, 240, 255, 0.85)', 
                fontSize: '2rem',
               }}>
                 THAT BUILDS.
              </span>
            </h2>

            {/* Body */}
            <p className="about-reveal text-cyber-textMuted leading-relaxed text-sm lg:text-base max-w-lg !mt-4 lg:!mt-5">
              {personal.shortBio}
            </p>

            {/* Meta pillars */}
            <div className="about-reveal space-y-1.5 pt-2 !mt-4 lg:!mt-5">
              {personal.metaPillars.map((p) => (
                <div key={p} className="font-mono text-xs text-cyber-textDim tracking-wider hover:text-cyber-cyan transition-colors">
                  {p}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="about-reveal">
              <a
                href="#projects"
                onClick={() => soundFX.playClick()}
                onMouseEnter={() => soundFX.playHover()}
                className="inline-flex items-center gap-3 px-6 py-3 border border-cyber-border hover:border-cyber-cyan text-xs font-mono tracking-widest text-cyber-textMuted hover:text-cyber-cyan hover:bg-cyber-cyan/5 transition-all uppercase group"
              >
                <div ref={useHoverEffect({ scale: 1.04, offsetX: 2, offsetY: 0, duration: 0.15 })}
                  className="flex items-center gap-3"
                >
                  <span>EXPLORE WORK</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </a>
            </div>

            {/* Stats */}
            <div className="about-stats pt-8 border-t border-cyber-border/80 grid grid-cols-3 gap-8">
              <div className="group cursor-default">
                <div className="font-display text-3xl font-bold text-cyber-cyan glow-cyan-text group-hover:scale-105 transition-transform">
                  {personal.stats.experience}
                </div>
                <div className="font-mono text-[11px] tracking-wider text-cyber-textMuted uppercase mt-1">
                  Years<br />Experience
                </div>
              </div>
              <div className="group cursor-default">
                <div className="font-display text-3xl font-bold text-cyber-cyan glow-cyan-text group-hover:scale-105 transition-transform">
                  {personal.stats.projectsCount}
                </div>
                <div className="font-mono text-[11px] tracking-wider text-cyber-textMuted uppercase mt-1">
                  Projects<br />Built
                </div>
              </div>
              <div className="group cursor-default">
                <div className="font-display text-3xl font-bold text-cyber-cyan glow-cyan-text group-hover:scale-105 transition-transform">
                  {personal.stats.ideasCount}
                </div>
                <div className="font-mono text-[11px] tracking-wider text-cyber-textMuted uppercase mt-1">
                  Ideas In<br />Progress
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Mangal's Dynamic Particle Portrait ── */}
          <div className="flex flex-col items-center lg:items-end gap-4">
            <div
              ref={containerRef}
              className="relative w-full max-w-[410px] bg-cyber-bgLight/30 border border-cyber-border/60 rounded-sm overflow-hidden p-2"
              style={{ minHeight: portraitSize.h }}
            >
              {/* Corner Brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan z-20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan z-20 pointer-events-none" />

              {/* Ambient cyan glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 40%, rgba(0,240,255,0.08) 0%, transparent 75%)' }}
              />

              {/* HUD scan overlay label */}
              <div className="absolute top-4 left-4 z-20 font-mono text-[9px] tracking-widest text-cyber-cyan/80 flex items-center gap-2 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping" />
                <span>MANGAL // NEURAL_IDENTITY</span>
              </div>

              {/* Particle Portrait Canvas */}
              {particles.length > 0 && (
                <ParticlePortrait
                  particles={particles}
                  width={portraitSize.w}
                  height={portraitSize.h}
                  isAssembling={isAssembling}
                  assemblyProgress={assemblyProgress}
                />
              )}
            </div>

            {/* Interactive Portrait Controls */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleReassemble}
                className="flex items-center gap-2 text-xs font-mono text-cyber-textMuted hover:text-cyber-cyan border border-cyber-border hover:border-cyber-cyan/70 px-4 py-2 transition-all tracking-widest uppercase group cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 text-cyber-cyan" />
                <span>RE-ASSEMBLE PARTICLES</span>
              </button>
              
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
