/**
 * COTIZADOR (Capa A) — lo que ve el cliente. Va al final del lienzo.
 *
 * David arma la cotizacion en vivo: abre desplegables por tipo de servicio,
 * agrega piezas y el cliente ve SOLO honorario + IVA + total. Costo, margen y
 * Mirai viven en el panel interno (Capa B), que se abre con un atajo de teclado.
 *
 *   Atajos:  Ctrl/Cmd + Shift + K  -> abre/cierra el panel interno
 *            Esc                    -> oculta el panel al instante (anti-fuga)
 */

// useEffect vuelve al descomentar el PANEL INTERNO (atajo de teclado).
import { useState } from 'react'
import { cop } from '../lib/format'
import type { ItemCatalogo, Categoria } from '../data/catalog'
import {
  useCotizacion,
  gruposDeCategoria,
  precioAjustado,
  GRUPOS_ADICIONALES,
  GRUPOS_PAQUETES,
  type PaquetePrincipal,
} from './cotizacion'
import { CATEGORIAS as CATEGORIAS_LIENZO } from '../lienzo/content'
// Panel interno comentado a pedido de David (jul 2026). Reactivar: descomentar
// este import y los bloques marcados "PANEL INTERNO" más abajo.
// import { PanelInterno } from './PanelInterno'
import { PreviaCierre } from './PreviaCierre'
import { buildCierrePayload, type CierreResultado } from './cierrePayload'
import './cotizador.css'

// Mismas categorías que el catálogo de arriba (content.ts); aquí solo el emoji.
const EMOJI_CAT: Record<Categoria, string> = {
  redes: '📲',
  eventos: '🎤',
  corporativo: '🏢',
  inmobiliario: '🏠',
}
const CATEGORIAS = CATEGORIAS_LIENZO.map((c) => ({ id: c.id, label: c.label, emoji: EMOJI_CAT[c.id] }))

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Cotizador() {
  // PANEL INTERNO usa la `api` completa; mientras esté comentado, destructuramos directo.
  const { estado, cliente, interna, agregarItem, agregarAdicional, cambiarCantidad, quitar, limpiar } =
    useCotizacion()
  // Nivel superior: paquetes principales (2.0) o add-ons (catálogo audiovisual).
  const [nivel, setNivel] = useState<'paquetes' | 'addons'>('paquetes')
  const [catActiva, setCatActiva] = useState<Categoria>('redes')
  const [grupoAbierto, setGrupoAbierto] = useState<string | null>(null)
  const [adicAbierto, setAdicAbierto] = useState(false)
  // PANEL INTERNO (comentado):
  // const [panelAbierto, setPanelAbierto] = useState(false)

  // Estado del cierre (campo de correo + confirmacion + envio real al backend).
  const [correo, setCorreo] = useState('')
  const [confirmando, setConfirmando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<CierreResultado | null>(null)

  // PANEL INTERNO (comentado): atajo ⌘⇧K para abrir + Esc para ocultar.
  // useEffect(() => {
  //   const onKey = (e: KeyboardEvent) => {
  //     const toggle =
  //       (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'k'
  //     if (toggle) {
  //       e.preventDefault()
  //       setPanelAbierto((v) => !v)
  //     } else if (e.key === 'Escape' && panelAbierto) {
  //       setPanelAbierto(false)
  //     }
  //   }
  //   window.addEventListener('keydown', onKey)
  //   return () => window.removeEventListener('keydown', onKey)
  // }, [panelAbierto])

  const grupos = gruposDeCategoria(catActiva)
  const correoValido = EMAIL_RE.test(correo.trim())

  const cambiarCategoria = (id: Categoria) => {
    setCatActiva(id)
    setGrupoAbierto(null)
  }

  // Cierre real: arma el payload y lo manda al backend local (/api/cierre), que
  // envia los correos y crea la hoja de costeo. Pase lo que pase, muestra la previa
  // manual como respaldo (especialmente util si algo falla).
  const cerrarYEnviar = async () => {
    if (!correoValido || enviando) return
    setEnviando(true)
    setResultado(null)
    try {
      const payload = buildCierrePayload(
        estado.lineas,
        estado.margenPermitido,
        cliente,
        interna,
        correo.trim(),
      )
      const res = await fetch('/api/cierre', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setResultado((await res.json()) as CierreResultado)
    } catch (e) {
      setResultado({
        ok: false,
        error: `No se pudo contactar el servidor. ¿Está corriendo la app con "npm run dev"? (${String(
          (e as Error)?.message || e,
        )})`,
        email: null,
        sheet: null,
        ghl: null,
      })
    } finally {
      setEnviando(false)
      setEnviado(true)
    }
  }

  return (
    <section className="cot" id="cotizador">
      <header className="cot__head">
        <span className="cot__kicker">Cotización en vivo</span>
        <h2 className="cot__titulo">Armemos tu sistema de ventas</h2>
        <p className="cot__sub">
          Elige tu paquete — o suma add-ons — y el total se calcula al instante.
          Al final tomas una decisión. 👇
        </p>
      </header>

      <div className="cot__cuerpo">
        {/* ── Selector: paquetes principales (2.0) o add-ons por categoría ── */}
        <div className="cot__catalogo">
          <div className="cot__tabs">
            <button
              className={`cot__tab ${nivel === 'paquetes' ? 'cot__tab--on' : ''}`}
              onClick={() => setNivel('paquetes')}
            >
              <span aria-hidden>📦</span> Paquetes principales
            </button>
            <button
              className={`cot__tab ${nivel === 'addons' ? 'cot__tab--on' : ''}`}
              onClick={() => setNivel('addons')}
            >
              <span aria-hidden>🧩</span> Add-ons
            </button>
          </div>

          {nivel === 'paquetes' ? (
            <div className="cot__grupos">
              {GRUPOS_PAQUETES.map((g) => {
                const abierto = grupoAbierto === g.id
                return (
                  <div key={g.id} className={`cot__grupo ${abierto ? 'cot__grupo--on' : ''}`}>
                    <button
                      className="cot__gtrigger"
                      onClick={() => setGrupoAbierto(abierto ? null : g.id)}
                      aria-expanded={abierto}
                    >
                      <span className="cot__glabel">
                        <span aria-hidden>{g.emoji}</span> {g.label}
                      </span>
                      <span className="cot__gmeta">
                        <span className="cot__gcount">{g.items.length}</span>
                        <span className={`cot__gchevron ${abierto ? 'cot__gchevron--on' : ''}`} aria-hidden>
                          ⌄
                        </span>
                      </span>
                    </button>
                    {abierto && (
                      <div className="cot__lista">
                        {g.items.map((p) => (
                          <FilaPaquete key={p.id} p={p} onAgregar={() => agregarItem(p)} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <>
              <div className="cot__tabs cot__tabs--sub">
                {CATEGORIAS.map((c) => (
                  <button
                    key={c.id}
                    className={`cot__tab ${catActiva === c.id ? 'cot__tab--on' : ''}`}
                    onClick={() => cambiarCategoria(c.id)}
                  >
                    <span aria-hidden>{c.emoji}</span> {c.label}
                  </button>
                ))}
              </div>

              <div className="cot__grupos">
                {grupos.map((g) => {
                  const abierto = grupoAbierto === g.id
                  return (
                    <div key={g.id} className={`cot__grupo ${abierto ? 'cot__grupo--on' : ''}`}>
                      <button
                        className="cot__gtrigger"
                        onClick={() => setGrupoAbierto(abierto ? null : g.id)}
                        aria-expanded={abierto}
                      >
                        <span className="cot__glabel">
                          <span aria-hidden>{g.emoji}</span> {g.label}
                        </span>
                        <span className="cot__gmeta">
                          <span className="cot__gcount">{g.items.length}</span>
                          <span className={`cot__gchevron ${abierto ? 'cot__gchevron--on' : ''}`} aria-hidden>
                            ⌄
                          </span>
                        </span>
                      </button>
                      {abierto && (
                        <div className="cot__lista">
                          {g.items.map((item) => (
                            <FilaItem key={item.id} item={item} onAgregar={() => agregarItem(item)} />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* ── Columna derecha: costo adicional (arriba) + resumen (abajo) ── */}
        <aside className="cot__lado">
          {/* Menú de costos adicionales, encima del recuadro de cotización. */}
          <div className={`cot__grupo ${adicAbierto ? 'cot__grupo--on' : ''}`}>
            <button
              className="cot__gtrigger"
              onClick={() => setAdicAbierto((v) => !v)}
              aria-expanded={adicAbierto}
            >
              <span className="cot__glabel">
                <span aria-hidden>➕</span> Añadir costo adicional
              </span>
              <span className="cot__gmeta">
                <span className={`cot__gchevron ${adicAbierto ? 'cot__gchevron--on' : ''}`} aria-hidden>
                  ⌄
                </span>
              </span>
            </button>
            {adicAbierto && (
              <div className="cot__lista cot__lista--menu">
                {GRUPOS_ADICIONALES.map((g) => (
                  <div key={g.grupo}>
                    <span className="cot__adicgrupo">{g.grupo}</span>
                    {g.items.map((a) => (
                      <div key={a.nombre} className="cot__item">
                        <div className="cot__itxt">
                          <span className="cot__inombre">{a.nombre}</span>
                        </div>
                        <div className="cot__ilado">
                          <span className="cot__iprecio">{cop(a.precio)}</span>
                          <button
                            className="cot__iadd"
                            onClick={() => agregarAdicional(a.nombre, a.precio, a.costo)}
                          >
                            + Agregar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cot__resumen">
            <h3 className="cot__rtitulo">Tu cotización</h3>

          {cliente.vacio ? (
            <p className="cot__vacio">
              Aún no has agregado nada. Elige un paquete o suma un add-on. ✨
            </p>
          ) : (
            <ul className="cot__carrito">
              {estado.lineas.map((l) => (
                <li key={l.uid} className="cot__linea">
                  <div className="cot__linfo">
                    <span className="cot__lnombre">
                      {l.esAdicional && <span className="cot__ladic">adicional</span>}
                      {l.nombre}
                    </span>
                    <span className="cot__lprecio">
                      {cop(precioAjustado(l.precio, estado.margenPermitido) * l.cantidad)}
                    </span>
                  </div>
                  <div className="cot__lctrl">
                    <button onClick={() => cambiarCantidad(l.uid, -1)} aria-label="Quitar uno">
                      −
                    </button>
                    <span className="cot__lcant">{l.cantidad}</span>
                    <button onClick={() => cambiarCantidad(l.uid, +1)} aria-label="Agregar uno">
                      +
                    </button>
                    <button
                      className="cot__lquitar"
                      onClick={() => quitar(l.uid)}
                      aria-label="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Sin línea de "honorario": ya va incluido en el precio de cada
              línea. Solo se suma el IVA y se muestra el total. */}
          <div className="cot__totales">
            {cliente.descuentoAplicado && (
              <div className="cot__fila cot__fila--tachado">
                <span>Descuento 1ª compra</span>
                <span>−{cop(cliente.honorarioPleno - cliente.honorario)}</span>
              </div>
            )}
            <div className="cot__fila cot__fila--iva">
              <span>IVA 19%</span>
              <span>{cop(cliente.iva)}</span>
            </div>
            <div className="cot__fila cot__fila--total">
              <span>Total (IVA incluido)</span>
              <span>{cop(cliente.total)}</span>
            </div>
          </div>

          {/* ── Cierre: correo del cliente + confirmación (modo previo) ── */}
          {!cliente.vacio && (
            <div className="cot__cierre">
              <label className="cot__clabel" htmlFor="cot-correo">
                Correo del cliente
              </label>
              <input
                id="cot-correo"
                className="cot__correo"
                type="email"
                inputMode="email"
                placeholder="cliente@empresa.com"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value)
                  setConfirmando(false)
                  setEnviado(false)
                }}
              />

              {!confirmando && !enviado && (
                <button
                  className="cot__cerrar"
                  disabled={!correoValido}
                  onClick={() => setConfirmando(true)}
                >
                  Cerrar y enviar cotización →
                </button>
              )}

              {confirmando && !enviado && (
                <div className="cot__confirm">
                  <p className="cot__ctexto">
                    Se enviará la cotización a <strong>{correo.trim()}</strong> para
                    firmar (con anticipo y cuentas) y el presupuesto a tu correo
                    interno. ¿Confirmas?
                  </p>
                  <div className="cot__cbotones">
                    <button className="cot__cir" onClick={cerrarYEnviar} disabled={enviando}>
                      {enviando ? 'Enviando…' : 'Sí, enviar ✓'}
                    </button>
                    <button
                      className="cot__ccancel"
                      onClick={() => setConfirmando(false)}
                      disabled={enviando}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {enviado && (
                <div className="cot__previa-wrap">
                  {resultado && <ResultadoEnvio resultado={resultado} />}
                  <PreviaCierre
                    lineas={estado.lineas}
                    margenPermitido={estado.margenPermitido}
                    cliente={cliente}
                    interna={interna}
                    correo={correo}
                  />
                  <button
                    className="cot__limpiar"
                    onClick={() => {
                      setEnviado(false)
                      setConfirmando(false)
                      setResultado(null)
                    }}
                  >
                    ← Volver a la cotización
                  </button>
                </div>
              )}

              <button className="cot__limpiar" onClick={limpiar}>
                Limpiar cotización
              </button>
            </div>
          )}
          </div>
        </aside>
      </div>

      {/* PANEL INTERNO (comentado): recordatorio del atajo + overlay.
      <div className="cot__atajo" title="Atajos del panel interno">
        <kbd>⌘⇧K</kbd> panel · <kbd>Esc</kbd> oculta
      </div>

      {panelAbierto && (
        <PanelInterno api={api} onCerrar={() => setPanelAbierto(false)} />
      )}
      */}
    </section>
  )
}

/** Resumen visual del resultado del envío real (correo + Sheets), paso por paso. */
function ResultadoEnvio({ resultado }: { resultado: CierreResultado }) {
  const ok = resultado.ok
  return (
    <div
      style={{
        border: `1px solid ${ok ? 'var(--green-dim)' : 'var(--red-dim)'}`,
        background: 'var(--bg3)',
        borderRadius: 'var(--radius)',
        padding: '1rem 1.2rem',
        marginBottom: '1.2rem',
        fontSize: '0.9rem',
        lineHeight: 1.5,
      }}
    >
      <strong style={{ color: ok ? 'var(--green)' : 'var(--red)' }}>
        {ok ? '✅ Cierre enviado' : '⚠️ Revisa el envío'}
      </strong>
      <ul style={{ margin: '0.6rem 0 0', paddingLeft: '1.1rem', color: 'var(--text)' }}>
        <li>
          {resultado.email?.ok
            ? '✅ Correos enviados (cliente + presupuesto interno)'
            : `❌ Correo: ${resultado.email?.error || resultado.error || 'no enviado'}`}
        </li>
        <li>
          {resultado.sheet?.ok ? (
            <>
              ✅ Hoja de costeo creada —{' '}
              <a
                href={resultado.sheet.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--gold)' }}
              >
                abrir Sheet ↗
              </a>
            </>
          ) : (
            `❌ Sheets: ${resultado.sheet?.error || 'no creado'}`
          )}
        </li>
        <li>
          {resultado.ghl?.ok
            ? '✅ Lead actualizado en el CRM (GoHighLevel) + seguimiento programado'
            : resultado.ghl?.skipped
              ? 'ℹ️ CRM (GoHighLevel): sin configurar — opcional'
              : `❌ CRM: ${resultado.ghl?.error || 'no enviado'}`}
        </li>
      </ul>
      {!ok && (
        <p style={{ margin: '0.6rem 0 0', color: 'var(--muted)' }}>
          Mientras tanto puedes usar el envío manual de abajo.
        </p>
      )}
    </div>
  )
}

/** Fila de un paquete principal (2.0). El no disponible muestra "Próximamente". */
function FilaPaquete({ p, onAgregar }: { p: PaquetePrincipal; onAgregar: () => void }) {
  return (
    <div className="cot__item">
      <div className="cot__itxt">
        <span className="cot__inombre">{p.nombre}</span>
        <span className="cot__idesc">{p.descripcion}</span>
      </div>
      <div className="cot__ilado">
        {p.disponible ? (
          <>
            <span className="cot__iprecio">{cop(p.precio)}</span>
            <button className="cot__iadd" onClick={onAgregar}>
              + Agregar
            </button>
          </>
        ) : (
          <span className="cot__ipronto">Próximamente</span>
        )}
      </div>
    </div>
  )
}

function FilaItem({ item, onAgregar }: { item: ItemCatalogo; onAgregar: () => void }) {
  return (
    <div className="cot__item">
      <div className="cot__itxt">
        <span className="cot__inombre">{item.nombre}</span>
        <span className="cot__idesc">{item.descripcion}</span>
      </div>
      <div className="cot__ilado">
        <span className="cot__iprecio">
          {item.aLaMedida ? 'desde ' : ''}
          {cop(item.precio)}
        </span>
        <button className="cot__iadd" onClick={onAgregar}>
          + Agregar
        </button>
      </div>
    </div>
  )
}
