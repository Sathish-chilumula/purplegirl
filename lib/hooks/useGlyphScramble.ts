'use client';

import { useState, useEffect } from 'react';

// Medieval / Alchemical Unicode blocks for the scramble effect
const GLYPHS = [
  '🜁', '🜂', '🜃', '🜄', '🜔', '🜍', '🜏', '🜛', '🜚', '🜲', '🜳', 
  '☿', '♀', '♁', '♂', '♃', '♄', '♅', '♆', '♇',
  '🝆', '🝇', '🝈', '🝉', '🝊', '🝋', '🝌', '🝍', '🝎', '🝏'
];

export function useGlyphScramble(
  finalText: string,
  isActive: boolean = true,
  duration: number = 1000,
  scrambleSpeed: number = 50
) {
  const [displayText, setDisplayText] = useState(
    isActive ? '' : finalText
  );

  useEffect(() => {
    if (!isActive || !finalText) {
      setDisplayText(finalText || '');
      return;
    }

    const length = finalText.length;
    let iteration = 0;
    
    // How many times should we scramble before revealing a real character?
    const maxIterations = Math.floor(duration / scrambleSpeed);
    const charsPerIteration = length / maxIterations;

    const interval = setInterval(() => {
      setDisplayText((prev) => {
        let newText = '';
        const revealCount = Math.floor(iteration * charsPerIteration);

        for (let i = 0; i < length; i++) {
          if (i < revealCount) {
            // Uncover actual character
            newText += finalText[i];
          } else {
            // Keep scrambling
            newText += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }

        if (iteration >= maxIterations) {
          clearInterval(interval);
          return finalText;
        }

        iteration++;
        return newText;
      });
    }, scrambleSpeed);

    return () => clearInterval(interval);
  }, [finalText, isActive, duration, scrambleSpeed]);

  return displayText;
}
