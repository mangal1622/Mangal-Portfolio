import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Terminal } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import { soundFX } from '../../utils/soundEffects';
import { useScrollReveal } from '../../hooks/useScrollReveal';

// High-fidelity SVG logos for the tech stack
const TechLogo: React.FC<{ name: string; className?: string }> = ({ name, className = "w-6 h-6" }) => {
  const lc = name.toLowerCase();

  if (lc === 'python') return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M11.97 2C8.88 2 7 3.4 7 5.58v1.67h5v.83H4.92C3.1 8.08 2 9.82 2 12.16c0 2.44 1.27 4.08 3.67 4.08H7v-2.08C7 12.08 8.97 10.83 11 10.83h4c2.23 0 4-1.73 4-3.92V5.92C19 3.6 16.98 2 14 2h-2.03zM9.83 4.5a.83.83 0 110 1.66.83.83 0 010-1.66z" fill="#387eb8"/>
      <path d="M12.03 22c3.09 0 4.97-1.4 4.97-3.58v-1.67h-5v-.83h8.08C21.9 15.92 23 14.18 23 11.84c0-2.44-1.27-4.08-3.67-4.08H18v2.08c0 2.08-1.97 3.33-4 3.33h-4C7.77 13.17 6 14.9 6 17.08v2c0 2.32 2.02 2.92 5 2.92h1.03zM14.17 19.5a.83.83 0 110-1.66.83.83 0 010 1.66z" fill="#ffe052"/>
    </svg>
  );

  if (lc === 'react') return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="2.5" fill="#00d8ff"/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#00d8ff" strokeWidth="1.2" fill="none"/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#00d8ff" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#00d8ff" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)"/>
    </svg>
  );

  if (lc === 'next.js' || lc === 'nextjs') return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="10" fill="#000" stroke="#00f0ff" strokeWidth="0.8"/>
      <path d="M7 7.5V16.5L16.5 7.5V16.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  if (lc === 'mongodb') return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 2C12 2 7 8.5 7 13.5C7 16.54 9.24 19 12 19C14.76 19 17 16.54 17 13.5C17 8.5 12 2 12 2Z" fill="#13aa52"/>
      <path d="M12 2C12 2 11.5 8 11.5 13.5C11.5 17 12 19 12 19" stroke="#fff" strokeWidth="0.8"/>
    </svg>
  );

  if (lc === 'aws') return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <text x="3" y="14" fontSize="8.5" fill="#ff9900" fontWeight="bold" fontFamily="sans-serif">aws</text>
      <path d="M3 17C7 20 17 20 21 16" stroke="#ff9900" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );

  if (lc === 'figma') return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="7" y="2" width="5" height="5" rx="2.5" fill="#f24e1e"/>
      <rect x="12" y="2" width="5" height="5" rx="2.5" fill="#ff7262"/>
      <rect x="7" y="7" width="5" height="5" rx="2.5" fill="#a259ff"/>
      <circle cx="14.5" cy="9.5" r="2.5" fill="#1abcfe"/>
      <rect x="7" y="12" width="5" height="5" rx="2.5" fill="#0acf83"/>
    </svg>
  );

  if (lc === 'gsap') return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="10" fill="#06120a" stroke="#0ae448" strokeWidth="1"/>
      <text x="5" y="15" fontSize="7" fill="#0ae448" fontWeight="bold" fontFamily="monospace">GSAP</text>
    </svg>
  );

  if (lc === 'tailwind') return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 6C9.33 6 7.67 7.33 7 10c1-1.33 2.17-1.83 3.5-1.5C11.24 8.72 11.87 9.38 12.57 10.11C13.73 11.31 15.1 12.67 18 12.67c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-0.74-0.22-1.37-0.88-2.07-1.61C16.27 7.36 14.9 6 12 6ZM7 12.67c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.74.22 1.37.88 2.07 1.61C8.73 17.98 10.1 19.33 13 19.33c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.74-.22-1.37-.88-2.07-1.61C11.27 14.02 9.9 12.67 7 12.67Z" fill="#38bdf8"/>
    </svg>
  );

  return (
    <div className="w-6 h-6 flex items-center justify-center font-bold text-cyber-cyan font-mono text-xs">
      {name.charAt(0)}
    </div>
  );
};

export const TechStack: React.FC = () => {
  const [hoveredTech, setHoveredTech] = useState<string | null>('React');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const [isAutoSwitching, setIsAutoSwitching] = useState(true);
  const { technologies } = portfolioData;

  useScrollReveal('.techstack-reveal', {
    y: 50,
    duration: 1,
    stagger: 0.12,
    ease: 'power3.out',
  });

  // Ordered techs definition (auto-switch) - memoized for stable reference
  const orderedTechs = useMemo(() => [
    technologies.find(t => t.name === 'React') || technologies[1],
    technologies.find(t => t.name === 'Next.js') || technologies[2],
    technologies.find(t => t.name === 'AWS') || technologies[4],
    technologies.find(t => t.name === 'Tailwind') || technologies[7],
    technologies.find(t => t.name === 'GSAP') || technologies[6],
    technologies.find(t => t.name === 'Figma') || technologies[5],
    technologies.find(t => t.name === 'MongoDB') || technologies[3],
    technologies.find(t => t.name === 'Python') || technologies[0],
  ], []);

  // Gentle continuous orbital rotation
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 0.18) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isRotating]);

  // Automatic node switching every 7 seconds
  useEffect(() => {
    if (!isAutoSwitching) return;
    const interval = setInterval(() => {
      setHoveredTech(prev => {
        const currentIndex = orderedTechs.findIndex(t => t.name === prev);
        const nextIndex = (currentIndex + 1) % orderedTechs.length;
        return orderedTechs[nextIndex].name;
      });
    }, 7000);
    return () => clearInterval(interval);
  }, [orderedTechs, isAutoSwitching]);

  const activeTech = technologies.find(t => t.name === hoveredTech) || technologies[1];

  return (
    <section id="stack" className="relative py-8 lg:py-12 overflow-hidden scroll-mt-16 md:scroll-mt-20" aria-label="Tech stack section">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-border to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* ── LEFT: Editorial Typography & Tech HUD ── */}
          <div className="space-y-8">
            {/* Section label without numbering */}
            <div className="techstack-reveal flex items-center gap-3">
              <div className="w-4 h-px bg-cyber-cyan" />
              <span className="font-mono text-xs tracking-[0.35em] text-cyber-cyan uppercase">
                &#123; TECH STACK &#125;
              </span>
            </div>

            <h2
              className="techstack-reveal font-display font-bold text-white leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)', lineHeight: 0.7 }}
            >
              TOOLS<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(0, 240, 255, 0.85)', fontSize: '2rem', }}>
                THAT POWER IDEAS.
              </span>
            </h2>

            <p className="techstack-reveal text-cyber-textMuted text-sm leading-relaxed max-w-md">
              A diverse set of technologies I use to build, experiment, and ship products.
            </p>

            <div className="techstack-reveal space-y-1.5 font-mono text-xs text-cyber-textDim">
              <div className="hover:text-cyber-cyan transition-colors">// CONSTANTLY LEARNING</div>
              <div className="hover:text-cyber-cyan transition-colors">// ALWAYS EXPLORING</div>
              <div className="hover:text-cyber-cyan transition-colors">// OPEN TO NEW TOOLS</div>
            </div>

            {/* Active Technology Inspection HUD Card */}
            {activeTech && (
              <div className="techstack-reveal border border-cyber-cyan/40 bg-cyber-bgLight/50 p-5 rounded-sm space-y-3 shadow-cyan-sm animate-fadeIn">
                <div className="flex items-center justify-between border-b border-cyber-border/70 pb-3">
                  <div className="flex items-center gap-3">
                    <TechLogo name={activeTech.name} className="w-6 h-6" />
                    <span className="font-mono text-base font-bold text-cyber-cyan tracking-wider uppercase">
                      {activeTech.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-cyber-textDim tracking-wider">
                    {activeTech.experience}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px] text-cyber-textMuted">
                    <span>PROFICIENCY</span>
                    <span className="text-cyber-cyan">{activeTech.level}%</span>
                  </div>
                  <div className="w-full h-1 bg-cyber-bg border border-cyber-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyber-cyan rounded-full transition-all duration-500 shadow-cyan-sm"
                      style={{ width: `${activeTech.level}%` }}
                    />
                  </div>
                </div>

                <p className="text-cyber-textMuted text-xs leading-relaxed">
                  {activeTech.description}
                </p>

                {activeTech.featuredProjects?.length > 0 && (
                  <div className="pt-1 flex items-center gap-2 font-mono text-[10px] text-cyber-textDim">
                    <Terminal className="w-3 h-3 text-cyber-cyan" />
                    <span>PROJECTS: {activeTech.featuredProjects.join(', ')}</span>
                  </div>
                )}
              </div>
            )}
          </div>

{/* ── RIGHT: Radial Orbital System Matching Panel 05 ── */}
           <div 
             className="techstack-reveal relative flex items-center justify-center min-h-[460px] sm:min-h-[520px]"
             onMouseEnter={() => { setIsRotating(false); setIsAutoSwitching(false); }}
             onMouseLeave={() => { setIsRotating(true); setIsAutoSwitching(true); }}
           >
            {/* Ambient Cyan Halo */}
            <div
              className="absolute w-[440px] h-[440px] rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.35) 0%, transparent 70%)' }}
            />

            {/* SVG Orbital Rings and Laser Beams */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 500 500"
            >
              <defs>
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                  <stop offset="40%" stopColor="#00f0ff" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#04070d" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* 3 Concentric Orbital Tracks */}
              <circle cx="250" cy="250" r="85" fill="none" stroke="rgba(0,240,255,0.12)" strokeWidth="1" strokeDasharray="3 4" />
              <circle cx="250" cy="250" r="145" fill="none" stroke="rgba(0,240,255,0.18)" strokeWidth="1" />
              <circle cx="250" cy="250" r="205" fill="none" stroke="rgba(0,240,255,0.1)" strokeWidth="1" strokeDasharray="2 6" />

              {/* Connecting Laser Beams to each node */}
              {orderedTechs.map((tech, idx) => {
                const total = orderedTechs.length;
                const angleDeg = (idx * (360 / total) + rotationAngle) % 360;
                const angleRad = (angleDeg * Math.PI) / 180;
                const radius = 145;
                const tx = 250 + Math.cos(angleRad) * radius;
                const ty = 250 + Math.sin(angleRad) * radius;
                const isHovered = hoveredTech === tech.name;

                return (
                  <g key={tech.name}>
                    <line
                      x1="250"
                      y1="250"
                      x2={tx}
                      y2={ty}
                      stroke={isHovered ? '#00f0ff' : 'rgba(0,240,255,0.22)'}
                      strokeWidth={isHovered ? 1.8 : 0.9}
                      className="transition-all duration-200"
                    />
                    {isHovered && (
                      <circle cx={tx} cy={ty} r="3" fill="#00f0ff" className="animate-ping" />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Central Glowing Circular Emblem "M" */}
            <div className="relative z-10 w-20 h-20 rounded-full bg-cyber-bg border-2 border-cyber-cyan flex items-center justify-center shadow-cyan-md group cursor-pointer">
              <div className="absolute inset-0 rounded-full bg-cyber-cyan/15 animate-ping opacity-30" />
              <span className="font-display text-3xl font-bold text-cyber-cyan glow-cyan-text">
                M
              </span>
            </div>

            {/* Interactive Orbiting Technology Nodes */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {orderedTechs.map((tech, idx) => {
                const total = orderedTechs.length;
                const angleDeg = (idx * (360 / total) + rotationAngle) % 360;
                const angleRad = (angleDeg * Math.PI) / 180;
                const radius = 175;
                const tx = Math.cos(angleRad) * radius;
                const ty = Math.sin(angleRad) * radius;
                const isHovered = hoveredTech === tech.name;

                return (
                  <div
                    key={tech.name}
                    style={{
                      transform: `translate(${tx}px, ${ty}px)`,
                      transition: 'transform 0.1s linear',
                    }}
                    className="absolute pointer-events-auto flex flex-col items-center gap-1.5"
                  >
                    <button
                      onClick={() => {
                        soundFX.playClick();
                        setHoveredTech(tech.name);
                      }}
                      onMouseEnter={() => {
                        soundFX.playHover();
                        setHoveredTech(tech.name);
                      }}
                      aria-label={`Inspect ${tech.name}`}
                      className={`w-13 h-13 p-2.5 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                        isHovered
                          ? 'border-cyber-cyan bg-cyber-cyan/20 scale-125 shadow-cyan-md'
                          : 'border-cyber-border bg-cyber-bgLight/90 hover:border-cyber-cyan/70 hover:scale-110'
                      }`}
                    >
                      <TechLogo name={tech.name} className="w-7 h-7" />
                    </button>
                    <span className={`font-mono text-[10px] tracking-wider uppercase transition-colors whitespace-nowrap px-1.5 py-0.5 rounded bg-cyber-bg/80 ${
                      isHovered ? 'text-cyber-cyan font-bold' : 'text-cyber-textDim'
                    }`}>
                      {tech.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Rotation Control Hint */}
            <div className="absolute bottom-2 font-mono text-[9px] tracking-widest text-cyber-textDim uppercase flex items-center gap-1.5 pointer-events-none">
              <Sparkles className="w-2.5 h-2.5 text-cyber-cyan" />
              <span>HOVER TO PAUSE & INSPECT</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
