import { FolioData } from './types';

export const FOLIOS: FolioData[] = [
  {
    id: 'vol-1',
    volumeLabel: 'VOL. I',
    title: 'THE BOTANICAL CODEX',
    description: 'Questions of life, growth, family roots, and the slow unraveling of personal history.',
    imageSrc: '/images/vol-1.png',
    topics: ['family', 'childhood', 'parents', 'growth', 'life', 'history', 'roots', 'mother', 'father']
  },
  {
    id: 'vol-2',
    volumeLabel: 'VOL. II',
    title: 'THE ASTRONOMICAL WHEEL',
    description: 'Questions of fate, relationships, cosmic timing, and the invisible forces between people.',
    imageSrc: '/images/vol-2.png',
    topics: ['love', 'relationships', 'marriage', 'fate', 'timing', 'destiny', 'partner', 'loneliness']
  },
  {
    id: 'vol-3',
    volumeLabel: 'VOL. III',
    title: 'THE BIOLOGICAL PHARMACOPEIA',
    description: 'Questions of the body, intimacy, health, and the physical truths we hide.',
    imageSrc: '/images/vol-3.png',
    topics: ['body', 'intimacy', 'health', 'physical', 'pain', 'sex', 'shame', 'appearance']
  },
  {
    id: 'vol-4',
    volumeLabel: 'VOL. IV',
    title: 'THE ALCHEMICAL RECIPES',
    description: 'Questions of career, ambition, money, and the transformation of the self.',
    imageSrc: '/images/vol-4.png',
    topics: ['career', 'money', 'ambition', 'work', 'success', 'failure', 'future', 'transformation']
  }
];

export function getFolioForVolume(volume: string): FolioData {
  return FOLIOS.find(f => f.volumeLabel === volume) || FOLIOS[0];
}
