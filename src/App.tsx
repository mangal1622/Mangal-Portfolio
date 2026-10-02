import React, { useState } from 'react';
import { GlobalBackground } from './components/common/GlobalBackground';
import { Navbar } from './components/common/Navbar';
import { ContactModal } from './components/common/ContactModal';
import { Preloader } from './components/preloader/Preloader';
import { Hero } from './components/hero/Hero';
import { About } from './components/about/About';
import { Projects } from './components/projects/Projects';
import { TechStack } from './components/techstack/TechStack';
import { Journey } from './components/journey/Journey';
import { Contact } from './components/contact/Contact';
import { useScrollSpy } from './hooks/useScrollSpy';
import { CursorTrail } from './components/common/CursorTrail';
import { SmoothScroll } from './components/common/SmoothScroll';

const sectionIds = [
  'hero',
  'about',
  'projects',
  'stack',
  'journey',
  'contact',
];

const App: React.FC = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const activeSection = useScrollSpy(sectionIds, 150);

  return (
    <div className="relative min-h-screen bg-cyber-bg text-cyber-text overflow-x-hidden">

      {/* Smooth scrolling engine */}
      <SmoothScroll />

      {/* Cinematic Preloader Overlay */}
      {!preloaderDone && (
        <Preloader
          onComplete={() => setPreloaderDone(true)}
        />
      )}

      {/* Fixed Ambient Cyber Background */}
      <GlobalBackground />

      {/* Sticky Navigation */}
      <Navbar
        activeSection={activeSection}
        onOpenContact={() => setContactOpen(true)}
      />

      {/* Main Portfolio Content */}
      <main className="relative z-10">
        <Hero />

        <About />

        <Projects />

        <TechStack />

        <Journey />

        <Contact
          onOpenModal={() => setContactOpen(true)}
        />

        <CursorTrail />
      </main>

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />

    </div>
  );
};

export default App;