import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { DocHeader } from '../components/doc-header';
import { Callout } from '../components/callout';
import { ChecklistSection } from '../components/checklist-section';
import { ChecklistItemStatic } from '../components/checklist-item';
import { TableOfContents } from '../components/table-of-contents';

export const metadata: Metadata = {
  title: 'SEO Checklist | Documentation | PixelVerse Studios',
  description:
    'Comprehensive hyper-local SEO checklist prioritized by impact on local search rankings.',
  robots: { index: false, follow: false },
};

const tocItems = [
  { id: 'gbp', title: 'Google Business Profile', level: 2 },
  { id: 'nap', title: 'NAP Consistency', level: 2 },
  { id: 'citations', title: 'Citations & Directories', level: 2 },
  { id: 'reviews', title: 'Reviews & Reputation', level: 2 },
  { id: 'content', title: 'Content Strategy', level: 2 },
  { id: 'schema', title: 'LocalBusiness Schema', level: 2 },
  { id: 'onpage', title: 'On-Page SEO', level: 2 },
  { id: 'technical', title: 'Technical SEO', level: 2 },
  { id: 'links', title: 'Local Link Building', level: 2 },
  { id: 'mobile', title: 'Mobile Optimization', level: 2 },
  { id: 'tracking', title: 'Tracking & Analytics', level: 2 },
  { id: 'maintenance', title: 'Monthly Maintenance', level: 2 },
];

export default function SeoChecklistPage() {
  return (
    <main className="pb-16 pt-8 md:pb-24">
      <Container className="max-w-6xl">
        <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-8">
          {/* Main content */}
          <div>
            <DocHeader
              title="Hyper-Local SEO Checklist"
              description="A prioritized checklist for local business websites. Items are ordered by impact on local search rankings."
              lastUpdated="Dec 2024"
              readTime="15 min"
            />

            <div className="space-y-6">
              {/* CRITICAL: GBP */}
              <section id="gbp">
                <Callout type="critical" title="Google Business Profile (32% of Local Ranking)">
                  GBP is the single biggest factor in local pack rankings. Prioritize this above all
                  else.
                </Callout>
                <ChecklistSection title="Google Business Profile" itemCount={16}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="critical">
                      Claim and verify the GBP listing
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Business name matches website exactly (no keyword stuffing)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Accurate <strong>NAP</strong> (Name, Address, Phone) matching website exactly
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>Correct primary category selected</ChecklistItemStatic>
                    <ChecklistItemStatic>
                      All relevant secondary categories added
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Complete business description with target keywords
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Service area defined (if service-area business)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Business hours accurate and kept updated
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Add <strong>20+ high-quality photos</strong> (exterior, interior, team, work)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>Add all services with descriptions</ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      <strong>4.5+ star rating</strong> with <strong>10+ reviews</strong> minimum
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Reply to ALL reviews within 24-48 hours
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Add Google Posts weekly (offers, updates, events)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>Add FAQ section to GBP</ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Enable messaging if you can respond promptly
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>Add products/menu if applicable</ChecklistItemStatic>
                  </div>
                </ChecklistSection>
              </section>

              {/* CRITICAL: NAP */}
              <section id="nap">
                <Callout type="critical" title="NAP Consistency (Foundation of Local SEO)">
                  Name, Address, Phone must be <strong>character-for-character identical</strong>{' '}
                  everywhere.
                </Callout>
                <ChecklistSection title="NAP Consistency" itemCount={7}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="critical">
                      Website header/footer
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">Contact page</ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      All location/city pages
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Google Business Profile
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      All directory listings
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>Social media profiles</ChecklistItemStatic>
                    <ChecklistItemStatic>Schema markup</ChecklistItemStatic>
                  </div>
                  <Callout type="warning" title="Common Mistakes to Avoid">
                    <ul className="mt-2 space-y-1">
                      <li>• &quot;Street&quot; vs &quot;St.&quot; vs &quot;St&quot;</li>
                      <li>• &quot;Suite 100&quot; vs &quot;#100&quot; vs &quot;Ste 100&quot;</li>
                      <li>
                        • &quot;(201) 555-1234&quot; vs &quot;201-555-1234&quot; vs
                        &quot;2015551234&quot;
                      </li>
                    </ul>
                    <p className="mt-2 font-medium">Pick ONE format and use it everywhere.</p>
                  </Callout>
                </ChecklistSection>
              </section>

              {/* CRITICAL: Citations */}
              <section id="citations">
                <Callout type="critical" title="Local Citations & Directories">
                  Build consistent listings on high-authority directories to establish local
                  relevance.
                </Callout>
                <ChecklistSection title="Tier 1 (Must Have)" itemCount={6}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="critical">
                      Google Business Profile
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Apple Maps / Apple Business Connect
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Bing Places for Business
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">Yelp</ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Facebook Business Page
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>LinkedIn Company Page</ChecklistItemStatic>
                  </div>
                </ChecklistSection>

                <div className="mt-4">
                  <ChecklistSection
                    title="Tier 2 (High Priority)"
                    itemCount={5}
                    defaultOpen={false}
                  >
                    <div className="space-y-1">
                      <ChecklistItemStatic>Better Business Bureau (BBB)</ChecklistItemStatic>
                      <ChecklistItemStatic>Yellow Pages / YP.com</ChecklistItemStatic>
                      <ChecklistItemStatic>Angi (formerly Angie&apos;s List)</ChecklistItemStatic>
                      <ChecklistItemStatic>Thumbtack</ChecklistItemStatic>
                      <ChecklistItemStatic>Nextdoor Business</ChecklistItemStatic>
                    </div>
                  </ChecklistSection>
                </div>

                <div className="mt-4">
                  <ChecklistSection
                    title="Tier 3 (Industry-Specific)"
                    itemCount={4}
                    defaultOpen={false}
                  >
                    <div className="space-y-1">
                      <ChecklistItemStatic>
                        Industry-specific directories relevant to the business
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>Local Chamber of Commerce</ChecklistItemStatic>
                      <ChecklistItemStatic>Local business associations</ChecklistItemStatic>
                      <ChecklistItemStatic>State/regional directories</ChecklistItemStatic>
                    </div>
                  </ChecklistSection>
                </div>

                <div className="mt-4">
                  <ChecklistSection title="Citation Audit" itemCount={4} defaultOpen={false}>
                    <div className="space-y-1">
                      <ChecklistItemStatic>
                        Use Moz Local, BrightLocal, or Whitespark to audit existing citations
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>Fix or remove duplicate listings</ChecklistItemStatic>
                      <ChecklistItemStatic>Update outdated NAP on old listings</ChecklistItemStatic>
                      <ChecklistItemStatic>
                        Remove listings for closed locations
                      </ChecklistItemStatic>
                    </div>
                  </ChecklistSection>
                </div>
              </section>

              {/* CRITICAL: Reviews */}
              <section id="reviews">
                <Callout type="critical" title="Reviews & Reputation">
                  Reviews are a top 3 local ranking factor and the #1 conversion factor.
                </Callout>
                <ChecklistSection title="Reviews & Reputation" itemCount={8}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="high">
                      Implement review generation strategy (email/SMS follow-ups)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Create a direct review link for easy customer access
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Respond to ALL reviews (positive and negative)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Address negative reviews professionally and promptly
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Never incentivize or fake reviews (Google will penalize)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Showcase reviews on website with schema markup
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Aim for <strong>steady review velocity</strong> (2-4+ per month)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Diversify reviews across platforms (Google, Yelp, Facebook, industry-specific)
                    </ChecklistItemStatic>
                  </div>
                </ChecklistSection>
              </section>

              {/* Content Strategy */}
              <section id="content">
                <SectionHeading>Hyper-Local Content Strategy</SectionHeading>
                <ChecklistSection title="City/Location Pages" itemCount={10}>
                  <Callout type="info">
                    For each priority city, create a dedicated page with the following elements:
                  </Callout>
                  <div className="mt-4 space-y-1">
                    <ChecklistItemStatic priority="high">
                      <strong>1,500+ words</strong> of unique content (not duplicated across cities)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      City name in title tag, H1, and URL
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      City name naturally throughout content (2-3% density)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      <strong>Local landmarks and neighborhoods</strong> mentioned
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      <strong>Driving directions</strong> or &quot;serving [city] from
                      [location]&quot; content
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Embedded Google Map for that service area
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      City-specific testimonials or case studies
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Local statistics or data relevant to the service
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>Internal links to main service pages</ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Clear CTA with phone number (click-to-call on mobile)
                    </ChecklistItemStatic>
                  </div>
                </ChecklistSection>

                <div className="mt-4">
                  <ChecklistSection
                    title="Priority City Selection"
                    itemCount={4}
                    defaultOpen={false}
                  >
                    <Callout type="info">
                      Focus on 3-5 cities before expanding. Selection criteria:
                    </Callout>
                    <div className="mt-4 space-y-1">
                      <ChecklistItemStatic>
                        Distance from business location (closer = easier to rank)
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>Population and search volume</ChecklistItemStatic>
                      <ChecklistItemStatic>
                        Competition level (check who&apos;s ranking now)
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>Revenue potential</ChecklistItemStatic>
                    </div>
                  </ChecklistSection>
                </div>
              </section>

              {/* Schema */}
              <section id="schema">
                <SectionHeading>LocalBusiness Schema</SectionHeading>
                <ChecklistSection title="Structured Data Requirements" itemCount={11}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="critical">
                      <strong>LocalBusiness schema</strong> on homepage with complete NAP
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      <strong>Per-city LocalBusiness schema</strong> on each city page
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Correct <code>@type</code> for business category (e.g.,
                      HomeAndConstructionBusiness, ProfessionalService)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      <code>areaServed</code> property listing service areas
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      <code>priceRange</code> property
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      <code>openingHours</code> property
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      <code>aggregateRating</code> with review data
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Validate with Google Rich Results Test
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      <strong>BreadcrumbList schema</strong> on all inner pages
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      <strong>Service schema</strong> for each service offered
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      <strong>FAQPage schema</strong> on FAQ sections
                    </ChecklistItemStatic>
                  </div>
                </ChecklistSection>
              </section>

              {/* On-Page SEO */}
              <section id="onpage">
                <SectionHeading>On-Page SEO Fundamentals</SectionHeading>
                <ChecklistSection title="On-Page Optimization" itemCount={10}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="critical">
                      Each page has a <strong>unique Title Tag</strong> (50-60 characters) with
                      location modifier
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Each page has a <strong>Meta Description</strong> (120-160 characters) with
                      location + CTA
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Only <strong>one H1 tag</strong> per page with primary keyword + location
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Headings (H2-H4) include <strong>relevant target keywords</strong>
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      All images include <strong>descriptive ALT text</strong> (include location
                      where natural)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Add <strong>canonical tag</strong> to each page
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Define <code>lang=&quot;en-US&quot;</code> in <code>&lt;html&gt;</code> tag
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Use descriptive <strong>friendly URLs</strong> (e.g., /plumber-fort-lee-nj/)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      <strong>Click-to-call links</strong> on all phone numbers
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Contact info visible on every page (header/footer minimum)
                    </ChecklistItemStatic>
                  </div>
                </ChecklistSection>
              </section>

              {/* Technical SEO */}
              <section id="technical">
                <SectionHeading>Technical SEO & Performance</SectionHeading>
                <ChecklistSection title="Core Requirements" itemCount={5}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="critical">
                      SSL certificate active (HTTPS)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Mobile-friendly / responsive design
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Page load time <strong>&lt;3 seconds</strong>
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Total page size <strong>&lt;2MB</strong>
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Core Web Vitals passing: LCP &lt; 2.5s, CLS &lt; 0.1, TBT &lt; 300ms
                    </ChecklistItemStatic>
                  </div>
                </ChecklistSection>

                <div className="mt-4">
                  <ChecklistSection title="Crawlability" itemCount={5} defaultOpen={false}>
                    <div className="space-y-1">
                      <ChecklistItemStatic>
                        Robots.txt allows intended pages to be crawled
                      </ChecklistItemStatic>
                      <ChecklistItemStatic priority="high">
                        XML Sitemap submitted to Google Search Console
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>No accidental noindex tags</ChecklistItemStatic>
                      <ChecklistItemStatic>
                        No orphan pages (all pages linked internally)
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>Fix all 404 errors</ChecklistItemStatic>
                    </div>
                  </ChecklistSection>
                </div>

                <div className="mt-4">
                  <ChecklistSection title="Image Optimization" itemCount={3} defaultOpen={false}>
                    <div className="space-y-1">
                      <ChecklistItemStatic priority="high">
                        <strong>Compress all images</strong> (WebP preferred, &lt;300KB each)
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>
                        <strong>Lazy-load</strong> images below the fold
                      </ChecklistItemStatic>
                      <ChecklistItemStatic>
                        Descriptive file names (e.g., fort-lee-plumber-fixing-pipe.webp)
                      </ChecklistItemStatic>
                    </div>
                  </ChecklistSection>
                </div>
              </section>

              {/* Link Building */}
              <section id="links">
                <SectionHeading>Local Link Building</SectionHeading>
                <Callout type="info">
                  Local backlinks signal geographic relevance to Google.
                </Callout>
                <ChecklistSection title="High-Value Local Links" itemCount={6}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="high">
                      Local Chamber of Commerce membership
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Sponsor local events, sports teams, or charities
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Partner with complementary local businesses
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Guest post on local blogs or news sites
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Get featured in local press/media
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>Join local business associations</ChecklistItemStatic>
                  </div>
                </ChecklistSection>
              </section>

              {/* Mobile */}
              <section id="mobile">
                <SectionHeading>Mobile Optimization</SectionHeading>
                <Callout type="info">60%+ of local searches happen on mobile.</Callout>
                <ChecklistSection title="Mobile Requirements" itemCount={8}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="high">
                      Mobile PageSpeed score &gt;=70
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Click-to-call on all phone numbers
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Click-to-map on addresses
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Buttons/tap targets large and accessible (48px minimum)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>Text legible without zooming</ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Forms easy to complete on mobile
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>No horizontal scrolling</ChecklistItemStatic>
                    <ChecklistItemStatic>Fast-loading (3G connection test)</ChecklistItemStatic>
                  </div>
                </ChecklistSection>
              </section>

              {/* Tracking */}
              <section id="tracking">
                <SectionHeading>Tracking & Analytics</SectionHeading>
                <ChecklistSection title="Analytics Setup" itemCount={8}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="critical">
                      Google Analytics 4 configured
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Google Search Console verified
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Track form submissions as conversions
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Track phone calls (use call tracking or GA4 events)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>Track click-to-call events</ChecklistItemStatic>
                    <ChecklistItemStatic>Track direction requests</ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Set up monthly ranking tracking for priority keywords
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>Monitor GBP Insights weekly</ChecklistItemStatic>
                  </div>
                </ChecklistSection>
              </section>

              {/* Maintenance */}
              <section id="maintenance">
                <SectionHeading>Monthly Maintenance</SectionHeading>
                <ChecklistSection title="Ongoing Tasks" itemCount={8}>
                  <div className="space-y-1">
                    <ChecklistItemStatic priority="high">
                      Post to GBP weekly (minimum)
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="critical">
                      Check for and respond to new reviews
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Monitor Search Console for errors
                    </ChecklistItemStatic>
                    <ChecklistItemStatic priority="high">
                      Check rankings for priority keywords
                    </ChecklistItemStatic>
                    <ChecklistItemStatic>Audit NAP consistency quarterly</ChecklistItemStatic>
                    <ChecklistItemStatic>Update seasonal content/offers</ChecklistItemStatic>
                    <ChecklistItemStatic>Add new photos to GBP monthly</ChecklistItemStatic>
                    <ChecklistItemStatic>
                      Review and update business hours if needed
                    </ChecklistItemStatic>
                  </div>
                </ChecklistSection>
              </section>

              {/* Footer */}
              <div
                className="mt-12 rounded-xl border p-6 text-center"
                style={{
                  background: 'var(--pv-surface)',
                  borderColor: 'var(--pv-border)',
                }}
              >
                <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
                  <strong>Version:</strong> 2.0 &nbsp;|&nbsp; <strong>Purpose:</strong> Prioritized
                  hyper-local SEO standards for local business websites
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents - Sticky sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={tocItems} />
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--pv-text)' }}>
      {children}
    </h2>
  );
}
