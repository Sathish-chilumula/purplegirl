import type { Metadata } from 'next';
import { Inter, Syne, Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FloatingChat } from '@/components/FloatingChat';
import { SEO_CONFIG } from '@/lib/constants';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: SEO_CONFIG.title,
  description: SEO_CONFIG.description,
  metadataBase: new URL(SEO_CONFIG.url),
  openGraph: {
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    url: SEO_CONFIG.url,
    siteName: 'PurpleGirl.in',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable} ${outfit.variable} ${playfair.variable} scroll-smooth`}>
      <body className="font-inter bg-white text-slate-900 antialiased flex flex-col min-h-screen selection:bg-purple-200" suppressHydrationWarning>
        <Script 
          async 
          src="https://www.googletagmanager.com/gtag/js?id=G-ECLMKP650Q" 
          strategy="afterInteractive" 
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ECLMKP650Q');
          `}
        </Script>
        
        <Header />
        
        <main className="flex-grow relative z-10 w-full">
          {children}
        </main>
        
        <Footer />
        <FloatingChat />
      </body>
    </html>
  );
}
