# Kaizen Cierre — Herramienta interna de cierre + cotizador en vivo

App de Kaizen Studios para usar **durante la reunión de cierre**: presenta cómo
trabaja Kaizen (lienzo), arma la cotización en vivo (cotizador) y al confirmar el
cierre envía los correos (cliente + interno) y crea la hoja de costeo en Google Sheets.

Refleja el modelo **Kaizen 2.0** (jul 2026): Entrada Digital · Sistema de Clientes ·
Sistema Comercial Automático (próximamente) + add-ons audiovisuales.

## Stack

- **Vite + React + TypeScript** — frontend estático.
- **Backend mínimo `/api/cierre`** (correo + Sheets): en dev corre como plugin de Vite
  (`server/api-plugin.mjs`); en Vercel corre como función serverless (`api/cierre.mjs`).
  Ambos reutilizan la misma lógica de `server/`.
- Tests con **vitest** (`npm test`).

## Correr en local

```bash
npm install
npm run dev        # abre http://localhost:5173 (esa URL, no el index.html)
```

Otros comandos:

```bash
npm test           # tests del motor, catálogo y cotización
npm run typecheck  # chequeo de tipos
npm run build      # tsc + vite build → dist/
npm run preview    # sirve el build para verificarlo
```

## Desplegar en Vercel

Ya está desplegada: **https://kaizen-cierre.vercel.app** (proyecto `kaizen-cierre`,
cuenta davidprietooficial). Para publicar cambios:

```bash
npm run deploy     # = vercel deploy --prod --yes
```

- Las variables de entorno (correo + Google Sheets, las de `.env.example` sin prefijo
  `VITE_`) ya están cargadas en Vercel → Settings → Environment Variables. Si cambia
  una credencial: `vercel env rm NOMBRE production` y `vercel env add NOMBRE production`.
- La carpeta `api/` se convierte sola en la función `/api/cierre`.
- ⚠️ **La URL de producción es PÚBLICA** (el plan gratuito no permite exigir login en
  producción; decisión aceptada jul 2026). El bundle contiene costos internos del
  cotizador → NO compartir la URL con clientes ni publicarla. Con Vercel Pro se puede
  activar Vercel Authentication en todas las URLs si algún día se quiere cerrar.

Los assets pesados ya no viven en el repo (ver `public/ASSETS.md`): los videos están
en YouTube y los originales en `../RESPALDO-videos-pesados/` (fuera del proyecto).

## Estructura

```
api/cierre.mjs                Función serverless de Vercel (usa server/)
server/                       Lógica del cierre: handler, email, sheets + plugin de Vite (dev)
src/
├─ config/pricing.config.ts   CONFIG único: constantes de precio
├─ config/empresa.config.ts   Datos de la empresa
├─ engine/pricing.ts          Motor de cálculo (funciones puras)
├─ data/catalog.ts            Catálogo audiovisual: precio + costoReal + horas
├─ lienzo/content.ts          TODO el texto/copy del lienzo (editar aquí)
├─ lienzo/Lienzo.tsx          Presentación cliente (S0–S4)
├─ cotizador/cotizacion.ts    Estado y cálculos de la cotización (capa A/B)
├─ cotizador/Cotizador.tsx    Cotizador en vivo + cierre
└─ cotizador/PanelInterno.tsx Panel interno (⌘⇧K — comentado, ver Cotizador.tsx)
```

## Reglas fijadas

| Tema | Decisión |
|---|---|
| Anti-fuga | El cliente nunca ve costo, margen ni "Mirai Group". Capa B solo interna. |
| Anti-sobrecosto | Sistema de Clientes ya incluye la landing: al agregarlo, Entrada Digital sale del carrito (y no puede re-entrar). |
| IVA | Siempre 19% sobre el honorario; el total mostrado es con IVA incluido. |
| Precios | Los del catálogo (el margen variable se retiró en jul 2026). |
| Assets | Solo archivos livianos en `public/`; videos completos en YouTube. |
