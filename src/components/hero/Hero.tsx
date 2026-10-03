import React, { useRef } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { ParticleGlobe } from './ParticleGlobe';
import { useMousePosition } from '../../hooks/useMousePosition';
import { soundFX } from '../../utils/soundEffects';
import { useHoverEffect } from '../../hooks/useHoverEffect';
import { useScrollReveal, useHeroParallax } from '../../hooks/useScrollReveal';

export const Hero: React.FC = () => {
  const { normalizedX, normalizedY } = useMousePosition();
  const sectionRef = useRef<HTMLElement>(null);

  useScrollReveal('.hero-reveal', {
    y: 60,
    duration: 0.8,
    stagger: 0.08,
    ease: 'power3.out',
  });

  useHeroParallax('.hero-parallax-globe', {
    yPercent: 20,
    mobileYPercent: 6,
  });

  const scrollToNext = () => {
    soundFX.playClick();
    const aboutEl = document.getElementById('about');
    aboutEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[calc(100vh-4rem)] md:min-h-screen flex items-center overflow-visible pt-20 sm:pt-24 md:pt-0"
      aria-label="Hero section"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 md:gap-8 lg:gap-4 items-center min-h-[50vh] md:min-h-[75vh]">

          {/* ── LEFT: Text Content ── */}
        <div className="flex-1 space-y-4 lg:space-y-9">
          {/* Technical badge */}
          <div className="hero-reveal flex items-center gap-3">
            <div className="w-5 h-px bg-cyber-cyan" />
            <span className="font-mono text-xs tracking-[0.35em] text-cyber-cyan uppercase flex items-center gap-2">
              <span>&#123; SOFTWARE DEVELOPER &#125;</span>
              <Sparkles className="w-3 h-3 text-cyber-cyan/60 animate-pulse" />
            </span>
          </div>

          {/* Large MANGAL PANDEY heading */}
          <div className="hero-reveal">
            <h1 
              className="font-display font-bold tracking-[0.08em] uppercase leading-none select-none"
              style={{ fontSize: 'clamp(2.8rem, 7.5vw, 6.2rem)', lineHeight: 0.95 }}
            >
              <span className="text-white block hover:text-cyber-cyan transition-colors duration-300">
                MANGAL
              </span>
              <span
                className="block text-transparent"
                style={{
                  WebkitTextStroke: '1.5px rgba(0, 240, 255, 0.85)',
                  filter: 'drop-shadow(0 0 24px rgba(0, 240, 255, 0.45))',
                }}
              >
                PANDEY
              </span>
            </h1>
          </div>

          {/* Tagline */}
          <div className="hero-reveal space-y-1.5 pl-1">
            <p className="font-mono text-sm lg:text-base tracking-[0.2em] text-white uppercase font-medium">
              BUILDING INTELLIGENT
            </p>
            <p className="font-mono text-sm lg:text-base tracking-[0.2em] text-cyber-cyan uppercase font-light">
              SYSTEMS FOR A BETTER TOMORROW
            </p>
          </div>

          {/* Scroll indicator - hidden on mobile */}
          <div className="hero-reveal pt-6 hidden md:flex">
            <button
              onClick={scrollToNext}
              onMouseEnter={() => soundFX.playHover()}
              className="flex items-center gap-4 text-cyber-textMuted hover:text-cyber-cyan transition-colors group cursor-pointer"
              aria-label="Scroll to explore"
            >
              <div ref={useHoverEffect({ scale: 1.03, offsetX: 2, offsetY: 0, duration: 0.15 })}>
                {/* Animated mouse wireframe */}
                <div className="relative w-6 h-10 border border-cyber-cyan/50 rounded-full flex items-start justify-center pt-1.5 group-hover:border-cyber-cyan transition-colors shadow-cyan-sm">
                  <div className="w-1 h-2 bg-cyber-cyan rounded-full animate-bounce" />
                </div>
                <br></br>
                <ChevronDown className="w-5 h-4 animate-bounce text-cyber-cyan" />
              </div>
            </button>
          </div>
        </div>

          {/* ── RIGHT: 3D Particle Globe ── */}
          <div className="hero-parallax-globe relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-none h-[400px] sm:h-[480px] md:h-[440px] lg:h-[710px] mx-auto lg:mx-0 flex items-center justify-center lg:w-[120%] lg:-ml-[10%]">
            {/* Subtle ambient glow behind globe */}
            <div
              className="hero-parallax-globe absolute inset-0 rounded-full opacity-35 blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.4) 0%, transparent 65%)' }}
            />
            <ParticleGlobe mouseX={normalizedX} mouseY={normalizedY} />

            {/* Technical micro-labels around the globe */}
            <div className="hero-parallax-globe absolute bottom-[120px] right-[60px] text-right space-y-1.5 pointer-events-none">
              {['IDEAS', 'CODE', 'EXPERIMENTS', 'REAL IMPACT'].map((t) => (
                <div key={t} className="font-mono text-[10px] tracking-[0.25em] text-cyber-textDim hover:text-cyber-cyan transition-colors">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(4,7,13,0.95), transparent)' }}
      />
    </section>
  );
};
