'use client';

import Link from 'next/link';
import { Search, PenTool, BookOpen, FileText, Settings, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  search: Search,
  penTool: PenTool,
  bookOpen: BookOpen,
  fileText: FileText,
  settings: Settings,
  code: Code,
};

type IconName = keyof typeof iconMap;

interface DocCardProps {
  title: string;
  description: string;
  href: string;
  iconName: IconName;
  accentColor?: string;
  stats?: {
    label: string;
    value: string;
  };
}

export function DocCard({
  title,
  description,
  href,
  iconName,
  accentColor = 'var(--pv-primary)',
  stats,
}: DocCardProps) {
  const Icon = iconMap[iconName];

  return (
    <Link href={href}>
      <motion.div
        className="group relative h-full overflow-hidden rounded-2xl border transition-all duration-500"
        style={{
          background: 'var(--pv-surface)',
          borderColor: 'var(--pv-border)',
        }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        {/* Accent gradient bar */}
        <div
          className="absolute left-0 top-0 h-1 w-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, ${accentColor}, var(--pv-primary-2))`,
          }}
        />

        {/* Hover glow effect */}
        <div
          className="absolute -inset-px opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, var(--pv-primary-2))`,
          }}
        />

        <div className="relative p-6">
          {/* Icon */}
          <div
            className="mb-4 inline-flex rounded-xl p-3 transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
              border: `1px solid ${accentColor}20`,
            }}
          >
            <Icon
              className="h-6 w-6 transition-colors duration-300"
              style={{ color: accentColor }}
            />
          </div>

          {/* Title */}
          <h3
            className="mb-2 text-xl font-semibold transition-colors duration-300"
            style={{ color: 'var(--pv-text)' }}
          >
            {title}
          </h3>

          {/* Description */}
          <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--pv-text-muted)' }}>
            {description}
          </p>

          {/* Stats badge */}
          {stats && (
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                background: 'var(--pv-border)',
                color: 'var(--pv-text-muted)',
              }}
            >
              <span>{stats.label}:</span>
              <span style={{ color: accentColor }}>{stats.value}</span>
            </div>
          )}

          {/* Arrow indicator */}
          <div
            className="absolute bottom-6 right-6 flex h-8 w-8 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100"
            style={{
              background: `${accentColor}15`,
            }}
          >
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              style={{ color: accentColor }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
