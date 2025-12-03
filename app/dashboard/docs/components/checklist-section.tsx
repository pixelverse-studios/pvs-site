'use client';

import { ReactNode, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChecklistSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  itemCount?: number;
}

export function ChecklistSection({ title, children, defaultOpen = true, itemCount }: ChecklistSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{
        background: 'var(--pv-surface)',
        borderColor: 'var(--pv-border)',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors duration-200 hover:bg-[var(--pv-border)]/30"
      >
        <div className="flex items-center gap-3">
          <h3
            className="text-lg font-semibold"
            style={{ color: 'var(--pv-text)' }}
          >
            {title}
          </h3>
          {itemCount !== undefined && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                background: 'var(--pv-border)',
                color: 'var(--pv-text-muted)',
              }}
            >
              {itemCount} items
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown
            className="h-5 w-5"
            style={{ color: 'var(--pv-text-muted)' }}
          />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div
              className="border-t px-4 pb-4 pt-2"
              style={{ borderColor: 'var(--pv-border)' }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
