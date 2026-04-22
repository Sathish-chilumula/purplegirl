'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { IntakeData } from '@/lib/personalizedPrompt';

interface PersonalizedIntakeProps {
  onIntakeChange: (data: IntakeData) => void;
}

export default function PersonalizedIntake({ onIntakeChange }: PersonalizedIntakeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState<IntakeData>({});

  const handleChange = (key: keyof IntakeData, value: any) => {
    const newData = { ...data, [key]: value };
    setData(newData);
    onIntakeChange(newData);
  };

  const handleFactorToggle = (factor: string) => {
    const currentFactors = data.keyFactors || [];
    const newFactors = currentFactors.includes(factor)
      ? currentFactors.filter(f => f !== factor)
      : [...currentFactors, factor];
    handleChange('keyFactors', newFactors);
  };

  return (
    <div className="mt-4 border border-purple-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between bg-purple-50/50 hover:bg-purple-50 transition-colors"
      >
        <div className="flex items-center gap-2 text-[#1F1235] font-bold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-purple-600" />
          Personalize Answer <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full ml-1">Optional</span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {isExpanded && (
        <div className="p-5 border-t border-purple-100 space-y-6 bg-gradient-to-br from-white to-purple-50/30">
          <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> 
            PurpleGirl will tailor the advice based on what you share here.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age Group */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Age Group</label>
              <select 
                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                value={data.ageGroup || ''}
                onChange={(e) => handleChange('ageGroup', e.target.value)}
              >
                <option value="">Select age...</option>
                <option value="Teens (13-19)">Teens (13-19)</option>
                <option value="Early 20s (20-25)">Early 20s (20-25)</option>
                <option value="Late 20s (26-29)">Late 20s (26-29)</option>
                <option value="30s">30s</option>
                <option value="40+">40+</option>
              </select>
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Tone</label>
              <select 
                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                value={data.tone || ''}
                onChange={(e) => handleChange('tone', e.target.value)}
              >
                <option value="">Sisterly & empathetic (Default)</option>
                <option value="Direct & tough love">Direct & tough love</option>
                <option value="Action-oriented & practical">Action-oriented & practical</option>
                <option value="Comforting & soft">Comforting & soft</option>
              </select>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Budget (If asking for products)</label>
              <select 
                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                value={data.budget || ''}
                onChange={(e) => handleChange('budget', e.target.value)}
              >
                <option value="">Not applicable</option>
                <option value="Drugstore / Very affordable (Under ₹500)">Under ₹500</option>
                <option value="Mid-range (₹500 - ₹1500)">Mid-range (₹500 - ₹1500)</option>
                <option value="Premium / High-end (₹1500+)">Premium (₹1500+)</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">How long has this been going on?</label>
              <select 
                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                value={data.duration || ''}
                onChange={(e) => handleChange('duration', e.target.value)}
              >
                <option value="">Select duration...</option>
                <option value="Just happened">Just happened</option>
                <option value="A few weeks">A few weeks</option>
                <option value="A few months">A few months</option>
                <option value="Years">Years</option>
              </select>
            </div>
          </div>

          {/* Key Factors */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Key Factors (Select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {['Long-distance', 'Living with parents', 'Financial stress', 'In-laws involved', 'First time experiencing this', 'Mental health struggles'].map(factor => (
                <button
                  key={factor}
                  type="button"
                  onClick={() => handleFactorToggle(factor)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    (data.keyFactors || []).includes(factor)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  {factor}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
