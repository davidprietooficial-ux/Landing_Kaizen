import { describe, it, expect } from 'vitest'
import { CONFIG } from '../config/pricing.config'
import {
  semaforoUI,
  vistaCliente,
  vistaInterna,
  factorMargen,
  precioAjustado,
  anticipoSaldo,
  conItemAgregado,
  conAdicionalAgregado,
  type EstadoCotizacion,
  type Linea,
} from './cotizacion'

const linea = (precio: number, costoReal: number, cantidad = 1): Linea => ({
  uid: `t-${precio}-${costoReal}`,
  refId: 'test',
  nombre: 'Item de prueba',
  precio,
  costoReal,
  cantidad,
  esAdicional: false,
})

const estado = (lineas: Linea[], extra: Partial<EstadoCotizacion> = {}): EstadoCotizacion => ({
  lineas,
  margenPermitido: CONFIG.MARGEN_PERMITIDO_DEFAULT,
  primeraCompra: false,
  ...extra,
})

describe('semaforoUI', () => {
  it('verde (sano) en/por encima del margen que me permito', () => {
    expect(semaforoUI(CONFIG.MARGEN_PERMITIDO_DEFAULT, CONFIG.MARGEN_PERMITIDO_DEFAULT)).toBe('sano')
    expect(semaforoUI(0.5, CONFIG.MARGEN_PERMITIDO_DEFAULT)).toBe('sano')
  })

  it('amarillo (ajustado) entre el minimo (10%) y el objetivo', () => {
    expect(semaforoUI(0.14, 0.2)).toBe('ajustado')
    expect(semaforoUI(CONFIG.MARGEN_MINIMO_DESCUENTO, 0.2)).toBe('ajustado')
  })

  it('el piso EXACTO del descuento no debe verse rojo por punto flotante', () => {
    expect(semaforoUI(CONFIG.MARGEN_MINIMO_DESCUENTO - 1e-9, 0.15)).toBe('ajustado')
  })

  it('rojo (en riesgo) por debajo del minimo seguro', () => {
    expect(semaforoUI(0.01, 0.15)).toBe('bajo-piso')
    expect(semaforoUI(0, 0.15)).toBe('bajo-piso')
    expect(semaforoUI(-0.1, 0.15)).toBe('bajo-piso')
  })

  it('el umbral verde se mueve con el objetivo: 12% pasa en 10% pero no en 20%', () => {
    expect(semaforoUI(0.12, 0.1)).toBe('sano')
    expect(semaforoUI(0.12, 0.2)).toBe('ajustado')
  })
})

describe('vistaCliente (capa A)', () => {
  it('suma honorario, IVA y total sin filtrar costo', () => {
    const vc = vistaCliente(estado([linea(1_000_000, 500_000)]))
    expect(vc.honorario).toBe(1_000_000)
    expect(vc.iva).toBeCloseTo(190_000)
    expect(vc.total).toBeCloseTo(1_190_000)
    expect(vc.descuentoAplicado).toBe(false)
    // El objeto de cliente NO expone ningun campo de costo/margen.
    expect(Object.keys(vc)).not.toContain('costoReal')
    expect(Object.keys(vc)).not.toContain('margenNeto')
    expect(Object.keys(vc)).not.toContain('gananciaNeta')
  })

  it('respeta cantidades', () => {
    const vc = vistaCliente(estado([linea(390_000, 200_000, 4)]))
    expect(vc.honorario).toBe(1_560_000)
  })

  it('marca vacio cuando no hay lineas', () => {
    expect(vistaCliente(estado([])).vacio).toBe(true)
  })
})

describe('el margen MANDA el precio (slider en vivo)', () => {
  const M = CONFIG.MARGEN_PERMITIDO_OPCIONES // [0.20, 0.15, 0.10, 0.05]

  it('en el default (label 15) el factor es 1: precio = catalogo exacto', () => {
    expect(factorMargen(CONFIG.MARGEN_PERMITIDO_DEFAULT)).toBeCloseTo(1)
    expect(precioAjustado(330_000, CONFIG.MARGEN_PERMITIDO_DEFAULT)).toBe(330_000)
  })

  it('subir el margen sube el honorario; bajarlo lo baja', () => {
    const carrito = [linea(330_000, 252_000)]
    const alto = vistaCliente(estado(carrito, { margenPermitido: 0.2 })).honorario
    const medio = vistaCliente(estado(carrito, { margenPermitido: 0.15 })).honorario
    const bajo = vistaCliente(estado(carrito, { margenPermitido: 0.05 })).honorario
    expect(alto).toBeGreaterThan(medio)
    expect(medio).toBeGreaterThan(bajo)
    expect(medio).toBe(330_000) // el default no cambia el catalogo
  })

  it('el total, el IVA y la ganancia se mueven con el margen', () => {
    const carrito = [linea(330_000, 252_000)]
    const a = vistaCliente(estado(carrito, { margenPermitido: 0.2 }))
    const b = vistaCliente(estado(carrito, { margenPermitido: 0.05 }))
    expect(a.total).toBeGreaterThan(b.total)
    expect(a.iva).toBeGreaterThan(b.iva)
    const ga = vistaInterna(estado(carrito, { margenPermitido: 0.2 })).gananciaNeta
    const gb = vistaInterna(estado(carrito, { margenPermitido: 0.05 })).gananciaNeta
    expect(ga).toBeGreaterThan(gb)
  })

  it('el margen real mostrado sube y baja con el slider, y nunca pierde (≥10%)', () => {
    const carrito = [linea(330_000, 252_000)]
    for (const label of M) {
      const vi = vistaInterna(estado(carrito, { margenPermitido: label }))
      // El colchon de +5% garantiza piso real de 10% en el slider mas agresivo.
      expect(vi.margenNeto).toBeGreaterThanOrEqual(CONFIG.MARGEN_MINIMO_DESCUENTO)
    }
    const agresivo = vistaInterna(estado(carrito, { margenPermitido: 0.05 })).margenNeto
    const conservador = vistaInterna(estado(carrito, { margenPermitido: 0.2 })).margenNeto
    expect(conservador).toBeGreaterThan(agresivo)
  })

  it('las lineas del carrito siguen sumando exacto al honorario', () => {
    const carrito = [linea(330_000, 252_000, 2), linea(120_000, 50_000, 1)]
    for (const label of M) {
      const e = estado(carrito, { margenPermitido: label })
      const sumaLineas = carrito.reduce(
        (acc, l) => acc + precioAjustado(l.precio, label) * l.cantidad,
        0,
      )
      expect(vistaCliente(e).honorario).toBe(sumaLineas)
    }
  })
})

describe('anticipoSaldo (cierre)', () => {
  it('parte el total en anticipo + saldo que SIEMPRE suman el total', () => {
    const { anticipo, saldo } = anticipoSaldo(1_190_000, 0.5)
    expect(anticipo).toBe(595_000)
    expect(anticipo + saldo).toBe(1_190_000)
  })

  it('redondea el anticipo a $1.000 sin perder pesos en el saldo', () => {
    const total = 392_700
    const { anticipo, saldo } = anticipoSaldo(total, 0.5)
    expect(anticipo % 1000).toBe(0)
    expect(anticipo + saldo).toBe(total)
  })
})

describe('vistaInterna (capa B)', () => {
  it('expone costo/margen/ganancia y deriva semaforo sano en margen alto', () => {
    const vi = vistaInterna(estado([linea(1_000_000, 500_000)]))
    expect(vi.costoReal).toBe(500_000)
    expect(vi.semaforoUI).toBe('sano')
    expect(vi.margenNeto).toBeGreaterThan(CONFIG.MARGEN_PERMITIDO_DEFAULT)
    expect(vi.gananciaNeta).toBeGreaterThan(0)
  })

  it('el descuento de 1a compra aterriza en ajustado (no rojo)', () => {
    const vi = vistaInterna(estado([linea(1_000_000, 500_000)], { primeraCompra: true }))
    expect(vi.semaforoUI).toBe('ajustado')
    expect(vi.descuentoFraccion).toBeGreaterThan(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
//  Regla anti-sobrecosto + fusión de líneas (paquetes Kaizen 2.0)
// ─────────────────────────────────────────────────────────────────────────────

describe('regla anti-sobrecosto (paquetes 2.0)', () => {
  const ED = { id: 'pkg-entrada-digital', nombre: 'Entrada Digital (año)', precio: 3_000_000, costoReal: 2_220_000 }
  const EDM = { id: 'pkg-entrada-mantenimiento', nombre: 'Mantenimiento ED (mes)', precio: 300_000, costoReal: 222_000 }
  const SC = { id: 'pkg-sistema-clientes', nombre: 'Sistema de Clientes — página + tráfico', precio: 5_000_000, costoReal: 3_700_000 }

  it('agregar Sistema de Clientes elimina Entrada Digital y su mantenimiento', () => {
    let lineas = conItemAgregado([], ED)
    lineas = conItemAgregado(lineas, EDM)
    lineas = conItemAgregado(lineas, SC)
    expect(lineas.map((l) => l.refId)).toEqual(['pkg-sistema-clientes'])
  })

  it('con Sistema de Clientes en el carrito, Entrada Digital no entra (no-op)', () => {
    let lineas = conItemAgregado([], SC)
    lineas = conItemAgregado(lineas, ED)
    lineas = conItemAgregado(lineas, EDM)
    expect(lineas.map((l) => l.refId)).toEqual(['pkg-sistema-clientes'])
    expect(lineas[0].cantidad).toBe(1)
  })

  it('el mismo item dos veces sube cantidad, no duplica línea', () => {
    let lineas = conItemAgregado([], ED)
    lineas = conItemAgregado(lineas, ED)
    expect(lineas).toHaveLength(1)
    expect(lineas[0].cantidad).toBe(2)
  })

  it('los items ajenos a la regla no se tocan', () => {
    let lineas = conItemAgregado([], { id: 'red-reel-sencillo', nombre: 'Reel', precio: 410_000, costoReal: 250_000 })
    lineas = conItemAgregado(lineas, SC)
    expect(lineas.map((l) => l.refId)).toEqual(['red-reel-sencillo', 'pkg-sistema-clientes'])
  })
})

describe('adicionales fusionados', () => {
  it('el mismo adicional (nombre + precio) sube cantidad en una sola línea', () => {
    let lineas = conAdicionalAgregado([], 'Dron (operador + equipo)', 350_000, 220_000)
    lineas = conAdicionalAgregado(lineas, 'Dron (operador + equipo)', 350_000, 220_000)
    expect(lineas).toHaveLength(1)
    expect(lineas[0].cantidad).toBe(2)
    expect(lineas[0].esAdicional).toBe(true)
  })
})

describe('coherencia de redondeo (montos al peso, sin descuadres)', () => {
  it('IVA y total son enteros y total = honorario + IVA exacto', () => {
    const vc = vistaCliente(estado([linea(1_000_000, 500_000)]))
    expect(Number.isInteger(vc.iva)).toBe(true)
    expect(Number.isInteger(vc.total)).toBe(true)
    expect(vc.total).toBe(vc.honorario + vc.iva)
  })

  it('el honorario con descuento de 1ª compra queda en miles limpios', () => {
    const vc = vistaCliente(estado([linea(1_000_000, 700_000)], { primeraCompra: true }))
    expect(vc.descuentoAplicado).toBe(true)
    expect(vc.honorario % 1000).toBe(0)
    expect(vc.total).toBe(vc.honorario + vc.iva)
  })

  it('capa A (cliente) y capa B (interna) comparten honorario, IVA y total', () => {
    const e = estado([linea(1_000_000, 700_000)], { primeraCompra: true })
    const vc = vistaCliente(e)
    const vi = vistaInterna(e)
    expect(vi.precioAplicado).toBe(vc.honorario)
    expect(vi.iva).toBe(vc.iva)
    expect(vi.totalCliente).toBe(vc.total)
  })

  it('la ganancia neta interna cuadra al peso: honorario − costo − RST', () => {
    const e = estado([linea(2_000_000, 1_000_000)])
    const vi = vistaInterna(e)
    expect(Number.isInteger(vi.gananciaNeta)).toBe(true)
    expect(vi.gananciaNeta).toBe(vi.precioAplicado - vi.costoReal - vi.rst)
  })
})
