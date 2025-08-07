import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/providers';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '700', '900'],
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'MyPromptBench - Track Your Prompts Through AI History',
  description: 'Create your own Will Smith moment. Track how your prompts evolve as AI models improve over time.',
  keywords: ['AI', 'prompts', 'benchmarking', 'Will Smith', 'AI progress', 'prompt tracking'],
  authors: [{ name: 'MyPromptBench' }],
  creator: 'MyPromptBench',
  publisher: 'MyPromptBench',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mypromptbench.com',
    title: 'MyPromptBench - Track Your Prompts Through AI History',
    description: 'Create your own Will Smith moment. Track how your prompts evolve as AI models improve over time.',
    siteName: 'MyPromptBench',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyPromptBench',
    description: 'Create your own Will Smith moment. Track your prompts through AI history.',
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
      <body className={`${inter.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable} ${inter.className}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}