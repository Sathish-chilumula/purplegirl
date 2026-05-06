import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ask Anonymously — Get Private Advice | PurpleGirl',
  description: 'Ask any question completely anonymously and get honest advice on relationships, health, and life. No login required, no tracking.',
  alternates: {
    canonical: '/ask',
  },
};

export default function AskLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
