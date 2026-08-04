'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { localeFromPathname, otherLocalePath } from '@/lib/locale'

export default function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const otherPath = otherLocalePath(pathname)

  return (
    <div className={`lang-switch${className ? ` ${className}` : ''}`}>
      <Link href={locale === 'es' ? pathname : otherPath} aria-current={locale === 'es' ? 'true' : undefined}>ES</Link>
      <span className="lang-switch__sep">/</span>
      <Link href={locale === 'en' ? pathname : otherPath} aria-current={locale === 'en' ? 'true' : undefined}>EN</Link>
    </div>
  )
}
