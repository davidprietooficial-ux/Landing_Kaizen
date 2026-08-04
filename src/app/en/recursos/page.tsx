import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { RESOURCES } from '@/lib/resources'
import styles from '../../recursos/recursos.module.css'

export const metadata: Metadata = {
  title: 'Resources — Kaizen Studios',
  description: 'Free guides and paid resources from Kaizen Studios. None published yet.',
  alternates: { canonical: '/en/recursos', languages: { es: '/recursos', en: '/en/recursos' } },
  robots: { index: true, follow: true },
}

export default function ResourcesPageEn() {
  const gratis = RESOURCES.filter((r) => r.type === 'gratis')
  const pago = RESOURCES.filter((r) => r.type === 'pago')

  return (
    <>
      <Header />
      <main>
        <section className={`section ${styles.hero}`}>
          <div className="container">
            <span className="eyebrow">Resources</span>
            <h1 className={styles.h1}>Downloadable resources</h1>
            <p className={`lead ${styles.lead}`}>
              Free guides and paid resources for people who want to solve this on their own. None
              published yet — when they exist, they will be here, with no filler or made-up examples
              in the meantime.
            </p>

            {RESOURCES.length === 0 ? (
              <div className={styles.emptyState}>
                <p>There is nothing to download right now. We would rather not pad this page with fake resources.</p>
                <p>
                  If you want to know as soon as we publish the first one, subscribe to the newsletter —
                  the form is at the bottom of this same page, in the footer.
                </p>
              </div>
            ) : (
              <>
                {gratis.length > 0 && (
                  <>
                    <div className="section-head" style={{ marginTop: 44 }}>
                      <span className="mono">Free</span>
                    </div>
                    <div className={styles.grid}>
                      {gratis.map((r) => (
                        <ResourceCard key={r.slug} resource={r} />
                      ))}
                    </div>
                  </>
                )}

                {pago.length > 0 && (
                  <>
                    <div className="section-head" style={{ marginTop: 44 }}>
                      <span className="mono">Paid</span>
                    </div>
                    <div className={styles.grid}>
                      {pago.map((r) => (
                        <ResourceCard key={r.slug} resource={r} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function ResourceCard({ resource }: { resource: (typeof RESOURCES)[number] }) {
  const badgeClass = resource.type === 'gratis' ? styles.badgeGratis : styles.badgePago
  const content = (
    <>
      <span className={`${styles.badge} ${badgeClass}`}>{resource.type}</span>
      <h3 className={styles.cardTitle}>{resource.title}</h3>
      <p className={styles.cardText}>{resource.description}</p>
    </>
  )

  if (resource.href) {
    return (
      <a className={styles.card} href={resource.href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return <div className={styles.card}>{content}</div>
}
