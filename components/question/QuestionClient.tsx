'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Copy, Check, Instagram } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface QuestionClientProps {
  questionId: string;
  initialMeToo: number;
  questionTitle: string;
  questionSlug: string;
  bulletPoints: string[];
  summary: string;
}

export default function QuestionClient({ 
  questionId, 
  initialMeToo, 
  questionTitle, 
  questionSlug, 
  bulletPoints, 
  summary 
}: QuestionClientProps) {
  const [metooCount, setMetooCount] = useState(initialMeToo);
  const [hasMeToo, setHasMeToo] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleMeToo = async () => {
    if (hasMeToo) return;
    
    setHasMeToo(true);
    setMetooCount(prev => prev + 1);
    
    try {
      await supabase
        .from('questions')
        .update({ metoo_count: initialMeToo + 1 })
        .eq('id', questionId);
    } catch (err) {
      console.error('Error updating me too:', err);
    }
  };

  const handleCopy = () => {
    const textToCopy = `Q: ${questionTitle}\n\n${summary}\n\nTips:\n${bulletPoints.map(t => '✅ ' + t).join('\n')}\n\nRead more at: https://purplegirl.in/q/${questionSlug}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = `💜 *PurpleGirl Answers*\n\n*Q: ${questionTitle}*\n\n${bulletPoints.slice(0,3).map(t => '✅ ' + t).join('\n')}\n\n📖 Full answer + FAQs:\npurplegirl.in/q/${questionSlug}\n\n_Ask anything anonymously at purplegirl.in_ 💜`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-[#FAF5FF] to-[#FDF2F8] border border-purple-100 rounded-3xl p-6 md:p-10 text-center mb-16 shadow-sm">
      <h3 className="font-bold text-xl text-text-primary mb-6">Found this helpful? Share it 💜</h3>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button 
          onClick={shareWhatsApp}
          className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity shadow-sm"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </button>
        
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 bg-white text-text-primary border border-purple-200 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors shadow-sm min-w-[160px] justify-center"
        >
          {copied ? <><Check className="w-5 h-5 text-green-500" /> Copied!</> : <><Copy className="w-5 h-5" /> Copy Text</>}
        </button>
        
        <button className="flex items-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity shadow-sm">
          <Instagram className="w-5 h-5" />
          Share as Image
        </button>
      </div>
      
      <div className="pt-8 border-t border-purple-100/50">
        <button 
          onClick={handleMeToo}
          disabled={hasMeToo}
          className={`flex items-center justify-center w-full gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
            hasMeToo 
              ? 'bg-pink-100 text-pink-600 border border-pink-200' 
              : 'bg-white text-text-primary border border-purple-200 shadow-sm hover:border-pink-300 hover:shadow-md'
          }`}
        >
          <Heart className={`w-6 h-6 ${hasMeToo ? 'fill-current text-pink-500' : 'text-pink-accent'}`} />
          {hasMeToo ? `You and ${metooCount} girls asked this` : `${metooCount} girls have this question too`}
        </button>
      </div>
    </div>
  );
}
