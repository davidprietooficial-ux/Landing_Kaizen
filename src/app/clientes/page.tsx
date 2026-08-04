import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Star } from '@/components/Icons'
import { METRICS, CLIENTS, TESTIMONIALS } from '@/lib/config'
import CaseAvatar from './CaseAvatar'
import styles from './clientes.module.css'

export const metadata: Metadata = {
  title: 'Clientes y casos de estudio — Kaizen Studios',
  description:
    'Los clientes reales de Kaizen Studios y lo que dicen del trabajo, en sus propias palabras — sin logos genéricos ni cifras infladas.',
  alternates: { canonical: '/clientes' },
  robots: { index: true, follow: true },
}

export default function ClientesPage() {
  const hasClients = CLIENTS.length > 0

  return (
    <>
      <Header />
      <main>
        {/* Intro */}
        <section className={`section ${styles.hero}`}>
          <div className="container">
            <span className="eyebrow reveal">Clientes</span>
            <h1 className={`${styles.title} reveal`}>Marcas reales, resultados en sus propias palabras.</h1>
            <p className={`lead ${styles.lead} reveal`}>
              Nada de logos genéricos ni testimonios inventados. Estos son los clientes con los que hemos
              trabajado, y esto es lo que dicen del proceso — tal cual lo dijeron.
            </p>
          </div>
        </section>

        {/* Métricas */}
        <section className="section" style={{ paddingTop: 'clamp(32px,5vw,56px)', paddingBottom: 0 }}>
          <div className="container">
            <div className="metrics reveal">
              {METRICS.map((m) => (
                <div className="metric" key={m.label}>
                  {m.value === null ? (
                    <div className="metric__value">
                      —<span className="metric__todo">por confirmar</span>
                    </div>
                  ) : (
                    <div className="metric__value">
                      {m.value}
                      {m.suffix && <span className="suffix">{m.suffix}</span>}
                    </div>
                  )}
                  <div className="metric__label">{m.label}</div>
                </div>
              ))}
            </div>

            {hasClients && (
              <div className="clients reveal" aria-label="Clientes con los que hemos trabajado">
                <p className="mono clients__kicker">Clientes con los que hemos trabajado</p>
                <div className="clients__grid">
                  {CLIENTS.map((c) => (
                    <div
                      className={`client-logo${c.w ? ' client-logo--wide' : ''}`}
                      key={c.name}
                      title={c.name}
                      style={c.w ? { flexBasis: c.w, maxWidth: c.w } : undefined}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.src} alt={c.name} loading="lazy" style={c.h ? { maxHeight: c.h } : undefined} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Casos de estudio */}
        {TESTIMONIALS.length > 0 && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="container">
              <div className="section-head">
                <span className="eyebrow reveal">Casos de estudio</span>
                <h2 className="reveal">Lo que dicen los que ya trabajaron con nosotros.</h2>
              </div>

              <div className={styles.caseGrid} style={{ marginTop: 40 }}>
                {TESTIMONIALS.map((t) => (
                  <article className={`${styles.caseCard} reveal`} key={t.name}>
                    <div className={styles.caseTop}>
                      <svg
                        className={styles.caseQuoteMark}
                        width="30"
                        height="24"
                        viewBox="0 0 30 24"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M0 24V12.4C0 5.4 4.4 1 11.2 0l1.2 3C7.9 4.5 5.7 7 5.5 10H12v14H0Zm18 0V12.4C18 5.4 22.4 1 29.2 0l1.2 3c-4.5 1.5-6.7 4-6.9 7H30v14H18Z"
                        />
                      </svg>
                      <span className="t-card__stars" role="img" aria-label={`${t.stars} de 5 estrellas`}>
                        {Array.from({ length: 5 }, (_, s) => (
                          <Star key={s} size={16} className={s < t.stars ? undefined : 'dim'} />
                        ))}
                      </span>
                    </div>

                    <blockquote>{t.quote}</blockquote>

                    <div className="t-card__author">
                      <CaseAvatar src={t.photo} name={t.name} />
                      <div>
                        <strong>{t.name}</strong>
                        {(t.role || t.company) && <span>{[t.role, t.company].filter(Boolean).join(', ')}</span>}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Cierre / CTA */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className={`${styles.closing} reveal`}>
              <span className="eyebrow">Empecemos</span>
              <h2 style={{ fontSize: 'clamp(1.7rem,3.2vw,2.5rem)', marginTop: '1rem' }}>
                ¿Quieres ser el próximo caso?
              </h2>
              <p className={styles.closingText}>
                Agenda una llamada de diagnóstico. Vemos si tu proyecto encaja, sin compromiso.
              </p>
              <Link href="/#agendar" className="btn-gold">
                Agenda tu llamada
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
