'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const MAP_SRC =
  'https://www.google.com/maps?q=79+Edgewater+Road,+Cliffside+Park,+NJ+07010&output=embed&z=16';

interface LazyMapProps {
  height: number;
  className?: string;
}

export function LazyMap({ height, className }: LazyMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {visible && (
        <iframe
          src={MAP_SRC}
          width="100%"
          height={height}
          style={{ border: 0 }}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
          referrerPolicy="strict-origin"
          title="PixelVerse Studios location — 79 Edgewater Rd, Cliffside Park NJ"
          className={cn('grayscale transition-all duration-500 hover:grayscale-0', className)}
        />
      )}
    </div>
  );
}
