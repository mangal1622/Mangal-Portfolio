import React, { useState } from 'react';
import { ExternalLink, Code2, Terminal } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
// import { ProjectNetworkGraph } from './ProjectNetworkGraph';
import { soundFX } from '../../utils/soundEffects';
import { useHoverEffect } from '../../hooks/useHoverEffect';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const Projects: React.FC = () => {
  useScrollReveal('.projects-reveal', {
    y: 50,
    duration: 0.7,
    stagger: 0.06,
    ease: 'power3.out',
  });
  const [selectedId, setSelectedId] = useState('crop-health-ai');
  const { projects } = portfolioData;

  const selected = projects.find(p => p.id === selectedId) || projects[0];

  const handleSelectProject = (id: string) => {
    soundFX.playClick();
    setSelectedId(id);
  };

  return (
    <section id="projects" className="relative py-8 lg:py-12 overflow-hidden scroll-mt-16 md:scroll-mt-20" aria-label="Projects section">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-border to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 md:space-y-16">
        {/* Top Split: Intro & Interactive Network Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT: Text & Project Overview */}
          <div className="space-y-7">
            {/* Section label without numbering */}
            <div className="projects-reveal flex items-center gap-3">
              <div className="w-4 h-px bg-cyber-cyan" />
              <span className="font-mono text-xs tracking-[0.35em] text-cyber-cyan uppercase">
                &#123; PROJECTS &#125;
              </span>
            </div>

            <div className="projects-reveal space-y-1 font-mono text-[11px] text-cyber-textDim tracking-wider">
              <div>// IDEAS TO</div>
              <div className="text-cyber-cyan">// REALITY</div>
            </div>

            <h2
              className="projects-reveal font-display font-bold text-white leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)', lineHeight: 0.7 }}
            >
              PROJECTS<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(0, 240, 255, 0.85)', fontSize: '2rem', }}>
                THAT CREATE IMPACT.
              </span>
            </h2>

            <p className="projects-reveal text-cyber-textMuted text-sm leading-relaxed max-w-md">
              A collection of things I've built, explored, and shipped. Each project is a step towards a smarter, more connected future.
            </p>

            {/* Quick interactive project selector pills */}
            <div className="projects-reveal pt-2">
              <p className="font-mono text-[10px] text-cyber-textDim uppercase tracking-widest mb-3 flex items-center gap-2">
                <Terminal className="w-3 h-3 text-cyber-cyan" />
                <span>SELECT SYSTEM NODE:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {projects.map((p) => {
                  const isActive = p.id === selectedId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectProject(p.id)}
                      onMouseEnter={() => soundFX.playHover()}
                      className={`px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                        isActive
                          ? 'border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan shadow-cyan-sm font-semibold'
                          : 'border-cyber-border text-cyber-textMuted hover:border-cyber-cyan/50 hover:text-white'
                      }`}
                    >
                      <div ref={useHoverEffect({ scale: 1.04, offsetX: 2, offsetY: 0, duration: 0.1 })}>
                        {p.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Square Project Card */}
          <div className="projects-reveal relative flex items-center justify-center">

            {/* Ambient glow */}
            <div
              className="absolute w-[360px] h-[360px] rounded-full opacity-20 pointer-events-none blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(0,240,255,0.45) 0%, transparent 70%)',
              }}
            />

            {/* Square project card */}
            <div className="relative w-full max-w-[min(100%,390px)] aspect-square border border-cyber-cyan/40 bg-cyber-bgLight/50 backdrop-blur-md rounded-sm overflow-hidden shadow-cyan-sm">

              {/* Cyber corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan z-10" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan z-10" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan z-10" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan z-10" />

              {/* Background grid */}
              <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

              {/* Card content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-5 md:p-7 min-w-0">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-cyber-cyan uppercase">
                    {selected.category}
                  </span>

                  <span className="font-mono text-[9px] tracking-widest text-cyber-textDim uppercase">
                    PROJECT // 0{projects.findIndex(p => p.id === selected.id) + 1}
                  </span>
                </div>

                {/* Center */}
                <div className="space-y-5">

                  {/*Logo*/}
                  <div className="w-16 h-16 rounded-sm border border-cyber-cyan/50 bg-cyber-cyan/10 flex items-center justify-center shadow-cyan-sm overflow-hidden">
                    <img
                      src={selected.image}
                      alt={`${selected.title} logo`}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-12 h-12 flex items-center justify-center font-mono text-[10px] text-cyber-cyan border border-cyber-cyan/30 rounded-sm">
                      {selected.title.charAt(0)}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white uppercase tracking-wide break-words">
                      {selected.title}
                    </h3>

                    <p className="mt-2 font-mono text-[10px] tracking-[0.15em] text-cyber-textDim uppercase">
                      {selected.subtitle}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 min-w-0">
                    {selected.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[9px] tracking-wider text-cyber-cyan border border-cyber-cyan/30 px-2 py-1 uppercase bg-cyber-cyan/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="font-mono text-[11px] leading-relaxed text-cyber-textMuted min-h-[2.5rem]">
                    {selected.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap pt-2">
                  {selected.liveUrl && (
                    <a
                      href={selected.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundFX.playClick()}
                      className="flex items-center gap-2 px-4 py-2.5 border border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan hover:bg-cyber-cyan hover:text-black text-[10px] font-mono tracking-widest uppercase transition-all group"
                    >
                      <div
                        ref={useHoverEffect({
                          scale: 1.05,
                          offsetX: 2,
                          offsetY: 0,
                          duration: 0.15,
                        })}
                        className="flex items-center gap-2"
                      >
                        <span>VIEW LIVE</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      </div>
                    </a>
                  )}

                  {selected.githubUrl && (
                    <a
                      href={selected.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundFX.playClick()}
                      className="flex items-center gap-2 px-4 py-2.5 border border-cyber-border hover:border-cyber-cyan/70 text-cyber-textMuted hover:text-white text-[10px] font-mono tracking-widest uppercase transition-all group"
                    >
                      <div
                        ref={useHoverEffect({
                          scale: 1.05,
                          offsetX: 2,
                          offsetY: 0,
                          duration: 0.15,
                        })}
                        className="flex items-center gap-2"
                      >
                        <span>VIEW CODE</span>
                        <Code2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      </div>
                    </a>
                  )}
                </div>    

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-cyber-border/60 pt-4">

                  <span className="font-mono text-[9px] tracking-widest text-cyber-textDim uppercase">
                    {selected.id}
                  </span>

                  <span className="font-mono text-[9px] tracking-widest text-cyber-cyan uppercase">
                    ACTIVE
                  </span>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
