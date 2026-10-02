import React, { useState } from 'react';
import { ArrowRight, Mail, Globe, Code2, FileText, Send } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import { soundFX } from '../../utils/soundEffects';
import { useHoverEffect } from '../../hooks/useHoverEffect';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface ContactProps {
  onOpenModal: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onOpenModal }) => {
  useScrollReveal('.contact-reveal', {
    y: 50,
    duration: 1,
    stagger: 0.12,
    ease: 'power3.out',
  });
  const { socials, personal } = portfolioData;
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const contactItems = [
    {
      id: 'email',
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: socials.email,
      href: `mailto:${socials.email}`,
    },
    {
      id: 'linkedin',
      icon: <Globe className="w-5 h-5" />,
      label: 'LinkedIn',
      value: socials.linkedin.replace('https://', ''),
      href: socials.linkedin,
    },
    {
      id: 'github',
      icon: <Code2 className="w-5 h-5" />,
      label: 'GitHub',
      value: socials.github.replace('https://', ''),
      href: socials.github,
    },
  ];

  return (
    <section id="contact" className="relative py-8 lg:py-12 overflow-hidden scroll-mt-16 md:scroll-mt-20" aria-label="Contact section">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-border to-transparent" />

      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] opacity-20 pointer-events-none blur-3xl"
        style={{ background: 'radial-gradient(ellipse, rgba(0,240,255,0.45) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* ── LEFT: Headline & Actions ── */}
          <div className="space-y-8">
            {/* Section label without numbering */}
            <div className="contact-reveal flex items-center gap-3">
              <div className="w-4 h-px bg-cyber-cyan" />
              <span className="font-mono text-xs tracking-[0.35em] text-cyber-cyan uppercase">
                &#123; CONTACT &#125;
              </span>
            </div>

            <h2
              className="contact-reveal font-display font-bold text-white leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)', lineHeight: '0.7' }}
            >
              LET'S BUILD<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(0, 240, 255, 0.85)', fontSize: '2rem', }}>
                SOMETHING GREAT.
              </span>
            </h2>

            <p className="contact-reveal text-cyber-textMuted text-sm leading-relaxed max-w-md">
              Have an idea, project, or just want to connect?<br />
              I'm always open to exciting conversations and ambitious initiatives.
            </p>

            {/* Action Buttons */}
            <div className="contact-reveal flex gap-4 flex-wrap">
              <button
                onClick={() => {
                  soundFX.playClick();
                  onOpenModal();
                }}
                onMouseEnter={() => soundFX.playHover()}
                className="flex items-center gap-3 px-6 py-3.5 border border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan hover:bg-cyber-cyan hover:text-black text-xs font-mono tracking-widest uppercase transition-all shadow-cyan-sm cursor-pointer group"
              >
                <div
                  ref={useHoverEffect({ scale: 1.05, offsetX: 2, offsetY: 0, duration: 0.15 })}
                  className="flex items-center gap-3"
                >
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  <span>SEND A MESSAGE</span>
                </div>
              </button>

              <a
                href="#"
                onClick={() => soundFX.playClick()}
                onMouseEnter={() => soundFX.playHover()}
                className="flex items-center gap-3 px-6 py-3.5 border border-cyber-border hover:border-cyber-cyan/70 text-cyber-textMuted hover:text-white text-xs font-mono tracking-widest uppercase transition-all cursor-pointer group"
              >
                <div
                  ref={useHoverEffect({ scale: 1.05, offsetX: 2, offsetY: 0, duration: 0.15 })}
                  className="flex items-center gap-3"
                >
                  <FileText className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>VIEW RESUME</span>
                </div>
              </a>
            </div>

            {/* Bottom micro-copy matching reference panel 07 */}
            <div className="contact-reveal pt-6 border-t border-cyber-border/60">
              <div className="font-mono text-xs text-cyber-textDim tracking-widest uppercase space-y-1">
                <div>IDEAS TODAY</div>
                <div className="text-cyber-cyan font-semibold">A BRIGHTER TOMORROW</div>
              </div>
            </div>
          </div>

{/* ── RIGHT: Contact Details Grid ── */}
           <div className="contact-reveal space-y-3.5">
             {contactItems.map((item) => (
               <a
                 key={item.id}
                 href={item.href}
                 target={item.id !== 'location' ? '_blank' : undefined}
                 rel="noopener noreferrer"
                 onClick={() => soundFX.playClick()}
                 onMouseEnter={() => { setHoveredItem(item.id); soundFX.playHover(); }}
                 onMouseLeave={() => setHoveredItem(null)}
                 className={`flex items-center gap-5 p-5 border transition-all duration-200 group rounded-sm ${
                   hoveredItem === item.id
                     ? 'border-cyber-cyan bg-cyber-cyan/10 shadow-cyan-sm translate-x-1'
                     : 'border-cyber-border/80 bg-cyber-bgLight/40 hover:border-cyber-cyan/40'
                 }`}
               >
                 <div ref={useHoverEffect({ scale: 1.03, offsetX: 2, offsetY: 0, duration: 0.1 })}
                    className="flex items-center gap-3"
                 >
                   <div className={`p-2.5 rounded-full border transition-colors ${
                     hoveredItem === item.id 
                       ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/15' 
                       : 'border-cyber-border text-cyber-textMuted'
                   }`}>
                     {item.icon}
                   </div>
                   <div className="min-w-0">
                     <div className="font-mono text-[10px] tracking-widest text-cyber-textDim uppercase mb-1">
                       {item.label}
                     </div>
                     <div className={`font-mono text-sm transition-colors truncate ${
                       hoveredItem === item.id ? 'text-cyber-cyan font-medium' : 'text-cyber-text'
                     }`}>
                       {item.value}
                     </div>
                   </div>
                   <ArrowRight className={`ml-auto w-4 h-4 shrink-0 transition-all ${
                     hoveredItem === item.id ? 'text-cyber-cyan translate-x-1.5' : 'text-cyber-textDim'
                   }`} />
                 </div>
               </a>
             ))}
           </div>

        </div>
      </div>

{/* Footer bar matching reference */}
       <div className="mt-8 border-t border-cyber-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-sm font-bold tracking-[0.3em] text-white">
            {personal.name}
          </span>
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-widest text-cyber-textDim">
            <span>SAME MIND</span>
            <span className="text-cyber-cyan">/</span>
            <span>HIGHER POSSIBILITIES</span>
            <span className="text-cyber-cyan">/</span>
            <span className="text-cyber-cyan font-bold">MANGAL PANDEY</span>
          </div>
        </div>
      </div>
    </section>
  );
};
