/**
 * CATALOGO — datos precargados de servicios (modelo lanzamiento, Jun 2026).
 *
 * Cada item declara su `costoReal` (interno). El `precio` de venta YA NO se
 * escribe a mano: se DERIVA del costo al MARGEN_OBJETIVO de config (20% al
 * arrancar, decision de David para entrar competitivos), redondeado a $10k. Asi,
 * para resubir precios el dia de manana basta cambiar CONFIG.MARGEN_OBJETIVO.
 *
 * Unica excepcion: el Pack 4 reels se fija a mano (al 20% costaria mas que 4
 * reels sueltos por su edicion mas elaborada; se deja como ahorro real).
 */

import { CONFIG } from '../config/pricing.config'

export type Categoria = 'eventos' | 'redes' | 'inmobiliario' | 'corporativo'

export type Anclaje = 'simple' | 'recomendado' | 'premium' | null

export type Modalidad = 'completo' | 'solo-edicion' | 'solo-grabacion'

export interface ItemCatalogo {
  id: string
  categoria: Categoria
  nombre: string
  /** Descripcion corta para el cliente (capa A). */
  descripcion: string
  /** Precio de venta sin IVA (COP). */
  precio: number
  /** Costo real interno (COP) — NUNCA se muestra al cliente. */
  costoReal: number
  /** Rol en la estructura de anclaje (simple / recomendado / premium). */
  anclaje: Anclaje
  /** true si es paquete (vs item suelto a-la-carte). */
  esPaquete: boolean
  /** Modalidad de produccion. Define el recargo por fase del item suelto. */
  modalidad: Modalidad
  /** true si se cotiza "desde / a la medida" (precio es piso, no tarifa). */
  aLaMedida?: boolean
  /** Para modalidad 'solo-edicion': condicion del material que aporta el cliente. */
  requisitoMaterial?: string
}

/** Add-on transversal que se suma sobre el proyecto. */
export interface AddOn {
  id: string
  nombre: string
  descripcion: string
  /** 'porcentaje' = sobre el valor del proyecto · 'fijo' = monto "desde". */
  tipo: 'porcentaje' | 'fijo'
  valor: number
}

const REQ_CALIDAD =
  'El cliente aporta el material. Sujeto a nuestro estándar mínimo de calidad aceptable (resolución, audio, estabilidad).'

const CATALOGO_BASE: Omit<ItemCatalogo, 'precio'>[] = [
  // ─── EVENTOS ───────────────────────────────────────────────────────────────
  // Orden: grabaciones → ediciones → paquetes grab+edit.
  // GRABACIONES (la toma; los basicos ya incluyen 2 filmmakers)
  {
    id: 'evt-cobertura-4h',
    categoria: 'eventos',
    nombre: 'Cobertura media jornada (4h)',
    descripcion: 'Cobertura de 4 horas para lanzamientos cortos, ruedas de prensa o activaciones. 2 filmmakers con equipo.',
    costoReal: 420_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-grabacion',
  },
  {
    id: 'evt-cobertura-8h',
    categoria: 'eventos',
    nombre: 'Cobertura de evento (8h)',
    descripcion: '2 filmmakers con equipo profesional cubren tu evento (jornada de 8h). Recibes el material listo + clip de cierre de hasta 60s.',
    costoReal: 756_000,
    anclaje: 'simple',
    esPaquete: false,
    modalidad: 'solo-grabacion',
  },
  {
    id: 'evt-cobertura-8h-compleja',
    categoria: 'eventos',
    nombre: 'Cobertura de evento 8h — compleja',
    descripcion: 'Cobertura premium a la medida: 3er filmmaker + sonidista dedicado, además del equipo base. Para eventos de alto perfil.',
    // costoReal: base 8h (2 filmmakers) + 3er filmmaker y sonidista (freelance ~$70k/h, 8h c/u)
    // + equipo de sonido. Es item "a la medida": el precio listado es un "desde".
    costoReal: 2_142_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-grabacion',
    aLaMedida: true,
  },
  // EDICIONES (material del cliente; sujeto a calidad minima, si no cumple no se acepta)
  {
    id: 'evt-recap',
    categoria: 'eventos',
    nombre: 'Recap del evento (≤1 min)',
    descripcion: 'Clip resumen vertical de hasta 1 minuto, dinámico, a partir del material del evento. Color y audio normalizado.',
    costoReal: 252_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-edicion',
    requisitoMaterial: REQ_CALIDAD + ' Requiere material del evento que cumpla el estandar.',
  },
  {
    id: 'evt-after-movie',
    categoria: 'eventos',
    nombre: 'After movie del evento (≤3 min)',
    descripcion: 'Edición narrativa de hasta 3 min: música licenciada, color y ritmo cinematográfico. 1 horizontal + 1 vertical.',
    costoReal: 672_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-edicion',
    requisitoMaterial: REQ_CALIDAD + ' Requiere material del evento que cumpla el estandar.',
  },
  {
    id: 'evt-edicion-fotos',
    categoria: 'eventos',
    nombre: 'Edición de fotos del evento',
    descripcion: 'Selección y edición profesional de las fotografías del evento a partir del material entregado.',
    costoReal: 336_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-edicion',
    requisitoMaterial: REQ_CALIDAD,
  },
  // PAQUETES grabacion+edicion (aprobados)
  {
    id: 'evt-media-jornada',
    categoria: 'eventos',
    nombre: 'Evento Media Jornada (4h)',
    descripcion: 'Cobertura 4h + after movie + 3 reels verticales del mismo material.',
    costoReal: 1_596_000,
    anclaje: null,
    esPaquete: true,
    modalidad: 'completo',
  },
  {
    id: 'evt-completo',
    categoria: 'eventos',
    nombre: 'Evento Completo (8h)',
    descripcion: 'Cobertura 8h + after movie + 3 reels verticales. La campaña completa lista para distribuir.',
    costoReal: 2_100_000,
    anclaje: 'recomendado',
    esPaquete: true,
    modalidad: 'completo',
  },
  {
    id: 'evt-premium',
    categoria: 'eventos',
    nombre: 'Evento Premium 360°',
    descripcion: 'Cobertura 8h + after movie + 5 reels + 30 fotos editadas + 1 testimonial.',
    costoReal: 2_940_000,
    anclaje: 'premium',
    esPaquete: true,
    modalidad: 'completo',
  },

  // ─── REDES ─────────────────────────────────────────────────────────────────
  // Orden: grabaciones → ediciones → completo grab+edit → paquetes de servicio.
  // GRABACIONES (solo la toma; el cliente edita)
  {
    id: 'red-reel-grab-1',
    categoria: 'redes',
    nombre: 'Grabación de 1 reel',
    descripcion: 'Grabación dedicada de un reel (~2h). Entrega del material en bruto, listo para editar.',
    costoReal: 252_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-grabacion',
  },
  {
    id: 'red-reel-grab-varios',
    categoria: 'redes',
    nombre: 'Grabación de varios reels',
    descripcion: 'Jornada de grabación (~5h) para producir el material de varios reels en bruto.',
    costoReal: 504_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-grabacion',
  },
  {
    id: 'red-foto-toma',
    categoria: 'redes',
    nombre: 'Toma de fotografías (solo sesión)',
    descripcion: 'Sesión fotográfica de 3h (la toma), sin edición. Entrega del material seleccionado en bruto.',
    costoReal: 336_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-grabacion',
  },
  {
    id: 'red-podcast-grab',
    categoria: 'redes',
    nombre: 'Grabación de podcast',
    descripcion: 'Grabación multicámara de podcast (~3h) con equipo de audio profesional (vía aliado). Material en bruto.',
    // costoReal incluye alquiler de equipo de audio (~$200k, via aliado).
    costoReal: 546_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-grabacion',
  },
  {
    id: 'red-yt-grab',
    categoria: 'redes',
    nombre: 'Grabación de video YouTube',
    descripcion: 'Grabación de un video de YouTube (~4h). Material en bruto, listo para editar.',
    costoReal: 420_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-grabacion',
  },
  // EDICIONES (material del cliente; sujeto a calidad minima, si no cumple no se acepta)
  {
    id: 'red-reel-edicion',
    categoria: 'redes',
    nombre: 'Edición de reel sencillo',
    descripcion: 'Edición profesional de un reel a partir del material del cliente. Color y audio normalizado. Volumen (8+/mes) se negocia.',
    costoReal: 168_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-edicion',
    requisitoMaterial: REQ_CALIDAD,
  },
  {
    id: 'red-reel-edicion-compleja',
    categoria: 'redes',
    nombre: 'Edición de reel complejo / branded',
    descripcion: 'Edición avanzada (motion, efectos, sonido diseñado) sobre el material del cliente.',
    costoReal: 336_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-edicion',
    requisitoMaterial: REQ_CALIDAD,
  },
  {
    id: 'red-foto-edicion',
    categoria: 'redes',
    nombre: 'Edición de fotografías',
    descripcion: 'Selección y retoque profesional de fotos que entrega el cliente.',
    costoReal: 168_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-edicion',
    requisitoMaterial: REQ_CALIDAD,
  },
  {
    id: 'red-yt-edicion-simple',
    categoria: 'redes',
    nombre: 'Edición de video YouTube (sencilla)',
    descripcion: 'Edición long-form estándar (~6h) sobre el material del cliente: cortes, color, audio, gráficos básicos.',
    costoReal: 504_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-edicion',
    requisitoMaterial: REQ_CALIDAD,
  },
  {
    id: 'red-yt-edicion-compleja',
    categoria: 'redes',
    nombre: 'Edición de video YouTube (compleja)',
    descripcion: 'Edición avanzada (~10h): motion graphics, multicámara, sonido diseñado, sobre el material del cliente.',
    costoReal: 840_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-edicion',
    requisitoMaterial: REQ_CALIDAD,
  },
  // COMPLETO grabacion+edicion (una pieza)
  {
    id: 'red-reel-sencillo',
    categoria: 'redes',
    nombre: 'Reel sencillo (completo)',
    descripcion: 'Grabación corta + edición dinámica de un reel vertical, con color y audio normalizado.',
    costoReal: 252_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'completo',
  },
  {
    id: 'red-reel-branded',
    categoria: 'redes',
    nombre: 'Reel complejo / branded (completo)',
    descripcion: 'Dirección de arte, guion y edición avanzada (motion, efectos, sonido diseñado). Branded content.',
    costoReal: 504_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'completo',
  },
  {
    id: 'red-fotografia',
    categoria: 'redes',
    nombre: 'Sesión de fotografía (completa)',
    descripcion: '3h de sesión + selección y retoque profesional. 15 fotos editadas en alta resolución + versiones para redes. Más económica que toma + edición por separado.',
    costoReal: 504_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'completo',
  },
  // PAQUETES de servicio (multi-pieza)
  {
    id: 'red-pack-4-reels',
    categoria: 'redes',
    nombre: 'Pack 4 reels (1 jornada)',
    descripcion: 'Una jornada de grabación → 4 reels distintos. Cascada de contenido: un mes de reels en un día.',
    costoReal: 1_092_000,
    anclaje: 'recomendado',
    esPaquete: true,
    modalidad: 'completo',
  },
  {
    id: 'red-podcast-full',
    categoria: 'redes',
    nombre: 'Podcast 1 ep (set + audio)',
    descripcion: 'Grabación multicámara con audio profesional (set incluido) + edición. 1 episodio + 3 cortes verticales.',
    costoReal: 1_008_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'completo',
  },
  {
    id: 'red-podcast-espacio',
    categoria: 'redes',
    nombre: 'Podcast 1 ep (cliente aporta espacio)',
    descripcion: 'Mismo episodio multicámara + edición, pero la grabación se hace en el espacio del cliente.',
    costoReal: 588_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'completo',
  },
  {
    id: 'red-yt-completo-simple',
    categoria: 'redes',
    nombre: 'Video YouTube completo (sencillo)',
    descripcion: 'Grabación (~4h) + edición sencilla (~6h). Más económico que comprar grabación y edición por separado.',
    costoReal: 924_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'completo',
  },
  {
    id: 'red-yt-completo-complejo',
    categoria: 'redes',
    nombre: 'Video YouTube completo (complejo)',
    descripcion: 'Grabación (~4h) + edición avanzada (~10h): motion, multicámara, sonido diseñado.',
    costoReal: 1_260_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'completo',
  },
  {
    id: 'red-pack-4-podcasts',
    categoria: 'redes',
    nombre: 'Pack 4 podcasts (1 jornada)',
    descripcion: 'Graba un mes de podcast en un día: jornada multicámara → 4 episodios editados.',
    costoReal: 2_184_000,
    anclaje: 'recomendado',
    esPaquete: true,
    modalidad: 'completo',
  },
  {
    id: 'red-yt-pack-2',
    categoria: 'redes',
    nombre: 'Pack 2 videos YouTube /mes',
    descripcion: 'Producción mensual de 2 videos de YouTube (grabación + edición sencilla). YouTube es más exigente, por eso 2/mes; 4 es posible bajo cotización.',
    costoReal: 1_764_000,
    anclaje: 'recomendado',
    esPaquete: true,
    modalidad: 'completo',
  },
  {
    id: 'red-retainer-esencial',
    categoria: 'redes',
    nombre: 'Retainer Redes ESENCIAL /mes',
    descripcion: '1 jornada de grabación · 8 reels · 15 fotos · kit de distribución. Mensual.',
    costoReal: 2_268_000,
    anclaje: 'simple',
    esPaquete: true,
    modalidad: 'completo',
  },
  {
    id: 'red-retainer-pro',
    categoria: 'redes',
    nombre: 'Retainer Redes PRO /mes',
    descripcion: '1 jornada · 12 reels · 1 reel branded · 20 fotos · kit + calendario editorial. Mensual.',
    costoReal: 3_276_000,
    anclaje: 'premium',
    esPaquete: true,
    modalidad: 'completo',
  },
  {
    id: 'red-retainer-edicion',
    categoria: 'redes',
    nombre: 'Retainer edición 12 reels/mes',
    descripcion: 'Edición continua de 12 reels mensuales (material del cliente), flujo ordenado vía hub + reportes. Antes "B2B".',
    costoReal: 2_016_000,
    anclaje: null,
    esPaquete: true,
    modalidad: 'solo-edicion',
    requisitoMaterial: REQ_CALIDAD,
  },

  // ─── INMOBILIARIO (secundario) ───────────────────────────────────────────────
  // EDICIONES (material del cliente; sujeto a calidad minima, si no cumple no se acepta)
  {
    id: 'inm-reel-edicion',
    categoria: 'inmobiliario',
    nombre: 'Edición de reel / tour (material cliente)',
    descripcion: 'Edición de un reel o tour inmobiliario a partir del material que entrega el cliente.',
    costoReal: 168_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-edicion',
    requisitoMaterial: REQ_CALIDAD,
  },
  {
    id: 'inm-reel-edicion-compleja',
    categoria: 'inmobiliario',
    nombre: 'Edición de reel / tour complejo (material cliente)',
    descripcion: 'Edición avanzada (motion, rótulos con datos del inmueble, ritmo) sobre el material del cliente.',
    costoReal: 336_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-edicion',
    requisitoMaterial: REQ_CALIDAD,
  },
  {
    id: 'inm-video-edicion',
    categoria: 'inmobiliario',
    nombre: 'Edición de video largo / recorrido (material cliente)',
    descripcion: 'Edición narrativa de un recorrido o property film a partir del material del cliente (~8h).',
    costoReal: 672_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-edicion',
    requisitoMaterial: REQ_CALIDAD,
  },
  {
    id: 'inm-foto-ia',
    categoria: 'inmobiliario',
    nombre: 'Edición fotográfica con IA',
    descripcion: 'El cliente entrega fotos; las mejoramos con IA (cielo reemplazado, luz, limpieza, realce). ~3h por lote.',
    costoReal: 252_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'solo-edicion',
    requisitoMaterial: REQ_CALIDAD,
  },
  // COMPLETO grabacion+edicion
  {
    id: 'inm-foto',
    categoria: 'inmobiliario',
    nombre: 'Foto de propiedad',
    descripcion: 'Sesión de un inmueble (~120 m²): 15–20 fotos editadas, optimizadas para portales y redes.',
    costoReal: 420_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'completo',
  },
  {
    id: 'inm-reel-tour',
    categoria: 'inmobiliario',
    nombre: 'Reel / tour inmobiliario',
    descripcion: 'Recorrido vertical dinámico de la propiedad, con estabilización y edición ágil.',
    costoReal: 504_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'completo',
  },
  {
    id: 'inm-recorrido',
    categoria: 'inmobiliario',
    nombre: 'Video recorrido completo',
    descripcion: 'Property film de hasta 15 min: jornada de grabación + edición narrativa.',
    costoReal: 1_428_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'completo',
  },

  // ─── CORPORATIVO (secundario) ────────────────────────────────────────────────
  {
    id: 'cor-testimonial',
    categoria: 'corporativo',
    nombre: 'Testimonial',
    descripcion: 'Testimonio (cliente o equipo) con set, luz y sonido controlados + edición. 60–90s + corte vertical.',
    costoReal: 588_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'completo',
  },
  {
    id: 'cor-pitch',
    categoria: 'corporativo',
    nombre: 'Video pitch / marca',
    descripcion: 'Video institucional o de marca (≤15 min): 1 día de grabación + 1 día de edición.',
    costoReal: 1_428_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'completo',
  },
  {
    id: 'cor-video-largo',
    categoria: 'corporativo',
    nombre: 'Video largo / institucional',
    descripcion: 'Video institucional extenso (1–2 días de producción). Mismo estándar que el video pitch, con mayor alcance.',
    costoReal: 1_512_000,
    anclaje: null,
    esPaquete: false,
    modalidad: 'completo',
  },
  // (La edicion de reels B2B = misma que redes; se unifico en la categoria 'redes'.)
]

/** Precio de venta = margen objetivo (config) sobre el costo, tras RST,
 *  redondeado a $10k hacia arriba (asi nunca cae por debajo del margen). */
function precioObjetivo(costoReal: number): number {
  const bruto = (costoReal * (1 + CONFIG.MARGEN_OBJETIVO)) / (1 - CONFIG.RST)
  return Math.ceil(bruto / 10_000) * 10_000
}

/** Precios fijados a mano (sobreescriben la derivacion). Hoy solo el Pack 4
 *  reels, que al 20% costaria mas que 4 reels sueltos; se deja como ahorro. */
const PRECIOS_FIJOS: Record<string, number> = {
  'red-pack-4-reels': 1_290_000,
}

export const CATALOGO: ItemCatalogo[] = CATALOGO_BASE.map((i) => ({
  ...i,
  precio: PRECIOS_FIJOS[i.id] ?? precioObjetivo(i.costoReal),
}))

export const ADDONS: AddOn[] = [
  { id: 'add-crudos', nombre: 'Entrega de crudos', descripcion: 'Material en bruto sin editar.', tipo: 'porcentaje', valor: 0.3 },
  { id: 'add-express', nombre: 'Entrega express', descripcion: 'Reduce el tiempo de entrega a la mitad.', tipo: 'porcentaje', valor: 0.4 },
  { id: 'add-pieza-extra', nombre: 'Reel / pieza adicional', descripcion: 'Pieza extra sobre un paquete.', tipo: 'fijo', valor: 410_000 },
  { id: 'add-version-canal', nombre: 'Versión por canal extra', descripcion: 'TikTok / IG / Shorts / LinkedIn.', tipo: 'fijo', valor: 120_000 },
  { id: 'add-subtitulos', nombre: 'Subtítulos quemados', descripcion: 'IA + revisión, por pieza.', tipo: 'fijo', valor: 90_000 },
  { id: 'add-equipo-especial', nombre: 'Equipo especial', descripcion: 'Cámara cine extra, 360, estabilizador, foquista. Por día.', tipo: 'fijo', valor: 100_000 },
]
