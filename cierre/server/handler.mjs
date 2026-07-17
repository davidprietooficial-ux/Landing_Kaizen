/**
 * HANDLER DEL CIERRE — orquesta el envío real cuando el cotizador hace POST.
 *
 * Ejecuta correo y Sheets de forma independiente: si uno falla, el otro sigue, y
 * se reporta el estado de cada paso. El correo es el núcleo; Sheets es secundario.
 */

import { sendCierreEmails } from './email.mjs'
import { createCosteoSheet } from './sheets.mjs'
import { sendToGoHighLevel } from './gohighlevel.mjs'

export async function handleCierre(body, env) {
  const result = { ok: false, email: null, sheet: null, ghl: null }

  // ── Correo (cliente + presupuesto interno) ──
  try {
    result.email = await sendCierreEmails(env, body)
  } catch (e) {
    result.email = { ok: false, error: String(e?.message || e) }
  }

  // ── Google Sheets (duplicar plantilla + volcar costeo) ──
  try {
    result.sheet = await createCosteoSheet(env, body.sheet, body.emailEquipo?.to)
  } catch (e) {
    result.sheet = { ok: false, error: String(e?.message || e) }
  }

  // ── GoHighLevel (actualizar el lead en el CRM + disparar el seguimiento) ──
  try {
    result.ghl = await sendToGoHighLevel(env, body.crm)
  } catch (e) {
    result.ghl = { ok: false, error: String(e?.message || e) }
  }

  // El cierre se considera OK si al menos los correos salieron.
  result.ok = !!result.email?.ok
  return result
}
