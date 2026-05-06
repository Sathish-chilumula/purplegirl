'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, EyeOff, Lock, Trash2, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/slugify';
import { useRouter } from 'next/navigation';
import { ManuscriptSymbols } from '@/components/home/ManuscriptElements';

export const runtime = 'edge';

export default function WhisperModePage() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    
    setIsSubmitting(true);
    try {
      const questionId = crypto.randomUUID();
      const slug = `whisper-${slugify(question).substring(0, 30)}-${Math.random().toString(36).substring(2, 7)}`;

      // Post to a specific "whisper" category if available or handle safely
      const { error } = await supabase
        .from('questions')
        .insert([{
          id: questionId,
          title: question,
          slug,
          status: 'approved',
          is_whisper: true 
        }]);

      if (error) throw error;

      // Generate answer
      fetch('/api/generate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId }),
      });

      router.push(`/q/${slug}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app min-h-screen bg-[var(--void)] text-[var(--ink)] flex flex-col relative overflow-hidden">
      {/* Background Library Texture */}
      <div className="absolute inset-0 z-0 opacity-15 mix-blend-multiply pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="scale-150 rotate-12 opacity-40">
             <div className="w-[1000px] h-[1000px] border border-[var(--crimson-glow)] rounded-full animate-spin-slow" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[800px] h-[800px] border border-[var(--gold-glow)] rounded-full animate-spin-slow reverse" />
             </div>
           </div>
        </div>
      </div>

      <header className="border-b border-[var(--gold-dim)] border-opacity-10 relative z-10">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[var(--ink-dim)] hover:text-[var(--crimson)] transition-colors flex items-center gap-2 text-[10px] font-cinzel font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Exit the Vault
          </Link>
          <div className="flex items-center gap-3 text-[10px] font-cinzel font-bold uppercase tracking-widest text-[var(--crimson)]">
            <EyeOff className="w-4 h-4" /> Invisible Folio
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 max-w-2xl mx-auto w-full">
        <div className="text-center mb-12 animate-slide-up">
          <div className="w-20 h-20 rounded-full border border-[var(--crimson)] flex items-center justify-center mx-auto mb-8 bg-[rgba(140,26,26,0.05)] shadow-[0_0_30px_rgba(140,26,26,0.15)]">
            <Lock className="w-8 h-8 text-[var(--crimson-hi)]" />
          </div>
          <div className="sec-label">The Silent Confession</div>
          <h1 className="font-cinzel text-4xl font-black text-[var(--ink)] mb-6 tracking-tight">Whisper Mode</h1>
          <p className="font-im-fell italic text-lg text-[var(--ink-dim)] max-w-md mx-auto leading-relaxed">
            Your secrets are erased from the world. No logs. No tracing. Just an elder sister listening from the shadows.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="ask-wrap !max-w-none">
            <div className="ask-frame" />
            <div className="ask-inner !flex-col">
              <div className="flex items-start gap-4 w-full">
                <div className="ask-pilcrow">¶</div>
                <textarea
                  className="ask-ta !min-h-[200px]"
                  placeholder="Whisper your most guarded thought..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center justify-between w-full mt-6 border-t border-[rgba(201,168,76,0.05)] pt-6">
                <button 
                  type="button" 
                  onClick={() => setQuestion('')}
                  className="p-3 text-[var(--ink-dim)] hover:text-[var(--crimson-hi)] transition-all"
                  title="Erase Confession"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !question}
                  className="ask-btn !px-12 !py-4 flex items-center gap-3"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isSubmitting ? 'Encrypting...' : 'Reveal Confidentially'}
                </button>
              </div>
              <ManuscriptSymbols active={isSubmitting} />
            </div>
          </div>
        </form>

        <div className="mt-20 flex items-center gap-8 text-[9px] font-cinzel font-bold text-[var(--ink-dim)] uppercase tracking-[3px] opacity-60">
          <span className="flex items-center gap-2">✦ NO IP LOGS</span>
          <span className="flex items-center gap-2">✦ UNTRACEABLE</span>
          <span className="flex items-center gap-2">✦ ERASED DATA</span>
        </div>
      </main>
    </div>
  );
}
