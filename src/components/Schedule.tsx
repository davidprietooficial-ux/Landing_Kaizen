import QualifyForm from './QualifyForm'
import { Check, Lock } from './Icons'
import type { Locale } from '@/lib/locale'

const COPY = {
  es: {
    eyebrow: 'Agendar',
    title: '¡Agenda tu llamada!',
    lead: 'No trabajamos con todo el mundo, y eso es bueno para ti. Cuéntanos de tu negocio y, si encajamos, agendamos tu llamada al instante.',
    mediaAlt: 'Agenda tu llamada con Kaizen Studios',
    banner: 'Cupos limitados cada mes. El calendario se desbloquea solo si tu proyecto califica.',
    points: [
      'Entendemos tu negocio, tu oferta y a quién le vendes.',
      'Te mostramos cómo se vería tu sistema — atraer, convertir, gestionar — para conseguir clientes.',
      'Sales con un plan y una cotización claros, sin compromiso.',
    ],
  },
  en: {
    eyebrow: 'Book a call',
    title: 'Book your call!',
    lead: "We don't work with everyone, and that's good for you. Tell us about your business and, if we're a fit, we'll book your call instantly.",
    mediaAlt: 'Book your call with Kaizen Studios',
    banner: 'Limited spots every month. The calendar only unlocks if your project qualifies.',
    points: [
      'We understand your business, your offer, and who you sell to.',
      'We show you what your system — attract, convert, manage — would look like to win clients.',
      'You leave with a clear plan and quote, no strings attached.',
    ],
  },
}

export default function Schedule({ locale = 'es' }: { locale?: Locale }) {
  const t = COPY[locale]
  return (
    <section id="agendar" className="section schedule">
      <div className="container">
        <div className="schedule__grid">
          {/* ── izquierda: gancho ── */}
          <div className="schedule__left">
            <span className="eyebrow">{t.eyebrow}</span>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,2.9rem)', margin: '1rem 0 .6rem' }}>{t.title}</h2>

            <p className="lead">{t.lead}</p>

            {/* Imagen: render 3D dorado (calendario + reloj) flotando sobre el fondo. */}
            <div className="schedule__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/agenda-web.png" alt={t.mediaAlt} loading="lazy" />
            </div>

            <div className="schedule__banner">
              <Lock size={15} />
              <span>{t.banner}</span>
            </div>

            <ul className="schedule__points">
              {t.points.map((p) => (
                <li key={p}>
                  <span className="ic"><Check size={18} /></span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── derecha: formulario propio de 2 pasos → src/app/api/lead → GHL ── */}
          <div className="qualify-card">
            <QualifyForm locale={locale} />
          </div>
        </div>
      </div>
    </section>
  )
}
