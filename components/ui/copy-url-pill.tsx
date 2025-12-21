'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyUrlPillProps {
  url: string;
  className?: string;
  hideButton?: boolean;
}

export function CopyUrlPill({ url, className, hideButton }: CopyUrlPillProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current);
      }
      resetTimer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy URL', error);
    }
  };

  return (
    <div
      className={`inline-flex min-w-0 max-w-full flex-wrap items-center gap-2 rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-3 py-1.5 text-sm text-[var(--pv-text)] shadow-sm ${
        className ?? ''
      }`}
    >
      <code className="break-words text-[0.95rem] leading-tight">{url}</code>
      {!hideButton && (
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--pv-surface)] text-[var(--pv-text-muted)] transition hover:text-[var(--pv-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pv-primary)]"
          aria-label={copied ? 'URL copied' : 'Copy URL'}
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            <Copy className="h-4 w-4" aria-hidden />
          )}
        </button>
      )}
    </div>
  );
}
