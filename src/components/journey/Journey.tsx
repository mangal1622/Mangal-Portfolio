import React, { useState } from 'react';

import { portfolioData } from '../../data/portfolioData';
import { MountainHorizon } from './MountainHorizon';
import { soundFX } from '../../utils/soundEffects';
import { useHoverEffect } from '../../hooks/useHoverEffect';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const Journey: React.FC = () => {
  const { journey } = portfolioData;
  const [activeYear, setActiveYear] = useState<string>('2024');

  useScrollReveal('.journey-reveal', {
    y: 50,
    duration: 0.7,
    stagger: 0.06,
    ease: 'power3.out',
  });

  return (
    <section id="journey" className="relative pb-0 pt-8 lg:pt-12 overflow-hidden scroll-mt-16 md:scroll-mt-20" aria-label="Journey section">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-border to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">

          {/* ── LEFT: Typography & Intro ── */}
          <div className="space-y-8">
            {/* Section label without numbering */}
            <div className="journey-reveal flex items-center gap-3">
              <div className="w-4 h-px bg-cyber-cyan" />
              <span className="font-mono text-xs tracking-[0.35em] text-cyber-cyan uppercase">
                &#123; JOURNEY &#125;
              </span>
            </div>

            <h2
              className="journey-reveal font-display font-bold text-white leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)', lineHeight: 0.7 }}
            >
              A JOURNEY<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(0, 240, 255, 0.85)', fontSize: '2rem', }}>
                OF CONTINUOUS GROWTH.
              </span>
            </h2>

            <p className="journey-reveal text-cyber-textMuted text-sm leading-relaxed max-w-md">
              Learning, building, and evolving — one step at a time.
            </p>

            {/* <div>
              <a
                href="#contact"
                onClick={() => soundFX.playClick()}
                onMouseEnter={() => soundFX.playHover()}
                className="inline-flex items-center gap-3 px-6 py-3 border border-cyber-border hover:border-cyber-cyan text-xs font-mono tracking-widest text-cyber-textMuted hover:text-cyber-cyan hover:bg-cyber-cyan/5 transition-all uppercase group"
              >
                <span>MY FULL JOURNEY</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </a>
            </div> */}

            {/* Micro details */}
            {/* <div className="pt-4 border-t border-cyber-border/70 font-mono text-[11px] text-cyber-textDim space-y-1.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-cyber-cyan" />
                <span>EXPERIENCE // CHRONOLOGICAL SEQUENCE</span>
              </div>
              <div>LOCATION: INDIA // EXPANDING GLOBALLY</div>
            </div> */}
          </div>

          {/* ── RIGHT: Milestone Timeline (Always Fully Visible & Interactive) ── */}
          <div className="journey-reveal relative pl-6 sm:pl-8">
            {/* Continuous Vertical Glowing Circuit Line */}
            <div className="absolute left-1 sm:left-2 top-3 bottom-6 w-px bg-gradient-to-b from-cyber-cyan via-cyber-border to-transparent shadow-cyan-sm" />

            <div className="space-y-8">
              {journey.map((item) => {
                const isSelected = activeYear === item.year;

                return (
                  <div
                    key={item.year}
                    onClick={() => {
                      soundFX.playClick();
                      setActiveYear(item.year);
                    }}
                    onMouseEnter={() => {
                      soundFX.playHover();
                      setActiveYear(item.year);
                    }}
                    className={`journey-reveal relative group cursor-pointer transition-all duration-300 p-4 border rounded-sm ${
                      isSelected
                        ? 'border-cyber-cyan/60 bg-cyber-bgLight/70 shadow-cyan-sm translate-x-1'
                        : 'border-transparent hover:border-cyber-border hover:bg-cyber-bgLight/30'
                    }`}
                  >
                    {/* Glowing Milestone Node on Circuit Line */}
                    <div
                      className={`absolute -left-[29px] sm:-left-[33px] top-5 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                        isSelected
                          ? 'bg-cyber-cyan border-white shadow-cyan-md scale-125'
                          : 'bg-cyber-bg border-cyber-border group-hover:border-cyber-cyan'
                      }`}
                    />

                    {/* Milestone Year Header */}
                    <div className="flex items-baseline gap-3 mb-1.5">
                      <span className={`font-mono text-base font-bold tracking-wider transition-colors ${
                        isSelected ? 'text-cyber-cyan' : 'text-cyber-textMuted'
                      }`}>
                        {item.year}
                      </span>
                      {item.period && (
                        <span className="font-mono text-[10px] text-cyber-cyan/80 tracking-widest uppercase border border-cyber-cyan/30 px-1.5 py-0.2 rounded-xs">
                          {item.period}
                        </span>
                      )}
                    </div>

                    {/* Milestone Title */}
                    <h3 className={`font-display text-lg font-bold tracking-wide transition-colors ${
                      isSelected ? 'text-white' : 'text-cyber-text'
                    }`}>
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-cyber-textMuted text-xs leading-relaxed mt-1.5">
                      {item.description}
                    </p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className={`font-mono text-[9px] tracking-wider px-2 py-0.5 uppercase border transition-colors ${
                            isSelected
                              ? 'border-cyber-cyan/40 text-cyber-cyan bg-cyber-cyan/5'
                              : 'border-cyber-border text-cyber-textDim'
                          }`}
                        >
                          <div ref={useHoverEffect({ scale: 1.03, offsetX: 1, offsetY: 0, duration: 0.1 })}>
                            {skill}
                          </div>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Cinematic Full-Width Mountain Horizon Bottom (Panel 06 visual) */}
      <div className="mt-16 w-full">
        <MountainHorizon />
      </div>
    </section>
  );
};
