'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ASSETS } from '@/lib/config'

gsap.registerPlugin(ScrollTrigger)

// Cada servicio tiene su escena visual (a la izquierda) y su texto (a la derecha).
// `art`: icono 3D real (se usa si ASSETS.hasStageArt = true); si no, cae al SVG line-art.
const STEPS = [
  { cap: 'Web', art: '/stages/06-web.webp', t: 'Desarrollo web', d: 'Landing pages a medida — nada de plantillas: veloces, medibles y diseñadas para convertir visitas en clientes.' },
  { cap: 'Audiovisual', art: '/stages/02-grabacion.webp', t: 'Producción audiovisual de calidad', d: 'Video con estándar de cine para tu web y tus canales: dirección, cámara y luz que elevan tu marca.' },
  { cap: 'Tráfico', art: '/stages/07-trafico.webp', t: 'Tráfico y pauta', d: 'Estrategia y campañas que ponen tu web frente a las personas correctas, todos los días.' },
]

/* ── Escenas (line-art dorado sobre el fondo oscuro) ── */

// 1 · Logística: dashboard + checklist + documento + calendario
function SceneLogistics() {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <rect x="26" y="40" width="112" height="84" rx="9" fill="#15140f" stroke="#c8a45a" strokeOpacity=".45" />
      <path d="M26 56h112" stroke="#c8a45a" strokeOpacity=".25" />
      <circle cx="38" cy="48" r="2.4" fill="#e8c97a" />
      <rect x="46" y="46" width="46" height="4" rx="2" fill="#eae6da" fillOpacity=".45" />
      <rect x="38" y="92" width="10" height="22" rx="2" fill="#c8a45a" fillOpacity=".4" />
      <rect x="53" y="80" width="10" height="34" rx="2" fill="#c8a45a" fillOpacity=".6" />
      <rect x="68" y="86" width="10" height="28" rx="2" fill="#e8c97a" fillOpacity=".85" />
      <g stroke="#c8a45a" strokeOpacity=".75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M92 70l3 3 5-6" />
        <path d="M92 86l3 3 5-6" />
        <path d="M92 102l3 3 5-6" />
      </g>
      <g fill="#eae6da" fillOpacity=".4">
        <rect x="104" y="69" width="26" height="3.5" rx="1.75" />
        <rect x="104" y="85" width="22" height="3.5" rx="1.75" />
        <rect x="104" y="101" width="26" height="3.5" rx="1.75" />
      </g>
      <rect x="120" y="104" width="52" height="64" rx="7" fill="#1c1c19" stroke="#c8a45a" strokeOpacity=".6" />
      <g fill="#eae6da" fillOpacity=".35">
        <rect x="130" y="116" width="32" height="3.4" rx="1.7" fillOpacity=".5" />
        <rect x="130" y="126" width="26" height="3.4" rx="1.7" />
        <rect x="130" y="136" width="30" height="3.4" rx="1.7" />
        <rect x="130" y="146" width="20" height="3.4" rx="1.7" />
      </g>
      <circle cx="166" cy="110" r="9" fill="#c8a45a" />
      <path d="M162 110l3 3 5-6" stroke="#0c0c0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="30" y="128" width="46" height="40" rx="6" fill="#1c1c19" stroke="#c8a45a" strokeOpacity=".4" />
      <path d="M30 138h46" stroke="#c8a45a" strokeOpacity=".3" />
      <g fill="#c8a45a" fillOpacity=".5">
        <rect x="35" y="143" width="6" height="6" rx="1.5" />
        <rect x="45" y="143" width="6" height="6" rx="1.5" />
        <rect x="55" y="143" width="6" height="6" rx="1.5" />
        <rect x="35" y="153" width="6" height="6" rx="1.5" />
        <rect x="45" y="153" width="6" height="6" rx="1.5" fill="#e8c97a" />
        <rect x="55" y="153" width="6" height="6" rx="1.5" />
      </g>
    </svg>
  )
}

// 2 · Grabación: cámara de cine
function SceneCamera() {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <path d="M58 74v-9h40v9" stroke="#c8a45a" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" />
      <circle cx="64" cy="58" r="10" fill="#1c1c19" stroke="#c8a45a" strokeOpacity=".5" />
      <circle cx="92" cy="58" r="10" fill="#1c1c19" stroke="#c8a45a" strokeOpacity=".5" />
      <rect x="40" y="74" width="86" height="60" rx="10" fill="#15140f" stroke="#c8a45a" strokeOpacity=".6" />
      <rect x="46" y="86" width="22" height="16" rx="3" fill="#0c0c0a" stroke="#c8a45a" strokeOpacity=".4" />
      <rect x="120" y="84" width="14" height="40" rx="3" fill="#1c1c19" stroke="#c8a45a" strokeOpacity=".6" />
      <circle cx="150" cy="104" r="26" fill="#1c1c19" stroke="#c8a45a" strokeOpacity=".7" />
      <circle cx="150" cy="104" r="17" stroke="#c8a45a" strokeOpacity=".5" />
      <circle cx="150" cy="104" r="9" fill="#0c0c0a" stroke="#e8c97a" strokeOpacity=".6" />
      <circle cx="145" cy="99" r="3" fill="#e8c97a" fillOpacity=".8" />
      <circle cx="54" cy="122" r="4" fill="#e0594d" />
      <path d="M83 134l-15 38M83 134l15 38M67 168h32" stroke="#c8a45a" strokeOpacity=".3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// 3 · Postproducción: monitor con timeline de edición
function SceneEdit() {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <rect x="30" y="34" width="140" height="92" rx="8" fill="#15140f" stroke="#c8a45a" strokeOpacity=".5" />
      <rect x="38" y="42" width="84" height="50" rx="4" fill="#0c0c0a" stroke="#c8a45a" strokeOpacity=".3" />
      <path d="M72 56v22l18-11z" fill="#e8c97a" fillOpacity=".85" />
      <g fill="#c8a45a" fillOpacity=".25">
        <rect x="128" y="42" width="34" height="8" rx="2" />
        <rect x="128" y="54" width="34" height="8" rx="2" />
        <rect x="128" y="66" width="34" height="8" rx="2" />
        <rect x="128" y="78" width="34" height="14" rx="2" fill="#e8c97a" fillOpacity=".5" />
      </g>
      <rect x="38" y="100" width="124" height="6" rx="2" fill="#c8a45a" fillOpacity=".18" />
      <rect x="40" y="100" width="40" height="6" rx="2" fill="#c8a45a" fillOpacity=".55" />
      <rect x="84" y="100" width="30" height="6" rx="2" fill="#e8c97a" fillOpacity=".7" />
      <rect x="118" y="100" width="42" height="6" rx="2" fill="#c8a45a" fillOpacity=".4" />
      <rect x="38" y="110" width="124" height="6" rx="2" fill="#c8a45a" fillOpacity=".18" />
      <rect x="50" y="110" width="54" height="6" rx="2" fill="#c8a45a" fillOpacity=".45" />
      <rect x="110" y="110" width="34" height="6" rx="2" fill="#c8a45a" fillOpacity=".3" />
      <path d="M96 96v24" stroke="#e8c97a" strokeWidth="1.5" />
      <path d="M93 96h6l-3 4z" fill="#e8c97a" />
      <path d="M86 126v12M70 142h60" stroke="#c8a45a" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// 4 · Revisión: reproductor de video + checklist
function SceneReview() {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <rect x="24" y="50" width="104" height="74" rx="8" fill="#0c0c0a" stroke="#c8a45a" strokeOpacity=".55" />
      <circle cx="76" cy="80" r="16" stroke="#e8c97a" strokeOpacity=".7" />
      <path d="M71 73v14l12-7z" fill="#e8c97a" />
      <rect x="34" y="110" width="84" height="4" rx="2" fill="#c8a45a" fillOpacity=".25" />
      <rect x="34" y="110" width="48" height="4" rx="2" fill="#e8c97a" fillOpacity=".8" />
      <circle cx="82" cy="112" r="4" fill="#e8c97a" />
      <rect x="120" y="62" width="56" height="80" rx="7" fill="#1c1c19" stroke="#c8a45a" strokeOpacity=".6" />
      <g stroke="#c8a45a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M128 78l2.6 2.6 4.4-5" />
        <path d="M128 94l2.6 2.6 4.4-5" />
        <path d="M128 110l2.6 2.6 4.4-5" />
      </g>
      <circle cx="130.6" cy="127" r="3.4" stroke="#c8a45a" strokeOpacity=".6" />
      <g fill="#eae6da" fillOpacity=".4">
        <rect x="142" y="77" width="26" height="3.4" rx="1.7" />
        <rect x="142" y="93" width="22" height="3.4" rx="1.7" />
        <rect x="142" y="109" width="26" height="3.4" rx="1.7" />
        <rect x="142" y="125" width="18" height="3.4" rx="1.7" fillOpacity=".25" />
      </g>
    </svg>
  )
}

// 5 · Entrega: sistema de contenido (tiles por formato conectados)
function SceneDelivery() {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <rect x="34" y="40" width="38" height="68" rx="6" fill="#15140f" stroke="#c8a45a" strokeOpacity=".55" />
      <path d="M48 66v16l13-8z" fill="#e8c97a" fillOpacity=".8" />
      <rect x="82" y="40" width="50" height="50" rx="6" fill="#15140f" stroke="#c8a45a" strokeOpacity=".55" />
      <path d="M100 56v18l15-9z" fill="#e8c97a" fillOpacity=".8" />
      <rect x="142" y="40" width="34" height="50" rx="6" fill="#15140f" stroke="#c8a45a" strokeOpacity=".4" />
      <rect x="82" y="100" width="50" height="34" rx="6" fill="#15140f" stroke="#c8a45a" strokeOpacity=".4" />
      <rect x="142" y="100" width="34" height="34" rx="6" fill="#15140f" stroke="#c8a45a" strokeOpacity=".55" />
      <path d="M154 110v14l11-7z" fill="#e8c97a" fillOpacity=".7" />
      <g stroke="#c8a45a" strokeOpacity=".4" strokeWidth="1.5">
        <path d="M53 108v26M107 90v18M159 90v18" />
        <path d="M53 134h106" />
      </g>
      <circle cx="106" cy="152" r="13" fill="#c8a45a" />
      <path d="M100 152l4 4 7-8" stroke="#0c0c0a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="84" y="172" width="44" height="3.6" rx="1.8" fill="#eae6da" fillOpacity=".35" />
    </svg>
  )
}

// Fallback line-art alineado con los 3 servicios (monitor=web, cámara=audiovisual, tiles=tráfico).
// SceneLogistics y SceneReview quedan sin usar mientras la sección sea de servicios.
const SCENES = [SceneEdit, SceneCamera, SceneDelivery]
void SceneLogistics
void SceneReview

export default function SystemSection() {
  const root = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const stepEls = gsap.utils.toArray<HTMLElement>('.step')
      const sceneEls = gsap.utils.toArray<HTMLElement>('.scene')

      const setProgress = (p: number) => {
        const c = Math.max(0, Math.min(1, p))
        if (barRef.current) barRef.current.style.height = `${c * 100}%`
        root.current?.style.setProperty('--sys-p', String(c)) // móvil: barra horizontal
      }

      const render = (p: number) => {
        const active = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length))
        stepEls.forEach((el, i) => {
          el.classList.toggle('active', i <= active) // desktop: línea acumulativa
          el.classList.toggle('current', i === active) // móvil: solo el paso activo
        })
        sceneEls.forEach((el, i) => el.classList.toggle('is-active', i === active))
        setProgress(p)
      }

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        stepEls.forEach((el, i) => {
          el.classList.add('active')
          el.classList.toggle('current', i === 0)
        })
        sceneEls[0]?.classList.add('is-active')
        setProgress(1)
        return
      }

      // matchMedia: el pin se reconstruye limpio en cada breakpoint (desktop ↔ móvil),
      // así nunca queda con geometría obsoleta al cambiar de tamaño y la animación de
      // scroll (cambio de PNG, barra y paso) corre igual en celular que en escritorio.
      const mm = gsap.matchMedia()
      mm.add(
        { isMobile: '(max-width: 920px)', isDesktop: '(min-width: 921px)' },
        (ctx) => {
          const { isMobile } = ctx.conditions as { isMobile: boolean }
          const st = ScrollTrigger.create({
            trigger: root.current!,
            start: 'top top',
            // con 3 pasos (antes 5) el recorrido de pin se acorta proporcionalmente
            end: () => '+=' + window.innerHeight * (isMobile ? 2.6 : 2.2),
            pin: '.system__pin',
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => render(self.progress),
          })
          render(0)
          return () => st.kill()
        },
      )

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="system">
      <div className="system__pin">
        <div className="system__layout">
          <div className="system__head">
            <span className="eyebrow system__kicker">Servicios · lo que hacemos</span>
            <h2 className="system__title">
              Web, video y tráfico <span style={{ color: 'var(--gold)' }}>→</span>
              <span className="system__title-l2">un sistema que vende.</span>
            </h2>
          </div>

          <div className="system__canvas-wrap">
            <div className="system__halo" />
            <div className="system__stage" role="img" aria-label="Servicios de Kaizen Studios: desarrollo web, producción audiovisual y tráfico">
              {SCENES.map((Scene, i) => (
                <div className={`scene${i === 0 ? ' is-active' : ''}`} key={STEPS[i].cap}>
                  {ASSETS.hasStageArt ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={STEPS[i].art} alt="" loading="lazy" decoding="async" />
                  ) : (
                    <Scene />
                  )}
                  <span className="scene__cap">{STEPS[i].cap}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="system__steps">
            {/* barra de progreso horizontal — solo visible en móvil */}
            <div className="system__track" aria-hidden="true"><span className="system__track-fill" /></div>
            <div className="steps">
              <div ref={barRef} className="system__progress" style={{ height: '0%' }} />
              {STEPS.map((s, i) => (
                <div className={`step${i === 0 ? ' current' : ''}`} key={s.t}>
                  <span className="step__n">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
