/**
 * BUILDER DEL PAYLOAD DE CIERRE
 *
 * Arma, EN EL FRONTEND, todo lo que el backend necesita para ejecutar el cierre:
 *   - emailCliente  → cotización lista para firmar (modo cliente, sin costo/margen).
 *   - emailEquipo   → presupuesto interno (capa B) para David.
 *   - sheet         → datos estructurados para llenar la plantilla de costeo en Sheets.
 *
 * Cada correo se manda en HTML (plantilla con la identidad de Kaizen) + texto plano
 * de respaldo. El backend solo "envía" — no reconstruye texto ni números.
 */

import { EMPRESA } from '../config/empresa.config'
import { cop, pct } from '../lib/format'
import { precioAjustado, anticipoSaldo } from './cotizacion'
import type { Linea, VistaCliente, VistaInterna } from './cotizacion'

export interface CierrePayload {
  correoCliente: string
  emailCliente: { subject: string; text: string; html: string }
  emailEquipo: { to: string; cc: string; subject: string; text: string; html: string }
  sheet: {
    titulo: string
    cliente: string
    fecha: string
    lineas: { nombre: string; cantidad: number; costo: number; honorario: number }[]
    costoDirecto: number
    honorario: number
    iva: number
    total: number
    rst: number
    gananciaNeta: number
    margenNeto: number
    anticipo: number
    saldo: number
  }
  /** Datos para el webhook de GoHighLevel. SOLO lo que el cliente ya ve en su
   *  cotización — NUNCA costo, margen ni ganancia (eso es confidencial). El email
   *  es la llave con la que GHL encuentra y actualiza el contacto que ya existe. */
  crm: {
    email: string
    /** Etiqueta del evento para disparar el workflow correcto en GHL. */
    evento: string
    fuente: string
    /** Fecha del cierre (ISO YYYY-MM-DD). */
    fecha: string
    moneda: string
    total: number
    honorario: number
    iva: number
    anticipo: number
    saldo: number
    /** Piezas cotizadas, en una línea legible. */
    items: string
    items_cantidad: number
    validez_dias: number
    /** Fecha en que vence la cotización (ISO) — para recordatorios en GHL. */
    vence: string
    /** Fecha sugerida para el primer seguimiento (ISO). */
    seguimiento_sugerido: string
  }
}

/** Lo que devuelve el backend tras intentar el cierre (correo + Sheets + CRM). */
export interface CierreResultado {
  ok: boolean
  error?: string
  email: { ok: boolean; error?: string; cliente?: string; equipo?: string } | null
  sheet: { ok: boolean; error?: string; url?: string; id?: string } | null
  ghl: { ok: boolean; skipped?: boolean; error?: string; status?: number; evento?: string } | null
}

function hoyLargo(): string {
  return new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Fecha de hoy en ISO (YYYY-MM-DD), el formato que esperan los campos de GHL. */
function hoyISO(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Hoy + `dias` en ISO (YYYY-MM-DD). Para vencimiento y seguimiento del CRM. */
function sumarDiasISO(dias: number): string {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return d.toISOString().slice(0, 10)
}

/** Escapa texto para incrustarlo seguro en HTML. */
function esc(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ── Plantilla HTML compartida (paleta clara de marca: documentos de cliente) ──
function emailShell(opts: {
  preheader: string
  badge?: string
  badgeColor?: string
  body: string
  footer: string
}): string {
  const badge = opts.badge
    ? `<span style="float:right;font-family:'DM Sans',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:${
        opts.badgeColor || '#e8c97a'
      };border:1px solid ${opts.badgeColor || '#e8c97a'};padding:3px 9px;border-radius:100px;">${esc(
        opts.badge,
      )}</span>`
    : ''
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"></head>
<body style="margin:0;padding:0;background:#f2f0eb;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f0eb;padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#fafaf8;border:1px solid #e6e2d8;border-radius:14px;overflow:hidden;">
      <tr><td style="background:#0c0c0a;padding:22px 30px;">
        <span style="font-family:'Syne','Helvetica Neue',Arial,sans-serif;font-weight:800;font-size:20px;color:#e8c97a;letter-spacing:-0.01em;">Kaizen Studios</span>${badge}
      </td></tr>
      <tr><td style="padding:30px;font-family:'DM Sans','Helvetica Neue',Arial,sans-serif;color:#1a1a17;font-size:15px;line-height:1.6;">${opts.body}</td></tr>
      <tr><td style="background:#f2f0eb;padding:18px 30px;border-top:1px solid #e6e2d8;font-family:'DM Sans',Arial,sans-serif;color:#6a6660;font-size:12px;line-height:1.6;">${opts.footer}</td></tr>
    </table>
  </td></tr>
</table>
</body></html>`
}

const SUBLABEL =
  "font-family:'Syne',Arial,sans-serif;font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;color:#8a6520;"

/** Correo HTML para el CLIENTE: cotización para firmar (sin costo ni margen). */
function htmlCliente(
  lineas: Linea[],
  margenPermitido: number,
  cliente: VistaCliente,
  anticipo: number,
): string {
  const items = lineas
    .map(
      (l) =>
        `<tr><td style="padding:9px 0;border-bottom:1px solid #ece8de;">${esc(l.nombre)}${
          l.cantidad > 1 ? ` <span style="color:#6a6660;">× ${l.cantidad}</span>` : ''
        }</td><td align="right" style="padding:9px 0;border-bottom:1px solid #ece8de;white-space:nowrap;">${cop(
          precioAjustado(l.precio, margenPermitido) * l.cantidad,
        )}</td></tr>`,
    )
    .join('')
  const cuentas = EMPRESA.cuentas
    .map((c) => `${esc(c.banco)} · ${esc(c.tipo)} ${esc(c.numero)} · ${esc(c.titular)}`)
    .join('<br>')
  const body = `
    <p style="margin:0 0 14px;">Hola,</p>
    <p style="margin:0 0 22px;">Gracias por confiar en <strong>${esc(EMPRESA.marca)}</strong>. Aquí está tu cotización:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${items}</table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0 24px;">
      <tr><td style="padding:5px 0;color:#6a6660;">Honorario profesional</td><td align="right" style="padding:5px 0;">${cop(cliente.honorario)}</td></tr>
      <tr><td style="padding:5px 0;color:#6a6660;">IVA 19%</td><td align="right" style="padding:5px 0;">${cop(cliente.iva)}</td></tr>
      <tr><td style="padding:12px 0 0;border-top:2px solid #1a1a17;font-family:'Syne',Arial,sans-serif;font-weight:800;font-size:18px;">Total</td><td align="right" style="padding:12px 0 0;border-top:2px solid #1a1a17;font-family:'Syne',Arial,sans-serif;font-weight:800;font-size:18px;color:#8a6520;">${cop(cliente.total)}</td></tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f0eb;border-radius:8px;margin:0 0 22px;">
      <tr><td style="padding:14px 18px;border-left:3px solid #8a6520;border-radius:8px;">
        <strong style="display:block;margin-bottom:4px;">Para arrancar</strong>
        Anticipo ${pct(EMPRESA.anticipoPct, 0)}: <strong>${cop(anticipo)}</strong><br>
        <span style="color:#6a6660;font-size:13px;">${esc(EMPRESA.anticipoNota)}</span>
      </td></tr>
    </table>
    <p style="margin:0 0 4px;font-weight:600;">Pago</p>
    <p style="margin:0;color:#3a3a36;">${cuentas}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;">
      <tr><td align="center" style="background:#fceaea;border:1px solid #f1bcbc;border-radius:10px;padding:16px;font-family:'Syne','Helvetica Neue',Arial,sans-serif;font-weight:800;font-size:19px;color:#d92d2d;letter-spacing:-0.01em;">
        ⏳ Cotización válida por ${EMPRESA.validezDias} días
      </td></tr>
    </table>`
  const footer = `${esc(EMPRESA.contacto)}<br><strong>${esc(EMPRESA.marca)}</strong>`
  return emailShell({ preheader: `Tu cotización de ${EMPRESA.marca}`, body, footer })
}

/** Correo HTML INTERNO para David: presupuesto con costo, cálculo e indicadores. */
function htmlEquipo(
  lineas: Linea[],
  interna: VistaInterna,
  correo: string,
  fecha: string,
): string {
  const costos = lineas
    .map(
      (l) =>
        `<tr><td style="padding:7px 0;border-bottom:1px solid #ece8de;">${esc(l.nombre)}${
          l.cantidad > 1 ? ` × ${l.cantidad}` : ''
        }</td><td align="right" style="padding:7px 0;border-bottom:1px solid #ece8de;">${cop(
          l.costoReal * l.cantidad,
        )}</td></tr>`,
    )
    .join('')
  const body = `
    <p style="margin:0 0 4px;color:#6a6660;font-size:13px;">${esc(fecha)}</p>
    <p style="margin:0 0 22px;"><strong>Cliente:</strong> ${esc(correo || '—')}<br><span style="color:#6a6660;font-size:13px;">Responsable: David · ${esc(EMPRESA.razonSocial)}</span></p>
    <p style="margin:0 0 6px;${SUBLABEL}">Costo del proyecto</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${costos}
      <tr><td style="padding:9px 0 0;font-weight:600;">Costo directo total</td><td align="right" style="padding:9px 0 0;font-weight:600;">${cop(interna.costoReal)}</td></tr></table>
    <p style="margin:22px 0 6px;${SUBLABEL}">Cálculo final</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr><td style="padding:5px 0;color:#6a6660;">Honorario (sin IVA)</td><td align="right">${cop(interna.precioAplicado)}</td></tr>
      <tr><td style="padding:5px 0;color:#6a6660;">IVA 19%</td><td align="right">${cop(interna.iva)}</td></tr>
      <tr><td style="padding:5px 0;font-weight:600;">Total al cliente</td><td align="right" style="font-weight:600;">${cop(interna.totalCliente)}</td></tr>
    </table>
    <p style="margin:22px 0 6px;${SUBLABEL}">Indicadores</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr><td style="padding:5px 0;color:#6a6660;">RST (5,9%)</td><td align="right">${cop(interna.rst)}</td></tr>
      <tr><td style="padding:5px 0;color:#6a6660;">Ganancia neta</td><td align="right">${cop(interna.gananciaNeta)}</td></tr>
      <tr><td style="padding:9px 0 0;border-top:1px solid #ece8de;font-weight:600;">Margen neto</td><td align="right" style="padding:9px 0 0;border-top:1px solid #ece8de;font-weight:700;color:#1a7a4a;">${pct(interna.margenNeto)}</td></tr>
    </table>`
  const footer = `Presupuesto interno · ${esc(EMPRESA.razonSocial)}<br>Confidencial — no compartir con el cliente.`
  return emailShell({ preheader: 'Presupuesto interno', badge: 'Interno', badgeColor: '#e06b4a', body, footer })
}

export function buildCierrePayload(
  lineas: Linea[],
  margenPermitido: number,
  cliente: VistaCliente,
  interna: VistaInterna,
  correo: string,
): CierrePayload {
  const fecha = hoyLargo()
  const { anticipo, saldo } = anticipoSaldo(cliente.total, EMPRESA.anticipoPct)

  // ── Correo al CLIENTE (cotización para firmar; NUNCA muestra costo ni margen) ──
  const emailCliente = {
    subject: `Tu cotización de ${EMPRESA.marca} — lista para firmar`,
    text: [
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
      `Anticipo ${pct(EMPRESA.anticipoPct, 0)}: ${cop(anticipo)}`,
      EMPRESA.anticipoNota,
      '',
      'Pago:',
      ...EMPRESA.cuentas.map((c) => `${c.banco} · ${c.tipo} ${c.numero} · ${c.titular}`),
      '',
      `*** COTIZACIÓN VÁLIDA POR ${EMPRESA.validezDias} DÍAS ***`,
      '',
      EMPRESA.contacto,
      EMPRESA.marca,
    ].join('\n'),
    html: htmlCliente(lineas, margenPermitido, cliente, anticipo),
  }

  // ── Correo al EQUIPO/DAVID (presupuesto interno; capa B con costo y margen) ──
  const emailEquipo = {
    to: EMPRESA.correoInterno,
    cc: EMPRESA.correoInternoCC,
    subject: `Presupuesto interno — ${correo.trim() || 'cliente'} (${fecha})`,
    text: [
      `Cliente: ${correo.trim() || '—'}`,
      `Fecha: ${fecha}`,
      `Responsable: David · ${EMPRESA.razonSocial}`,
      '',
      'COSTO DEL PROYECTO',
      ...lineas.map(
        (l) =>
          `• ${l.nombre}${l.cantidad > 1 ? ` × ${l.cantidad}` : ''} — costo ${cop(l.costoReal * l.cantidad)}`,
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
    ].join('\n'),
    html: htmlEquipo(lineas, interna, correo.trim(), fecha),
  }

  // ── Datos para la plantilla de costeo en Google Sheets ──
  const sheet = {
    titulo: `Costeo — ${correo.trim() || 'cliente'} — ${fecha}`,
    cliente: correo.trim(),
    fecha,
    lineas: lineas.map((l) => ({
      nombre: l.nombre,
      cantidad: l.cantidad,
      costo: l.costoReal * l.cantidad,
      honorario: precioAjustado(l.precio, margenPermitido) * l.cantidad,
    })),
    costoDirecto: interna.costoReal,
    honorario: interna.precioAplicado,
    iva: interna.iva,
    total: interna.totalCliente,
    rst: interna.rst,
    gananciaNeta: interna.gananciaNeta,
    margenNeto: interna.margenNeto,
    anticipo,
    saldo,
  }

  // ── Datos para GoHighLevel (webhook entrante). Solo lo visible al cliente. ──
  //  Un primer seguimiento sugerido a los 2 días; el vencimiento, según la vigencia
  //  de la cotización. GHL decide qué hacer con estas fechas en su workflow.
  const crm = {
    email: correo.trim(),
    evento: 'cotizacion_enviada',
    fuente: 'Calculadora de cierre Kaizen',
    fecha: hoyISO(),
    moneda: 'COP',
    total: cliente.total,
    honorario: cliente.honorario,
    iva: cliente.iva,
    anticipo,
    saldo,
    items: lineas.map((l) => `${l.nombre}${l.cantidad > 1 ? ` × ${l.cantidad}` : ''}`).join(' · '),
    items_cantidad: lineas.reduce((n, l) => n + l.cantidad, 0),
    validez_dias: EMPRESA.validezDias,
    vence: sumarDiasISO(EMPRESA.validezDias),
    seguimiento_sugerido: sumarDiasISO(2),
  }

  return { correoCliente: correo.trim(), emailCliente, emailEquipo, sheet, crm }
}
