import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface HoverEffectOptions {
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  duration?: number;
  ease?: string;
}

export const useHoverEffect = (options: HoverEffectOptions = {}) => {
  const {
    scale = 1.04,
    offsetX = 2,
    offsetY = 0,
    duration = 0.15,
    ease = 'power2.out'
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    timelineRef.current = gsap.timeline({
      defaults: { duration, ease }
    });

    timelineRef.current.to(element, {
      scale: scale,
      x: offsetX,
      y: offsetY,
      transformOrigin: 'center',
      cursor: 'pointer'
    });

    timelineRef.current.fromTo(
      element,
      { opacity: 0.9 },
      { opacity: 1 }
    );

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [ref.current, scale, offsetX, offsetY, duration, ease]);

  return ref;
};