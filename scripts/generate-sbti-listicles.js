#!/usr/bin/env node
/**
 * Generate 27 SBTI listicle entries ready for listicles.ts.
 * Input: scripts/sbti-matches.json (from match-sbti-idioms.js)
 * Output: appended to src/lib/listicles.ts just before the closing "];"
 */

const fs = require('fs');
const path = require('path');

const matches = require(path.join(__dirname, 'sbti-matches.json'));

// Copy written to lean into SBTI search intent while staying on-brand for chineseidioms.com.
const COPY = {
  CTRL: {
    title: 'SBTI CTRL Personality — 5 Chinese Idioms for the Controller Type',
    description: 'SBTI CTRL means control, structure, and mastery. These 5 Chinese idioms (chengyu) perfectly capture the Controller\'s personality.',
    metaDescription: 'Got CTRL on the SBTI test? Discover 5 Chinese idioms that match the Controller personality — masters of planning, structure, and execution. With pinyin and meanings.',
    keywords: ['sbti ctrl', 'sbti ctrl meaning', 'sbti controller type', 'sbti personality chinese idioms', 'ctrl sbti explained', 'sbti test result'],
    intro: 'If you got CTRL on the SBTI personality test, you\'re the Controller — someone whose vibe is control, execution, and structure. Chinese culture has centuries of wisdom about the power of planning and mastery, captured in idioms called chengyu (成语). Here are 5 that embody the CTRL personality.',
  },
  'ATM-er': {
    title: 'SBTI ATM-er Personality — 5 Chinese Idioms for the Giver Type',
    description: 'SBTI ATM-er is the selfless Giver who always pays the bill. 5 Chinese idioms that capture this generous, loyal personality.',
    metaDescription: 'SBTI test result ATM-er means you\'re The Giver — generous, self-sacrificing, always there. These 5 Chinese idioms (chengyu) match the ATM-er personality perfectly.',
    keywords: ['sbti atm-er', 'sbti atmer meaning', 'sbti giver type', 'sbti personality chinese idioms', 'atm-er sbti explained', 'sbti test result'],
    intro: 'If you got ATM-er on the SBTI personality test, you\'re The Giver — always picking up the tab, always there for friends, always prioritizing others. Chinese culture deeply honors this kind of selfless devotion in its idioms (chengyu, 成语). Here are 5 that capture the ATM-er spirit.',
  },
  'Dior-s': {
    title: 'SBTI Dior-s Personality — 5 Chinese Idioms for the Loser-Sage Type',
    description: 'SBTI Dior-s is the anti-hustle Loser-Sage who finds peace in low desire. 5 Chinese idioms for this detached, contented personality.',
    metaDescription: 'Got Dior-s on SBTI? You\'re the Loser-Sage — anti-hustle, detached, content. These 5 Chinese idioms (chengyu) match the Dior-s personality perfectly.',
    keywords: ['sbti dior-s', 'sbti diors meaning', 'sbti loser sage', 'sbti personality chinese idioms', 'dior-s sbti explained', 'sbti test result'],
    intro: 'Dior-s on the SBTI test means you\'re the Loser-Sage — someone who opted out of the hustle and found a quieter wisdom. Chinese philosophy has long celebrated this detachment through idioms (chengyu, 成语). Here are 5 that capture the Dior-s way.',
  },
  BOSS: {
    title: 'SBTI BOSS Personality — 5 Chinese Idioms for the Leader Type',
    description: 'SBTI BOSS means commanding force, direction, and authority. 5 Chinese idioms (chengyu) that capture the Leader personality.',
    metaDescription: 'Scored BOSS on the SBTI test? You lead with authority and momentum. These 5 Chinese idioms (chengyu) match the BOSS personality — direction, decisiveness, power.',
    keywords: ['sbti boss', 'sbti boss meaning', 'sbti leader type', 'sbti personality chinese idioms', 'boss sbti explained', 'sbti test result'],
    intro: 'BOSS on SBTI means you\'re the Leader — you set direction, apply pressure upward, and make things happen. Chinese strategic thought is full of idioms (chengyu, 成语) about commanding presence and decisive leadership. Here are 5 that match the BOSS vibe.',
  },
  'THAN-K': {
    title: 'SBTI THAN-K Personality — 5 Chinese Idioms for the Thankful Type',
    description: 'SBTI THAN-K is the optimistic, grateful soul who finds warmth in recovery. 5 Chinese idioms for this bright personality.',
    metaDescription: 'THAN-K on SBTI means you\'re optimistic, warm, grateful. These 5 Chinese idioms (chengyu) match the THAN-K personality — light after darkness, fortune through patience.',
    keywords: ['sbti than-k', 'sbti thank meaning', 'sbti thankful type', 'sbti personality chinese idioms', 'than-k sbti explained', 'sbti test result'],
    intro: 'THAN-K on the SBTI test means you\'re the Thankful One — the person who bounces back with warmth and sees silver linings. Chinese wisdom literature is rich with idioms (chengyu, 成语) about optimism and gratitude. Here are 5 that embody the THAN-K spirit.',
  },
  'OH-NO': {
    title: 'SBTI OH-NO Personality — 5 Chinese Idioms for the Disaster Preventer',
    description: 'SBTI OH-NO sees risks early and sets boundaries. 5 Chinese idioms (chengyu) for the cautious, prevention-minded personality.',
    metaDescription: 'OH-NO on SBTI means you\'re the Disaster Preventer — cautious, risk-aware, always prepared. 5 Chinese idioms (chengyu) that match your careful personality.',
    keywords: ['sbti oh-no', 'sbti ohno meaning', 'sbti disaster preventer', 'sbti personality chinese idioms', 'oh-no sbti explained', 'sbti test result'],
    intro: 'OH-NO on SBTI means you\'re the Disaster Preventer — the one who spots risks before they happen and sets boundaries early. Chinese strategic thought has deep respect for foresight, captured in idioms (chengyu, 成语). Here are 5 that match the OH-NO mindset.',
  },
  GOGO: {
    title: 'SBTI GOGO Personality — 5 Chinese Idioms for the Doer Type',
    description: 'SBTI GOGO acts first, talks later. 5 Chinese idioms (chengyu) for the decisive, momentum-driven personality.',
    metaDescription: 'GOGO on SBTI means action first, discussion second. These 5 Chinese idioms (chengyu) match the GOGO personality — decisive, bold, momentum-driven.',
    keywords: ['sbti gogo', 'sbti gogo meaning', 'sbti doer type', 'sbti personality chinese idioms', 'gogo sbti explained', 'sbti test result'],
    intro: 'GOGO on SBTI means you\'re the Doer — action first, discussion later. Chinese military and strategic idioms (chengyu, 成语) are full of decisive-action energy. Here are 5 that capture the GOGO personality.',
  },
  SEXY: {
    title: 'SBTI SEXY Personality — 5 Chinese Idioms for the Magnetic Type',
    description: 'SBTI SEXY radiates presence and allure. 5 Chinese idioms (chengyu) that capture the Magnetic One\'s charisma.',
    metaDescription: 'SEXY on SBTI means magnetic presence and natural allure. These 5 Chinese idioms (chengyu) celebrate the SEXY personality — beauty, charisma, attention gravity.',
    keywords: ['sbti sexy', 'sbti sexy meaning', 'sbti magnetic type', 'sbti personality chinese idioms', 'sexy sbti explained', 'sbti test result'],
    intro: 'SEXY on SBTI means you\'re the Magnetic One — people turn heads and attention gathers around you. Classical Chinese poetry has some of the world\'s most exquisite idioms (chengyu, 成语) about beauty and presence. Here are 5 that match the SEXY vibe.',
  },
  'LOVE-R': {
    title: 'SBTI LOVE-R Personality — 5 Chinese Idioms for the Romantic Type',
    description: 'SBTI LOVE-R is the Romantic Maximalist — emotional intensity, deep devotion. 5 Chinese idioms (chengyu) for this passionate personality.',
    metaDescription: 'LOVE-R on SBTI means you love with everything — devotion, intensity, ideals. These 5 Chinese idioms (chengyu) match the LOVE-R personality perfectly.',
    keywords: ['sbti love-r', 'sbti lover meaning', 'sbti romantic type', 'sbti personality chinese idioms', 'love-r sbti explained', 'sbti test result'],
    intro: 'LOVE-R on SBTI means you\'re the Romantic Maximalist — you love hard, commit deeply, and carry ideals about what love should be. Chinese poetry has produced some of history\'s most beautiful idioms (chengyu, 成语) about devotion. Here are 5 that match the LOVE-R soul.',
  },
  MUM: {
    title: 'SBTI MUM Personality — 5 Chinese Idioms for the Mother Type',
    description: 'SBTI MUM is the empathetic caregiver who soothes and nurtures. 5 Chinese idioms (chengyu) for this warm, supportive personality.',
    metaDescription: 'MUM on SBTI means you\'re the Mother figure — empathetic, soothing, always there. These 5 Chinese idioms (chengyu) match the MUM personality perfectly.',
    keywords: ['sbti mum', 'sbti mum meaning', 'sbti mother type', 'sbti personality chinese idioms', 'mum sbti explained', 'sbti test result'],
    intro: 'MUM on SBTI means you\'re The Mother — the one who soothes, supports, and holds the emotional space for everyone around you. Chinese culture deeply honors this nurturing energy in its idioms (chengyu, 成语). Here are 5 that capture the MUM spirit.',
  },
  FAKE: {
    title: 'SBTI FAKE Personality — 5 Chinese Idioms for the Mask Shifter',
    description: 'SBTI FAKE is the adaptive Mask Shifter with a layered identity. 5 Chinese idioms (chengyu) for this complex personality.',
    metaDescription: 'FAKE on SBTI doesn\'t mean dishonest — it means adaptive, performative, layered. These 5 Chinese idioms (chengyu) capture the FAKE personality\'s complexity.',
    keywords: ['sbti fake', 'sbti fake meaning', 'sbti mask shifter', 'sbti personality chinese idioms', 'fake sbti explained', 'sbti test result'],
    intro: 'FAKE on SBTI doesn\'t mean inauthentic — it means you\'re the Mask Shifter, adapting your presentation to different contexts with layered identity. Chinese culture has a nuanced vocabulary for this through idioms (chengyu, 成语). Here are 5 that match the FAKE personality.',
  },
  OJBK: {
    title: 'SBTI OJBK Personality — 5 Chinese Idioms for the Whatever Type',
    description: 'SBTI OJBK goes with the flow and avoids conflict. 5 Chinese idioms (chengyu) for this easygoing personality.',
    metaDescription: 'OJBK on SBTI means you\'re easygoing, low-conflict, flexible. These 5 Chinese idioms (chengyu) match the OJBK personality — harmony, calm, go-with-the-flow.',
    keywords: ['sbti ojbk', 'sbti ojbk meaning', 'sbti whatever type', 'sbti personality chinese idioms', 'ojbk sbti explained', 'sbti test result'],
    intro: 'OJBK on SBTI means you\'re the Whatever Person — you roll with things, avoid conflict, and keep your inner peace. Taoist-influenced Chinese idioms (chengyu, 成语) capture this flow-state beautifully. Here are 5 that match the OJBK vibe.',
  },
  MALO: {
    title: 'SBTI MALO Personality — 5 Chinese Idioms for the Trickster Type',
    description: 'SBTI MALO is the playful Monkey Brain Trickster with weird ideas. 5 Chinese idioms (chengyu) for this inventive personality.',
    metaDescription: 'MALO on SBTI means playful, clever, unconventional. These 5 Chinese idioms (chengyu) match the MALO personality — creative mischief and inventive thinking.',
    keywords: ['sbti malo', 'sbti malo meaning', 'sbti monkey trickster', 'sbti personality chinese idioms', 'malo sbti explained', 'sbti test result'],
    intro: 'MALO on SBTI means you\'re the Monkey Brain Trickster — playful, inventive, and allergic to formality. Chinese stories are full of clever trickster figures, and idioms (chengyu, 成语) celebrate this kind of ingenuity. Here are 5 that match the MALO personality.',
  },
  'JOKE-R': {
    title: 'SBTI JOKE-R Personality — 5 Chinese Idioms for the Clown Type',
    description: 'SBTI JOKE-R masks depth behind humor. 5 Chinese idioms (chengyu) for the Clown personality\'s complex emotional layers.',
    metaDescription: 'JOKE-R on SBTI means you use humor to mask emptiness underneath. These 5 Chinese idioms (chengyu) capture the JOKE-R personality\'s hidden depth.',
    keywords: ['sbti joke-r', 'sbti joker meaning', 'sbti clown type', 'sbti personality chinese idioms', 'joke-r sbti explained', 'sbti test result'],
    intro: 'JOKE-R on SBTI means you\'re the Clown — you bring the humor and carry the room, but there\'s quieter weight underneath. Chinese idioms (chengyu, 成语) have a nuanced language for this kind of layered performance. Here are 5 that match the JOKE-R.',
  },
  WOC: {
    title: 'SBTI WOC Personality — 5 Chinese Idioms for the "Whoa" Type',
    description: 'SBTI WOC reacts loudly but judges quietly. 5 Chinese idioms (chengyu) for this dramatic observer personality.',
    metaDescription: 'WOC on SBTI means loud reactions, quiet judgments, dramatic observer. These 5 Chinese idioms (chengyu) match the WOC personality\'s bystander drama energy.',
    keywords: ['sbti woc', 'sbti woc meaning', 'sbti whoa person', 'sbti personality chinese idioms', 'woc sbti explained', 'sbti test result'],
    intro: 'WOC on SBTI means you\'re the "Whoa" person — loud reactions, quiet judgments, the dramatic witness in every story. Chinese idioms (chengyu, 成语) have a specific vocabulary for dramatic surprise and bystander energy. Here are 5 that match.',
  },
  'THIN-K': {
    title: 'SBTI THIN-K Personality — 5 Chinese Idioms for the Thinker Type',
    description: 'SBTI THIN-K is the analytical thinker with cognitive distance. 5 Chinese idioms (chengyu) for this logical personality.',
    metaDescription: 'THIN-K on SBTI means logic, analysis, deliberation. These 5 Chinese idioms (chengyu) match the THIN-K personality — penetrating insight and clear sight.',
    keywords: ['sbti thin-k', 'sbti think meaning', 'sbti thinker type', 'sbti personality chinese idioms', 'thin-k sbti explained', 'sbti test result'],
    intro: 'THIN-K on SBTI means you\'re the Thinker — you analyze, you deliberate, and you hold cognitive distance while everyone else reacts. Chinese wisdom literature venerates this kind of penetrating insight through idioms (chengyu, 成语). Here are 5 that match the THIN-K mind.',
  },
  SHIT: {
    title: 'SBTI SHIT Personality — 5 Chinese Idioms for the Bitter World-Saver',
    description: 'SBTI SHIT carries contempt outside, responsibility inside. 5 Chinese idioms (chengyu) for this cynical-but-caring personality.',
    metaDescription: 'SHIT on SBTI means cynical surface but responsible underneath. These 5 Chinese idioms (chengyu) match the SHIT personality — world-weary but caring.',
    keywords: ['sbti shit', 'sbti shit meaning', 'sbti cynic type', 'sbti personality chinese idioms', 'shit sbti explained', 'sbti test result'],
    intro: 'SHIT on SBTI doesn\'t mean what you think — it\'s the Bitter World-Saver, cynical on the outside but carrying deep responsibility underneath. Classical Chinese scholars often wrote in this voice; their idioms (chengyu, 成语) capture it well. Here are 5 that match.',
  },
  ZZZZ: {
    title: 'SBTI ZZZZ Personality — 5 Chinese Idioms for the Deadliner Type',
    description: 'SBTI ZZZZ activates only at the deadline. 5 Chinese idioms (chengyu) for this last-minute, emergency-awakened personality.',
    metaDescription: 'ZZZZ on SBTI means delayed activation, emergency awakening, deadline-driven. These 5 Chinese idioms (chengyu) capture the ZZZZ personality\'s rhythm.',
    keywords: ['sbti zzzz', 'sbti zzzz meaning', 'sbti deadliner', 'sbti personality chinese idioms', 'zzzz sbti explained', 'sbti test result'],
    intro: 'ZZZZ on SBTI means you\'re the Deadliner — you hibernate until the emergency wakes you, and then you produce everything at once. Chinese idioms (chengyu, 成语) have a rich vocabulary for this last-minute urgency. Here are 5 that match.',
  },
  POOR: {
    title: 'SBTI POOR Personality — 5 Chinese Idioms for the Narrow Beam Type',
    description: 'SBTI POOR focuses hard and prioritizes ruthlessly. 5 Chinese idioms (chengyu) for this single-minded personality.',
    metaDescription: 'POOR on SBTI means narrow beam focus, hard prioritization, selective energy. These 5 Chinese idioms (chengyu) match the POOR personality perfectly.',
    keywords: ['sbti poor', 'sbti poor meaning', 'sbti narrow beam', 'sbti personality chinese idioms', 'poor sbti explained', 'sbti test result'],
    intro: 'POOR on SBTI means you\'re the Narrow Beam — you prioritize ruthlessly, pour energy into one thing at a time, and ignore everything else. Chinese idioms (chengyu, 成语) celebrate this kind of single-minded focus. Here are 5 that match the POOR vibe.',
  },
  MONK: {
    title: 'SBTI MONK Personality — 5 Chinese Idioms for the Monk Type',
    description: 'SBTI MONK holds sacred personal space and distance. 5 Chinese idioms (chengyu) for this solitude-loving personality.',
    metaDescription: 'MONK on SBTI means privacy, distance, sacred personal space. These 5 Chinese idioms (chengyu) match the MONK personality — transcendence and solitude.',
    keywords: ['sbti monk', 'sbti monk meaning', 'sbti monk type', 'sbti personality chinese idioms', 'monk sbti explained', 'sbti test result'],
    intro: 'MONK on SBTI means you\'re the Monk — you protect your personal space like it\'s sacred ground, and you withdraw from chaos by choice. Taoist and Buddhist influences on Chinese idioms (chengyu, 成语) speak to this directly. Here are 5 that match the MONK path.',
  },
  IMSB: {
    title: 'SBTI IMSB Personality — 5 Chinese Idioms for the Self-Defeating Fool',
    description: 'SBTI IMSB fights impulse with insecurity and overcomplicates. 5 Chinese idioms (chengyu) for this counterproductive personality.',
    metaDescription: 'IMSB on SBTI means overcomplicating, impulse-vs-insecurity, self-defeat. These 5 Chinese idioms (chengyu) match the IMSB personality\'s backfire pattern.',
    keywords: ['sbti imsb', 'sbti imsb meaning', 'sbti self-defeating', 'sbti personality chinese idioms', 'imsb sbti explained', 'sbti test result'],
    intro: 'IMSB on SBTI means you\'re the Self-Defeating Fool — impulse fighting insecurity, plans that backfire, overcomplications that ruin good things. Chinese idioms (chengyu, 成语) have famously specific language for this pattern. Here are 5 that match.',
  },
  SOLO: {
    title: 'SBTI SOLO Personality — 5 Chinese Idioms for the Isolated Type',
    description: 'SBTI SOLO keeps defensive distance with hidden sensitivity. 5 Chinese idioms (chengyu) for this lonely-but-independent personality.',
    metaDescription: 'SOLO on SBTI means isolated, defensive, hidden sensitivity. These 5 Chinese idioms (chengyu) match the SOLO personality — going it alone with quiet depth.',
    keywords: ['sbti solo', 'sbti solo meaning', 'sbti isolated type', 'sbti personality chinese idioms', 'solo sbti explained', 'sbti test result'],
    intro: 'SOLO on SBTI means you\'re the Isolated One — you keep defensive distance, handle things alone, and carry a sensitivity few people see. Chinese idioms (chengyu, 成语) speak to this solitary resilience. Here are 5 that match the SOLO.',
  },
  FUCK: {
    title: 'SBTI FUCK Personality — 5 Chinese Idioms for the Wild Force Type',
    description: 'SBTI FUCK is raw vitality and untamed instinct. 5 Chinese idioms (chengyu) for this anti-domesticated personality.',
    metaDescription: 'FUCK on SBTI means raw vitality, untamed instinct, anti-domestication. These 5 Chinese idioms (chengyu) capture the FUCK personality\'s wild energy.',
    keywords: ['sbti fuck', 'sbti fuck meaning', 'sbti wild force', 'sbti personality chinese idioms', 'fuck sbti explained', 'sbti test result'],
    intro: 'FUCK on SBTI means you\'re the Wild Force — raw vitality, untamed instinct, and a refusal to be domesticated. Chinese idioms (chengyu, 成语) have expressive language for this ungovernable energy. Here are 5 that match.',
  },
  DEAD: {
    title: 'SBTI DEAD Personality — 5 Chinese Idioms for the Exhausted Sage',
    description: 'SBTI DEAD carries post-meaning fatigue and low-desire wisdom. 5 Chinese idioms (chengyu) for this burnout-wise personality.',
    metaDescription: 'DEAD on SBTI means exhausted sage, post-meaning fatigue, low thrill. These 5 Chinese idioms (chengyu) match the DEAD personality\'s burnout wisdom.',
    keywords: ['sbti dead', 'sbti dead meaning', 'sbti exhausted sage', 'sbti personality chinese idioms', 'dead sbti explained', 'sbti test result'],
    intro: 'DEAD on SBTI means you\'re the Exhausted Sage — burned out, low thrill, past the point of chasing meaning. Classical Chinese poetry is full of this same weariness, captured in idioms (chengyu, 成语). Here are 5 that match the DEAD mood.',
  },
  IMFW: {
    title: 'SBTI IMFW Personality — 5 Chinese Idioms for the Fragile Believer',
    description: 'SBTI IMFW is sensitive and dependent with low emotional armor. 5 Chinese idioms (chengyu) for this fragile personality.',
    metaDescription: 'IMFW on SBTI means sensitive, dependent, low emotional armor. These 5 Chinese idioms (chengyu) match the IMFW personality\'s fragile-believer pattern.',
    keywords: ['sbti imfw', 'sbti imfw meaning', 'sbti fragile believer', 'sbti personality chinese idioms', 'imfw sbti explained', 'sbti test result'],
    intro: 'IMFW on SBTI means you\'re the Fragile Believer — sensitive, easily rattled, carrying thin emotional armor. Chinese idioms (chengyu, 成语) have precise language for this kind of nervous sensitivity. Here are 5 that match.',
  },
  HHHH: {
    title: 'SBTI HHHH Personality — 5 Chinese Idioms for the Fallback Laugher',
    description: 'SBTI HHHH is the fallback type when answers contradict — confusion, absurdity. 5 Chinese idioms (chengyu) for this bewildered personality.',
    metaDescription: 'HHHH on SBTI means you broke the test — answers contradicted, fallback triggered. These 5 Chinese idioms (chengyu) capture the HHHH personality\'s absurdity.',
    keywords: ['sbti hhhh', 'sbti hhhh meaning', 'sbti fallback type', 'sbti personality chinese idioms', 'hhhh sbti explained', 'sbti test result'],
    intro: 'HHHH on SBTI is the fallback type — it means your answers contradicted themselves across the 15 dimensions and the system couldn\'t categorize you. That\'s its own kind of truth. Chinese idioms (chengyu, 成语) have great words for this bewildered, "laugh or cry" state. Here are 5.',
  },
  DRUNK: {
    title: 'SBTI DRUNK Personality — 5 Chinese Idioms for the Hidden Drunkard',
    description: 'SBTI DRUNK is the hidden secret type — alcohol-triggered chaos. 5 Chinese idioms (chengyu) for this decadent personality.',
    metaDescription: 'Unlocked DRUNK on SBTI? This is the hidden Easter-egg type. These 5 Chinese idioms (chengyu) match the DRUNK personality — decadent escape and chaotic dreaming.',
    keywords: ['sbti drunk', 'sbti drunk meaning', 'sbti drunkard type', 'sbti hidden type', 'how to get drunk sbti', 'sbti test result'],
    intro: 'DRUNK on SBTI is the hidden secret type — you unlocked it by selecting "Drinking" on the hobby question and following through. Chinese poetry has always romanticized wine and escape, captured in idioms (chengyu, 成语). Here are 5 that match the DRUNK mood.',
  },
};

const CATEGORY = 'SBTI Personality';
const PUBLISHED = '2026-04-16';

function slugFor(code) {
  return `sbti-${code.toLowerCase().replace(/[^a-z0-9]/g, '')}-personality-chinese-idioms`;
}

function renderEntry(match) {
  const copy = COPY[match.code];
  if (!copy) throw new Error(`Missing copy for ${match.code}`);
  const slug = slugFor(match.code);
  // Escape single quotes that appear in JS string literals
  const esc = s => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `  {
    slug: '${slug}',
    title: '${esc(copy.title)}',
    description: '${esc(copy.description)}',
    metaDescription: '${esc(copy.metaDescription)}',
    keywords: [${copy.keywords.map(k => `'${esc(k)}'`).join(', ')}],
    intro: '${esc(copy.intro)}',
    idiomIds: [${match.idiomIds.map(id => `'${id}'`).join(', ')}],
    category: '${CATEGORY}',
    publishedDate: '${PUBLISHED}'
  }`;
}

const entries = matches.map(renderEntry).join(',\n');

const listiclesPath = path.join(__dirname, '..', 'src', 'lib', 'listicles.ts');
const current = fs.readFileSync(listiclesPath, 'utf8');

// Guard: if SBTI entries already exist, don't append again
if (current.includes('sbti-ctrl-personality-chinese-idioms')) {
  console.error('SBTI entries already present in listicles.ts — skipping.');
  process.exit(0);
}

// Find the closing "];" of the listicles array and insert before it
const marker = '\n];';
const idx = current.indexOf(marker);
if (idx === -1) throw new Error('Could not find end of listicles array');

// Ensure the preceding line has a trailing comma
let before = current.slice(0, idx);
if (!before.trimEnd().endsWith(',')) {
  before = before.trimEnd() + ',\n';
}

const updated = before + entries + '\n' + current.slice(idx);
fs.writeFileSync(listiclesPath, updated);
console.error(`Appended ${matches.length} SBTI listicle entries to ${listiclesPath}`);
