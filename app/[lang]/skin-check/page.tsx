import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SkinAnalyzer from '@/components/skin/SkinAnalyzer';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Skin Photo Analysis | ${SITE_NAME}`,
  description: 'Upload a photo of your skin concern for an instant, private, AI-powered analysis tailored for Indian skin.',
};

export default function SkinCheckPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Decorative orbs */}
      <div className="orb orb-pink w-[600px] h-[600px] top-[-100px] right-[-100px] opacity-20" />
      <div className="orb orb-purple w-[500px] h-[500px] bottom-[-80px] left-[-60px] opacity-15" />

      <div className="max-w-4xl mx-auto px-4 py-12 pb-40 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-500 hover:text-purple-600 mb-8 transition-colors font-medium group animate-slide-up bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Home
        </Link>
        
        <div className="text-center mb-12 animate-slide-up stagger-1">
          <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6 shadow-sm border border-purple-200">
            Powered by Vision AI
          </div>
          <h1 className="font-playfair font-bold text-4xl md:text-6xl text-[#1F1235] tracking-tight mb-4">
            Smart Skin Analysis
          </h1>
          <p className="text-gray-500 text-xl leading-relaxed max-w-2xl mx-auto">
            Got a skin concern? Let our AI acting as your virtual elder sister take a look and suggest what might help.
          </p>
        </div>
        
        <div className="animate-slide-up stagger-2">
          <SkinAnalyzer />
        </div>
      </div>
    </div>
  );
}
