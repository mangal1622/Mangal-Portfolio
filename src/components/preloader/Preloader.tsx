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
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  const handleEnter = useCallback(() => {
    if (!isLoadingComplete) return;
    soundFX.playEnter();
    setStage('enter');
    setTimeout(() => {
      onComplete();
    }, 450);
  }, [onComplete, isLoadingComplete]);

  useEffect(() => {
    let current = 18;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 10) + 7;
      if (current >= 100) {
        current = 100;
        setPercent(100);
        clearInterval(interval);

        setStage('ready');
        setIsLoadingComplete(true);
        soundFX.playHover();
      } else {
        setPercent(current);
      }
    }, 35);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoadingComplete || stage === 'enter') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoadingComplete, stage, handleEnter]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-cyber-bg flex items-center justify-center p-4 transition-all duration-500 ${
        stage === 'enter' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Portfolio intro loading screen"
    >
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />

      {/* Single Centered Panel */}
      <div className="relative w-full max-w-md mx-auto p-4 sm:p-6 md:p-8 lg:p-10 border border-cyber-border/80 bg-cyber-bgLight/40 backdrop-blur-md rounded-sm flex flex-col items-center space-y-4 sm:space-y-6">
        {/* MANGAL PANDEY.OS Header */}
        <div className="flex items-center justify-center gap-2 w-full">
          <span className="font-mono text-xs sm:text-sm text-cyber-cyan tracking-[0.2em] font-semibold">
            MANGAL PANDEY.OS
          </span>
          <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyber-cyan animate-pulse" />
        </div>

        {/* Circular Loading Indicator */}
        <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex items-center justify-center">
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
            <span className="font-mono text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wider">
              {percent}%
            </span>
          </div>
        </div>

        {/* ENTERING PORTFOLIO... */}
        <p className="font-mono text-xs sm:text-sm text-cyber-cyan tracking-widest uppercase text-center">
          {isLoadingComplete ? 'PORTFOLIO READY...' : 'INITIALIZING EXPERIENCE...'}
        </p>

        {/* AUTHENTICATION // VERIFIED */}
        <span className="font-mono text-xs sm:text-sm text-cyber-textMuted tracking-[0.2em] uppercase">
          AUTHENTICATION // VERIFIED
        </span>

        {/* WELCOME */}
        <p className="text-xs sm:text-base font-mono text-cyber-textMuted tracking-widest uppercase text-center">
          WELCOME
        </p>

        {/* MANGAL PANDEY */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-cyber-cyan tracking-[0.12em] glow-cyan-text text-center break-words w-full">
          TO THE PORTFOLIO
        </h2>

        {/* READY TO EXPLORE */}
        <p className="font-mono text-xs sm:text-sm text-cyber-textMuted tracking-wider uppercase text-center">
          {isLoadingComplete ? 'READY TO EXPLORE' : 'PREPARING INTERFACE...'}
        </p>

        {/* ENTER PORTFOLIO Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEnter();
          }}
          disabled={!isLoadingComplete}
          className={`w-full max-w-xs py-3 px-6 font-mono text-xs sm:text-sm uppercase tracking-widest border border-cyber-cyan text-cyber-cyan bg-cyber-cyan/15 hover:bg-cyber-cyan hover:text-black shadow-cyan-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            isLoadingComplete ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
          }`}
        >
          <div ref={useHoverEffect({ scale: 1.05, offsetX: 2, offsetY: 0, duration: 0.15 })}
            className="flex items-center gap-3"
          >
            <span>ENTER PORTFOLIO</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          </div>
        </button>
      </div>
    </div>
  );
};