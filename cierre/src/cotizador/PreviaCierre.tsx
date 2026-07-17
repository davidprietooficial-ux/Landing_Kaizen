/**
 * PREVIA DE CIERRE (Etapa 4C) — cierre SIN APIs (envío manual asistido).
 *
 * Al "cerrar y enviar" se arman DOS correos; aquí se ven tal como saldrán:
 *   1. Al CLIENTE  → cotización para firmar + anticipo / cuentas / datos fiscales.
 *      Modo CLARO (capa A/C). NUNCA muestra costo ni margen.
 *   2. A DAVID     → presupuesto interno (capa B). Va COLAPSADO y marcado "solo
 *      tú" para no filtrarlo si el cliente está mirando la pantalla.
 *
 * SIN ninguna API: el envío se hace a mano pero ASISTIDO — botones que abren el
 * correo ya escrito (mailto), WhatsApp pre-armado, copiar al portapapeles y
 * descargar la cotización en PDF (impresión del navegador). La automatización
 * real (Adobe Sign + correo + Sheets) llega después como mejora, no es requisito.
 */

import { useState } from 'react'
import { EMPRESA } from '../config/empresa.config'
import { cop, pct } from '../lib/format'
import { precioAjustado, anticipoSaldo } from './cotizacion'
import type { Linea, VistaCliente, VistaInterna } from './cotizacion'

function hoyLargo(): string {
  return new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function PreviaCierre({
  lineas,
  margenPermitido,
  cliente,
  interna,
  correo,
}: {
  lineas: Linea[]
  margenPermitido: number
  cliente: VistaCliente
  interna: VistaInterna
  correo: string
}) {
  const { anticipo, saldo } = anticipoSaldo(cliente.total, EMPRESA.anticipoPct)
  const [contratoVisible, setContratoVisible] = useState(false)
  const [copiadoPrompt, setCopiadoPrompt] = useState(false)

  // ── 1 · Correo al CLIENTE (mailto: abre el correo ya escrito para adjuntar) ──
  const asuntoCliente = `Tu cotización de ${EMPRESA.marca} — lista para firmar`
  const cuerpoCliente = [
    'Hola,',
    '',
    `Gracias por confiar en ${EMPRESA.marca}. Aquí está tu cotización:`,
    '',
    ...lineas.map(
      (l) =>
        `• ${l.nombre}${l.cantidad > 1 ? ` × ${l.cantidad}` : ''} — ${cop(
          precioAjustado(l.precio, margenPermitido) * l.cantidad,
        )}`,
    ),
    '',
    `Honorario profesional: ${cop(cliente.honorario)}`,
    `IVA 19%: ${cop(cliente.iva)}`,
    `Total: ${cop(cliente.total)}`,
    '',
    'Para arrancar:',
    `Anticipo ${pct(EMPRESA.anticipoPct, 0)}: ${cop(anticipo)} · Saldo: ${cop(saldo)} ${EMPRESA.saldoTexto}.`,
    EMPRESA.anticipoNota,
    '',
    'Pago:',
    ...EMPRESA.cuentas.map((c) => `${c.banco} · ${c.tipo} ${c.numero} · ${c.titular}`),
    '',
    `${EMPRESA.razonSocial} · NIT ${EMPRESA.nit}`,
    `${EMPRESA.marca} · ${EMPRESA.contacto}`,
    `Cotización válida por ${EMPRESA.validezDias} días.`,
  ].join('\n')
  const mailtoCliente = `mailto:${correo.trim()}?subject=${encodeURIComponent(
    asuntoCliente,
  )}&body=${encodeURIComponent(cuerpoCliente)}`

  // ── 3 · Correo al EQUIPO (presupuesto interno; insumo para que Cowork lo arme) ──
  const asuntoEquipo = `Presupuesto interno — ${correo.trim() || 'cliente'} (${hoyLargo()})`
  const cuerpoEquipo = [
    `Cliente: ${correo.trim() || '—'}`,
    `Fecha: ${hoyLargo()}`,
    `Responsable: David · ${EMPRESA.razonSocial}`,
    '',
    'COSTO DEL PROYECTO',
    ...lineas.map(
      (l) =>
        `• ${l.nombre}${l.cantidad > 1 ? ` × ${l.cantidad}` : ''} — costo ${cop(
          l.costoReal * l.cantidad,
        )}`,
    ),
    `Costo directo total: ${cop(interna.costoReal)}`,
    '',
    'CÁLCULO FINAL',
    `Honorario (sin IVA): ${cop(interna.precioAplicado)}`,
    `IVA 19%: ${cop(interna.iva)}`,
    `Total al cliente: ${cop(interna.totalCliente)}`,
    '',
    'INDICADORES',
    `RST (5,9%): ${cop(interna.rst)}`,
    `Ganancia neta: ${cop(interna.gananciaNeta)}`,
    `Margen neto: ${pct(interna.margenNeto)}`,
    '',
    'Para armar el costeo completo en la plantilla de Sheets, pásale estos datos a Cowork.',
  ].join('\n')
  const mailtoEquipo = `mailto:${EMPRESA.correoInterno}?cc=${encodeURIComponent(
    EMPRESA.correoInternoCC,
  )}&subject=${encodeURIComponent(asuntoEquipo)}&body=${encodeURIComponent(cuerpoEquipo)}`

  // ── 4 · Prompt para generar el CONTRATO (pegar en Claude / Cowork) ──
  const promptContrato = [
    `Genera el contrato de prestación de servicios de ${EMPRESA.marca} a partir de la plantilla "Kaizen_ContratoMarco_v1", rellenando estos datos:`,
    '',
    `- Prestador: ${EMPRESA.razonSocial} (${EMPRESA.marca}), NIT ${EMPRESA.nit}.`,
    `- Cliente: ${correo.trim() || '[correo del cliente]'} (completar razón social / identificación).`,
    `- Fecha: ${hoyLargo()}.`,
    '- Objeto (piezas contratadas):',
    ...lineas.map((l) => `   · ${l.nombre}${l.cantidad > 1 ? ` × ${l.cantidad}` : ''}`),
    `- Honorario (sin IVA): ${cop(cliente.honorario)}.`,
    `- IVA 19%: ${cop(cliente.iva)}.`,
    `- Valor total: ${cop(cliente.total)}.`,
    `- Anticipo ${pct(EMPRESA.anticipoPct, 0)} (no reembolsable): ${cop(anticipo)}.`,
    `- Saldo: ${cop(saldo)} ${EMPRESA.saldoTexto}.`,
    `- Vigencia de la cotización: ${EMPRESA.validezDias} días.`,
    '',
    'Devuélveme el contrato listo para firmar, respetando el formato y las cláusulas de la plantilla.',
  ].join('\n')

  const copiarPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptContrato)
      setCopiadoPrompt(true)
      setTimeout(() => setCopiadoPrompt(false), 1800)
    } catch {
      /* el portapapeles puede estar bloqueado; el prompt sigue visible para copiar a mano */
    }
  }

  return (
    <div className="previa">
      <p className="previa__intro">
        <strong>Cierre del cliente.</strong> Cuatro acciones para mandar los correos
        y crear los documentos — todo a mano, sin depender de nada externo.
      </p>

      {/* ── Acciones de cierre (sin APIs) ── */}
      <div className="previa__acciones">
        <a className="previa__accion previa__accion--ppal" href={mailtoCliente}>
          📧 Abrir en mi correo
        </a>
        <button className="previa__accion" onClick={() => window.print()}>
          📄 Descargar cotización PDF
        </button>
        <a className="previa__accion" href={mailtoEquipo}>
          📊 Enviar correo al equipo
        </a>
        <button
          className="previa__accion"
          onClick={() => setContratoVisible((v) => !v)}
        >
          📝 Generar contrato
        </button>
      </div>

      {contratoVisible && (
        <div className="previa__contrato">
          <div className="previa__crow">
            <span className="previa__clabel">
              Prompt del contrato — pégalo en Claude / Cowork (con la plantilla
              Kaizen_ContratoMarco_v1)
            </span>
            <button className="previa__ccopy" onClick={copiarPrompt}>
              {copiadoPrompt ? '✓ Copiado' : '📋 Copiar'}
            </button>
          </div>
          <textarea
            className="previa__cprompt"
            readOnly
            rows={12}
            value={promptContrato}
          />
        </div>
      )}

      {/* ── 1 · CORREO AL CLIENTE (modo claro, sin costo/margen) ── */}
      <article className="previa__mail" data-mode="light">
        <header className="previa__mhead">
          <span className="previa__mtag">📧 Para el cliente</span>
          <div className="previa__mmeta">
            <span>
              <b>Para:</b> {correo.trim() || 'cliente@empresa.com'}
            </span>
            <span>
              <b>De:</b> {EMPRESA.marca} · {EMPRESA.correoRemitente}
            </span>
            <span>
              <b>Asunto:</b> Tu cotización de {EMPRESA.marca} — lista para firmar
            </span>
          </div>
        </header>

        <div className="previa__mbody">
          <p>Hola, 👋</p>
          <p>
            Gracias por confiar en {EMPRESA.marca}. Aquí está tu cotización. Para
            arrancar solo tienes que firmarla digitalmente y abonar el anticipo.
          </p>

          <table className="previa__tabla">
            <tbody>
              {lineas.map((l) => (
                <tr key={l.uid}>
                  <td>
                    {l.nombre}
                    {l.cantidad > 1 && <span className="previa__x"> × {l.cantidad}</span>}
                  </td>
                  <td className="previa__num">
                    {cop(precioAjustado(l.precio, margenPermitido) * l.cantidad)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {cliente.descuentoAplicado && (
                <tr className="previa__desc">
                  <td>Descuento 1ª compra</td>
                  <td className="previa__num">
                    − {cop(cliente.honorarioPleno - cliente.honorario)}
                  </td>
                </tr>
              )}
              <tr>
                <td>Honorario profesional</td>
                <td className="previa__num">{cop(cliente.honorario)}</td>
              </tr>
              <tr>
                <td>IVA 19%</td>
                <td className="previa__num">{cop(cliente.iva)}</td>
              </tr>
              <tr className="previa__total">
                <td>Total</td>
                <td className="previa__num">{cop(cliente.total)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="previa__pago">
            <p className="previa__psub">Para arrancar</p>
            <p>
              <b>Anticipo {pct(EMPRESA.anticipoPct, 0)}:</b> {cop(anticipo)} ·{' '}
              <b>Saldo:</b> {cop(saldo)} {EMPRESA.saldoTexto}.
            </p>
            <p className="previa__pnota">{EMPRESA.anticipoNota}</p>
            <ul className="previa__cuentas">
              {EMPRESA.cuentas.map((c, i) => (
                <li key={i}>
                  <b>{c.banco}</b> · {c.tipo} {c.numero} · {c.titular}
                </li>
              ))}
            </ul>
          </div>

          <p className="previa__firma">
            <span className="previa__sign">📄 Documento para firmar — Adobe Acrobat Sign</span>
            {EMPRESA.razonSocial} · NIT {EMPRESA.nit}
            <br />
            {EMPRESA.marca} · {EMPRESA.contacto}
            <br />
            <span className="previa__validez">
              Cotización válida por {EMPRESA.validezDias} días.
            </span>
          </p>
        </div>
      </article>

      {/* ── 2 · PRESUPUESTO INTERNO (capa B, colapsado, solo David) ── */}
      <details className="presu">
        <summary className="presu__sum">
          🔒 Presupuesto interno (solo tú) — {EMPRESA.correoInterno} · cc{' '}
          {EMPRESA.correoInternoCC}
        </summary>
        <div className="presu__body">
          <div className="presu__datos">
            <span>
              <b>Cliente:</b> {correo.trim() || '—'}
            </span>
            <span>
              <b>Fecha:</b> {hoyLargo()}
            </span>
            <span>
              <b>Responsable:</b> David · {EMPRESA.razonSocial}
            </span>
          </div>

          <p className="presu__seccion">Costo del proyecto</p>
          <table className="presu__tabla">
            <tbody>
              {lineas.map((l) => (
                <tr key={l.uid}>
                  <td>
                    {l.nombre}
                    {l.cantidad > 1 && <span className="previa__x"> × {l.cantidad}</span>}
                  </td>
                  <td className="previa__num">{cop(l.costoReal * l.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="presu__seccion">Cálculo final</p>
          <dl className="presu__calc">
            <div>
              <dt>Costo directo total</dt>
              <dd>{cop(interna.costoReal)}</dd>
            </div>
            <div>
              <dt>Honorario (precio sin IVA)</dt>
              <dd>{cop(interna.precioAplicado)}</dd>
            </div>
            <div>
              <dt>IVA 19% (lo paga el cliente)</dt>
              <dd>{cop(interna.iva)}</dd>
            </div>
            <div>
              <dt>Total al cliente</dt>
              <dd>{cop(interna.totalCliente)}</dd>
            </div>
          </dl>

          <p className="presu__seccion">Indicadores</p>
          <dl className="presu__calc">
            <div>
              <dt>RST estimado (5,9%)</dt>
              <dd>{cop(interna.rst)}</dd>
            </div>
            <div className="presu__fuerte">
              <dt>Ganancia neta Kaizen</dt>
              <dd>{cop(interna.gananciaNeta)}</dd>
            </div>
            <div>
              <dt>Margen neto %</dt>
              <dd>{pct(interna.margenNeto)}</dd>
            </div>
          </dl>

          <p className="presu__nota">
            Tu plantilla de Sheets aún trae la línea “Comisión Mirai (15%)”: ya no
            aplica — Mirai es tu empresa, así que eso es tu margen, no un costo.
          </p>
        </div>
      </details>
    </div>
  )
}
