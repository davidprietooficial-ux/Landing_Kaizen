/**
 * VERIFICADOR DE CREDENCIALES — uso: npm run check-setup
 *
 * Revisa el .env y prueba de verdad la conexión a correo (SMTP) y a Google Sheets,
 * y dice en español claro qué está bien y qué falta. No envía correos ni crea nada.
 */

import { verifyEmail } from '../server/email.mjs'
import { verifySheets } from '../server/sheets.mjs'
import { verifyGoHighLevel } from '../server/gohighlevel.mjs'

try {
  process.loadEnvFile() // carga .env en process.env (Node 20.12+)
} catch {
  console.log('\n⚠️  No encontré el archivo .env en esta carpeta. Créalo (copia de .env.example).\n')
  process.exit(1)
}
const env = process.env

console.log('\n🔍 Verificando credenciales de Kaizen Cierre\n' + '─'.repeat(48))

let okCount = 0

// ── Correo (SMTP) ──
process.stdout.write('📧 Correo (SMTP)   … ')
try {
  const r = await verifyEmail(env)
  if (r.ok) {
    console.log('✅ OK — conexión y credenciales válidas')
    okCount++
  } else {
    console.log(`❌ ${r.motivo || r.error}`)
  }
} catch (e) {
  console.log(`❌ ${e?.message || e}`)
}

// ── Google Sheets ──
process.stdout.write('📊 Google Sheets   … ')
try {
  const r = await verifySheets(env)
  if (r.ok) {
    console.log(`✅ OK — plantilla "${r.plantilla}" accesible`)
    okCount++
  } else {
    console.log(`❌ ${r.motivo || r.error}`)
  }
} catch (e) {
  const msg = String(e?.message || e)
  console.log(`❌ ${msg}`)
}

// ── GoHighLevel (opcional) — no cuenta para el núcleo (correo + Sheets) ──
process.stdout.write('🔗 GoHighLevel     … ')
try {
  const r = verifyGoHighLevel(env)
  if (r.ok) console.log(`✅ OK — webhook configurado (${r.host})`)
  else if (r.skipped) console.log('➖ sin configurar (opcional) — el cierre funciona sin CRM')
  else console.log(`❌ ${r.motivo}`)
} catch (e) {
  console.log(`❌ ${e?.message || e}`)
}

console.log('─'.repeat(48))
if (okCount === 2) {
  console.log('🎉 Núcleo listo (correo + Sheets). El cierre real está activo.\n')
} else {
  console.log(`Faltan ${2 - okCount} de 2 del núcleo. Revisa SETUP-APIS.md para arreglarlo.\n`)
}
