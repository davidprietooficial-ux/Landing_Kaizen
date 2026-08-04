import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE, CONTACT } from '@/lib/config'

const LEGAL_NAME = 'MIRAI GROUP CO SAS'
const NIT = '901982324'
const LAST_UPDATE = '4 de agosto de 2026'

export const metadata: Metadata = {
  title: `Términos y Condiciones — ${SITE.name}`,
  description: `Términos y Condiciones de uso del sitio y de contratación de servicios de ${LEGAL_NAME}, operando bajo la marca ${SITE.name}.`,
  alternates: { canonical: '/terminos', languages: { es: '/terminos', en: '/en/terminos' } },
  robots: { index: true, follow: true },
}

// ─────────────────────────────────────────────────────────────────────────────
// Estructura general (aceptación, enlaces a terceros, cookies, comunicaciones,
// uso aceptable, limitación de responsabilidad, ley aplicable, cambios a los
// términos) adaptada de un modelo estándar de Términos y Condiciones que David
// pasó como referencia — boilerplate genérico de este tipo de documento, no
// contenido de un competidor. Las secciones "Descripción del servicio" y
// "Propiedad intelectual" se escribieron desde cero con lo que este proyecto
// sabe que es real (las 3 fases del sistema, los 3 accesos, la promesa de que
// la web queda 100% del cliente).
// [[ TODO David ]]: la sección 6 (Pagos y facturación) queda en términos
// genéricos porque no tengo confirmado el % de anticipo, la moneda oficial de
// facturación (COP vs. USD) ni la política exacta de reembolsos. Revísala y
// complétala con las cifras reales antes de publicar.
// [[ TODO David ]]: no tengo confirmado un plazo de entrega comprometido por
// escrito (el sitio habla de "Landing en 24 horas" para la Muestra, pero no
// hay plazos publicados para "El sistema" ni "Sistema completo"). Confirma si
// quieres comprometer plazos específicos aquí o dejarlo como "el plazo
// acordado en la propuesta" (como está ahora).
// ─────────────────────────────────────────────────────────────────────────────

export default function TerminosPage() {
  return (
    <>
      <Header />
      <main>
        <section className="section" style={{ paddingTop: 'clamp(48px,7vw,80px)' }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <span className="eyebrow">Legal</span>
            <h1 style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', margin: '1rem 0 .6rem' }}>
              Términos y Condiciones
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

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>1. Aceptación de los términos y ámbito de aplicación</h2>
            <p>
              Estos Términos y Condiciones regulan el acceso y uso de este sitio web, así como la contratación de
              los servicios ofrecidos por {LEGAL_NAME} bajo la marca {SITE.name}. Al navegar este sitio, enviar el
              formulario de contacto, agendar una llamada o contratar cualquiera de los accesos descritos a
              continuación, aceptas estos términos en su totalidad. Si no estás de acuerdo con alguno de ellos, no
              debes usar este sitio ni contratar los servicios aquí descritos.
            </p>
            <p style={{ color: 'var(--muted)' }}>
              Estos términos aplican junto con la{' '}
              <Link href="/privacidad" style={{ color: 'var(--gold)' }}>Política de Tratamiento de Datos Personales</Link>{' '}
              de este sitio, y con cualquier propuesta, cotización o contrato particular que se firme con un cliente
              específico. En caso de conflicto entre estos términos generales y un contrato particular firmado con
              un cliente, prevalece lo pactado en ese contrato particular.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>2. Descripción del servicio</h2>
            <p>
              {SITE.name} no vende servicios sueltos: vende un sistema compuesto por tres fases que trabajan juntas
              para atraer, convertir y gestionar clientes para el negocio del cliente contratante.
            </p>
            <ul style={{ display: 'grid', gap: '.5rem', paddingLeft: '1.1rem', color: 'var(--muted)' }}>
              <li><strong style={{ color: 'var(--text)' }}>Atraer:</strong> pauta en Meta Ads pensada para llevar tráfico calificado hacia el negocio del cliente, no simplemente impresiones o alcance.</li>
              <li><strong style={{ color: 'var(--text)' }}>Convertir:</strong> una web propia del cliente, con copy estratégico y producción audiovisual, diseñada para convertir ese tráfico en contactos y clientes.</li>
              <li><strong style={{ color: 'var(--text)' }}>Gestionar:</strong> seguimiento y gestión de conversaciones con el cliente potencial, de forma manual o automatizada según el acceso contratado.</li>
            </ul>
            <p style={{ marginTop: '.6rem' }}>Este sistema se ofrece hoy en tres niveles de acceso:</p>
            <ul style={{ display: 'grid', gap: '.5rem', paddingLeft: '1.1rem', color: 'var(--muted)' }}>
              <li><strong style={{ color: 'var(--text)' }}>Muestra:</strong> una landing page, con producción audiovisual y apoyo de IA, sin pauta publicitaria ni CRM — pensada para que el cliente conozca la forma de trabajar de {SITE.name} antes de comprometerse con el sistema completo.</li>
              <li><strong style={{ color: 'var(--text)' }}>El sistema:</strong> las tres fases completas — atraer, convertir, gestionar — con un mecanismo de cierre simple (agenda, WhatsApp o formulario), sin CRM. Es el acceso principal que ofrece {SITE.name}, y sobre el que trabajamos con resultados asegurados en los términos que se acuerden por escrito con cada cliente en su propuesta particular.</li>
              <li><strong style={{ color: 'var(--text)' }}>Sistema completo:</strong> todo lo anterior más la gestión automatizada de conversaciones, seguimiento y onboarding a través de GoHighLevel y automatizaciones asociadas.</li>
            </ul>
            <p style={{ marginTop: '.6rem' }}>
              El alcance exacto, los entregables, los tiempos y las condiciones particulares de cada proyecto se
              definen en la propuesta o cotización que {LEGAL_NAME} entrega al cliente antes de iniciar el trabajo,
              y esa propuesta forma parte integral de la relación contractual entre las partes. {SITE.name} trabaja
              para que cada sistema cumpla su propósito de atraer, convertir y gestionar clientes de forma efectiva,
              dentro del marco de lo pactado en cada propuesta particular; los resultados de negocio dependen
              también de factores fuera del control de {SITE.name}, como el mercado, la oferta del cliente y la
              inversión publicitaria destinada a la pauta.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>3. Enlaces a sitios de terceros</h2>
            <p style={{ color: 'var(--muted)' }}>
              Este sitio puede incluir enlaces hacia páginas administradas por terceros (por ejemplo, redes sociales
              o el formulario embebido de agendamiento). {LEGAL_NAME} no se hace responsable del contenido, los
              productos ni los servicios ofrecidos en esos sitios de terceros. Al salir de este sitio a través de
              uno de esos enlaces, quedas sujeto a los términos de uso propios de ese sitio, no a los de este
              documento.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>4. Propiedad intelectual</h2>
            <p>
              Una vez completado el pago acordado por un proyecto, la web entregada al cliente —código, diseño y
              contenido desarrollados específicamente para ese proyecto— pasa a ser 100% propiedad del cliente. El
              cliente puede alojarla donde quiera, modificarla y disponer de ella libremente, sin depender de
              {' '}{SITE.name} para seguir usándola.
            </p>
            <p style={{ color: 'var(--muted)' }}>
              Quedan fuera de esa cesión, y siguen siendo propiedad de {LEGAL_NAME}: la marca {SITE.name}, su
              identidad visual, sus procesos internos de producción, sus plantillas, componentes y herramientas de
              trabajo reutilizables entre proyectos, y cualquier material de portafolio o making-of usado con fines
              de mostrar el trabajo de {SITE.name} —salvo que se acuerde expresamente lo contrario por escrito con
              el cliente—.
            </p>
            <p style={{ color: 'var(--muted)' }}>
              El material audiovisual de producción propia (video, fotografía, animaciones) entregado como parte de
              un proyecto se rige por lo mismo: una vez pagado el proyecto que lo incluye, el material entregado es
              del cliente para el uso que se haya acordado; {SITE.name} conserva el derecho de usar ese material en
              su portafolio, salvo que el cliente solicite expresamente lo contrario.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>5. Cookies</h2>
            <p style={{ color: 'var(--muted)' }}>
              Este sitio puede usar cookies propias del formulario de agendamiento y de las plataformas que embebe
              (por ejemplo, para recordar el progreso de un paso). Navegar este sitio implica aceptar ese uso. No es
              obligatorio aceptar cookies para visitar el sitio, aunque bloquearlas puede limitar el funcionamiento
              de algunas secciones. Este sitio no usa cookies propias de analítica o publicidad en este momento —ver
              la sección 4 de la{' '}
              <Link href="/privacidad" style={{ color: 'var(--gold)' }}>Política de Tratamiento de Datos Personales</Link>
              —, y su uso no representa riesgo de virus ni afecta archivos de tu equipo. Puedes configurar tu
              navegador para rechazar cookies o abandonar el sitio en cualquier momento.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>6. Pagos y facturación</h2>
            <p>
              La contratación de cualquiera de los accesos descritos en la sección 2 implica el pago de los valores
              acordados en la propuesta o cotización particular enviada al cliente. Las condiciones de pago
              —anticipo requerido para iniciar el proyecto, número y momento de las cuotas, y moneda en la que se
              factura— se definen en esa propuesta particular y se confirman antes de iniciar el trabajo.
            </p>
            <p style={{ color: 'var(--muted)' }}>
              La propiedad intelectual de la web se transfiere al cliente al completarse el pago acordado, conforme
              a la sección 3. En caso de cancelación de un proyecto ya iniciado, o de solicitud de reembolso, aplica
              la política que se haya pactado por escrito en la propuesta particular del proyecto; ante la ausencia
              de un acuerdo específico, {LEGAL_NAME} evalúa cada caso considerando el trabajo ya ejecutado y los
              costos ya asumidos para ese proyecto.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>7. Comunicaciones</h2>
            <p style={{ color: 'var(--muted)' }}>
              Al enviar el formulario de este sitio, {LEGAL_NAME} puede escribirte por correo o WhatsApp para dar
              seguimiento a tu solicitud, coordinar una llamada o compartir información sobre {SITE.name} que pueda
              ser de tu interés. Si en algún momento no quieres seguir recibiendo esas comunicaciones, puedes
              solicitarlo por los medios descritos en la sección 10 de la{' '}
              <Link href="/privacidad" style={{ color: 'var(--gold)' }}>Política de Tratamiento de Datos Personales</Link>.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>8. Uso aceptable del sitio</h2>
            <p>Al usar este sitio, te comprometes a no:</p>
            <ul style={{ display: 'grid', gap: '.4rem', paddingLeft: '1.1rem', color: 'var(--muted)' }}>
              <li>Usarlo para fines ilegales, fraudulentos o que infrinjan derechos de terceros.</li>
              <li>Intentar acceder sin autorización a sistemas, cuentas o datos que no te pertenecen.</li>
              <li>Copiar, reproducir o distribuir el contenido, diseño o código de este sitio sin autorización de {LEGAL_NAME}.</li>
              <li>Interferir con el funcionamiento normal del sitio (por ejemplo, mediante bots, scraping masivo o ataques de denegación de servicio).</li>
              <li>Enviar a través del formulario información falsa con la intención de engañar o suplantar a un tercero.</li>
            </ul>
            <p style={{ marginTop: '.6rem', color: 'var(--muted)' }}>
              {LEGAL_NAME} se reserva el derecho de restringir o suspender el acceso a este sitio a quien incumpla
              este uso aceptable.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>9. Limitación de responsabilidad</h2>
            <p>
              Este sitio y su contenido se ofrecen &ldquo;tal cual&rdquo;. {LEGAL_NAME} trabaja para mantenerlo disponible y
              actualizado, pero no garantiza que el acceso al sitio sea ininterrumpido o esté libre de errores, ni
              controla ni garantiza la ausencia de virus u otros elementos que puedan afectar el equipo de quien lo
              visita.
            </p>
            <p style={{ color: 'var(--muted)' }}>
              En la medida en que lo permita la ley aplicable, {LEGAL_NAME} no será responsable por daños
              indirectos, incidentales o consecuenciales derivados del uso de este sitio o de los servicios
              contratados, más allá de lo expresamente pactado en la propuesta o contrato particular de cada
              proyecto. Nada en esta sección limita responsabilidades que, conforme a la ley colombiana, no puedan
              ser limitadas contractualmente.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>10. Ley aplicable y jurisdicción</h2>
            <p>
              Estos Términos y Condiciones se rigen por las leyes de la República de Colombia. Cualquier
              controversia derivada de su interpretación o cumplimiento se someterá a los jueces y tribunales
              competentes de Colombia, sin perjuicio de que las partes puedan pactar un mecanismo distinto de
              resolución de conflictos en un contrato particular.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>11. Cambios a estos términos</h2>
            <p>
              {LEGAL_NAME} podrá modificar estos Términos y Condiciones en cualquier momento. Los cambios
              sustanciales se reflejarán en esta misma página, actualizando la fecha indicada al inicio. El uso
              continuado del sitio después de una actualización implica la aceptación de los términos modificados.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>12. Contacto</h2>
            <p>
              Si tienes preguntas sobre estos Términos y Condiciones, escríbenos a{' '}
              <a href={`mailto:${CONTACT.email}`} style={{ color: 'var(--gold)' }}>{CONTACT.email}</a>.
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
