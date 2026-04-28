import type { Metadata } from 'next';
import { Cinzel, UnifrakturMaguntia, IM_Fell_English, Crimson_Text } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SEO_CONFIG } from '@/lib/constants';
import Script from 'next/script';

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });
const unifraktur = UnifrakturMaguntia({ weight: '400', subsets: ['latin'], variable: '--font-unifraktur' });
const imFell = IM_Fell_English({ weight: '400', subsets: ['latin'], variable: '--font-im-fell', style: ['normal', 'italic'] });
const crimson = Crimson_Text({ weight: ['400', '600', '700'], subsets: ['latin'], variable: '--font-crimson-text', style: ['normal', 'italic'] });

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
    <html lang="en" className={`${cinzel.variable} ${unifraktur.variable} ${imFell.variable} ${crimson.variable} scroll-smooth`}>
      <body className="font-crimson bg-pg-parch-50 text-pg-ink-900 antialiased flex flex-col min-h-screen selection:bg-pg-gold-500/30" suppressHydrationWarning>
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
      </body>
    </html>
  );
}
