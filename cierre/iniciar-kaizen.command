#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
#  Iniciar Kaizen Cierre — doble clic para abrir la herramienta en tu navegador.
#  100% local: no sube nada a internet, no depende de Claude ni de ninguna API.
# ─────────────────────────────────────────────────────────────────────────────
cd "$(dirname "$0")"

# 1) Verifica que Node esté instalado.
if ! command -v npm >/dev/null 2>&1; then
  echo "⚠️  Falta Node.js. Instálalo gratis desde https://nodejs.org (versión LTS),"
  echo "    luego vuelve a abrir este archivo con doble clic."
  read -n 1 -s -r -p "Presiona una tecla para cerrar…"
  exit 1
fi

# 2) Instala dependencias solo la primera vez.
if [ ! -d node_modules ]; then
  echo "Instalando dependencias por primera vez (tarda ~1 minuto)…"
  npm install || { echo "❌ Falló la instalación."; read -n 1 -s -r; exit 1; }
fi

# 3) Levanta la herramienta y abre el navegador.
echo "Abriendo Kaizen Cierre…  (para cerrar, vuelve aquí y presiona Ctrl+C)"
npm run dev -- --open
