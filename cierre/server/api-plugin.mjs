/**
 * PLUGIN DE VITE — añade el backend (/api/cierre) al mismo dev server.
 *
 * Ventajas para una herramienta local: un solo proceso (`npm run dev`), sin CORS
 * (mismo origen) y los secretos del .env quedan en Node, NUNCA en el bundle del
 * navegador (Vite solo expone al cliente lo que lleva prefijo VITE_).
 *
 * Solo opera en modo dev. Si algún día se despliega como estático, estos endpoints
 * habría que moverlos a funciones serverless (la lógica de server/ se reutiliza tal cual).
 */

import { loadEnv } from 'vite'
import { handleCierre } from './handler.mjs'

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c) => {
      data += c
      if (data.length > 2_000_000) reject(new Error('Payload demasiado grande'))
    })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

export function kaizenApiPlugin() {
  let env = {}
  return {
    name: 'kaizen-api',
    // Carga TODAS las variables del .env (incluidas las sin prefijo VITE_, que son
    // los secretos). Quedan solo aquí, en el proceso de Node del dev server.
    configResolved(config) {
      env = loadEnv(config.mode, process.cwd(), '')
    },
    configureServer(server) {
      server.middlewares.use('/api/cierre', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        res.setHeader('content-type', 'application/json; charset=utf-8')
        try {
          const body = await readJson(req)
          const result = await handleCierre(body, env)
          res.statusCode = result.ok ? 200 : 207 // 207 = correo o sheet falló parcialmente
          res.end(JSON.stringify(result))
        } catch (e) {
          res.statusCode = 500
          res.end(JSON.stringify({ ok: false, error: String(e?.message || e) }))
        }
      })
    },
  }
}
