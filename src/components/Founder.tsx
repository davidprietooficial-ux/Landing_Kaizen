'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ASSETS, DAVID_LINKS, TEAM } from '@/lib/config'
import { Camera, Instagram, Linkedin, Youtube, ArrowRight } from './Icons'

gsap.registerPlugin(ScrollTrigger)

// Links de marca personal de David (orden: YouTube → Instagram → LinkedIn)
const LINKS = [
  { key: 'youtube', label: 'YouTube', Icon: Youtube, href: DAVID_LINKS.youtube },
  { key: 'instagram', label: 'Instagram', Icon: Instagram, href: DAVID_LINKS.instagram },
  { key: 'linkedin', label: 'LinkedIn', Icon: Linkedin, href: DAVID_LINKS.linkedin },
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
        <div className="founder__photo">
          <div className="founder__mask">
            {ASSETS.hasDavidPhoto ? (
              <Image src="/img/david-retrato.jpg" alt="David Seiko, fundador de Kaizen Studios" fill sizes="(max-width: 860px) 100vw, 40vw" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="photo-ph">
                <span className="ring"><Camera size={26} /></span>
                <small>Foto de David · por agregar</small>
              </div>
            )}
          </div>
        </div>

        <div className="founder__body">
          <span className="eyebrow founder__reveal">Quién está detrás de esto</span>
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

          <p className="founder__reveal">
            El mercado audiovisual se está saturando de contenido vacío: piezas sin estética, sin lenguaje, sin alma —
            videos hechos solo por llenar el feed. En Kaizen creemos lo contrario: cada pieza tiene que transmitir una
            emoción y contar una historia. No marketing vacío, sino contenido con corazón, que conecta y que se queda.
          </p>
          <p className="founder__reveal">
            Y esto no es un freelance. Kaizen Studios es un estudio serio: un equipo de profesionales que sostiene cada
            proyecto de principio a fin, con procesos y estándar propios. David Seiko dirige y pone la cara por cada
            entrega, pero detrás hay un equipo audiovisual que garantiza la misma calidad de cine, siempre.
          </p>
          <p className="founder__reveal">
            Su obsesión por el detalle y por los procesos es lo que convierte una grabación en un sistema de contenido
            que trabaja para tu marca con el tiempo — no una vez, sino semana tras semana.
          </p>

          {TEAM.length > 0 && (
            <div className="team founder__reveal">
              <span className="mono team__kicker">El equipo detrás</span>
              <div className="team__row">
                {TEAM.map((m) => (
                  <div className="team__member" key={m.role}>
                    <span className="team__avatar">
                      {m.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.photo} alt={m.name} />
                      ) : (
                        <Camera size={18} />
                      )}
                    </span>
                    <div className="team__info">
                      <strong>{m.name}</strong>
                      <small>{m.role}</small>
                    </div>
                    {m.social ? (
                      <a className="team__social" href={m.social} target="_blank" rel="noopener noreferrer" aria-label={`Red social de ${m.name}`}>
                        <Instagram size={15} />
                      </a>
                    ) : (
                      <span className="team__social team__social--empty" title="Red social · por agregar" aria-hidden="true">
                        <Instagram size={15} />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
