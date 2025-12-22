'use client';

import { AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { ReactNode } from 'react';

type CalloutType = 'critical' | 'info' | 'success' | 'warning';

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutConfig = {
  critical: {
    icon: AlertTriangle,
    bgColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: '#ef4444',
    iconColor: '#ef4444',
    darkBgColor: 'rgba(239, 68, 68, 0.15)',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: '#f59e0b',
    iconColor: '#f59e0b',
    darkBgColor: 'rgba(245, 158, 11, 0.15)',
  },
  info: {
    icon: Info,
    bgColor: 'rgba(59, 130, 246, 0.08)',
    borderColor: '#3b82f6',
    iconColor: '#3b82f6',
    darkBgColor: 'rgba(59, 130, 246, 0.15)',
  },
  success: {
    icon: CheckCircle,
    bgColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: '#10b981',
    iconColor: '#10b981',
    darkBgColor: 'rgba(16, 185, 129, 0.15)',
  },
};

export function Callout({ type, title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div
      className="my-6 rounded-xl border-l-4 p-4 dark:bg-opacity-100"
      style={{
        borderLeftColor: config.borderColor,
        background: config.bgColor,
      }}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: config.iconColor }} />
        <div className="flex-1">
          {title && (
            <h4 className="mb-1 font-semibold" style={{ color: 'var(--pv-text)' }}>
              {title}
            </h4>
          )}
          <div className="text-sm leading-relaxed" style={{ color: 'var(--pv-text-muted)' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
