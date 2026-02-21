import { Mail, MapPin, Phone } from 'lucide-react';

import { Container } from '@/components/ui/container';

const INFO_ITEMS = [
  {
    icon: Mail,
    label: 'Email',
    primary: 'info@pixelversestudios.io',
    href: 'mailto:info@pixelversestudios.io',
    secondary: 'Response within 24 hours',
  },
  {
    icon: Phone,
    label: 'Phone',
    primary: '(201) 638-1769',
    href: 'tel:+12016381769',
    secondary: 'Mon – Fri, 9am – 6pm EST',
  },
  {
    icon: MapPin,
    label: 'Location',
    primary: '79 Edgewater Road, Cliffside Park, NJ 07010',
    href: null,
    secondary: 'Serving North Jersey',
  },
] as const;

export function ContactInfoSection() {
  return (
    <section className="bg-[var(--pv-surface)] py-16 md:py-24">
      <Container>
        <div className="space-y-10">
          {/* Heading */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--pv-primary)]">
              Get in Touch
            </p>
            <h2 className="text-[1.75rem] font-semibold leading-snug text-[var(--pv-text)]">
              Contact Information
            </h2>
          </div>

          {/* 2-col layout: cards left, map right */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Left — info cards */}
            <div className="flex flex-col gap-4">
              {INFO_ITEMS.map(({ icon: Icon, label, primary, href, secondary }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] p-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--pv-primary)_10%,transparent)]">
                    <Icon className="h-5 w-5 text-[var(--pv-primary)]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="mb-0.5 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--pv-text-muted)]">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="break-all text-sm font-medium text-[var(--pv-text)] transition-colors hover:text-[var(--pv-primary)]"
                      >
                        {primary}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-[var(--pv-text)]">{primary}</p>
                    )}
                    <p className="mt-0.5 text-xs text-[var(--pv-text-muted)]">{secondary}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — Google Maps iframe */}
            <div className="overflow-hidden rounded-xl border border-[var(--pv-border)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3020.5432!2d-73.98905!3d40.82238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f4b1e2a5c3e7%3A0x5f3e2a1b4c6d7e8f!2s79%20Edgewater%20Rd%2C%20Cliffside%20Park%2C%20NJ%2007010!5e0!3m2!1sen!2sus!4v1700000000000"
                width="100%"
                className="h-[300px] lg:h-full lg:min-h-[380px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PixelVerse Studios location — 79 Edgewater Rd, Cliffside Park NJ"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
