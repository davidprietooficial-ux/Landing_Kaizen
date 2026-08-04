'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CONTACT, SOCIAL, SITE as SITE_ES } from '@/lib/config'
import { SITE as SITE_EN } from '@/lib/config.en'
import { localeFromPathname } from '@/lib/locale'
import { Instagram, Youtube, /* Linkedin, */ Mail, WhatsApp, ArrowRight } from './Icons'
import LanguageSwitcher from './LanguageSwitcher'

const SOCIALS = [
  // --- LinkedIn oculto temporalmente (descomenta para reactivar) ---
  // { label: 'LinkedIn', Icon: Linkedin, href: SOCIAL.linkedin },
  { label: 'YouTube', Icon: Youtube, href: SOCIAL.youtube },
  { label: 'Instagram', Icon: Instagram, href: SOCIAL.instagram },
]

const COPY = {
  es: {
    newsletter: 'Newsletter',
    newsletterPlaceholder: 'tu@correo.com',
    newsletterAria: 'Correo para el newsletter',
    newsletterSubscribe: 'Suscribirme',
    newsletterOk: 'Listo — ya estás suscrito.',
    newsletterError: 'No se pudo enviar. Escríbenos directo.',
    contact: 'Contacto',
    whatsappMissing: 'WhatsApp · por agregar',
    social: 'Redes',
    socialMissing: 'Por agregar',
    otherPages: 'Otras páginas',
    pages: [
      { label: 'Acerca de nosotros', href: '/quienes-somos' },
      { label: 'Política de privacidad', href: '/privacidad' },
      { label: 'Términos y condiciones', href: '/terminos' },
    ],
  },
  en: {
    newsletter: 'Newsletter',
    newsletterPlaceholder: 'you@email.com',
    newsletterAria: 'Email for the newsletter',
    newsletterSubscribe: 'Subscribe',
    newsletterOk: "Done — you're subscribed.",
    newsletterError: "Couldn't send it. Email us directly.",
    contact: 'Contact',
    whatsappMissing: 'WhatsApp · coming soon',
    social: 'Social',
    socialMissing: 'Coming soon',
    otherPages: 'Other pages',
    pages: [
      { label: 'About us', href: '/en/quienes-somos' },
      { label: 'Privacy policy', href: '/en/privacidad' },
      { label: 'Terms and conditions', href: '/en/terminos' },
    ],
  },
}

function Newsletter({ t }: { t: typeof COPY.es }) {
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
        placeholder={t.newsletterPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label={t.newsletterAria}
      />
      <button type="submit" aria-label={t.newsletterSubscribe} disabled={status === 'sending'}>
        <ArrowRight size={15} />
      </button>
      {status === 'ok' && <span className="footer__newsletter-msg">{t.newsletterOk}</span>}
      {status === 'error' && <span className="footer__newsletter-msg">{t.newsletterError}</span>}
    </form>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  const activeSocials = SOCIALS.filter((s) => s.href)
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const t = COPY[locale]
  const SITE = locale === 'en' ? SITE_EN : SITE_ES

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="lz-logo--flat" src="/logo/logo-kaizen.png" alt="Kaizen Studios" width={212} height={212} />
            <p>{SITE.tagline}</p>
            <h5 style={{ marginTop: 18 }}>{t.newsletter}</h5>
            <Newsletter t={t} />
          </div>

          <div className="footer__col">
            <h5>{t.contact}</h5>
            <a href={`mailto:${CONTACT.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Mail size={16} /> {CONTACT.email}
            </a>
            {CONTACT.whatsapp ? (
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <WhatsApp size={16} /> {CONTACT.whatsapp}
              </a>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--muted2)' }}>
                <WhatsApp size={16} /> {t.whatsappMissing}
              </span>
            )}
            <h5 style={{ marginTop: 18 }}>{t.social}</h5>
            {activeSocials.length ? (
              <div className="footer__socials">
                {activeSocials.map(({ label, Icon, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer__social">
                    <Icon size={16} /> {label}
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--muted2)' }}>{t.socialMissing}</p>
            )}
          </div>

          <div className="footer__col">
            <h5>{t.otherPages}</h5>
            {t.pages.map((p) => (
              <Link key={p.href} href={p.href}>{p.label}</Link>
            ))}
            <LanguageSwitcher />
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} {SITE.name} · {SITE.founder}</span>
        </div>
      </div>
    </footer>
  )
}
