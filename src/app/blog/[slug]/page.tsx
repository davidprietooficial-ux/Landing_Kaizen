import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BLOG_POSTS } from '@/lib/blog'
import { SITE } from '@/lib/config'
import styles from '../blog.module.css'

// Next 16: `params` llega como Promise — hay que await-earlo tanto aquí como
// en generateMetadata y en el componente de página. Ver
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md
type Props = {
  params: Promise<{ slug: string }>
}

// Hoy BLOG_POSTS está vacío, así que esto devuelve [] y ninguna ruta se
// pre-genera en build — queda correctamente conectado para cuando haya posts.
export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) return {}

  return {
    title: `${post.title} — ${SITE.name}`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: { index: true, follow: true },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) notFound()

  return (
    <>
      <Header />
      <main>
        <section className={`section ${styles.articleHero}`}>
          <div className="container" style={{ maxWidth: 760 }}>
            <p style={{ marginBottom: '2rem' }}>
              <Link href="/blog" style={{ color: 'var(--gold)' }}>← Volver al blog</Link>
            </p>

            <span className="eyebrow">Blog</span>
            <h1 className={styles.articleTitle}>{post.title}</h1>
            <div className={styles.articleMeta}>
              <span className="mono">{formatDate(post.date)}</span>
              <span className="mono">{post.readTime}</span>
            </div>

            {post.content && (
              <div className={styles.articleBody}>
                {post.content.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
