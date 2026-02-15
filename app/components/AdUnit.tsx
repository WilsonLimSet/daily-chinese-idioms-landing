'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

type AdType = 'display' | 'in-article' | 'multiplex';

interface AdUnitProps {
  type: AdType;
  className?: string;
}

const AD_CONFIG = {
  'display': { slot: '7677317911', format: 'auto', layout: undefined, responsive: true },
  'in-article': { slot: '8283822573', format: 'fluid', layout: 'in-article', responsive: false },
  'multiplex': { slot: '3738072909', format: 'autorelaxed', layout: undefined, responsive: false },
} as const;

let scriptLoaded = false;

export default function AdUnit({ type, className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  const config = AD_CONFIG[type];

  useEffect(() => {
    if (pushed.current) return;
    if (scriptLoaded) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        // AdSense not loaded or blocked
      }
    }
  }, []);

  return (
    <div className={`my-8 text-center ${className}`}>
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2640821656102783"
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={() => {
          scriptLoaded = true;
          if (!pushed.current) {
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              pushed.current = true;
            } catch {
              // AdSense not loaded or blocked
            }
          }
        }}
      />
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', textAlign: type === 'in-article' ? 'center' : undefined }}
        data-ad-client="ca-pub-2640821656102783"
        data-ad-slot={config.slot}
        data-ad-format={config.format}
        {...(config.layout && { 'data-ad-layout': config.layout })}
        {...(config.responsive && { 'data-full-width-responsive': 'true' })}
      />
    </div>
  );
}
