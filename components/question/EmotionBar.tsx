'use client';

import React, { useEffect, useState } from 'react';
import { EMOTION_THEMES, EmotionDetection } from '@/lib/emotion';
import { Sparkles } from 'lucide-react';

interface EmotionBarProps {
  questionText: string;
}

export default function EmotionBar({ questionText }: EmotionBarProps) {
  const [emotion, setEmotion] = useState<EmotionDetection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detectEmotion() {
      try {
        const res = await fetch('/api/detect-emotion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: questionText }),
        });
        if (res.ok) {
          const data = await res.json();
          setEmotion(data);
        }
      } catch (err) {
        console.error('Failed to detect emotion:', err);
      } finally {
        setLoading(false);
      }
    }

    if (questionText) {
      detectEmotion();
    }
  }, [questionText]);

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  if (!emotion || emotion.primary_emotion === 'Neutral') {
    return null; // Don't show anything for neutral questions
  }

  const theme = EMOTION_THEMES[emotion.primary_emotion] || EMOTION_THEMES['Neutral'];

  return (
    <div className={`rounded-2xl p-5 mb-8 border ${theme.bgClass} ${theme.borderClass} animate-slide-up shadow-sm`}>
      <div className="flex items-start gap-4">
        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm shrink-0 mt-1">
          {theme.icon}
        </div>
        <div>
          <div className={`text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${theme.textClass}`}>
            <Sparkles className="w-3.5 h-3.5" />
            Detected Emotion: {emotion.primary_emotion}
          </div>
          <p className="text-gray-700 italic font-medium leading-relaxed">
            "{emotion.opening_acknowledgment}"
          </p>
        </div>
      </div>
    </div>
  );
}
