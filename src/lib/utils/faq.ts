export type FaqEntry = { question: string; answer: string };

/** Strip markdown emphasis/links so schema text carries clean prose. */
function clean(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Pull `**Question?**` + answer pairs out of one markdown section. */
function pairsIn(section: string): FaqEntry[] {
  const entries: FaqEntry[] = [];
  // Handles both layouts in use: question on its own line with the answer
  // beneath, and `**Question?** Answer` on a single line (older slang posts).
  const re = /^\*\*(.+?)\*\*[ \t]*\n?([\s\S]*?)(?=\n\*\*|$)/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(section)) !== null) {
    const question = clean(m[1]);
    const answer = clean(m[2]);
    // A question mark is the one reliable signal across every language we
    // publish in — the heading itself is translated, so we can't match on that.
    if (question && answer && /[?？]\s*$/.test(question)) {
      entries.push({ question, answer });
    }
  }
  return entries;
}

/**
 * Extract an article's hand-written Q&A so it can be emitted as FAQPage
 * structured data.
 *
 * Works language-agnostically: rather than matching an English "Frequently
 * asked" heading (which is translated in the localized posts), it scans every
 * heading section and returns the one richest in `**Question?**` + answer
 * pairs. Returns [] for idiom posts, which have no such section and build their
 * FAQPage from idioms.json instead.
 */
export function extractFaqEntries(content: string): FaqEntry[] {
  const headings = [...content.matchAll(/^#{2,3}[ \t]+.*$/gm)];
  if (headings.length === 0) return [];

  let best: FaqEntry[] = [];
  for (let i = 0; i < headings.length; i++) {
    const start = headings[i].index! + headings[i][0].length;
    const end = i + 1 < headings.length ? headings[i + 1].index! : content.length;
    const found = pairsIn(content.slice(start, end));
    if (found.length > best.length) best = found;
  }
  return best.length >= 2 ? best : [];
}
