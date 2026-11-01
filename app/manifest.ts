import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GD — Design Studio, Riyadh',
    short_name: 'GD Studio',
    description: 'Independent design studio in Riyadh: identity, packaging, print, social, motion and websites.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F0E6',
    theme_color: '#F4F0E6',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
