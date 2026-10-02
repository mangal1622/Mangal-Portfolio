import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Terminal } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import { useHoverEffect } from '../../hooks/useHoverEffect';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [percent, setPercent] = useState(18);
  const [stage, setStage] = useState<'boot' | 'ready' | 'enter'>('boot');
  const [logs, setLogs] = useState<string[]>([
    '> INITIALIZING CORE MANGAL.OS',
  ]);

  const handleEnter = useCallback(() => {
    soundFX.playEnter();
    setStage('enter');
    setTimeout(() => {
      onComplete();
    }, 450);
  }, [onComplete]);

  // Safeguard: auto-complete after 2.5s no matter what
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      handleEnter();
    }, 2500);

    const handleKeyDown = () => {
      handleEnter();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleEnter]);

  useEffect(() => {
    const logTimeline = [
      { p: 35, text: '> LOADING GRAPHICS SUBSYSTEMS & SHADERS' },
      { p: 62, text: '> COMPILING PARTICLE NEURAL MATRIX' },
      { p: 85, text: '> CONNECTING TO INTELLIGENT SYSTEMS' },
      { p: 96, text: '> PREPARING INTERACTIVE REPOSITORIES' },
      { p: 100, text: '> SYSTEM READY. ALL PARAMETERS NOMINAL.' },
    ];

    let current = 18;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 10) + 7;
      if (current >= 100) {
        current = 100;
        setPercent(100);
        clearInterval(interval);

        setStage('ready');
        soundFX.playHover();

        // Auto-enter smoothly after brief celebration
        setTimeout(() => {
          handleEnter();
        }, 700);
      } else {
        setPercent(current);
        const match = logTimeline.find(l => l.p <= current && !logs.includes(l.text));
        if (match) {
          setLogs(prev => [...prev.slice(-3), match.text]);
          soundFX.playScan();
        }
      }
    }, 35);

    return () => clearInterval(interval);
  }, [handleEnter]); // eslint-disable-line

  return (
    <div
      onClick={handleEnter}
      className={`fixed inset-0 z-50 bg-cyber-bg flex items-center justify-center cursor-pointer transition-all duration-500 ${
        stage === 'enter' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
      role="button"
      tabIndex={0}
      aria-label="Click anywhere to enter portfolio"
    >
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />

      {/* Skip button in top right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEnter();
        }}
        className="absolute top-6 right-6 text-[11px] font-mono tracking-widest text-cyber-textMuted hover:text-cyber-cyan border border-cyber-border hover:border-cyber-cyan px-3 py-1.5 transition-all z-20 cursor-pointer"
      >
        [ SKIP INTRO ]
      </button>

      {/* Main 3-stage UI Panel */}
      <div className="relative w-full max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        {/* Stage 1: MANGAL.OS & Progress */}
        <div className="p-8 border border-cyber-border/80 bg-cyber-bgLight/40 backdrop-blur-md rounded-sm flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-cyber-cyan tracking-[0.2em] font-semibold">
                MANGAL PANDEY.OS
              </span>
              <Terminal className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            </div>

            {/* Circular Radar Indicator */}
            <div className="flex justify-center py-4">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#0a1829"
                    strokeWidth="3"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="3"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * percent) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-100"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-mono text-lg font-bold text-white tracking-wider">
                    {percent}%
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="font-mono text-[11px] text-cyber-cyan tracking-widest uppercase">
                {percent < 100 ? 'INITIALIZING EXPERIENCE...' : 'ENTERING PORTFOLIO...'}
              </p>
            </div>
          </div>

          {/* Terminal log output */}
          <div className="mt-6 pt-4 border-t border-cyber-border space-y-1 font-mono text-[10px] text-cyber-textMuted h-16 overflow-hidden">
            {logs.map((log, idx) => (
              <div key={idx} className="truncate">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Stage 2: Welcome MANGAL & Ready To Explore */}
        <div className="p-8 border border-cyber-border/80 bg-cyber-bgLight/40 backdrop-blur-md rounded-sm flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6">
            <span className="font-mono text-[11px] text-cyber-textMuted tracking-[0.2em] uppercase">
              AUTHENTICATION // VERIFIED
            </span>

            <div className="py-6 space-y-2">
              <p className="text-xs font-mono text-cyber-textMuted tracking-widest uppercase">
                WELCOME
              </p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-cyber-cyan tracking-[0.12em] glow-cyan-text">
                MANGAL PANDEY
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-mono text-[11px] text-cyber-textMuted tracking-wider uppercase">
              {percent < 100 ? 'PREPARING INTERFACE...' : 'READY TO EXPLORE'}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEnter();
              }}
              className="w-full py-3 px-4 font-mono text-xs uppercase tracking-widest border border-cyber-cyan text-cyber-cyan bg-cyber-cyan/15 hover:bg-cyber-cyan hover:text-black shadow-cyan-sm transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
            >
              <div ref={useHoverEffect({ scale: 1.05, offsetX: 2, offsetY: 0, duration: 0.15 })}>
                <span>ENTER PORTFOLIO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>

        {/* Stage 3: The Portal / Gateway Graphic */}
        <div className="p-8 border border-cyber-border/80 bg-cyber-bgLight/40 backdrop-blur-md rounded-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-[10px] text-cyber-textMuted uppercase tracking-wider">
              <span>NEW IDEAS</span>
              <span>NEW POSSIBILITIES</span>
            </div>
          </div>

          {/* Portal gateway SVG visual */}
          <div className="relative py-4 flex items-center justify-center">
            <svg viewBox="0 0 200 240" className="w-44 h-52">
              <defs>
                <linearGradient id="portalGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#04070d" stopOpacity="0.9" />
                </linearGradient>
                <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Perspective floor lines */}
              <line x1="10" y1="230" x2="70" y2="170" stroke="#132338" strokeWidth="1" />
              <line x1="50" y1="230" x2="85" y2="170" stroke="#132338" strokeWidth="1" />
              <line x1="150" y1="230" x2="115" y2="170" stroke="#132338" strokeWidth="1" />
              <line x1="190" y1="230" x2="130" y2="170" stroke="#132338" strokeWidth="1" />

              {/* Glowing door frame */}
              <rect
                x="65"
                y="35"
                width="70"
                height="135"
                fill="url(#portalGlow)"
                stroke="#00f0ff"
                strokeWidth="2"
                filter="url(#laserGlow)"
              />

              {/* Solitary traveler silhouette in doorway */}
              <ellipse cx="100" cy="115" rx="4" ry="4" fill="#04070d" />
              <path
                d="M96,120 L104,120 L103,145 L97,145 Z"
                fill="#04070d"
              />
              <line x1="98" y1="145" x2="97" y2="165" stroke="#04070d" strokeWidth="2" />
              <line x1="102" y1="145" x2="103" y2="165" stroke="#04070d" strokeWidth="2" />

              {/* Ground shadow */}
              <ellipse cx="100" cy="168" rx="12" ry="3" fill="rgba(0,240,255,0.4)" />
            </svg>
          </div>

          <div className="text-center">
            <span className="font-mono text-[11px] text-cyber-cyan tracking-[0.3em] uppercase">
              LET'S BEGIN
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
