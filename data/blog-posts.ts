export type BlogPostContentBlock =
  | {
      type: 'paragraph';
      content: string;
    }
  | {
      type: 'heading';
      content: string;
    }
  | {
      type: 'list';
      items: string[];
      ordered?: boolean;
    }
  | {
      type: 'quote';
      content: string;
      attribution?: string;
    };

export interface BlogPostAuthor {
  name: string;
  role: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  featured?: boolean;
  coverGradient: string;
  accentColor: string;
  author: BlogPostAuthor;
  content: BlogPostContentBlock[];
  highlights?: string[];
}

const defaultAuthor: BlogPostAuthor = {
  name: 'PixelVerse Studios Editorial Team',
  role: 'Strategy & UX',
};

const blogPosts: BlogPost[] = [
  {
    slug: 'focus-on-growth-not-diy-digital',
    title: 'Focus on Growth, Not DIY Digital: Why Small Businesses Need a Dedicated Partner',
    excerpt:
      'Your team should be building relationships and revenue, not wrestling with website tweaks, SEO experiments, and campaign dashboards. Here is how delegating digital ops protects momentum.',
    category: 'Growth Strategy',
    tags: ['Small Business', 'Delegation', 'Digital Strategy'],
    publishedAt: '2025-10-26T11:30:00.000Z',
    readingMinutes: 7,
    featured: true,
    coverGradient: 'linear-gradient(135deg, rgba(63,0,233,0.35) 0%, rgba(201,71,255,0.42) 100%)',
    accentColor: 'rgba(63,0,233,0.45)',
    author: defaultAuthor,
    content: [
      {
        type: 'paragraph',
        content:
          'The most ambitious small business leaders we meet are already stretching a 10-hour workday across sales, hiring, service delivery, and finance. Yet their weekends disappear into website tweaks, SEO audits, and marketing automation fixes. Every hour spent trying to master another platform is an hour stolen from the work only they can do.',
      },
      {
        type: 'heading',
        content: 'Owners should captain the strategy, not the software',
      },
      {
        type: 'paragraph',
        content:
          'Your competitive edge is how well you understand the people you serve. When leaders bury themselves in CMS updates or schema markup, the rest of the team loses access to that direction. Delegating digital execution lets you stay in the boardroom, the showroom, and the conversations that move revenue forward.',
      },
      {
        type: 'list',
        items: [
          'Reclaim 10+ hours a week to focus on sales, partnerships, and product decisions',
          'Ensure your website, SEO, and analytics keep pace with algorithm and platform shifts',
          'Get a single partner who can prioritize fixes based on conversion impact, not guesswork',
        ],
      },
      {
        type: 'heading',
        content: 'Delegation is more than outsourcing tasks',
      },
      {
        type: 'paragraph',
        content:
          'Handing off digital operations should feel like adding an embedded team, not another vendor to manage. At PixelVerse we translate your growth targets into a roadmap: technical cleanup, conversion-focused UX, keyword-driven content, and analytics that prove ROI. Weekly syncs keep you informed without dragging you into execution mode.',
      },
      {
        type: 'quote',
        content:
          'Our best clients stopped wearing the webmaster hat. Once they did, revenue conversations finally got the daily attention they deserved.',
        attribution: 'Phil, Lead Developer',
      },
      {
        type: 'heading',
        content: 'The payoff: a marketing engine that runs while you scale',
      },
      {
        type: 'paragraph',
        content:
          'When your digital stack is handled by specialists, launches happen faster, data stays clean, and every campaign ladders into measurable growth. More important, your leadership team can focus on culture, client retention, and new market opportunities - the work that cannot be delegated.',
      },
      {
        type: 'paragraph',
        content:
          'If you are ready to step out of the DIY loop, start with a discovery session. We will audit where time is leaking today, then build a delegation plan that puts your expertise where it matters most.',
      },
    ],
    highlights: [
      'Leaders win back double-digit hours each week by delegating digital execution.',
      'A dedicated partner adapts SEO, web, and analytics to every platform shift for you.',
      'Weekly strategic syncs keep you informed without dragging you into task-mode work.',
    ],
  },
  {
    slug: 'ai-security-trust-and-small-business-confidence',
    title: 'AI Adoption Demands Security You Can Trust: How PixelVerse Safeguards Growing Brands',
    excerpt:
      'AI accelerates everything—content, automation, customer insights—but it also raises the stakes for privacy, data hygiene, and brand trust. Here is how we keep clients safe while unlocking intelligent workflows.',
    category: 'AI & Security',
    tags: ['AI Strategy', 'Security', 'Compliance'],
    publishedAt: '2025-10-27T13:30:00.000Z',
    readingMinutes: 6,
    coverGradient: 'linear-gradient(135deg, rgba(18,40,120,0.32) 0%, rgba(120,65,255,0.48) 100%)',
    accentColor: 'rgba(18,40,120,0.45)',
    author: defaultAuthor,
    content: [
      {
        type: 'paragraph',
        content:
          'Artificial intelligence is no longer optional for service brands. Automations help nurture leads, predictive analytics guides campaigns, and AI-assisted support teams keep response times low. But each integration compounds risk—customer data flows through new APIs, third-party models, and internal dashboards that need constant oversight.',
      },
      {
        type: 'heading',
        content: 'Security is now a growth lever, not a compliance chore',
      },
      {
        type: 'paragraph',
        content:
          'Every AI experiment must begin with trust. When stakeholders believe their data is safe, they greenlight more creative initiatives. If they worry about exposure, innovation stalls. That is why we architect marketing stacks with zero-trust principles, role-based permissions, and automated audits before a single AI workflow goes live.',
      },
      {
        type: 'list',
        items: [
          'Map data flows before implementation so sensitive fields never touch unsecured services',
          'Use environment-specific API keys, encrypted secrets, and access logs to track usage',
          'Review vendors quarterly to ensure privacy terms still match your regulatory requirements',
        ],
      },
      {
        type: 'heading',
        content: 'PixelVerse safeguards every layer of your AI-enabled stack',
      },
      {
        type: 'paragraph',
        content:
          'Our development sprints include security checkpoints—dependency scanning, endpoint monitoring, and SOC2-aligned processes. When we deploy AI features, we wrap them in governance: sandbox testing, human-in-the-loop approval, and clear rollback plans. The goal is to help clients innovate without guesswork.',
      },
      {
        type: 'quote',
        content:
          'Security is not a bolt-on for us. It is the standard operating system that gives clients the confidence to ship faster.',
        attribution: 'Phil, Lead Developer',
      },
      {
        type: 'heading',
        content: 'Turn security into a selling point',
      },
      {
        type: 'paragraph',
        content:
          'When prospects hear you have real governance over AI and automation, you earn instant credibility. We help clients translate technical safeguards into marketing proof—trust badges, case studies, and process visuals that remove friction during sales conversations.',
      },
      {
        type: 'paragraph',
        content:
          'If you are ready to scale AI responsibly, let PixelVerse audit your current stack and design a roadmap that keeps compliance, security, and growth in lockstep.',
      },
    ],
    highlights: [
      'Treat security as the foundation of every AI initiative to keep experimentation on track.',
      'PixelVerse integrates governance into each sprint—testing, monitoring, and fallback plans included.',
      'Use security excellence as a sales differentiator with proof points prospects can trust.',
    ],
  },
];

export function getBlogPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getFeaturedBlogPost(): BlogPost | undefined {
  const posts = getBlogPosts();
  return posts.find((post) => post.featured) ?? posts[0];
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsExcluding(slug: string): BlogPost[] {
  return getBlogPosts().filter((post) => post.slug !== slug);
}

export function getBlogCategories(): string[] {
  const categories = new Set<string>();
  blogPosts.forEach((post) => {
    categories.add(post.category);
  });
  return Array.from(categories);
}

const blogDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export function formatBlogDate(date: string): string {
  return blogDateFormatter.format(new Date(date));
}
