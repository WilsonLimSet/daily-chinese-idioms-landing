import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/src/lib/blog';
import { getAllBlogPosts as getAllIntlBlogPosts } from '@/src/lib/blog-intl';
import { LANGUAGE_CODES } from '@/src/lib/constants';

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
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  console.log(`Generated sitemap with ${staticPages.length + blogPosts.length + multilingualPosts.length} URLs across ${LANGUAGE_CODES.length + 1} languages`);

  return [...staticPages, ...blogPosts, ...multilingualPosts];
}