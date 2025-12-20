'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  currentSale,
  isSaleActive,
  shouldShowOnPage,
  Sale,
} from '@/data/sales-config';
import { CountdownTimer } from './CountdownTimer';

const DISMISSED_KEY = 'pvs-sale-dismissed';
const DISMISSAL_HOURS = 24;

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
  sale: 'bg-[var(--pv-sale)]',
  gold: 'bg-gradient-to-r from-[var(--pv-gold-dark)] via-[var(--pv-gold)] to-[var(--pv-gold-dark)]',
  primary: 'bg-[var(--pv-primary)]',
};

const ctaStyles = {
  sale: 'bg-white text-[var(--pv-sale)] hover:bg-white/90',
  gold: 'bg-[#1a1400] text-[var(--pv-gold)] hover:bg-[#1a1400]/90',
  primary: 'bg-white text-[var(--pv-primary)] hover:bg-white/90',
};

export function SaleBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [sale, setSale] = useState<Sale | null>(null);

  useEffect(() => {
    if (!currentSale || !isSaleActive(currentSale)) return;
    if (!shouldShowOnPage(currentSale, pathname)) return;
    if (getDismissalState(currentSale.id)) return;

    setSale(currentSale);
    setVisible(true);
  }, [pathname]);

  const handleDismiss = () => {
    if (!sale) return;
    setDismissalState(sale.id);
    setVisible(false);
  };

  if (!visible || !sale) return null;

  return (
    <div
      className={`sticky top-0 z-40 w-full text-white ${themeStyles[sale.theme]}`}
      role="banner"
      aria-label="Promotional offer"
      style={{
        animation: 'bannerSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      <style jsx>{`
        @keyframes bannerSlideIn {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Desktop Layout */}
      <div className="mx-auto hidden max-w-7xl items-center justify-between gap-4 px-4 py-3 md:flex">
        {/* Left: Discount Badge */}
        <span className="shrink-0 rounded border-l-[3px] border-white/30 bg-black/20 px-3 py-1 font-heading text-sm font-extrabold uppercase tracking-wider">
          {sale.discountLabel}
        </span>

        {/* Center: Message + Countdown */}
        <div className="flex flex-1 items-center justify-center gap-4 text-center">
          <div>
            <span className="font-heading font-bold">{sale.headline}</span>
            {sale.subtext && (
              <span className="ml-2 text-white/80">{sale.subtext}</span>
            )}
          </div>

          {sale.showCountdown && (
            <CountdownTimer endDate={sale.endDate} compact />
          )}
        </div>

        {/* Right: CTA + Dismiss */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={sale.ctaLink}
            className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold transition-all hover:scale-[1.02] ${ctaStyles[sale.theme]}`}
          >
            {sale.ctaText}
          </Link>
          <button
            onClick={handleDismiss}
            className="rounded-full p-1.5 transition-colors hover:bg-white/20"
            aria-label="Dismiss promotional banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col gap-2 px-4 py-2.5 md:hidden">
        <div className="flex items-center justify-between">
          <span className="font-heading text-sm font-bold">
            <span className="mr-1.5 font-extrabold">{sale.discountLabel}</span>
            {sale.headline}
          </span>
          <button
            onClick={handleDismiss}
            className="rounded-full p-1 transition-colors hover:bg-white/20"
            aria-label="Dismiss promotional banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-3">
          {sale.showCountdown && (
            <CountdownTimer endDate={sale.endDate} compact />
          )}
          <Link
            href={sale.ctaLink}
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all ${ctaStyles[sale.theme]}`}
          >
            {sale.ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
}
