import QualifyForm from './QualifyForm'
import { Check, Lock } from './Icons'

const POINTS = [
  'Entendemos tu negocio, tu oferta y a quién le vendes.',
  'Te mostramos cómo se vería tu sistema — atraer, convertir, gestionar — para conseguir clientes.',
  'Sales con un plan y una cotización claros, sin compromiso.',
]

export default function Schedule() {
  return (
    <section id="agendar" className="section schedule">
      <div className="container">
        <div className="schedule__grid">
          {/* ── izquierda: gancho ── */}
          <div className="schedule__left">
            <span className="eyebrow">Agendar</span>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,2.9rem)', margin: '1rem 0 .6rem' }}>¡Agenda tu llamada!</h2>

            <p className="lead">
              No trabajamos con todo el mundo, y eso es bueno para ti. Cuéntanos de tu negocio y, si encajamos,
              agendamos tu llamada al instante.
            </p>

            {/* Imagen: render 3D dorado (calendario + reloj) flotando sobre el fondo. */}
            <div className="schedule__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/agenda-web.png" alt="Agenda tu llamada con Kaizen Studios" loading="lazy" />
            </div>

            <div className="schedule__banner">
              <Lock size={15} />
              <span>Cupos limitados cada mes. El calendario se desbloquea solo si tu proyecto califica.</span>
            </div>

            <ul className="schedule__points">
              {POINTS.map((p) => (
                <li key={p}>
                  <span className="ic"><Check size={18} /></span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── derecha: formulario propio de 4 pasos → src/app/api/lead → GHL ── */}
          <div className="qualify-card">
            <QualifyForm />
          </div>
        </div>
      </div>
    </section>
  )
}
