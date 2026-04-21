import React, { forwardRef } from 'react';

interface ShareImageGeneratorProps {
  questionTitle: string;
  categoryName: string;
  tips: string[];
}

export const ShareImageGenerator = forwardRef<HTMLDivElement, ShareImageGeneratorProps>(
  ({ questionTitle, categoryName, tips }, ref) => {
    return (
      <div 
        ref={ref}
        className="absolute w-[1080px] h-[1080px] bg-gradient-to-br from-[#FAF5FF] to-[#FDF2F8] p-16 flex flex-col justify-between overflow-hidden z-[-1]"
        style={{ left: '-9999px', top: '-9999px', fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
           <div className="text-[#7C3AED] font-bold text-3xl">💜 purplegirl.in</div>
           <div className="bg-purple-100 text-[#7C3AED] px-6 py-2 rounded-full font-bold text-2xl uppercase tracking-wider">
             {categoryName}
           </div>
        </div>

        {/* Main Content */}
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

        {/* Footer */}
        <div className="text-center pt-8 border-t border-purple-200">
          <p className="text-[#6B7280] text-3xl font-bold">Ask anything you can't ask anyone. No login required.</p>
        </div>
      </div>
    );
  }
);

ShareImageGenerator.displayName = 'ShareImageGenerator';
