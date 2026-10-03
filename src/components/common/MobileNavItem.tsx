import React from 'react';
import { Menu, X } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import { useHoverEffect } from '../../hooks/useHoverEffect';

export const MobileNavItem: React.FC<{ item: any; onClick: (href: string) => void; activeSection: string }> = ({ item, onClick, activeSection }) => {
  const hoverRef = useHoverEffect({ scale: 1.03, offsetX: 2, offsetY: 0, duration: 0.1 });
  const isActive = activeSection === item.id;

  return (
    <a
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        onClick(item.href);
      }}
      className={`py-2 px-3 border-l-2 transition-colors ${
        isActive
          ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/5 font-semibold'
          : 'border-transparent text-cyber-textMuted hover:text-white'
      }`}
    >
      <div ref={hoverRef}>
        {item.label}
      </div>
    </a>
  );
};

export const MobileContactButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const hoverRef = useHoverEffect({ scale: 1.05, offsetX: 3, offsetY: 1, duration: 0.15 });

  return (
    <button
      onClick={() => onClick()}
      className="w-full mt-4 py-3 text-center text-xs font-mono tracking-widest text-cyber-cyan uppercase border border-cyber-cyan bg-cyber-cyan/10 hover:bg-cyber-cyan hover:text-black transition-all"
    >
      <div ref={hoverRef}>
        LET'S TALK
      </div>
    </button>
  );
};

export const DesktopNavItem: React.FC<{ item: any; onClick: (href: string) => void; isActive: boolean; onMouseEnter: () => void }> = ({ item, onClick, isActive, onMouseEnter }) => {
  const hoverRef = useHoverEffect({ scale: 1.04, offsetX: 2, offsetY: 0, duration: 0.15 });

  return (
    <a
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        onClick(item.href);
      }}
      onMouseEnter={onMouseEnter}
      className={`relative py-1 transition-all duration-200 ${
        isActive
          ? 'text-cyber-cyan font-medium'
          : 'text-cyber-textMuted hover:text-white'
      }`}
    >
      <div ref={hoverRef}>
        {item.label}
        {isActive && (
          <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-cyber-cyan shadow-cyan-sm animate-pulse" />
        )}
      </div>
    </a>
  );
};

export const DesktopContactButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const hoverRef = useHoverEffect({ scale: 1.05, offsetX: 3, offsetY: 1, duration: 0.15 });

  return (
    <button
      onClick={() => onClick()}
      onMouseEnter={() => soundFX.playHover()}
      className="px-5 py-2 text-xs font-mono tracking-widest text-cyber-cyan uppercase border border-cyber-cyan/60 hover:border-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-all duration-200 shadow-sm hover:shadow-cyan-sm"
    >
      <div ref={hoverRef}>
        LET'S TALK
      </div>
    </button>
  );
};

export const HamburgerButton: React.FC<{ isOpen: boolean; onClick: () => void }> = ({ isOpen, onClick }) => {
  const hoverRef = useHoverEffect({ scale: 1.1, offsetX: 2, offsetY: 0, duration: 0.1 });

  return (
    <button
      onClick={onClick}
      className="p-2 text-cyber-textMuted hover:text-cyber-cyan border border-cyber-border"
      aria-label="Toggle menu"
    >
      <div ref={hoverRef}>
        {isOpen ? <X className="w-5 h-5 text-cyber-cyan" /> : <Menu className="w-5 h-5" />}
      </div>
    </button>
  );
};