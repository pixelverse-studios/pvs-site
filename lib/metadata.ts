import type { Metadata } from 'next';

const siteUrl = 'https://pixelversestudios.com';
const siteName = 'PixelVerse Studios';
const defaultOgImage = `${siteUrl}/logo-light.png`;

type CreatePageMetadataArgs = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

// Ensures consistent SEO metadata, canonical URLs, and social sharing tags per route.
export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: CreatePageMetadataArgs): Metadata {
  const canonicalUrl = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: 'PixelVerse Studios brand mark',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [defaultOgImage],
    },
  };
}

export const sharedMetadata = {
  siteUrl,
  siteName,
  defaultOgImage,
};
