import type { Metadata, Viewport } from 'next';
import '@fontsource/syne/600.css';
import '@fontsource/syne/700.css';
import '@fontsource/syne/800.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/700.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'GD — Design Studio, Riyadh',
  description:
    'GD is an independent design studio in Riyadh crafting brand identities, packaging, print, social media, motion, art direction and websites.',
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
