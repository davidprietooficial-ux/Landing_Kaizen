import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Backend local: añade /api/cierre al dev server (correo + Google Sheets).
// La lógica vive en server/ y los secretos del .env quedan solo en Node, nunca
// en el bundle del navegador.
import { kaizenApiPlugin } from './server/api-plugin.mjs'

// El build de `npm run build` sigue siendo estatico (dist/). El backend de cierre
// solo funciona corriendo `npm run dev` (la herramienta se usa en local, asi se lanza).
// base:'./' -> rutas relativas, para que funcione tambien abriendo dist/ sin servidor raiz.
export default defineConfig({
  plugins: [react(), kaizenApiPlugin()],
  base: './',
})
