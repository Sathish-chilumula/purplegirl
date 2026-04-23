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
          style={{ 
            position: 'fixed',
            width: '1080px', 
            height: '1080px', 
            padding: '64px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            overflow: 'hidden',
            left: '-2000px', 
            top: '0', 
            zIndex: -100, 
            fontFamily: 'Inter, sans-serif',
            background: 'linear-gradient(to bottom right, #FAF5FF, #FDF2F8)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
             <div style={{ color: '#7C3AED', fontWeight: 'bold', fontSize: '30px' }}>💜 purplegirl.in</div>
             <div style={{ backgroundColor: '#F3E8FF', color: '#7C3AED', padding: '8px 24px', borderRadius: '9999px', fontWeight: 'bold', fontSize: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
               {categoryName}
             </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h1 style={{ color: '#1F1235', fontWeight: 'bold', fontSize: '72px', lineHeight: '1.2', marginBottom: '48px', letterSpacing: '-0.02em' }}>
                "{questionTitle}"
              </h1>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '32px', padding: '48px', border: '1px solid #F3E8FF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                 <h2 style={{ color: '#7C3AED', fontSize: '30px', fontWeight: 'bold', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Top Advice:</h2>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                   {tips.slice(0, 3).map((tip, i) => (
                     <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                       <span style={{ fontSize: '36px', flexShrink: 0 }}>✅</span>
                       <p style={{ color: '#374151', fontSize: '36px', fontWeight: '500', lineHeight: '1.6' }}>{tip}</p>
                     </div>
                   ))}
                 </div>
              </div>
          </div>
          <div style={{ textAlign: 'center', paddingTop: '32px', borderTop: '1px solid #E9D5FF' }}>
            <p style={{ color: '#6B7280', fontSize: '30px', fontWeight: 'bold' }}>Ask anything you can't ask anyone. No login required.</p>
          </div>
        </div>
      );
    }

    // Dark Template (Premium, sleek)
    if (template === 'dark') {
      return (
        <div 
          ref={ref}
          style={{ 
            position: 'fixed',
            width: '1080px', 
            height: '1080px', 
            padding: '64px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            overflow: 'hidden',
            left: '-2000px', 
            top: '0', 
            zIndex: -100, 
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#110B1D'
          }}
        >
          <div style={{ position: 'absolute', top: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '9999px', filter: 'blur(150px)', opacity: 0.3, backgroundColor: '#7C3AED' }} />
          <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '9999px', filter: 'blur(120px)', opacity: 0.2, backgroundColor: '#EC4899' }} />
          
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
             <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '30px' }}>💜 purplegirl.in</div>
             <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '8px 24px', borderRadius: '9999px', fontWeight: 'bold', fontSize: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
               {categoryName}
             </div>
          </div>
          <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h1 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '72px', lineHeight: '1.2', marginBottom: '48px', letterSpacing: '-0.02em' }}>
                "{questionTitle}"
              </h1>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '32px', padding: '48px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                 <h2 style={{ color: '#F472B6', fontSize: '30px', fontWeight: 'bold', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sisterly Advice:</h2>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                   {tips.slice(0, 3).map((tip, i) => (
                     <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                       <span style={{ fontSize: '36px', flexShrink: 0 }}>✨</span>
                       <p style={{ color: '#E5E7EB', fontSize: '36px', fontWeight: '500', lineHeight: '1.6' }}>{tip}</p>
                     </div>
                   ))}
                 </div>
              </div>
          </div>
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', paddingTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <p style={{ color: '#9CA3AF', fontSize: '30px', fontWeight: '500' }}>Real advice for Indian women.</p>
          </div>
        </div>
      );
    }

    // Minimal Template (Clean, aesthetic)
    if (template === 'minimal') {
      return (
        <div 
          ref={ref}
          style={{ 
            position: 'fixed',
            width: '1080px',
            height: '1080px',
            padding: '64px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            overflow: 'hidden',
            left: '-2000px', 
            top: '0', 
            zIndex: -100, 
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#F9FAFB'
          }}
        >
          <div style={{ color: '#EC4899', fontWeight: 'bold', fontSize: '40px', marginBottom: '48px' }}>purplegirl.in</div>
          <div style={{ 
            backgroundColor: '#ffffff', 
            boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.15)', 
            borderRadius: '48px', 
            padding: '64px', 
            border: '1px solid #F3F4F6',
            width: '100%',
            maxWidth: '896px'
          }}>
             <div style={{ color: '#7C3AED', fontWeight: 'bold', fontSize: '24px', letterSpacing: '0.1em', marginBottom: '24px', textTransform: 'uppercase' }}>
               Question of the day
             </div>
             <h1 style={{ color: '#111827', fontWeight: 'bold', fontSize: '60px', lineHeight: '1.3', marginBottom: '48px' }}>
               "{questionTitle}"
             </h1>
             <div style={{ width: '96px', height: '4px', background: 'linear-gradient(to right, #A855F7, #EC4899)', margin: '0 auto 48px auto' }} />
             <p style={{ color: '#4B5563', fontSize: '36px', fontWeight: '500', lineHeight: '1.6', fontStyle: 'italic' }}>
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
        style={{ 
          position: 'fixed',
          width: '1080px',
          height: '1080px',
          padding: '80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          left: '-2000px', 
          top: '0', 
          zIndex: -100, 
          fontFamily: 'Inter, sans-serif',
          backgroundColor: '#7C3AED'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle at center, #ffffff, transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ color: '#F9A8D4', fontSize: '96px', lineHeight: 1, marginBottom: '16px', opacity: 0.5 }}>"</div>
          <h1 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '60px', lineHeight: '1.4', marginBottom: '64px' }}>
            {tips[0] || questionTitle}
          </h1>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '32px', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'inline-block' }}>
             <p style={{ color: '#F3E8FF', fontSize: '30px', fontWeight: '500', marginBottom: '8px' }}>In response to:</p>
             <p style={{ color: '#ffffff', fontSize: '30px', fontWeight: 'bold' }}>{questionTitle}</p>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '80px', right: '80px', color: 'rgba(255, 255, 255, 0.8)', fontSize: '36px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '16px' }}>
          purplegirl.in <span style={{ color: '#F472B6' }}>💜</span>
        </div>
      </div>
    );
  }
);

ShareImageGenerator.displayName = 'ShareImageGenerator';
