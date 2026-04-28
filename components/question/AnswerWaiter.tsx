'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function AnswerWaiter({ questionId }: { questionId: string }) {
  const router = useRouter();
  const [found, setFound] = useState(false);
  const [dots, setDots] = useState('');

  // Animate dots for loading
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Poll for the answer
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (found) return;
    
    const checkAnswer = async () => {
      try {
        const { data } = await supabase
          .from('answers')
          .select('id')
          .eq('question_id', questionId)
          .single();
          
        if (data) {
          // Answer found! Stop polling and refresh.
          setFound(true);
          router.refresh();
        } else {
          // Not found yet, schedule another check.
          timeout = setTimeout(checkAnswer, 3000); // Check every 3 seconds
        }
      } catch (err) {
        // Suppress 'single() returned no rows' errors during polling
        timeout = setTimeout(checkAnswer, 3000);
      }
    };

    checkAnswer();

    // Cleanup: stop polling after 2 minutes just in case AI fails, to save resources
    const maxPollTimeout = setTimeout(() => {
      clearTimeout(timeout);
    }, 120000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(maxPollTimeout);
    };
  }, [questionId, router]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/50 rounded-3xl p-8 md:p-12 text-center mb-12 shadow-inner relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Sparkles className="w-24 h-24 text-purple-primary" />
      </div>
      
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-purple-100">
        <Loader2 className="w-8 h-8 text-purple-primary animate-spin" />
      </div>
      
      <h3 className="font-playfair font-bold text-2xl md:text-3xl text-purple-primary mb-3">
        Our AI Sisters are writing your answer{dots}
      </h3>
      <p className="text-text-secondary text-base max-w-md mx-auto">
        We're consulting the vault and generating an expert, non-judgmental response. 
        Please wait here—your anonymous answer will appear instantly in a few seconds! 💜
      </p>
    </motion.div>
  );
}
