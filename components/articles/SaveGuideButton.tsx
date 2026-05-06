'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

export function SaveGuideButton({ slug }: { slug: string }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Check if slug is in localStorage
    try {
      const savedStr = localStorage.getItem('pg_saved_guides');
      if (savedStr) {
        const saved: string[] = JSON.parse(savedStr);
        setIsSaved(saved.includes(slug));
      }
    } catch (e) {
      console.error('Error reading localStorage', e);
    }
  }, [slug]);

  const toggleSave = () => {
    try {
      const savedStr = localStorage.getItem('pg_saved_guides');
      let saved: string[] = savedStr ? JSON.parse(savedStr) : [];
      
      if (isSaved) {
        // Remove
        saved = saved.filter(s => s !== slug);
      } else {
        // Add
        if (!saved.includes(slug)) {
          saved.push(slug);
        }
      }
      
      localStorage.setItem('pg_saved_guides', JSON.stringify(saved));
      setIsSaved(!isSaved);
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  };

  return (
    <button
      onClick={toggleSave}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
        isSaved 
          ? 'bg-pg-plum text-white border border-pg-plum' 
          : 'bg-white text-pg-gray-600 border border-pg-gray-200 hover:border-pg-plum hover:text-pg-plum'
      }`}
      aria-label={isSaved ? "Remove from Saved Guides" : "Save Guide"}
    >
      {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
      {isSaved ? 'Saved' : 'Save'}
    </button>
  );
}
