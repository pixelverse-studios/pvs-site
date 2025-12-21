/**
 * SEO Focus Data
 *
 * Centralized data for tracking hyper-local SEO focus cities and keywords.
 * Update this file as rankings change and priorities shift.
 *
 * Reference: docs/planning/hyper-local-seo-strategy.md
 */

export type CityStatus = 'active' | 'pending' | 'ranking';

export interface TargetKeyword {
  keyword: string;
  currentPosition: number | null; // null = not ranking
  targetPosition: number;
  priority: 'high' | 'medium' | 'low';
}

export interface FocusCity {
  rank: number;
  city: string;
  state: string;
  slug: string;
  currentPosition: number | null; // Average position for city keywords
  status: CityStatus;
  phase: 1 | 2;
  population?: string;
  whyPriority: string;
  targetKeywords: TargetKeyword[];
}

export interface ImplementationTask {
  task: string;
  status: 'done' | 'in-progress' | 'pending';
  category: 'schema' | 'content' | 'gbp' | 'technical';
}

// Phase 1: Priority Cities (Active Focus)
export const priorityCities: FocusCity[] = [
  {
    rank: 1,
    city: 'Fort Lee',
    state: 'NJ',
    slug: 'fort-lee',
    currentPosition: 10.47,
    status: 'active',
    phase: 1,
    population: '~40K',
    whyPriority: '1 position from page 1 - highest momentum',
    targetKeywords: [
      {
        keyword: 'web design Fort Lee NJ',
        currentPosition: 10,
        targetPosition: 3,
        priority: 'high',
      },
      { keyword: 'Fort Lee SEO agency', currentPosition: 12, targetPosition: 5, priority: 'high' },
      { keyword: 'SEO Fort Lee', currentPosition: 9, targetPosition: 3, priority: 'medium' },
      {
        keyword: 'Fort Lee website developer',
        currentPosition: null,
        targetPosition: 10,
        priority: 'medium',
      },
    ],
  },
  {
    rank: 2,
    city: 'Englewood',
    state: 'NJ',
    slug: 'englewood',
    currentPosition: 12,
    status: 'active',
    phase: 1,
    population: '~28K',
    whyPriority: '2-3 positions from page 1',
    targetKeywords: [
      {
        keyword: 'local SEO agency Englewood NJ',
        currentPosition: 11,
        targetPosition: 3,
        priority: 'high',
      },
      {
        keyword: 'SEO agency Englewood NJ',
        currentPosition: 12,
        targetPosition: 5,
        priority: 'high',
      },
      {
        keyword: 'Englewood web design',
        currentPosition: 13,
        targetPosition: 5,
        priority: 'medium',
      },
      {
        keyword: 'Englewood digital agency',
        currentPosition: null,
        targetPosition: 10,
        priority: 'low',
      },
    ],
  },
  {
    rank: 3,
    city: 'Hackensack',
    state: 'NJ',
    slug: 'hackensack',
    currentPosition: null,
    status: 'active',
    phase: 1,
    population: '~45K',
    whyPriority: 'Largest city in Bergen County - biggest market',
    targetKeywords: [
      {
        keyword: 'web design Hackensack NJ',
        currentPosition: null,
        targetPosition: 10,
        priority: 'high',
      },
      {
        keyword: 'Hackensack SEO company',
        currentPosition: null,
        targetPosition: 10,
        priority: 'high',
      },
      {
        keyword: 'Hackensack digital agency',
        currentPosition: null,
        targetPosition: 15,
        priority: 'medium',
      },
      {
        keyword: 'website design Hackensack',
        currentPosition: null,
        targetPosition: 10,
        priority: 'medium',
      },
    ],
  },
  {
    rank: 4,
    city: 'Paramus',
    state: 'NJ',
    slug: 'paramus',
    currentPosition: null,
    status: 'active',
    phase: 1,
    population: '~27K',
    whyPriority: 'Major retail/business hub - high commercial density',
    targetKeywords: [
      {
        keyword: 'web design Paramus NJ',
        currentPosition: null,
        targetPosition: 10,
        priority: 'high',
      },
      {
        keyword: 'Paramus SEO services',
        currentPosition: null,
        targetPosition: 10,
        priority: 'high',
      },
      {
        keyword: 'e-commerce website Paramus',
        currentPosition: null,
        targetPosition: 15,
        priority: 'medium',
      },
      {
        keyword: 'Paramus digital marketing',
        currentPosition: null,
        targetPosition: 15,
        priority: 'low',
      },
    ],
  },
  {
    rank: 5,
    city: 'Ridgewood',
    state: 'NJ',
    slug: 'ridgewood',
    currentPosition: null,
    status: 'active',
    phase: 1,
    population: '~25K',
    whyPriority: 'Affluent market - high-value clients',
    targetKeywords: [
      {
        keyword: 'web design Ridgewood NJ',
        currentPosition: null,
        targetPosition: 10,
        priority: 'high',
      },
      {
        keyword: 'Ridgewood digital agency',
        currentPosition: null,
        targetPosition: 10,
        priority: 'high',
      },
      {
        keyword: 'premium website design Bergen County',
        currentPosition: null,
        targetPosition: 15,
        priority: 'medium',
      },
      { keyword: 'Ridgewood SEO', currentPosition: null, targetPosition: 10, priority: 'medium' },
    ],
  },
];

// Phase 2: Secondary Cities (Deprioritized for now)
export const phase2Cities: FocusCity[] = [
  {
    rank: 6,
    city: 'Teaneck',
    state: 'NJ',
    slug: 'teaneck',
    currentPosition: 16.5,
    status: 'pending',
    phase: 2,
    population: '~40K',
    whyPriority: 'Page already exists, needs optimization after Phase 1',
    targetKeywords: [
      {
        keyword: 'web design Teaneck NJ',
        currentPosition: null,
        targetPosition: 10,
        priority: 'medium',
      },
      { keyword: 'Teaneck SEO', currentPosition: 16, targetPosition: 10, priority: 'medium' },
    ],
  },
  {
    rank: 7,
    city: 'Fair Lawn',
    state: 'NJ',
    slug: 'fair-lawn',
    currentPosition: null,
    status: 'pending',
    phase: 2,
    population: '~35K',
    whyPriority: 'Page exists, expand after Phase 1 success',
    targetKeywords: [
      {
        keyword: 'web design Fair Lawn NJ',
        currentPosition: null,
        targetPosition: 10,
        priority: 'medium',
      },
    ],
  },
  {
    rank: 8,
    city: 'Bergenfield',
    state: 'NJ',
    slug: 'bergenfield',
    currentPosition: 77,
    status: 'pending',
    phase: 2,
    population: '~28K',
    whyPriority: 'Currently position 77 - needs significant work',
    targetKeywords: [
      {
        keyword: 'web design Bergenfield NJ',
        currentPosition: 77,
        targetPosition: 15,
        priority: 'low',
      },
    ],
  },
  {
    rank: 9,
    city: 'Cliffside Park',
    state: 'NJ',
    slug: 'cliffside-park',
    currentPosition: null,
    status: 'pending',
    phase: 2,
    population: '~25K',
    whyPriority: 'Smaller market, Phase 2 expansion',
    targetKeywords: [
      {
        keyword: 'web design Cliffside Park NJ',
        currentPosition: null,
        targetPosition: 15,
        priority: 'low',
      },
    ],
  },
  {
    rank: 10,
    city: 'River Vale',
    state: 'NJ',
    slug: 'river-vale',
    currentPosition: null,
    status: 'pending',
    phase: 2,
    population: '~10K',
    whyPriority: 'Smallest market, Phase 2 expansion',
    targetKeywords: [
      {
        keyword: 'web design River Vale NJ',
        currentPosition: null,
        targetPosition: 20,
        priority: 'low',
      },
    ],
  },
];

// County-level keyword (deprioritized)
export const countyKeywords: TargetKeyword[] = [
  {
    keyword: 'website analytics agency Bergen County NJ',
    currentPosition: 22,
    targetPosition: 5,
    priority: 'medium',
  },
  {
    keyword: 'SEO agency Bergen County NJ',
    currentPosition: 67,
    targetPosition: 10,
    priority: 'low',
  },
  { keyword: 'web design Bergen County', currentPosition: 66, targetPosition: 15, priority: 'low' },
];

// Implementation status tracking
export const implementationTasks: ImplementationTask[] = [
  // Schema tasks
  { task: 'BreadcrumbList schema on all city pages', status: 'done', category: 'schema' },
  { task: 'FAQPage schema on /faq', status: 'done', category: 'schema' },
  {
    task: 'Per-city LocalBusiness schema (5 priority cities)',
    status: 'pending',
    category: 'schema',
  },
  { task: 'Service schema per city', status: 'pending', category: 'schema' },

  // Content tasks
  { task: 'Unique metadata per city page', status: 'done', category: 'content' },
  { task: 'Optimize Fort Lee page for target keywords', status: 'done', category: 'content' },
  { task: 'Optimize Englewood page for target keywords', status: 'done', category: 'content' },
  { task: 'Expand Hackensack content to 1,500+ words', status: 'pending', category: 'content' },
  { task: 'Expand Paramus content to 1,500+ words', status: 'pending', category: 'content' },
  { task: 'Expand Ridgewood content to 1,500+ words', status: 'pending', category: 'content' },

  // GBP tasks
  { task: 'Add phone number to GBP', status: 'pending', category: 'gbp' },
  { task: 'Set service area to 5 priority cities', status: 'pending', category: 'gbp' },
  { task: 'Upload 10+ photos to GBP', status: 'pending', category: 'gbp' },
  { task: 'Request 5-10 reviews from past clients', status: 'pending', category: 'gbp' },

  // Technical tasks
  { task: 'Fix www/non-www canonical (redirect in place)', status: 'done', category: 'technical' },
  { task: 'Request GSC re-indexing for www URLs', status: 'in-progress', category: 'technical' },
  { task: 'NAP consistency audit', status: 'pending', category: 'technical' },
];

// Strategy metadata
export const strategyMeta = {
  created: '2025-12-01',
  lastUpdated: '2025-12-01',
  goal: 'Rank page 1 for 5 priority cities within 3-6 months',
  strategy: 'Focus → Dominate → Expand',
  phase1Target: 'Month 1-3: Fort Lee & Englewood on page 1',
  phase2Target: 'Month 4-6: All 5 cities ranking, begin expansion',
  gbpWeight: '32%', // GBP accounts for 32% of local ranking
};

// Helper functions
export function getStatusLabel(status: CityStatus): string {
  switch (status) {
    case 'active':
      return 'Phase 1 Active';
    case 'pending':
      return 'Phase 2 Pending';
    case 'ranking':
      return 'Ranking';
    default:
      return status;
  }
}

export function getPositionDisplay(position: number | null): string {
  if (position === null) return 'Not ranking';
  if (position <= 3) return `#${Math.round(position)} 🏆`;
  if (position <= 10) return `#${Math.round(position)} ✓`;
  if (position <= 20) return `#${Math.round(position)}`;
  return `#${Math.round(position)} ⚠️`;
}

export function getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    case 'medium':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    case 'low':
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
  }
}

export function getTaskStatusColor(status: 'done' | 'in-progress' | 'pending'): string {
  switch (status) {
    case 'done':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    case 'in-progress':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    case 'pending':
      return 'bg-slate-500/10 text-slate-500 dark:text-slate-400';
  }
}
