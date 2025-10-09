import { Container } from '@/components/ui/container';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
  }
];

export function FaqListSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-4xl">
        <Accordion type="single" collapsible className="divide-y divide-[var(--pv-border)] rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)]/90 shadow-pv dark:bg-[var(--pv-surface)]/85">
          {faqs.map((faq, index) => (
            <AccordionItem value={`faq-${index + 1}`} key={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
