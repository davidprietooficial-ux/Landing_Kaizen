/**
 * Modal — pop-up genérico del lienzo (capa A, modo oscuro).
 *
 * Overlay con blur, cierre por ✕, click afuera o tecla Esc. Bloquea el scroll
 * del fondo mientras está abierto. No muestra costo/margen (anti-fuga).
 */

import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export function Modal({
  abierto,
  onCerrar,
  children,
  ancho = 'normal',
}: {
  abierto: boolean
  onCerrar: () => void
  children: ReactNode
  ancho?: 'normal' | 'ancho'
}) {
  useEffect(() => {
    if (!abierto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [abierto, onCerrar])

  if (!abierto) return null

  // Portal a <body>: si un ancestro tiene transform/filter, un position:fixed
  // anidado queda "atrapado" en él y el overlay no cubre toda la pantalla.
  return createPortal(
    <div className="lz-modal" role="dialog" aria-modal="true" onClick={onCerrar}>
      <div
        className={`lz-modal__caja${ancho === 'ancho' ? ' lz-modal__caja--ancho' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="lz-modal__cerrar" onClick={onCerrar} aria-label="Cerrar">
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
