'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ASSETS, DAVID_LINKS, TEAM } from '@/lib/config'
import { Camera, Instagram, /* Linkedin, */ Youtube, ArrowRight } from './Icons'

gsap.registerPlugin(ScrollTrigger)

// Links de marca personal de David (orden: YouTube → Instagram → LinkedIn)
const LINKS = [
  { key: 'youtube', label: 'YouTube', Icon: Youtube, href: DAVID_LINKS.youtube },
  { key: 'instagram', label: 'Instagram', Icon: Instagram, href: DAVID_LINKS.instagram },
  // --- LinkedIn oculto temporalmente (descomenta para reactivar) ---
  // { key: 'linkedin', label: 'LinkedIn', Icon: Linkedin, href: DAVID_LINKS.linkedin },
]

export default function Founder() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      const photo = root.current!.querySelector<HTMLElement>('.founder__photo')
      if (photo) {
        gsap.from(photo, {
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: { trigger: photo, start: 'top 82%' },
        })
      }
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
        <span className="eyebrow founder__kicker--mobile">Quién está detrás de esto</span>
        <div className="founder__photo">
          <div className="founder__mask">
            {ASSETS.hasDavidPhoto ? (
              <Image src="/img/david-retrato.jpg" alt="David Seiko, fundador de Kaizen Studios" fill sizes="(max-width: 700px) 100vw, 40vw" style={{ objectFit: 'cover', objectPosition: 'center top' }} />
            ) : (
              <div className="photo-ph">
                <span className="ring"><Camera size={26} /></span>
                <small>Foto de David · por agregar</small>
              </div>
            )}
          </div>
        </div>

        <div className="founder__body">
          <span className="eyebrow founder__reveal founder__kicker--desktop">Quién está detrás de esto</span>
          <h2 className="founder__name founder__reveal">David Seiko</h2>
          <span className="founder__role founder__reveal">Fundador y director · Kaizen Studios</span>

          {/* Redes de David / del estudio, justo bajo el rol (separadas de las del equipo) */}
          <div className="founder__links founder__reveal">
            {LINKS.map(({ key, label, Icon, href }) =>
              href ? (
                <a className="chip" key={key} href={href} target="_blank" rel="noopener noreferrer">
                  <Icon size={16} /> {label}
                  <ArrowRight size={13} />
                </a>
              ) : (
                <span className="chip" key={key} aria-disabled="true" title="Por agregar">
                  <Icon size={16} /> {label}
                </span>
              ),
            )}
          </div>

          <p className="founder__reveal founder__p--full">
            Internet está lleno de webs que se ven iguales: plantillas genéricas, hechas por salir del paso, que no
            cuentan nada y no venden nada. En Kaizen creemos lo contrario: tu presencia digital tiene que transmitir
            quién eres y convertir — diseño con alma audiovisual, tecnología que funciona y tráfico que te pone frente
            a las personas correctas.
          </p>
          <p className="founder__reveal founder__p--full">
            Y esto no es un freelance. Kaizen Studios es un estudio serio: un equipo que sostiene cada proyecto de
            principio a fin, con procesos y estándar propios. David Seiko dirige y pone la cara por cada entrega, pero
            detrás hay un equipo creativo y técnico que garantiza el mismo nivel — del primer frame del video al último
            píxel de la web.
          </p>
          <p className="founder__reveal founder__p--full">
            Su obsesión por el detalle y por los procesos hoy corre por cada línea de código: webs construidas a medida
            — nada de plantillas — con la misma tecnología que usan las startups más exigentes del mundo: veloces,
            medibles y diseñadas para convertir. Del copy al código, cada decisión tiene un porqué: que tu web sea un
            sistema de ventas que trabaja para tu marca todos los días.
          </p>
          {/* Versión phone: un solo párrafo con lo esencial (los completos se ocultan por CSS) */}
          <p className="founder__reveal founder__p--mobile">
            Internet está lleno de webs plantilla que no venden nada. En Kaizen creemos lo contrario: diseño con alma
            audiovisual, tecnología y tráfico que convierten. David Seiko dirige y pone la cara por cada entrega, con
            un equipo creativo y técnico detrás — del primer frame del video al último píxel de la web.
          </p>

        </div>
      </div>

      {/* Equipo a ancho completo bajo la bio: 3 cards verticales (avatar → nombre → Instagram) */}
      {TEAM.length > 0 && (
        <div className="container team founder__team founder__reveal">
          <span className="mono team__kicker">El equipo detrás</span>
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
                </div>
                {m.social ? (
                  <a className="team__social" href={m.social} target="_blank" rel="noopener noreferrer" aria-label={`Instagram de ${m.name}`}>
                    <Instagram size={15} /> <span>Instagram</span>
                  </a>
                ) : (
                  <span className="team__social team__social--empty" title="Red social · por agregar" aria-hidden="true">
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
