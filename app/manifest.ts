import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Chinese Idioms',
    short_name: 'Chinese Idioms',
    description: 'Learn Chinese idioms (chengyu) with meanings, pronunciations, and examples. Daily updates with home screen widgets.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#FF3B30',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['education', 'reference', 'productivity'],
    lang: 'en',
    orientation: 'portrait',
    scope: '/',
    id: '/?homescreen=1',
  }
}