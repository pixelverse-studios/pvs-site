// ============================================================================
// About Page Data Structure
// ============================================================================
// Centralized content for the About page following narrative-driven architecture
// All components consume from this single source of truth

// ----------------------------------------------------------------------------
// Type Definitions
// ----------------------------------------------------------------------------

export interface AboutHero {
  eyebrow: string;
  title: string;
  description: string;
}

export interface NarrativeSection {
  title: string;
  intro: string;
  bulletPoints: Array<{ text: string }>;
  closing: string;
}

export interface ProseSection {
  title: string;
  body: string;
}

export interface CtaSection {
  title: string;
  description: string;
  cta: { label: string; href: string };
}

export interface TeamMember {
  name: string;
  title: string;
  bio: string;
  photo?: string;
  initials: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  authorTitle?: string;
  business: string;
  location?: string;
}

export interface GoogleReviews {
  rating: number;
  reviewCount: number;
  gbpUrl: string;
}

export interface AboutContentData {
  hero: AboutHero;
  ourApproach: NarrativeSection;
  builtForClarity: NarrativeSection;
  designDevOptimization: NarrativeSection;
  longTermPerspective: ProseSection;
  team: {
    heading: string;
    subheading: string;
    members: TeamMember[];
  };
  testimonials: Testimonial[];
  googleReviews: GoogleReviews;
  letsTalk: CtaSection;
}

// ----------------------------------------------------------------------------
// Content Data
// ----------------------------------------------------------------------------

export const aboutContent: AboutContentData = {
  // --------------------------------------------------------------------------
  // Hero
  // --------------------------------------------------------------------------
  hero: {
    eyebrow: 'About Pixelverse Studios',
    title: 'How We Work',
    description:
      'Pixelverse Studios partners with businesses to plan, build, and improve websites with intention and long-term use in mind.\n\nBusinesses often come to us feeling unsure about what their website should be doing, why it isn\'t working, or what to fix first. Our role is to slow that moment down, ask the right questions, and help clarify what actually needs to happen before decisions are made.\n\nThat approach shapes everything we do.',
  },

  // --------------------------------------------------------------------------
  // Our Approach
  // --------------------------------------------------------------------------
  ourApproach: {
    title: 'Our Approach',
    intro:
      'We don\'t treat websites as isolated design or technical projects. We treat them as systems that need to support real business goals.',
    bulletPoints: [
      { text: 'understanding what the business needs the website to accomplish' },
      { text: 'identifying what\'s helping or holding things back' },
      { text: 'making decisions based on structure, clarity, and long-term use' },
    ],
    closing:
      'Sometimes that leads to building something new. Other times it means improving what already exists. The work changes, but the thinking stays consistent.',
  },

  // --------------------------------------------------------------------------
  // Built for Clarity, Not Assumptions
  // --------------------------------------------------------------------------
  builtForClarity: {
    title: 'Built for Clarity, Not Assumptions',
    intro:
      'Many websites struggle because early decisions were made without enough context. Design choices, development approaches, or SEO tactics were applied before the underlying problem was clearly understood.\n\nWe work differently.\n\nBefore recommending a direction, we take the time to understand:',
    bulletPoints: [
      { text: 'the current situation' },
      { text: 'the constraints involved' },
      { text: 'what success actually looks like for the business' },
    ],
    closing:
      'That clarity helps avoid unnecessary work and keeps effort focused where it matters most.',
  },

  // --------------------------------------------------------------------------
  // Design, Development, and Optimization Working Together
  // --------------------------------------------------------------------------
  designDevOptimization: {
    title: 'Design, Development, and Optimization Working Together',
    intro:
      'Our work spans web design, development, and local optimization, but those disciplines aren\'t treated as separate silos.',
    bulletPoints: [
      { text: 'Design supports clarity and usability.' },
      { text: 'Development provides stability and flexibility.' },
      { text: 'Optimization helps the site remain visible and effective over time.' },
    ],
    closing:
      'By treating these as connected parts of the same system, we\'re able to make decisions that hold up beyond launch and adapt as needs change.',
  },

  // --------------------------------------------------------------------------
  // A Long-Term Perspective
  // --------------------------------------------------------------------------
  longTermPerspective: {
    title: 'A Long-Term Perspective',
    body: 'We don\'t view websites as one-time deliverables.\n\nBusinesses change. Services evolve. Markets shift. A website should be able to respond to that without becoming fragile or confusing.\n\nOur focus is on creating work that can be refined, improved, and built on over time, whether that\'s through ongoing optimization, iterative updates, or future growth.',
  },

  // --------------------------------------------------------------------------
  // Team
  // --------------------------------------------------------------------------
  team: {
    heading: 'Meet the people behind the operation',
    subheading:
      'Two specialists, one aligned mission — design smarter, build faster, and ship experiences you can scale.',
    members: [
      {
        name: 'Sami',
        title: 'UX Design',
        bio: 'Sami is a designer with a creative background in music, where the goal is always to make something people connect with. That same mindset guides his approach to design, understanding audiences, shaping experiences that resonate, and creating with purpose. When he\'s not designing, he\'s on the water fishing, recharging, and finding the balance that keeps his creativity flowing.',
        initials: 'S',
      },
      {
        name: 'Phil',
        title: 'Development',
        bio: 'With 7 years of experience in full-stack development, Phil builds scalable applications and solves complex technical challenges. He specializes in JavaScript, modern frameworks, databases, and web performance. Outside of work, he enjoys riding motorcycles and bikes\u2014long rides that clear his mind and spark new ideas.',
        initials: 'P',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // Client Testimonials (placeholders — replace with real quotes)
  // --------------------------------------------------------------------------
  testimonials: [
    {
      quote:
        'Working with PixelVerse felt different from other agencies we\'ve tried. They took the time to understand our business before proposing anything. The result was a website that actually reflects what we do and helps people take the next step.',
      author: 'Client Name',
      authorTitle: 'Owner',
      business: 'Business Name',
      location: 'Bergen County, NJ',
    },
    {
      quote:
        'We came in thinking we needed a full redesign, but after the initial conversation they helped us see that targeted improvements would get better results faster. That honesty saved us time and money, and the outcomes speak for themselves.',
      author: 'Client Name',
      authorTitle: 'Founder',
      business: 'Business Name',
      location: 'Bergen County, NJ',
    },
    {
      quote:
        'What stood out most was how connected everything felt. The design, the development, the SEO work — it all moved together instead of feeling like separate projects. Our site finally works the way we always wanted it to.',
      author: 'Client Name',
      authorTitle: 'Managing Director',
      business: 'Business Name',
      location: 'Bergen County, NJ',
    },
  ],

  // --------------------------------------------------------------------------
  // Google Reviews (placeholder — update with real data)
  // --------------------------------------------------------------------------
  googleReviews: {
    rating: 5.0,
    reviewCount: 0,
    gbpUrl: 'https://g.page/pixelversestudios',
  },

  // --------------------------------------------------------------------------
  // Let's Talk CTA
  // --------------------------------------------------------------------------
  letsTalk: {
    title: 'Let\'s Talk',
    description:
      'If you\'re questioning whether your website is doing what it should, or you\'re starting from scratch and want to make thoughtful decisions from the beginning, the next step is a conversation.\n\nThat conversation is used to understand your goals, current situation, and what kind of work makes sense before committing to anything.',
    cta: {
      label: 'Talk Through Your Situation',
      href: '/contact',
    },
  },
};
