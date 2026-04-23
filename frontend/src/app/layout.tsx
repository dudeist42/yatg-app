'use server';
import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';
import Providers from './providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateViewport(): Promise<Viewport> {
  return {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: '%s | YATG',
      default: 'YATG',
    },
    description: 'Yet Another TMDB application',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();

  const theme = h.get('x-theme');

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      data-theme={theme}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#fff" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
