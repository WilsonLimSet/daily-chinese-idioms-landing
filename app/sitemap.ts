import { MetadataRoute } from 'next';
export const dynamic = 'force-static';
import { getAllBlogPosts } from '@/src/lib/blog';
import { getAllBlogPosts as getAllIntlBlogPosts } from '@/src/lib/blog-intl';
import { getAllListicles, getAllListiclesTranslated } from '@/src/lib/listicles';
import { getAllSlangTerms } from '@/src/lib/slang';
import { getAllPhrases } from '@/src/lib/phrases';
import { getAllCharacterPages } from '@/src/lib/characters';
import { getAllPoems } from '@/src/lib/poems';
import { getAllPoets } from '@/src/lib/poets';
import { LANGUAGE_CODES } from '@/src/lib/constants';

const THEME_SLUGS = [
  'life-philosophy',
  'relationships-character',
  'strategy-action',
  'success-perseverance',
  'wisdom-learning'
];

// Sitemap IDs:
// 0 = Static pages + English blog posts + English themes
// 1 = English listicles
// 2..14 = Multilingual content (one per language, mapped to LANGUAGE_CODES[id - 2])
export async function generateSitemaps() {
  // 2 English sitemaps + 13 language sitemaps
  return Array.from({ length: 2 + LANGUAGE_CODES.length }, (_, i) => ({ id: i }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chineseidioms.com';

  // Sitemap 0: Static pages + English blog posts + English themes
  if (id === 0) {
    const posts = await getAllBlogPosts();

    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog/lists`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      },
      {
        url: `${baseUrl}/dictionary`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.95,
      },
      {
        url: `${baseUrl}/faq`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/festivals`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      },
    ];

    const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

    const themePages: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/themes`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      ...THEME_SLUGS.map(theme => ({
        url: `${baseUrl}/themes/${theme}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      })),
    ];

    // Slang pages
    const slangTerms = getAllSlangTerms();
    const slangPages: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/slang`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      ...slangTerms.map(term => ({
        url: `${baseUrl}/slang/${term.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ];

    // HSK pages
    const hskPages: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/hsk`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      ...['1', '2', '3', '4', '5', '6'].map(level => ({
        url: `${baseUrl}/hsk/${level}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.85,
      })),
    ];

    // Phrases pages
    const phraseTerms = getAllPhrases();
    const phrasePages: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/phrases`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      ...phraseTerms.map(term => ({
        url: `${baseUrl}/phrases/${term.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ];

    // Character pages
    const characterPages = getAllCharacterPages();
    const charPages: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/characters`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      ...characterPages.map(char => ({
        url: `${baseUrl}/characters/${char.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ];

    // Poem pages
    const allPoems = getAllPoems();
    const poemPages: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/poems`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      ...allPoems.map(poem => ({
        url: `${baseUrl}/poems/${poem.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ];

    // Poet pages
    const allPoets = getAllPoets();
    const poetPages: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/poets`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      ...allPoets.map(poet => ({
        url: `${baseUrl}/poets/${poet.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.85,
      })),
    ];

    return [...staticPages, ...blogPosts, ...themePages, ...slangPages, ...hskPages, ...phrasePages, ...charPages, ...poemPages, ...poetPages];
  }

  // Sitemap 1: English listicles
  if (id === 1) {
    const listicles = getAllListicles();
    return listicles.map((listicle) => ({
      url: `${baseUrl}/blog/lists/${listicle.slug}`,
      lastModified: new Date(listicle.publishedDate),
      changeFrequency: 'monthly',
      priority: 0.85,
    }));
  }

  // Sitemaps 2-14: One per language
  const langIndex = id - 2;
  if (langIndex < 0 || langIndex >= LANGUAGE_CODES.length) {
    return [];
  }

  const lang = LANGUAGE_CODES[langIndex];
  const entries: MetadataRoute.Sitemap = [];

  // Language home page
  entries.push({
    url: `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  });

  // Language blog index
  entries.push({
    url: `${baseUrl}/${lang}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  });

  // Language dictionary page
  entries.push({
    url: `${baseUrl}/${lang}/dictionary`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  });

  // Language festivals page
  entries.push({
    url: `${baseUrl}/${lang}/festivals`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.85,
  });

  // Language theme pages
  for (const theme of THEME_SLUGS) {
    entries.push({
      url: `${baseUrl}/${lang}/themes/${theme}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Language blog posts
  try {
    const intlPosts = await getAllIntlBlogPosts(lang);
    for (const post of intlPosts) {
      entries.push({
        url: `${baseUrl}/${lang}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.75,
      });
    }
  } catch {
    console.warn(`Could not generate blog sitemap entries for language: ${lang}`);
  }

  // Language slang pages
  entries.push({
    url: `${baseUrl}/${lang}/slang`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  });

  const slangTerms = getAllSlangTerms();
  for (const term of slangTerms) {
    entries.push({
      url: `${baseUrl}/${lang}/slang/${term.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    });
  }

  // Language HSK pages
  entries.push({
    url: `${baseUrl}/${lang}/hsk`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  });

  for (const level of ['1', '2', '3', '4', '5', '6']) {
    entries.push({
      url: `${baseUrl}/${lang}/hsk/${level}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Language phrases pages
  entries.push({
    url: `${baseUrl}/${lang}/phrases`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  });

  const phraseTerms = getAllPhrases();
  for (const term of phraseTerms) {
    entries.push({
      url: `${baseUrl}/${lang}/phrases/${term.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    });
  }

  // Language character pages
  entries.push({
    url: `${baseUrl}/${lang}/characters`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  });

  const langCharPages = getAllCharacterPages();
  for (const char of langCharPages) {
    entries.push({
      url: `${baseUrl}/${lang}/characters/${char.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    });
  }

  // Language poet pages
  entries.push({
    url: `${baseUrl}/${lang}/poets`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  });

  const langPoets = getAllPoets();
  for (const poet of langPoets) {
    entries.push({
      url: `${baseUrl}/${lang}/poets/${poet.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Language poem pages
  entries.push({
    url: `${baseUrl}/${lang}/poems`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  });

  const langPoems = getAllPoems();
  for (const poem of langPoems) {
    entries.push({
      url: `${baseUrl}/${lang}/poems/${poem.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    });
  }

  // Language listicle pages
  try {
    const translatedListicles = getAllListiclesTranslated(lang);

    entries.push({
      url: `${baseUrl}/${lang}/blog/lists`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    for (const listicle of translatedListicles) {
      entries.push({
        url: `${baseUrl}/${lang}/blog/lists/${listicle.slug}`,
        lastModified: new Date(listicle.publishedDate),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  } catch {
    console.warn(`Could not generate listicle sitemap entries for language: ${lang}`);
  }

  return entries;
}
