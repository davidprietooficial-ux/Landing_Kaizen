import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ACCESS_TIERS } from '@/lib/config'
import { Check, ArrowRight, Lock } from '@/components/Icons'
import styles from './servicios.module.css'

export const metadata: Metadata = {
  title: 'Un sistema, tres accesos — Kaizen Studios',
  description:
    'No vendemos tres servicios ni tres paquetes sueltos: vendemos un solo sistema — atraer, convertir, gestionar. Muestra, El sistema o Sistema completo solo cambian cuánto queda automatizado para ti.',
  alternates: { canonical: '/servicios' },
  robots: { index: true, follow: true },
}

export default function ServiciosPage() {
  return (
    <>
      <Header />
      <main>
        <section className={`section ${styles.hero}`}>
          <div className="container">
            <span className="eyebrow">No son 3 servicios sueltos</span>
            <h1 className={styles.h1}>Un sistema. Tres accesos. Nunca tres paquetes distintos.</h1>
            <p className={`lead ${styles.lead}`}>
              Esto sigue viviendo en <span className="mono" style={{ letterSpacing: 0 }}>/servicios</span> porque
              así lo buscas. Pero aquí no eliges piezas sueltas: eliges cuánto del mismo sistema —
              atraer, convertir, gestionar — queda armado y automatizado para ti. El sistema que recibes
              es siempre el mismo. Lo que cambia es cuánto de él operas tú y cuánto opera solo.
            </p>

            <div className={styles.grid}>
              {ACCESS_TIERS.map((tier) => {
                const isFeatured = 'featured' in tier && tier.featured
                return (
                  <div
                    key={tier.key}
                    className={`${styles.card} reveal${isFeatured ? ` ${styles.cardFeatured}` : ''}`}
                  >
                    {isFeatured && <span className={styles.badge}>El que más pedimos</span>}
                    <span className={styles.cardKey}>Acceso {tier.key}</span>
                    <h2 className={styles.cardName}>{tier.name}</h2>
                    <span className={styles.cardSubtitle}>{tier.subtitle}</span>
                    <p className={styles.cardText}>{tier.text}</p>
                    <p className={styles.cardForWho}>
                      <span className="ic"><Check size={16} /></span>
                      <span>{tier.forWho}</span>
                    </p>
                    <Link
                      href="/#agendar"
                      className={`${isFeatured ? 'btn-gold' : 'btn-gold--outline'} ${styles.cardCta}`}
                    >
                      Agenda tu llamada <ArrowRight size={16} />
                    </Link>
                  </div>
                )
              })}
            </div>

            <div className={`${styles.exclusive} reveal`}>
              <div>
                <h2 className={styles.exclusiveTitle}>
                  No somos la opción más barata. <em>Somos la mejor.</em>
                </h2>
                <p className={styles.exclusiveText}>
                  No competimos por precio. La opción más barata siempre va a existir — y no es la nuestra.
                  Tomamos pocos proyectos al mes, los justos para darle a cada uno el equipo completo, no
                  una fracción repartida entre veinte cuentas. Eso cuesta más. También rinde más.
                </p>
              </div>
              <div className={styles.exclusiveBanner}>
                <span className="ic"><Lock size={17} /></span>
                <span>
                  Trabajamos con un puñado de clientes premium a la vez — no con quien primero paga, sino
                  con quien encaja con lo que construimos.
                </span>
              </div>
            </div>

            <div className={styles.closing}>
              <h2 className={styles.closingTitle}>¿Con cuál de los tres accesos entras al sistema?</h2>
              <Link href="/#agendar" className="btn-gold">
                Agenda tu llamada <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
