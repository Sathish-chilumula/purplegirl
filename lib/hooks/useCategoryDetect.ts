'use client';

import { useState, useEffect, useRef } from 'react';

// Hardcoded keywords for the primary 12 categories for real-time UI feedback
const CATEGORY_KEYWORDS = [
  { id: 'beauty-skincare', keywords: ['skin', 'face', 'pimple', 'acne', 'glow', 'cream', 'serum'] },
  { id: 'fashion-style', keywords: ['dress', 'wear', 'outfit', 'clothes', 'style', 'fashion'] },
  { id: 'haircare', keywords: ['hair', 'scalp', 'shampoo', 'dandruff', 'fall', 'growth'] },
  { id: 'relationships-love', keywords: ['boy', 'friend', 'date', 'love', 'crush', 'breakup', 'marriage'] },
  { id: 'mental-wellness', keywords: ['anxiety', 'stress', 'sad', 'happy', 'mental', 'mind', 'feel'] },
  { id: 'health-basics', keywords: ['period', 'cycle', 'pain', 'health', 'body', 'stomach'] },
  { id: 'pregnancy-baby-care', keywords: ['pregnant', 'baby', 'conceive', 'mother'] }
];

export function useCategoryDetect(text: string, debounceMs: number = 300) {
  const [detectedCategoryId, setDetectedCategoryId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!text || text.trim().length < 5) {
      setDetectedCategoryId(null);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      const lowerText = text.toLowerCase();
      
      let bestMatch: string | null = null;
      let maxScore = 0;

      for (const cat of CATEGORY_KEYWORDS) {
        let score = 0;
        for (const keyword of cat.keywords) {
          if (lowerText.includes(keyword)) {
            score++;
          }
        }
        if (score > maxScore) {
          maxScore = score;
          bestMatch = cat.id;
        }
      }

      setDetectedCategoryId(bestMatch);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, debounceMs]);

  return detectedCategoryId;
}
