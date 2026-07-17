/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONFIG — Fuente unica de constantes de precio de Kaizen Studios
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  TODO numero que afecte precios o margenes vive AQUI. Para reajustar tarifas
 *  el dia de manana, se editan estos valores y nada mas.
 *
 *  MODELO ACTUAL = "ETAPA LANZAMIENTO" (fuente: Kaizen_Calculadora_Servicios.xlsx,
 *  hoja "Supuestos", Jun 2026). Precios y margenes reducidos a proposito para
 *  entrar al mercado; se suben cuando haya traccion y casos documentados.
 *
 *  Para volver al "MODELO MERCADO" (el del prompt v2 / catalogo.md), basta con
 *  cambiar los 3 valores marcados ▼ MERCADO ▼ por los comentados al lado.
 *  El resto (RST, IVA, transporte, colchon, Mirai) es identico en ambos modelos.
 */

export const CONFIG = {
  /** Costo de una hora de trabajo de los fundadores (COP).
   *  ▼ MERCADO ▼  -> 100_000 */
  TARIFA_HORA: 80_000,

  /** Recargo por uso de equipos propios, sobre el costo de horas.
   *  ▼ MERCADO ▼  -> 0.15  (15%) */
  RECARGO_EQUIPOS: 0,

  /** Colchon operativo oculto sobre el costo (imprevistos internos).
   *  Va al costo real, NUNCA se le muestra al cliente. */
  COLCHON: 0.05,

  /** Costo por desplazamiento a locacion (COP). */
  TRANSPORTE_DESPL: 80_000,

  /** Margen REAL estandar al que se cotiza = nivel al que se deriva TODO el
   *  catalogo. David (jun 2026): 20% al arrancar para entrar competitivos; se
   *  sube paulatinamente con traccion. Es el default del motor. OJO: ya NO existe
   *  "comision Mirai" como costo (Mirai es la empresa de David = margen propio).
   *  Lo unico que sale del bolsillo = costos reales + RST. */
  MARGEN_OBJETIVO: 0.2,

  /** Slider "margen que me permito" — LABELS que ve David. Por dentro se les SUMA
   *  COLCHON_SEGURIDAD, asi 5%→10%, 10%→15%, 15%→20%, 20%→25% reales. */
  MARGEN_PERMITIDO_OPCIONES: [0.2, 0.15, 0.1, 0.05] as const,

  /** Label inicial del slider. 15% + 5% de colchon = 20% real = nivel del catalogo. */
  MARGEN_PERMITIDO_DEFAULT: 0.15,

  /** Colchon de seguridad OCULTO que se suma al label del slider, para nunca
   *  perder: el slider en 5% cierra en 10% real. (David: "siempre un 5%".) */
  COLCHON_SEGURIDAD: 0.05,

  /** Descuento de PRIMERA COMPRA (fidelizacion). Es un TOPE aspiracional: el motor
   *  aplica el mayor descuento posible hasta este tope, pero NUNCA por debajo del
   *  margen minimo de abajo. */
  DESCUENTO_PRIMERA_COMPRA_TOPE: 0.4,

  /** Piso absoluto de margen real: el descuento NUNCA lo cruza. 10% = "nunca
   *  perdamos" (coincide con el slider mas agresivo: 5% + 5% de colchon). */
  MARGEN_MINIMO_DESCUENTO: 0.1,

  /** Regimen Simple RST: % sobre ingresos brutos. SI es costo (lo paga Kaizen). */
  RST: 0.059,

  /** IVA sobre servicios. Lo paga el CLIENTE; no es costo de Kaizen.
   *  Solo se usa para mostrar el total que el cliente abona. */
  IVA: 0.19,

  /** Recargo "anti-paquete" para items sueltos a-la-carte, aplicado POR FASE y
   *  con tarifa DISTINTA segun la fase (grabacion cuesta mas que edicion):
   *   - Grabacion +10%: carga transporte, camaras, luces, equipo (costo fisico).
   *   - Edicion   +5%:  solo plataformas, luz, internet, PC (costo liviano).
   *  Un servicio completo (graba+edita) suma ambos = +15%. Hace que todo paquete
   *  se vea como descuento (anclaje). Rango acordado 5%–10% por fase. */
  RECARGO_GRABACION: 0.1,
  RECARGO_EDICION: 0.05,
} as const

export type PricingConfig = typeof CONFIG
