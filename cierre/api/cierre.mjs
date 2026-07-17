/**
 * FUNCIÓN SERVERLESS DE VERCEL — /api/cierre en producción.
 *
 * Es el gemelo del plugin local (server/api-plugin.mjs): misma lógica, mismo
 * contrato de respuesta (200 ok · 207 falló correo o sheet parcialmente · 500
 * error). En dev sigue funcionando el plugin de Vite; Vercel usa este archivo.
 *
 * Los secretos NO viven aquí: se configuran en Vercel → Settings → Environment
 * Variables, con los MISMOS nombres del .env.example (sin prefijo VITE_).
 */

import { handleCierre } from '../server/handler.mjs'

/** Lee el body como JSON aunque el runtime no lo haya parseado ya. */
async function bodyJson(req) {
  if (req.body !== undefined && req.body !== null) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  }
  let data = ''
  for await (const chunk of req) {
    data += chunk
    if (data.length > 2_000_000) throw new Error('Payload demasiado grande')
  }
  return data ? JSON.parse(data) : {}
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' })
    return
  }
  try {
    const body = await bodyJson(req)
    const result = await handleCierre(body, process.env)
    res.status(result.ok ? 200 : 207).json(result)
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e?.message || e) })
  }
}
