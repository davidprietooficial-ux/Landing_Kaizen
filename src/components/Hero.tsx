'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { scrollToId } from '@/lib/scroll'
import { ArrowRight, ChevronDown } from './Icons'
import { SITE as SITE_ES, ASSETS } from '@/lib/config'
import { SITE as SITE_EN } from '@/lib/config.en'
import type { Locale } from '@/lib/locale'

const COPY = {
  es: {
    sectionAria: 'Inicio',
    title: ['Sin sistema completo,', 'pierdes clientes.'],
    cta: 'Agenda tu Llamada Gratis',
    ctaShort: 'Llamada Gratis',
    work: 'Ver nuestro trabajo',
    cueAria: 'Bajar a la siguiente sección',
  },
  en: {
    sectionAria: 'Home',
    title: ['Without a complete system,', "you're losing clients."],
    cta: 'Book Your Free Call',
    ctaShort: 'Free Call',
    work: 'See our work',
    cueAria: 'Scroll to the next section',
  },
}

export default function Hero({ locale = 'es' }: { locale?: Locale }) {
  const root = useRef<HTMLElement>(null)
  const t = COPY[locale]
  const SITE = locale === 'en' ? SITE_EN : SITE_ES

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
    <section ref={root} id="top" className="hero" aria-label={t.sectionAria}>
      {/* React lo eleva al <head>: el póster (elemento LCP) empieza a bajar de inmediato */}
      <link rel="preload" as="image" href="/video/hero-poster.webp" fetchPriority="high" />
      <div className="hero__media">
        {ASSETS.hasShowreel ? (
          // poster: LCP instantáneo mientras descarga el video
          <video autoPlay muted loop playsInline preload="auto" poster="/video/hero-poster.webp">
            <source src="/video/new-background.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="hero__fallback" />
        )}
        <div className="hero__glow" />
        <div className="hero__overlay" />
      </div>

      <div className="hero__content">
        <div className="lz-logo hero-anim" aria-label="Kaizen">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lz-logo__mark" src="/logo/logo-kaizen.png" alt="" width={212} height={212} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lz-logo__reflejo" src="/logo/logo-kaizen.png" alt="" aria-hidden width={212} height={212} />
        </div>
        <span className="mono hero-anim">{SITE.name}</span>
        <h1 className="hero__title hero-anim">
          <span className="lt">{t.title[0]}</span>
          <span className="lt">{t.title[1]}</span>
        </h1>
        <p className="hero__desc hero-anim">
          <span className="hero__desc--full">{SITE.description}</span>
          <span className="hero__desc--short">{SITE.descriptionMobile}</span>
        </p>

        <div className="hero__actions hero-anim">
          <button className="btn-gold" onClick={() => scrollToId('agendar')}>
            <span className="btn-gold__full">{t.cta}</span>
            <span className="btn-gold__short">{t.ctaShort}</span>
            <ArrowRight size={16} />
          </button>
          <button className="btn-gold btn-gold--outline" onClick={() => scrollToId('trabajo')}>
            {t.work}
          </button>
        </div>
      </div>

      <button className="hero__cue" onClick={() => scrollToId('trabajo')} aria-label={t.cueAria}>
        <span className="chev" aria-hidden="true">
          <ChevronDown size={18} />
        </span>
      </button>
    </section>
  )
}
