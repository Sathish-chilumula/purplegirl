import type { Metadata } from "next";
import { Outfit, Lora } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FloatingChat } from "@/components/FloatingChat";
import { getDictionary } from "@/lib/dictionary";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "PurpleGirl — How-To Guides & Advice for Indian Women",
    template: "%s | PurpleGirl",
  },
  description: "Honest how-to guides on relationships, health, career, and more — made for Indian women. 100% anonymous Q&A, no login required.",
  metadataBase: new URL("https://purplegirl.in"),
  applicationName: "PurpleGirl",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PurpleGirl',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { children } = props;
  const params = await props.params;
  const lang = (params.lang || 'en') as 'en' | 'hi' | 'te';
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className={`${outfit.variable} ${lora.variable}`}>
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icons/pwa-512.png" />
        <meta name="theme-color" content="#581C87" />
        {/* Google AdSense */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3809505002238691"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="antialiased font-sans">
        <Header dict={dict} lang={lang} />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer dict={dict} lang={lang} />
        <FloatingChat />
        {/* CueLinks JS (Invisible Affiliate Link Converter) */}
        <script dangerouslySetInnerHTML={{
          __html: `
            var cId = "283648";
            (function(d, t) {
              var s = document.createElement("script");
              s.type = "text/javascript";
              s.async = true;
              s.src = (document.location.protocol == "https:" ? "https://cdn0.cuelinks.com/js/" : "http://cdn0.cuelinks.com/js/")  + "cuelinksv2.js";
              document.getElementsByTagName("body")[0].appendChild(s);
            }());
          `
        }} />
      </body>
    </html>
  );
}
