import React, { useState, useEffect } from 'react';
import { soundFX } from '../../utils/soundEffects';
import { getLenis } from './SmoothScroll';
import { MobileNavItem, MobileContactButton, DesktopNavItem, DesktopContactButton, HamburgerButton } from './MobileNavItem';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Left: Brand — scrolled: show circular avatar; at top: show name */}
        <a
          href="#hero"
          onClick={() => soundFX.playClick()}
          className="flex items-center gap-3 group min-w-0"
          style={{ minWidth: 0 }}
        >
          {/* Fixed-size container so layout never jumps */}
          <div className="relative flex items-center min-w-0" style={{ height: '44px', minWidth: '44px', maxWidth: 'calc(100vw - 120px)' }}>
            {/* Name — visible at top, fades out on scroll */}
            <span
              className="font-display text-sm sm:text-base md:text-lg font-bold tracking-[0.12em] sm:tracking-[0.2em] text-white group-hover:text-cyber-cyan transition-all duration-500 absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap max-w-[calc(100vw-120px)] overflow-hidden text-ellipsis"
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
        </a>


        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-7 lg:space-x-9 text-xs font-mono tracking-[0.2em]">
          {navItems.map((item) => {
            const isActive = activeSection === item.id || 
              (item.id === 'projects' && activeSection === 'project-detail');

            return (
              <DesktopNavItem
                key={item.id}
                item={item}
                onClick={handleNavClick}
                isActive={isActive}
                onMouseEnter={() => soundFX.playHover()}
              />
            );
          })}
        </nav>

        {/* Right Action Items */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Let's Talk Button */}
          <DesktopContactButton onClick={onOpenContact} />
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center space-x-3">
          <HamburgerButton isOpen={mobileMenuOpen} onClick={() => {
            soundFX.playClick();
            setMobileMenuOpen(!mobileMenuOpen);
          }} />
        </div>
      </div>

{/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-50 bg-cyber-bgLight/95 border-b border-cyber-border px-6 py-6 space-y-4 backdrop-blur-xl animate-fadeIn">
          <div className="flex flex-col space-y-3 font-mono text-sm tracking-widest">
            {navItems.map((item) => (
              <MobileNavItem
                key={item.id}
                item={item}
                onClick={handleNavClick}
                activeSection={activeSection}
              />
            ))}
          </div>

          <MobileContactButton onClick={() => handleNavClick('#contact')} />
        </div>
      )}
    </header>
  );
};
