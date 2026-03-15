'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  threshold?: number;
}

export function ScrollReveal({ children, className, style, threshold = 0.5 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          // Also add in-view to scroll-animated children
          el.querySelectorAll('.scroll-fade-left, .scroll-scale, .scroll-grow-y').forEach((child) =>
            child.classList.add('in-view'),
          );
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
