import Script from 'next/script'
import { GHL_FORM_EMBED, GHL_FORM_SCRIPT } from '@/lib/config'
import { Check, Lock } from './Icons'

// Id de la encuesta = último segmento de la URL del embed. El script de auto-resize
// de GHL empareja el iframe por este id (sin prefijo "inline-": eso es solo para Forms).
const GHL_FORM_ID = GHL_FORM_EMBED ? GHL_FORM_EMBED.split('?')[0].split('/').pop() : ''

const POINTS = [
  'Entendemos tu negocio, tu oferta y a quién le vendes.',
  'Te mostramos cómo se vería tu sistema de web + tráfico para conseguir clientes.',
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

          {/* ── derecha: formulario de GoHighLevel (embed) ──
              El formulario, la calificación y la agenda viven DENTRO de este iframe,
              todo generado y gestionado en GHL. Aquí solo reservamos el espacio. */}
          <div className="qualify-card">
            {GHL_FORM_EMBED ? (
              <div className="ghl-embed">
                {/* SIN loading="lazy": el iframe se carga de inmediato. Es el elemento
                    de conversión y, diferido, competía con el script de auto-resize y
                    dejaba el iframe a la altura fija del CSS (encuesta recortada/en blanco). */}
                <iframe
                  src={GHL_FORM_EMBED}
                  title="Formulario de contacto · Kaizen Studios"
                  id={GHL_FORM_ID}
                  scrolling="no"
                />
                {/* afterInteractive (no lazyOnload): el listener de postMessage que ajusta
                    la altura debe existir ANTES de que el iframe reporte su tamaño. Con
                    lazyOnload arrancaba tarde y a veces perdía ese mensaje → "no carga". */}
                {GHL_FORM_SCRIPT && <Script src={GHL_FORM_SCRIPT} strategy="afterInteractive" />}
              </div>
            ) : (
              <div className="ghl-embed ghl-embed--placeholder">
                <span className="mono">Formulario · por conectar con GHL</span>
                <p>
                  Aquí va el formulario que generes en GoHighLevel. Pega la URL del embed en{' '}
                  <code>GHL_FORM_EMBED</code> — <code>src/lib/config.ts</code>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
