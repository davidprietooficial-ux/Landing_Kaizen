'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { scrollToId } from '@/lib/scroll'
import { searchSite, type SearchEntry } from '@/lib/searchIndex'
import { localeFromPathname, localizedHref } from '@/lib/locale'
import { ArrowRight, Menu, Search, X } from './Icons'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import { SITE } from '@/lib/config'

// Sistema, Servicios, Clientes y Blog: páginas ya construidas pero todavía no
// activas — desactivadas a pedido de David hasta que revise el contenido.
// Descomenta la línea correspondiente para reactivar cada una (en ambos idiomas).
const NAV = {
  es: [
    // { href: '/sistema', label: 'Sistema' },
    { href: '/quienes-somos', label: 'Quiénes somos' },
    // { href: '/servicios', label: 'Servicios' },
    // { href: '/clientes', label: 'Clientes' },
    // { href: '/blog', label: 'Blog' },
  ],
  en: [
    // { href: '/en/sistema', label: 'System' },
    { href: '/en/quienes-somos', label: 'About us' },
    // { href: '/en/servicios', label: 'Services' },
    // { href: '/en/clientes', label: 'Clients' },
    // { href: '/en/blog', label: 'Blog' },
  ],
}

const COPY = {
  es: {
    goHome: `${SITE.name} — ir al inicio`,
    cta: 'Agenda tu Llamada Gratis',
    ctaShort: 'Llamada Gratis',
    searchLabel: 'Buscar en el sitio',
    searchPlaceholder: '¿Qué necesitas? — ej. sistema, precios, blog…',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    home: 'Inicio',
    resources: 'Recursos',
  },
  en: {
    goHome: `${SITE.name} — go to homepage`,
    cta: 'Book Your Free Call',
    ctaShort: 'Free Call',
    searchLabel: 'Search the site',
    searchPlaceholder: 'What do you need? — e.g. system, pricing, blog…',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    home: 'Home',
    resources: 'Resources',
  },
}

export default function Header() {
  const [solid, setSolid] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchEntry[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const locale = localeFromPathname(pathname)
  const t = COPY[locale]
  const nav = NAV[locale]
  const homeHref = locale === 'en' ? '/en' : '/'

  // El <html lang> vive en el layout raíz (Next no lo permite sobreescribir
  // desde una ruta anidada) — se corrige acá en cada cambio de ruta.
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cierra el drawer/búsqueda al cambiar de ruta (navegación cliente vía Link,
  // no un click dentro del propio drawer/panel — por eso necesita un efecto).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setDrawerOpen(false)
    setSearchOpen(false)
  }, [pathname])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!searchOpen) return
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [searchOpen])

  // En la home, #agendar existe y se desliza suave. En cualquier otra página
  // ese id no está en el DOM y scrollToId no hace nada — hay que navegar a la
  // home (en el idioma actual) con el hash puesto.
  const goToAgendar = () => {
    if (document.getElementById('agendar')) scrollToId('agendar')
    else window.location.href = `${homeHref}#agendar`
  }

  const goHome = () => {
    if (pathname === homeHref) window.scrollTo({ top: 0, behavior: 'smooth' })
    else window.location.href = homeHref
  }

  const runSearch = (q: string) => {
    setQuery(q)
    setResults(searchSite(q, locale))
  }

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (results[0]) {
      router.push(results[0].href)
      setSearchOpen(false)
      setQuery('')
    }
  }

  return (
    <header className={`site-header${solid ? ' solid' : ''}`}>
      <div className="container site-header__inner">
        <button
          className="iso"
          onClick={goHome}
          aria-label={t.goHome}
          style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0 }}
        >
          <Logo size={23} />
          <span className="iso__studios">STUDIOS</span>
        </button>

        <nav className="site-nav" aria-label="Navegación principal">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`site-nav__link${pathname === item.href ? ' is-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <LanguageSwitcher />

          <div className="site-search" ref={searchRef}>
            <button
              className="site-search__toggle"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={t.searchLabel}
              aria-expanded={searchOpen}
            >
              <Search size={17} />
            </button>
            {searchOpen && (
              <form className="site-search__panel" onSubmit={submitSearch}>
                <input
                  autoFocus
                  type="search"
                  placeholder={t.searchPlaceholder}
                  value={query}
                  onChange={(e) => runSearch(e.target.value)}
                />
                {results.length > 0 && (
                  <ul className="site-search__results">
                    {results.map((r) => (
                      <li key={r.href}>
                        <Link href={r.href} onClick={() => setSearchOpen(false)}>
                          {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </form>
            )}
          </div>

          <button className="btn-gold" onClick={goToAgendar}>
            <span className="btn-gold__full">{t.cta}</span>
            <span className="btn-gold__short">{t.ctaShort}</span>
            <ArrowRight size={16} />
          </button>

          <button
            className="site-menu-toggle"
            onClick={() => setDrawerOpen((v) => !v)}
            aria-label={drawerOpen ? t.closeMenu : t.openMenu}
            aria-expanded={drawerOpen}
          >
            {drawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {drawerOpen && (
        <div className="site-drawer">
          <nav className="site-drawer__nav" aria-label="Navegación móvil">
            <Link href={homeHref} className={pathname === homeHref ? 'is-active' : ''}>{t.home}</Link>
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className={pathname === item.href ? 'is-active' : ''}>
                {item.label}
              </Link>
            ))}
            <Link href={localizedHref('/recursos', locale)} className={pathname === localizedHref('/recursos', locale) ? 'is-active' : ''}>
              {t.resources}
            </Link>
          </nav>
          <LanguageSwitcher className="lang-switch--drawer" />
          <button className="btn-gold" style={{ width: '100%', justifyContent: 'center' }} onClick={goToAgendar}>
            {t.cta}
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </header>
  )
}
