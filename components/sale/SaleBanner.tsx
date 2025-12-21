'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { currentSale, isSaleActive, shouldShowOnPage, Sale } from '@/data/sales-config';
import { CountdownTimer } from './CountdownTimer';

const DISMISSED_KEY = 'pvs-sale-dismissed';
const DISMISSAL_HOURS = 24;
const SHOW_DELAY_MS = 5000; // 5 seconds before showing

function getDismissalState(saleId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (!dismissed) return false;
    const { saleId: storedId, until } = JSON.parse(dismissed);
    return storedId === saleId && Date.now() < until;
  } catch {
    return false;
  }
}

function setDismissalState(saleId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    DISMISSED_KEY,
    JSON.stringify({
      saleId,
      until: Date.now() + DISMISSAL_HOURS * 60 * 60 * 1000,
    }),
  );
}

const themeStyles = {
  sale: 'bg-[var(--pv-surface)] border-[var(--pv-sale)]/30',
  gold: 'bg-[var(--pv-surface)] border-[var(--pv-gold)]/30',
  primary: 'bg-[var(--pv-surface)] border-[var(--pv-primary)]/30',
};

const accentStyles = {
  sale: 'text-[var(--pv-sale)]',
  gold: 'text-[var(--pv-gold)]',
  primary: 'text-[var(--pv-primary)]',
};

const ctaStyles = {
  sale: 'bg-[var(--pv-sale)] text-white hover:bg-[var(--pv-sale-dark)]',
  gold: 'bg-[var(--pv-gold)] text-white hover:bg-[var(--pv-gold-dark)]',
  primary: 'bg-[var(--pv-primary)] text-white hover:bg-[var(--pv-primary)]',
};

export function SaleBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [sale, setSale] = useState<Sale | null>(null);

  useEffect(() => {
    if (!currentSale || !isSaleActive(currentSale)) return;
    if (!shouldShowOnPage(currentSale, pathname)) return;
    if (getDismissalState(currentSale.id)) return;

    setSale(currentSale);
    setShouldRender(true);

    // Delay showing the toast
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(showTimer);
  }, [pathname]);

  const handleDismiss = () => {
    if (!sale) return;
    setDismissalState(sale.id);
    setVisible(false);
    // Remove from DOM after animation
    setTimeout(() => setShouldRender(false), 300);
  };

  if (!shouldRender || !sale) return null;

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        w-full max-w-sm
        rounded-2xl border-2 p-4
        shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]
        backdrop-blur-xl
        transition-all duration-300 ease-out
        dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]
        ${themeStyles[sale.theme]}
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}
      role="dialog"
      aria-label="Promotional offer"
    >
      {/* Dismiss button - top right */}
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 rounded-full p-1.5 text-[var(--pv-text-muted)] transition-colors hover:bg-[var(--pv-border)] hover:text-[var(--pv-text)]"
        aria-label="Dismiss promotional offer"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Centered content */}
      <div className="flex flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`bg-[var(--pv-sale)]/10 flex h-8 w-8 items-center justify-center rounded-lg ${accentStyles[sale.theme]}`}
          >
            <Sparkles className="h-4 w-4" />
          </span>
          <span
            className={`font-heading text-sm font-bold uppercase tracking-wider ${accentStyles[sale.theme]}`}
          >
            {sale.discountLabel}
          </span>
        </div>

        {/* Headline */}
        <h3 className="mb-1 font-heading text-lg font-bold text-[var(--pv-text)]">
          {sale.headline}
        </h3>
        {sale.subtext && <p className="mb-4 text-sm text-[var(--pv-text-muted)]">{sale.subtext}</p>}

        {/* Countdown */}
        {sale.showCountdown && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--pv-text-muted)]">
              Offer ends in
            </p>
            <div className="inline-flex rounded-lg bg-[var(--pv-bg)] p-2">
              <CountdownTimer endDate={sale.endDate} />
            </div>
          </div>
        )}

        {/* CTA */}
        <Link
          href={sale.ctaLink}
          className={`
            inline-flex w-full items-center justify-center
            rounded-xl px-4 py-2.5
            font-semibold
            transition-all duration-200
            hover:-translate-y-0.5
            ${ctaStyles[sale.theme]}
          `}
        >
          {sale.ctaText}
        </Link>
      </div>
    </div>
  );
}
