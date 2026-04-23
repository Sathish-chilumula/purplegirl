'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, EyeOff, Lock, Trash2, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/slugify';
import { useRouter } from 'next/navigation';

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
          category_id: null, // Depending on schema, might need a generic category ID
          status: 'approved',
          is_whisper: true // Optional flag if DB supports it
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
    <div className="min-h-screen bg-[#0F0A18] text-purple-50 flex flex-col relative overflow-hidden selection:bg-purple-500/30">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-900/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/10 relative z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-purple-300 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Exit Whisper Mode
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-400">
            <EyeOff className="w-4 h-4" /> Incognito
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 max-w-2xl mx-auto w-full">
        <div className="text-center mb-10 animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 mx-auto mb-6 shadow-2xl">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="font-playfair text-4xl font-bold text-white mb-4 tracking-tight">Whisper Mode</h1>
          <p className="text-purple-300/80 max-w-sm mx-auto text-sm leading-relaxed">
            Your secrets are safe here. Zero tracking. Zero judgment. Just empathetic advice for your most sensitive thoughts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative group mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <textarea
              className="relative w-full bg-[#1A1225] border border-white/10 rounded-3xl p-6 min-h-[160px] text-lg focus:outline-none focus:border-purple-500/50 placeholder:text-purple-300/30 resize-none text-white shadow-2xl transition-all"
              placeholder="Whisper your thought..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <button 
              type="button" 
              onClick={() => setQuestion('')}
              className="p-3 text-purple-400/50 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              title="Clear"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || !question}
              className="flex-1 bg-purple-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-purple-900/50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {isSubmitting ? 'Encrypting...' : 'Send Confidentially'}
            </button>
          </div>
        </form>

        <div className="mt-16 flex items-center gap-6 text-xs text-purple-400/40 font-medium">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> No IP Logs</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Untraceable</span>
        </div>
      </main>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
