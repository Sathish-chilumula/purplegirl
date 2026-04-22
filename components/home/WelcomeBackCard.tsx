'use client';

import React, { useState } from 'react';
import { useSisterMemory } from '@/hooks/useSisterMemory';
import { Heart, Sparkles, X } from 'lucide-react';

export default function WelcomeBackCard() {
  const { memory, isLoaded, isReturningUser, setNickname } = useSisterMemory();
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameInputValue, setNameInputValue] = useState('');
  const [dismissed, setDismissed] = useState(false);

  if (!isLoaded || !isReturningUser || dismissed) return null;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInputValue.trim()) {
      setNickname(nameInputValue.trim());
      setShowNameInput(false);
    }
  };

  const displayName = memory?.nickname || 'Sister';

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-6 mb-8 relative shadow-sm animate-fade-in">
      <button 
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 text-purple-300 hover:text-purple-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start gap-4">
        <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm border border-purple-100 shrink-0">
          💜
        </div>
        
        <div className="flex-1">
          <h3 className="font-playfair font-bold text-xl text-[#1F1235] mb-1 flex items-center gap-2">
            Welcome back, {displayName} <Sparkles className="w-4 h-4 text-pink-400" />
          </h3>
          
          <p className="text-gray-600 text-sm mb-4">
            {memory?.visitCount && memory.visitCount > 5 
              ? "So glad to see you again! We've saved some new answers for you." 
              : "We're here for whatever's on your mind today."}
          </p>

          {!memory?.nickname && !showNameInput && (
            <button 
              onClick={() => setShowNameInput(true)}
              className="text-purple-600 text-sm font-medium hover:text-pink-600 transition-colors flex items-center gap-1"
            >
              What should we call you? (Stored locally)
            </button>
          )}

          {showNameInput && (
            <form onSubmit={handleSaveName} className="flex gap-2 max-w-sm mt-2">
              <input
                type="text"
                placeholder="Your nickname..."
                value={nameInputValue}
                onChange={(e) => setNameInputValue(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                autoFocus
              />
              <button 
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-pink-500 transition-colors"
              >
                Save
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
