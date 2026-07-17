/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  COTIZACION — estado del cotizador en vivo + derivacion de numeros (Etapa 4A)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Una sola fuente de verdad para las 3 capas:
 *    A (cliente)  -> honorario + IVA + total           (derivar: vistaCliente)
 *    B (interno)  -> costo, piso, margen, semaforo      (derivar: vistaInterna)
 *
 *  El motor de precios (engine/pricing.ts) hace todo el calculo; aqui solo se
 *  arma el carrito y se suma. Cada item del catalogo ya trae precio + costoReal.
 */

import { useMemo, useState, useCallback } from 'react'
import { CONFIG } from '../config/pricing.config'
import { evaluar, precioPrimeraCompra, descuentoPrimeraCompra } from '../engine/pricing'
import type { ResultadoMargen } from '../engine/pricing'
import { CATALOGO } from '../data/catalog'
import type { ItemCatalogo, Categoria } from '../data/catalog'
import { GRUPOS_VISIBLES } from '../lienzo/content'

/** Una linea del carrito: un item del catalogo o un adicional flexible. */
export interface Linea {
  /** id unico de la linea (no del item: el mismo item podria repetirse). */
  uid: string
  /** id del item de catalogo, o 'adicional' para lineas flexibles. */
  refId: string
  nombre: string
  /** Precio de venta sin IVA por unidad (lo que el cliente ve como honorario). */
  precio: number
  /** Costo real interno por unidad (NUNCA se muestra al cliente). */
  costoReal: number
  cantidad: number
  /** true si es un adicional flexible agregado a mano desde el panel interno. */
  esAdicional: boolean
}

/** Estado completo del cotizador. */
export interface EstadoCotizacion {
  lineas: Linea[]
  /** "Margen que me permito" vigente (slider del panel interno). */
  margenPermitido: number
  /** true si se aplica el descuento de primera compra. */
  primeraCompra: boolean
}

/** Tres estados del semaforo para la UI (el motor da verde/rojo; aqui afinamos). */
export type SemaforoUI = 'sano' | 'ajustado' | 'bajo-piso'

/** Lo que ve el CLIENTE (capa A). Cero costo/margen/Mirai. */
export interface VistaCliente {
  /** Honorario profesional (precio aplicado, ya con descuento si aplica). */
  honorario: number
  /** Honorario antes del descuento (para mostrar "antes / ahora"). */
  honorarioPleno: number
  descuentoAplicado: boolean
  iva: number
  total: number
  vacio: boolean
}

/** Lo que ve DAVID (capa B). Todo el detalle interno.
 *  `gananciaNeta` (honorario − costo − RST) ya viene de ResultadoMargen. */
export interface VistaInterna extends ResultadoMargen {
  costoReal: number
  honorarioPleno: number
  descuentoFraccion: number
  semaforoUI: SemaforoUI
}

let _uid = 0
const nuevoUid = () => `lz-${++_uid}`

/** Deriva el semaforo de 3 estados: sano (≥ el margen que me permito) /
 *  ajustado (entre el minimo y ese margen) / en-riesgo (< minimo).
 *  El EPS evita que el piso deliberado del descuento (que aterriza EXACTO en el
 *  margen minimo) se vea en rojo por redondeo de punto flotante. */
export function semaforoUI(
  margenNeto: number,
  margenObjetivoReal: number = CONFIG.MARGEN_OBJETIVO,
): SemaforoUI {
  const EPS = 1e-6
  if (margenNeto >= margenObjetivoReal - EPS) return 'sano'
  if (margenNeto >= CONFIG.MARGEN_MINIMO_DESCUENTO - EPS) return 'ajustado'
  return 'bajo-piso'
}

/** El slider muestra un LABEL (20/15/10/5) pero el margen real objetivo es ese
 *  label + el colchon de seguridad, para nunca perder (5%→10%, 15%→20%, etc.). */
export function objetivoReal(margenPermitidoLabel: number): number {
  return margenPermitidoLabel + CONFIG.COLCHON_SEGURIDAD
}

/** Factor por el que el slider de margen escala TODO el carrito. El catalogo esta
 *  derivado al MARGEN_OBJETIVO (20% real); subir o bajar el slider reescala los
 *  precios proporcionalmente alrededor de ese punto de partida.
 *    factor = (1 + objetivoReal(label)) / (1 + MARGEN_OBJETIVO)
 *  En el default (label 15 → objetivoReal 20%) el factor es 1, asi que los precios
 *  quedan EXACTOS al catalogo; +1 nivel los sube ~4%, −1 nivel los baja ~4%.
 *  Como escala por igual a todas las lineas, conserva los descuentos relativos
 *  (p.ej. el Pack 4 reels sigue siendo mas barato que 4 reels sueltos). */
export function factorMargen(margenPermitidoLabel: number): number {
  return (1 + objetivoReal(margenPermitidoLabel)) / (1 + CONFIG.MARGEN_OBJETIVO)
}

/** Precio de una linea ya ajustado al margen elegido, redondeado a $1.000 limpios
 *  para que el cliente nunca vea cifras raras. En el default = precio de catalogo. */
export function precioAjustado(precioCatalogo: number, margenPermitidoLabel: number): number {
  return Math.round((precioCatalogo * factorMargen(margenPermitidoLabel)) / 1000) * 1000
}

/** Reparte un total entre anticipo (para arrancar) y saldo (contra entrega). */
export function anticipoSaldo(total: number, pct: number): { anticipo: number; saldo: number } {
  const anticipo = Math.round((total * pct) / 1000) * 1000
  return { anticipo, saldo: total - anticipo }
}

/** Suma del carrito: `precio` ya ESCALADO al margen elegido (lo que paga el
 *  cliente) y `costo` real. Ambos son enteros: cada linea llega redondeada a
 *  $1.000 (precioAjustado) y las cantidades son enteras. */
function sumar(lineas: Linea[], margenPermitido: number): { precio: number; costo: number } {
  let precio = 0
  let costo = 0
  for (const l of lineas) {
    precio += precioAjustado(l.precio, margenPermitido) * l.cantidad
    costo += l.costoReal * l.cantidad
  }
  return { precio, costo }
}

/** Honorario que se aplica de verdad: el pleno, o el de 1ª compra REDONDEADO
 *  HACIA ARRIBA a $1.000 limpios — el cliente nunca ve cifras raras y el
 *  redondeo jamas perfora el piso de margen (sube, no baja). Es la UNICA
 *  fuente de este numero: ambas capas (cliente e interna) la comparten. */
function honorarioAplicado(precio: number, costo: number, primeraCompra: boolean): number {
  if (!primeraCompra) return precio
  const conDescuento = precioPrimeraCompra(precio, costo)
  return Math.min(precio, Math.ceil(conDescuento / 1000) * 1000)
}

/** IVA y total COHERENTES en enteros: el IVA se redondea UNA vez y el total es
 *  la suma exacta (honorario + IVA), nunca dos redondeos que difieran en $1. */
function ivaYTotal(honorario: number): { iva: number; total: number } {
  const iva = Math.round(honorario * CONFIG.IVA)
  return { iva, total: honorario + iva }
}

/** Vista del cliente (capa A) a partir del estado. */
export function vistaCliente(e: EstadoCotizacion): VistaCliente {
  const { precio, costo } = sumar(e.lineas, e.margenPermitido)
  const vacio = e.lineas.length === 0 || precio <= 0

  const honorario = honorarioAplicado(precio, costo, e.primeraCompra)
  const { iva, total } = ivaYTotal(honorario)

  return {
    honorario,
    honorarioPleno: precio,
    descuentoAplicado: e.primeraCompra && honorario < precio,
    iva,
    total,
    vacio,
  }
}

/** Vista interna (capa B) a partir del estado. El margen es un LABEL; el
 *  objetivo real lleva el colchon de seguridad sumado. Los montos en COP se
 *  entregan en enteros coherentes con la capa A (mismo honorario, mismo IVA):
 *  lo que va al Sheet y al correo interno cuadra al peso con lo del cliente. */
export function vistaInterna(e: EstadoCotizacion): VistaInterna {
  const { precio, costo } = sumar(e.lineas, e.margenPermitido)
  const honorario = honorarioAplicado(precio, costo, e.primeraCompra)
  const objetivo = objetivoReal(e.margenPermitido)
  const res = evaluar(honorario, costo, objetivo)
  const { iva, total } = ivaYTotal(honorario)
  const rst = Math.round(res.rst)
  return {
    ...res,
    rst,
    iva,
    totalCliente: total,
    gananciaNeta: honorario - costo - rst,
    pisoPrecio: Math.round(res.pisoPrecio),
    costoReal: costo,
    honorarioPleno: precio,
    descuentoFraccion: e.primeraCompra ? descuentoPrimeraCompra(precio, costo) : 0,
    semaforoUI: semaforoUI(res.margenNeto, objetivo),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Agrupacion del catalogo por TIPO (para los desplegables de la capa A)
// ─────────────────────────────────────────────────────────────────────────────

export interface GrupoTipo {
  id: string
  label: string
  emoji: string
  items: ItemCatalogo[]
}

/** Devuelve los items de una categoria agrupados por tipo, en orden de venta.
 *  Respeta GRUPOS_VISIBLES (content.ts): los mismos grupos que muestra el
 *  catálogo de arriba (redes = completos+paquetes, eventos = solo paquetes,
 *  corporativo = todo). Los grupos vacios se omiten. */
export function gruposDeCategoria(cat: Categoria): GrupoTipo[] {
  const items = CATALOGO_POR_CATEGORIA[cat] ?? []
  const sueltos = items.filter((i) => !i.esPaquete)
  const grupos: GrupoTipo[] = [
    {
      id: 'grabacion',
      label: 'Grabación individual',
      emoji: '🎥',
      items: sueltos.filter((i) => i.modalidad === 'solo-grabacion'),
    },
    {
      id: 'edicion',
      label: 'Edición individual',
      emoji: '✂️',
      items: sueltos.filter((i) => i.modalidad === 'solo-edicion'),
    },
    {
      id: 'completos',
      label: 'Servicio completo (grabamos + editamos)',
      emoji: '🎬',
      items: sueltos.filter((i) => i.modalidad === 'completo'),
    },
    {
      id: 'paquetes',
      label: 'Paquetes',
      emoji: '🏆',
      items: items.filter((i) => i.esPaquete),
    },
  ]
  return grupos.filter((g) => g.items.length > 0 && GRUPOS_VISIBLES[cat].includes(g.id))
}

// ─────────────────────────────────────────────────────────────────────────────
//  Adicionales sugeridos (lista rapida del panel interno; David puede editar)
// ─────────────────────────────────────────────────────────────────────────────

export interface AdicionalSugerido {
  nombre: string
  /** Honorario que ve el cliente (COP). */
  precio: number
  /** Costo real interno (COP). Placeholder editable: ajustar a la realidad. */
  costo: number
}

/** Sugerencias de un clic para el adicional flexible. Los montos son valores
 *  base editables (David sobrescribe en el formulario antes de sumar). NO
 *  incluye "crudos" (regla de marca: nunca se entregan al cliente). */
export const ADICIONALES_SUGERIDOS: AdicionalSugerido[] = [
  { nombre: 'Pieza / reel adicional', precio: 410_000, costo: 250_000 },
  { nombre: 'Versión por canal extra (TikTok/IG/Shorts)', precio: 120_000, costo: 50_000 },
  { nombre: 'Subtítulos quemados (por pieza)', precio: 90_000, costo: 40_000 },
  { nombre: 'Equipo especial (cine/360/estabilizador, por día)', precio: 100_000, costo: 60_000 },
  { nombre: 'Dron (operador + equipo)', precio: 350_000, costo: 220_000 },
  { nombre: '2ª cámara + operador', precio: 450_000, costo: 290_000 },
  { nombre: 'Hora extra de grabación', precio: 120_000, costo: 80_000 },
  { nombre: 'Maquillaje / styling', precio: 250_000, costo: 170_000 },
  { nombre: 'Locación / set', precio: 400_000, costo: 300_000 },
  { nombre: 'Entrega express (mitad de tiempo)', precio: 300_000, costo: 120_000 },
]

/** ⚠️ DAVID: precios y costos SUGERIDOS (estimación de referencia, jul 2026) —
 *  valídalos antes de usarlos en una reunión; se editan aquí una sola vez. */
export const ADICIONALES_WEB: AdicionalSugerido[] = [
  { nombre: 'Sección adicional en la landing', precio: 250_000, costo: 120_000 },
  { nombre: 'Versión en segundo idioma de la web', precio: 450_000, costo: 220_000 },
  { nombre: 'Correo corporativo adicional (por buzón, año)', precio: 150_000, costo: 90_000 },
  { nombre: 'Integración de pasarela de pagos', precio: 350_000, costo: 180_000 },
  { nombre: 'Blog / sección de contenidos', precio: 500_000, costo: 260_000 },
]

export const ADICIONALES_PAUTA: AdicionalSugerido[] = [
  { nombre: 'Anuncio adicional (pieza extra de campaña)', precio: 180_000, costo: 100_000 },
  { nombre: 'Variante de landing para campaña (test A/B)', precio: 400_000, costo: 200_000 },
  { nombre: 'Configuración de píxel + eventos de conversión', precio: 250_000, costo: 120_000 },
  { nombre: 'Auditoría de cuenta publicitaria existente', precio: 300_000, costo: 150_000 },
  { nombre: 'Campaña adicional (nuevo objetivo o público)', precio: 500_000, costo: 250_000 },
]

/** Los adicionales agrupados por área, para los menús (capa A y panel interno). */
export const GRUPOS_ADICIONALES: { grupo: string; items: AdicionalSugerido[] }[] = [
  { grupo: 'Producción audiovisual', items: ADICIONALES_SUGERIDOS },
  { grupo: 'Desarrollo web', items: ADICIONALES_WEB },
  { grupo: 'Pauta / tráfico', items: ADICIONALES_PAUTA },
]

// ─────────────────────────────────────────────────────────────────────────────
//  Paquetes principales (Kaizen 2.0) — cotizables desde la capa A
// ─────────────────────────────────────────────────────────────────────────────

export interface PaquetePrincipal {
  id: string
  nombre: string
  descripcion: string
  /** Precio sin IVA (COP), del doc "Kaizen 2.0 — Servicios y Paquetes". */
  precio: number
  /** Costo interno = porción del equipo según el reparto del doc (74% en
   *  Entrada Digital y en la instalación del Sistema; 84% en su mantenimiento).
   *  Es una APROXIMACIÓN para el semáforo del panel interno, mientras el motor
   *  no maneje repartos por persona. */
  costoReal: number
  disponible: boolean
}

/** Paquetes agrupados por servicio (mismos desplegables que los add-ons). */
export const GRUPOS_PAQUETES: { id: string; label: string; emoji: string; items: PaquetePrincipal[] }[] = [
  {
    id: 'entrada-digital',
    label: 'Entrada Digital',
    emoji: '🌐',
    items: [
      {
        id: 'pkg-entrada-digital',
        nombre: 'Entrada Digital (año)',
        descripcion: 'Landing 100% a medida + producción audiovisual. Entrega 24h después de la grabación.',
        precio: 3_000_000,
        costoReal: 2_220_000,
        disponible: true,
      },
      {
        id: 'pkg-entrada-mantenimiento',
        nombre: 'Mantenimiento Entrada Digital (mes)',
        descripcion: '2 actualizaciones al mes para que la web nunca se quede vieja.',
        precio: 300_000,
        costoReal: 222_000,
        disponible: true,
      },
    ],
  },
  {
    id: 'sistema-clientes',
    label: 'Sistema de Clientes',
    emoji: '📣',
    items: [
      {
        id: 'pkg-sistema-clientes',
        nombre: 'Sistema de Clientes — página + tráfico',
        descripcion: 'Landing + 5–6 anuncios + campañas montadas. La pauta se paga aparte a Meta (mín. sugerida $3.000.000/mes).',
        precio: 5_000_000,
        costoReal: 3_700_000,
        disponible: true,
      },
      {
        id: 'pkg-sistema-mantenimiento',
        nombre: 'Sistema de Clientes — solo tráfico / mantenimiento (mes)',
        descripcion: 'Seguimos produciendo tus 5–6 anuncios, gestionamos campañas y reportamos resultados.',
        precio: 2_000_000,
        costoReal: 1_680_000,
        disponible: true,
      },
    ],
  },
  {
    id: 'sistema-comercial',
    label: 'Sistema Comercial Automático',
    emoji: '🤖',
    items: [
      {
        id: 'pkg-sistema-comercial',
        nombre: 'Sistema Comercial Automático',
        descripcion: 'Funnels, CRM y seguimiento con IA — la máquina completa.',
        precio: 0,
        costoReal: 0,
        disponible: false,
      },
    ],
  },
]

/** Catalogo agrupado por categoria, para el selector de la capa A. */
export const CATALOGO_POR_CATEGORIA = CATALOGO.reduce<Record<string, ItemCatalogo[]>>(
  (acc, item) => {
    ;(acc[item.categoria] ??= []).push(item)
    return acc
  },
  {},
)

/**
 * Regla anti-sobrecosto: el paquete de la IZQUIERDA ya incluye los items de la
 * derecha. Al agregarlo, esos items salen del carrito (evita cobrar la landing
 * dos veces); y si el paquete ya está en el carrito, agregar un incluido no
 * hace nada. Declarativa: para nuevas reglas basta sumar una entrada.
 */
const PAQUETE_INCLUYE: Record<string, readonly string[]> = {
  // Sistema de Clientes (página + tráfico) ya trae la landing y su cuidado.
  'pkg-sistema-clientes': ['pkg-entrada-digital', 'pkg-entrada-mantenimiento'],
}

/** Agrega un item a las líneas aplicando la regla anti-sobrecosto. PURA
 *  (probada en cotizacion.test.ts); el hook solo la conecta al estado. */
export function conItemAgregado(
  lineas: Linea[],
  item: Pick<ItemCatalogo, 'id' | 'nombre' | 'precio' | 'costoReal'>,
): Linea[] {
  // 1) ¿Lo que se agrega ya viene incluido en un paquete presente? → no-op.
  const yaCubierto = Object.entries(PAQUETE_INCLUYE).some(
    ([paquete, incluidos]) => incluidos.includes(item.id) && lineas.some((l) => l.refId === paquete),
  )
  if (yaCubierto) return lineas

  // 2) ¿Lo que se agrega es un paquete que incluye items del carrito? → sácalos.
  const incluidos = PAQUETE_INCLUYE[item.id]
  const base = incluidos ? lineas.filter((l) => !incluidos.includes(l.refId)) : lineas

  // 3) Mismo item de nuevo → sube cantidad; si no, línea nueva.
  const existente = base.find((l) => l.refId === item.id)
  if (existente) {
    return base.map((l) => (l.uid === existente.uid ? { ...l, cantidad: l.cantidad + 1 } : l))
  }
  return [
    ...base,
    {
      uid: nuevoUid(),
      refId: item.id,
      nombre: item.nombre,
      precio: item.precio,
      costoReal: item.costoReal,
      cantidad: 1,
      esAdicional: false,
    },
  ]
}

/** Agrega un adicional; el mismo concepto (nombre + precio) se fusiona en una
 *  línea con cantidad en vez de duplicar filas. PURA (probada en tests). */
export function conAdicionalAgregado(
  lineas: Linea[],
  nombre: string,
  precio: number,
  costoReal: number,
): Linea[] {
  const existente = lineas.find((l) => l.esAdicional && l.nombre === nombre && l.precio === precio)
  if (existente) {
    return lineas.map((l) => (l.uid === existente.uid ? { ...l, cantidad: l.cantidad + 1 } : l))
  }
  return [
    ...lineas,
    { uid: nuevoUid(), refId: 'adicional', nombre, precio, costoReal, cantidad: 1, esAdicional: true },
  ]
}

/** Hook de estado del cotizador con todas las acciones. */
export function useCotizacion() {
  const [estado, setEstado] = useState<EstadoCotizacion>({
    lineas: [],
    margenPermitido: CONFIG.MARGEN_PERMITIDO_DEFAULT,
    primeraCompra: false,
  })

  const agregarItem = useCallback((item: Pick<ItemCatalogo, 'id' | 'nombre' | 'precio' | 'costoReal'>) => {
    setEstado((e) => ({ ...e, lineas: conItemAgregado(e.lineas, item) }))
  }, [])

  const agregarAdicional = useCallback((nombre: string, precio: number, costoReal: number) => {
    setEstado((e) => ({ ...e, lineas: conAdicionalAgregado(e.lineas, nombre, precio, costoReal) }))
  }, [])

  const cambiarCantidad = useCallback((uid: string, delta: number) => {
    setEstado((e) => ({
      ...e,
      lineas: e.lineas
        .map((l) => (l.uid === uid ? { ...l, cantidad: l.cantidad + delta } : l))
        .filter((l) => l.cantidad > 0),
    }))
  }, [])

  const quitar = useCallback((uid: string) => {
    setEstado((e) => ({ ...e, lineas: e.lineas.filter((l) => l.uid !== uid) }))
  }, [])

  const setMargenPermitido = useCallback((margenPermitido: number) => {
    setEstado((e) => ({ ...e, margenPermitido }))
  }, [])

  const togglePrimeraCompra = useCallback(() => {
    setEstado((e) => ({ ...e, primeraCompra: !e.primeraCompra }))
  }, [])

  const limpiar = useCallback(() => {
    setEstado((e) => ({ ...e, lineas: [] }))
  }, [])

  const cliente = useMemo(() => vistaCliente(estado), [estado])
  const interna = useMemo(() => vistaInterna(estado), [estado])

  return {
    estado,
    cliente,
    interna,
    agregarItem,
    agregarAdicional,
    cambiarCantidad,
    quitar,
    setMargenPermitido,
    togglePrimeraCompra,
    limpiar,
  }
}

export type CotizacionAPI = ReturnType<typeof useCotizacion>
