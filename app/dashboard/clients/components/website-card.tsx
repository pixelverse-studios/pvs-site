'use client';

import { useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { WebsiteTypeBadge } from './website-type-badge';

interface Website {
  id: string;
  type: string;
  title: string;
  domain: string;
  website_slug: string;
}

interface WebsiteCardProps {
  website: Website;
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `https://${website.domain}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleVisit = () => {
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg"
      style={{
        background: 'var(--pv-surface)',
        borderColor: 'var(--pv-border)',
      }}
    >
      {/* Hover gradient overlay */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(135deg, rgba(63, 0, 233, 0.03), rgba(201, 71, 255, 0.03))',
        }}
      />

      {/* Browser chrome mockup */}
      <div
        className="relative flex items-center gap-2 border-b px-4 py-3"
        style={{
          borderColor: 'var(--pv-border)',
          background: 'var(--pv-bg)',
        }}
      >
        {/* Browser dots */}
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#28ca42' }} />
        </div>

        {/* Domain */}
        <div
          className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs"
          style={{ color: 'var(--pv-text-muted)' }}
        >
          {website.domain}
        </div>

        {/* Type badge - small version */}
        <WebsiteTypeBadge type={website.type} />
      </div>

      {/* Content */}
      <div className="relative p-4">
        <div className="mb-3">
          <h3 className="mb-1 text-lg font-semibold" style={{ color: 'var(--pv-text)' }}>
            {website.title}
          </h3>
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1 text-sm font-medium transition-colors hover:underline"
            style={{ color: 'var(--pv-primary)' }}
          >
            <span>{website.domain}</span>
            <ExternalLink className="h-3 w-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </a>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleVisit}
            className="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-md"
            style={{
              background: 'var(--pv-gradient)',
              color: '#fff',
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Visit Site
            </span>
          </button>

          <button
            onClick={handleCopy}
            className="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
            style={{
              background: copied ? 'var(--pv-success)' : 'var(--pv-border)',
              color: copied ? '#fff' : 'var(--pv-text)',
            }}
            aria-label={copied ? 'URL copied' : 'Copy website URL'}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        {/* Slug indicator (subtle) */}
        {website.website_slug && (
          <div
            className="mt-3 pt-3 text-xs"
            style={{
              borderTop: `1px solid var(--pv-border)`,
              color: 'var(--pv-text-muted)',
            }}
          >
            <span className="font-mono">/{website.website_slug}</span>
          </div>
        )}
      </div>

      {/* Bottom accent bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'var(--pv-gradient)',
        }}
      />
    </div>
  );
}
