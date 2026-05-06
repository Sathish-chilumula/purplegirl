import type { Dictionary } from '@/types/dictionary';

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('../../dictionaries/en.json').then((m) => m.default),
  hi: () => import('../../dictionaries/hi.json').then((m) => m.default),
  te: () => import('../../dictionaries/te.json').then((m) => m.default),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  const loader = dictionaries[locale] || dictionaries['en'];
  return loader();
};
