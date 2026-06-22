'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { METRICS, CLIENTS } from '@/lib/config'
import { Film, Send, Grid, Repeat, Clock, Check } from './Icons'

gsap.registerPlugin(ScrollTrigger)

const GUARANTEES = [
  { Icon: Film, b: 'Activo audiovisual con calidad de cine', rest: ' — color, audio pro y todos los formatos.' },
  { Icon: Send, b: 'Kit de distribución', rest: ' — piezas por canal + guía de publicación.' },
  { Icon: Grid, b: 'Formatos nativos por plataforma', rest: ' — vertical, horizontal y cuadrado.' },
  { Icon: Repeat, b: 'Consistencia visual de marca', rest: ' en cada pieza, en el tiempo.' },
  { Icon: Clock, b: 'Tiempos de entrega ágiles', rest: ' para este nivel de producción.' },
  { Icon: Check, b: 'Dos rondas de ajustes', rest: ' incluidas.' },
]

export default function WhyUs() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const nums = gsap.utils.toArray<HTMLElement>('.metric__num[data-to]')

      nums.forEach((el) => {
        const to = Number(el.dataset.to)
        if (reduce) {
          el.textContent = String(to)
          return
        }
        const obj = { v: 0 }
        gsap.to(obj, {
          v: to,
          duration: 1.6,
          ease: 'power2.out',
          snap: { v: 1 },
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v))
          },
        })
      })
    },
    { scope: root },
  )

  const hasClients = CLIENTS.length > 0

  return (
    <section ref={root} id="por-que" className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Por qué elegirnos</span>
          <h2>Autoridad que se nota en cada entrega.</h2>
        </div>

        <div className="metrics" style={{ marginTop: 48 }}>
          {METRICS.map((m) => (
            <div className="metric" key={m.label}>
              {m.value === null ? (
                <>
                  <div className="metric__value">
                    —<span className="metric__todo">por confirmar</span>
                  </div>
                </>
              ) : (
                <div className="metric__value">
                  <span className="metric__num" data-to={m.value}>
                    0
                  </span>
                  {m.suffix && <span className="suffix">{m.suffix}</span>}
                </div>
              )}
              <div className="metric__label">{m.label}</div>
            </div>
          ))}
        </div>

        {hasClients && (
          <div className="clients" aria-label="Clientes con los que hemos trabajado">
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

        <p className="mono reveal" style={{ marginBottom: 18 }}>
          Garantías · lo que SÍ controlamos
        </p>
        <div className="guarantees">
          {GUARANTEES.map((g) => (
            <div className="guarantee reveal" key={g.b}>
              <span className="ic"><g.Icon size={20} /></span>
              <span>
                <b>{g.b}</b>
                {g.rest}
              </span>
            </div>
          ))}
        </div>

        <div className="why__closing reveal">
          Cuando una pieza pega, replicamos el proceso idéntico, con la misma calidad. Por eso lo sistematizamos: para
          movernos rápido sin perder el estándar. Tu marca se ve premium <em>SIEMPRE</em>.
        </div>
      </div>
    </section>
  )
}
