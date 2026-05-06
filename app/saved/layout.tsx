import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Saved Guides | PurpleGirl',
  description: 'View your locally saved guides on relationships, health, and career. 100% private and stored on your device.',
  alternates: {
    canonical: '/saved',
  },
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
