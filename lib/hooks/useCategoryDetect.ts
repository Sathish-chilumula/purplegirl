'use client';

import { useState, useEffect, useRef } from 'react';
import { FOLIOS } from '../folios';
import { FolioData } from '../types';

export function useCategoryDetect(text: string, debounceMs: number = 300) {
  const [detectedFolio, setDetectedFolio] = useState<FolioData | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!text || text.trim().length < 5) {
      setDetectedFolio(null);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      const lowerText = text.toLowerCase();
      
      // Simple keyword matching against folio topics
      // Find the folio with the highest number of matches
      let bestMatch: FolioData | null = null;
      let maxScore = 0;

      for (const folio of FOLIOS) {
        let score = 0;
        for (const topic of folio.topics) {
          if (lowerText.includes(topic)) {
            score++;
          }
        }
        if (score > maxScore) {
          maxScore = score;
          bestMatch = folio;
        }
      }

      setDetectedFolio(bestMatch);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, debounceMs]);

  return detectedFolio;
}
