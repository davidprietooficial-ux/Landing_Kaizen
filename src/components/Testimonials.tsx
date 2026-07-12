'use client'

import { useEffect, useRef, useState } from 'react'
import { TESTIMONIALS, TESTIMONIALS_BADGE } from '@/lib/config'
import { ChevronLeft, ChevronRight, Star } from './Icons'

const N = TESTIMONIALS.length
// Triplicado: el carrusel vive en la copia del medio y salta sin animación al
// pasarse de los bordes → efecto de scroll infinito en ambas direcciones.
const LOOP = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]
const GAP = 24 // debe coincidir con el gap del track en CSS

export default function Testimonials() {
  const [idx, setIdx] = useState(N)
  const [anim, setAnim] = useState(false)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)

  // Mide ancho de card + gap (cambia con el viewport).
  useEffect(() => {
    const measure = () => {
      const first = trackRef.current?.children[0] as HTMLElement | undefined
      if (first) setStep(first.offsetWidth + GAP)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Habilita la transición después del primer posicionamiento (sin animar la carga).
  useEffect(() => {
    if (step === 0 || anim) return
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)))
    return () => cancelAnimationFrame(raf)
  }, [step, anim])

  // Autoplay cada 3s; se pausa con el mouse encima.
  useEffect(() => {
    if (paused) return
    const t = window.setInterval(() => setIdx((i) => i + 1), 3000)
    return () => window.clearInterval(t)
  }, [paused])

  // Fuera de la copia del medio → espera a que termine la transición (0.8s) y salta.
  useEffect(() => {
    if (idx >= N && idx < 2 * N) return
    const t = window.setTimeout(() => {
      setAnim(false)
      setIdx((i) => (i >= 2 * N ? i - N : i + N))
    }, 820)
    return () => window.clearTimeout(t)
  }, [idx])

  return (
    <section
      id="testimonios"
      className="section tstm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container">
        <div className="tstm__head">
          <div>
            <span className="eyebrow">Testimonios</span>
            <h2 className="tstm__title">
              Lo que dicen nuestros <em>clientes</em>
            </h2>
          </div>
          <div className="tstm__badge" aria-label={`Valoración ${TESTIMONIALS_BADGE.label}`}>
            <span className="tstm__stars" aria-hidden="true">
              {Array.from({ length: TESTIMONIALS_BADGE.stars }, (_, i) => (
                <Star key={i} size={20} />
              ))}
            </span>
            <span className="mono">{TESTIMONIALS_BADGE.label}</span>
          </div>
        </div>
      </div>

      <div className="tstm__viewport">
        <div
          ref={trackRef}
          className="tstm__track"
          style={{
            transform: `translateX(${-idx * step}px)`,
            transition: anim ? 'transform .8s cubic-bezier(.4, 0, .2, 1)' : 'none',
          }}
        >
          {LOOP.map((t, i) => (
            <figure className={`t-card${i < idx ? ' is-out' : ''}`} key={`${t.name}-${i}`} aria-hidden={i < N || i >= 2 * N || undefined}>
              <svg className="t-card__quote" width="30" height="24" viewBox="0 0 30 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M0 24V12.4C0 5.4 4.4 1 11.2 0l1.2 3C7.9 4.5 5.7 7 5.5 10H12v14H0Zm18 0V12.4C18 5.4 22.4 1 29.2 0l1.2 3c-4.5 1.5-6.7 4-6.9 7H30v14H18Z"
                />
              </svg>
              <blockquote>{t.quote}</blockquote>
              <figcaption className="t-card__author">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.photo} alt="" loading="lazy" width={48} height={48} />
                <div>
                  <strong>{t.name}</strong>
                  <span>→ {t.role}, {t.company}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="container tstm__nav">
        <button type="button" onClick={() => setIdx((i) => i - 1)} aria-label="Testimonio anterior">
          <ChevronLeft size={20} />
        </button>
        <button type="button" onClick={() => setIdx((i) => i + 1)} aria-label="Testimonio siguiente">
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  )
}
