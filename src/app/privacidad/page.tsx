import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE, CONTACT } from '@/lib/config'

const LEGAL_NAME = 'MIRAI GROUP CO SAS'
const NIT = '901982324'
const LAST_UPDATE = '16 de julio de 2026'

export const metadata: Metadata = {
  title: `Política de Privacidad — ${SITE.name}`,
  description: `Política de Tratamiento de Datos Personales de ${LEGAL_NAME}, operando bajo la marca ${SITE.name}.`,
  alternates: { canonical: '/privacidad' },
  robots: { index: true, follow: true },
}

// ─────────────────────────────────────────────────────────────────────────────
// Estructura y boilerplate (definiciones, principios, derechos, deberes, plazos
// de trámite) tomados de la Ley 1581 de 2012 y el Decreto 1377 de 2013 — son la
// norma general, iguales para cualquier responsable, no contenido de un tercero.
// Las secciones "Finalidad" y "Medidas de seguridad" se reescribieron desde cero
// con lo que este proyecto sabe que es real (formulario de contacto, GoHighLevel,
// Vercel) — no se copió nada de un documento de otra empresa.
// [[ TODO David ]]: hay 2 cajas marcadas abajo con datos que no pude confirmar.
// ─────────────────────────────────────────────────────────────────────────────

const DEFINICIONES = [
  ['Autorización', 'Consentimiento previo, expreso e informado del Titular para el Tratamiento de sus datos personales.'],
  ['Aviso de privacidad', 'Documento mediante el cual se informa al Titular la existencia de esta política, cómo acceder a ella y la finalidad del tratamiento de sus datos.'],
  ['Base de datos', 'Conjunto organizado de datos personales que sea objeto de Tratamiento.'],
  ['Dato personal', 'Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables.'],
  ['Dato privado', 'Dato que por su naturaleza íntima o reservada solo es relevante para el Titular.'],
  ['Datos sensibles', 'Datos que afectan la intimidad del Titular o cuyo uso indebido puede generar discriminación (origen racial o étnico, orientación política, convicciones religiosas, salud, vida sexual, datos biométricos, entre otros).'],
  ['Encargado del Tratamiento', 'Persona natural o jurídica que realiza el Tratamiento de datos personales por cuenta del Responsable.'],
  ['Responsable del Tratamiento', 'Persona natural o jurídica que decide sobre la base de datos y/o el Tratamiento de los datos.'],
  ['Titular', 'Persona natural cuyos datos personales son objeto de Tratamiento.'],
  ['Tratamiento', 'Cualquier operación sobre datos personales: recolección, almacenamiento, uso, circulación o supresión.'],
  ['Cookie', 'Archivo creado por un sitio web que guarda pequeñas cantidades de datos, intercambiado entre el servidor que aloja el sitio y el navegador de quien lo visita.'],
] as const

const PRINCIPIOS = [
  ['Finalidad', 'El Tratamiento de los datos recogidos debe obedecer a una finalidad legítima, informada al Titular.'],
  ['Libertad', 'El Tratamiento solo puede llevarse a cabo con el consentimiento previo, expreso e informado del Titular.'],
  ['Veracidad o calidad', 'La información sujeta a Tratamiento debe ser veraz, completa, exacta, actualizada, comprobable y comprensible.'],
  ['Transparencia', 'El Titular tiene derecho a obtener, en cualquier momento, información sobre los datos que le conciernan.'],
  ['Acceso y circulación restringida', 'Los datos personales no estarán disponibles en internet u otros medios de divulgación masiva, salvo acceso técnicamente controlado a Titulares o terceros autorizados.'],
  ['Seguridad', 'La información se protegerá con medidas técnicas, humanas y administrativas que eviten su adulteración, pérdida, consulta o uso no autorizado.'],
  ['Confidencialidad', 'Todas las personas que intervengan en el Tratamiento están obligadas a garantizar la reserva de la información, incluso después de finalizada su relación con esa labor.'],
] as const

const DERECHOS = [
  ['Acceso', `conocer, de forma gratuita, los datos personales que ${LEGAL_NAME} tenga sobre ti.`],
  ['Actualización, rectificación y supresión', 'solicitar que se corrijan, actualicen o eliminen tus datos cuando corresponda.'],
  ['Prueba de la autorización', 'solicitar copia de la autorización otorgada, salvo que la ley no la exija.'],
  ['Información sobre el uso', 'ser informado sobre el uso que se le ha dado a tu dato personal.'],
  ['Queja ante la SIC', 'presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la normatividad de protección de datos.'],
  ['Revocar la autorización', 'revocar el consentimiento y/o solicitar la supresión del dato cuando no exista un deber legal o contractual que obligue a conservarlo.'],
] as const

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main>
        <section className="section" style={{ paddingTop: 'clamp(48px,7vw,80px)' }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <span className="eyebrow">Legal</span>
            <h1 style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', margin: '1rem 0 .6rem' }}>
              Política de Tratamiento de Datos Personales
            </h1>
            <p className="lead" style={{ marginBottom: '.5rem' }}>
              {LEGAL_NAME}, NIT {NIT}, operando bajo la marca {SITE.name}.
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '2.2rem' }}>
              Última actualización: {LAST_UPDATE}
            </p>

            <p style={{ marginBottom: '2.2rem' }}>
              <Link href="/" style={{ color: 'var(--gold)' }}>← Volver al inicio</Link>
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>1. Normatividad legal y ámbito de aplicación</h2>
            <p>
              Esta política se elabora conforme a la Constitución Política de Colombia, la Ley 1581 de 2012, el
              Decreto Reglamentario 1377 de 2013 y demás normas complementarias, y es aplicada por {LEGAL_NAME}
              respecto de la recolección, almacenamiento, uso, circulación y supresión de datos personales
              obtenidos a través de este sitio web.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>2. Definiciones</h2>
            <ul style={{ display: 'grid', gap: '.5rem', paddingLeft: '1.1rem' }}>
              {DEFINICIONES.map(([term, def]) => (
                <li key={term} style={{ color: 'var(--muted)' }}>
                  <strong style={{ color: 'var(--text)' }}>{term}:</strong> {def}
                </li>
              ))}
            </ul>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>3. Datos que recopilamos y finalidad del tratamiento</h2>
            <p>
              A través del formulario de contacto y agendamiento de este sitio, {LEGAL_NAME} recopila los datos
              que la persona interesada entrega voluntariamente: nombre completo, correo electrónico, teléfono o
              WhatsApp, nombre del negocio, sitio web (si tiene), el servicio de interés, una descripción del
              proyecto, y rangos de facturación, presupuesto y urgencia del proyecto. También se capturan
              parámetros de campaña (UTM) cuando el visitante llega desde un anuncio o publicación, para saber qué
              campaña generó el contacto.
            </p>
            <p>Estos datos se usan exclusivamente para:</p>
            <ul style={{ display: 'grid', gap: '.4rem', paddingLeft: '1.1rem', color: 'var(--muted)' }}>
              <li>Contactar al prospecto y evaluar si su proyecto encaja con los servicios de {SITE.name}.</li>
              <li>Coordinar y confirmar la llamada de diagnóstico agendada a través del sitio.</li>
              <li>Prestar los servicios de desarrollo web, producción audiovisual y/o gestión de tráfico que se contraten.</li>
              <li>Medir qué canales o campañas de pauta generan contactos, con fines de mejora del servicio.</li>
            </ul>
            <p style={{ marginTop: '.6rem' }}>
              {LEGAL_NAME} no vende, licencia ni divulga estos datos a terceros distintos de los indicados en la
              sección 4, salvo autorización expresa del Titular o requerimiento legal.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>4. Con quién se comparten los datos (encargados del tratamiento)</h2>
            <p>Para operar este sitio y prestar el servicio, los datos se procesan a través de:</p>
            <ul style={{ display: 'grid', gap: '.4rem', paddingLeft: '1.1rem', color: 'var(--muted)' }}>
              <li><strong style={{ color: 'var(--text)' }}>GoHighLevel / LeadConnector</strong> — plataforma de CRM que recibe el formulario, gestiona el contacto y administra el calendario de citas.</li>
              <li><strong style={{ color: 'var(--text)' }}>Vercel</strong> — proveedor de hosting donde corre este sitio web.</li>
            </ul>
            <p style={{ marginTop: '.6rem', color: 'var(--muted)' }}>
              Este sitio no tiene instalado actualmente ningún pixel de analítica o publicidad (Meta Pixel, Google
              Analytics, etc.). Si en el futuro se instala alguno, esta sección se actualizará antes de activarlo.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>5. Principios aplicables al tratamiento</h2>
            <ul style={{ display: 'grid', gap: '.5rem', paddingLeft: '1.1rem' }}>
              {PRINCIPIOS.map(([term, def]) => (
                <li key={term} style={{ color: 'var(--muted)' }}>
                  <strong style={{ color: 'var(--text)' }}>{term}:</strong> {def}
                </li>
              ))}
            </ul>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>6. Derechos de los titulares</h2>
            <p>Como Titular de tus datos personales, tienes derecho a:</p>
            <ul style={{ display: 'grid', gap: '.5rem', paddingLeft: '1.1rem' }}>
              {DERECHOS.map(([term, def]) => (
                <li key={term} style={{ color: 'var(--muted)' }}>
                  <strong style={{ color: 'var(--text)' }}>{term}:</strong> {def}
                </li>
              ))}
            </ul>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>7. Deberes de {LEGAL_NAME}</h2>
            <ul style={{ display: 'grid', gap: '.4rem', paddingLeft: '1.1rem', color: 'var(--muted)' }}>
              <li>Solicitar y conservar copia de la autorización otorgada por el Titular.</li>
              <li>Informar de forma clara la finalidad de la recolección y los derechos que asisten al Titular.</li>
              <li>Tramitar las consultas y reclamos en los términos de esta política.</li>
              <li>Conservar la información bajo condiciones de seguridad que impidan su adulteración, pérdida o acceso no autorizado.</li>
              <li>Actualizar o rectificar los datos personales cuando corresponda.</li>
            </ul>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>8. Autorización del titular</h2>
            <p>
              Al enviar el formulario de este sitio, el Titular otorga a {LEGAL_NAME} autorización previa, expresa
              e informada para el Tratamiento de sus datos personales conforme a las finalidades descritas en la
              sección 3, por el tiempo razonable y necesario para satisfacer dichas finalidades.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>9. Conservación de los datos</h2>
            <p>
              {LEGAL_NAME} conserva los datos personales durante el tiempo razonable y necesario para cumplir las
              finalidades que motivaron su recolección, y los datos derivados de una relación contractual se
              conservan además el tiempo que exijan las obligaciones legales, contables o fiscales aplicables. Una
              vez cumplida la finalidad y sin que exista una obligación legal que ordene lo contrario, los datos
              se suprimen.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>10. Cómo ejercer tus derechos</h2>
            <p>
              Para conocer, actualizar, rectificar o solicitar la supresión de tus datos, o para presentar una
              queja o reclamo, escribe a{' '}
              <a href={`mailto:${CONTACT.email}`} style={{ color: 'var(--gold)' }}>{CONTACT.email}</a>{' '}
              indicando tu identificación, la descripción de tu solicitud y los documentos que quieras hacer valer.
            </p>
            <p style={{ color: 'var(--muted)' }}>
              Si el reclamo llega incompleto, se te pedirá completarlo dentro de los 5 días hábiles siguientes; si
              no respondes en 2 meses, se entenderá desistido. El plazo máximo para resolver un reclamo completo es
              de 15 días hábiles desde su recibo, prorrogable hasta 10 días hábiles adicionales si es necesario,
              informándote el motivo de la demora.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>11. Medidas de seguridad</h2>
            <p>
              Los datos recolectados por este sitio se transmiten de forma cifrada y se almacenan en la plataforma
              de GoHighLevel, con acceso restringido a las personas de {SITE.name} que necesitan esa información
              para atender al prospecto o cliente. No se mantienen copias adicionales de esta información fuera de
              esa plataforma.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>12. Cookies</h2>
            <p>
              Este sitio embebe el formulario y el calendario de GoHighLevel dentro de la página, lo que puede
              implicar el uso de cookies propias de esa plataforma para su funcionamiento (por ejemplo, recordar el
              progreso del formulario). Este sitio no usa cookies propias de analítica o publicidad en este
              momento.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>13. Cambios a esta política</h2>
            <p>
              {LEGAL_NAME} podrá modificar esta política en cualquier momento. Los cambios sustanciales se
              reflejarán en esta misma página, actualizando la fecha indicada al inicio.
            </p>

            <p style={{ marginTop: '2.5rem', color: 'var(--muted)', fontSize: '.9rem' }}>
              Atentamente,<br />{LEGAL_NAME}
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
