'use client';

import React, { useState, useEffect } from 'react';
import { Share, Sparkles } from 'lucide-react';
import ShareModal from '../share/ShareModal';
import MeTooButton from './MeTooButton';
import { recordCategoryVisit, recordQuestionAsk } from '@/lib/sisterMemory';

interface QuestionClientProps {
  questionId: string;
  initialMeToo: number;
  questionTitle: string;
  questionSlug: string;
  bulletPoints: string[];
  summary: string;
  categoryName?: string;
  categorySlug?: string;
  chatLog?: string[];
}

export default function QuestionClient({ 
  questionId, 
  initialMeToo, 
  questionTitle, 
  questionSlug, 
  bulletPoints, 
  summary,
  categoryName = 'PurpleGirl',
  categorySlug,
  chatLog = []
}: QuestionClientProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    // Feed the Sister Memory so the platform learns what the user cares about
    if (categorySlug) {
      recordCategoryVisit(categorySlug);
    }
    if (questionSlug) {
      recordQuestionAsk(questionSlug);
    }
  }, [categorySlug, questionSlug]);

  return (
    <>
      <div className="bg-gradient-to-br from-[#FAF5FF] to-[#FDF2F8] border border-purple-100 rounded-3xl p-6 md:p-10 text-center mb-16 shadow-sm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-200/40 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <h3 className="font-bold text-2xl text-[#1F1235] mb-2">Help a sister out 💜</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Know someone who might be going through the same thing? Share this answer with them.
          </p>
          
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center justify-center gap-3 bg-[#1F1235] text-white px-8 py-4 rounded-full font-bold hover:bg-purple-900 transition-all shadow-lg shadow-purple-900/20 hover:scale-105 hover:shadow-xl group mx-auto mb-10"
          >
            <Share className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Share this Answer
          </button>
          
          <div className="pt-8 border-t border-purple-200/60 max-w-md mx-auto">
            <MeTooButton 
              questionId={questionId} 
              initialCount={initialMeToo} 
              variant="prominent"
            />
          </div>
        </div>
      </div>

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        questionTitle={questionTitle}
        questionSlug={questionSlug}
        categoryName={categoryName}
        chatLog={chatLog}
        bulletPoints={bulletPoints}
      />
    </>
  );
}
