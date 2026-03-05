const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const siteUrl = 'https://www.chineseidioms.com';
const idioms = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/idioms.json'), 'utf8'));

function pinyinToSlug(pinyin) {
  return pinyin.toLowerCase().replace(/[āáǎà]/g, 'a').replace(/[ēéěè]/g, 'e')
    .replace(/[īíǐì]/g, 'i').replace(/[ōóǒò]/g, 'o').replace(/[ūúǔù]/g, 'u')
    .replace(/[ǖǘǚǜü]/g, 'v').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function escapeXml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function getAllPosts() {
  const posts = [];

  // Markdown blog posts
  const contentDir = path.join(__dirname, '../content/blog');
  if (fs.existsSync(contentDir)) {
    for (const file of fs.readdirSync(contentDir)) {
      if (!file.endsWith('.md')) continue;
      const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
      const { data } = matter(raw);
      const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
      const idiom = idioms.find(i => pinyinToSlug(i.pinyin) === slug);
      if (data.title && data.date) {
        posts.push({ slug, title: data.title, date: data.date, description: idiom?.description || data.description || '' });
      }
    }
  }

  // Generated idiom posts
  for (const idiom of idioms) {
    const slug = pinyinToSlug(idiom.pinyin);
    if (!posts.find(p => p.slug === slug)) {
      posts.push({ slug, title: `${idiom.characters} - ${idiom.metaphoric_meaning}`, date: '2025-01-01', description: idiom.description });
    }
  }

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

const posts = getAllPosts();
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Chinese Idioms Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Learn a new Chinese idiom every day with historical context and practical examples.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`).join('')}
  </channel>
</rss>`;

fs.writeFileSync(path.join(__dirname, '../public/rss.xml'), rss);
console.log(`Generated rss.xml with ${posts.length} posts`);
