'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { CALENDLY_URL, CONTACT } from '@/lib/config'
import { Check, Mail, ArrowRight, Lock, Camera } from './Icons'
import { lockScroll, unlockScroll } from '@/lib/scroll'

// Carga diferida: solo baja el bundle de Calendly en el cliente (y solo dentro del popup, tras calificar).
const InlineWidget = dynamic(() => import('react-calendly').then((m) => m.InlineWidget), {
  ssr: false,
  loading: () => <div className="calendly-fallback"><span className="mono">Cargando agenda…</span></div>,
})

const POINTS = [
  'Entendemos tu marca, tus objetivos y tus canales.',
  'Te mostramos cómo se vería tu sistema de contenido.',
  'Sales con una propuesta y una cotización claras, sin compromiso.',
]

// ── Opciones del formulario de prospección ──
const ROLES = ['Dueño / Fundador', 'Director / C-level', 'Encargado de marketing', 'Asistente / Otro']
const DECISIONS = ['Yo decido', 'Yo y un socio', 'Un comité (3+ personas)']
const NEEDS = ['Eventos corporativos', 'Contenido para redes (mensual)', 'Video corporativo / de marca', 'Contenido inmobiliario', 'Aún no estoy seguro']
const BUDGETS = ['Menos de $1.5M', '$1.5M – $3M', '$3M – $6M', '$6M – $10M', 'Más de $10M', 'Aún no lo defino']
const TIMELINES = ['Este mes', 'En 2–3 meses', 'Solo estoy explorando']
const MINDSETS = ['Una inversión en mi marca', 'Un gasto necesario', 'Busco la opción más económica']

type Status = '' | 'green' | 'yellow' | 'red'

// Semáforo de calificación (tunéalo libremente).
function evaluate(f: { role: string; decision: string; budget: string; mindset: string; timeline: string }): Status {
  // 🔴 por debajo del ticket mínimo o mentalidad de regateo
  if (f.budget === 'Menos de $1.5M' || f.mindset === 'Busco la opción más económica') return 'red'
  // 🟡 una sola señal floja → revisión manual
  if (f.decision === 'Un comité (3+ personas)' || f.budget === 'Aún no lo defino' || f.timeline === 'Solo estoy explorando') return 'yellow'
  // 🟢 todo en verde
  const roleOk = ['Dueño / Fundador', 'Director / C-level', 'Encargado de marketing'].includes(f.role)
  const decisionOk = f.decision === 'Yo decido' || f.decision === 'Yo y un socio'
  const budgetOk = ['$1.5M – $3M', '$3M – $6M', '$6M – $10M', 'Más de $10M'].includes(f.budget)
  const mindsetOk = f.mindset === 'Una inversión en mi marca' || f.mindset === 'Un gasto necesario'
  const timeOk = f.timeline === 'Este mes' || f.timeline === 'En 2–3 meses'
  if (roleOk && decisionOk && budgetOk && mindsetOk && timeOk) return 'green'
  return 'yellow'
}

const MSG = {
  green: {
    title: 'Encajamos. 🎬',
    body: 'Por lo que nos cuentas, tu proyecto es justo el tipo de trabajo que hacemos mejor. Elige el horario que te sirva abajo: en esos 30 minutos te mostramos cómo se vería tu sistema de contenido y sales con un plan claro y una cotización, sin compromiso.',
  },
  yellow: {
    title: 'Queremos asegurarnos de hacerlo bien.',
    body: 'Tu proyecto tiene potencial, pero antes de agendar nos gustaría entender un par de detalles para no hacerte perder el tiempo. Un miembro del equipo te escribe en menos de 24h a tu correo para coordinar. Gracias por la confianza.',
  },
  red: {
    title: 'Gracias por escribirnos, pero hoy no seríamos la mejor opción para ti.',
    body: 'Trabajamos con un estándar de cine que tiene un costo acorde, y por lo que nos cuentas creemos que aún no es el momento para que la inversión te rinda como debería. Preferimos decírtelo de frente antes que entregarte algo a medias. Cuando tu marca esté lista para dar ese salto, aquí estaremos.',
  },
}

export default function Schedule() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    site: '',
    role: ROLES[0],
    decision: DECISIONS[0],
    need: NEEDS[1],
    budget: BUDGETS[2],
    mindset: MINDSETS[0],
    timeline: TIMELINES[0],
    goal: '',
  })
  const [status, setStatus] = useState<Status>('')
  const [prefill, setPrefill] = useState<{ name: string; email: string } | null>(null)
  const [open, setOpen] = useState(false)

  // Bloqueo de scroll + cerrar con Esc mientras el popup está abierto.
  useEffect(() => {
    if (!open) return
    lockScroll()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      unlockScroll()
    }
  }, [open])

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const s = evaluate(form)
    setStatus(s)
    setPrefill({ name: form.name, email: form.email })
    setOpen(true) // abre el popup en cualquier caso; el Calendly solo se monta si calificó 🟢
  }

  return (
    <section id="agendar" className="section schedule">
      <div className="container">
        <div className="schedule__grid">
          {/* ── izquierda: gancho ── */}
          <div className="schedule__left">
            <span className="eyebrow">Agendar</span>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,2.9rem)', margin: '1rem 0 .6rem' }}>¡Agenda tu llamada!</h2>

            <p className="lead">
              30 minutos donde sales con un plan claro para tu contenido y podemos empezar a trabajar juntos.
            </p>

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

            {/* Banner de imagen flexible: rellena el espacio junto al cuadro de la derecha.
                Cuando esté el archivo, reemplaza el placeholder por <img src="/img/agenda.jpg" … />. */}
            <div className="schedule__media" role="img" aria-label="Imagen de Kaizen Studios (por agregar)">
              <div className="schedule__media-ph">
                <span className="ring"><Camera size={24} /></span>
                <small>Imagen · por agregar</small>
              </div>
            </div>
          </div>

          {/* ── derecha: formulario de pre-calificación ── */}
          <div className="qualify-card">
            <h3 className="qualify-card__title">Reserva tu plaza</h3>
            <p className="qualify-card__sub">
              No trabajamos con todo el mundo, y eso es bueno para ti. Cuéntanos de tu proyecto y, si encajamos, te
              mostramos el calendario al instante.
            </p>

            <form className="qualify-form" onSubmit={onSubmit}>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="f-name">Nombre</label>
                  <input id="f-name" required value={form.name} onChange={set('name')} placeholder="Tu nombre" autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="f-email">Correo corporativo</label>
                  <input id="f-email" type="email" required value={form.email} onChange={set('email')} placeholder="tu@empresa.com" autoComplete="email" />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="f-company">Empresa / Marca</label>
                  <input id="f-company" required value={form.company} onChange={set('company')} placeholder="Nombre de tu marca" autoComplete="organization" />
                </div>
                <div className="field">
                  <label htmlFor="f-site">Sitio web o Instagram</label>
                  <input id="f-site" value={form.site} onChange={set('site')} placeholder="@tumarca o tusitio.com" />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="f-role">Tu rol</label>
                  <select id="f-role" value={form.role} onChange={set('role')}>
                    {ROLES.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="f-decision">¿Quién aprueba la decisión final?</label>
                  <select id="f-decision" value={form.decision} onChange={set('decision')}>
                    {DECISIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="f-need">¿Qué necesitas?</label>
                <select id="f-need" value={form.need} onChange={set('need')}>
                  {NEEDS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="f-budget">Presupuesto estimado</label>
                  <select id="f-budget" value={form.budget} onChange={set('budget')}>
                    {BUDGETS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="f-timeline">¿Para cuándo?</label>
                  <select id="f-timeline" value={form.timeline} onChange={set('timeline')}>
                    {TIMELINES.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="f-mindset">Para ti, el contenido de calidad es…</label>
                <select id="f-mindset" value={form.mindset} onChange={set('mindset')}>
                  {MINDSETS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>

              <div className="field">
                <label htmlFor="f-goal">¿Cuál es tu objetivo? (opcional)</label>
                <textarea id="f-goal" value={form.goal} onChange={set('goal')} placeholder="Qué quieres lograr con tu contenido…" />
              </div>

              {/* El resultado (semáforo) se muestra en el popup, no aquí. */}
              {status && !open && (
                <button type="button" className="btn-ghost" style={{ justifyContent: 'center' }} onClick={() => setOpen(true)}>
                  Ver mi resultado de nuevo <ArrowRight size={16} />
                </button>
              )}
              <button type="submit" className="btn-gold" style={{ justifyContent: 'center' }}>
                Ver horarios disponibles <ArrowRight size={16} />
              </button>
              <p className="form-note">Tus datos solo se usan para preparar la llamada. No spam.</p>
            </form>
          </div>
        </div>
      </div>

      {/* ── popup de resultado: 🟢 calendario · 🟡/🔴 imagen + mensaje ── */}
      {open && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Resultado de tu solicitud" onClick={() => setOpen(false)}>
          <div className={`modal${status === 'green' ? '' : ' modal--result'}`} onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setOpen(false)} aria-label="Cerrar">✕</button>

            {status === 'green' ? (
              <>
                <div className="modal__head">
                  <span className="mono">Agenda · llamada de cierre</span>
                  <p>{MSG.green.title}</p>
                  <p className="modal__sub">{MSG.green.body}</p>
                </div>
                {CALENDLY_URL ? (
                  <div className="calendly-card">
                    <InlineWidget
                      url={CALENDLY_URL}
                      {...(prefill ? { prefill } : {})}
                      styles={{ height: '640px' }}
                      pageSettings={{
                        backgroundColor: '131311',
                        primaryColor: 'c8a45a',
                        textColor: 'eae6da',
                        hideEventTypeDetails: true,
                        hideGdprBanner: true,
                        hideLandingPageDetails: false,
                      }}
                    />
                  </div>
                ) : (
                  <div className="calendly-fallback">
                    <span className="mono">Agenda · por conectar</span>
                    <a className="btn-gold" href={`mailto:${CONTACT.email}`}>
                      <Mail size={16} /> Escríbenos al correo
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="modal__result">
                {/* Imagen del popup (estilo dorado 3D). Cuando esté el archivo:
                    reemplaza el placeholder por <img src="/img/agenda-popup.png" alt="" /> */}
                <div className="modal__result-media" role="img" aria-label="Kaizen Studios">
                  <div className="modal__result-ph">
                    <span className="ring"><Camera size={26} /></span>
                    <small>Imagen · por agregar</small>
                  </div>
                </div>
                <div className="modal__result-text">
                  <strong>{(status === 'red' ? MSG.red : MSG.yellow).title}</strong>
                  <p>{(status === 'red' ? MSG.red : MSG.yellow).body}</p>
                  <a className="btn-ghost" href={`mailto:${CONTACT.email}`} style={{ width: 'fit-content' }}>
                    <Mail size={16} /> {CONTACT.email}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
