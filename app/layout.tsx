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
  title: "PurpleGirl.in | Anonymous Advice & Guides for Indian Women",
  description: "Find your answer safely and anonymously. Expert advice, how-to guides, and quizzes on relationships, health, beauty, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        {/* Ezoic Head Script */}
        <script dangerouslySetInnerHTML={{
          __html: `(function() {
            var script = document.createElement('script');
            script.src = '//www.ezojs.com/ezoic/sa.min.js';
            script.async = true;
            document.head.appendChild(script);
          })();`
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
