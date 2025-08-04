import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DREAMSHOT.AI - AI-Powered Creative Platform',
  description: 'Transform your ideas into reality with cutting-edge AI technology',
  keywords: ['AI', 'creative', 'platform', 'artificial intelligence', 'automation'],
  authors: [{ name: 'DREAMSHOT.AI Team' }],
  creator: 'DREAMSHOT.AI',
  publisher: 'DREAMSHOT.AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dreamshot.ai',
    title: 'DREAMSHOT.AI',
    description: 'Transform your ideas into reality with cutting-edge AI technology',
    siteName: 'DREAMSHOT.AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DREAMSHOT.AI',
    description: 'Transform your ideas into reality with cutting-edge AI technology',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}