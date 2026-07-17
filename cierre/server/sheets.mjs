/**
 * GOOGLE SHEETS — registra cada cierre como una pestaña nueva dentro de un
 * cuaderno que David ya posee (GOOGLE_SHEETS_TARGET_ID).
 *
 * Por qué NO duplicamos la plantilla: una service account en un Gmail personal no
 * tiene almacenamiento, así que no puede crear/copiar archivos (error "storage
 * quota exceeded"). En cambio, AGREGAR una pestaña a un archivo existente que es
 * de David no crea archivo nuevo → funciona siempre. David comparte ese cuaderno
 * con la cuenta robot como Editor.
 */

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
]

async function getClients(env) {
  const { google } = await import('googleapis')
  const key = (env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n') // .env escapa saltos
  const auth = new google.auth.JWT({ email: env.GOOGLE_SHEETS_CLIENT_EMAIL, key, scopes: SCOPES })
  return { sheets: google.sheets({ version: 'v4', auth }) }
}

/** ¿Están las variables de Sheets y tienen forma válida? (no prueba acceso) */
export function sheetsConfigStatus(env) {
  const email = env.GOOGLE_SHEETS_CLIENT_EMAIL
  const key = env.GOOGLE_SHEETS_PRIVATE_KEY || ''
  const target = env.GOOGLE_SHEETS_TARGET_ID || ''
  const faltan = [
    !email && 'GOOGLE_SHEETS_CLIENT_EMAIL',
    !key && 'GOOGLE_SHEETS_PRIVATE_KEY',
    !target && 'GOOGLE_SHEETS_TARGET_ID',
  ].filter(Boolean)
  if (faltan.length) return { ok: false, motivo: `Faltan variables en .env: ${faltan.join(', ')}` }
  if (!key.includes('BEGIN PRIVATE KEY')) {
    return {
      ok: false,
      motivo: 'GOOGLE_SHEETS_PRIVATE_KEY no parece válida (debe empezar con "-----BEGIN PRIVATE KEY-----").',
    }
  }
  if (!/^[a-zA-Z0-9_-]{30,}$/.test(target)) {
    return {
      ok: false,
      motivo: `GOOGLE_SHEETS_TARGET_ID "${target}" no parece un ID de hoja (≈44 caracteres de la URL: .../d/ESTE_ID/edit).`,
    }
  }
  return { ok: true }
}

/** Confirma que el cuaderno de cierres existe y la cuenta robot tiene acceso. */
export async function verifySheets(env) {
  const st = sheetsConfigStatus(env)
  if (!st.ok) return st
  const { sheets } = await getClients(env)
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: env.GOOGLE_SHEETS_TARGET_ID,
    fields: 'properties.title',
  })
  return { ok: true, plantilla: meta.data.properties?.title }
}

/** Agrega una pestaña con los datos del cierre al cuaderno de David. */
export async function createCosteoSheet(env, sheet) {
  const st = sheetsConfigStatus(env)
  if (!st.ok) return { ok: false, error: st.motivo }
  const { sheets } = await getClients(env)
  const spreadsheetId = env.GOOGLE_SHEETS_TARGET_ID

  // Nombre de pestaña corto y único (Google limita a 100 chars y no admite duplicados).
  const base = (sheet.titulo || 'Cierre').replace(/[\\/?*[\]:]/g, ' ').slice(0, 80)
  const metaPrev = await sheets.spreadsheets.get({ spreadsheetId, fields: 'sheets.properties.title' })
  const existentes = new Set((metaPrev.data.sheets || []).map((s) => s.properties.title))
  let title = base
  let i = 2
  while (existentes.has(title)) title = `${base} (${i++})`

  // 1) Crear la pestaña.
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests: [{ addSheet: { properties: { title } } }] },
  })

  // 2) Volcar los datos del cierre.
  const filas = [
    ['CIERRE — DATOS AUTOMÁTICOS'],
    ['Cliente', sheet.cliente],
    ['Fecha', sheet.fecha],
    [],
    ['Concepto', 'Cantidad', 'Costo', 'Honorario'],
    ...sheet.lineas.map((l) => [l.nombre, l.cantidad, l.costo, l.honorario]),
    [],
    ['Costo directo total', '', sheet.costoDirecto],
    ['Honorario (sin IVA)', '', '', sheet.honorario],
    ['IVA 19%', '', '', sheet.iva],
    ['Total al cliente', '', '', sheet.total],
    ['RST (5,9%)', '', '', sheet.rst],
    ['Ganancia neta', '', '', sheet.gananciaNeta],
    ['Margen neto', '', '', sheet.margenNeto],
    ['Anticipo', '', '', sheet.anticipo],
    ['Saldo', '', '', sheet.saldo],
  ]
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'${title}'!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: filas },
  })

  // 3) Enlace directo a la pestaña nueva.
  const metaNow = await sheets.spreadsheets.get({ spreadsheetId, fields: 'sheets.properties' })
  const nueva = (metaNow.data.sheets || []).find((s) => s.properties.title === title)
  const gid = nueva?.properties?.sheetId
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit${gid != null ? `#gid=${gid}` : ''}`
  return { ok: true, url, id: spreadsheetId, tab: title }
}
