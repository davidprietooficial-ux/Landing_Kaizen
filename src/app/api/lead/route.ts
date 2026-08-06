import type { NextRequest } from 'next/server'
import { appendLeadRow } from '@/lib/googleSheets'

// ─────────────────────────────────────────────────────────────────────────────
// Captura de leads → Google Sheets (+ GoHighLevel si está conectado). Alimenta
// 3 orígenes distintos, todos con la misma forma de payload (`type` los
// distingue del otro lado):
//   - 'lead'       — QualifyForm.tsx (los 2 pasos de calificación)
//   - 'newsletter' — Footer.tsx (solo email)
//   - 'careers'    — sección "Trabaja con nosotros" en /quienes-somos
//
// El formulario hace POST aquí; nosotros escribimos/reenviamos a:
//   1. Google Sheets, vía la API oficial con cuenta de servicio (googleSheets.ts).
//   2. Inbound Webhook de GHL, si ya está configurado (opcional).
// Las credenciales viven SOLO en el servidor (env vars), nunca en el
// navegador. El cálculo de `qualified` (y el motivo) ya viene hecho desde el
// cliente (QualifyForm) — aquí solo se reenvía.
//
// Si ninguna de las dos está configurada todavía, NO rompemos el formulario:
// el lead se registra en los logs (Vercel → Deployments → Functions) para no
// perderlo, y el usuario sigue viendo su resultado / calendario con normalidad.
// ─────────────────────────────────────────────────────────────────────────────

// Mismo orden de columnas que la hoja "Leads" — ver instrucciones de setup.
function toSheetRow(payload: Record<string, unknown>): (string | number)[] {
  const s = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v))
  return [
    s(payload.receivedAt), s(payload.type), s(payload.locale),
    s(payload.name), s(payload.email), s(payload.phone), s(payload.country), s(payload.business), s(payload.website),
    s(payload.interest), s(payload.interestOther), s(payload.currency), s(payload.project),
    s(payload.revenue), s(payload.budget), s(payload.timeline),
    payload.qualified === true ? 'Sí' : payload.qualified === false ? 'No' : '',
    s(payload.disqualifiedReason),
    s(payload.area), s(payload.portfolio), s(payload.message),
  ]
}

export async function POST(req: NextRequest) {
  let data: Record<string, unknown>
  try {
    data = await req.json()
  } catch {
    return Response.json({ ok: false, error: 'bad-json' }, { status: 400 })
  }

  // Anti-spam mínimo: campos obligatorios y honeypot (campo oculto que solo
  // rellenan los bots). Si viene relleno, fingimos éxito y descartamos.
  if (typeof data.hp === 'string' && data.hp.length > 0) {
    return Response.json({ ok: true, forwarded: false })
  }
  if (!data.name || !data.email) {
    return Response.json({ ok: false, error: 'missing-fields' }, { status: 400 })
  }

  const payload = { ...data, receivedAt: new Date().toISOString() }
  const sheetsConfigured = !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
    process.env.GOOGLE_SHEET_ID
  )
  const ghlWebhook = process.env.GHL_WEBHOOK_URL

  if (!sheetsConfigured && !ghlWebhook) {
    // Nada conectado todavía: no perdemos el lead, queda en los logs del servidor.
    console.log('[lead] sin destino configurado todavía →', JSON.stringify(payload))
    return Response.json({ ok: true, forwarded: false })
  }

  const [sheetsResult, ghlResult] = await Promise.allSettled([
    sheetsConfigured ? appendLeadRow(toSheetRow(payload)) : Promise.resolve(null),
    ghlWebhook
      ? fetch(ghlWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : Promise.resolve(null),
  ])

  if (sheetsResult.status === 'rejected') console.error('[lead] error escribiendo en Google Sheets:', sheetsResult.reason)

  if (ghlResult.status === 'rejected') console.error('[lead] error reenviando a GHL:', ghlResult.reason)
  else if (ghlResult.value && !ghlResult.value.ok) console.error('[lead] GHL respondió', ghlResult.value.status)

  // No bloqueamos la UX del usuario por un fallo en algún destino: si al menos
  // uno de los configurados quedó ok, respondemos ok.
  const anyConfiguredOk =
    (!sheetsConfigured || sheetsResult.status === 'fulfilled') &&
    (!ghlWebhook || (ghlResult.status === 'fulfilled' && ghlResult.value?.ok))

  return Response.json({ ok: anyConfiguredOk, forwarded: true })
}
