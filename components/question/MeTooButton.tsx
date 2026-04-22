'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';

interface MeTooButtonProps {
  questionId: string;
  initialCount: number;
  variant?: 'compact' | 'prominent';
}

export default function MeTooButton({ questionId, initialCount, variant = 'prominent' }: MeTooButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [hasVoted, setHasVoted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const voted = localStorage.getItem(`metoo_${questionId}`);
      if (voted) {
        setHasVoted(true);
      }
      setIsLoaded(true);
    }
  }, [questionId]);

  const handleVote = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (hasVoted) return;
    
    setHasVoted(true);
    localStorage.setItem(`metoo_${questionId}`, 'true');
    setCount(prev => prev + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
    
    try {
      await supabase
        .from('questions')
        .update({ metoo_count: initialCount + 1 })
        .eq('id', questionId);
    } catch (err) {
      console.error('Error updating me too:', err);
    }
  };

  if (variant === 'compact') {
    return (
      <button 
        onClick={handleVote}
        disabled={hasVoted}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
          hasVoted 
            ? 'bg-pink-50 text-pink-600 border border-pink-100' 
            : 'bg-white text-text-secondary hover:text-pink-accent border border-gray-200 hover:border-pink-200 shadow-sm'
        }`}
      >
        <Heart className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} /> 
        <span className="font-medium text-sm">{count.toLocaleString()}</span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleVote}
      disabled={hasVoted}
      className={`group relative flex items-center justify-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all w-full md:w-auto overflow-hidden ${
        hasVoted 
          ? 'bg-pink-50 text-pink-600 border border-pink-200 cursor-default' 
          : 'bg-gradient-to-r from-pink-50 to-purple-50 text-text-primary border border-purple-100 shadow-sm hover:border-pink-300 hover:shadow-md'
      }`}
    >
      <motion.div animate={isAnimating ? { scale: [1, 1.5, 1], rotate: [0, -10, 10, 0] } : {}}>
        <Heart className={`w-6 h-6 transition-all ${hasVoted ? 'fill-pink-500 text-pink-500' : 'text-pink-400 group-hover:scale-110 group-hover:fill-pink-200'}`} />
      </motion.div>
      <span className="relative z-10">
        {hasVoted ? `You and ${count.toLocaleString()} girls` : `${count.toLocaleString()} girls relate to this`}
      </span>
      {!hasVoted && (
        <span className="absolute right-4 text-xs font-semibold text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded-md shadow-sm border border-pink-100">
          Me Too!
        </span>
      )}
    </button>
  );
}
