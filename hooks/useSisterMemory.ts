'use client';

import { useState, useEffect } from 'react';
import { getMemory, updateMemory, registerVisit, SisterMemory } from '@/lib/sisterMemory';

export function useSisterMemory() {
  const [memory, setMemory] = useState<SisterMemory | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Register visit and load memory on mount
    registerVisit();
    setMemory(getMemory());
    setIsLoaded(true);

    // Optional: listen to storage events to sync across tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'purplegirl_memory') {
        setMemory(getMemory());
      }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setNickname = (name: string) => {
    updateMemory({ nickname: name });
    setMemory(getMemory());
  };

  const getTopCategory = (): string | null => {
    if (!memory) return null;
    const cats = Object.entries(memory.topCategories);
    if (cats.length === 0) return null;
    
    // Sort by count descending
    cats.sort((a, b) => b[1] - a[1]);
    return cats[0][0];
  };

  return {
    memory,
    isLoaded,
    setNickname,
    getTopCategory,
    isReturningUser: memory && memory.visitCount > 1,
  };
}
