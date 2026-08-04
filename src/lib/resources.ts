// ─────────────────────────────────────────────────────────────────────────────
// Kaizen Studios — recursos descargables (lead magnets gratis + infoproductos de pago)
// Regla de marca: prohibido inventar recursos que no existen. Esta lista arranca
// vacía a propósito — /recursos ya sabe renderizar el estado "próximamente" cuando
// RESOURCES está vacío, y el grid de tarjetas en cuanto haya al menos uno.
//
// [[ TODO David ]]: cuando haya un recurso real, agrégalo aquí. Ejemplos de forma
// (no de contenido — no copiar los textos, son solo para mostrar los campos):
//   - Gratis (lead magnet, ej. PDF/checklist a cambio de email):
//       { slug: 'algo', title: 'Título real', description: 'Qué es y para quién.',
//         type: 'gratis', href: '/api/lead?resource=algo' }  // o el link real de descarga
//   - Pago (infoproducto, ej. curso o plantilla):
//       { slug: 'algo-pro', title: 'Título real', description: 'Qué incluye.',
//         type: 'pago', href: 'https://checkout-real.com/...' }
// Si un recurso todavía no tiene link de descarga/checkout, no lo agregues todavía.
// ─────────────────────────────────────────────────────────────────────────────

export type Resource = {
  slug: string
  title: string
  description: string
  type: 'gratis' | 'pago'
  href?: string
}

export const RESOURCES: Resource[] = []
