#!/usr/bin/env node
/**
 * Match each of the 27 SBTI personality types to 5 thematically-fitting chengyu IDs
 * from public/idioms.json. Uses keyword scoring across metaphoric_meaning +
 * description + theme fields. Outputs ready-to-paste listicle definitions.
 */

const fs = require('fs');
const path = require('path');

const idioms = require(path.join(__dirname, '..', 'public', 'idioms.json'));

const SBTI_TYPES = [
  {
    code: 'CTRL', displayName: 'Controller',
    coreVibe: 'control, execution, structure, mastery, planning',
    keywords: ['strategy', 'plan', 'control', 'master', 'order', 'disciplin', 'prepare', 'calculat', 'methodical', 'systematic', 'command', 'precise', 'bamboo', 'chess', 'compose'],
    themeBoost: ['Strategy & Action'],
  },
  {
    code: 'ATM-er', displayName: 'The Giver',
    coreVibe: 'self-sacrifice, generosity, always gives',
    keywords: ['sacrifice', 'generos', 'give', 'help', 'aid', 'selfless', 'loyal', 'devote', 'share', 'support', 'rescue', 'righteous', 'spare no', 'altruis'],
    themeBoost: ['Relationships & Character'],
  },
  {
    code: 'Dior-s', displayName: 'The Loser-Sage',
    coreVibe: 'low desire, anti-hustle, detachment, contentment',
    keywords: ['content', 'simple', 'humble', 'modest', 'desire', 'ambition', 'detach', 'quiet', 'plain', 'poor', 'retir', 'withdraw', 'serene', 'peace'],
    themeBoost: ['Life Philosophy'],
  },
  {
    code: 'BOSS', displayName: 'Leader',
    coreVibe: 'direction, authority, commanding, leadership',
    keywords: ['lead', 'command', 'authority', 'rule', 'power', 'decisive', 'sovereign', 'general', 'mighty', 'dominant', 'bold', 'heroic', 'grand', 'sweep'],
    themeBoost: ['Strategy & Action'],
  },
  {
    code: 'THAN-K', displayName: 'The Thankful One',
    coreVibe: 'optimism, warmth, gratitude, recovery',
    keywords: ['grateful', 'thank', 'bless', 'fortune', 'hope', 'bright', 'recover', 'spring', 'warm', 'joy', 'happy', 'bitter to sweet', 'reward', 'bless', 'silver lining'],
    themeBoost: ['Life Philosophy'],
  },
  {
    code: 'OH-NO', displayName: 'Disaster Preventer',
    coreVibe: 'caution, risk awareness, prevention, foresight',
    keywords: ['cautious', 'careful', 'prevent', 'prepare', 'foresee', 'worry', 'anxious', 'guard', 'avoid', 'danger', 'risk', 'warn', 'think thrice', 'precaution'],
    themeBoost: ['Wisdom & Learning'],
  },
  {
    code: 'GOGO', displayName: 'The Doer',
    coreVibe: 'action-first, decisive, forward momentum',
    keywords: ['action', 'decisive', 'swift', 'quick', 'rush', 'forge', 'advance', 'charge', 'bold', 'brave', 'pioneer', 'lead the way', 'strike', 'firm'],
    themeBoost: ['Strategy & Action'],
  },
  {
    code: 'SEXY', displayName: 'The Magnetic One',
    coreVibe: 'presence, allure, beauty, charisma',
    keywords: ['beauty', 'beautiful', 'charm', 'allur', 'radiant', 'stunning', 'elegant', 'grace', 'attractive', 'magnetic', 'fascinate', 'captivat', 'dazzl'],
    themeBoost: ['Relationships & Character'],
  },
  {
    code: 'LOVE-R', displayName: 'Romantic Maximalist',
    coreVibe: 'emotional intensity, devotion, idealism',
    keywords: ['love', 'devot', 'passionate', 'romantic', 'heart', 'affection', 'yearn', 'longing', 'vow', 'eternal', 'soulmate', 'faithful', 'ardent'],
    themeBoost: ['Relationships & Character'],
  },
  {
    code: 'MUM', displayName: 'The Mother',
    coreVibe: 'empathy, caregiving, warmth, nurturing',
    keywords: ['kind', 'gentle', 'mother', 'nurtur', 'care', 'warm', 'tender', 'compassion', 'empath', 'support', 'soothe', 'comfort', 'benevol'],
    themeBoost: ['Relationships & Character'],
  },
  {
    code: 'FAKE', displayName: 'Mask Shifter',
    coreVibe: 'duplicity, adaptation, two-faced performance',
    keywords: ['two-face', 'duplicit', 'decep', 'hypocri', 'pretend', 'mask', 'insincere', 'cunning', 'sly', 'flatter', 'betray', 'false', 'scheme', 'shift'],
    themeBoost: ['Relationships & Character'],
  },
  {
    code: 'OJBK', displayName: 'Whatever Person',
    coreVibe: 'low conflict, easygoing, go-with-the-flow',
    keywords: ['easygoing', 'calm', 'peace', 'flow', 'adapt', 'flexible', 'yield', 'smooth', 'effortless', 'harmon', 'tranquil', 'neither', 'indifferen'],
    themeBoost: ['Life Philosophy'],
  },
  {
    code: 'MALO', displayName: 'Monkey Brain Trickster',
    coreVibe: 'playful, clever, unconventional, mischief',
    keywords: ['clever', 'playful', 'trick', 'unconvention', 'creative', 'quirky', 'inventive', 'unusual', 'resourceful', 'crafty', 'ingenuity', 'novel'],
    themeBoost: ['Strategy & Action'],
  },
  {
    code: 'JOKE-R', displayName: 'Clown',
    coreVibe: 'humor, performance, hidden emptiness',
    keywords: ['laugh', 'humor', 'joke', 'clown', 'pretend', 'show', 'perform', 'amus', 'forced smile', 'hollow', 'empty', 'fool', 'absurd'],
    themeBoost: ['Relationships & Character'],
  },
  {
    code: 'WOC', displayName: 'The Whoa Person',
    coreVibe: 'loud reaction, bystander drama, exaggeration',
    keywords: ['astonish', 'startl', 'shock', 'surprise', 'amaz', 'exclamation', 'gaz', 'onlooker', 'bystander', 'fuss', 'overreact', 'dramatic'],
    themeBoost: ['Relationships & Character'],
  },
  {
    code: 'THIN-K', displayName: 'Thinker',
    coreVibe: 'logic, analysis, deliberation, clarity',
    keywords: ['think', 'ponder', 'contempl', 'analy', 'logic', 'reason', 'clear', 'insight', 'wise', 'discern', 'understand', 'penetrat', 'investigate'],
    themeBoost: ['Wisdom & Learning'],
  },
  {
    code: 'SHIT', displayName: 'Bitter World-Saver',
    coreVibe: 'cynicism, world-weary responsibility',
    keywords: ['cynic', 'bitter', 'worry', 'indign', 'righteous', 'world', 'lament', 'disillusion', 'unfair', 'anger', 'injustice', 'concern', 'nation'],
    themeBoost: ['Life Philosophy'],
  },
  {
    code: 'ZZZZ', displayName: 'The Deadliner',
    coreVibe: 'procrastination, last-minute, emergency rush',
    keywords: ['last minute', 'procrastinat', 'delay', 'late', 'rush', 'haste', 'urgent', 'scrambl', 'too late', 'eleventh', 'makeshift', 'panic'],
    themeBoost: ['Wisdom & Learning'],
  },
  {
    code: 'POOR', displayName: 'The Narrow Beam',
    coreVibe: 'intense focus, single-mindedness',
    keywords: ['focus', 'concentrat', 'single', 'dedicated', 'undivid', 'absorbed', 'wholehearted', 'unwaver', 'intent', 'engross', 'devoted'],
    themeBoost: ['Wisdom & Learning'],
  },
  {
    code: 'MONK', displayName: 'The Monk',
    coreVibe: 'solitude, privacy, detachment from worldly things',
    keywords: ['solitude', 'alone', 'detach', 'withdraw', 'hermit', 'retreat', 'transcend', 'worldly', 'pure', 'quiet', 'recluse', 'ascet', 'aloof'],
    themeBoost: ['Life Philosophy'],
  },
  {
    code: 'IMSB', displayName: 'The Self-Defeating Fool',
    coreVibe: 'overcomplicating, backfire, counterproductive',
    keywords: ['backfire', 'overdo', 'unnecessary', 'counterproductive', 'ruin', 'superfluous', 'contradict', 'foolish', 'self-defeat', 'blunder', 'overreach'],
    themeBoost: ['Wisdom & Learning'],
  },
  {
    code: 'SOLO', displayName: 'The Isolated One',
    coreVibe: 'loneliness, defensive distance, hidden sensitivity',
    keywords: ['lonely', 'isolat', 'solitary', 'alone', 'abandon', 'outcast', 'lone', 'single shadow', 'orphan', 'forsaken', 'apart'],
    themeBoost: ['Life Philosophy'],
  },
  {
    code: 'FUCK', displayName: 'Wild Force',
    coreVibe: 'untamed, reckless, raw instinct, unbound',
    keywords: ['wild', 'untam', 'reckless', 'lawless', 'bold', 'audac', 'unrestrain', 'defiant', 'rebel', 'fierce', 'savage', 'brazen', 'unbridled'],
    themeBoost: ['Strategy & Action'],
  },
  {
    code: 'DEAD', displayName: 'The Exhausted Sage',
    coreVibe: 'burnout, post-meaning fatigue, low energy',
    keywords: ['exhaust', 'weary', 'burnout', 'despair', 'lifeless', 'numb', 'drained', 'ash', 'empty', 'listless', 'hopeless', 'fatigue', 'spent'],
    themeBoost: ['Life Philosophy'],
  },
  {
    code: 'IMFW', displayName: 'Fragile Believer',
    coreVibe: 'sensitivity, paranoia, low emotional armor',
    keywords: ['fragile', 'sensitive', 'paranoi', 'anxious', 'nervous', 'startl', 'fearful', 'doubt', 'suspicious', 'wind and cranes', 'every blade', 'trembl'],
    themeBoost: ['Life Philosophy'],
  },
  {
    code: 'HHHH', displayName: 'Fallback Laugher',
    coreVibe: 'confusion, absurdity, contradictions',
    keywords: ['contradict', 'confus', 'bewilder', 'muddled', 'ambigu', 'absurd', 'paradox', 'neither', 'laugh or cry', 'at a loss', 'hapless'],
    themeBoost: ['Wisdom & Learning'],
  },
  {
    code: 'DRUNK', displayName: 'The Drunkard',
    coreVibe: 'escapism, chaos, debauchery, indulgence',
    keywords: ['drunk', 'wine', 'intoxic', 'indulg', 'debauch', 'hedon', 'revel', 'feast', 'excess', 'escape', 'dissolute', 'stupor', 'carous'],
    themeBoost: ['Life Philosophy'],
  },
];

function scoreIdiom(idiom, type) {
  const haystack = [
    idiom.metaphoric_meaning || '',
    idiom.meaning || '',
    idiom.description || '',
    idiom.theme || '',
  ].join(' ').toLowerCase();

  let score = 0;
  for (const kw of type.keywords) {
    if (haystack.includes(kw.toLowerCase())) {
      // metaphoric_meaning match weighs more
      if ((idiom.metaphoric_meaning || '').toLowerCase().includes(kw.toLowerCase())) score += 5;
      else if ((idiom.meaning || '').toLowerCase().includes(kw.toLowerCase())) score += 3;
      else score += 1;
    }
  }
  if (type.themeBoost.includes(idiom.theme)) score += 1;
  return score;
}

// Track global usage so one idiom isn't reused in too many types
const usage = new Map();
const MAX_REUSE = 3;

const results = [];

for (const type of SBTI_TYPES) {
  const scored = idioms
    .map(i => ({ idiom: i, score: scoreIdiom(i, type), uses: usage.get(i.id) || 0 }))
    .filter(x => x.score > 0)
    .sort((a, b) => {
      // Penalize over-used idioms heavily
      const aEff = a.score - a.uses * 2;
      const bEff = b.score - b.uses * 2;
      if (bEff !== aEff) return bEff - aEff;
      return b.score - a.score;
    });

  const picked = [];
  for (const s of scored) {
    if (picked.length >= 5) break;
    if ((usage.get(s.idiom.id) || 0) >= MAX_REUSE) continue;
    picked.push(s.idiom);
    usage.set(s.idiom.id, (usage.get(s.idiom.id) || 0) + 1);
  }

  // Fallback: if fewer than 5, fill from theme-matched idioms
  if (picked.length < 5) {
    const themed = idioms
      .filter(i => type.themeBoost.includes(i.theme) && !picked.find(p => p.id === i.id))
      .sort(() => Math.random() - 0.5);
    for (const i of themed) {
      if (picked.length >= 5) break;
      if ((usage.get(i.id) || 0) >= MAX_REUSE) continue;
      picked.push(i);
      usage.set(i.id, (usage.get(i.id) || 0) + 1);
    }
  }

  results.push({
    code: type.code,
    displayName: type.displayName,
    coreVibe: type.coreVibe,
    idiomIds: picked.map(i => i.id),
    matched: picked.map(i => `${i.id} ${i.characters} (${i.metaphoric_meaning})`),
  });
}

// Stats
const totalUsed = new Set();
for (const r of results) r.idiomIds.forEach(id => totalUsed.add(id));

console.error(`Matched 27 types using ${totalUsed.size} distinct idioms.`);
for (const r of results) {
  console.error(`${r.code.padEnd(8)} → ${r.idiomIds.join(', ')}`);
  for (const m of r.matched) console.error(`    ${m}`);
}

// Write JSON output
const outPath = path.join(__dirname, 'sbti-matches.json');
fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
console.error(`\nWrote ${outPath}`);
