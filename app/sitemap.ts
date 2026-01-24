import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/src/lib/blog';
import { getAllBlogPosts as getAllIntlBlogPosts } from '@/src/lib/blog-intl';
import { getAllListicles } from '@/src/lib/listicles';
import { LANGUAGE_CODES } from '@/src/lib/constants';

const THEME_SLUGS = [
  'life-philosophy',
  'relationships-character',
  'strategy-action',
  'success-perseverance',
  'wisdom-learning'
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chineseidioms.com';

  // Get English blog posts
  const posts = await getAllBlogPosts();

  // Create English blog post entries
  const blogPosts = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Create multilingual blog entries
  const multilingualPosts = [];
  for (const lang of LANGUAGE_CODES) {
    try {
      const intlPosts = await getAllIntlBlogPosts(lang);

      // Language home pages
      multilingualPosts.push({
        url: `${baseUrl}/${lang}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9, // High priority for language home pages
      });

      // Language blog index pages
      multilingualPosts.push({
        url: `${baseUrl}/${lang}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.85, // Slightly higher than individual posts for SEO
      });

      // Individual blog posts in each language
      intlPosts.forEach((post) => {
        multilingualPosts.push({
          url: `${baseUrl}/${lang}/blog/${post.slug}`,
          lastModified: new Date(post.date),
          changeFrequency: 'monthly' as const,
          priority: 0.75, // Slightly lower than English for primary ranking
        });
      });
    } catch {
      console.warn(`Could not generate sitemap entries for language: ${lang}`);
    }
  }

  // Theme pages (English)
  const themePages = [
    {
      url: `${baseUrl}/themes`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...THEME_SLUGS.map(theme => ({
      url: `${baseUrl}/themes/${theme}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))
  ];

  // Multilingual theme pages
  const multilingualThemePages = [];
  for (const lang of LANGUAGE_CODES) {
    for (const theme of THEME_SLUGS) {
      multilingualThemePages.push({
        url: `${baseUrl}/${lang}/themes/${theme}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      });
    }
  }

  // Listicle pages (curated idiom lists)
  const listicles = getAllListicles();
  const listiclePages = listicles.map((listicle) => ({
    url: `${baseUrl}/blog/lists/${listicle.slug}`,
    lastModified: new Date(listicle.publishedDate),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/lists`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/dictionary`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.95, // High priority - main reference page
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9, // High priority for AEO - FAQ pages are AI-friendly
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  console.log(`Generated sitemap with ${staticPages.length + blogPosts.length + multilingualPosts.length + themePages.length + multilingualThemePages.length + listiclePages.length} URLs across ${LANGUAGE_CODES.length + 1} languages`);

  return [...staticPages, ...blogPosts, ...multilingualPosts, ...themePages, ...multilingualThemePages, ...listiclePages];
}