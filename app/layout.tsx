import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
    <html lang="en">
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
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
