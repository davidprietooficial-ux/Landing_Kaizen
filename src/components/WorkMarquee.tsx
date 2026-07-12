'use client'

import { scrollToId } from '@/lib/scroll'
import { ChevronDown } from './Icons'
import { WORK_MARQUEE } from '@/lib/config'

// Carrusel infinito de webs construidas. El track contiene el set duplicado (x2)
// y la animación va de 0 a -50%: al terminar un ciclo el segundo set queda
// exactamente donde empezó el primero → loop perfecto sin saltos.
export default function WorkMarquee() {
  const items = [...WORK_MARQUEE, ...WORK_MARQUEE]
  return (
    <section id="trabajo" className="marquee" aria-label="Webs que hemos construido">
      <div className="marquee__track">
        {items.map((w, i) => (
          <div className="marquee__item" key={`${w.name}-${i}`} aria-hidden={i >= WORK_MARQUEE.length || undefined}>
            <video src={w.src} autoPlay muted loop playsInline preload="metadata" />
          </div>
        ))}
      </div>

      <button className="marquee__cue" onClick={() => scrollToId('quienes')} aria-label="¿Quiénes somos? Bajar a la siguiente sección">
        ¿Quiénes somos?
        <span className="chev" aria-hidden="true">
          <ChevronDown size={18} />
        </span>
      </button>
    </section>
  )
}
