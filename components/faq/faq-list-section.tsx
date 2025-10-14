import { Container } from '@/components/ui/container';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

const faqs = [
  {
    question: 'Why should I choose a custom-coded website over a builder like Wix or Squarespace?',
    answer:
      'Custom-coded websites give you the freedom to focus on your business, not your website. You share your vision and needs, and we handle everything from design to development. Builders like Wix or Squarespace put the entire burden on you — every layout, every update, every detail — pulling your time away from what really matters.'
  },
  {
    question: 'What does “UX-first design” actually mean?',
    answer:
      'UX (user experience) means designing a site around how real people use it. It’s not just about looks — it’s about making the site easy, intuitive, and enjoyable to navigate. A good UX-first site keeps visitors from bouncing, guides them to the right actions, and ultimately turns clicks into customers.'
  },
  {
    question: 'Isn’t a template cheaper and faster?',
    answer:
      'It can be at first — but you often end up paying more later in both money and time when you need new features, fixes, or performance improvements.'
  },
  {
    question: 'Will my site be SEO-friendly?',
    answer:
      'Your website will always be built with SEO-friendly foundations — clean coding, fast performance, and a structure that search engines can easily index. Ongoing SEO work and reporting, however, require a dedicated SEO package, since SEO is a continuous process.'
  },
  {
    question: 'What’s it like working with PixelVerse?',
    answer:
      'We keep the process simple: plan, design, build, and grow — with you involved at every step. No jargon. No disappearing acts. Just clear communication, full transparency, and a site you’ll be proud of.'
  },
  {
    question: 'How do I know if I’m ready for a custom site?',
    answer:
      'If your business needs to grow, convert leads, or stand out from competitors, you’re ready.'
  },
  {
    question: 'How long does a typical PixelVerse project take?',
    answer:
      'Most engagements move from kickoff to launch in 6–10 weeks, depending on scope and feedback cycles. We map every milestone at the start so timelines stay transparent.'
  },
  {
    question: 'Do you offer support once the site is live?',
    answer:
      'Yes. We hand off with clear documentation and training, and offer ongoing enhancement retainers for teams that want a dedicated partner watching performance after launch.'
  },
  {
    question: 'Can you work with our existing brand assets?',
    answer:
      'Absolutely. We can plug into your current brand system or collaborate with your designer to expand it. If you need a refresh, we can scope that in at the strategy stage.'
  }
];

export function FaqListSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-4xl">
        <MotionSection
          as="div"
          className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)]/90 shadow-pv dark:bg-[var(--pv-surface)]/85"
        >
          <Accordion type="single" collapsible className="divide-y divide-[var(--pv-border)]">
            {faqs.map((faq, index) => (
              <MotionItem
                key={faq.question}
                delay={index * 0.04}
                triggerOnViewport={false}
              >
                <AccordionItem value={`faq-${index + 1}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              </MotionItem>
            ))}
          </Accordion>
        </MotionSection>
      </Container>
    </section>
  );
}
