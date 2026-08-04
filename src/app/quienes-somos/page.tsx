import type { Metadata } from 'next'
import Header from '@/components/Header'
import About from '@/components/About'
import Founder from '@/components/Founder'
import Footer from '@/components/Footer'
import { SITE } from '@/lib/config'

export const metadata: Metadata = {
  title: `Quiénes somos — ${SITE.name}`,
  description: `Quiénes somos en ${SITE.name} y quién está detrás del estudio.`,
  alternates: { canonical: '/quienes-somos' },
  robots: { index: true, follow: true },
}

// Por ahora solo estas 2 secciones (las que ya existían en la landing
// principal): "Quiénes somos" y "Quién está detrás". "Cómo trabajamos" y
// "Trabaja con nosotros" quedan fuera hasta que se pida agregarlas — el
// formulario de postulación sigue en CareerForm.tsx, sin usar por ahora.
export default function QuienesSomosPage() {
  return (
    <>
      <Header />
      <main>
        <About />
        <Founder />
      </main>
      <Footer />
    </>
  )
}
