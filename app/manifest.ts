import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PurpleGirl — Advice for Indian Women',
    short_name: 'PurpleGirl',
    description: 'Honest how-to guides on relationships, health, career and more. 100% anonymous. No login required.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF1F2',
    theme_color: '#581C87',
    orientation: 'portrait',
    categories: ['lifestyle', 'health', 'education'],
    lang: 'en',
    icons: [
      {
        src: '/icons/pwa-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/pwa-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/pwa-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Ask Anonymously',
        short_name: 'Ask',
        description: 'Ask a question anonymously',
        url: '/ask',
        icons: [{ src: '/icons/shortcut-ask.png', sizes: '96x96' }],
      },
      {
        name: 'Period Calculator',
        short_name: 'Calculator',
        description: 'Track your cycle',
        url: '/tools/period-calculator',
        icons: [{ src: '/icons/shortcut-calculator.png', sizes: '96x96' }],
      },
      {
        name: 'Saved Guides',
        short_name: 'Saved',
        description: 'View your saved guides',
        url: '/saved',
        icons: [{ src: '/icons/shortcut-saved.png', sizes: '96x96' }],
      },
    ],
    screenshots: [
      {
        src: '/screenshots/desktop.png',
        sizes: '1280x800',
        type: 'image/png',
        label: 'PurpleGirl Desktop',
      },
    ],
  };
}
