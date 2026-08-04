import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BLOG_POSTS } from '@/lib/blog'
import { SITE } from '@/lib/config'
import styles from './blog.module.css'

export const metadata: Metadata = {
  title: 'Blog — Kaizen Studios',
  description: `Notas de ${SITE.name} sobre producción audiovisual, pauta y sistemas que venden. Todavía no hay ningún post publicado.`,
  alternates: { canonical: '/blog' },
  robots: { index: true, follow: true },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        <section className={`section ${styles.hero}`}>
          <div className="container">
            <span className="eyebrow">Blog</span>
            <h1 className={styles.h1}>Blog</h1>
            <p className={`lead ${styles.lead}`}>
              Todavía no hemos publicado nada aquí. Escribimos cuando tenemos algo real que decir sobre
              producción audiovisual, pauta o cómo se arma un sistema que vende — no antes.
            </p>

            {BLOG_POSTS.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No hay artículos publicados por ahora. Nada de posts genéricos para llenar espacio mientras tanto.</p>
                <p>Cuando salga el primero, aparece aquí directamente.</p>
                <div className={styles.emptyStateActions}>
                  <Link href="/#agendar" className="btn-gold">Agenda una llamada</Link>
                  <span style={{ color: 'var(--muted)', fontSize: '.9rem' }}>
                    o suscríbete al newsletter en el pie de esta página para enterarte apenas publiquemos algo.
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles.grid}>
                {BLOG_POSTS.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
                    <div className={styles.cardMeta}>
                      <span className="mono">{formatDate(post.date)}</span>
                      <span className="mono">{post.readTime}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{post.title}</h3>
                    <p className={styles.cardText}>{post.excerpt}</p>
                  </Link>
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
