'use client';

import React, { useState, useRef } from 'react';
import { X, MessageCircle, Instagram, Copy, Check, Loader2, Download, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import { ShareImageGenerator, ShareTemplate } from './ShareImageGenerator';
import { openWhatsApp, buildWhatsAppText } from '@/lib/whatsapp';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionTitle: string;
  questionSlug: string;
  categoryName: string;
  chatLog?: string[];
  bulletPoints?: string[];
}

export default function ShareModal({
  isOpen,
  onClose,
  questionTitle,
  questionSlug,
  categoryName,
  chatLog = [],
  bulletPoints = [],
}: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'social' | 'instagram'>('social');
  const [template, setTemplate] = useState<ShareTemplate>('gradient');
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    const text = buildWhatsAppText(questionTitle, questionSlug, bulletPoints, chatLog);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = buildWhatsAppText(questionTitle, questionSlug, bulletPoints, chatLog);
    openWhatsApp(text);
  };

  const downloadImage = async () => {
    if (!shareCardRef.current || isGeneratingImage) return;
    try {
      setIsGeneratingImage(true);
      // Let the DOM update first
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `purplegirl-${questionSlug}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1F1235]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-100">
          <h2 className="font-playfair font-bold text-2xl text-[#1F1235]">Share Answer 💜</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden area for image generation */}
        <div className="overflow-hidden h-0 opacity-0 pointer-events-none">
          <ShareImageGenerator 
            ref={shareCardRef}
            questionTitle={questionTitle}
            categoryName={categoryName}
            tips={(bulletPoints?.length ?? 0) > 0 ? bulletPoints! : ((chatLog?.length ?? 0) > 0 ? chatLog! : [questionTitle])}
            template={template}
          />
        </div>

        <div className="overflow-y-auto p-6">
          {/* Tabs */}
          <div className="flex bg-purple-50/50 p-1 rounded-xl mb-6 border border-purple-100/50">
            <button
              onClick={() => setActiveTab('social')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'social' 
                  ? 'bg-white text-purple-700 shadow-sm border border-purple-200/50' 
                  : 'text-gray-500 hover:text-purple-600'
              }`}
            >
              Quick Share
            </button>
            <button
              onClick={() => setActiveTab('instagram')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'instagram' 
                  ? 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-pink-600'
              }`}
            >
              <Instagram className="w-4 h-4" />
              Image Maker
            </button>
          </div>

          {activeTab === 'social' && (
            <div className="space-y-4">
              <button 
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#25D366]/20 bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-[#25D366]/20 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-[#1F1235]">Send on WhatsApp</div>
                    <div className="text-sm text-gray-500">Share privately with a sister</div>
                  </div>
                </div>
              </button>

              <button 
                onClick={handleCopy}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-purple-100 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-[#1F1235]">{copied ? 'Copied!' : 'Copy to Clipboard'}</div>
                    <div className="text-sm text-gray-500">Paste anywhere (Notes, SMS)</div>
                  </div>
                </div>
              </button>
            </div>
          )}

          {activeTab === 'instagram' && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 block">Choose Design</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['gradient', 'dark', 'minimal', 'quote'] as ShareTemplate[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setTemplate(t)}
                      className={`py-3 px-4 rounded-xl font-medium capitalize border transition-all ${
                        template === t 
                          ? 'border-pink-500 bg-pink-50 text-pink-700 ring-1 ring-pink-500' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={downloadImage}
                disabled={isGeneratingImage}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 rounded-2xl font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100"
              >
                {isGeneratingImage ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Generating Magic...</>
                ) : (
                  <><Download className="w-5 h-5" /> Download HD Image</>
                )}
              </button>
              
              <p className="text-center text-xs text-gray-400">
                Perfect 1080×1080 size for Instagram Posts
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
