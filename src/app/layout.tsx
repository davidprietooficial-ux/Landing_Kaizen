import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans, DM_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import LanguagePopup from '@/components/LanguagePopup'
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
  alternates: { canonical: '/', languages: { es: '/', en: '/en' } },
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
        {/* Sin JS: revela el contenido animado para que nada quede invisible */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <Script id="gtm" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NKB3NMXV');`}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NKB3NMXV"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <SmoothScroll>{children}</SmoothScroll>
        <LanguagePopup />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xxs6shozc6");`}
        </Script>
      </body>
    </html>
  )
}
