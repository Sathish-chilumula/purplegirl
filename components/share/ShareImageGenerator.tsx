import React, { forwardRef } from 'react';

export type ShareTemplate = 'gradient' | 'dark' | 'minimal' | 'quote';

interface ShareImageGeneratorProps {
  questionTitle: string;
  categoryName: string;
  tips: string[];
  template?: ShareTemplate;
}

export const ShareImageGenerator = forwardRef<HTMLDivElement, ShareImageGeneratorProps>(
  ({ questionTitle, categoryName, tips, template = 'gradient' }, ref) => {
    
    // Gradient Template (Default, vibrant)
    if (template === 'gradient') {
      return (
        <div 
          ref={ref}
          className="absolute w-[1080px] h-[1080px] bg-gradient-to-br from-[#FAF5FF] to-[#FDF2F8] p-16 flex flex-col justify-between overflow-hidden z-[-1]"
          style={{ left: '-9999px', top: '-9999px', fontFamily: 'Inter, sans-serif' }}
        >
          <div className="flex justify-between items-start">
             <div className="text-[#7C3AED] font-bold text-3xl">💜 purplegirl.in</div>
             <div className="bg-purple-100 text-[#7C3AED] px-6 py-2 rounded-full font-bold text-2xl uppercase tracking-wider">
               {categoryName}
             </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
              <h1 className="font-bold text-7xl text-[#1F1235] leading-[1.2] mb-12 tracking-tight">
                "{questionTitle}"
              </h1>
              <div className="bg-white rounded-[2rem] p-12 shadow-sm border border-purple-100">
                 <h2 className="text-3xl font-bold text-[#7C3AED] mb-8 uppercase tracking-widest">Top Advice:</h2>
                 <div className="flex flex-col gap-8">
                   {tips.slice(0, 3).map((tip, i) => (
                     <div key={i} className="flex gap-6 items-start">
                       <span className="text-4xl shrink-0">✅</span>
                       <p className="text-4xl text-gray-800 font-medium leading-relaxed">{tip}</p>
                     </div>
                   ))}
                 </div>
              </div>
          </div>
          <div className="text-center pt-8 border-t border-purple-200">
            <p className="text-[#6B7280] text-3xl font-bold">Ask anything you can't ask anyone. No login required.</p>
          </div>
        </div>
      );
    }

    // Dark Template (Premium, sleek)
    if (template === 'dark') {
      return (
        <div 
          ref={ref}
          className="absolute w-[1080px] h-[1080px] bg-[#110B1D] p-16 flex flex-col justify-between overflow-hidden z-[-1]"
          style={{ left: '-9999px', top: '-9999px', fontFamily: 'Inter, sans-serif' }}
        >
          <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-[#7C3AED] rounded-full blur-[150px] opacity-30" />
          <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#EC4899] rounded-full blur-[120px] opacity-20" />
          
          <div className="flex justify-between items-start relative z-10">
             <div className="text-white font-bold text-3xl">💜 purplegirl.in</div>
             <div className="bg-white/10 text-white border border-white/20 px-6 py-2 rounded-full font-bold text-2xl uppercase tracking-wider backdrop-blur-md">
               {categoryName}
             </div>
          </div>
          <div className="flex-1 flex flex-col justify-center relative z-10">
              <h1 className="font-playfair font-bold text-7xl text-white leading-[1.2] mb-12 tracking-tight">
                "{questionTitle}"
              </h1>
              <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-12 border border-white/10">
                 <h2 className="text-3xl font-bold text-pink-400 mb-8 uppercase tracking-widest">Sisterly Advice:</h2>
                 <div className="flex flex-col gap-8">
                   {tips.slice(0, 3).map((tip, i) => (
                     <div key={i} className="flex gap-6 items-start">
                       <span className="text-4xl shrink-0">✨</span>
                       <p className="text-4xl text-gray-200 font-medium leading-relaxed">{tip}</p>
                     </div>
                   ))}
                 </div>
              </div>
          </div>
          <div className="text-center pt-8 border-t border-white/10 relative z-10">
            <p className="text-gray-400 text-3xl font-medium">Real advice for Indian women.</p>
          </div>
        </div>
      );
    }

    // Minimal Template (Clean, aesthetic)
    if (template === 'minimal') {
      return (
        <div 
          ref={ref}
          className="absolute w-[1080px] h-[1080px] bg-[#F9FAFB] p-16 flex flex-col justify-center items-center text-center overflow-hidden z-[-1]"
          style={{ left: '-9999px', top: '-9999px', fontFamily: 'Inter, sans-serif' }}
        >
          <div className="text-[#EC4899] font-bold text-4xl mb-12">purplegirl.in</div>
          <div className="bg-white shadow-2xl shadow-purple-100/50 rounded-[3rem] p-16 border border-gray-100 w-full max-w-4xl">
             <div className="text-[#7C3AED] font-bold text-2xl uppercase tracking-widest mb-6">
               Question of the day
             </div>
             <h1 className="font-playfair font-bold text-6xl text-[#111827] leading-[1.3] mb-12">
               "{questionTitle}"
             </h1>
             <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-12" />
             <p className="text-4xl text-gray-600 font-medium leading-relaxed italic">
               "{tips[0] || 'Real answers to questions you can\'t ask anyone else.'}"
             </p>
          </div>
        </div>
      );
    }

    // Quote Template (Focus on one big insight)
    return (
      <div 
        ref={ref}
        className="absolute w-[1080px] h-[1080px] bg-[#7C3AED] p-20 flex flex-col justify-center overflow-hidden z-[-1]"
        style={{ left: '-9999px', top: '-9999px', fontFamily: 'Inter, sans-serif' }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="relative z-10">
          <div className="text-8xl text-pink-300 opacity-50 font-playfair leading-none mb-4">"</div>
          <h1 className="font-bold text-6xl text-white leading-[1.4] mb-16">
            {tips[0] || questionTitle}
          </h1>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 inline-block">
             <p className="text-3xl text-purple-100 font-medium mb-2">In response to:</p>
             <p className="text-3xl text-white font-bold">{questionTitle}</p>
          </div>
        </div>
        <div className="absolute bottom-20 right-20 text-white/80 text-4xl font-bold flex items-center gap-4">
          purplegirl.in <span className="text-pink-400">💜</span>
        </div>
      </div>
    );
  }
);

ShareImageGenerator.displayName = 'ShareImageGenerator';
