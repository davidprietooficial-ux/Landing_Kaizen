'use client'

import { useEffect, useState } from 'react'
import { scrollToId } from '@/lib/scroll'
import { ArrowRight } from './Icons'
import Logo from './Logo'
import { SITE } from '@/lib/config'

export default function Header() {
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // En la home, #agendar existe y se desliza suave. En cualquier otra página
  // (ej. /privacidad) ese id no está en el DOM y scrollToId no hace nada — hay
  // que navegar a la home con el hash puesto.
  const goToAgendar = () => {
    if (document.getElementById('agendar')) scrollToId('agendar')
    else window.location.href = '/#agendar'
  }

  // Mismo caso: en la home, sube al tope de la página actual. En cualquier
  // otra página, "subir al tope" no te devuelve al inicio — hay que navegar.
  const goHome = () => {
    if (window.location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' })
    else window.location.href = '/'
  }

  return (
    <header className={`site-header${solid ? ' solid' : ''}`}>
      <div className="container site-header__inner">
        <button
          className="iso"
          onClick={goHome}
          aria-label={`${SITE.name} — ir al inicio`}
          style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0 }}
        >
          <Logo size={23} />
          <span className="iso__studios">STUDIOS</span>
        </button>

        <button className="btn-gold" onClick={goToAgendar}>
          <span className="btn-gold__full">Agenda tu Llamada Gratis</span>
          <span className="btn-gold__short">Llamada Gratis</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </header>
  )
}
