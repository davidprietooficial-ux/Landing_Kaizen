/**
 * GARANTÍA: lo que ve el cliente en la página es EXACTAMENTE lo que llega al correo.
 *
 * El correo se arma desde el mismo objeto `cliente`/`interna` y la misma función
 * `precioAjustado` que pinta la pantalla, así que no hay margen de error. Este test
 * lo verifica: si alguien cambia algo que rompa la coincidencia, falla aquí.
 */

import { describe, it, expect } from 'vitest'
import { cop } from '../lib/format'
import { vistaCliente, vistaInterna, precioAjustado, type Linea, type EstadoCotizacion } from './cotizacion'
import { buildCierrePayload } from './cierrePayload'

const lineas: Linea[] = [
  { uid: '1', refId: 'a', nombre: 'Pack 4 reels', precio: 1_500_000, costoReal: 820_000, cantidad: 1, esAdicional: false },
  { uid: '2', refId: 'b', nombre: 'Día de grabación', precio: 900_000, costoReal: 500_000, cantidad: 2, esAdicional: false },
  { uid: '3', refId: 'c', nombre: 'Versión por canal extra', precio: 120_000, costoReal: 50_000, cantidad: 3, esAdicional: true },
]
const margen = 15
const estado: EstadoCotizacion = { lineas, margenPermitido: margen, primeraCompra: false }
const cliente = vistaCliente(estado)
const interna = vistaInterna(estado)
const p = buildCierrePayload(lineas, margen, cliente, interna, 'cliente@ejemplo.com')

describe('el correo refleja EXACTAMENTE los números de la página', () => {
  it('los totales del correo = los totales que ve el cliente', () => {
    for (const valor of [cop(cliente.honorario), cop(cliente.iva), cop(cliente.total)]) {
      expect(p.emailCliente.text).toContain(valor)
      expect(p.emailCliente.html).toContain(valor)
    }
  })

  it('el precio de cada línea del correo = el que muestra la página', () => {
    for (const l of lineas) {
      const precioPagina = cop(precioAjustado(l.precio, margen) * l.cantidad)
      expect(p.emailCliente.text).toContain(precioPagina)
      expect(p.emailCliente.html).toContain(precioPagina)
    }
  })

  it('el anticipo del correo = anticipo exacto, y NO aparece el saldo', () => {
    expect(p.emailCliente.html).toContain(cop(p.sheet.anticipo))
    expect(p.emailCliente.text).toContain(cop(p.sheet.anticipo))
    // El saldo (cuando es distinto del anticipo) ya no debe mostrarse al cliente.
    if (p.sheet.saldo !== p.sheet.anticipo) {
      expect(p.emailCliente.text).not.toContain('Saldo')
    }
  })

  it('el correo al cliente NO expone NIT, costo ni margen', () => {
    // (La cuenta bancaria sí lleva el titular legal — eso es obligatorio para el pago.)
    for (const fuga of ['NIT', 'Costo', 'costo', 'Margen', 'margen']) {
      expect(p.emailCliente.text).not.toContain(fuga)
      expect(p.emailCliente.html).not.toContain(fuga)
    }
  })

  it('el Sheet (capa interna) = la vista interna', () => {
    expect(p.sheet.total).toBe(interna.totalCliente)
    expect(p.sheet.honorario).toBe(interna.precioAplicado)
    expect(p.sheet.iva).toBe(interna.iva)
    expect(p.sheet.costoDirecto).toBe(interna.costoReal)
    expect(p.sheet.margenNeto).toBe(interna.margenNeto)
  })
})
