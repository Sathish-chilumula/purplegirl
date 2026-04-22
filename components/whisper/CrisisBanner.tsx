'use client';

import React, { useState } from 'react';
import { Phone, AlertCircle, X } from 'lucide-react';

export default function CrisisBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#2D1B2E] border-b border-pink-900/30 px-4 py-3 sticky top-0 z-50 text-pink-50 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm leading-relaxed">
        <p className="font-bold text-pink-200 mb-1">You are in a safe, private space.</p>
        <p className="opacity-90">
          If you are in immediate danger or experiencing abuse, please call the National Commission for Women at <strong className="font-mono text-white tracking-wider">7827170170</strong> or Police at <strong className="font-mono text-white tracking-wider">112</strong>.
        </p>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="text-pink-300 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
