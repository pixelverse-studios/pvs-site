'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface DocHeaderProps {
  title: string;
  description: string;
  lastUpdated?: string;
  readTime?: string;
}

export function DocHeader({ title, description, lastUpdated, readTime }: DocHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      {/* Back link */}
      <Link
        href="/dashboard/docs"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200"
        style={{ color: 'var(--pv-text-muted)' }}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hover:underline">Back to Documentation</span>
      </Link>

      {/* Title */}
      <h1
        className="mb-3 text-3xl font-bold md:text-4xl"
        style={{ color: 'var(--pv-text)' }}
      >
        {title}
      </h1>

      {/* Description */}
      <p
        className="mb-4 max-w-2xl text-lg leading-relaxed"
        style={{ color: 'var(--pv-text-muted)' }}
      >
        {description}
      </p>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {lastUpdated && (
          <div
            className="flex items-center gap-1.5"
            style={{ color: 'var(--pv-text-muted)' }}
          >
            <Clock className="h-4 w-4" />
            <span>Updated {lastUpdated}</span>
          </div>
        )}
        {readTime && (
          <div
            className="flex items-center gap-1.5"
            style={{ color: 'var(--pv-text-muted)' }}
          >
            <FileText className="h-4 w-4" />
            <span>{readTime} read</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div
        className="mt-6 h-px"
        style={{
          background: 'linear-gradient(90deg, var(--pv-border), transparent)',
        }}
      />
    </motion.div>
  );
}
