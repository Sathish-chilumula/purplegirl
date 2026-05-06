'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface Props {
  slug: string;
  saveLabel?: string;
  savedLabel?: string;
}

export function SaveGuideButton({ slug, saveLabel = 'Save', savedLabel = 'Saved' }: Props) {
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        saved = saved.filter((s) => s !== slug);
      } else {
        if (!saved.includes(slug)) saved.push(slug);
      }
      localStorage.setItem('pg_saved_guides', JSON.stringify(saved));
      setIsSaved(!isSaved);
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleSave}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
        isSaved
          ? 'bg-pg-plum text-white border border-pg-plum scale-105'
          : 'bg-white text-pg-gray-600 border border-pg-gray-200 hover:border-pg-plum hover:text-pg-plum'
      }`}
      aria-label={isSaved ? savedLabel : saveLabel}
    >
      {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
      {isSaved ? savedLabel : saveLabel}
    </button>
  );
}
