'use client'

import { scrollToId } from '@/lib/scroll'
import { ChevronDown } from './Icons'
import LazyVideo from './LazyVideo'
import { WORK_MARQUEE } from '@/lib/config'
import type { Locale } from '@/lib/locale'

const COPY = {
  es: { sectionAria: 'Webs que hemos construido', cue: 'Lo que nos identifica', cueAria: 'Lo que nos identifica — bajar a la siguiente sección' },
  en: { sectionAria: 'Websites we have built', cue: 'What sets us apart', cueAria: 'What sets us apart — scroll to the next section' },
}

// Carrusel infinito de webs construidas. El track contiene el set duplicado (x2)
// y la animación va de 0 a -50%: al terminar un ciclo el segundo set queda
// exactamente donde empezó el primero → loop perfecto sin saltos.
export default function WorkMarquee({ locale = 'es' }: { locale?: Locale }) {
  const items = [...WORK_MARQUEE, ...WORK_MARQUEE]
  const t = COPY[locale]
  return (
    <section id="trabajo" className="marquee" aria-label={t.sectionAria}>
      <div className="marquee__track">
        {items.map((w, i) => (
          <div className="marquee__item" key={`${w.name}-${i}`} aria-hidden={i >= WORK_MARQUEE.length || undefined}>
            {/\.(png|jpe?g|webp|avif)$/i.test(w.src) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={w.src} alt="" loading="lazy" width={w.iw} height={w.ih} />
            ) : (
              <LazyVideo src={w.src} />
            )}
          </div>
        ))}
      </div>

      <button className="marquee__cue" onClick={() => scrollToId('identifica')} aria-label={t.cueAria}>
        {t.cue}
        <span className="chev" aria-hidden="true">
          <ChevronDown size={18} />
        </span>
      </button>
    </section>
  )
}
