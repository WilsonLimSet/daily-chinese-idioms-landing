'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, Link2, Share2 } from 'lucide-react';

type Props = {
  typeCode: string;
  tagline: string;
  resultUrl: string;
};

export default function ShareRow({ typeCode, tagline, resultUrl }: Props) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
    try {
      localStorage.removeItem('sbti-quiz-state-v2');
    } catch {}
  }, []);

  const shareText = `I'm SBTI ${typeCode} — ${tagline} Take the test:`;

  const doNativeShare = useCallback(async () => {
    try {
      await navigator.share({
        title: `SBTI ${typeCode}`,
        text: shareText,
        url: resultUrl,
      });
    } catch {}
  }, [typeCode, shareText, resultUrl]);

  const doCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${resultUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [shareText, resultUrl]);

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(resultUrl)}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${resultUrl}`)}`;
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(resultUrl)}&text=${encodeURIComponent(
    shareText
  )}`;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
      {canNativeShare && (
        <button
          type="button"
          onClick={doNativeShare}
          className="inline-flex items-center gap-2 font-medium text-gray-900 transition hover:text-red-500"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      )}
      <button
        type="button"
        onClick={doCopy}
        className="inline-flex items-center gap-2 font-medium text-gray-900 transition hover:text-red-500"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
        {copied ? 'Copied' : 'Copy link'}
      </button>
      <span className="text-gray-300">·</span>
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-gray-600 transition hover:text-red-500"
      >
        X / Twitter
      </a>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-gray-600 transition hover:text-red-500"
      >
        WhatsApp
      </a>
      <a
        href={tgUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-gray-600 transition hover:text-red-500"
      >
        Telegram
      </a>
    </div>
  );
}
