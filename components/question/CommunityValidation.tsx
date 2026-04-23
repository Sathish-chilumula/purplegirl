'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, ThumbsUp, Loader2 } from 'lucide-react';

interface Tip {
  tip: string;
  yes: number;
  no: number;
}

interface CommunityValidationProps {
  answerId: string;
  bulletPoints: string[];
  initialTips?: Tip[]; // Can be passed from SSR if we have it, otherwise we'll build it
}

export default function CommunityValidation({ answerId, bulletPoints, initialTips = [] }: CommunityValidationProps) {
  const [tips, setTips] = useState<Tip[]>([]);
  const [votedMap, setVotedMap] = useState<Record<number, 'yes' | 'no'>>({});
  const [isVoting, setIsVoting] = useState<number | null>(null);

  useEffect(() => {
    // Initialize tips array
    const formattedTips = bulletPoints.map((text, i) => {
      const existing = initialTips[i];
      return {
        tip: text,
        yes: existing?.yes || 0,
        no: existing?.no || 0
      };
    });
    setTips(formattedTips);

    // Load voted state from localStorage
    const savedVotes: Record<number, 'yes' | 'no'> = {};
    bulletPoints.forEach((_, i) => {
      const vote = localStorage.getItem(`voted_tip_${answerId}_${i}`);
      if (vote === 'yes' || vote === 'no') {
        savedVotes[i] = vote as 'yes' | 'no';
      }
    });
    setVotedMap(savedVotes);
  }, [answerId, bulletPoints, initialTips]);

  const handleVote = async (index: number, vote: 'yes' | 'no') => {
    if (votedMap[index]) return; // Already voted

    setIsVoting(index);

    // Optimistic UI update
    const newTips = [...tips];
    if (vote === 'yes') newTips[index].yes += 1;
    if (vote === 'no') newTips[index].no += 1;
    setTips(newTips);
    
    setVotedMap(prev => ({ ...prev, [index]: vote }));
    localStorage.setItem(`voted_tip_${answerId}_${index}`, vote);

    try {
      const res = await fetch('/api/validate-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answerId,
          tipIndex: index,
          vote,
          tipText: tips[index].tip
        })
      });

      if (!res.ok) {
        throw new Error('Vote failed');
      }
      
      const data = await res.json();
      if (data.updatedTips) {
        // Sync with real DB counts just in case
        const syncedTips = [...newTips];
        syncedTips[index] = data.updatedTips[index];
        setTips(syncedTips);
      }
      
    } catch (error) {
      console.error('Error recording vote:', error);
      // Revert on failure
      const reverted = [...tips];
      if (vote === 'yes') reverted[index].yes -= 1;
      if (vote === 'no') reverted[index].no -= 1;
      setTips(reverted);
      
      setVotedMap(prev => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
      localStorage.removeItem(`voted_tip_${answerId}_${index}`);
    } finally {
      setIsVoting(null);
    }
  };

  if (!bulletPoints || bulletPoints.length === 0) return null;

  return (
    <div className="my-12 p-8 rounded-[2.5rem] aurora-bg border border-purple-100 shadow-sm animate-slide-up">
      <h3 className="font-playfair italic text-2xl text-[#1F1235] mb-8 text-center flex items-center justify-center gap-2">
        <span className="text-purple-600">💜</span> What actually worked for sisters
      </h3>

      <div className="space-y-4">
        {tips.map((tipData, index) => {
          const hasVoted = !!votedMap[index];
          const votedYes = votedMap[index] === 'yes';
          const totalVotes = tipData.yes + tipData.no;
          const yesPercentage = totalVotes > 0 ? Math.round((tipData.yes / totalVotes) * 100) : 0;
          const displayPercentage = hasVoted ? yesPercentage : 0; // Only show bar after voting if desired, or always show. Let's show if there are votes.

          return (
            <div key={index} className="card-premium glass p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden group">
              {/* Progress Bar Background (subtle) */}
              {totalVotes > 0 && (
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-green-50 to-emerald-50/30 -z-10 transition-all duration-1000"
                  style={{ width: `${yesPercentage}%` }}
                />
              )}

              {/* Tip Text */}
              <div className="flex-1">
                <p className="text-[#1F1235] font-medium leading-relaxed">
                  {tipData.tip}
                </p>
                {totalVotes > 0 && (
                  <p className="text-xs font-bold text-gray-400 mt-3 flex items-center gap-1.5 animate-fade-in">
                    <ThumbsUp className="w-3 h-3 text-green-500" />
                    {tipData.yes} {tipData.yes === 1 ? 'sister' : 'sisters'} found this helpful
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="shrink-0 flex flex-col items-end gap-2 w-full md:w-auto mt-4 md:mt-0">
                {!hasVoted ? (
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => handleVote(index, 'yes')}
                      disabled={isVoting === index}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-green-200 text-green-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-50 hover:border-green-300 transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isVoting === index ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Worked for me
                    </button>
                    <button 
                      onClick={() => handleVote(index, 'no')}
                      disabled={isVoting === index}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Didn't work
                    </button>
                  </div>
                ) : (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${votedYes ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                    {votedYes ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {votedYes ? 'You found this helpful' : "Didn't work for you"}
                  </div>
                )}
                
                {hasVoted && (
                  <p className="text-[10px] text-gray-400 font-medium italic animate-fade-in w-full text-right">
                    Thanks for helping the sisterhood 💜
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
