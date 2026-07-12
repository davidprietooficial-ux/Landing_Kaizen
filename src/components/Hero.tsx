'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { scrollToId } from '@/lib/scroll'
import { ArrowRight, ChevronDown } from './Icons'
import { SITE, ASSETS } from '@/lib/config'

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return
      gsap.from('.hero-anim', {
        y: 26,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.15,
      })
      gsap.from('.hero__cue', { opacity: 0, duration: 1, delay: 1.1 })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="hero" aria-label="Inicio">
      <div className="hero__media">
        {ASSETS.hasShowreel ? (
          <video autoPlay muted loop playsInline preload="auto">
            <source src="/video/new-background.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="hero__fallback" />
        )}
        <div className="hero__glow" />
        <div className="hero__overlay" />
      </div>

      <div className="hero__content">
        <span className="mono hero-anim">{SITE.name}</span>
        <h1 className="hero__title hero-anim">
          <span className="lt">Webs que venden.</span>
          <span className="lt">Tráfico que convierte.</span>
        </h1>
        <p className="hero__desc hero-anim">
          <span className="hero__desc--full">{SITE.description}</span>
          <span className="hero__desc--short">{SITE.descriptionMobile}</span>
        </p>

        <div className="hero__actions hero-anim">
          <button className="btn-gold" onClick={() => scrollToId('agendar')}>
            <span className="btn-gold__full">Agenda tu Llamada Gratis</span>
            <span className="btn-gold__short">Llamada Gratis</span>
            <ArrowRight size={16} />
          </button>
          <button className="btn-gold btn-gold--outline" onClick={() => scrollToId('trabajo')}>
            Ver nuestro trabajo
          </button>
        </div>
      </div>

      <button className="hero__cue" onClick={() => scrollToId('trabajo')} aria-label="Bajar a la siguiente sección">
        <span className="chev" aria-hidden="true">
          <ChevronDown size={18} />
        </span>
      </button>
    </section>
  )
}
