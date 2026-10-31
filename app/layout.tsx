import type {Metadata} from 'next';
import {Inter_Tight, Manrope, JetBrains_Mono} from 'next/font/google';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter-tight',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-manrope',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'ARRAKIS — Souvik Ghosh Portfolio',
  description:
    'Cinematic, scroll-driven creative developer portfolio for Souvik Ghosh — Ideas. Code. Experiences.',
  openGraph: {
    title: 'ARRAKIS — Souvik Ghosh Portfolio',
    description:
      'Cinematic, scroll-driven creative developer portfolio for Souvik Ghosh — Ideas. Code. Experiences.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARRAKIS — Souvik Ghosh Portfolio',
    description:
      'Cinematic, scroll-driven creative developer portfolio for Souvik Ghosh — Ideas. Code. Experiences.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${interTight.variable} ${manrope.variable} ${jetbrainsMono.variable} dark`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#08090B] text-[#F2EFE9] font-sans antialiased selection:bg-[#E99A45] selection:text-[#08090B]"
      >
        {children}
      </body>
    </html>
  );
}
