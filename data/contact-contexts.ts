export interface ContactContextData {
  slug: string;
  locationLabel: string;
  heroHeading: string;
  heroSubtitle: string;
  introMessage: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

const contactContextData: ContactContextData[] = [
  {
    slug: 'bergen-county',
    locationLabel: 'Bergen County',
    heroHeading: "Let's Start Your Bergen County Project",
    heroSubtitle:
      'You are focused on serving Bergen clients. We keep your site, SEO, and analytics humming so every town sees a tailored experience.',
    introMessage:
      'Share the initiatives on your Bergen County roadmap—new offers, municipal campaigns, or multi-town rollouts. We will map a launch plan that shoulders the technical work while you stay close to customers.',
    metaTitle: 'Contact PixelVerse Studios | Bergen County Web & SEO Partner',
    metaDescription:
      'Connect with PixelVerse Studios to plan your next Bergen County web or SEO initiative. We manage the build, optimization, and analytics so your team can focus on growth.',
    keywords: [
      'Bergen County web design partner',
      'Bergen County SEO agency contact',
      'PixelVerse Studios Bergen projects',
    ],
  },
  {
    slug: 'fort-lee',
    locationLabel: 'Fort Lee',
    heroHeading: "Let's Start Your Fort Lee Project",
    heroSubtitle:
      'Fort Lee businesses move fast. We keep your website, SEO, and automations running so you can stay focused on client work and new partnerships.',
    introMessage:
      'Tell us how you are growing in Fort Lee—new service retainers, bilingual campaigns, or a refreshed digital storefront. We will ship the technical lift while your team leads the relationships.',
    metaTitle: 'Contact PixelVerse Studios | Fort Lee Web & SEO Partner',
    metaDescription:
      'Schedule a Fort Lee strategy session with PixelVerse Studios. We handle custom websites, SEO, and analytics so local founders can focus on growth.',
    keywords: [
      'Fort Lee web design contact',
      'Fort Lee SEO agency',
      'PixelVerse Studios Fort Lee',
    ],
  },
  {
    slug: 'cliffside-park',
    locationLabel: 'Cliffside Park',
    heroHeading: "Let's Start Your Cliffside Park Project",
    heroSubtitle:
      'Cliffside Park brands win when their digital touchpoints feel personal. We maintain your site, SEO, and analytics infrastructure so you can double down on service.',
    introMessage:
      'Let us know what you are building for Cliffside Park clients—lead funnels, local SEO, or bilingual landing pages. We will translate it into a development plan with airtight security and reporting.',
    metaTitle: 'Contact PixelVerse Studios | Cliffside Park Digital Partner',
    metaDescription:
      'Work with PixelVerse Studios on Cliffside Park web design, SEO, and conversion systems. We protect your digital operations while you grow the business.',
    keywords: [
      'Cliffside Park web design partner',
      'Cliffside Park SEO contact',
      'PixelVerse Studios Cliffside Park',
    ],
  },
  {
    slug: 'river-vale',
    locationLabel: 'River Vale',
    heroHeading: "Let's Start Your River Vale Project",
    heroSubtitle:
      'River Vale teams thrive when their digital systems support community-driven growth. We handle your site, SEO, and analytics upkeep so you can focus on client care.',
    introMessage:
      'Share the River Vale initiatives on deck—service launches, retention campaigns, or referral programs. PixelVerse will own the implementation while you lead the relationships.',
    metaTitle: 'Contact PixelVerse Studios | River Vale Web & SEO Partner',
    metaDescription:
      'Partner with PixelVerse Studios for River Vale web design and SEO. We run the technical playbook so your business can scale confidently.',
    keywords: [
      'River Vale web design contact',
      'River Vale SEO agency',
      'PixelVerse Studios River Vale',
    ],
  },
  {
    slug: 'hackensack',
    locationLabel: 'Hackensack',
    heroHeading: "Let's Start Your Hackensack Project",
    heroSubtitle:
      'Hackensack companies juggle healthcare, logistics, and service demands. We keep your digital infrastructure fast, secure, and search-ready.',
    introMessage:
      'Outline your Hackensack goals—multi-location rollouts, lead gen funnels, or hiring campaigns. Our team will execute the build, optimization, and analytics so you can scale operations.',
    metaTitle: 'Contact PixelVerse Studios | Hackensack Web & SEO Partner',
    metaDescription:
      'Connect with PixelVerse Studios to upgrade Hackensack web design, SEO, and analytics. We manage the technical stack so you can focus on daily growth.',
    keywords: [
      'Hackensack web design contact',
      'Hackensack SEO partner',
      'PixelVerse Studios Hackensack',
    ],
  },
  {
    slug: 'paramus',
    locationLabel: 'Paramus',
    heroHeading: "Let's Start Your Paramus Project",
    heroSubtitle:
      'Retail and service brands in Paramus need digital systems that scale with demand. We run the website, SEO, and analytics so you can run the business.',
    introMessage:
      'Let us know what is next in Paramus—seasonal campaigns, omnichannel launches, or automation upgrades. We will turn it into a secure, high-converting digital plan.',
    metaTitle: 'Contact PixelVerse Studios | Paramus Web & SEO Partner',
    metaDescription:
      'Talk with PixelVerse Studios about Paramus web design and SEO. We protect your digital foundation while you focus on customer experience.',
    keywords: [
      'Paramus web design contact',
      'Paramus SEO partner',
      'PixelVerse Studios Paramus',
    ],
  },
];

export function getContactContext(slug: string) {
  return contactContextData.find((context) => context.slug === slug);
}

export function getContactContexts() {
  return contactContextData;
}
