import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/src/lib/blog';
import { getAllBlogPosts as getAllIntlBlogPosts } from '@/src/lib/blog-intl';
import { getAllListicles, getAllListiclesTranslated } from '@/src/lib/listicles';
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

    return [...staticPages, ...blogPosts, ...themePages];
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
