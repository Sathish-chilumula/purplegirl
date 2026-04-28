'use client';

import React from 'react';
import { Question, FolioData } from '@/lib/types';
import { GlyphAvatar } from './GlyphAvatar';
import { useGlyphScramble } from '@/lib/hooks/useGlyphScramble';

interface AnswerCardProps {
  question: Question;
  folio: FolioData;
}

export function AnswerCard({ question, folio }: AnswerCardProps) {
  // Use cipher_key if available, fallback to part of question ID
  const cipherKey = useGlyphScramble(
    question.cipher_key || question.id.substring(0, 8).toUpperCase(),
    true,
    1500,
    50
  );

  const getWhatsAppLink = () => {
    const quote = question.pull_quote || question.seo_title || 'An honest answer.';
    const url = `https://purplegirl.in/q/${question.slug}`;
    const text = `Finally got an honest answer to this:\n\n"${quote}"\n\nRead the full answer: ${url}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <article className="surface-card w-full max-w-4xl mx-auto rounded-sm overflow-hidden border-t-2 border-t-pg-crimson-600 animate-fade-in my-8">
      {/* HEADER: The Question */}
      <header className="p-6 md:p-8 border-b border-pg-parch-200 bg-pg-parch-50 flex gap-4 md:gap-6 items-start">
        <GlyphAvatar userId={question.id} className="mt-1" />
        <div className="flex-1">
          <h2 className="font-im-fell italic text-2xl md:text-3xl text-pg-ink-900 leading-tight">
            {question.title}
          </h2>
          <div className="mt-2 font-cinzel text-[10px] tracking-[0.2em] text-pg-ink-500">
            RECORDED: {new Date(question.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
          </div>
        </div>
      </header>

      {/* BODY: Split layout */}
      <div className="flex flex-col md:flex-row bg-white">
        
        {/* LEFT STRIP: Folio Context */}
        <aside className="w-full md:w-[160px] lg:w-[200px] shrink-0 border-r border-pg-parch-200 relative overflow-hidden bg-pg-parch-100 flex flex-col">
          <div className="relative h-48 md:h-full w-full">
            <img 
              src={folio.imageSrc} 
              alt={folio.volumeLabel}
              className="absolute inset-0 w-full h-full object-cover opacity-60 sepia-[0.3] saturate-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent via-transparent to-white/90" />
            <div className="absolute bottom-4 left-4 font-cinzel text-[10px] tracking-widest text-pg-crimson-600 font-bold opacity-80 mix-blend-multiply">
              {folio.volumeLabel}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT: The Answer */}
        <div className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="font-cinzel text-[10px] tracking-[0.3em] text-pg-crimson-600 uppercase mb-6 opacity-80">
            The Oracle's Transcription
          </div>
          
          <div className="prose prose-purplegirl max-w-none text-pg-ink-800 font-crimson text-lg leading-relaxed">
            {/* 
              In a real scenario, this is where we map through chat_log or answerHtml.
              Here we just render the raw HTML output or a mocked view. 
              The classes below simulate how the HTML should be styled globally.
            */}
            <style>{`
              .prose-purplegirl p {
                animation: inkSeep 0.8s var(--ease-out) both;
              }
              .prose-purplegirl p:nth-child(1) { animation-delay: 0.1s; }
              .prose-purplegirl p:nth-child(2) { animation-delay: 0.2s; }
              .prose-purplegirl p:nth-child(3) { animation-delay: 0.3s; }
              .prose-purplegirl p:nth-child(4) { animation-delay: 0.4s; }
              
              .prose-purplegirl em { color: var(--pg-crimson-600); font-style: italic; }
              .prose-purplegirl strong { color: var(--pg-gold-600); font-weight: normal; }
              .prose-purplegirl blockquote { 
                border-left: 2px solid var(--pg-crimson-600); 
                padding-left: 1.5rem; 
                margin-left: 0;
                font-style: italic;
                color: var(--pg-ink-600);
              }
            `}</style>
            
            {question.chat_log && question.chat_log.length > 0 ? (
              <div dangerouslySetInnerHTML={{ __html: question.chat_log.map(l => `<p>${l.text}</p>`).join('') }} />
            ) : (
              <div className="animate-pulse">Decoding cipher...</div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER: Actions */}
      <footer className="px-6 md:px-8 py-4 border-t border-pg-parch-200 bg-pg-parch-50 flex justify-between items-center flex-wrap gap-4">
        <a 
          href={getWhatsAppLink()} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-sm font-cinzel text-[10px] tracking-widest transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          SHARE ANSWER
        </a>
        
        <div className="flex flex-col items-end">
          <div className="font-cinzel text-[8px] tracking-[0.25em] text-pg-ink-400 mb-1 uppercase">
            Cipher Key
          </div>
          <div className="font-unifraktur text-lg text-pg-gold-600 opacity-80 select-all cursor-text leading-none">
            {cipherKey}
          </div>
        </div>
      </footer>
    </article>
  );
}
