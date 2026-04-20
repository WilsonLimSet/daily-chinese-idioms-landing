'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

type AdType = 'display' | 'in-article' | 'multiplex';

interface AdUnitProps {
  type: AdType;
  className?: string;
  /**
   * When true, fetches the ad immediately instead of waiting for the
   * container to enter the viewport. Use this for above-the-fold ads.
   * Default: false (lazy-load as ad scrolls into view).
   */
  priority?: boolean;
}

// Reserved heights prevent Cumulative Layout Shift (CLS) when the ad fills.
// Values are AdSense's typical rendered sizes for each ad type. Container
// collapses to content height once filled, so a slight over-reservation is
// safer for CLS than under-reserving.
const AD_CONFIG = {
  'display':    { slot: '7070641816', format: 'auto',         layout: undefined,    responsive: true,  minHeight: 280 },
  'in-article': { slot: '6077124349', format: 'fluid',        layout: 'in-article', responsive: false, minHeight: 300 },
  'multiplex':  { slot: '9571857660', format: 'autorelaxed',  layout: undefined,    responsive: false, minHeight: 400 },
} as const;

export default function AdUnit({ type, className = '', priority = false }: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);
  const [inView, setInView] = useState(priority);

  const config = AD_CONFIG[type];

  // Only observe the viewport if we are NOT a priority ad
  useEffect(() => {
    if (priority || inView) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      // Start loading when the ad is 500px away from the viewport — leaves
      // time for AdSense to fetch and render before the user scrolls to it.
      { rootMargin: '500px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [priority, inView]);

  // Push the ad once the container is in view (or priority=true)
  useEffect(() => {
    if (!inView || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet; a later invocation will retry
    }
  }, [inView]);

  return (
    <div
      ref={containerRef}
      className={`my-8 text-center ${className}`}
      // Reserve height up front so the page doesn't shift when the ad fills.
      // Using min-height (not height) so the container can shrink around a
      // smaller-than-reserved ad without clipping. Width is 100% to match the
      // responsive `data-full-width-responsive` behavior of AdSense.
      style={{ minHeight: `${config.minHeight}px`, width: '100%' }}
    >
      {inView && (
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            textAlign: type === 'in-article' ? 'center' : undefined,
            minHeight: `${config.minHeight}px`,
          }}
          data-ad-client="ca-pub-5703994433505618"
          data-ad-slot={config.slot}
          data-ad-format={config.format}
          {...(config.layout && { 'data-ad-layout': config.layout })}
          {...(config.responsive && { 'data-full-width-responsive': 'true' })}
        />
      )}
    </div>
  );
}
