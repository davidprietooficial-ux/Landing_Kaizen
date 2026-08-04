'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ASSETS, DAVID_LINKS, TEAM as TEAM_ES } from '@/lib/config'
import { TEAM as TEAM_EN } from '@/lib/config.en'
import type { Locale } from '@/lib/locale'
import { Camera, Instagram, /* Linkedin, */ Youtube, ArrowRight } from './Icons'

gsap.registerPlugin(ScrollTrigger)

// Links de marca personal de David (orden: YouTube → Instagram → LinkedIn)
const LINKS = [
  { key: 'youtube', label: 'YouTube', Icon: Youtube, href: DAVID_LINKS.youtube },
  { key: 'instagram', label: 'Instagram', Icon: Instagram, href: DAVID_LINKS.instagram },
  // --- LinkedIn oculto temporalmente (descomenta para reactivar) ---
  // { key: 'linkedin', label: 'LinkedIn', Icon: Linkedin, href: DAVID_LINKS.linkedin },
]

const COPY = {
  es: {
    kicker: 'Quién está detrás de esto',
    name: 'David Seiko',
    role: 'Fundador y director · Kaizen Studios',
    photoAlt: 'David Seiko, fundador de Kaizen Studios',
    photoMissing: 'Foto de David · por agregar',
    socialMissing: 'Por agregar',
    teamKicker: 'El equipo detrás',
    instagramAria: (name: string) => `Instagram de ${name}`,
    socialTitle: 'Red social · por agregar',
    paragraphsFull: [
      'Internet está lleno de webs que se ven iguales: plantillas genéricas, hechas por salir del paso, que no cuentan nada y no venden nada. En Kaizen creemos lo contrario: tu presencia digital tiene que transmitir quién eres y convertir — diseño con alma audiovisual, tecnología que funciona y tráfico que te pone frente a las personas correctas.',
      'Y esto no es un freelance. Kaizen Studios es un estudio serio: un equipo que sostiene cada proyecto de principio a fin, con procesos y estándar propios. David Seiko dirige y pone la cara por cada entrega, pero detrás hay un equipo creativo y técnico que garantiza el mismo nivel — del primer frame del video al último píxel de la web.',
      'Su obsesión por el detalle y por los procesos hoy corre por cada línea de código: webs construidas a medida — nada de plantillas — con la misma tecnología que usan las startups más exigentes del mundo: veloces, medibles y diseñadas para convertir. Del copy al código, cada decisión tiene un porqué: que tu web sea un sistema de ventas que trabaja para tu marca todos los días.',
    ],
    paragraphMobile: 'Internet está lleno de webs plantilla que no venden nada. En Kaizen creemos lo contrario: diseño con alma audiovisual, tecnología y tráfico que convierten. David Seiko dirige y pone la cara por cada entrega, con un equipo creativo y técnico detrás — del primer frame del video al último píxel de la web.',
  },
  en: {
    kicker: "Who's behind this",
    name: 'David Seiko',
    role: 'Founder & Director · Kaizen Studios',
    photoAlt: 'David Seiko, founder of Kaizen Studios',
    photoMissing: "David's photo · coming soon",
    socialMissing: 'Coming soon',
    teamKicker: 'The team behind it',
    instagramAria: (name: string) => `${name}'s Instagram`,
    socialTitle: 'Social link · coming soon',
    paragraphsFull: [
      "The internet is full of websites that all look the same: generic templates, built to check a box, that say nothing and sell nothing. At Kaizen we believe the opposite: your digital presence has to convey who you are and convert — design with a video-first soul, technology that works, and traffic that puts you in front of the right people.",
      "And this isn't a freelancer. Kaizen Studios is a real studio: a team that carries every project from start to finish, with its own processes and standard. David Seiko directs and puts his name behind every delivery, but there's a creative and technical team behind him guaranteeing the same level — from the first frame of video to the last pixel of the website.",
      "His obsession with detail and process now runs through every line of code: custom-built websites — no templates — using the same technology the world's most demanding startups use: fast, measurable, and designed to convert. From the copy to the code, every decision has a reason: making your website a sales system that works for your brand every single day.",
    ],
    paragraphMobile: "The internet is full of template websites that sell nothing. At Kaizen we believe the opposite: design with a video-first soul, technology, and traffic that convert. David Seiko directs and puts his name behind every delivery, with a creative and technical team behind him — from the first frame of video to the last pixel of the website.",
  },
}

export default function Founder({ locale = 'es' }: { locale?: Locale }) {
  const root = useRef<HTMLElement>(null)
  const t = COPY[locale]
  const TEAM = locale === 'en' ? TEAM_EN : TEAM_ES

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      gsap.to('.founder__mask', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: root.current!, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.from('.founder__reveal', {
        opacity: 0,
        y: 22,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.founder__body', start: 'top 82%' },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="david" className="section">
      <div className="container founder__grid">
        {/* En phone el kicker va ANTES de la foto (en desktop se oculta y se usa el del body) */}
        <span className="eyebrow founder__kicker--mobile">{t.kicker}</span>
        <div className="founder__photo reveal">
          <div className="founder__mask">
            {ASSETS.hasDavidPhoto ? (
              // Img plana (no next/image): el optimizador de imágenes en este entorno
              // sirve mal este archivo — ver nota en ASSETS.hasDavidPhoto en config.ts.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/img/david-retrato.jpg"
                alt={t.photoAlt}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
            ) : (
              <div className="photo-ph">
                <span className="ring"><Camera size={26} /></span>
                <small>{t.photoMissing}</small>
              </div>
            )}
          </div>
        </div>

        <div className="founder__body">
          <span className="eyebrow founder__reveal founder__kicker--desktop">{t.kicker}</span>
          <h2 className="founder__name founder__reveal">{t.name}</h2>
          <span className="founder__role founder__reveal">{t.role}</span>

          {/* Redes de David / del estudio, justo bajo el rol (separadas de las del equipo) */}
          <div className="founder__links founder__reveal">
            {LINKS.map(({ key, label, Icon, href }) =>
              href ? (
                <a className="chip" key={key} href={href} target="_blank" rel="noopener noreferrer">
                  <Icon size={16} /> {label}
                  <ArrowRight size={13} />
                </a>
              ) : (
                <span className="chip" key={key} aria-disabled="true" title={t.socialMissing}>
                  <Icon size={16} /> {label}
                </span>
              ),
            )}
          </div>

          {t.paragraphsFull.map((p, i) => (
            <p className="founder__reveal founder__p--full" key={i}>{p}</p>
          ))}
          {/* Versión phone: un solo párrafo con lo esencial (los completos se ocultan por CSS) */}
          <p className="founder__reveal founder__p--mobile">{t.paragraphMobile}</p>
        </div>
      </div>

      {/* Equipo a ancho completo bajo la bio: 3 cards verticales (avatar → nombre → Instagram) */}
      {TEAM.length > 0 && (
        <div className="container team founder__team founder__reveal">
          <span className="mono team__kicker">{t.teamKicker}</span>
          <div className="team__row">
            {TEAM.map((m) => (
              <div className="team__member" key={m.name}>
                <span className="team__avatar">
                  {m.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo} alt={m.name} style={m.pos ? { objectPosition: m.pos } : undefined} />
                  ) : (
                    <Camera size={18} />
                  )}
                </span>
                <div className="team__info">
                  <strong>{m.name}</strong>
                  <small>{m.role}</small>
                  {m.bio && <p style={{ color: 'var(--muted)', fontSize: '.82rem', lineHeight: 1.5, marginTop: 6 }}>{m.bio}</p>}
                </div>
                {m.social ? (
                  <a className="team__social" href={m.social} target="_blank" rel="noopener noreferrer" aria-label={t.instagramAria(m.name)}>
                    <Instagram size={15} /> <span>Instagram</span>
                  </a>
                ) : (
                  <span className="team__social team__social--empty" title={t.socialTitle} aria-hidden="true">
                    <Instagram size={15} /> <span>Instagram</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
