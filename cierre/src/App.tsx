/**
 * App — raiz de la herramienta de cierre.
 *
 * Arquitectura de 3 capas (manual de marca + prompt §2):
 *   A · Lienzo de presentacion (cliente)  — Etapa 3, modo oscuro  ← AQUI
 *   B · Panel interno (solo David)         — Etapa 4, costo/margen/Mirai
 *   C · Concept Proposal (export cliente)  — Etapa 6, modo claro
 *
 * Por ahora la app renderiza el lienzo (capa A). El cotizador en vivo y el panel
 * interno se montan ENCIMA de este lienzo en la Etapa 4.
 */

import { Lienzo } from './lienzo/Lienzo'

export function App() {
  return <Lienzo />
}
