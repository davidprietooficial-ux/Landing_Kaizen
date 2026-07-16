import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import { SITE } from '@/lib/config'

const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-syne', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-dm-sans', display: 'swap' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-dm-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.founder }],
  keywords: ['producción audiovisual', 'video marketing', 'contenido de marca', 'Colombia', 'estudio audiovisual', 'Kaizen Studios'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    images: [{ url: '/img/og-image.svg', width: 1200, height: 630, alt: `${SITE.name} — ${SITE.tagline}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ['/img/og-image.svg'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0c0c0a',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <head>
        {/* El formulario embebido de GHL tarda en aparecer porque el navegador recién
            arranca el DNS+TLS con app.kaizenvisualstudio.com cuando el iframe entra al
            viewport. Con preconnect, esa conexión ya está lista de antemano. */}
        <link rel="preconnect" href="https://app.kaizenvisualstudio.com" />
        <link rel="dns-prefetch" href="https://app.kaizenvisualstudio.com" />
        {/* Sin JS: revela el contenido animado para que nada quede invisible */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
