'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Camera, Layers, Repeat, Sparkle } from './Icons'
import LazyVideo from './LazyVideo'
import type { Locale } from '@/lib/locale'

gsap.registerPlugin(ScrollTrigger, SplitText)

const COPY = {
  es: {
    eyebrow: 'Quiénes somos',
    title: 'Tu web no es una tarjeta de presentación. Es tu vendedor más importante.',
    leadFull: [
      'Inviertes en redes, en pauta, en contenido… y cuando alguien por fin se interesa, aterriza ¿dónde? ¿En un perfil de Instagram? ¿En una web plantilla que se ve igual a mil? Ahí se pierde la venta. El problema no es tu producto — es que tu presencia digital no está diseñada para vender, y tu negocio depende de un algoritmo que no controlas. Ahora imagina lo opuesto: un activo tuyo — una landing page con nivel audiovisual de cine, que carga rápido, cuenta tu historia en segundos y convierte visitas en llamadas — y detrás, tráfico llegando todos los días. No cuando el algoritmo quiera: cuando tú lo decidas.',
    ],
    leadBrand: (
      <>
        Eso es exactamente lo que construimos en <b style={{ color: 'var(--text)', fontWeight: 500 }}>Kaizen Studios</b>: un
        estudio creativo y tecnológico dirigido por David Seiko, que une diseño, audiovisual y tráfico para convertir
        tu presencia digital en un canal de ventas.
      </>
    ),
    leadMobile: (
      <>
        Inviertes en redes y en pauta, pero la venta se pierde en una web que no está diseñada para vender. En{' '}
        <b style={{ color: 'var(--text)', fontWeight: 500 }}>Kaizen Studios</b> unimos diseño web, audiovisual y
        tráfico en un solo sistema: landing pages con nivel de cine y tráfico que tú controlas — un activo tuyo que
        convierte visitas en llamadas, 24/7.
      </>
    ),
    identity: 'Unimos lo que normalmente contratas por separado —diseño web, producción audiovisual y tráfico— en un solo sistema con una sola firma. Venimos del audiovisual premium, con más de 4 años produciendo con estándar de cine, y llevamos ese estándar al lugar donde hoy se decide la venta: tu web. No somos una agencia que entrega y desaparece: somos el equipo que mantiene tu máquina de ventas funcionando, semana tras semana.',
    values: [
      { Icon: Camera, title: 'Enfoque audiovisual', text: 'Video y motion de nivel de cine integrados en tu web.' },
      { Icon: Layers, title: 'Diseñadas para convertir', text: 'Cada sección empuja al visitante hacia la acción.' },
      { Icon: Repeat, title: 'Tráfico que tú controlas', text: 'Pauta que llena tu agenda, no tu feed.' },
      { Icon: Sparkle, title: 'Vende mientras duermes', text: 'Tu web trabaja 24/7: capta, califica y agenda por ti.' },
    ],
    mediaAria: 'Kaizen Studios en acción',
  },
  en: {
    eyebrow: 'About us',
    title: "Your website isn't a business card. It's your most important salesperson.",
    leadFull: [
      "You invest in social media, in ads, in content… and when someone finally shows interest, where do they land? On an Instagram profile? On a template website that looks like a thousand others? That's where the sale is lost. The problem isn't your product — it's that your digital presence wasn't designed to sell, and your business depends on an algorithm you don't control. Now picture the opposite: an asset that's yours — a landing page with a cinematic level of production, that loads fast, tells your story in seconds, and turns visits into calls — with traffic arriving every day behind it. Not whenever the algorithm feels like it: whenever you decide.",
    ],
    leadBrand: (
      <>
        This is exactly what we build at <b style={{ color: 'var(--text)', fontWeight: 500 }}>Kaizen Studios</b>: a
        creative and technical studio led by David Seiko, bringing together design, video production, and traffic to
        turn your digital presence into a sales channel.
      </>
    ),
    leadMobile: (
      <>
        You invest in social media and ads, but the sale gets lost on a website that was not built to sell. At{' '}
        <b style={{ color: 'var(--text)', fontWeight: 500 }}>Kaizen Studios</b> we bring web design, video
        production, and traffic together into one system: cinematic landing pages and traffic you control — an asset
        of your own that turns visits into calls, 24/7.
      </>
    ),
    identity: "We combine what you'd normally hire separately —web design, video production, and traffic— into one system under one signature. We come from premium video production, with over 4 years shooting to a cinematic standard, and we bring that standard to where the sale gets decided today: your website. We're not an agency that delivers and disappears — we're the team that keeps your sales machine running, week after week.",
    values: [
      { Icon: Camera, title: 'Video-first approach', text: 'Cinematic-grade video and motion built into your site.' },
      { Icon: Layers, title: 'Designed to convert', text: 'Every section pushes the visitor toward action.' },
      { Icon: Repeat, title: 'Traffic you control', text: 'Ads that fill your calendar, not your feed.' },
      { Icon: Sparkle, title: 'Sells while you sleep', text: 'Your site works 24/7: it captures, qualifies, and books for you.' },
    ],
    mediaAria: 'Kaizen Studios in action',
  },
}

export default function About({ locale = 'es' }: { locale?: Locale }) {
  const root = useRef<HTMLElement>(null)
  const t = COPY[locale]

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      const title = root.current!.querySelector<HTMLElement>('.about__title')
      if (title) {
        const split = new SplitText(title, { type: 'lines', linesClass: 'split-line' })
        gsap.set(split.lines, { yPercent: 110 })
        gsap.to(split.lines, {
          yPercent: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.12,
          scrollTrigger: { trigger: title, start: 'top 82%' },
        })
      }

      gsap.from('.about__p', {
        opacity: 0,
        y: 18,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.about__lead', start: 'top 82%' },
      })

      // Solo opacidad (sin `y`): así ningún transform residual mueve las tarjetas
      // y los gaps quedan exactamente parejos aunque la animación se interrumpa.
      gsap.from('.value-item', {
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.value-list', start: 'top 84%' },
      })
    },
    { scope: root, dependencies: [locale] },
  )

  return (
    <section ref={root} id="quienes" className="section">
      <div className="container about__grid">
        <div>
          <span className="eyebrow eyebrow--emoji">
            <span className="emoji" aria-hidden="true">🚀</span> {t.eyebrow}
          </span>

          <h2 className="about__title" style={{ fontSize: 'clamp(1.3rem,2.4vw,1.92rem)', overflow: 'hidden' }}>
            {t.title}
          </h2>
          <div className="about__lead">
            {t.leadFull.map((p, i) => (
              <p className="lead about__p about__p--full" key={i}>{p}</p>
            ))}
            <p className="lead about__p about__p--full">{t.leadBrand}</p>
            {/* Versión phone: un solo párrafo con lo esencial (los completos se ocultan por CSS) */}
            <p className="lead about__p about__p--mobile">{t.leadMobile}</p>
          </div>
        </div>

        {/* columna derecha: cierre de identidad (foco + sistema) + tarjetas de valor (los 4 elementos) */}
        <div className="about__right">
          <p className="lead about__p about__p--ident">{t.identity}</p>

          <ul className="value-list" style={{ listStyle: 'none' }}>
            {t.values.map(({ Icon, title, text }) => (
              <li className="value-item" key={title}>
                <span className="ic"><Icon size={20} /></span>
                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Video full-width (ocupa ambas columnas, no afecta la composición de texto/ventajas). */}
        <div className="about__media">
          <LazyVideo aria-label={t.mediaAria}>
            <source src="/video/about.webm" type="video/webm" />
            <source src="/video/about.mp4" type="video/mp4" />
          </LazyVideo>
        </div>
      </div>
    </section>
  )
}
