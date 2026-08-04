import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LazyVideo from '@/components/LazyVideo'
import { ArrowRight } from '@/components/Icons'
import { ASSETS, DIFFERENTIATOR, SITE, SYSTEM_PHASES } from '@/lib/config'
import styles from './sistema.module.css'

export const metadata: Metadata = {
  title: `Cómo funciona el sistema — ${SITE.name}`,
  description:
    'Meta Ads que usan tus propias redes, una web 100% tuya que convierte y automatización que da seguimiento a cada lead. Las 3 fases del sistema de Kaizen Studios, explicadas a fondo.',
  alternates: { canonical: '/sistema' },
  robots: { index: true, follow: true },
}

// Copy extendido de cada fase para esta página (más profundidad que el teaser
// pinned-scroll de Home). Alineado 1:1 por índice con SYSTEM_PHASES.
const PHASE_DETAILS: string[][] = [
  // 01 · Atraer
  [
    'La mayoría de la pauta se dispara a extraños. Nosotros partimos de tu propia audiencia — la gente que ya te sigue, ya vio tu contenido, ya sabe que existes — y construimos desde ahí públicos y remarketing reales.',
    'El anuncio no compite por atención fría: llega a personas con algo de confianza ya ganada. Eso baja el costo por lead y sube su calidad — no es tráfico genérico, es gente con intención real de comprar lo tuyo.',
  ],
  // 02 · Convertir
  [
    'Tu perfil de Instagram no es tuyo: es un espacio que rentas, y el dueño puede cambiar las reglas — o cerrarte la cuenta — cuando quiera. Una web sí es tuya. Nadie te la puede quitar y ningún algoritmo decide quién la ve.',
    'La construimos con copy estratégico, pensado para resolver la objeción exacta que tiene el visitante en cada sección, y con producción audiovisual de calidad — no plantilla, no stock genérico. El clic que antes se perdía en un feed aterriza en un lugar diseñado para convertirlo en cliente.',
  ],
  // 03 · Gestionar
  [
    'Un lead que no recibe respuesta en minutos se enfría y se va con la competencia. Contestar a mano, cuando alguien tiene tiempo, no escala — y siempre hay algún mensaje que se queda sin respuesta.',
    'Con GoHighLevel + n8n automatizamos la conversación inicial, el seguimiento y el onboarding: nadie se pierde entre los mensajes, sin importar cuántos lleguen ni a qué hora.',
  ],
]

export default function SistemaPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── intro ── */}
        <section className={`section ${styles.intro}`}>
          <div className="container">
            <span className="eyebrow">El sistema</span>
            <h1 className={styles.h1}>
              Un video suelto no vende. Una web sola no vende. Un sistema sí.
            </h1>
            <p className={`lead ${styles.leadRow}`}>
              Cada pieza suelta compite sola, sin apoyo del resto. Contratas un video y no tienes a dónde mandar el
              tráfico. Contratas una web y no tienes quién le hable a la gente que llega. Kaizen construye las tres
              fases juntas y conectadas, para que cada peso que inviertes termine en un cliente — no en un me gusta
              más.
            </p>
          </div>
        </section>

        {/* ── las 3 fases ── */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Las 3 fases</span>
              <h2>Atraer, convertir, gestionar.</h2>
            </div>

            <div className={styles.phases}>
              {SYSTEM_PHASES.map((phase, i) => (
                <div className={`${styles.phase} reveal`} key={phase.t}>
                  <span className={styles.phaseNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.phaseBody}>
                    <h3>{phase.t}</h3>
                    {PHASE_DETAILS[i].map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className={`${styles.loop} reveal`}>
              Cada venta que se cierra alimenta datos reales de vuelta a los anuncios en Meta: qué audiencia sí
              compra, qué mensaje sí convierte. <strong>Atraer mejora con cada Gestionar — la máquina se optimiza
              sola.</strong>
            </p>
          </div>
        </section>

        {/* ── diferenciador: producción audiovisual ── */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className={styles.diffGrid}>
              <div className={`${styles.diffText} reveal`}>
                <span className="eyebrow">{DIFFERENTIATOR.eyebrow}</span>
                <h2>{DIFFERENTIATOR.title}</h2>
                <p className="lead">{DIFFERENTIATOR.text}</p>
                <p>
                  Nadie confía su operación completa — conversaciones, seguimiento, automatización — a alguien cuyo
                  video se ve casero. La calidad audiovisual es la prueba física de que sabemos lo que hacemos: una
                  vez que la ves, es más fácil creer que también sabemos construir el resto del sistema.
                </p>
              </div>
              <div className={`${styles.diffMedia} reveal`}>
                {ASSETS.hasShowreel ? (
                  <LazyVideo aria-label="Reel de producción audiovisual de Kaizen Studios">
                    <source src="/video/SHOWREEL.webm" type="video/webm" />
                    <source src="/video/SHOWREEL.mp4" type="video/mp4" />
                  </LazyVideo>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* ── cierre / CTA ── */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className={`${styles.ctaRow} reveal`}>
              <span className="eyebrow">Siguiente paso</span>
              <h2>Deja de vender piezas sueltas.</h2>
              <p className="lead">Mira los accesos al sistema o agenda una llamada para ver si encajamos.</p>
              <div className={styles.ctaActions}>
                <Link href="/servicios" className="btn-ghost">
                  Ver los accesos
                </Link>
                <Link href="/#agendar" className="btn-gold">
                  Agenda tu llamada
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
