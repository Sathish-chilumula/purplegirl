'use client';
import { useEffect } from 'react';

interface AdSenseUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  responsive?: boolean;
}

export default function AdSenseUnit({ slot, format = 'auto', className = '', responsive = true }: AdSenseUnitProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense Error:', err);
    }
  }, []);

  const client = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  if (!client && process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-[#FDF2F8]/50 border-2 border-dashed border-pink-200 text-pink-400 flex items-center justify-center p-4 text-sm font-bold tracking-wide uppercase rounded-xl ${className} min-h-[100px]`}>
        [ Advertisement Slot ]
      </div>
    );
  }

  // If no client ID in prod, don't show the div at all to prevent layout shifts
  if (!client) return null;

  return (
    <div className={`overflow-hidden rounded-xl ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
