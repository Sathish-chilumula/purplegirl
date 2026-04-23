'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Sparkles, AlertTriangle, CheckCircle, ChevronRight, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface AnalysisResult {
  condition_appears_to_be: string;
  causes: string[];
  home_remedies: string[];
  product_recommendations: string[];
  sister_advice: string;
  doctor_flag: boolean;
}

export default function SkinAnalyzer() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: image })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');

      setResult(data.analysis);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {!image ? (
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-purple-100 text-center animate-slide-up">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1F1235] mb-4">Check Your Skin Concern</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Upload a clear photo of your skin concern (like acne or dark spots). Our AI will analyze it instantly and completely privately.
          </p>
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-purple-200 hover:scale-105 transition-transform flex items-center gap-3 mx-auto"
          >
            <Upload className="w-5 h-5" /> Upload Photo
          </button>
          
          <p className="text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Photos are never stored or shared
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-purple-100 animate-slide-up">
          <div className="relative h-64 md:h-80 w-full bg-black">
            <Image 
              src={image} 
              alt="Uploaded skin concern" 
              fill 
              className="object-contain"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="font-bold text-lg">Analyzing your photo...</p>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            {!result && !isAnalyzing && (
              <div className="flex gap-4">
                <button 
                  onClick={reset}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Retake
                </button>
                <button 
                  onClick={analyzeImage}
                  className="flex-[2] bg-[#1F1235] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-900 transition-colors shadow-lg"
                >
                  <Sparkles className="w-5 h-5" /> Analyze Now
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium text-center">
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest rounded-full mb-3">
                    Analysis Complete
                  </span>
                  <h3 className="text-2xl font-bold text-[#1F1235]">
                    {result.condition_appears_to_be}
                  </h3>
                </div>

                <div className="bg-pink-50 border border-pink-100 rounded-2xl p-6">
                  <h4 className="font-playfair italic text-lg text-pink-700 mb-2 flex items-center gap-2">
                    <HeartIcon className="w-4 h-4" /> Sister's Advice
                  </h4>
                  <p className="text-pink-900 leading-relaxed font-medium">
                    "{result.sister_advice}"
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-purple-500" /> Possible Causes
                    </h4>
                    <ul className="space-y-3">
                      {result.causes.map((cause, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-green-500" /> Home Remedies
                    </h4>
                    <ul className="space-y-3">
                      {result.home_remedies.map((remedy, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                          {remedy}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-orange-400" /> Product Recommendations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.product_recommendations.map((prod, i) => (
                      <span key={i} className="bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1.5 rounded-lg text-sm font-medium">
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>

                {result.doctor_flag && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                    <div>
                      <p className="font-bold text-red-800 text-sm mb-1">Please see a dermatologist</p>
                      <p className="text-red-700 text-sm">
                        While we try to help, this looks like something that needs professional medical attention. Please don't rely solely on internet advice for this.
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-100 text-center">
                  <button 
                    onClick={reset}
                    className="text-gray-500 hover:text-purple-600 font-medium text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" /> Check another photo
                  </button>
                  <p className="text-xs text-gray-400 mt-4 max-w-sm mx-auto">
                    Disclaimer: This tool provides general information and is not a substitute for professional medical diagnosis or treatment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );
}
