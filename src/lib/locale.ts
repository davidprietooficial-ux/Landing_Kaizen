export type Locale = 'es' | 'en'

export const EN_PREFIX = '/en'

export function localeFromPathname(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es'
}

/** Ruta equivalente en el otro idioma — usada por el selector y el popup. */
export function otherLocalePath(pathname: string): string {
  if (localeFromPathname(pathname) === 'en') {
    const stripped = pathname.slice(EN_PREFIX.length)
    return stripped === '' ? '/' : stripped
  }
  return pathname === '/' ? EN_PREFIX : `${EN_PREFIX}${pathname}`
}

export function localizedHref(pathname: string, locale: Locale): string {
  const isEn = localeFromPathname(pathname) === 'en'
  if (locale === 'en') return isEn ? pathname : pathname === '/' ? EN_PREFIX : `${EN_PREFIX}${pathname}`
  return isEn ? otherLocalePath(pathname) : pathname
}
