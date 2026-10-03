import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  scale?: number;
  opacity?: number;
  rotation?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  end?: string;
  toggleActions?: string;
  scrub?: number | boolean;
}

export const useScrollReveal = (
  selector: string,
  options: ScrollRevealOptions = {}
) => {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(selector);

      const fromVars: Record<string, unknown> = {
        y: options.y ?? 50,
        x: options.x ?? 0,
        scale: options.scale ?? 1,
        opacity: options.opacity ?? 0,
        rotation: options.rotation ?? 0,
      };

      const toVars: Record<string, unknown> = {
        y: 0,
        x: 0,
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: options.duration ?? 0.7,
        ease: options.ease ?? 'power3.out',
      };

      if (options.scrub !== undefined) {
        toVars.scrub = options.scrub;
      }

      elements.forEach((element, index) => {
        const delay = index * (options.stagger ?? 0.06);

        if (options.scrub) {
          gsap.fromTo(
            element,
            fromVars,
            {
              ...toVars,
              scrollTrigger: {
                trigger: element,
                start: options.start ?? 'top 90%',
                end: options.end ?? 'bottom 15%',
                scrub: options.scrub,
              },
            }
          );
        } else {
          gsap.fromTo(
            element,
            fromVars,
            {
              ...toVars,
              delay,
              scrollTrigger: {
                trigger: element,
                start: options.start ?? 'top 90%',
                end: options.end ?? 'bottom 15%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, [
    selector,
    options.y,
    options.x,
    options.scale,
    options.opacity,
    options.rotation,
    options.duration,
    options.stagger,
    options.ease,
    options.start,
    options.end,
    options.toggleActions,
    options.scrub,
  ]);
};

export const useHeroParallax = (
  selector: string,
  options: { yPercent?: number; mobileYPercent?: number; ease?: string } = {}
) => {
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    const elements = gsap.utils.toArray<HTMLElement>(selector);

    const addParallax = (yPercent: number) => {
      elements.forEach((element) => {
        gsap.to(element, {
          yPercent,
          ease: options.ease ?? 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    };

    media.add('(max-width: 767px)', () => {
      addParallax(options.mobileYPercent ?? options.yPercent ?? 30);
    });
    media.add('(min-width: 768px)', () => {
      addParallax(options.yPercent ?? 30);
    });

    return () => media.revert();
  }, [selector, options.yPercent, options.mobileYPercent, options.ease]);
};