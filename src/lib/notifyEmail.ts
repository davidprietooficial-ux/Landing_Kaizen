import nodemailer from 'nodemailer'

// ─────────────────────────────────────────────────────────────────────────────
// Notificación por email cuando entra un lead nuevo — mismo patrón SMTP que
// ya usa /cierre (nodemailer). Requiere 3 env vars (ver .env.example):
//   SMTP_HOST, SMTP_USER, SMTP_PASSWORD
// SMTP_PORT, EMAIL_FROM y LEAD_NOTIFY_EMAIL son opcionales (defaults abajo).
// ─────────────────────────────────────────────────────────────────────────────

const FIELD_LABELS: [string, string][] = [
  ['phone', 'Teléfono'],
  ['country', 'País'],
  ['business', 'Negocio'],
  ['website', 'Sitio web'],
  ['interest', 'Interés'],
  ['currency', 'Moneda'],
  ['revenue', 'Facturación'],
  ['budget', 'Presupuesto'],
  ['timeline', 'Plazo'],
  ['message', 'Mensaje'],
]

function str(v: unknown): string {
  return v === undefined || v === null || v === '' ? '' : String(v)
}

function escapeHtml(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildLeadEmailText(payload: Record<string, unknown>): string {
  const s = (v: unknown) => (str(v) ? str(v) : '—')
  const lines = [
    `Tipo: ${s(payload.type)}`,
    `Nombre: ${s(payload.name)}`,
    `Email: ${s(payload.email)}`,
    ...FIELD_LABELS.map(([key, label]) => `${label}: ${s(payload[key])}`),
    `Calificado: ${payload.qualified === true ? 'Sí' : payload.qualified === false ? 'No' : '—'}`,
    payload.disqualifiedReason ? `Motivo descalificación: ${s(payload.disqualifiedReason)}` : null,
  ]
  return lines.filter((l): l is string => l !== null).join('\n')
}

function buildLeadEmailHtml(payload: Record<string, unknown>): string {
  const name = str(payload.name) || 'Sin nombre'
  const email = str(payload.email)
  const phone = str(payload.phone)
  const phoneDigits = phone.replace(/\D/g, '')
  const qualified = payload.qualified === true

  const rows = FIELD_LABELS
    .filter(([key]) => key !== 'phone') // el teléfono ya va en los botones de contacto
    .map(([key, label]) => {
      const value = str(payload[key])
      if (!value) return ''
      const extra = key === 'interest' && payload.interestOther ? ` (${escapeHtml(str(payload.interestOther))})` : ''
      return `<tr>
        <td style="padding:6px 0;color:#888888;font-size:13px;width:130px;vertical-align:top;">${label}</td>
        <td style="padding:6px 0;color:#1a1a1a;font-size:14px;vertical-align:top;">${escapeHtml(value)}${extra}</td>
      </tr>`
    })
    .join('')

  const disqualifiedRow = !qualified && payload.disqualifiedReason
    ? `<tr>
        <td style="padding:6px 0;color:#888888;font-size:13px;width:130px;vertical-align:top;">Motivo</td>
        <td style="padding:6px 0;color:#1a1a1a;font-size:14px;vertical-align:top;">${escapeHtml(str(payload.disqualifiedReason))}</td>
      </tr>`
    : ''

  const emailBtn = email
    ? `<td style="padding-right:10px;">
        <a href="mailto:${escapeHtml(email)}" style="display:inline-block;background:#111111;color:#ffffff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">Responder por email</a>
      </td>`
    : ''

  const whatsappBtn = phoneDigits
    ? `<td>
        <a href="https://wa.me/${phoneDigits}" style="display:inline-block;background:#25D366;color:#ffffff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">WhatsApp</a>
      </td>`
    : ''

  return `
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
  <tr>
    <td style="background:#111111;padding:20px 24px;border-radius:12px 12px 0 0;">
      <span style="display:inline-block;padding:3px 10px;border-radius:999px;background:${qualified ? '#16351f' : '#3a2f0a'};color:${qualified ? '#4ade80' : '#facc15'};font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;">${qualified ? 'Calificado' : 'Sin calificar'}</span>
      <div style="color:#ffffff;font-size:20px;font-weight:700;margin-top:8px;">${escapeHtml(name)}</div>
      ${email ? `<div style="color:#999999;font-size:13px;margin-top:2px;">${escapeHtml(email)}${phone ? ` · ${escapeHtml(phone)}` : ''}</div>` : ''}
    </td>
  </tr>
  <tr>
    <td style="background:#ffffff;border:1px solid #e5e5e5;border-top:none;padding:20px 24px;border-radius:0 0 12px 12px;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
        ${rows}
        ${disqualifiedRow}
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;">
        <tr>
          ${emailBtn}
          ${whatsappBtn}
        </tr>
      </table>
    </td>
  </tr>
</table>`
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
    html: buildLeadEmailHtml(payload),
  })
}
