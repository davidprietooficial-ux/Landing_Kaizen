'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { scrollToId } from '@/lib/scroll'
import { ChevronDown } from './Icons'
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
            <source src="/video/SHOWREEL.webm" type="video/webm" />
            <source src="/video/SHOWREEL.mp4" type="video/mp4" />
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
          <span className="lt">Una grabación.</span>
          <span className="lt">Un sistema de contenido.</span>
        </h1>
        <p className="hero__desc hero-anim">{SITE.description}</p>
      </div>

      <button className="hero__cue" onClick={() => scrollToId('quienes')} aria-label="¿Quiénes somos? Bajar a la siguiente sección">
        ¿Quiénes somos?
        <span className="chev" aria-hidden="true">
          <ChevronDown size={18} />
        </span>
      </button>
    </section>
  )
}
