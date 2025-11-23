'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { CopyUrlPill } from './copy-url-pill';

interface UrlListItemProps {
  url: string;
  index: number;
}

export function UrlListItem({ url, index }: UrlListItemProps) {
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
    <li className="flex items-start gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pv-surface)] text-[var(--pv-text-muted)]">
        {index + 1}
      </span>
      <CopyUrlPill url={url} hideButton className="flex-1 min-w-0 whitespace-normal break-words" />
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-text-muted)] transition hover:text-[var(--pv-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pv-primary)]"
        aria-label={copied ? `URL ${index + 1} copied` : `Copy URL ${index + 1}`}
      >
        {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      </button>
    </li>
  );
}
