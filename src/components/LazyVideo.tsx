'use client'

import { useEffect, useRef } from 'react'

// Video bajo el pliegue: no descarga nada (preload="none") hasta que está por
// entrar al viewport; ahí dispara play(), que inicia la carga. Libera el ancho
// de banda inicial para el hero → mejor LCP/Speed Index en móvil.
type Props = React.VideoHTMLAttributes<HTMLVideoElement>

export default function LazyVideo({ children, ...rest }: Props) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          v.play().catch(() => {})
          io.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <video ref={ref} muted loop playsInline preload="none" {...rest}>
      {children}
    </video>
  )
}
