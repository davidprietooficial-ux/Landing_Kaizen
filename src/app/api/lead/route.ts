import type { NextRequest } from 'next/server'

// ─────────────────────────────────────────────────────────────────────────────
// Captura de leads del formulario "Agendar" → GoHighLevel.
// El formulario hace POST aquí; nosotros reenviamos a un Inbound Webhook de GHL
// (workflow trigger). La URL vive SOLO en el servidor (env var), nunca en el
// navegador, para que nadie pueda spamear tu CRM directamente.
//
// Si GHL_WEBHOOK_URL no está configurada todavía, NO rompemos el formulario:
// el lead se registra en los logs (Vercel → Deployments → Functions) para no
// perderlo, y el usuario sigue viendo su resultado / calendario con normalidad.
// ─────────────────────────────────────────────────────────────────────────────

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

  const webhook = process.env.GHL_WEBHOOK_URL
  if (!webhook) {
    // CRM aún sin conectar: no perdemos el lead, queda en los logs del servidor.
    console.log('[lead] GHL sin conectar todavía →', JSON.stringify(data))
    return Response.json({ ok: true, forwarded: false })
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, receivedAt: new Date().toISOString() }),
    })
    if (!res.ok) console.error('[lead] GHL respondió', res.status)
    return Response.json({ ok: res.ok, forwarded: true })
  } catch (err) {
    console.error('[lead] error reenviando a GHL:', err)
    // Aun con fallo del CRM, respondemos ok para no bloquear la UX del usuario.
    return Response.json({ ok: false, forwarded: false }, { status: 502 })
  }
}
