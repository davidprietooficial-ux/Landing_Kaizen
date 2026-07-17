/**
 * PANEL INTERNO (Capa B) — solo David. Costo, piso, margen, semaforo, palancas.
 *
 * Se abre/cierra con atajo de teclado (lo controla el padre). NUNCA se imprime
 * ni se exporta: vive como overlay encima del cotizador y se oculta al instante
 * con la tecla de panico (anti-fuga).
 */

import { useState } from 'react'
import { cop, pct } from '../lib/format'
import { GRUPOS_ADICIONALES } from './cotizacion'
import type { CotizacionAPI, SemaforoUI } from './cotizacion'

const SEM_LABEL: Record<SemaforoUI, string> = {
  sano: 'Sano',
  ajustado: 'Ajustado',
  'bajo-piso': 'En riesgo',
}

export function PanelInterno({
  api,
  onCerrar,
}: {
  api: CotizacionAPI
  onCerrar: () => void
}) {
  const { interna, estado, togglePrimeraCompra, agregarAdicional } = api
  const sem = interna.semaforoUI

  return (
    <div className="pi" role="dialog" aria-label="Panel interno">
      <div className="pi__top">
        <span className="pi__badge">● MODO INTERNO · solo tú</span>
        <span className={`pi__sem pi__sem--${sem}`}>
          <span className="pi__sem-dot" /> {SEM_LABEL[sem]} · margen {pct(interna.margenNeto)}
        </span>
        <button className="pi__hide" onClick={onCerrar} title="Ocultar (Esc)">
          Ocultar ✕
        </button>
      </div>

      <div className="pi__grid">
        <Cifra label="Costo real" valor={cop(interna.costoReal)} />
        <Cifra label="Piso sano" valor={cop(interna.pisoPrecio)} />
        <Cifra label="Honorario aplicado" valor={cop(interna.precioAplicado)} />
        <Cifra label="RST (5,9%)" valor={cop(interna.rst)} />
        <Cifra label="IVA 19% (lo paga el cliente)" valor={cop(interna.iva)} />
        <Cifra label="Total cliente (c/IVA)" valor={cop(interna.totalCliente)} />
        <Cifra
          label="Ganancia neta (tuya)"
          valor={cop(interna.gananciaNeta)}
          fuerte
        />
      </div>

      <div className="pi__palancas">
        {/* El toggle de "margen que me permito" se retiró (jul 2026): el precio
            ya no es variable en reunión — siempre el del catálogo. */}
        <div className="pi__palanca">
          <span className="pi__plabel">Descuento 1ª compra</span>
          <button
            className={`pi__switch ${estado.primeraCompra ? 'pi__switch--on' : ''}`}
            onClick={togglePrimeraCompra}
          >
            {estado.primeraCompra
              ? `ON · −${pct(interna.descuentoFraccion, 0)}`
              : 'OFF'}
          </button>
        </div>

        <FormAdicional onAgregar={agregarAdicional} />
      </div>

      <p className="pi__pie">
        Margen real = honorario − costo − RST. Verde = alcanzas tu margen
        objetivo. Nada de esto se imprime ni se envía.
      </p>
    </div>
  )
}

function Cifra({
  label,
  valor,
  fuerte,
}: {
  label: string
  valor: string
  fuerte?: boolean
}) {
  return (
    <div className={`pi__cifra ${fuerte ? 'pi__cifra--fuerte' : ''}`}>
      <span className="pi__clabel">{label}</span>
      <span className="pi__cvalor">{valor}</span>
    </div>
  )
}

/** Mini-formulario para sumar un adicional flexible (nombre + honorario + costo). */
function FormAdicional({
  onAgregar,
}: {
  onAgregar: (nombre: string, precio: number, costo: number) => void
}) {
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [costo, setCosto] = useState('')

  const valido = nombre.trim() !== '' && Number(precio) > 0

  const enviar = () => {
    if (!valido) return
    onAgregar(nombre.trim(), Number(precio), Number(costo) || 0)
    setNombre('')
    setPrecio('')
    setCosto('')
  }

  // Lista rápida aplanada (audiovisual + web + pauta), con secciones optgroup.
  const sugeridos = GRUPOS_ADICIONALES.flatMap((g) => g.items)

  const elegirSugerido = (idx: number) => {
    const s = sugeridos[idx]
    if (!s) return
    setNombre(s.nombre)
    setPrecio(String(s.precio))
    setCosto(String(s.costo))
  }

  return (
    <div className="pi__palanca pi__adic">
      <span className="pi__plabel">Adicional flexible</span>
      <div className="pi__adic-row">
        <select
          className="pi__input pi__select"
          value=""
          onChange={(e) => e.target.value !== '' && elegirSugerido(Number(e.target.value))}
          aria-label="Elegir adicional sugerido"
        >
          <option value="">Lista rápida…</option>
          {GRUPOS_ADICIONALES.map((g, gi) => {
            // Índice plano acumulado para que coincida con `sugeridos`.
            const base = GRUPOS_ADICIONALES.slice(0, gi).reduce((n, x) => n + x.items.length, 0)
            return (
              <optgroup key={g.grupo} label={g.grupo}>
                {g.items.map((s, i) => (
                  <option key={s.nombre} value={base + i}>
                    {s.nombre}
                  </option>
                ))}
              </optgroup>
            )
          })}
        </select>
        <input
          className="pi__input pi__input--nombre"
          placeholder="Concepto (o escríbelo)"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          className="pi__input"
          placeholder="Honorario"
          inputMode="numeric"
          value={precio}
          onChange={(e) => setPrecio(e.target.value.replace(/\D/g, ''))}
        />
        <input
          className="pi__input"
          placeholder="Costo"
          inputMode="numeric"
          value={costo}
          onChange={(e) => setCosto(e.target.value.replace(/\D/g, ''))}
        />
        <button className="pi__add" onClick={enviar} disabled={!valido}>
          + Sumar
        </button>
      </div>
    </div>
  )
}
