'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Check } from 'lucide-react';

const STAGES = [
  { id: 'student', emoji: '🎓', label: 'Student', desc: '16-22' },
  { id: 'single', emoji: '💕', label: 'Single & exploring', desc: 'Finding yourself' },
  { id: 'married', emoji: '👰', label: 'Recently married', desc: 'New chapter' },
  { id: 'pregnant', emoji: '🤰', label: 'Pregnant/New mom', desc: 'Motherhood' },
  { id: 'career', emoji: '💼', label: 'Building career', desc: 'Focusing on growth' },
  { id: 'family-work', emoji: '🏠', label: 'Family & work balance', desc: 'Doing it all' },
  { id: 'rebuilding', emoji: '💪', label: 'Rebuilding after hardship', desc: 'Starting fresh' },
  { id: 'exploring', emoji: '🌍', label: 'Just exploring', desc: 'Curious' }
];

export default function LifeStageSelector() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Only show if never set
    const savedStage = localStorage.getItem('life_stage');
    if (!savedStage) {
      // Add slight delay before showing modal so the page loads first
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleContinue = () => {
    if (!selectedStage) return;
    
    localStorage.setItem('life_stage', selectedStage);
    localStorage.setItem('life_stage_set_date', new Date().toISOString());
    
    // Dispatch custom event to tell app/page.tsx to update its greeting bar
    window.dispatchEvent(new Event('life_stage_updated'));

    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 500); // match fade out duration
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-900/60 backdrop-blur-sm transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="bg-white aurora-bg w-full max-w-4xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-purple-100 relative max-h-[90vh] overflow-y-auto animate-slide-up">
        
        <div className="text-center mb-10">
          <h2 className="font-playfair font-bold text-3xl md:text-4xl text-[#1F1235] mb-4">
            Before we begin — which season of life are you in?
          </h2>
          <p className="text-gray-500 text-lg">
            This helps us show you what matters most to you right now.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STAGES.map(stage => {
            const isSelected = selectedStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`relative flex flex-col items-center justify-center text-center p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 ${
                  isSelected 
                    ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-400 shadow-md scale-105' 
                    : 'bg-white/80 border border-purple-100 hover:border-purple-300 hover:shadow-sm'
                }`}
              >
                <span className="text-4xl mb-3 block">{stage.emoji}</span>
                <span className="font-bold text-[#1F1235] text-sm mb-1 leading-tight">{stage.label}</span>
                <span className="text-xs text-gray-400 font-medium">{stage.desc}</span>
                
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-purple-500 text-white rounded-full p-0.5 shadow-sm animate-fade-in">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex justify-center h-16">
          {selectedStage && (
            <button
              onClick={handleContinue}
              className="animate-slide-up bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-purple-200 hover:scale-105 transition-transform flex items-center gap-2 group"
            >
              Continue 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
}
