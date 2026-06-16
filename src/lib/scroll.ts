import type Lenis from 'lenis'

let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

/** Bloquea el scroll de fondo (al abrir un modal). */
export function lockScroll() {
  lenis?.stop()
  if (typeof document !== 'undefined') document.body.style.overflow = 'hidden'
}

/** Restaura el scroll de fondo (al cerrar el modal). */
export function unlockScroll() {
  lenis?.start()
  if (typeof document !== 'undefined') document.body.style.overflow = ''
}

/** Scroll suave a una sección por id. La sección queda alineada al tope del
 *  viewport; el header fijo se superpone sobre su padding superior (sin que la
 *  sección anterior asome) y el contenido aterriza con buen margen bajo el header. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { offset: 0 })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
