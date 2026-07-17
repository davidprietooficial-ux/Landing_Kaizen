/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MOTOR DE CALCULO — funciones puras de precio/margen (sin React, sin estado)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  MODELO (corregido jun 2026): Mirai Group es la empresa de David, asi que su
 *  "comision" NO es un costo — es margen propio. Lo unico que de verdad sale del
 *  bolsillo es: costos reales + RST. El IVA lo paga el cliente (pasa a la DIAN).
 *
 *    costoComponente = (hGrab + hEdic) * TARIFA_HORA * (1 + RECARGO_EQUIPOS)
 *                      + (nDespl * TRANSPORTE_DESPL) + alquiler
 *    costoReal       = (Σ costoComponente) * (1 + COLCHON)
 *    pisoPrecio      = costoReal * (1 + margenPermitido) / (1 − RST)
 *    margenNeto(P)   = (P − costoReal − P*RST) / costoReal     ← margen real de David
 *    gananciaNeta(P) = P − costoReal − P*RST                   ← plata que queda (COP)
 *    totalCliente(P) = P * (1 + IVA)
 *
 *  El slider "margen que me permito" (20/15/10/5) fija el umbral del semaforo y el
 *  piso. Verificado en pricing.test.ts.
 */

import { CONFIG } from '../config/pricing.config'

/** Un componente de trabajo dentro de una cotizacion (modo CUSTOM o catalogo). */
export interface ComponenteCotizacion {
  id: string
  nombre: string
  horasGrab: number
  horasEdic: number
  nDesplazamientos: number
  /** Alquiler de set/locacion/equipo especial para este componente (COP). */
  alquiler: number
}

/** Desglose transparente de como se arma el costo real (uso interno). */
export interface DesgloseCosto {
  costoHoras: number
  recargoEquipos: number
  transporte: number
  alquiler: number
  subtotal: number
  colchon: number
  costoReal: number
}

/** Resultado completo de evaluar un precio aplicado contra un costo real. */
export interface ResultadoMargen {
  precioAplicado: number
  costoReal: number
  pisoPrecio: number
  /** Margen real sobre costo, descontando solo RST (Mirai NO se resta). */
  margenNeto: number
  /** Dinero que REALMENTE queda: precio − costo − RST (COP). */
  gananciaNeta: number
  rst: number
  iva: number
  /** Lo que el cliente paga: precio + IVA. */
  totalCliente: number
  /** true si el precio aplicado cae por debajo del piso sano. */
  bajoElPiso: boolean
  semaforo: Semaforo
}

export type Semaforo = 'rojo' | 'verde'

// ─────────────────────────────────────────────────────────────────────────────
//  Calculo de costo
// ─────────────────────────────────────────────────────────────────────────────

/** Costo de un solo componente, antes del colchon. */
export function costoComponente(c: ComponenteCotizacion): number {
  const horas = c.horasGrab + c.horasEdic
  const costoHoras = horas * CONFIG.TARIFA_HORA * (1 + CONFIG.RECARGO_EQUIPOS)
  const transporte = c.nDesplazamientos * CONFIG.TRANSPORTE_DESPL
  return costoHoras + transporte + c.alquiler
}

/** Costo real de una lista de componentes (incluye colchon). Devuelve desglose. */
export function costoReal(componentes: ComponenteCotizacion[]): DesgloseCosto {
  let costoHoras = 0
  let transporte = 0
  let alquiler = 0

  for (const c of componentes) {
    costoHoras += (c.horasGrab + c.horasEdic) * CONFIG.TARIFA_HORA
    transporte += c.nDesplazamientos * CONFIG.TRANSPORTE_DESPL
    alquiler += c.alquiler
  }

  const recargoEquipos = costoHoras * CONFIG.RECARGO_EQUIPOS
  const subtotal = costoHoras + recargoEquipos + transporte + alquiler
  const colchon = subtotal * CONFIG.COLCHON

  return {
    costoHoras,
    recargoEquipos,
    transporte,
    alquiler,
    subtotal,
    colchon,
    costoReal: subtotal + colchon,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Precio, piso y margenes
// ─────────────────────────────────────────────────────────────────────────────

/** Precio que deja exactamente `margen` sobre el costo (tras RST). */
export function precioConMargen(costoRealValor: number, margen: number): number {
  return (costoRealValor * (1 + margen)) / (1 - CONFIG.RST)
}

/** Piso de precio que asegura el margen permitido (tras RST). */
export function pisoPrecio(
  costoRealValor: number,
  margenObjetivo: number = CONFIG.MARGEN_OBJETIVO,
): number {
  return precioConMargen(costoRealValor, margenObjetivo)
}

/**
 * Descuento de primera compra MAS GRANDE POSIBLE sin cruzar el margen minimo.
 * Depende solo del piso absoluto (margenMin), no del margen que David se permite.
 * Devuelve una fraccion [0, tope].
 */
export function descuentoPrimeraCompra(
  precio: number,
  costoRealValor: number,
  margenMin: number = CONFIG.MARGEN_MINIMO_DESCUENTO,
  tope: number = CONFIG.DESCUENTO_PRIMERA_COMPRA_TOPE,
): number {
  const precioMinSano = precioConMargen(costoRealValor, margenMin)
  const descuentoMax = 1 - precioMinSano / precio
  return Math.max(0, Math.min(tope, descuentoMax))
}

/** Precio final de primera compra (precio con el descuento maximo seguro aplicado). */
export function precioPrimeraCompra(
  precio: number,
  costoRealValor: number,
  margenMin: number = CONFIG.MARGEN_MINIMO_DESCUENTO,
  tope: number = CONFIG.DESCUENTO_PRIMERA_COMPRA_TOPE,
): number {
  const d = descuentoPrimeraCompra(precio, costoRealValor, margenMin, tope)
  return precio * (1 - d)
}

/** Margen real sobre costo, descontando solo RST. */
export function margenNeto(precio: number, costoRealValor: number): number {
  return (precio - costoRealValor - precio * CONFIG.RST) / costoRealValor
}

/** Dinero que queda en el bolsillo de David: precio − costo − RST (COP). */
export function gananciaNeta(precio: number, costoRealValor: number): number {
  return precio - costoRealValor - precio * CONFIG.RST
}

/** Total que paga el cliente (precio + IVA). */
export function totalCliente(precio: number): number {
  return precio * (1 + CONFIG.IVA)
}

/** Indica que fases "individuales" tiene un item: grabacion y/o edicion. */
export function fasesIndividuales(componentes: ComponenteCotizacion[]): {
  grabacion: boolean
  edicion: boolean
} {
  return {
    grabacion: componentes.some((c) => c.horasGrab > 0),
    edicion: componentes.some((c) => c.horasEdic > 0),
  }
}

/** Recargo individual total de un item: suma del recargo de cada fase presente. */
export function recargoIndividual(componentes: ComponenteCotizacion[]): number {
  const { grabacion, edicion } = fasesIndividuales(componentes)
  return (grabacion ? CONFIG.RECARGO_GRABACION : 0) + (edicion ? CONFIG.RECARGO_EDICION : 0)
}

/**
 * Deriva el precio de venta de un item SUELTO a partir de sus componentes:
 * piso (margen permitido + RST) + recargo individual "anti-paquete".
 *
 * El recargo se aplica POR FASE y con tarifa distinta (grabacion +10% > edicion
 * +5%): un servicio completo graba+edita suma ambos (+15%). Asi un suelto sube
 * mas si exige grabacion, y todo paquete queda como ahorro frente a sus piezas
 * sueltas. Se redondea hacia arriba al multiplo `redondeo` para precios limpios.
 */
export function precioSueltoSugerido(
  componentes: ComponenteCotizacion[],
  margenObjetivo: number = CONFIG.MARGEN_OBJETIVO,
  redondeo = 10000,
): number {
  const cr = costoReal(componentes).costoReal
  const bruto = pisoPrecio(cr, margenObjetivo) * (1 + recargoIndividual(componentes))
  return Math.ceil(bruto / redondeo) * redondeo
}

/** Evaluacion completa de un precio aplicado: piso, margen, semaforo, total. */
export function evaluar(
  precioAplicado: number,
  costoRealValor: number,
  margenObjetivo: number = CONFIG.MARGEN_OBJETIVO,
): ResultadoMargen {
  const piso = pisoPrecio(costoRealValor, margenObjetivo)
  const m = margenNeto(precioAplicado, costoRealValor)

  return {
    precioAplicado,
    costoReal: costoRealValor,
    pisoPrecio: piso,
    margenNeto: m,
    gananciaNeta: gananciaNeta(precioAplicado, costoRealValor),
    rst: precioAplicado * CONFIG.RST,
    iva: precioAplicado * CONFIG.IVA,
    totalCliente: totalCliente(precioAplicado),
    bajoElPiso: precioAplicado < piso,
    semaforo: m >= margenObjetivo ? 'verde' : 'rojo',
  }
}
