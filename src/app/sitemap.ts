import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/config'
import { BLOG_POSTS } from '@/lib/blog'

const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1, changeFrequency: 'monthly' },
  { path: '/sistema', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/quienes-somos', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/servicios', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/clientes', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/recursos', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/privacidad', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terminos', priority: 0.3, changeFrequency: 'yearly' },
  // Inglés — solo las páginas que ya existen bajo /en (Sistema/Servicios/
  // Clientes/Blog aún no tienen versión EN, se agregan cuando se traduzcan).
  { path: '/en', priority: 1, changeFrequency: 'monthly' },
  { path: '/en/quienes-somos', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/en/recursos', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/en/privacidad', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/en/terminos', priority: 0.3, changeFrequency: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    ...ROUTES.map((r) => ({
      url: `${SITE.url}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...BLOG_POSTS.map((post) => ({
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]
}
