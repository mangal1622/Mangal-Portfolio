import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import { useHoverEffect } from '../../hooks/useHoverEffect';
import { getLenis } from './SmoothScroll';

interface NavbarProps {
  activeSection: string;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onOpenContact }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'ABOUT', href: '#about', id: 'about' },
    { label: 'WORK', href: '#projects', id: 'projects' },
    { label: 'STACK', href: '#stack', id: 'stack' },
    { label: 'JOURNEY', href: '#journey', id: 'journey' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (href: string) => {
    soundFX.playClick();
    setMobileMenuOpen(false);

    const element = document.querySelector(href) as HTMLElement | null;

    if (!element) return;

    const navbarHeight = window.innerWidth >= 768 ? 80 : 64;

    const targetY =
      element.getBoundingClientRect().top +
      window.scrollY -
      navbarHeight;

    const lenis = getLenis();

    if (lenis) {
      lenis.scrollTo(targetY, {
        duration: 1.2,
      });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: 'auto',
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-cyber-bg/75 backdrop-blur-md border-b border-cyber-border/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Left: Brand — scrolled: show circular avatar; at top: show name */}
        <a
          href="#hero"
          onClick={() => soundFX.playClick()}
          className="flex items-center gap-3 group"
          style={{ minWidth: 0 }}
        >
          {/* Fixed-size container so layout never jumps */}
          <div className="relative flex items-center" style={{ height: '44px', minWidth: '168px' }}>
            {/* Name — visible at top, fades out on scroll */}
            <span
              className="font-display text-base md:text-lg font-bold tracking-[0.2em] text-white group-hover:text-cyber-cyan transition-all duration-500 absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap"
              style={{
                opacity: scrolled ? 0 : 1,
                transform: `translateY(-50%) scale(${scrolled ? 0.85 : 1})`,
                pointerEvents: scrolled ? 'none' : 'auto',
                transition: 'opacity 0.45s ease, transform 0.45s ease',
              }}
            >
              MANGAL PANDEY
            </span>
            {/* Circular avatar — hidden at top, fades in on scroll */}
            <img
              src="/profile.png"
              alt="Mangal Pandey"
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full object-cover border border-cyber-cyan/60 shadow-cyan-sm"
              style={{
                width: '44px',
                height: '44px',
                opacity: scrolled ? 1 : 0,
                transform: `translateY(-50%) scale(${scrolled ? 1 : 0.7})`,
                pointerEvents: scrolled ? 'auto' : 'none',
                transition: 'opacity 0.45s ease, transform 0.45s ease',
              }}
            />
          </div>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse flex-shrink-0" />
        </a>


        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-7 lg:space-x-9 text-xs font-mono tracking-[0.2em]">

{navItems.map((item) => {
      const isActive = activeSection === item.id || 
        (item.id === 'projects' && activeSection === 'project-detail');

      return (
        <a
          key={item.id}
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick(item.href);
          }}
          onMouseEnter={() => soundFX.playHover()}
          className={`relative py-1 transition-all duration-200 ${
            isActive 
              ? 'text-cyber-cyan font-medium' 
              : 'text-cyber-textMuted hover:text-white'
          }`}
        >
          <div ref={useHoverEffect({ scale: 1.04, offsetX: 2, offsetY: 0, duration: 0.15 })}>
            {item.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-cyber-cyan shadow-cyan-sm animate-pulse" />
            )}
          </div>
        </a>
      );
    })}
        </nav>

        {/* Right Action Items */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Let's Talk Button */}
<button
      onClick={() => onOpenContact()}
      onMouseEnter={() => soundFX.playHover()}
      className="px-5 py-2 text-xs font-mono tracking-widest text-cyber-cyan uppercase border border-cyber-cyan/60 hover:border-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-all duration-200 shadow-sm hover:shadow-cyan-sm"
    >
      <div ref={useHoverEffect({ scale: 1.05, offsetX: 3, offsetY: 1, duration: 0.15 })}>
        LET'S TALK
      </div>
    </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center space-x-3">
<button
      onClick={() => {
        soundFX.playClick();
        setMobileMenuOpen(!mobileMenuOpen);
      }}
      className="p-2 text-cyber-textMuted hover:text-cyber-cyan border border-cyber-border"
      aria-label="Toggle menu"
    >
      <div ref={useHoverEffect({ scale: 1.1, offsetX: 2, offsetY: 0, duration: 0.1 })}>
        {mobileMenuOpen ? <X className="w-5 h-5 text-cyber-cyan" /> : <Menu className="w-5 h-5" />}
      </div>
    </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cyber-bgLight/95 border-b border-cyber-border px-6 py-6 space-y-4 backdrop-blur-xl animate-fadeIn">
          <div className="flex flex-col space-y-3 font-mono text-sm tracking-widest">
{navItems.map((item) => (
  <a
    key={item.id}
    href={item.href}
    onClick={(e) => {
      e.preventDefault();
      handleNavClick(item.href);
    }}
    className={`py-2 px-3 border-l-2 transition-colors ${
      activeSection === item.id
        ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/5 font-semibold'
        : 'border-transparent text-cyber-textMuted hover:text-white'
    }`}
  >
    <div ref={useHoverEffect({ scale: 1.03, offsetX: 2, offsetY: 0, duration: 0.1 })}>
      {item.label}
    </div>
  </a>
))}
          </div>

<button
      onClick={() => handleNavClick('#contact')}
      className="w-full mt-4 py-3 text-center text-xs font-mono tracking-widest text-cyber-cyan uppercase border border-cyber-cyan bg-cyber-cyan/10 hover:bg-cyber-cyan hover:text-black transition-all"
    >
      <div ref={useHoverEffect({ scale: 1.05, offsetX: 3, offsetY: 1, duration: 0.15 })}>
        LET'S TALK
      </div>
    </button>
        </div>
      )}
    </header>
  );
};
