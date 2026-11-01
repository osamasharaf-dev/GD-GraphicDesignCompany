import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://gd-graphic-design-company.vercel.app/', changeFrequency: 'monthly', priority: 1 }];
}
