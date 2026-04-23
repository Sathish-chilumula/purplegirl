'use client';

import React, { useState, useEffect } from 'react';

const TRENDING_TOPICS = [
  "PCOS tips", "toxic manager", "dark circles", "salary hike", "relationship advice", 
  "hair fall", "skin routine", "boundaries", "feeling lost", "period pain"
];

export default function SisterhoodPulse() {
  const [pulseCount, setPulseCount] = useState(2847);
  const [currentTopics, setCurrentTopics] = useState<string[]>([]);

  useEffect(() => {
    // Initial topics
    setCurrentTopics(getRanomTopics(3));

    const countInterval = setInterval(() => {
      setPulseCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        let next = prev + change;
        if (next < 2800) next = 2800;
        if (next > 2900) next = 2900;
        return next;
      });
    }, 3000);

    const topicInterval = setInterval(() => {
      setCurrentTopics(getRanomTopics(3));
    }, 5000);

    return () => {
      clearInterval(countInterval);
      clearInterval(topicInterval);
    };
  }, []);

  function getRanomTopics(count: number) {
    const shuffled = [...TRENDING_TOPICS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  return (
    <div className="w-full aurora-bg py-8 border-y border-purple-100">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Pulse Indicator */}
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-purple-100/50 shadow-sm shrink-0">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Live</span>
        </div>

        {/* Center: Counter */}
        <div className="text-center">
          <p className="font-playfair text-xl md:text-2xl text-[#1F1235] font-bold">
            <span className="text-purple-600">{pulseCount.toLocaleString()}</span> questions answered in the last 24 hours
          </p>
        </div>

        {/* Right: Trending Topics (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <span className="text-sm font-bold text-gray-500 mr-2">Trending:</span>
          {currentTopics.map((topic, i) => (
            <div 
              key={`${topic}-${i}`} 
              className="pill-badge bg-white text-purple-600 border border-purple-100 animate-fade-in"
            >
              {topic}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
