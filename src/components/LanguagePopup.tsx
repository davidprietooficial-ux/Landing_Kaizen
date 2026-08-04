'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { localeFromPathname, localizedHref, type Locale } from '@/lib/locale'

const STORAGE_KEY = 'kaizen-lang-chosen'

export default function LanguagePopup() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Lee localStorage (sistema externo al render) y abre el popup si nunca se
  // eligió idioma — no hay forma de evitar el setState aquí, es justo el caso
  // que React docs marca como válido ("sync con un sistema externo").
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!window.localStorage.getItem(STORAGE_KEY)) setOpen(true)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const choose = (locale: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, locale)
    setOpen(false)
    const target = localizedHref(pathname, locale)
    if (target !== pathname) router.push(target)
  }

  if (!open) return null

  const current = localeFromPathname(pathname)

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Elige tu idioma / Choose your language">
      <div className="modal lang-popup">
        <p className="lang-popup__line">
          <strong>¿Español o inglés?</strong>
          <span>Elige el idioma en el que quieres ver el sitio.</span>
        </p>
        <p className="lang-popup__line">
          <strong>Spanish or English?</strong>
          <span>Choose the language you want to see the site in.</span>
        </p>
        <div className="lang-popup__actions">
          <button type="button" className={`btn-gold${current === 'es' ? '' : ' btn-gold--outline'}`} onClick={() => choose('es')}>
            Español
          </button>
          <button type="button" className={`btn-gold${current === 'en' ? '' : ' btn-gold--outline'}`} onClick={() => choose('en')}>
            English
          </button>
        </div>
      </div>
    </div>
  )
}
