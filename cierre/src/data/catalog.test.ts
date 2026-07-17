/**
 * Consistencia del catalogo: todo item es COMPETITIVO (margen real ~20% techo) y
 * NUNCA PIERDE (margen >= 10%, el piso de seguridad). Los precios se derivan al
 * MARGEN_OBJETIVO; el Pack 4 reels es la excepcion de anclaje (margen menor pero
 * >= 10%).
 */

import { describe, it, expect } from 'vitest'
import { CATALOGO, ADDONS } from './catalog'
import { margenNeto } from '../engine/pricing'
import { CONFIG } from '../config/pricing.config'

describe('catalogo: competitivo (~20%) y nunca por debajo del piso (10%)', () => {
  for (const item of CATALOGO) {
    it(`${item.nombre}: margen real entre 10% y ~26%`, () => {
      const m = margenNeto(item.precio, item.costoReal)
      expect(m).toBeGreaterThanOrEqual(CONFIG.MARGEN_MINIMO_DESCUENTO - 1e-9)
      expect(m).toBeLessThanOrEqual(0.26)
    })
  }

  it('casi todos al margen objetivo (20%), salvo excepciones de anclaje', () => {
    const alObjetivo = CATALOGO.filter(
      (i) => margenNeto(i.precio, i.costoReal) >= CONFIG.MARGEN_OBJETIVO - 1e-9,
    )
    // Solo el Pack 4 reels queda por debajo del 20% (anclaje).
    expect(CATALOGO.length - alObjetivo.length).toBeLessThanOrEqual(1)
  })
})

describe('integridad de datos del catalogo', () => {
  it('no hay ids duplicados', () => {
    const ids = CATALOGO.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('precio > costoReal en todos los items', () => {
    for (const item of CATALOGO) {
      expect(item.precio).toBeGreaterThan(item.costoReal)
    }
  })

  it('items solo-edicion declaran su requisito de material', () => {
    for (const item of CATALOGO) {
      if (item.modalidad === 'solo-edicion') {
        expect(item.requisitoMaterial).toBeTruthy()
      }
    }
  })

  it('los add-ons de porcentaje estan entre 0 y 1', () => {
    for (const a of ADDONS) {
      if (a.tipo === 'porcentaje') {
        expect(a.valor).toBeGreaterThan(0)
        expect(a.valor).toBeLessThan(1)
      }
    }
  })
})
