import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE, CONTACT } from '@/lib/config'

export const metadata: Metadata = {
  title: `Política de Privacidad — ${SITE.name}`,
  description: 'Cómo tratamos los datos personales en el sitio de Kaizen Studios.',
  alternates: { canonical: '/privacidad' },
  robots: { index: false, follow: true }, // [[ TODO ]] pasar a index:true cuando el contenido real esté cargado
}

// ─────────────────────────────────────────────────────────────────────────────
// Página de placeholder. Regla de marca: prohibido inventar contenido legal.
// Cada sección trae el dato real que David debe entregar (o a su abogado/contador)
// antes de publicar. Mientras falte, la página se muestra "en construcción" —
// nunca texto legal inventado haciéndose pasar por real.
// [[ TODO David ]]: cuando tengas todos los datos, reemplaza esta página y
// quita el robots.index:false de arriba.
// ─────────────────────────────────────────────────────────────────────────────

const SECTIONS: { title: string; need: string }[] = [
  {
    title: '1. Responsable del tratamiento',
    need: 'Razón social completa, NIT, dirección física y correo de contacto del responsable (probablemente Kaizen Studios / David Prieto — confirmar el NIT exacto).',
  },
  {
    title: '2. Datos que recopilamos',
    need: 'Listar los campos reales del formulario de contacto (nombre, email, teléfono, negocio, presupuesto, etc.) y cualquier dato que capturen las cookies o pixeles del sitio.',
  },
  {
    title: '3. Finalidad del tratamiento',
    need: 'Para qué se usan esos datos: contactar al prospecto, calificarlo comercialmente, agendar la llamada, enviar comunicaciones de marketing (si aplica).',
  },
  {
    title: '4. Con quién se comparten los datos (encargados)',
    need: 'Nombrar los terceros reales que procesan los datos: GoHighLevel/LeadConnector (CRM y agenda), Vercel (hosting), y cualquier pixel de analítica o publicidad activo (Meta Pixel, Google Analytics/Ads) si ya está instalado.',
  },
  {
    title: '5. Derechos del titular (acceso, corrección, supresión)',
    need: 'Confirmar el correo al que alguien debe escribir para conocer, actualizar o pedir la eliminación de sus datos, y el plazo real de respuesta.',
  },
  {
    title: '6. Tiempo de conservación',
    need: 'Cuánto tiempo se guardan los datos de un contacto que no avanzó, y si hay un proceso de purga.',
  },
  {
    title: '7. Registro ante la SIC',
    need: 'Confirmar si Kaizen Studios está o debe estar inscrito en el Registro Nacional de Bases de Datos de la Superintendencia de Industria y Comercio.',
  },
  {
    title: '8. Cambios a esta política',
    need: 'Fecha de última actualización real (se pone sola cuando el contenido esté escrito de verdad).',
  },
]

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main>
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <span className="eyebrow">Legal</span>
            <h1 style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', margin: '1rem 0 .8rem' }}>Política de Privacidad</h1>
            <p className="lead" style={{ marginBottom: '2rem' }}>
              Esta página describe cómo {SITE.name} trata los datos personales de quienes usan este sitio.
            </p>

            <div className="qualify-msg qualify-msg--yellow" style={{ marginBottom: '2.5rem' }}>
              <strong>Página en construcción</strong>
              <p>
                Este contenido todavía no es real. Es un armazón a la espera de que {SITE.founder} confirme los
                datos exactos de cada sección — no representa la política de privacidad vigente de {SITE.name}.
                No la enlaces desde ningún formulario hasta que esté completa.
              </p>
            </div>

            <div style={{ display: 'grid', gap: 14, marginBottom: '3rem' }}>
              {SECTIONS.map((s) => (
                <div key={s.title} className="qualify-msg">
                  <strong>{s.title}</strong>
                  <p>[[ TODO ]] {s.need}</p>
                </div>
              ))}
            </div>

            <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>
              ¿Preguntas sobre tus datos? Escríbenos a{' '}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            </p>

            <p style={{ marginTop: '2.5rem' }}>
              <Link href="/" style={{ color: 'var(--gold)' }}>← Volver al inicio</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
