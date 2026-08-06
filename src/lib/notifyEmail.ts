import nodemailer from 'nodemailer'

// ─────────────────────────────────────────────────────────────────────────────
// Notificación por email cuando entra un lead nuevo — mismo patrón SMTP que
// ya usa /cierre (nodemailer). Requiere 3 env vars (ver .env.example):
//   SMTP_HOST, SMTP_USER, SMTP_PASSWORD
// SMTP_PORT, EMAIL_FROM y LEAD_NOTIFY_EMAIL son opcionales (defaults abajo).
// ─────────────────────────────────────────────────────────────────────────────

function buildLeadEmailText(payload: Record<string, unknown>): string {
  const s = (v: unknown) => (v === undefined || v === null || v === '' ? '—' : String(v))
  const lines = [
    `Tipo: ${s(payload.type)}`,
    `Nombre: ${s(payload.name)}`,
    `Email: ${s(payload.email)}`,
    `Teléfono: ${s(payload.phone)}`,
    `País: ${s(payload.country)}`,
    `Negocio: ${s(payload.business)}`,
    `Sitio web: ${s(payload.website)}`,
    `Interés: ${s(payload.interest)}${payload.interestOther ? ` (${s(payload.interestOther)})` : ''}`,
    `Moneda: ${s(payload.currency)}`,
    `Facturación: ${s(payload.revenue)}`,
    `Presupuesto: ${s(payload.budget)}`,
    `Plazo: ${s(payload.timeline)}`,
    `Calificado: ${payload.qualified === true ? 'Sí' : payload.qualified === false ? 'No' : '—'}`,
    payload.disqualifiedReason ? `Motivo descalificación: ${s(payload.disqualifiedReason)}` : null,
    `Mensaje: ${s(payload.message)}`,
  ]
  return lines.filter((l): l is string => l !== null).join('\n')
}

export async function notifyNewLead(payload: Record<string, unknown>): Promise<void> {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const password = process.env.SMTP_PASSWORD
  if (!host || !user || !password) throw new Error('faltan env vars de SMTP')

  const port = Number(process.env.SMTP_PORT || 465)
  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL directo · 587 = STARTTLS
    auth: { user, pass: password },
  })

  const to = process.env.LEAD_NOTIFY_EMAIL || 'kaisenpoststudio@gmail.com'
  const from = process.env.EMAIL_FROM || user
  const name = typeof payload.name === 'string' && payload.name ? payload.name : 'sin nombre'

  await transport.sendMail({
    from,
    to,
    subject: `Nuevo lead (${String(payload.type ?? 'lead')}) — ${name}`,
    text: buildLeadEmailText(payload),
  })
}
