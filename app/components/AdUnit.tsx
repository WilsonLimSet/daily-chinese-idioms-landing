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
// safer for CLS than under-reserving. minHeightDesktop hints to AdSense that
// taller/larger ad sizes are acceptable on desktop, where the auto-format
// otherwise tends to pick small banners and leave horizontal whitespace.
const AD_CONFIG = {
  'display':    { slot: '7070641816', format: 'auto',         layout: undefined,    responsive: true,  minHeight: 280, minHeightDesktop: 320 },
  'in-article': { slot: '6077124349', format: 'fluid',        layout: 'in-article', responsive: false, minHeight: 300, minHeightDesktop: 350 },
  'multiplex':  { slot: '9571857660', format: 'autorelaxed',  layout: undefined,    responsive: false, minHeight: 400, minHeightDesktop: 500 },
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

  // Push the ad once the container is in view (or priority=true).
  // Wrap push() in requestIdleCallback so AdSense's forced reflows (~243ms in
  // PSI traces) run when the browser is idle rather than blocking the main
  // thread during page load. Falls back to setTimeout for older browsers.
  useEffect(() => {
    if (!inView || pushed.current) return;
    const trigger = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        // AdSense not loaded yet; a later invocation will retry
      }
    };
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    const idleWin = window as IdleWindow;
    if (typeof idleWin.requestIdleCallback === 'function') {
      idleWin.requestIdleCallback(trigger, { timeout: 2000 });
    } else {
      setTimeout(trigger, 0);
    }
  }, [inView]);

  // Container className uses Tailwind responsive min-h-[Npx] to give AdSense
  // more vertical space to work with on desktop — the format='auto' tends to
  // pick small ad sizes when container space is tight. Desktop CTR was 0.26%
  // vs mobile 0.68%; bumping the desktop min-height hints to AdSense that
  // larger sizes (336x280, 728x90, etc.) are acceptable above-the-fold.
  const minHClass = (() => {
    switch (type) {
      case 'display':    return 'min-h-[280px] md:min-h-[320px]';
      case 'in-article': return 'min-h-[300px] md:min-h-[350px]';
      case 'multiplex':  return 'min-h-[400px] md:min-h-[500px]';
    }
  })();

  return (
    <div
      ref={containerRef}
      className={`my-8 text-center w-full ${minHClass} ${className}`}
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
