export interface FaqItem {
  question: string;
  answer: string;
  link?: { label: string; href: string };
}

export interface FaqCategory {
  category: string;
  items: FaqItem[];
}

export const faqContent: FaqCategory[] = [
  {
    category: 'General / Getting Started',
    items: [
      {
        question: "What's the first step to working with you?",
        answer:
          "We start with a conversation — not a proposal. We'll look at your current situation, understand what's limiting progress, and figure out whether a new build, optimization, or something else is actually the right move. Nothing gets scoped until that's clear.",
      },
      {
        question: 'How do you decide what to recommend?',
        answer:
          "We evaluate before we recommend. That means looking at what you have, how visitors behave, what's working, and where things break down. From that, we propose a direction tied to your actual business goals — not a packaged solution applied by default.",
      },
      {
        question: 'Do I need to know what I want before reaching out?',
        answer:
          "No. Many clients come in unsure whether they need a full rebuild, targeted improvements, or just better visibility. That's exactly what the initial conversation is for. You don't need to arrive with a brief.",
      },
    ],
  },
  {
    category: 'Web Design & Development',
    items: [
      {
        question: 'When does building a new website make sense vs. improving what I have?',
        answer:
          "A rebuild makes sense when the foundation itself is the problem — unclear structure, messaging that no longer fits, or a site that's difficult to update. Optimization makes sense when the foundation is solid but local visibility or conversion is underperforming. We're direct about which direction fits your situation.",
      },
      {
        question: 'Do you use templates or build custom?',
        answer:
          "Both, depending on what's right for the project. We use custom development when flexibility and long-term maintainability are priorities, and well-built website platforms when they're the more practical fit. The goal is choosing the right approach for the business — not defaulting to one method.",
      },
      {
        question: 'How long does a website build take?',
        answer:
          "Most projects move from kickoff to launch in 6–10 weeks. Scope and feedback cycles affect the timeline most. We define milestones at the start so there are no surprises along the way.",
      },
      {
        question: 'What does the build process look like?',
        answer:
          'It starts with planning — clarifying site structure, content direction, and technical approach before any design begins. From there: design direction, development with review milestones, and thorough testing before launch. You\'re involved and informed at each stage.',
      },
    ],
  },
  {
    category: 'SEO & Local Optimization',
    items: [
      {
        question: 'What does local SEO actually involve?',
        answer:
          "Local SEO is about structuring your site so the right people in the right locations can find you — and choose you. That means organizing service and location pages clearly, addressing technical performance issues, strengthening your Google Business Profile presence, and making sure visitors can easily take the next step once they arrive.",
      },
      {
        question: 'How do I know if I need SEO or a new website?',
        answer:
          "If your site has a solid foundation but isn't showing up locally or converting visitors into inquiries, optimization is usually the right move. If structural gaps, unclear messaging, or technical limitations are the root issue, no amount of SEO will fix that — and a rebuild may be more effective long-term. We're honest about that distinction.",
      },
      {
        question: 'How long before SEO shows results?',
        answer:
          "Local SEO improvements typically show meaningful movement in search visibility within 3–6 months. It's not a one-time fix — it's an ongoing effort that compounds over time. We're upfront about realistic timelines so expectations align with what the work can actually deliver.",
      },
    ],
  },
  {
    category: 'Working With Us',
    items: [
      {
        question: 'How do you communicate during a project?',
        answer:
          "We keep it structured and clear — no jargon, no disappearing acts. You'll know what's happening, what's next, and what we need from you at every stage. Milestones are mapped at the start, and we check in throughout.",
      },
      {
        question: 'Can you work with our existing brand?',
        answer:
          "Yes. We work within existing brand systems regularly, or collaborate with your designer to extend one. If a brand refresh is needed alongside the site, we can scope that into the strategy phase from the start.",
      },
      {
        question: 'Do you offer support after launch?',
        answer:
          "Yes. We provide documentation and training at handoff, and offer ongoing support for businesses that want a partner monitoring performance, making updates, and iterating as goals evolve. We don't disappear after go-live.",
      },
      {
        question: 'What kinds of businesses do you typically work with?',
        answer:
          "Primarily small-to-mid-size service businesses and professional practices in Bergen County and the surrounding area — though we work beyond NJ when the fit is right. The common thread is businesses where the website plays a real role in how they attract and convert clients.",
      },
      {
        question: 'Do you publish pricing?',
        answer:
          "We don't list fixed prices because every engagement starts differently. Cost depends on what's actually needed, which we only determine after understanding your situation. The initial conversation is free and helps clarify scope before any investment is discussed.",
      },
    ],
  },
];
