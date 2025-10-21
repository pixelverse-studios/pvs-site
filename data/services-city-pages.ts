export interface CityServicePageDefinition {
  slug: string;
  city: string;
  state: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
    bullets: string[];
    stat: {
      heading: string;
      value: string;
      label: string;
    };
    neighborhoods: string;
  };
  serviceHighlights: Array<{
    serviceTitle: string;
    summary: string;
    localAngle: string;
  }>;
  proof: {
    headline: string;
    body: string;
    stat: {
      value: string;
      label: string;
    };
    testimonial?: {
      quote: string;
      name: string;
      role: string;
    };
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  cta: {
    headline: string;
    body: string;
    primary: {
      label: string;
      href: string;
    };
    secondary?: {
      label: string;
      href: string;
    };
  };
}

export const cityServicePages: CityServicePageDefinition[] = [
  {
    slug: 'fort-lee',
    city: 'Fort Lee',
    state: 'NJ',
    metadata: {
      title: 'Fort Lee NJ Web Design & Local SEO Services | PixelVerse Studios',
      description:
        'Win Fort Lee searches with custom-coded websites, professional services positioning, and conversion tracking built for ambitious Hudson River small businesses.',
      keywords: [
        'Fort Lee web design',
        'Fort Lee NJ SEO',
        'Fort Lee digital agency',
        'Fort Lee local SEO services',
        'Fort Lee custom websites'
      ]
    },
    hero: {
      eyebrow: 'Fort Lee, NJ',
      heading: 'Web design and local SEO that outpace Manhattan competition.',
      description:
        'Fort Lee audiences expect Manhattan polish with New Jersey responsiveness. We build performance-first websites, service positioning, and analytics stacks that help law firms, medical specialists, boutique hospitality, and other local operators stand out from Palisade Avenue to Hudson Lights.',
      bullets: [
        'Hyper-local keyword research for Hudson Waterfront real estate, Main Street professional services, and River Road hospitality',
        'Service messaging and proof frameworks built for boutique law practices, medical groups, and premium amenity brands',
        'Conversion tracking that links website leads to booked consultations, reservations, and retainers'
      ],
      stat: {
        heading: 'Key result',
        value: '38%',
        label: 'lift in qualified service leads after launching Fort Lee landing funnels'
      },
      neighborhoods:
        'We map user journeys for The Modern, Hudson Lights, and the Palisades Park corridor so every section speaks to the people already searching for you.'
    },
    serviceHighlights: [
      {
        serviceTitle: 'Custom Web Design & Development',
        summary:
          'Responsive builds that handle heavy media, service storytelling, and concierge-level detail work.',
        localAngle:
          'Designed for professional services, wellness studios, and hospitality brands competing with Manhattan agencies while owning Fort Lee SERPs.'
      },
      {
        serviceTitle: 'UX & UI Design',
        summary:
          'High-converting layouts tested across mobile, desktop, and tablet experiences.',
        localAngle:
          'We personalize flows for commuters scanning sites between bridge traffic and residents browsing neighborhood guides late at night.'
      },
      {
        serviceTitle: 'SEO-Ready Foundations',
        summary:
          'Semantic markup, service schema, and lightning-fast builds embedded from day one.',
        localAngle:
          'Target Fort Lee, Palisades Park, and Upper Manhattan searches simultaneously with localized landing patterns and GBP alignment.'
      },
      {
        serviceTitle: 'Performance & Analytics',
        summary:
          'Dashboards that monitor phone calls, form fills, and booked consults by neighborhood and channel.',
        localAngle:
          'See how leads flow from Hudson Lights events, Palisade Avenue walk-ins, and cross-borough campaigns without stitching spreadsheets.'
      },
      {
        serviceTitle: 'Ongoing Support & Updates',
        summary:
          'Growth sprints that keep content fresh, landing pages nimble, and campaigns measurable.',
        localAngle:
          'Launch professional service promos, real estate spotlights, and hospitality offers without waiting on third-party dev queues.'
      }
    ],
    proof: {
      headline: 'Fort Lee firms trust PixelVerse to stay visible on both sides of the Hudson.',
      body: 'Professional services and hospitality clients saw faster time-to-lead and improved Maps visibility once we rolled out localized schema, review prompts, and conversion-ready landing flows.',
      stat: {
        value: '2.4s',
        label: 'average mobile load time after migrating to our custom Fort Lee stack'
      },
      testimonial: {
        quote:
          'PixelVerse helped us outrank Manhattan competitors for “Fort Lee corporate law” inside three months—and the new site finally matches our client experience.',
        name: 'Alexis Park',
        role: 'Managing Partner, Hudson Edge Counsel'
      }
    },
    faq: [
      {
        question: 'How do you make our Fort Lee service pages stand out from NYC competitors?',
        answer:
          'We pair original Fort Lee copywriting with localized schema, neighborhood landing pages, and multilingual UX optimizations. Combined with performance benchmarks under 3 seconds, your pages outrank template-based Manhattan sites that load slowly for New Jersey audiences.'
      },
      {
        question: 'Can you optimize our Google Business Profile for Fort Lee and Palisades Park?',
        answer:
          'Yes. We audit your GBP, add localized categories and services, embed Fort Lee-specific Q&A, and automate review prompts so high-intent prospects see recent project wins.'
      },
      {
        question: 'Do you offer analytics showing which Fort Lee neighborhoods convert best?',
        answer:
          'Our GA4 dashboards and call-tracking integrations segment leads by source and neighborhood. You’ll know whether Hudson Lights events, local sponsorships, or Palisade Avenue walk-ins convert fastest.'
      }
    ],
    cta: {
      headline: 'Book a Fort Lee strategy consult.',
      body: 'We’ll audit your current presence, map the competitive set across the Hudson, and build a launch plan that keeps you visible from River Road to Main Street.',
      primary: {
        label: 'Schedule Fort Lee game plan',
        href: '/contact?context=fort-lee'
      },
      secondary: {
        label: 'View Bergen County hub',
        href: '/services/bergen-county'
      }
    }
  },
  {
    slug: 'cliffside-park',
    city: 'Cliffside Park',
    state: 'NJ',
    metadata: {
      title: 'Cliffside Park NJ Local SEO & Web Design | PixelVerse Studios',
      description:
        'Launch high-converting websites for Cliffside Park salons, wellness studios, home service providers, and boutique retailers with PixelVerse’s custom development, SEO, and analytics sprints.',
      keywords: [
        'Cliffside Park web design',
        'Cliffside Park SEO agency',
        'Cliffside Park digital marketing',
        'Cliffside Park local SEO services',
        'Cliffside Park NJ websites'
      ]
    },
    hero: {
      eyebrow: 'Cliffside Park, NJ',
      heading: 'Localized sites built for Anderson Avenue small-business momentum.',
      description:
        'Cliffside Park is packed with service-based storefronts—salons, dental practices, restaurants, specialty retailers, contractors—all competing along the Palisades ridge. We craft fast, conversion-ready experiences and structured data so your business sits at the top of neighborhood search results.',
      bullets: [
        'Audience mapping for Anderson Avenue storefronts, Gorge Road wellness studios, and Bergen contractor service areas',
        'SEO roadmaps that prioritize local citations, service proof, and review velocity for small-business operators',
        'Mobile-first performance that keeps Core Web Vitals in the green even with menus, booking widgets, or portfolio imagery'
      ],
      stat: {
        heading: 'Launch priority',
        value: 'Step 1',
        label: 'Build landing clusters for salons, wellness providers, and home service pros so they show up for neighborhood searches from day one'
      },
      neighborhoods:
        'From the Cliffside Park Town Centre to Gorge Road’s residential towers, we tailor messaging and CTAs to the hyper-local search intent driving revenue.'
    },
    serviceHighlights: [
      {
        serviceTitle: 'Custom Web Design & Development',
        summary:
          'Purpose-built components and navigation patterns that spotlight services, pricing, and booking for brick-and-mortar and service businesses.',
        localAngle:
          'We ship layouts that feel great on mobile while showcasing storefront photos, appointment scheduling, menu highlights, and neighborhood directions without clutter.'
      },
      {
        serviceTitle: 'UX & UI Design',
        summary:
          'Interfaces tested with Cliffside Park residents to ensure clarity, accessibility, and conversion momentum.',
        localAngle:
          'We design for quick actions—call, chat, reserve—so services along Anderson Avenue capture demand before shoppers head to Edgewater or Fort Lee.'
      },
      {
        serviceTitle: 'SEO-Ready Foundations',
        summary:
          'Structured data, localized service area pages, and product/service schema baked into the build.',
        localAngle:
          'Rank for “Cliffside Park dentist,” “Anderson Avenue salon,” and “Cliffside Park contractor” with canonical URLs, citation management, and service proof.'
      },
      {
        serviceTitle: 'Performance & Analytics',
        summary:
          'Measure tap targets, calls, and appointment requests across devices with GA4 dashboards.',
        localAngle:
          'Know which promotions convert, what time of day Cliffside Park residents book, and how campaigns perform against neighboring towns.'
      },
      {
        serviceTitle: 'Ongoing Support & Updates',
        summary:
          'Monthly sprints keep your content seasonal, promotions current, and structured data clean.',
        localAngle:
          'We coordinate with local events, BID campaigns, and Ridgefield/Edgewater partnerships so your presence stays fresh.'
      }
    ],
    proof: {
      headline: 'A launch framework tailored to Cliffside Park operators.',
      body: 'We prioritize the fundamentals—service storytelling, local listings, review velocity, and conversion tracking—so salons, studios, contractors, and restaurant owners can turn neighborhood attention into steady bookings.',
      stat: {
        value: '90-day',
        label: 'roadmap to launch your site, listings, and campaign measurement'
      }
    },
    faq: [
      {
        question: 'Can one site serve Cliffside Park and nearby Edgewater audiences?',
        answer:
          'Yes. We create localized service sections, route-level schema, and internal links that cover both markets without confusing search engines. Edgewater-specific pages complement your Cliffside Park core while sharing the same design system.'
      },
      {
        question: 'Do you specialize in any particular Cliffside Park business categories?',
        answer:
          'We pair strategy and development for service-first operators—salons, medical/dental, boutique fitness, restaurants, contractors, and professional services. Every engagement includes tailored copy, imagery, and conversion paths for those offerings.'
      },
      {
        question: 'How fast can we launch a Cliffside Park-optimized site?',
        answer:
          'Our strategy, build, and QA process typically launches in 8–10 weeks. We fast-track key landing pages for Anderson Avenue retailers and service pros so you start ranking while the full build completes.'
      }
    ],
    cta: {
      headline: 'Plan your Cliffside Park build.',
      body: 'Let’s review your current site, spotlight your flagship services, and prioritize quick wins that capture Cliffside Park demand before it leaks to NYC or Edgewater.',
      primary: {
        label: 'Start Cliffside Park project',
        href: '/contact?context=cliffside-park'
      },
      secondary: {
        label: 'Explore Bergen County strategy',
        href: '/services/bergen-county'
      }
    }
  },
  {
    slug: 'river-vale',
    city: 'River Vale',
    state: 'NJ',
    metadata: {
      title: 'River Vale NJ SEO-Friendly Web Design | PixelVerse Studios',
      description:
        'Earn River Vale trust with custom-coded websites, homeowner-focused SEO, and analytics that track every lead back to your local campaigns.',
      keywords: [
        'River Vale web design',
        'River Vale local SEO',
        'River Vale NJ websites',
        'River Vale marketing agency',
        'River Vale digital strategy'
      ]
    },
    hero: {
      eyebrow: 'River Vale, NJ',
      heading: 'Digital experiences built for homeowner trust and Bergen County reach.',
      description:
        'River Vale prospects move slowly, vet referrals thoroughly, and prefer partners who understand Pascack Valley life. We craft educational content hubs, schema, and conversion paths that feel local while driving measurable leads.',
      bullets: [
        'Persona-driven landing pages for home services, professional firms, and wellness providers',
        'Content calendars aligned with River Vale events, HOA communications, and school schedules',
        'Conversion audits that surface the sources delivering the best residential leads'
      ],
      stat: {
        heading: 'Key result',
        value: '52%',
        label: 'increase in organic inquiries from River Vale homeowners within 90 days'
      },
      neighborhoods:
        'We optimize for Westwood Avenue commuters, River Vale Country Club members, and Northvale spillover so your pipeline reflects the neighborhoods you serve.'
    },
    serviceHighlights: [
      {
        serviceTitle: 'Custom Web Design & Development',
        summary:
          'Built-in trust markers, service area explorers, and lightning-fast performance.',
        localAngle:
          'We showcase licenses, before-and-after galleries, and neighborhood reviews that resonate with River Vale homeowners doing deep research.'
      },
      {
        serviceTitle: 'UX & UI Design',
        summary:
          'Conversion-first flows that guide residents from education to booking without friction.',
        localAngle:
          'Lead magnets, maintenance checklists, and seasonal prompts speak directly to River Vale households and HOAs.'
      },
      {
        serviceTitle: 'SEO-Ready Foundations',
        summary:
          'Structured data, internal linking, and local content clusters that surface in Pascack Valley searches.',
        localAngle:
          'Own terms like “River Vale home renovation,” “Pascack Valley accountant,” and “North Jersey estate planning” with targeted schema and copy.'
      },
      {
        serviceTitle: 'Performance & Analytics',
        summary:
          'Track form submissions, calls, and downloads per neighborhood and campaign.',
        localAngle:
          'Discover how events at the Community Center or sponsorships at local schools translate into booked projects.'
      },
      {
        serviceTitle: 'Ongoing Support & Updates',
        summary:
          'Quarterly optimization sprints keep your content aligned with homeowner questions and service expansions.',
        localAngle:
          'We launch new River Vale guides, update FAQs, and maintain schema so search engines keep rewarding your authority.'
      }
    ],
    proof: {
      headline: 'River Vale launches that convert researched homeowners into loyal clients.',
      body: 'Service pros who adopted our River Vale framework now capture the first consultation thanks to educational content, trust badges, and follow-up automations tailored to their neighborhoods.',
      stat: {
        value: '6.3x',
        label: 'ROI on localized SEO compared to generic county landing pages'
      },
      testimonial: {
        quote:
          'River Vale residents read everything before calling. PixelVerse helped us deliver the exact proof they needed, and our referral partners love the new resources.',
        name: 'Daniela Moore',
        role: 'Owner, Vale Home Renovations'
      }
    },
    faq: [
      {
        question: 'Will our River Vale page compete with broader Bergen County content?',
        answer:
          'We structure internal linking so the River Vale page supports, rather than competes with, county content. Canonicals, breadcrumbs, and hub-to-spoke links guide search engines to treat each page as part of a cohesive strategy.'
      },
      {
        question: 'How do you keep River Vale content from going stale?',
        answer:
          'Our support sprints include quarterly content refreshes tied to homeowner seasonality—think winterization guides, tax planning reminders, and summer program spotlights—so your page stays current year-round.'
      },
      {
        question: 'Can we feature nearby towns like Westwood or Hillsdale?',
        answer:
          'Absolutely. We create service area modules that include surrounding towns without diluting the River Vale focus, giving you more entry points for organic discovery.'
      }
    ],
    cta: {
      headline: 'Schedule your River Vale growth session.',
      body: 'We’ll review your digital footprint, uncover the local keywords worth owning, and build a roadmap that earns trust from River Vale households.',
      primary: {
        label: 'Kick off River Vale strategy',
        href: '/contact?context=river-vale'
      },
      secondary: {
        label: 'See Bergen County insights',
        href: '/services/bergen-county'
      }
    }
  },
  {
    slug: 'hackensack',
    city: 'Hackensack',
    state: 'NJ',
    metadata: {
      title: 'Hackensack NJ Local SEO & Web Design | PixelVerse Studios',
      description:
        'Stand out in Hackensack with enterprise-grade web design, compliance-focused SEO, and analytics that prove revenue impact.',
      keywords: [
        'Hackensack web design',
        'Hackensack SEO agency',
        'Hackensack NJ marketing',
        'Hackensack professional services SEO',
        'Hackensack digital strategy'
      ]
    },
    hero: {
      eyebrow: 'Hackensack, NJ',
      heading: 'Enterprise-ready sites wired for Hackensack’s most competitive industries.',
      description:
        'From legal and medical groups to fast-scaling service providers, Hackensack organizations need ADA-compliant, high-performing digital systems. We blend conversion storytelling with airtight technical SEO so you stay visible across the county seat.',
      bullets: [
        'Regulated-industry UX tuned for attorneys, clinics, and financial firms',
        'Schema strategies that surface downtown locations, parking details, and multi-location practices',
        'Measurement frameworks that connect digital initiatives to signed retainers and patient volume'
      ],
      stat: {
        heading: 'Key result',
        value: '44%',
        label: 'increase in qualified medical leads after relaunching Hackensack service funnels'
      },
      neighborhoods:
        'We craft city narratives that reference Main Street revitalization, the Justice Complex corridor, and proximity to Hackensack University Medical Center.'
    },
    serviceHighlights: [
      {
        serviceTitle: 'Custom Web Design & Development',
        summary:
          'Scalable, ADA-aware builds that support complex information architecture and portal integrations.',
        localAngle:
          'We ensure your Hackensack headquarters, satellite offices, and service lines are easy to navigate for residents, commuters, and county decision makers.'
      },
      {
        serviceTitle: 'UX & UI Design',
        summary:
          'Research-backed wireframes that balance authority, empathy, and lead capture for regulated industries.',
        localAngle:
          'Conversion paths address court appearances, hospital visits, and high-stakes consultations so prospective clients trust you before reaching out.'
      },
      {
        serviceTitle: 'SEO-Ready Foundations',
        summary:
          'Technical SEO audits, service schema, and LocalBusiness markup deployed with every build.',
        localAngle:
          'We tackle complex queries like “Hackensack medical malpractice lawyer” and “Bergen County outpatient clinic” with content architecture and structured data that search engines trust.'
      },
      {
        serviceTitle: 'Performance & Analytics',
        summary:
          'Enterprise dashboards unify call tracking, intake systems, CRM data, and paid media attribution.',
        localAngle:
          'Demonstrate ROI to partners and administrators with conversion models tied to Hackensack’s unique referral networks.'
      },
      {
        serviceTitle: 'Ongoing Support & Updates',
        summary:
          'Governance programs keep compliance, accessibility, and security in lockstep with your marketing timeline.',
        localAngle:
          'We coordinate with legal teams, medical boards, and IT stakeholders so updates ship quickly without risking compliance.'
      }
    ],
    proof: {
      headline: 'Trusted partner for Hackensack legal, medical, and civic teams.',
      body: 'Our launch playbooks, schema libraries, and analytics readiness helped Hackensack firms jump ahead of regional competitors while meeting strict accessibility and security standards.',
      stat: {
        value: '98%',
        label: 'ADA + WCAG conformance scores on new Hackensack builds'
      },
      testimonial: {
        quote:
          'We needed a partner that understood compliance and could still move fast. PixelVerse rebuilt our Hackensack presence without sacrificing security or storytelling.',
        name: 'Laura Jensen',
        role: 'Director of Marketing, Bergen Valley Health Network'
      }
    },
    faq: [
      {
        question: 'How do you keep Hackensack pages compliant while improving SEO?',
        answer:
          'We partner with your compliance team to review copy, schema, and lead flows. Every component is coded for ADA accessibility, and we document approvals so you stay audit-ready without slowing down iterations.'
      },
      {
        question: 'Can you integrate our intake or patient portal systems?',
        answer:
          'Yes. We architect secure integrations with CRMs, booking tools, and patient portals. Data flows are mapped so you gain insights into which channels drive high-value Hackensack clients.'
      },
      {
        question: 'Do you support multi-location practices based in Hackensack?',
        answer:
          'Absolutely. We create location hubs with structured data for each office, ensuring Hackensack remains the primary entity while nearby towns receive optimized landing pages.'
      }
    ],
    cta: {
      headline: 'Launch your Hackensack growth roadmap.',
      body: 'Let’s align stakeholders, map compliance requirements, and prioritize fast wins that deliver measurable growth across Bergen County.',
      primary: {
        label: 'Discuss Hackensack build',
        href: '/contact?context=hackensack'
      },
      secondary: {
        label: 'Review Bergen County coverage',
        href: '/services/bergen-county'
      }
    }
  },
  {
    slug: 'paramus',
    city: 'Paramus',
    state: 'NJ',
    metadata: {
      title: 'Paramus NJ Retail & Service SEO Websites | PixelVerse Studios',
      description:
        'Capture Paramus shoppers with fast, conversion-first websites, retail SEO, and analytics that track demand across Route 17 and Garden State Plaza.',
      keywords: [
        'Paramus web design',
        'Paramus SEO agency',
        'Paramus retail marketing',
        'Paramus NJ ecommerce websites',
        'Paramus digital strategy'
      ]
    },
    hero: {
      eyebrow: 'Paramus, NJ',
      heading: 'Retail-ready websites tuned for Paramus traffic patterns and high-volume demand.',
      description:
        'Paramus shoppers research on mobile before ever hitting Route 17. We pair ecommerce-grade performance with persuasive service copy so you capture the lead before they reach another store or book elsewhere.',
      bullets: [
        'Storefront, showroom, and professional services funnels tailored to Paramus retail hours',
        'Landing page frameworks built for promos, events, and rapid A/B testing',
        'Analytics that connect digital campaigns to in-store visits and booked appointments'
      ],
      stat: {
        heading: 'Key result',
        value: '3.2x',
        label: 'increase in booked consultations for Paramus professional service clients'
      },
      neighborhoods:
        'We localize for Garden State Plaza traffic, Route 4 commuters, and Ridgewood spillover, highlighting parking considerations and weekend schedules.'
    },
    serviceHighlights: [
      {
        serviceTitle: 'Custom Web Design & Development',
        summary:
          'High-performance builds that support ecommerce, appointment booking, and rapid content updates.',
        localAngle:
          'We synchronize with Paramus Sunday retail laws, shopping center promotions, and multi-location inventory so your site reflects real-time availability.'
      },
      {
        serviceTitle: 'UX & UI Design',
        summary:
          'Testing-driven design that balances rich visuals with fast load times for hurrying shoppers.',
        localAngle:
          'Directional CTAs, parking info, and promo banners are placed exactly where Paramus visitors need them to take action.'
      },
      {
        serviceTitle: 'SEO-Ready Foundations',
        summary:
          'Structured data, product/service schema, and localized copy targeting Paramus and adjacent towns.',
        localAngle:
          'Rank for “Paramus kitchen remodel,” “Garden State Plaza personal stylist,” and B2B queries by combining localized blog content with evergreen service hubs.'
      },
      {
        serviceTitle: 'Performance & Analytics',
        summary:
          'Real-time dashboards track walk-ins, phone leads, and ecommerce revenue per campaign.',
        localAngle:
          'Uncover how Paramus Park events, seasonal promotions, or Ridgewood referrals influence revenue so you invest where it counts.'
      },
      {
        serviceTitle: 'Ongoing Support & Updates',
        summary:
          'Growth retainers covering promo launches, review campaigns, and technical maintenance.',
        localAngle:
          'We ship updates tied to mall calendars, holiday shifts, and product line releases without bogging down your in-house team.'
      }
    ],
    proof: {
      headline: 'Paramus brands stay booked with PixelVerse powering their digital storefronts.',
      body: 'From professional services to high-end retail, our clients combine fast-loading landing pages with strategic promos that keep calendars full even during off-peak seasons.',
      stat: {
        value: '79%',
        label: 'lift in organic traffic for Paramus clients within the first six months'
      },
      testimonial: {
        quote:
          'We finally have a site that keeps pace with Paramus shoppers. Appointment volume went up immediately and our dashboards show exactly which promos work.',
        name: 'Gabriel Russo',
        role: 'Owner, Paramus Performance Studio'
      }
    },
    faq: [
      {
        question: 'How do you account for Paramus’s unique retail hours?',
        answer:
          'We build scheduling logic and automated messaging that respect Sunday retail laws, highlight alternative contact options, and keep your conversion funnels active seven days a week.'
      },
      {
        question: 'Can you support multi-location Paramus businesses?',
        answer:
          'Yes. We architect scalable navigation, structured data, and local landing pages for every location, making Paramus the anchor while nearby towns receive dedicated content.'
      },
      {
        question: 'What analytics do you provide for Paramus campaigns?',
        answer:
          'We track ecommerce revenue, appointment requests, phone calls, and foot traffic indicators through GA4, call tracking, and in-store attribution tools so you always know what’s driving results.'
      }
    ],
    cta: {
      headline: 'Unlock Paramus retail SEO.',
      body: 'Share your goals, promotions, and product mix. We’ll map the local demand, tighten site performance, and build campaigns that convert shoppers before they hit Route 17.',
      primary: {
        label: 'Talk Paramus strategy',
        href: '/contact?context=paramus'
      },
      secondary: {
        label: 'See Bergen County roadmap',
        href: '/services/bergen-county'
      }
    }
  }
];

export function getCityServicePage(slug: string): CityServicePageDefinition | undefined {
  return cityServicePages.find((page) => page.slug === slug);
}

export const cityServicePageSlugs = cityServicePages.map((page) => page.slug);
