import type { Metadata } from 'next'
import Header from '@/components/Header'
import About from '@/components/About'
import Founder from '@/components/Founder'
import Footer from '@/components/Footer'
import { SITE } from '@/lib/config.en'

export const metadata: Metadata = {
  title: `About us — ${SITE.name}`,
  description: `Who we are at ${SITE.name} and who's behind the studio.`,
  alternates: { canonical: '/en/quienes-somos', languages: { es: '/quienes-somos', en: '/en/quienes-somos' } },
  robots: { index: true, follow: true },
}

// Mismo alcance que la versión en español por ahora: solo "Quiénes somos" y
// "Quién está detrás". Ver la nota en quienes-somos/page.tsx (ES).
export default function AboutPageEn() {
  return (
    <>
      <Header />
      <main>
        <About locale="en" />
        <Founder locale="en" />
      </main>
      <Footer />
    </>
  )
}
