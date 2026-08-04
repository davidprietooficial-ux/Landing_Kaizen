import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { RESOURCES } from '@/lib/resources'
import styles from './recursos.module.css'

export const metadata: Metadata = {
  title: 'Recursos — Kaizen Studios',
  description: 'Guías gratis y recursos de pago de Kaizen Studios. Todavía no hay ninguno publicado.',
  alternates: { canonical: '/recursos' },
  robots: { index: true, follow: true },
}

export default function RecursosPage() {
  const gratis = RESOURCES.filter((r) => r.type === 'gratis')
  const pago = RESOURCES.filter((r) => r.type === 'pago')

  return (
    <>
      <Header />
      <main>
        <section className={`section ${styles.hero}`}>
          <div className="container">
            <span className="eyebrow">Recursos</span>
            <h1 className={styles.h1}>Recursos descargables</h1>
            <p className={`lead ${styles.lead}`}>
              Guías gratis y recursos de pago para quien quiere resolver esto por su cuenta. Todavía no
              hay ninguno publicado — cuando salgan, van a estar aquí, sin relleno ni ejemplos inventados
              mientras tanto.
            </p>

            {RESOURCES.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Por ahora no hay nada que descargar. Preferimos no llenar esta página con recursos falsos.</p>
                <p>
                  Si quieres enterarte en cuanto publiquemos el primero, suscríbete al newsletter — el
                  formulario está al final de esta misma página, en el pie.
                </p>
              </div>
            ) : (
              <>
                {gratis.length > 0 && (
                  <>
                    <div className="section-head" style={{ marginTop: 44 }}>
                      <span className="mono">Gratis</span>
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
                      <span className="mono">Pago</span>
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
