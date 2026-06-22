'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Camera, Layers, Repeat, Sparkle } from './Icons'

gsap.registerPlugin(ScrollTrigger, SplitText)

const VALUES = [
  { Icon: Camera, title: 'Calidad de cine, no de feed', text: 'Dirección, cámara y luz de cine en cada pieza.' },
  { Icon: Layers, title: 'Una grabación, un mes de contenido', text: 'De una sesión, tu librería lista para publicar.' },
  { Icon: Repeat, title: 'Consistente, no “a veces”', text: 'El mismo proceso y estándar en cada entrega.' },
  { Icon: Sparkle, title: 'Un sistema, no un proveedor', text: 'Flujo ágil sin bajar calidad; el activo es tuyo.' },
]

export default function About() {
  const root = useRef<HTMLElement>(null)

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
    { scope: root },
  )

  return (
    <section ref={root} id="quienes" className="section">
      <div className="container about__grid">
        <div>
          <span className="eyebrow eyebrow--emoji">
            <span className="emoji" aria-hidden="true">🎬</span> Quiénes somos
          </span>

          <h2 className="about__title" style={{ fontSize: 'clamp(1.3rem,2.4vw,1.92rem)', overflow: 'hidden' }}>
            Deja de competir por precio. Empieza a competir por percepción.
          </h2>
          <div className="about__lead">
            <p className="lead about__p">
              Cada semana arranca igual: la presión de publicar algo, lo que sea, antes de que el feed se enfríe. Grabas
              suelto, a las carreras, y cada pieza se ve distinta a la anterior — y eso cuesta más de lo que crees:
              clientes que eligen al competidor porque «se ve más serio o profesional», precio que no puedes subir porque
              tu marca no proyecta valor y horas tuyas quemadas en contenido que no posiciona. Cada semana sin sistema es
              terreno que le regalas a alguien más. Ahora imagina lo opuesto: una sola sesión de grabación que llena tu
              calendario un mes entero, con cada pieza al nivel de un comercial, ordenada por canal y lista para
              publicar. No improvisas ni corres: cada pieza proyecta por fuera el nivel premium que tu negocio ya tiene
              por dentro. Por primera vez compites por percepción, no por precio.
            </p>
            <p className="lead about__p">
              Eso es exactamente lo que construimos en <b style={{ color: 'var(--text)', fontWeight: 500 }}>Kaizen
              Studios</b>: un estudio audiovisual colombiano con estándar internacional, dirigido por David Seiko, con
              más de 4 años en el audiovisual premium.
            </p>
          </div>
        </div>

        {/* columna derecha: cierre de identidad (foco + sistema) + tarjetas de valor (los 4 elementos) */}
        <div className="about__right">
          <p className="lead about__p about__p--ident">
            Trabajamos con marcas de distintos sectores siempre con el mismo foco: piezas de alta calidad con
            storytelling que conecta. Grabamos una vez y de esa misma sesión sale tu sistema de contenido completo
            —calidad de cine real, cada formato y cada canal con la misma firma—. No somos un proveedor que te entrega un
            video y desaparece: somos el sistema que mantiene tu marca premium, semana tras semana.
          </p>

          <ul className="value-list" style={{ listStyle: 'none' }}>
            {VALUES.map(({ Icon, title, text }) => (
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
          <video autoPlay muted loop playsInline preload="metadata" aria-label="Kaizen Studios en acción">
            <source src="/video/about.webm" type="video/webm" />
            <source src="/video/about.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  )
}
