'use client';
import { useEffect } from 'react';

interface AdSenseUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  responsive?: boolean;
}

export default function AdSenseUnit({ slot, format = 'auto', className = '', responsive = true }: AdSenseUnitProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  useEffect(() => {
    if (!client) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense Error:', err);
    }
  }, [client]);

  // No AdSense ID configured yet — render nothing (no blank space)
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
