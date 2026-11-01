import type { Metadata, Viewport } from 'next';
import '@fontsource/syne/600.css';
import '@fontsource/syne/700.css';
import '@fontsource/syne/800.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/700.css';
import './globals.css';

const SITE_URL = 'https://gd-graphic-design-company.vercel.app';
const TITLE = 'GD — Design Studio, Riyadh';
const DESCRIPTION =
  'GD is an independent design studio in Riyadh crafting brand identities, packaging, print, social media, motion, art direction and websites.';

// favicon, apple icon and share images come from the files in app/ (icon.svg, opengraph-image.png, ...)
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: 'GD Studio',
  keywords: ['GD Studio', 'design studio Riyadh', 'graphic design', 'brand identity', 'packaging design', 'motion design', 'web design', 'Saudi Arabia'],
  authors: [{ name: 'Eng. Osama Sharaf', url: 'https://osamasharaf.dev' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'GD Studio',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F4F0E6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/img/identity.webp" />
      </head>
      <body>{children}</body>
    </html>
  );
}
