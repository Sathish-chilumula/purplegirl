'use client';

import React, { useState } from 'react';
import { Video, Loader2, Sparkles, Copy, Check, Music, Hash, LayoutTemplate } from 'lucide-react';

interface ReelScript {
  hook: string;
  viral_hook_reason: string;
  scenes: {
    duration: string;
    what_to_show: string;
    text_overlay: string;
    voiceover: string;
    transition: string;
  }[];
  cta: string;
  trending_audio_suggestions: string;
  hashtags: string;
}

interface ReelScriptGeneratorProps {
  questionTitle: string;
  categoryName: string;
  bulletPoints?: string[];
  chatLog?: string[];
}

export default function ReelScriptGenerator({
  questionTitle,
  categoryName,
  bulletPoints,
  chatLog
}: ReelScriptGeneratorProps) {
  const [script, setScript] = useState<ReelScript | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateScript = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionTitle, categoryName, bulletPoints, chatLog })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate script');
      
      setScript(data.script);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyScript = () => {
    if (!script) return;
    
    let text = `🎬 REEL SCRIPT: ${questionTitle}\n\n`;
    text += `HOOK: ${script.hook}\n`;
    text += `WHY IT WORKS: ${script.viral_hook_reason}\n\n`;
    
    script.scenes.forEach((scene, i) => {
      text += `SCENE ${i + 1} (${scene.duration})\n`;
      text += `Visuals: ${scene.what_to_show}\n`;
      text += `Text: ${scene.text_overlay}\n`;
      text += `Audio: ${scene.voiceover}\n`;
      text += `Cut: ${scene.transition}\n\n`;
    });
    
    text += `CTA: ${script.cta}\n\n`;
    text += `AUDIO: ${script.trending_audio_suggestions}\n`;
    text += `TAGS: ${script.hashtags}\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!script) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 rounded-2xl border border-gray-100">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <Video className="w-8 h-8 text-purple-500" />
        </div>
        <h3 className="text-xl font-bold text-[#1F1235] mb-2">Turn this into a Viral Reel</h3>
        <p className="text-gray-500 text-sm mb-8 max-w-sm">
          Our AI will instantly generate a 30-second video script based on this answer, complete with scene directions and hooks.
        </p>
        <button
          onClick={generateScript}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-purple-200 hover:scale-105 transition-all disabled:opacity-70 disabled:scale-100"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {isGenerating ? 'Writing Script...' : 'Generate Script'}
        </button>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden text-left">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-purple-100 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">
            <Video className="w-4 h-4" /> Ready to film
          </div>
          <h3 className="text-xl font-bold text-[#1F1235]">{questionTitle}</h3>
        </div>
        <button
          onClick={copyScript}
          className="flex items-center gap-1.5 bg-white text-purple-600 px-3 py-1.5 rounded-lg border border-purple-200 text-sm font-bold shadow-sm hover:bg-purple-50 transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
        {/* Hook */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
          <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> The Hook
          </p>
          <p className="font-bold text-[#1F1235] text-lg leading-tight mb-2">"{script.hook}"</p>
          <p className="text-sm text-yellow-700 italic">Why it works: {script.viral_hook_reason}</p>
        </div>

        {/* Scenes */}
        <div className="space-y-4">
          <h4 className="font-bold text-[#1F1235] flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-purple-500" /> Scene by Scene
          </h4>
          {script.scenes.map((scene, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold flex items-center justify-center text-sm border border-purple-200">
                {i + 1}
              </div>
              <div className="space-y-2 w-full">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">
                    {scene.duration}
                  </span>
                  <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded">
                    Cut: {scene.transition}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Visual</p>
                  <p className="text-sm text-[#1F1235]">{scene.what_to_show}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-0.5">Text Overlay</p>
                  <p className="text-sm font-bold text-pink-600 bg-pink-50 inline-block px-2 py-0.5 rounded">{scene.text_overlay}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-0.5">Audio / You Say</p>
                  <p className="text-sm font-medium text-purple-900">"{scene.voiceover}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
          <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-1">Call to Action</p>
          <p className="font-bold text-purple-900">{script.cta}</p>
        </div>

        {/* Footer Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <Music className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Audio Type</p>
              <p className="text-sm text-[#1F1235] font-medium">{script.trending_audio_suggestions}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <Hash className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Tags</p>
              <p className="text-sm text-pink-600 font-medium">{script.hashtags}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
