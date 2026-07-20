/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LIENZO DE PRESENTACION — capa A (lo que ve el cliente)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Pagina de scroll vertical, modo oscuro cinematografico. Secciones S0..S4.
 *  NUNCA muestra costo, margen ni "Mirai Group" (anti-fuga). El precio se enmarca
 *  como honorario profesional y siempre es "desde". Todo el copy vive en
 *  ./content.ts (lo edita David).
 *
 *  Cada servicio y cada caso abren un pop-up (Modal) con su detalle. El cotizador
 *  en vivo + panel interno (capa B) llegan en la Etapa 4, AL FINAL de este lienzo.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { CATALOGO, type Categoria, type ItemCatalogo } from '../data/catalog'
import { cop } from '../lib/format'
import { Modal } from './Modal'
import {
  CASOS_INTRO,
  CASOS_TITULO,
  CATALOGO_INTRO,
  CATALOGO_TITULO,
  CATEGORIAS,
  GHL_COTIZADOR_EMBED,
  GHL_COTIZADOR_SCRIPT,
  GRUPOS_CATALOGO,
  GRUPOS_VISIBLES,
  SERVICIOS_PRINCIPALES,
  HERO,
  PACK_AHORRO,
  PIE,
  PROCESO,
  PROMESA,
  PUBLIC,
  TRABAJOS_WEB,
  VIDEOS_PRODUCIDOS,
  detalleDe,
  type ColumnaPrecio,
  type PasoProceso,
  type ServicioPrincipal,
} from './content'
// Cotizador de React comentado (Etapa 4D): reemplazado por un formulario de
// GHL (ver CotizadorGHL más abajo). Reactivar: descomenta este import y el
// <Cotizador /> en Lienzo(), y quita <CotizadorGHL />.
// import { Cotizador } from '../cotizador/Cotizador'
import './lienzo.css'

// ── Moneda: toggle global COP ↔ USD por TRM en vivo ──────────────────────────
// La TRM se consulta a datos.gov.co (fuente oficial) al cargar; si falla, se usa
// un valor de respaldo y el toggle sigue funcionando. Solo afecta lo que se
// MUESTRA: todos los montos base siguen viviendo en COP.
const TRM_FALLBACK = 4000
const TRM_URL = 'https://www.datos.gov.co/resource/32sa-8pi3.json?$order=vigenciadesde%20DESC&$limit=1'

interface MoneyState {
  currency: 'COP' | 'USD'
  trm: number
  toggle: () => void
  fmt: (copAmount: number) => string
}
const MoneyCtx = createContext<MoneyState>({ currency: 'COP', trm: TRM_FALLBACK, toggle: () => {}, fmt: cop })
function useMoney() {
  return useContext(MoneyCtx)
}
function MoneyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<'COP' | 'USD'>('COP')
  const [trm, setTrm] = useState(TRM_FALLBACK)
  useEffect(() => {
    let vivo = true
    fetch(TRM_URL)
      .then((r) => r.json())
      .then((d) => {
        const v = Number(d?.[0]?.valor)
        if (vivo && Number.isFinite(v) && v > 0) setTrm(v)
      })
      .catch(() => {})
    return () => {
      vivo = false
    }
  }, [])
  const fmt = useCallback(
    (copAmount: number) =>
      currency === 'USD' ? `US$${Math.round(copAmount / trm).toLocaleString('en-US')}` : cop(copAmount),
    [currency, trm],
  )
  const toggle = useCallback(() => setCurrency((c) => (c === 'COP' ? 'USD' : 'COP')), [])
  return <MoneyCtx.Provider value={{ currency, trm, toggle, fmt }}>{children}</MoneyCtx.Provider>
}
/** Botón flotante para alternar COP/USD. El título trae la TRM vigente. */
function MoneySwitch() {
  const { currency, toggle, trm } = useMoney()
  return (
    <button
      className="lz-money"
      onClick={toggle}
      title={`TRM ≈ ${cop(trm)} · toca para ver en ${currency === 'COP' ? 'dólares' : 'pesos'}`}
    >
      <span className={currency === 'COP' ? 'lz-money--on' : ''}>COP</span>
      <span className="lz-money__sep">·</span>
      <span className={currency === 'USD' ? 'lz-money--on' : ''}>USD</span>
    </button>
  )
}

// ── Utilidades ───────────────────────────────────────────────────────────────

/** Ahorro real de un paquete vs comprar piezas sueltas (calculado del catálogo). */
function ahorroPaquete(item: ItemCatalogo): number | null {
  const eq = PACK_AHORRO[item.id]
  if (!eq) return null
  const suelto = CATALOGO.find((i) => i.id === eq.sueltoId)
  if (!suelto) return null
  const ahorro = suelto.precio * eq.cantidad - item.precio
  return ahorro > 0 ? ahorro : null
}

/** Grupo de catálogo al que pertenece un item (paquetes / completos / grab / edic). */
function grupoDe(item: ItemCatalogo): string {
  if (item.esPaquete) return 'paquetes'
  if (item.modalidad === 'solo-grabacion') return 'grabacion'
  if (item.modalidad === 'solo-edicion') return 'edicion'
  return 'completos'
}

/** Si `src` es un enlace de YouTube (watch, youtu.be, embed o shorts), devuelve
 *  el ID del video; si no, null (se trata como archivo local). */
function idYouTube(src: string): string | null {
  const m = src.match(/(?:youtube\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)([\w-]{6,})/)
  return m ? m[1] : null
}

/** Embed de YouTube sin su interfaz (título, logo, "Ver en YouTube" ni barra de
 *  controles): muestra la miniatura con nuestro botón de play y solo carga el
 *  reproductor (con autoplay) al hacer clic. Durante la reproducción, clic en
 *  el video = pausa/reanudar. */
function YouTubeSlot({ id, poster, etiqueta }: { id: string; poster: string; etiqueta: string }) {
  const [reproduciendo, setReproduciendo] = useState(false)
  if (!reproduciendo) {
    // Dos fondos: si maxres no existe para este video, el hq de abajo lo cubre.
    const miniatura = poster
      ? `url(${poster})`
      : `url(https://i.ytimg.com/vi/${id}/maxresdefault.jpg), url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`
    return (
      <button
        type="button"
        className="lz-video lz-video--facade"
        style={{ backgroundImage: miniatura }}
        onClick={() => setReproduciendo(true)}
        aria-label={`Reproducir: ${etiqueta}`}
      >
        <span className="lz-video__play" aria-hidden>
          ▶
        </span>
      </button>
    )
  }
  return (
    <iframe
      className="lz-video"
      src={`https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0&controls=0`}
      title={etiqueta}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  )
}

/** Video local (mp4 directo, no YouTube) con la misma fachada de miniatura +
 *  botón de play que YouTubeSlot: clic para cargar y reproducir. Sin `poster`
 *  no hay miniatura que mostrar, así que arranca directo con los controles
 *  nativos (caso de los videos de ejemplo, que no traen miniatura propia).
 *  `controlsList="nodownload"` + bloquear el clic derecho quitan el botón de
 *  descarga y el "Guardar video como…" del navegador — no es cifrado, el
 *  archivo sigue siendo una URL pública, pero evita la descarga casual. */
function NativeVideoSlot({
  src,
  poster,
  etiqueta,
  onOrientacion,
}: {
  src: string
  poster: string
  etiqueta: string
  onOrientacion?: (o: 'vertical' | 'horizontal') => void
}) {
  const [reproduciendo, setReproduciendo] = useState(!poster)
  if (!reproduciendo) {
    return (
      <button
        type="button"
        className="lz-video lz-video--facade"
        style={{ backgroundImage: `url(${poster})` }}
        onClick={() => setReproduciendo(true)}
        aria-label={`Reproducir: ${etiqueta}`}
      >
        <span className="lz-video__play" aria-hidden>
          ▶
        </span>
      </button>
    )
  }
  return (
    <video
      className="lz-video"
      src={src}
      poster={poster || undefined}
      controls
      autoPlay={!!poster}
      playsInline
      preload="metadata"
      controlsList="nodownload noremoteplayback"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
      onLoadedMetadata={(e) => {
        const v = e.currentTarget
        if (v.videoWidth && v.videoHeight) {
          onOrientacion?.(v.videoHeight > v.videoWidth ? 'vertical' : 'horizontal')
        }
      }}
    />
  )
}

/** Bloque de video reutilizable: muestra el video si hay `src` (archivo local o
 *  enlace de YouTube), o un marcador. `onOrientacion` avisa al padre si el video
 *  es vertical u horizontal (se sabe al cargar los metadatos) para que el modal
 *  acomode el layout. */
function VideoSlot({
  src,
  poster,
  etiqueta,
  onOrientacion,
}: {
  src: string
  poster: string
  etiqueta: string
  onOrientacion?: (o: 'vertical' | 'horizontal') => void
}) {
  const ytId = idYouTube(src)
  if (ytId) {
    return <YouTubeSlot id={ytId} poster={poster} etiqueta={etiqueta} />
  }
  if (src) {
    return <NativeVideoSlot src={src} poster={poster} etiqueta={etiqueta} onOrientacion={onOrientacion} />
  }
  return (
    <div className="lz-video lz-video--vacio">
      <span className="lz-video__play" aria-hidden>
        ▶
      </span>
      <span className="lz-video__label">{etiqueta}</span>
    </div>
  )
}

/** Video del carrusel: no descarga nada (preload="none") hasta que está por
 *  entrar al viewport; ahí dispara play(), que inicia la carga. Libera el ancho
 *  de banda inicial para el hero. */
function LazyVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          v.play().catch(() => {})
          io.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return <video ref={ref} src={src} muted loop playsInline preload="none" />
}

/** Carrusel infinito de webs construidas. El track contiene el set duplicado
 *  (x2) y la animación va de 0 a -50%: al terminar un ciclo el segundo set
 *  queda exactamente donde empezó el primero → loop perfecto sin saltos. */
function WebsMarquee() {
  const items = [...TRABAJOS_WEB.items, ...TRABAJOS_WEB.items]
  return (
    <div className="lz-marquee" aria-label={TRABAJOS_WEB.titulo}>
      <div className="lz-marquee__track">
        {items.map((w, i) => (
          <div
            className="lz-marquee__item"
            key={`${w.nombre}-${i}`}
            aria-hidden={i >= TRABAJOS_WEB.items.length || undefined}
          >
            {/\.(png|jpe?g|webp|avif)$/i.test(w.src) ? (
              <img src={w.src} alt="" loading="lazy" width={w.iw} height={w.ih} />
            ) : (
              <LazyVideo src={w.src} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── S0 · Portada / Hero ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="lz-hero" id="inicio">
      <div className="lz-hero__inner">
        <div className="lz-logo" aria-label="Kaizen">
          <img className="lz-logo__mark" src={`${PUBLIC}logo-kaizen.png`} alt="" />
          <img className="lz-logo__reflejo" src={`${PUBLIC}logo-kaizen.png`} alt="" aria-hidden />
        </div>
        <span className="lz-eyebrow">{HERO.marca}</span>

        <div className="lz-hero__split">
          <div className="lz-hero__col-texto">
            <h1 className="lz-hero__gancho">{HERO.gancho}</h1>
            <p className="lz-hero__descriptor">{HERO.descriptor}</p>
          </div>
          <div className="lz-hero__video">
            <VideoSlot src={HERO.video.src} poster={HERO.video.poster} etiqueta={HERO.video.titulo} />
          </div>
        </div>

        <p className="lz-hero__reunion">{HERO.reunion}</p>
        <a className="lz-cta" href="#proceso">
          {HERO.cta} <span aria-hidden>↓</span>
        </a>
      </div>
      <div className="lz-hero__glow" aria-hidden />
    </section>
  )
}

// ── S1 · Cómo trabajamos ─────────────────────────────────────────────────────
function PasoModalContenido({ paso }: { paso: PasoProceso }) {
  return (
    <div className="lz-mpaso">
      <span className="lz-mpaso__n">Paso {paso.n}</span>
      <h3 className="lz-modal__t">{paso.tituloModal}</h3>
      <p className="lz-mpaso__intro">{paso.intro}</p>
      <span className="lz-mserv__sub">✓ Lo que ganas</span>
      <ul className="lz-mpaso__valor">
        {paso.valor.map((v, i) => (
          <li key={i}>
            {v.perfil && <span className="lz-mpaso__perfil">{v.perfil}</span>}
            <span className="lz-mpaso__texto">{v.texto}</span>
          </li>
        ))}
      </ul>
      <span className="lz-mserv__sub">✕ De qué te salvas</span>
      <ul className="lz-mpaso__evitas">
        {paso.evitas.map((e, i) => (
          <li key={i} className="lz-nogar__item">
            {e}
          </li>
        ))}
      </ul>
      {paso.fuente && (
        <a className="lz-gar__fuente" href={paso.fuente.url} target="_blank" rel="noreferrer">
          {paso.fuente.label} ↗
        </a>
      )}
    </div>
  )
}

function Proceso() {
  const [abierto, setAbierto] = useState<PasoProceso | null>(null)
  return (
    <section className="lz-sec" id="proceso">
      <span className="lz-slabel">Cómo trabajamos</span>
      <h2 className="lz-h2">{PROCESO.titulo}</h2>
      <p className="lz-lead">{PROCESO.intro}</p>
      <div className="lz-pasos">
        {PROCESO.pasos.map((p) => (
          <button key={p.n} className="lz-paso lz-paso--btn" onClick={() => setAbierto(p)}>
            <div className="lz-paso__art">
              {p.img ? (
                <img className="lz-paso__img" src={p.img} alt="" />
              ) : (
                <span className="lz-paso__emoji-big" aria-hidden>
                  {p.emoji}
                </span>
              )}
            </div>
            <span className="lz-paso__n">{p.n}</span>
            <h3 className="lz-paso__t">{p.titulo}</h3>
            <p className="lz-paso__d">{p.detalle}</p>
            <span className="lz-srv__ver" aria-hidden>
              Ver detalle →
            </span>
          </button>
        ))}
      </div>

      <Modal abierto={!!abierto} onCerrar={() => setAbierto(null)}>
        {abierto && <PasoModalContenido paso={abierto} />}
      </Modal>
    </section>
  )
}

// ── S2 · Incluye / No incluye ────────────────────────────────────────────────
function Promesa() {
  return (
    <section className="lz-sec lz-sec--alt" id="promesa">
      <span className="lz-slabel">Lo que incluye</span>
      <h2 className="lz-h2">{PROMESA.titulo}</h2>
      <p className="lz-lead">{PROMESA.intro}</p>

      <span className="lz-promesa__cab lz-promesa__cab--si">✓ Garantizamos</span>
      <div className="lz-garantias">
        {PROMESA.garantizamos.map((g, i) => (
          <div key={i} className="lz-gar">
            <span className="lz-gar__emoji" aria-hidden>
              {g.emoji}
            </span>
            <strong className="lz-gar__texto">{g.texto}</strong>
            <span className="lz-gar__impacto">{g.impacto}</span>
            {g.fuente && (
              <a className="lz-gar__fuente" href={g.fuente.url} target="_blank" rel="noreferrer">
                {g.fuente.label} ↗
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="lz-cierre">
        <div className="lz-nogar">
          <span className="lz-promesa__cab lz-promesa__cab--no">✕ No garantizamos</span>
          <div className="lz-nogar__items">
            {PROMESA.noGarantizamos.map((n, i) => (
              <span key={i} className="lz-nogar__item">
                {n}
              </span>
            ))}
          </div>
        </div>
        <div className="lz-porque">
          <h3 className="lz-porque__t">{PROMESA.porqueImporta.titulo}</h3>
          <p className="lz-porque__d">{PROMESA.porqueImporta.texto}</p>
        </div>
      </div>

      <p className="lz-nota">{PROMESA.nota}</p>
    </section>
  )
}

// ── S3 · Por qué Kaizen (webs + videos) ──────────────────────────────────────

/** Carrusel manual de videos producidos, con el mismo look full-bleed del
 *  carrusel de webs y BUCLE INFINITO: desplaza a la derecha y vuelves a
 *  encontrar los primeros videos; a la izquierda, los del final.
 *
 *  Truco del bucle: se renderizan TRES copias del set (A·B·C) y se navega
 *  siempre dentro de la copia central (B). Cuando el scroll se asienta en A o
 *  C, saltamos ±(ancho de un set) sin animación — como las copias son
 *  idénticas, el salto es invisible. Cada clic en las flechas (centradas
 *  abajo) deja el video vecino CENTRADO en pantalla. */
function VideosCarousel() {
  const viewport = useRef<HTMLDivElement>(null)
  const n = VIDEOS_PRODUCIDOS.videos.length
  const items = [...VIDEOS_PRODUCIDOS.videos, ...VIDEOS_PRODUCIDOS.videos, ...VIDEOS_PRODUCIDOS.videos]

  const cardsDe = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>('.lz-vcar__item'))
  const centrar = (el: HTMLElement, card: HTMLElement, suave: boolean) =>
    el.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - el.clientWidth / 2,
      behavior: suave ? 'smooth' : 'auto',
    })

  /** Si el centro quedó en la copia A o C, reencuadra a la B (invisible). */
  const normalizar = () => {
    const el = viewport.current
    if (!el) return
    const cards = cardsDe(el)
    if (cards.length < n * 3) return
    const unSet = cards[n].offsetLeft - cards[0].offsetLeft
    const centro = el.scrollLeft + el.clientWidth / 2
    if (centro < cards[n].offsetLeft) el.scrollLeft += unSet
    else if (centro >= cards[n * 2].offsetLeft) el.scrollLeft -= unSet
  }

  // Al montar: arranca centrado en el primer video de la copia central. Luego,
  // tras cada scroll (flechas o trackpad), reencuadra cuando el scroll se asienta.
  useEffect(() => {
    const el = viewport.current
    if (!el) return
    const primeraB = cardsDe(el)[n]
    if (primeraB) centrar(el, primeraB, false)
    let t: number | undefined
    const onScroll = () => {
      window.clearTimeout(t)
      t = window.setTimeout(normalizar, 140)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ir = (dir: 1 | -1) => {
    const el = viewport.current
    if (!el) return
    const cards = cardsDe(el)
    if (cards.length === 0) return
    // Card actualmente más cercana al centro → objetivo = la vecina en `dir`.
    const centro = el.scrollLeft + el.clientWidth / 2
    let actual = 0
    let mejor = Infinity
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - centro)
      if (d < mejor) {
        mejor = d
        actual = i
      }
    })
    const objetivo = cards[Math.max(0, Math.min(cards.length - 1, actual + dir))]
    centrar(el, objetivo, true)
  }

  return (
    <div className="lz-vcar">
      <div className="lz-vcar__viewport" ref={viewport}>
        {items.map((v, i) => {
          const esImagen = /\.(png|jpe?g|webp|avif)$/i.test(v.url)
          const id = esImagen ? null : idYouTube(v.url)
          if (!esImagen && !id) return null
          const vertical = v.url.includes('/shorts/')
          return (
            <div
              key={`${v.url}-${i}`}
              className={`lz-vcar__item${vertical ? ' lz-vcar__item--vert' : ''}`}
              aria-hidden={i < n || i >= n * 2 || undefined}
            >
              {esImagen ? (
                <img className="lz-video" src={v.url} alt={v.tag} loading="lazy" />
              ) : (
                <YouTubeSlot id={id!} poster="" etiqueta={v.tag} />
              )}
            </div>
          )
        })}
      </div>
      <div className="lz-vcar__nav">
        <button type="button" onClick={() => ir(-1)} aria-label="Video anterior">
          ‹
        </button>
        <button type="button" onClick={() => ir(1)} aria-label="Video siguiente">
          ›
        </button>
      </div>
    </div>
  )
}

function Casos() {
  return (
    <section className="lz-sec" id="casos">
      <span className="lz-slabel">Por qué Kaizen</span>
      <h2 className="lz-h2">{CASOS_TITULO}</h2>
      <p className="lz-lead">{CASOS_INTRO}</p>

      {/* Bloque 1/3: webs construidas (carrusel infinito automático). */}
      <div className="lz-grupo__cab">
        <h3 className="lz-grupo__t">
          <span aria-hidden>{TRABAJOS_WEB.emoji}</span> {TRABAJOS_WEB.titulo}
        </h3>
      </div>
      <WebsMarquee />

      {/* Bloque 2/3: videos producidos (carrusel manual). 3/3: tráfico, próximamente. */}
      <div className="lz-grupo__cab">
        <h3 className="lz-grupo__t">
          <span aria-hidden>{VIDEOS_PRODUCIDOS.emoji}</span> {VIDEOS_PRODUCIDOS.titulo}
        </h3>
      </div>
      <VideosCarousel />
    </section>
  )
}

// ── S4 · Catálogo navegable ──────────────────────────────────────────────────
/** Línea final de precio: sin "desde", sin IVA — solo el número, y el contexto
 *  de ahorro (antes/ahora) si el item tiene descuento. */
function PrecioFinal({ item, ahorro }: { item: ItemCatalogo; ahorro: number | null }) {
  return (
    <div className="lz-mserv__precio">
      {ahorro && <s className="lz-srv__antes">{cop(item.precio + ahorro)}</s>}
      <strong>{cop(item.precio)}</strong>
      {ahorro && <span className="lz-srv__ahorro">Ahorras {cop(ahorro)} vs. comprar sueltos</span>}
    </div>
  )
}

function ServicioModalContenido({ item }: { item: ItemCatalogo }) {
  const d = detalleDe(item)
  const ahorro = ahorroPaquete(item)
  const esVertical = d.ejemplo.includes('/shorts/')

  return (
    <div className="lz-mserv">
      <div className="lz-mserv__info">
        <span className="lz-caso__tag">{item.esPaquete ? 'Paquete' : 'Servicio'}</span>
        <h3 className="lz-modal__t">{item.nombre}</h3>
        <p className="lz-mserv__desc">{item.descripcion}</p>

        <span className="lz-mserv__sub">Qué incluye</span>
        <ul className="lz-mserv__lista">
          {d.entregables.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>

        <PrecioFinal item={item} ahorro={ahorro} />
      </div>
      <div className={`lz-mserv__ejemplo${esVertical ? ' lz-mserv__ejemplo--vert' : ''}`}>
        <span className="lz-mserv__sub">Ejemplo</span>
        <VideoSlot src={d.ejemplo} poster="" etiqueta="Video de ejemplo" />
      </div>
    </div>
  )
}

/** Corporativo · "Servicios completos": acento de color por pieza (recuadro), para
 *  diferenciar testimonial / video pitch / video largo a simple vista. */
const ACENTO_SERVICIO: Record<string, string> = {
  'cor-testimonial': 'lz-srv--acento-teal',
  'cor-pitch': 'lz-srv--acento-purple',
  'cor-video-largo': 'lz-srv--acento-coral',
}

function TarjetaServicio({
  item,
  onAbrir,
  factor = 1,
  factorLabel = '🔥 en caliente',
}: {
  item: ItemCatalogo
  onAbrir: () => void
  /** Multiplicador de precio (ej. 1.4 con "entrega en caliente" en Eventos, 1.2 con
   *  "Community Management" en Redes). */
  factor?: number
  /** Etiqueta del badge que aparece cuando `factor !== 1`. */
  factorLabel?: string
}) {
  const { fmt } = useMoney()
  const ahorro = ahorroPaquete(item)
  const destacado = item.anclaje === 'recomendado' || item.anclaje === 'premium'
  const acento = ACENTO_SERVICIO[item.id]
  const precio = Math.round((item.precio * factor) / 1000) * 1000
  return (
    <button
      className={`lz-srv lz-srv--btn${destacado ? ' lz-srv--destacado' : ''}${acento ? ` ${acento}` : ''}`}
      onClick={onAbrir}
    >
      {item.anclaje === 'recomendado' && <span className="lz-srv__badge">Recomendado</span>}
      {item.anclaje === 'premium' && <span className="lz-srv__badge lz-srv__badge--premium">Premium</span>}
      <div className="lz-srv__top">
        <h3 className="lz-srv__t">{item.nombre}</h3>
      </div>
      <p className="lz-srv__d">{item.descripcion}</p>
      <div className="lz-srv__pie">
        {ahorro ? (
          <div className="lz-srv__preciobox">
            <s className="lz-srv__antes">{fmt(precio + ahorro)}</s>
            <span className="lz-srv__precio">{fmt(precio)}</span>
            <span className="lz-srv__ahorro">Ahorras {fmt(ahorro)}</span>
          </div>
        ) : (
          <span className="lz-srv__precio">{fmt(precio)}</span>
        )}
        {factor !== 1 && <span className="lz-srv__ahorro lz-srv__ahorro--caliente">{factorLabel}</span>}
      </div>
      <span className="lz-srv__ver" aria-hidden>
        Ver detalle →
      </span>
    </button>
  )
}

/** Banner reutilizable: imagen (o marcador "por agregar") + claim. */
function BannerCat({ img, label, claim }: { img: string; label: string; claim: string }) {
  return (
    <div className="lz-banner">
      {img ? (
        <img className="lz-banner__img" src={img} alt="" />
      ) : (
        <div className="lz-banner__vacio">
          <span className="lz-banner__ph">Imagen de {label} · por agregar</span>
        </div>
      )}
      <div className="lz-banner__panel">
        <span className="lz-banner__claim">{claim}</span>
      </div>
    </div>
  )
}

/** Oferta de un servicio principal: precios en columnas + incluidos + apartado. */
/** Una tarjeta de precio (columna). Extraída para reusarla tal cual en el
 *  layout "combo" (preview + precio entrelazados) y en el layout simple. */
function ColPrecio({ p, className = '' }: { p: ColumnaPrecio; className?: string }) {
  const { fmt } = useMoney()
  return (
    <div className={`lz-oferta__col${p.full ? ' lz-oferta__col--full' : ''}${className ? ` ${className}` : ''}`}>
      <span className="lz-oferta__clabel">{p.label}</span>
      <div className="lz-oferta__precio">
        {fmt(p.cop)}
        {p.sufijo ? ` ${p.sufijo}` : ''}
      </div>
      {p.detalle && <span className="lz-oferta__mant">{p.detalle}</span>}
    </div>
  )
}

function RequisitosModalContenido({ s }: { s: ServicioPrincipal }) {
  return (
    <div className="lz-req">
      <h3 className="lz-modal__t">Requisitos para pautar</h3>
      <p className="lz-mserv__desc">
        Para activar {s.label.toLowerCase()} con campañas en Meta, tu cuenta debe cumplir esto:
      </p>
      <ul className="lz-mserv__lista">
        {s.requisitos!.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>
  )
}

function OfertaServicio({ s }: { s: ServicioPrincipal }) {
  // Con 2 previews (ej. Sistema de Clientes): orden en el HTML = orden lógico
  // en mobile (imagen → su precio → imagen → su precio), sin media query.
  // En desktop, un `order` en CSS agrupa las 2 imágenes arriba y los precios
  // debajo. Así en mobile SIEMPRE se entiende qué precio es de qué preview.
  const dosPreview = !!(s.preview && s.previewPauta)
  const pares = dosPreview ? s.precios.filter((p) => !p.full) : []
  const sueltos = dosPreview ? s.precios.filter((p) => p.full) : []
  const [reqAbierto, setReqAbierto] = useState(false)
  return (
    <>
      <BannerCat img={s.img} label={s.label} claim={s.claim} />
      <div className={`lz-oferta${s.preview ? ' lz-oferta--con-preview' : ''}`}>
        <h3 className="lz-oferta__t">{s.label}</h3>
        {dosPreview ? (
          <div className="lz-oferta__combo">
            <figure className="lz-oferta__preview lz-combo__preview-a">
              <img src={s.preview} alt={`Preview de ${s.label}`} loading="lazy" />
            </figure>
            {pares[0] && <ColPrecio p={pares[0]} className="lz-combo__price-a" />}
            <figure className="lz-oferta__preview lz-combo__preview-b">
              <img src={s.previewPauta} alt="Preview de tu pauta y campañas" loading="lazy" />
            </figure>
            {pares[1] && <ColPrecio p={pares[1]} className="lz-combo__price-b" />}
            {sueltos.map((p, i) => (
              <ColPrecio key={i} p={p} />
            ))}
          </div>
        ) : (
          <>
            {s.preview && (
              <figure className="lz-oferta__preview lz-oferta__preview--sola">
                <img src={s.preview} alt={`Preview de ${s.label}`} loading="lazy" />
              </figure>
            )}
            <div className="lz-oferta__precios">
              {s.precios.map((p, i) => (
                <ColPrecio key={i} p={p} />
              ))}
            </div>
          </>
        )}
        <div className="lz-oferta__info">
          <ul className="lz-oferta__lista">
            {s.incluye.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
          {s.nota && <p className="lz-oferta__nota">{s.nota}</p>}
          {s.requisitos ? (
            <div className="lz-oferta__fila">
              <button type="button" className="lz-oferta__reqbtn" onClick={() => setReqAbierto(true)}>
                📋 Ver requisitos →
              </button>
              <p className="lz-oferta__entrega">{s.entrega}</p>
            </div>
          ) : (
            <p className="lz-oferta__entrega">{s.entrega}</p>
          )}
          {s.apartado && (
            <ul className="lz-oferta__apartado">
              {s.apartado.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {s.requisitos && (
        <Modal abierto={reqAbierto} onCerrar={() => setReqAbierto(false)}>
          <RequisitosModalContenido s={s} />
        </Modal>
      )}
    </>
  )
}

/** Casilla de Community Management, reutilizada tal cual el estilo de "entrega en
 *  caliente" de Eventos: mismo look, mismo comportamiento (+% sobre el precio del
 *  grupo mientras esté marcada). */
function CommunityManagementToggle({ activo, onCambiar }: { activo: boolean; onCambiar: (v: boolean) => void }) {
  return (
    <label className="lz-caliente lz-caliente--ancho">
      <input type="checkbox" checked={activo} onChange={(e) => onCambiar(e.target.checked)} />
      <span>
        📱 <strong>Incluir Community Management</strong> — <em>+20%</em>
      </span>
    </label>
  )
}

/** REDES: agrupación por tipo de contenido (Contenido Orgánico / Podcast / YouTube)
 *  en vez de por modalidad. YouTube es una calculadora; el Podcast Luxury va bajo
 *  cotización. */
function RedesGrupos({ items, onAbrir }: { items: ItemCatalogo[]; onAbrir: (i: ItemCatalogo) => void }) {
  const reels = items.filter((i) => i.subtipo === 'reels')
  const podcast = items.filter((i) => i.subtipo === 'podcast')
  const [cmOrganico, setCmOrganico] = useState(false)
  const [cmPodcast, setCmPodcast] = useState(false)
  return (
    <>
      <div className="lz-grupo">
        <div className="lz-grupo__cab">
          <h3 className="lz-grupo__t"><span aria-hidden>📲</span> Contenido Orgánico</h3>
          <span className="lz-grupo__nota">4, 8 o 12 piezas — reel o carrusel, tú eliges — en una sola jornada.</span>
        </div>
        <div className="lz-grid">
          {reels.map((i) => (
            <TarjetaServicio
              key={i.id}
              item={i}
              onAbrir={() => onAbrir(i)}
              factor={cmOrganico ? 1.2 : 1}
              factorLabel="📱 + community management"
            />
          ))}
        </div>
        <CommunityManagementToggle activo={cmOrganico} onCambiar={setCmOrganico} />
      </div>

      <div className="lz-grupo">
        <div className="lz-grupo__cab">
          <h3 className="lz-grupo__t"><span aria-hidden>🎙️</span> Podcast</h3>
          <span className="lz-grupo__nota">Graba tu podcast y multiplícalo en reels.</span>
        </div>
        <div className="lz-grid">
          {podcast.map((i) => (
            <TarjetaServicio
              key={i.id}
              item={i}
              onAbrir={() => onAbrir(i)}
              factor={cmPodcast ? 1.2 : 1}
              factorLabel="📱 + community management"
            />
          ))}
          <PodcastLuxuryCard />
        </div>
        <CommunityManagementToggle activo={cmPodcast} onCambiar={setCmPodcast} />
      </div>

      <div className="lz-grupo">
        <div className="lz-grupo__cab">
          <h3 className="lz-grupo__t"><span aria-hidden>▶️</span> YouTube</h3>
          <span className="lz-grupo__nota">Calcula tu edición por minuto de video final.</span>
        </div>
        <YoutubeCalc />
      </div>
    </>
  )
}

/** Qué incluye cada modo de edición: la sencilla es deliberadamente básica
 *  (nada de motion ni efectos), la compleja trae todo. Cambia en vivo con el
 *  modo elegido — nada de lista estática ajena a lo que el cliente escogió. */
const INCLUYE_YT: Record<'sencilla' | 'compleja', string[]> = {
  sencilla: [
    'Cortes simples y ritmo básico',
    'Color ligero (corrección básica)',
    'Audio limpio y balanceado',
    'Sin motion graphics ni efectos complejos',
  ],
  compleja: [
    'Motion graphics y efectos avanzados',
    'Color grading profesional',
    'Diseño de sonido completo',
    'Gráficos y rótulos animados',
  ],
}

/** Calculadora de edición de YouTube: sencilla o compleja, mínimo 5 minutos de
 *  video final. La tarifa por minuto no se muestra (solo el total) para no
 *  anclar la conversación en el precio unitario. Si además grabamos, se cobra
 *  por jornada de 4h ($400.000 c/u) en vez de un % sobre la edición. */
function YoutubeCalc() {
  const { fmt } = useMoney()
  const TARIFA = { sencilla: 72_000, compleja: 104_000 }
  const MINIMO = 5
  const JORNADA_PRECIO = 320_000
  const [modo, setModo] = useState<'sencilla' | 'compleja'>('sencilla')
  const [min, setMin] = useState(MINIMO)
  const [jornadas, setJornadas] = useState(0)
  const minutos = Math.max(MINIMO, Math.floor(min) || MINIMO)
  const jornadasVal = Math.max(0, Math.floor(jornadas) || 0)
  const total = TARIFA[modo] * minutos + jornadasVal * JORNADA_PRECIO
  const incluye = [...INCLUYE_YT[modo]]
  if (jornadasVal > 0) {
    incluye.push(`Grabación: ${jornadasVal} jornada${jornadasVal > 1 ? 's' : ''} de 4h (equipo + personal)`)
  }
  return (
    <div className="lz-ytcalc">
      <div className="lz-ytcalc__calc">
        <div className="lz-ytcalc__modos">
          <button
            className={`lz-ytcalc__modo${modo === 'sencilla' ? ' lz-ytcalc__modo--on' : ''}`}
            onClick={() => setModo('sencilla')}
          >
            Edición sencilla
          </button>
          <button
            className={`lz-ytcalc__modo${modo === 'compleja' ? ' lz-ytcalc__modo--on' : ''}`}
            onClick={() => setModo('compleja')}
          >
            Edición compleja
          </button>
        </div>
        <label className="lz-ytcalc__campo">
          <span>Minutos de video final (mín. 5)</span>
          <input
            type="number"
            min={MINIMO}
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            onBlur={() => setMin(minutos)}
          />
        </label>
        <label className="lz-ytcalc__campo">
          <span className="lz-ytcalc__graba-t">🎥 ¿Necesitamos grabar el video?</span>
          <span>
            Jornadas de 4h <em>{fmt(JORNADA_PRECIO)} c/u</em>
          </span>
          <input
            type="number"
            min={0}
            value={jornadas}
            onChange={(e) => setJornadas(Number(e.target.value))}
            onBlur={() => setJornadas(jornadasVal)}
          />
        </label>
        <div className="lz-ytcalc__total">
          <span>Desde</span>
          <strong>{fmt(total)}</strong>
        </div>
        <p className="lz-ytcalc__req">
          Requiere guion o estructura de video clara, bajo aprobación previa. Precio sin IVA.
        </p>
      </div>
      <div className="lz-ytcalc__incluye">
        <span className="lz-mserv__sub">Incluye</span>
        <ul>
          {incluye.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Lleva el scroll al cotizador en vivo (más abajo, en la misma página). */
function scrollToCotizador() {
  document.getElementById('cotizador')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Contenido del popup de Podcast Luxury: qué incluye + por qué es diferente
 *  (bajo cotización, no precio fijo) + CTA que lleva al cotizador de abajo. */
function PodcastLuxuryModalContenido({ onCotizar }: { onCotizar: () => void }) {
  return (
    <div className="lz-mserv">
      <div className="lz-mserv__info">
        <span className="lz-caso__tag">Premium</span>
        <h3 className="lz-modal__t">Podcast Luxury · a la medida</h3>
        <p className="lz-mserv__desc">
          Para podcasts grandes con invitados premium: figuras reconocidas, ejecutivos top o
          personas cuya agenda no da espacio para errores. Un mal manejo de tiempos, transporte o
          alojamiento puede costarte la entrevista — o la relación con ese invitado.
        </p>

        <span className="lz-mserv__sub">Qué incluye</span>
        <ul className="lz-mserv__lista">
          <li>Todo el Podcast Pro: 4 episodios + 8 reels (edición sencilla, 2 por episodio)</li>
          <li>Alojamiento de los invitados, coordinado de punta a punta</li>
          <li>Transporte de los invitados (aeropuerto, hotel, set)</li>
          <li>Gestión de tiempos y logística con cada invitado, sin que tú tengas que hacer seguimiento</li>
        </ul>

        <span className="lz-mserv__sub">Por qué es diferente</span>
        <p className="lz-mserv__desc">
          Los demás paquetes tienen un precio fijo. Este no: el costo de alojamiento y transporte
          varía según la ciudad, la cantidad de invitados y la duración — por eso se cotiza a la
          medida en vez de tener un precio de catálogo.
        </p>

        <button className="lz-cotiza__cta" onClick={onCotizar}>
          Ir a cotizar mi proyecto ↓
        </button>
      </div>
      <figure className="lz-mserv__ejemplo lz-mserv__ejemplo--luxury">
        <img
          src={`${PUBLIC}previews/preview-podcast-luxury.webp`}
          alt="Podcast Luxury — set premium para invitados de alto perfil"
          loading="lazy"
        />
      </figure>
    </div>
  )
}

/** Podcast Luxury: Pro + logística de invitados. Va bajo cotización — abre un
 *  popup con el detalle (qué incluye / por qué es diferente) y dirige al
 *  cotizador en vivo de abajo; no capta datos aquí. */
function PodcastLuxuryCard() {
  const [abierto, setAbierto] = useState(false)
  const irACotizar = () => {
    setAbierto(false)
    requestAnimationFrame(scrollToCotizador)
  }
  return (
    <>
      <button
        type="button"
        className="lz-srv lz-srv--btn lz-srv--destacado"
        onClick={() => setAbierto(true)}
      >
        <span className="lz-srv__badge lz-srv__badge--premium">Premium</span>
        <div className="lz-srv__top">
          <h3 className="lz-srv__t">Podcast Luxury · a la medida</h3>
        </div>
        <p className="lz-srv__d">
          Todo el paquete Pro + logística de invitados: alojamiento, transporte y gestión de tiempos.
        </p>
        <div className="lz-srv__pie">
          <span className="lz-srv__precio">
            <em>Bajo </em>cotización
          </span>
        </div>
        <span className="lz-srv__ver" aria-hidden>
          Ver detalle →
        </span>
      </button>
      <Modal abierto={abierto} onCerrar={() => setAbierto(false)} ancho="ancho">
        <PodcastLuxuryModalContenido onCotizar={irACotizar} />
      </Modal>
    </>
  )
}

function Catalogo() {
  // Pestaña activa: un servicio principal o 'addons'.
  const [tab, setTab] = useState<string>(SERVICIOS_PRINCIPALES[0].id)
  const [cat, setCat] = useState<Categoria>('redes')
  const [abierto, setAbierto] = useState<ItemCatalogo | null>(null)
  const [caliente, setCaliente] = useState(false)
  const items = useMemo(() => CATALOGO.filter((i) => i.categoria === cat), [cat])
  const servicio = SERVICIOS_PRINCIPALES.find((s) => s.id === tab)
  const catInfo = CATEGORIAS.find((c) => c.id === cat)!
  const grupos = GRUPOS_CATALOGO.filter((g) => GRUPOS_VISIBLES[cat].includes(g.id))

  return (
    <section className="lz-sec lz-sec--alt" id="catalogo">
      <span className="lz-slabel">El catálogo</span>
      <h2 className="lz-h2">{CATALOGO_TITULO}</h2>
      <p className="lz-lead">{CATALOGO_INTRO}</p>

      {/* Pestañas principales: 3 servicios + add-ons. */}
      <div className="lz-tabs" role="tablist">
        {SERVICIOS_PRINCIPALES.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={tab === s.id}
            className={`lz-tab${tab === s.id ? ' lz-tab--on' : ''}${s.disponible ? '' : ' lz-tab--off'}`}
            disabled={!s.disponible}
            onClick={() => setTab(s.id)}
          >
            {s.label}
            {!s.disponible && <span className="lz-tab__pronto">Próximamente</span>}
          </button>
        ))}
        <button
          role="tab"
          aria-selected={tab === 'addons'}
          className={`lz-tab${tab === 'addons' ? ' lz-tab--on' : ''}`}
          onClick={() => setTab('addons')}
        >
          Add-ons
        </button>
      </div>

      {servicio ? (
        <OfertaServicio s={servicio} />
      ) : (
        <>
          {/* Add-ons: el catálogo audiovisual por categorías (grupos filtrados). */}
          <div className="lz-tabs lz-tabs--sub" role="tablist">
            {CATEGORIAS.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={cat === c.id}
                className={`lz-tab${cat === c.id ? ' lz-tab--on' : ''}`}
                onClick={() => setCat(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <BannerCat img={catInfo.img} label={catInfo.label} claim={catInfo.claim} />

          {cat === 'redes' ? (
            <RedesGrupos items={items} onAbrir={setAbierto} />
          ) : (
            <>
              {grupos.map((g) => {
                const delGrupo = items.filter((i) => grupoDe(i) === g.id)
                if (delGrupo.length === 0) return null
                return (
                  <div key={g.id} className="lz-grupo">
                    <div className="lz-grupo__cab">
                      <h3 className="lz-grupo__t">
                        <span aria-hidden>{g.emoji}</span> {g.titulo}
                      </h3>
                      <span className="lz-grupo__nota">{g.nota}</span>
                    </div>
                    <div className="lz-grid">
                      {delGrupo.map((i) => (
                        <TarjetaServicio
                          key={i.id}
                          item={i}
                          onAbrir={() => setAbierto(i)}
                          factor={cat === 'eventos' && caliente ? 1.4 : 1}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
              {cat === 'eventos' && (
                <label className="lz-caliente lz-caliente--ancho">
                  <input type="checkbox" checked={caliente} onChange={(e) => setCaliente(e.target.checked)} />
                  <span>
                    🔥 <strong>Entrega en caliente</strong> (mismo día) — <em>+40%</em>
                  </span>
                </label>
              )}
            </>
          )}
        </>
      )}

      <Modal abierto={!!abierto} onCerrar={() => setAbierto(null)} ancho="ancho">
        {abierto && <ServicioModalContenido item={abierto} />}
      </Modal>
    </section>
  )
}

/**
 * Cotizador (Etapa 4D): el cotizador en vivo de React se reemplaza por un
 * formulario/encuesta de GoHighLevel con pasarela de pago (ver prompts de
 * construcción — formulario + automatizaciones). Mismo id="cotizador" que
 * antes: el CTA de Podcast Luxury (scrollToCotizador) sigue apuntando aquí.
 * Mismo patrón que el placeholder de GHL en la landing principal: vacío =
 * caja reservada; con GHL_COTIZADOR_EMBED puesto, se muestra el iframe real.
 */
function CotizadorGHL() {
  return (
    <section className="lz-sec lz-sec--alt" id="cotizador">
      <span className="lz-slabel">Cotización en vivo</span>
      <h2 className="lz-h2">Armemos tu sistema de ventas</h2>
      <p className="lz-lead">
        Elige tu paquete — o suma add-ons — y cierra tu proyecto al instante.
      </p>
      {GHL_COTIZADOR_EMBED ? (
        <div className="lz-ghl-embed">
          {/* SIN scrolling="no": si el postMessage de auto-resize de GHL llega tarde
              (pasos con más campos, conexión lenta), el formulario NUNCA se corta —
              el iframe muestra su propio scroll interno como respaldo mientras
              crece. El script solo AGRANDA el iframe; nunca lo encoge por debajo
              del piso fijado en CSS. */}
          <iframe
            src={GHL_COTIZADOR_EMBED}
            id={GHL_COTIZADOR_EMBED.split('/').pop()}
            title="Cotizador · Kaizen Studios"
          />
          {GHL_COTIZADOR_SCRIPT && <script src={GHL_COTIZADOR_SCRIPT} async />}
        </div>
      ) : (
        <div className="lz-ghl-embed lz-ghl-embed--placeholder">
          <span className="lz-mserv__sub">Formulario · por conectar con GoHighLevel</span>
          <p className="lz-mserv__desc">
            Aquí va el formulario/encuesta de GHL, con pasarela de pago integrada. Pega la URL
            del embed en <code>GHL_COTIZADOR_EMBED</code> — <code>src/lienzo/content.ts</code>.
          </p>
        </div>
      )}
    </section>
  )
}

// ── Pie ──────────────────────────────────────────────────────────────────────
function Pie() {
  return (
    <footer className="lz-pie">
      <img className="lz-pie__logo" src={`${PUBLIC}logo-kaizen.png`} alt="" />
      <span className="lz-pie__firma">{PIE.marca}</span>
      <span className="lz-pie__nota">{PIE.nota}</span>
    </footer>
  )
}

export function Lienzo() {
  return (
    <MoneyProvider>
      <div className="lienzo">
        <MoneySwitch />
        <Hero />
        <Proceso />
        <Promesa />
        <Casos />
        <Catalogo />
        {/* Cotizador de React comentado (Etapa 4D): se reemplaza por un
            formulario/encuesta de GHL con pasarela de pago (ver prompts de
            construcción). Para reactivarlo: descomenta esta línea y quita
            <CotizadorGHL /> de abajo. */}
        {/* <Cotizador /> */}
        <CotizadorGHL />
        <Pie />
      </div>
    </MoneyProvider>
  )
}
