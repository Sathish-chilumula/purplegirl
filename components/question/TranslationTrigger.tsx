'use client';

import { useEffect, useState } from 'react';
import { Loader2, Globe } from 'lucide-react';

interface TranslationTriggerProps {
  questionId: string;
  lang: 'hi' | 'te';
  langName: string;
}

export default function TranslationTrigger({ questionId, lang, langName }: TranslationTriggerProps) {
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    async function requestTranslation() {
      try {
        const res = await fetch('/api/translate-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId, lang }),
        });

        if (res.ok) {
          setStatus('done');
          // Refresh the page to show the translated content
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    }

    requestTranslation();
  }, [questionId, lang]);

  if (status === 'done') {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl">✅</div>
        <p className="font-bold text-[#1F1235]">Translation ready! Loading {langName} version…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-2xl">❌</div>
        <p className="font-bold text-red-600">Could not generate translation. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-32 text-center animate-pulse">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
          <Globe className="w-8 h-8 text-purple-600" />
        </div>
        <Loader2 className="absolute -top-1 -right-1 w-6 h-6 text-pink-500 animate-spin" />
      </div>
      <div>
        <p className="font-bold text-[#1F1235] text-xl mb-1">Translating to {langName}…</p>
        <p className="text-gray-500 text-sm">Our AI sister is adapting this answer culturally for you.</p>
        <p className="text-gray-400 text-xs mt-1">This only happens once. Future visits will be instant.</p>
      </div>
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
