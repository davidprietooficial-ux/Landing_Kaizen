'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SITE, CONTACT, SOCIAL } from '@/lib/config'
import { Instagram, Youtube, /* Linkedin, */ Mail, WhatsApp, ArrowRight } from './Icons'

const SOCIALS = [
  // --- LinkedIn oculto temporalmente (descomenta para reactivar) ---
  // { label: 'LinkedIn', Icon: Linkedin, href: SOCIAL.linkedin },
  { label: 'YouTube', Icon: Youtube, href: SOCIAL.youtube },
  { label: 'Instagram', Icon: Instagram, href: SOCIAL.instagram },
]

const OTHER_PAGES = [
  { label: 'Acerca de nosotros', href: '/quienes-somos' },
  // Casos de éxito (/clientes): desactivada por ahora — descomenta al reactivar.
  // { label: 'Casos de éxito', href: '/clientes' },
  { label: 'Política de privacidad', href: '/privacidad' },
  { label: 'Términos y condiciones', href: '/terminos' },
]

function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'newsletter', email, name: email }),
      })
      setStatus(res.ok ? 'ok' : 'error')
      if (res.ok) setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="footer__newsletter" onSubmit={submit}>
      <input
        type="email"
        required
        placeholder="tu@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Correo para el newsletter"
      />
      <button type="submit" aria-label="Suscribirme" disabled={status === 'sending'}>
        <ArrowRight size={15} />
      </button>
      {status === 'ok' && <span className="footer__newsletter-msg">Listo — ya estás suscrito.</span>}
      {status === 'error' && <span className="footer__newsletter-msg">No se pudo enviar. Escríbenos directo.</span>}
    </form>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  const activeSocials = SOCIALS.filter((s) => s.href)

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="lz-logo--flat" src="/logo/logo-kaizen.png" alt="Kaizen Studios" width={212} height={212} />
            <p>{SITE.tagline}</p>
            <h5 style={{ marginTop: 18 }}>Newsletter</h5>
            <Newsletter />
          </div>

          <div className="footer__col">
            <h5>Contacto</h5>
            <a href={`mailto:${CONTACT.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Mail size={16} /> {CONTACT.email}
            </a>
            {CONTACT.whatsapp ? (
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <WhatsApp size={16} /> {CONTACT.whatsapp}
              </a>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--muted2)' }}>
                <WhatsApp size={16} /> WhatsApp · por agregar
              </span>
            )}
            <h5 style={{ marginTop: 18 }}>Redes</h5>
            {activeSocials.length ? (
              <div className="footer__socials">
                {activeSocials.map(({ label, Icon, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer__social">
                    <Icon size={16} /> {label}
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--muted2)' }}>Por agregar</p>
            )}
          </div>

          <div className="footer__col">
            <h5>Otras páginas</h5>
            {OTHER_PAGES.map((p) => (
              <Link key={p.href} href={p.href}>{p.label}</Link>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} {SITE.name} · {SITE.founder}</span>
        </div>
      </div>
    </footer>
  )
}
