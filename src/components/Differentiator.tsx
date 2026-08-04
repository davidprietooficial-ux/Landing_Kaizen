'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ASSETS, DIFFERENTIATOR as DIFF_ES, CONVERSION_POINTS as POINTS_ES } from '@/lib/config'
import { DIFFERENTIATOR as DIFF_EN, CONVERSION_POINTS as POINTS_EN } from '@/lib/config.en'
import type { Locale } from '@/lib/locale'
import LazyVideo from './LazyVideo'
import { Layers, Sparkle, Target } from './Icons'

const CONVERSION_ICONS = [Target, Layers, Sparkle]

const COPY = {
  es: { reelAria: 'Reel de producción audiovisual de Kaizen Studios', conversionEyebrow: 'Diseñado para convertir' },
  en: { reelAria: 'Kaizen Studios video production reel', conversionEyebrow: 'Designed to convert' },
}

gsap.registerPlugin(ScrollTrigger)

export default function Differentiator({ locale = 'es' }: { locale?: Locale }) {
  const root = useRef<HTMLElement>(null)
  const t = COPY[locale]
  const DIFFERENTIATOR = locale === 'en' ? DIFF_EN : DIFF_ES
  const CONVERSION_POINTS = locale === 'en' ? POINTS_EN : POINTS_ES

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return
      gsap.from('.diff__text > *', {
        opacity: 0, y: 18, duration: 0.8, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: root.current!, start: 'top 78%' },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="identifica" className="section diff">
      <div className="container diff__grid">
        <div className="diff__text">
          <span className="eyebrow">{DIFFERENTIATOR.eyebrow}</span>
          <h2 style={{ marginTop: '1rem', fontSize: 'clamp(1.7rem,3.2vw,2.5rem)' }}>{DIFFERENTIATOR.title}</h2>
          <p className="lead" style={{ marginTop: '1rem' }}>{DIFFERENTIATOR.text}</p>
        </div>
        <div className="diff__media">
          {ASSETS.hasShowreel ? (
            <LazyVideo aria-label={t.reelAria}>
              <source src="/video/SHOWREEL.webm" type="video/webm" />
              <source src="/video/SHOWREEL.mp4" type="video/mp4" />
            </LazyVideo>
          ) : (
            <div className="diff__media-ph" />
          )}
        </div>
      </div>

      {/* Segundo bloque: no es solo audiovisual — el sitio entero está pensado
          para convertir (copy persuasivo, estructura y estética con criterio). */}
      <div className="container diff__conversion">
        <span className="eyebrow">{t.conversionEyebrow}</span>
        <ul className="value-list" style={{ listStyle: 'none', marginTop: '1.4rem' }}>
          {CONVERSION_POINTS.map(({ title, text }, i) => {
            const Icon = CONVERSION_ICONS[i]
            return (
              <li className="value-item" key={title}>
                <span className="ic"><Icon size={20} /></span>
                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
