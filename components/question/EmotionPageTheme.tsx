'use client';

import { useEffect } from 'react';

interface EmotionPageThemeProps {
  emotion?: string;
}

export default function EmotionPageTheme({ emotion }: EmotionPageThemeProps) {
  useEffect(() => {
    if (emotion) {
      document.body.setAttribute('data-emotion', emotion);
    } else {
      document.body.removeAttribute('data-emotion');
    }

    return () => {
      document.body.removeAttribute('data-emotion');
    };
  }, [emotion]);

  return null;
}
