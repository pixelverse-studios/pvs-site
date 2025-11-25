'use client';

import { Container } from '@/components/ui/container';
import Link from 'next/link';
import { ArrowLeft, Globe, ExternalLink } from 'lucide-react';
import { WebsiteTypeBadge } from '../../../../components/website-type-badge';
import { DeploymentsSection } from './deployments-section';

interface Website {
  id: string;
  type: string;
  title: string;
  domain: string;
  website_slug: string;
}

interface Client {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  phone: string | null;
  active: boolean | null;
  created_at: string;
  updated_at: string | null;
}

interface WebsiteDetailViewProps {
  website: Website;
  client: Client;
}

export function WebsiteDetailView({ website, client }: WebsiteDetailViewProps) {
  const fullUrl = `https://${website.domain}`;
  const clientName =
    client.firstname && client.lastname
      ? `${client.firstname} ${client.lastname}`
      : client.firstname || client.lastname || 'Client';

  return (
    <main className="relative min-h-screen overflow-hidden pb-16 pt-8">
      {/* Grain texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Gradient spotlight effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-1/2 right-0 h-[800px] w-[800px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--pv-primary) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--pv-primary-2) 0%, transparent 70%)',
          }}
        />
      </div>

      <Container className="relative z-10 max-w-7xl">
        {/* Back Navigation */}
        <Link
          href={`/dashboard/clients/${client.id}`}
          className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to {clientName}</span>
        </Link>

        {/* Hero Section - Compact Header */}
        <div className="mb-6 border-b pb-6" style={{ borderColor: 'var(--pv-border)' }}>
          {/* Title Row with Actions */}
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1
                className="mb-1 font-heading text-2xl font-black leading-tight tracking-tight md:text-3xl"
                style={{
                  color: 'var(--pv-text)',
                }}
              >
                {website.title}
              </h1>
            </div>

            {/* Actions Group */}
            <div className="flex items-center gap-3">
              <WebsiteTypeBadge type={website.type} />
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
                style={{
                  background: 'var(--pv-gradient)',
                }}
              >
                <span>Visit Site</span>
                <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex items-center gap-4 text-sm">
            {/* Domain Link */}
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-2 font-mono font-medium transition-all"
              style={{ color: 'var(--pv-primary)' }}
            >
              <Globe className="h-4 w-4" />
              <span className="underline decoration-[var(--pv-primary)]/30 decoration-1 underline-offset-2 transition-all group-hover/link:decoration-[var(--pv-primary)]">
                {website.domain}
              </span>
              <ExternalLink className="h-3.5 w-3.5 opacity-50 transition-all group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:opacity-100" />
            </a>

            {/* Slug if exists */}
            {website.website_slug && (
              <>
                <span className="text-[var(--pv-text-muted)]">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--pv-text-muted)]">Slug:</span>
                  <code
                    className="rounded px-2 py-0.5 font-mono text-xs"
                    style={{
                      background: 'var(--pv-border)',
                      color: 'var(--pv-text)',
                    }}
                  >
                    /{website.website_slug}
                  </code>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Deployments Section */}
        <DeploymentsSection
          websiteId={website.id}
          websiteTitle={website.title}
        />
      </Container>
    </main>
  );
}
