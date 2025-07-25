# Chengyu: Daily Chinese Idioms 成语

[![Download on the App Store](public/app-store-badge.svg)](https://apps.apple.com/us/app/dailychineseidioms/id6740611324)
[![Website](https://img.shields.io/badge/Website-chineseidioms.com-red)](https://www.chineseidioms.com)

Learn Chinese idioms (成语 chéng yǔ) with beautiful iOS widgets that update daily on your home screen. Each day brings a new four-character idiom with its story, meaning, and practical usage examples.

## 🌟 Features

- **📱 Home Screen Widgets** - Small, medium, and large widget sizes for iOS 14+
- **🎯 Daily Updates** - A new carefully selected idiom every day
- **📚 381+ Idioms** - Extensive collection covering various themes
- **🔍 Search & Filter** - Find idioms by keywords, themes, or pinyin
- **🌐 Bilingual Content** - English translations and Chinese examples
- **📖 Rich Context** - Historical origins and modern usage for each idiom
- **🔒 Privacy-First** - Works completely offline, no data collection
- **📱 Native iOS App** - Built with SwiftUI for the best experience

## 🛠 Tech Stack

### iOS App
- **SwiftUI** - Native iOS interface
- **WidgetKit** - Home screen widget functionality
- **Core Data** - Local data storage

### Website & Blog
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vercel** - Hosting and deployment
- **Vercel Analytics** - Privacy-focused analytics

## 🤖 How the Automation Works

The blog features automated daily posts powered by Node.js scripts:

1. **Content Generation** (`scripts/generate-blog-posts.js`)
   - Reads from `public/idioms.json` containing 381 idioms
   - Maps each day to a specific idiom (ID001 for Jan 1, ID002 for Jan 2, etc.)
   - Generates markdown files with frontmatter metadata

2. **Daily Updates** (`scripts/generate-todays-post.js`)
   - Can be run via cron job or GitHub Actions
   - Creates blog post for the current day
   - Ensures consistent daily content

3. **Blog Structure**
   - Posts stored in `content/blog/` as markdown files
   - Filename format: `YYYY-MM-DD-pinyin-slug.md`
   - Includes metadata: title, date, characters, pinyin, meaning, theme

## 🌐 Live Website

Visit [chineseidioms.com](https://www.chineseidioms.com) to:
- Browse the daily idiom blog
- Learn about the iOS app
- Access the complete idiom archive

## 📱 Mobile App

**Chengyu: Daily Chinese Idioms** is available on the [App Store](https://apps.apple.com/us/app/dailychineseidioms/id6740611324).

### Widget Sizes
- **Small**: Shows idiom characters only
- **Medium**: Characters + pinyin + brief meaning
- **Large**: Full idiom with story and examples

## 🚀 Getting Started (Development)

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chinese-idioms-landing.git
cd chinese-idioms-landing

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📝 Content Management

### Adding New Idioms
1. Edit `public/idioms.json`
2. Follow the existing format with required fields:
   - `id`: Unique identifier (ID001, ID002, etc.)
   - `characters`: Chinese characters
   - `pinyin`: Romanization
   - `meaning`: Literal translation
   - `metaphoric_meaning`: Figurative meaning
   - `theme`: Category (Success, Wisdom, etc.)
   - `description`: Full explanation
   - `example`: English usage example
   - `chineseExample`: Chinese usage example

### Generating Blog Posts

```bash
# Generate all posts up to today
node scripts/generate-blog-posts.js

# Generate today's post only
node scripts/generate-todays-post.js
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=https://www.chineseidioms.com
```

### SEO Configuration
- Sitemap: Auto-generated at `/sitemap.xml`
- Robots.txt: Configured in `app/robots.ts`
- Meta tags: Set in `app/layout.tsx`

## 📊 Analytics

The site uses Vercel Analytics for privacy-focused visitor insights. No personal data is collected.

## 🤝 Contributing

While this is primarily a personal project, suggestions and bug reports are welcome through GitHub issues.

## 📄 License

© 2025 Daily Chinese Idioms. All rights reserved.

## 🙏 Acknowledgments

- Built by [Wilson Lim](https://wilsonlimset.com)
- Inspired by the rich tradition of Chinese four-character idioms
- Special thanks to the Chinese language learning community

---

**Learn a new Chinese idiom every day!** 🎯