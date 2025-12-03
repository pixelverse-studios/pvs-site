'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <nav
      className="rounded-xl border p-4"
      style={{
        background: 'var(--pv-surface)',
        borderColor: 'var(--pv-border)',
      }}
    >
      <h4
        className="mb-3 text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--pv-text-muted)' }}
      >
        On this page
      </h4>
      <ul className="space-y-1">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => scrollToSection(item.id)}
                className="relative w-full text-left text-sm transition-colors duration-200"
                style={{
                  paddingLeft: `${(item.level - 2) * 12 + 8}px`,
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  color: isActive ? 'var(--pv-primary)' : 'var(--pv-text-muted)',
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="toc-indicator"
                    className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full"
                    style={{ background: 'var(--pv-primary)' }}
                  />
                )}
                <span className="hover:text-[var(--pv-text)]">{item.title}</span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </nav>
  );
}
