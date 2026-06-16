# Kaizen Studios — Landing de captación

Landing page de una sola ruta cuyo único trabajo es **convertir visitantes en llamadas
agendadas** por Calendly. Dark + oro, animaciones tipo Apple (GSAP + ScrollTrigger + Lenis).

Posicionamiento: **"Una grabación. Un sistema de contenido."** · Cara visible: David Seiko.

## Stack
- **Next.js 16** (App Router, TypeScript, `src/`) — Turbopack por defecto.
- **GSAP + ScrollTrigger + SplitText** (vía `@gsap/react` `useGSAP`) — todo gratis en GSAP 3.13+.
- **Lenis** smooth-scroll, sincronizado con ScrollTrigger.
- **react-calendly** (`InlineWidget`, carga diferida).
- Fuentes self-hosted con `next/font/google`: **Syne, DM Sans, DM Mono**.

## Correr en local
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start   # producción
```

## Estructura
```
src/
  app/
    layout.tsx     fuentes + metadata/OG + SmoothScroll
    page.tsx       ensambla las 7 secciones + JSON-LD de organización
    globals.css    tokens de marca + estilos de todas las secciones
    sitemap.ts · robots.ts
  components/
    SmoothScroll · Header · Hero · About · SystemSection · WhyUs · Founder · Schedule · Footer · Icons
  lib/
    config.ts      ← TODO lo que rellena David (ver abajo)
    scroll.ts      helper de scroll suave (Lenis)
public/             assets (ver public/README-ASSETS.md)
```

## Qué rellenar antes de publicar — `src/lib/config.ts`
| Dato | Variable | Estado por defecto |
|------|----------|--------------------|
| URL de Calendly | `CALENDLY_URL` | vacío → muestra fallback con WhatsApp/correo |
| Métricas reales | `METRICS` | `null` → muestra "—" + "por confirmar" |
| Logos de clientes (con permiso) | `CLIENTS` | `[]` → oculta el marquee |
| Redes de Kaizen | `SOCIAL` | `''` → footer muestra "Por agregar" |
| Marca personal de David | `DAVID_LINKS` | `''` → chip deshabilitado |
| Dominio final | `SITE.url` | `https://kaizenstudios.co` (provisional) |

**Assets** (`/public`) y sus flags (`ASSETS` en config) se documentan en
[`public/README-ASSETS.md`](public/README-ASSETS.md). Mientras falten, la web muestra
placeholders elegantes — nada se rompe.

> **Regla de marca:** prohibido inventar métricas o clientes. Deja `null`/`[]` lo que no sea real.

## Animaciones / accesibilidad
- Sección "El sistema" usa un **pin + scrub** y un **canvas** con una apertura de cámara
  procedural (no necesita assets). Si subes `/sequence/frame-*.jpg` y activas
  `ASSETS.hasSequence`, usa los frames reales.
- Respeta `prefers-reduced-motion`: sin pins/parallax y con los estados finales visibles.
- Sin JavaScript, el contenido animado se muestra igual (`<noscript>`).

## Deploy (Vercel)
- Importa el repo en Vercel y pon **Root Directory = `kaizen-landing`**.
- Framework: Next.js (autodetectado). Sin variables de entorno necesarias para v1.
