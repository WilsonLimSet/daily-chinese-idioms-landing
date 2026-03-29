import idioms from '../../public/idioms.json';
import { pinyinToSlug } from './utils/pinyin';

export type IdiomComparison = {
  slug: string;
  idiom1: typeof idioms[0];
  idiom2: typeof idioms[0];
  similarity: 'synonym' | 'nuance' | 'opposite';
  reason: string;
};

// Hand-curated pairs with genuine linguistic relationships
// Each pair has a reason explaining the actual difference
const COMPARISON_PAIRS: Array<{
  id1: string;
  id2: string;
  similarity: 'synonym' | 'nuance' | 'opposite';
  reason: string;
}> = [
  // === NEAR-SYNONYMS (similar meaning, different nuance) ===
  { id1: 'ID005', id2: 'ID090', similarity: 'synonym', reason: '百折不挠 emphasizes not breaking despite setbacks, while 锲而不舍 emphasizes never stopping the effort. One is about resilience, the other about persistence.' },
  { id1: 'ID005', id2: 'ID684', similarity: 'synonym', reason: '百折不挠 stresses surviving repeated failures, while 坚持不懈 focuses on continuous effort without slacking. Resilience vs discipline.' },
  { id1: 'ID090', id2: 'ID683', similarity: 'synonym', reason: '锲而不舍 (carving without stopping) implies active effort, while 持之以恒 (maintain constancy) implies steady consistency. Intensity vs steadiness.' },
  { id1: 'ID106', id2: 'ID701', similarity: 'synonym', reason: '铁杵成针 (iron pestle to needle) is about grinding through an impossible task, while 绳锯木断 (rope saws wood) emphasizes that even soft effort cuts through hard obstacles over time.' },
  { id1: 'ID014', id2: 'ID693', similarity: 'synonym', reason: '天道酬勤 says heaven rewards hard work (cosmic justice), while 有志者事竟成 says a determined person will succeed (personal willpower). Divine reward vs human agency.' },
  { id1: 'ID021', id2: 'ID016', similarity: 'nuance', reason: '青出于蓝 is about the student surpassing the teacher, while 温故知新 is about learning new things from old knowledge. Surpassing vs building upon.' },
  { id1: 'ID076', id2: 'ID154', similarity: 'nuance', reason: '水到渠成 (water flows to form a channel) means success comes naturally when ready, while 厚积薄发 (thick accumulation, thin release) emphasizes long preparation before a sudden breakthrough.' },
  { id1: 'ID065', id2: 'ID143', similarity: 'synonym', reason: '一丝不苟 means not a single thread out of place (meticulous), while 精益求精 means already refined but seeking further refinement (perfectionist). Precision vs continuous improvement.' },
  { id1: 'ID166', id2: 'ID095', similarity: 'synonym', reason: '呕心沥血 (vomiting heart, dripping blood) is about pouring everything into creative work, while 春蚕到死 (silkworm spins until death) is about selfless devotion to others. Self-expression vs self-sacrifice.' },
  { id1: 'ID233', id2: 'ID106', similarity: 'synonym', reason: '愚公移山 (Old Man moves mountains) is about multi-generational persistence against impossible odds, while 铁杵成针 (pestle to needle) is about individual effort on a difficult task. Collective vs individual persistence.' },
  { id1: 'ID175', id2: 'ID025', similarity: 'nuance', reason: '巧夺天工 means craftsmanship surpassing nature itself, while 画龙点睛 means the crucial finishing touch that brings something to life. Overall excellence vs the final detail.' },
  { id1: 'ID002', id2: 'ID016', similarity: 'nuance', reason: '融会贯通 means merging all knowledge into complete mastery, while 温故知新 means reviewing the old to discover the new. Total synthesis vs incremental discovery.' },
  { id1: 'ID035', id2: 'ID082', similarity: 'synonym', reason: '风雨同舟 (sharing a boat in storm) is about two people enduring hardship together, while 众志成城 (many wills form a fortress) is about collective strength. Partnership vs community.' },
  { id1: 'ID102', id2: 'ID035', similarity: 'nuance', reason: '雪中送炭 (charcoal in snow) is about timely help in crisis, while 风雨同舟 (sharing a boat) is about ongoing partnership through hardship. A single act of rescue vs sustained solidarity.' },
  { id1: 'ID385', id2: 'ID606', similarity: 'synonym', reason: '天长地久 (heaven and earth endure) describes something lasting forever, while 海枯石烂 (seas dry, rocks crumble) is an oath that love will outlast even cosmic destruction. Duration vs intensity of commitment.' },
  { id1: 'ID605', id2: 'ID183', similarity: 'nuance', reason: '一见钟情 is love at first sight (instant attraction), while 刻骨铭心 is an experience carved into bone (permanent impact). The spark vs the scar.' },
  { id1: 'ID084', id2: 'ID018', similarity: 'nuance', reason: '柳暗花明 (dark willows, bright flowers) is about finding a way forward after despair, while 塞翁失马 (old man loses horse) is about misfortune becoming fortune. Breakthrough vs reframing.' },
  { id1: 'ID007', id2: 'ID084', similarity: 'nuance', reason: '一波三折 (one wave, three turns) describes a situation full of twists, while 柳暗花明 describes the moment you emerge from those twists into clarity. The journey vs the destination.' },
  { id1: 'ID186', id2: 'ID106', similarity: 'synonym', reason: '千锤百炼 (thousand hammerings) is about being tempered through repeated trials, while 铁杵成针 (iron pestle to needle) is about persistent grinding. Being shaped by external force vs applying your own effort.' },
  { id1: 'ID119', id2: 'ID186', similarity: 'nuance', reason: '玉汝于成 (jade perfected through hardship) emphasizes that difficulty itself is the refining agent, while 千锤百炼 (thousand hammerings) emphasizes the sheer volume of trials. Quality of hardship vs quantity.' },

  // === OPPOSITES / CONTRASTS ===
  { id1: 'ID032', id2: 'ID021', similarity: 'opposite', reason: '笨鸟先飞 (clumsy bird flies first) celebrates hard work compensating for lack of talent, while 青出于蓝 (blue surpasses indigo) celebrates natural talent exceeding its origins. Effort-based vs talent-based success.' },
  { id1: 'ID036', id2: 'ID052', similarity: 'opposite', reason: '事半功倍 (half effort, double result) means working smart for efficiency, while 集腋成裘 (fox fur scraps make a robe) means small efforts accumulating into big results. Efficiency vs accumulation.' },
  { id1: 'ID091', id2: 'ID820', similarity: 'nuance', reason: '虚怀若谷 (humble as a valley) is about being open and receptive, while 鸿鹄之志 (ambition of a swan) is about having grand aspirations. Humility vs ambition — both virtues, but in tension.' },
  { id1: 'ID115', id2: 'ID086', similarity: 'opposite', reason: '负重致远 (bear weight, reach far) means enduring a long burden for distant goals, while 一鼓作气 (one drumbeat, full energy) means seizing the moment with maximum force. Marathon vs sprint.' },
  { id1: 'ID104', id2: 'ID086', similarity: 'opposite', reason: '明镜止水 (clear mirror, still water) is about calm clarity, while 一鼓作气 (one drumbeat) is about explosive decisive action. Stillness vs action.' },
  { id1: 'ID273', id2: 'ID002', similarity: 'opposite', reason: '盲人摸象 (blind men touch elephant) is about partial understanding leading to wrong conclusions, while 融会贯通 is about achieving complete, unified understanding. Fragmentation vs synthesis.' },

  // === MORE NEAR-SYNONYMS (common confusion pairs) ===
  { id1: 'ID001', id2: 'ID154', similarity: 'nuance', reason: '一鸣惊人 (one cry startles all) emphasizes the dramatic moment of debut, while 厚积薄发 emphasizes the long preparation before that moment. The flash vs the fuse.' },
  { id1: 'ID134', id2: 'ID267', similarity: 'nuance', reason: '饮水思源 (drink water, remember source) is about gratitude to origins, while 承前启后 (receive past, initiate future) is about being the link between tradition and innovation. Looking back vs bridging forward.' },
  { id1: 'ID024', id2: 'ID018', similarity: 'nuance', reason: '因果报应 (karma) means actions have inevitable consequences, while 塞翁失马 (old man\'s horse) means outcomes aren\'t what they seem. Moral causation vs situational irony.' },
  { id1: 'ID056', id2: 'ID605', similarity: 'nuance', reason: '爱屋及乌 (love the house, love the crow on it) is about loving everything associated with someone you love, while 一见钟情 is love at first sight. Extended love vs instant love.' },
  { id1: 'ID124', id2: 'ID273', similarity: 'nuance', reason: '蚁穴坏堤 (ant hole breaks dike) warns about small flaws causing big failures, while 盲人摸象 warns about partial information causing wrong conclusions. Small neglect vs limited perspective.' },

  // === CLASSIC TEXTBOOK PAIRS (people actively search "X vs Y") ===
  { id1: 'ID233', id2: 'ID005', similarity: 'synonym', reason: '愚公移山 is about moving an immovable obstacle through generational effort, while 百折不挠 is about personal resilience through repeated setbacks. Both are about never giving up, but 愚公移山 is collective and 百折不挠 is individual.' },
  { id1: 'ID076', id2: 'ID014', similarity: 'nuance', reason: '水到渠成 says success comes naturally when conditions are right, while 天道酬勤 says heaven specifically rewards hard work. Organic inevitability vs earned reward.' },
  { id1: 'ID082', id2: 'ID035', similarity: 'synonym', reason: '众志成城 (many wills, one fortress) is about collective determination, while 风雨同舟 (boat in storm) is about mutual support in crisis. Both about togetherness, but one is about strength and the other about solidarity.' },
  { id1: 'ID143', id2: 'ID186', similarity: 'nuance', reason: '精益求精 is self-driven pursuit of perfection (internal standard), while 千锤百炼 is being refined through external trials (forged by circumstance). Self-improvement vs environmental tempering.' },
  { id1: 'ID001', id2: 'ID545', similarity: 'synonym', reason: '一鸣惊人 (one cry startles all) emphasizes the surprise element of sudden success, while 脱颖而出 (point emerges from bag) emphasizes standing out from a crowd. Dramatic debut vs distinguishing oneself.' },
];

function makeComparisonSlug(idiom1: typeof idioms[0], idiom2: typeof idioms[0]): string {
  const slug1 = pinyinToSlug(idiom1.pinyin);
  const slug2 = pinyinToSlug(idiom2.pinyin);
  return `${slug1}-vs-${slug2}`;
}

export function getAllComparisons(): IdiomComparison[] {
  return COMPARISON_PAIRS
    .map(pair => {
      const idiom1 = idioms.find(i => i.id === pair.id1);
      const idiom2 = idioms.find(i => i.id === pair.id2);
      if (!idiom1 || !idiom2) return null;

      return {
        slug: makeComparisonSlug(idiom1, idiom2),
        idiom1,
        idiom2,
        similarity: pair.similarity,
        reason: pair.reason,
      };
    })
    .filter((c): c is IdiomComparison => c !== null);
}

export function getComparison(slug: string): IdiomComparison | null {
  const comparisons = getAllComparisons();
  return comparisons.find(c => c.slug === slug) || null;
}

export function getRelatedComparisons(idiomId: string, excludeSlug: string): IdiomComparison[] {
  return getAllComparisons()
    .filter(c =>
      (c.idiom1.id === idiomId || c.idiom2.id === idiomId) &&
      c.slug !== excludeSlug
    )
    .slice(0, 4);
}
