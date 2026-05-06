import { Outfit, Lora } from 'next/font/google';
import '../../app/globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });
const lora = Lora({ subsets: ['latin'], variable: '--font-display' });

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${lora.variable}`}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
