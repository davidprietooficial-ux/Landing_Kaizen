import { createSign } from 'crypto'

// ─────────────────────────────────────────────────────────────────────────────
// Escribe leads directo en Google Sheets vía la API oficial (cuenta de
// servicio), sin pasar por un Web App de Apps Script. Evita por completo las
// restricciones de "compartir" de Workspace/Apps Script que bloqueaban el
// enfoque anterior.
//
// Requiere 3 env vars (ver .env.local):
//   GOOGLE_SERVICE_ACCOUNT_EMAIL
//   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
//   GOOGLE_SHEET_ID
// GOOGLE_SHEET_TAB_NAME es opcional (default 'Leads').
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets'

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString('base64url')
}

async function getAccessToken(email: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claims = { iss: email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }
  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`
  const signature = createSign('RSA-SHA256').update(signingInput).sign(privateKey)
  const jwt = `${signingInput}.${base64url(signature)}`

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  if (!res.ok) throw new Error(`google oauth token exchange falló: ${res.status} ${await res.text()}`)
  const json = (await res.json()) as { access_token: string }
  return json.access_token
}

export async function appendLeadRow(row: (string | number)[]): Promise<void> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  const sheetId = process.env.GOOGLE_SHEET_ID
  const tab = process.env.GOOGLE_SHEET_TAB_NAME || 'Leads'
  if (!email || !rawKey || !sheetId) throw new Error('faltan env vars de Google Sheets')

  // Hostinger envuelve el valor en comillas simples y/o dobles al guardarlo
  // como env var del panel (a veces ambas anidadas) — las quitamos todas de
  // los extremos, junto con el \n escapado.
  const privateKey = rawKey.replace(/^['"]+|['"]+$/g, '').replace(/\\n/g, '\n')

  // TEMPORAL: diagnóstico del formato real del env var en runtime, sin
  // exponer la clave completa. Quitar una vez resuelto.
  const codes = (s: string) => Array.from(s).map((c) => c.charCodeAt(0)).join(',')
  console.log(
    '[debug-key] len:', rawKey.length,
    'raw_first15_codes:', codes(rawKey.slice(0, 15)),
    'raw_last15_codes:', codes(rawKey.slice(-15)),
    'clean_first15_codes:', codes(privateKey.slice(0, 15)),
    'clean_last15_codes:', codes(privateKey.slice(-15)),
  )
  const token = await getAccessToken(email, privateKey)
  const range = encodeURIComponent(`${tab}!A:A`)

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [row] }),
    },
  )
  if (!res.ok) throw new Error(`sheets append falló: ${res.status} ${await res.text()}`)
}
