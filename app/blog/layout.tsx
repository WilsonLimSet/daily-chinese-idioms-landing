export const metadata = {
  title: 'Blog - Chinese Idioms',
  description: 'Learn a new Chinese idiom every day with historical context and practical examples.',
  alternates: {
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}