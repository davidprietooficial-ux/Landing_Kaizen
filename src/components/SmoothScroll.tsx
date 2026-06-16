'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLenis } from '@/lib/scroll'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      // Sin animación: todo lo marcado .reveal se muestra de inmediato.
      gsap.set('.reveal', { opacity: 1, y: 0 })
      return
    }

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Reveal genérico: cualquier elemento .reveal aparece al entrar al viewport.
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
      gsap.ticker.remove(raf)
      lenis.destroy()
      setLenis(null)
      window.removeEventListener('load', refresh)
      window.clearTimeout(t)
    }
  }, [])

  return <>{children}</>
}
