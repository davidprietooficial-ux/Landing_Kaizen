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

  return (
    <header className={`site-header${solid ? ' solid' : ''}`}>
      <div className="container site-header__inner">
        <button
          className="iso"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={`${SITE.name} — ir al inicio`}
          style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0 }}
        >
          <Logo size={23} />
          <span className="iso__studios">STUDIOS</span>
        </button>

        <button className="btn-gold" onClick={() => scrollToId('agendar')}>
          <span className="btn-gold__full">Agenda tu llamada ahora</span>
          <span className="btn-gold__short">Agenda ahora</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </header>
  )
}
