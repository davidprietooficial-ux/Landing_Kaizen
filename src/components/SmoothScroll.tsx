'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLenis, scrollToId } from '@/lib/scroll'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Lenis + el ticker de scroll suave: se crean UNA sola vez para toda la sesión
  // (recrearlos en cada cambio de ruta metería un salto visible). El layout que
  // envuelve esto no se remonta entre rutas, así que este efecto solo corre al
  // cargar la app.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  // Reveal genérico (".reveal") + salto a un hash de la URL: esto SÍ debe
  // re-ejecutarse en cada cambio de ruta. Una navegación cliente (Link) monta
  // contenido nuevo con sus propios ".reveal" que el ScrollTrigger.batch
  // anterior nunca vio — sin este efecto por pathname, cualquier página a la
  // que se navega sin recargar queda con esos elementos en opacity:0 para
  // siempre (se ve "en blanco" hasta que se hace un refresh completo).
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      gsap.set('.reveal', { opacity: 1, y: 0 })
      return
    }

    const hash = window.location.hash.slice(1)
    if (hash) scrollToId(hash)

    const batch = ScrollTrigger.batch('.reveal', {
      start: 'top 86%',
      once: true,
      onEnter: (els) =>
        gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
    })

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = window.setTimeout(refresh, 600)

    return () => {
      batch.forEach((st) => st.kill())
      window.removeEventListener('load', refresh)
      window.clearTimeout(t)
    }
  }, [pathname])

  return <>{children}</>
}
