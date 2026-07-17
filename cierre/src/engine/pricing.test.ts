/**
 * VERIFICACION DEL MOTOR — modelo corregido (jun 2026).
 *
 * Mirai Group es la empresa de David: su comision NO es costo, es margen propio.
 * Lo unico que sale del bolsillo = costos reales + RST. El margen real se mide
 * como (honorario − costo − RST)/costo. El costeo (costoReal) es identico al del
 * .xlsx; lo que cambio es como se mide el margen y el piso.
 */

import { describe, it, expect } from 'vitest'
import { CONFIG } from '../config/pricing.config'
import {
  costoReal,
  pisoPrecio,
  precioConMargen,
  margenNeto,
  gananciaNeta,
  evaluar,
  totalCliente,
  precioSueltoSugerido,
  fasesIndividuales,
  recargoIndividual,
  descuentoPrimeraCompra,
  precioPrimeraCompra,
  type ComponenteCotizacion,
} from './pricing'

/** Helper para armar componentes con menos ruido. */
function comp(
  nombre: string,
  horasGrab: number,
  horasEdic: number,
  nDesplazamientos: number,
  alquiler = 0,
): ComponenteCotizacion {
  return { id: nombre, nombre, horasGrab, horasEdic, nDesplazamientos, alquiler }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Costo (sin cambios respecto al .xlsx)
// ─────────────────────────────────────────────────────────────────────────────

const PAQUETES = [
  {
    nombre: 'Evento Media Jornada (4h)',
    componentes: [comp('cobertura 4h', 4, 0, 1), comp('after movie', 0, 8, 0), comp('3 reels', 0, 6, 0)],
    costoEsperado: 1_596_000,
  },
  {
    nombre: 'Evento Completo (8h)',
    componentes: [comp('cobertura 8h', 8, 0, 1), comp('after movie', 0, 10, 0), comp('3 reels', 0, 6, 0)],
    costoEsperado: 2_100_000,
  },
  {
    nombre: 'Pack 4 reels (1 jornada)',
    componentes: [comp('media jornada 4h', 4, 0, 1), comp('4 reels', 0, 8, 0)],
    costoEsperado: 1_092_000,
  },
  {
    nombre: 'Pack 4 podcasts (1 jornada)',
    componentes: [comp('jornada multicam 8h', 8, 0, 1, 400_000), comp('edicion 4 eps', 0, 12, 0)],
    costoEsperado: 2_184_000,
  },
] as const

describe('costoReal reproduce el .xlsx (paquetes)', () => {
  for (const p of PAQUETES) {
    it(`${p.nombre}: costo real = ${p.costoEsperado.toLocaleString('es-CO')}`, () => {
      expect(costoReal([...p.componentes]).costoReal).toBe(p.costoEsperado)
    })
  }
})

describe('costos de items sueltos reproducen la hoja "Costeo" del .xlsx', () => {
  const SUELTOS = [
    { nombre: 'Reel sencillo (graba+edita)', componentes: [comp('reel', 1, 1, 1)], costo: 252_000 },
    { nombre: 'Solo edicion de reel', componentes: [comp('edicion', 0, 2, 0)], costo: 168_000 },
    { nombre: 'Cobertura evento 8h', componentes: [comp('cobertura', 8, 0, 1)], costo: 756_000 },
    { nombre: 'Sesion de fotografia', componentes: [comp('foto', 3, 2, 1)], costo: 504_000 },
    { nombre: 'Podcast 1 ep (full set)', componentes: [comp('podcast', 3, 3, 1, 400_000)], costo: 1_008_000 },
  ]
  for (const s of SUELTOS) {
    it(`${s.nombre}: costo real = ${s.costo.toLocaleString('es-CO')}`, () => {
      expect(costoReal(s.componentes).costoReal).toBe(s.costo)
    })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
//  Piso y margen (modelo corregido: sin Mirai como costo)
// ─────────────────────────────────────────────────────────────────────────────

describe('pisoPrecio = costo*(1+margen)/(1−RST), monotono en el margen', () => {
  it('formula explicita (margen 15%)', () => {
    expect(pisoPrecio(1_000_000, 0.15)).toBeCloseTo((1_000_000 * 1.15) / (1 - CONFIG.RST), 4)
  })
  it('a mayor "margen que me permito", mayor piso', () => {
    expect(pisoPrecio(1_000_000, 0.2)).toBeGreaterThan(pisoPrecio(1_000_000, 0.05))
  })
  it('vender EN el piso deja exactamente ese margen', () => {
    const piso = pisoPrecio(1_000_000, 0.15)
    expect(margenNeto(piso, 1_000_000)).toBeCloseTo(0.15, 9)
  })
  it('precioConMargen es coherente con pisoPrecio', () => {
    expect(precioConMargen(800_000, 0.1)).toBeCloseTo(pisoPrecio(800_000, 0.1), 6)
  })
})

describe('margenNeto y gananciaNeta: Mirai NO se resta (es margen propio)', () => {
  it('margenNeto = (precio − costo − RST)/costo', () => {
    // precio 1.2M, costo 1.0M, RST 5.9% -> (200.000 − 70.800)/1.000.000 = 12,92%
    expect(margenNeto(1_200_000, 1_000_000)).toBeCloseTo(0.1292, 6)
  })
  it('gananciaNeta = precio − costo − RST (COP)', () => {
    expect(gananciaNeta(1_200_000, 1_000_000)).toBeCloseTo(129_200, 4)
  })
  it('Evento Completo: la ganancia real es mucho mayor que el viejo "neto con Mirai"', () => {
    // Antes (Mirai como costo) el margen rondaba 12,6%. Ahora el margen real ~34%.
    expect(margenNeto(2_990_000, 2_100_000)).toBeCloseTo(0.339805, 5)
    expect(gananciaNeta(2_990_000, 2_100_000)).toBeCloseTo(713_590, 0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
//  Recargo "anti-paquete" de items sueltos (sin cambios de logica)
// ─────────────────────────────────────────────────────────────────────────────

describe('precio de suelto: recargo individual POR FASE (grab 10% / edic 5%)', () => {
  const reel = [comp('reel', 1, 1, 1)] // graba + edita
  const soloEdic = [comp('edicion', 0, 2, 0)] // solo edita
  const soloGrab = [comp('cobertura', 8, 0, 1)] // solo graba

  it('detecta las fases presentes', () => {
    expect(fasesIndividuales(reel)).toEqual({ grabacion: true, edicion: true })
    expect(fasesIndividuales(soloEdic)).toEqual({ grabacion: false, edicion: true })
    expect(fasesIndividuales(soloGrab)).toEqual({ grabacion: true, edicion: false })
  })

  it('recargo: graba+edita = 15%, solo graba = 10%, solo edita = 5%', () => {
    expect(recargoIndividual(reel)).toBeCloseTo(0.15, 6)
    expect(recargoIndividual(soloGrab)).toBeCloseTo(0.1, 6)
    expect(recargoIndividual(soloEdic)).toBeCloseTo(0.05, 6)
  })

  it('el suelto siempre cuesta MAS que su piso pelado (anti-paquete)', () => {
    const cr = costoReal(reel).costoReal
    expect(precioSueltoSugerido(reel)).toBeGreaterThan(pisoPrecio(cr))
  })
})

// ─────────────────────────────────────────────────────────────────────────────
//  Descuento de primera compra: nunca cruza el margen minimo
// ─────────────────────────────────────────────────────────────────────────────

describe('descuento de primera compra', () => {
  it('el precio con descuento mantiene el margen minimo (2%)', () => {
    const p = precioPrimeraCompra(410_000, 252_000)
    expect(margenNeto(p, 252_000)).toBeGreaterThanOrEqual(CONFIG.MARGEN_MINIMO_DESCUENTO - 1e-9)
  })

  it('un margen minimo mas permisivo deja descontar mas', () => {
    const dEstricto = descuentoPrimeraCompra(410_000, 252_000, 0.1)
    const dLaxo = descuentoPrimeraCompra(410_000, 252_000, 0.02)
    expect(dLaxo).toBeGreaterThan(dEstricto)
  })

  it('nunca supera el tope configurado (40%)', () => {
    const d = descuentoPrimeraCompra(10_000_000, 100_000) // item ultra-rentable
    expect(d).toBeLessThanOrEqual(CONFIG.DESCUENTO_PRIMERA_COMPRA_TOPE)
  })

  it('item ya al piso: descuento ~0', () => {
    const piso = pisoPrecio(252_000, CONFIG.MARGEN_MINIMO_DESCUENTO)
    expect(descuentoPrimeraCompra(piso, 252_000)).toBeCloseTo(0, 6)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
//  evaluar: semaforo, piso, IVA y total
// ─────────────────────────────────────────────────────────────────────────────

describe('evaluar: semaforo, piso, IVA y total', () => {
  it('por encima del piso: verde, no bajo el piso', () => {
    const r = evaluar(2_990_000, 2_100_000, 0.15)
    expect(r.semaforo).toBe('verde')
    expect(r.bajoElPiso).toBe(false)
    expect(r.margenNeto).toBeGreaterThanOrEqual(0.15)
  })
  it('precio bajo el piso => bandera roja', () => {
    const piso = pisoPrecio(2_100_000, 0.15)
    const r = evaluar(piso - 100_000, 2_100_000, 0.15)
    expect(r.bajoElPiso).toBe(true)
    expect(r.semaforo).toBe('rojo')
  })
  it('gananciaNeta e IVA vienen en el resultado', () => {
    const r = evaluar(2_990_000, 2_100_000, 0.15)
    expect(r.gananciaNeta).toBeCloseTo(713_590, 0)
    expect(r.iva).toBeCloseTo(2_990_000 * 0.19, 4)
  })
  it('totalCliente = precio + 19% IVA', () => {
    expect(totalCliente(2_990_000)).toBe(2_990_000 * 1.19)
  })
})
