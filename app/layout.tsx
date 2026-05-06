import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
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
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/icon.png" />
        {/* Google AdSense */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3809505002238691"
          crossOrigin="anonymous"
        ></script>

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
      </head>
      <body className="antialiased font-sans">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
