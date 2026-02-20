import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CaseStudyDetail } from '@/components/portfolio/case-study-detail';
import { StructuredData } from '@/components/ui/structured-data';
import { caseStudies } from '@/data/case-studies';
import { createPageMetadata } from '@/lib/metadata';
import { createCaseStudyBreadcrumbSchema, createCaseStudySchema } from '@/lib/structured-data';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const study = caseStudies.find((cs) => cs.slug === params.slug);

  if (!study) {
    return {};
  }

  return createPageMetadata({
    title: `${study.name} Case Study | PixelVerse Studios`,
    description: study.summary,
    path: `/portfolio/${study.slug}`,
    keywords: [
      study.name,
      study.industry,
      study.location,
      'web design case study',
      'PixelVerse Studios portfolio',
    ],
    ogImage: {
      url: `https://www.pixelversestudios.io${study.img}`,
      width: 1200,
      height: 630,
      alt: `${study.name} website — built by PixelVerse Studios`,
    },
  });
}

export default function CaseStudyPage({ params }: { params: Params }) {
  const study = caseStudies.find((cs) => cs.slug === params.slug);

  if (!study) {
    notFound();
  }

  const currentIndex = caseStudies.indexOf(study);
  const nextStudy = caseStudies[currentIndex + 1] ?? null;

  const articleSchema = createCaseStudySchema({
    slug: study.slug,
    title: study.title,
    description: study.summary,
    clientName: study.name,
  });

  const breadcrumbSchema = createCaseStudyBreadcrumbSchema(study.name, study.slug);

  return (
    <>
      <StructuredData id={`case-study-${study.slug}`} data={articleSchema} />
      <StructuredData id={`breadcrumb-${study.slug}`} data={breadcrumbSchema} />
      <CaseStudyDetail study={study} nextStudy={nextStudy} />
    </>
  );
}
