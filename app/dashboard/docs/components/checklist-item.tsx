'use client';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChecklistItemProps {
  children: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  priority?: 'critical' | 'high' | 'normal';
}

const priorityColors = {
  critical: '#ef4444',
  high: '#f59e0b',
  normal: 'var(--pv-primary)',
};

export function ChecklistItem({
  children,
  checked = false,
  onChange,
  priority = 'normal',
}: ChecklistItemProps) {
  const accentColor = priorityColors[priority];

  return (
    <label className="group flex cursor-pointer items-start gap-3 py-2 transition-colors duration-200">
      {/* Custom checkbox */}
      <div className="relative mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="peer sr-only"
        />
        <motion.div
          className="flex h-5 w-5 items-center justify-center rounded border-2 transition-all duration-200"
          style={{
            borderColor: checked ? accentColor : 'var(--pv-border)',
            background: checked ? accentColor : 'transparent',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            initial={false}
            animate={{
              scale: checked ? 1 : 0,
              opacity: checked ? 1 : 0,
            }}
            transition={{ duration: 0.15 }}
          >
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>
      </div>

      {/* Label text */}
      <span
        className="text-sm leading-relaxed transition-colors duration-200"
        style={{
          color: checked ? 'var(--pv-text-muted)' : 'var(--pv-text)',
          textDecoration: checked ? 'line-through' : 'none',
        }}
      >
        {children}
      </span>
    </label>
  );
}

// Static version for display-only checklists
export function ChecklistItemStatic({
  children,
  priority = 'normal',
}: Omit<ChecklistItemProps, 'checked' | 'onChange'>) {
  const accentColor = priorityColors[priority];

  return (
    <div className="flex items-start gap-3 py-2">
      {/* Bullet point */}
      <div
        className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
        style={{ background: accentColor }}
      />
      {/* Text */}
      <span className="text-sm leading-relaxed" style={{ color: 'var(--pv-text)' }}>
        {children}
      </span>
    </div>
  );
}
