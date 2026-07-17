/**
 * GOHIGHLEVEL — envía la cotización/lead a un webhook ENTRANTE de GHL.
 *
 * Diseño "best-effort" (igual que Sheets): si no está configurado o falla, NO
 * rompe el cierre — el correo sigue siendo el núcleo.
 *
 * El cliente YA existe en el CRM cuando llega a la calculadora. GHL de-duplica el
 * contacto por email, así que este webhook ACTUALIZA el contacto existente (no
 * crea duplicados) y dispara el workflow: cambiar la etapa del lead, programar el
 * seguimiento, mandar recordatorios, etc.
 *
 * ⚠️ Solo se envían datos que el cliente YA ve en su cotización. NUNCA se manda
 * información confidencial (costo, margen, ganancia) al CRM.
 */

const TIMEOUT_MS = 8000

/**
 * POST del payload `crm` al webhook entrante de GHL (env.GHL_WEBHOOK_URL).
 * Devuelve {ok, ...} sin lanzar: el handler decide qué hacer con el estado.
 */
export async function sendToGoHighLevel(env, crm) {
  const url = env.GHL_WEBHOOK_URL
  if (!url) return { ok: false, skipped: true, error: 'GHL_WEBHOOK_URL no configurada' }
  if (!crm || !crm.email) return { ok: false, error: 'Falta el email del cliente para conectar con el CRM' }

  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(crm),
      signal: ctrl.signal,
    })
    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      return { ok: false, error: `GHL respondió ${res.status}${txt ? ` — ${txt.slice(0, 200)}` : ''}` }
    }
    return { ok: true, status: res.status, evento: crm.evento }
  } catch (e) {
    const msg = e?.name === 'AbortError' ? `sin respuesta en ${TIMEOUT_MS} ms` : String(e?.message || e)
    return { ok: false, error: msg }
  } finally {
    clearTimeout(t)
  }
}

/**
 * Verificación para `npm run check-setup`: NO hace POST (eso dispararía el
 * workflow real). Solo comprueba que la URL esté configurada y bien formada.
 */
export function verifyGoHighLevel(env) {
  const url = env.GHL_WEBHOOK_URL
  if (!url) return { ok: false, skipped: true, motivo: 'sin configurar (opcional)' }
  try {
    const u = new URL(url)
    if (u.protocol !== 'https:') return { ok: false, motivo: 'la URL debe empezar por https://' }
    return { ok: true, host: u.host }
  } catch {
    return { ok: false, motivo: 'GHL_WEBHOOK_URL no es una URL válida' }
  }
}
