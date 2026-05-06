import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Dashboard | PurpleGirl',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[#FAF5FF] flex flex-col">
          <header className="bg-[#7C3AED] text-white py-4 px-6 shadow-md mt-16 md:mt-20">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <Link href="/admin" className="font-bold text-2xl tracking-tight">
                PurpleGirl Admin 💜
              </Link>
              <nav className="flex gap-4 font-medium text-sm">
                <Link href="/" className="hover:text-purple-200 transition-colors bg-white/10 px-4 py-2 rounded-full">View Live Site</Link>
              </nav>
            </div>
          </header>
          <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
