'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  slug: string;
  metoo_count?: number;
  categories?: { name: string; color?: string; slug?: string };
}

interface MoodCheckinProps {
  questions: Question[];
}

const MOODS = [
  { id: 'anxious', emoji: '😰', label: 'Anxious', categories: ['mental-wellness', 'health-basics'] },
  { id: 'sad', emoji: '😢', label: 'Sad', categories: ['relationships-love', 'mental-wellness'] },
  { id: 'okay', emoji: '😐', label: 'Okay', categories: [] }, // default trending
  { id: 'good', emoji: '🙂', label: 'Good', categories: ['career-money', 'self-care-glow-up'] },
  { id: 'motivated', emoji: '🔥', label: 'Motivated', categories: ['career-money', 'fashion-style'] }
];

export default function MoodCheckin({ questions }: MoodCheckinProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [recommended, setRecommended] = useState<Question[]>([]);
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else if (hour < 21) setGreeting('Good evening');
    else setGreeting('Good night');
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('mood_date');
    const savedMood = localStorage.getItem('mood_today');

    if (savedDate === today && savedMood) {
      setSelectedMood(savedMood);
      updateRecommendations(savedMood);
    }
  }, [questions]);

  const updateRecommendations = (moodId: string) => {
    const mood = MOODS.find(m => m.id === moodId);
    if (!mood) return;

    if (mood.categories.length === 0) {
      // Just show top trending
      setRecommended(questions.slice(0, 3));
      return;
    }

    // Filter by preferred categories
    const filtered = questions.filter(q => {
      const slug = q.categories?.slug || q.categories?.name.toLowerCase().replace(/ /g, '-');
      return slug && mood.categories.some(cat => slug.includes(cat) || cat.includes(slug));
    });

    if (filtered.length >= 3) {
      setRecommended(filtered.slice(0, 3));
    } else {
      // Fill gaps with regular trending
      const gaps = 3 - filtered.length;
      const filler = questions.filter(q => !filtered.find(f => f.id === q.id)).slice(0, gaps);
      setRecommended([...filtered, ...filler]);
    }
  };

  const handleSelectMood = (moodId: string) => {
    const today = new Date().toDateString();
    localStorage.setItem('mood_date', today);
    localStorage.setItem('mood_today', moodId);
    setSelectedMood(moodId);
    updateRecommendations(moodId);
  };

  if (dismissed) return null;

  const currentMood = MOODS.find(m => m.id === selectedMood);

  return (
    <div className="my-12 animate-slide-up">
      <div className="rounded-[2.5rem] p-8 md:p-10 aurora-bg border border-purple-100 shadow-sm relative overflow-hidden">
        
        {!selectedMood ? (
          <div className="text-center animate-fade-in">
            <h2 className="font-playfair font-bold text-3xl text-[#1F1235] mb-2">
              {greeting}, Sister 💜
            </h2>
            <p className="text-gray-500 mb-8">How are you feeling today?</p>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {MOODS.map(mood => (
                <button
                  key={mood.id}
                  onClick={() => handleSelectMood(mood.id)}
                  className="w-20 h-24 md:w-24 md:h-28 glass bg-white/60 hover:bg-white rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-110 hover:-translate-y-2 hover:shadow-xl border border-white group"
                >
                  <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform">{mood.emoji}</span>
                  <span className="text-xs font-bold text-gray-500">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-playfair font-bold text-2xl text-[#1F1235] flex items-center gap-3">
                  Good to see you again 💜 <span className="text-3xl bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">{currentMood?.emoji}</span>
                </h2>
                <p className="text-gray-500 mt-2">Based on how you're feeling, sister recommends...</p>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('mood_date');
                  localStorage.removeItem('mood_today');
                  setSelectedMood(null);
                }}
                className="text-xs font-bold text-purple-400 hover:text-purple-600 underline"
              >
                Change mood
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommended.map((q) => (
                <Link key={q.id} href={`/q/${q.slug}`} className="card-premium glass bg-white/80 p-6 flex flex-col border-t-[3px] border-t-purple-400 hover:scale-[1.02] transition-transform">
                  <div className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3 line-clamp-1">{q.categories?.name}</div>
                  <h3 className="font-bold text-lg text-[#1F1235] mb-4 flex-1 line-clamp-3">{q.title}</h3>
                  <div className="flex items-center gap-1.5 text-pink-500 text-sm font-bold">
                    <Heart className="w-4 h-4 fill-pink-500" /> {q.metoo_count?.toLocaleString() || 0}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
