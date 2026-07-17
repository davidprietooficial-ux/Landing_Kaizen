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

import { useEffect, useMemo, useRef, useState } from 'react'
import { CATALOGO, type Categoria, type ItemCatalogo } from '../data/catalog'
import { cop } from '../lib/format'
import { Modal } from './Modal'
import {
  CASOS_INTRO,
  CASOS_TITULO,
  CATALOGO_INTRO,
  CATALOGO_TITULO,
  CATEGORIAS,
  GRUPOS_CATALOGO,
  GRUPOS_VISIBLES,
  SERVICIOS_PRINCIPALES,
  HERO,
  PACK_AHORRO,
  PIE,
  PROCESO,
  PROMESA,
  TRABAJOS_WEB,
  VIDEOS_PRODUCIDOS,
  detalleDe,
  type PasoProceso,
  type ServicioPrincipal,
} from './content'
import { Cotizador } from '../cotizador/Cotizador'
import './lienzo.css'

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
        className="lz-video lz-video--yt"
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
    return (
      <video
        className="lz-video"
        src={src}
        poster={poster || undefined}
        controls
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => {
          const v = e.currentTarget
          if (v.videoWidth && v.videoHeight) {
            onOrientacion?.(v.videoHeight > v.videoWidth ? 'vertical' : 'horizontal')
          }
        }}
      />
    )
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
          <img className="lz-logo__mark" src="/logo-kaizen.png" alt="" />
          <img className="lz-logo__reflejo" src="/logo-kaizen.png" alt="" aria-hidden />
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
            <span className="lz-gar__check" aria-hidden>
              ✓
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
function ServicioModalContenido({ item }: { item: ItemCatalogo }) {
  const d = detalleDe(item)
  const ahorro = ahorroPaquete(item)
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

        <span className="lz-mserv__sub">Cómo es el proceso</span>
        <ol className="lz-mserv__proceso">
          {d.proceso.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ol>

        <div className="lz-mserv__precio">
          <em>desde </em>
          {cop(item.precio)}
          {ahorro && <span className="lz-srv__ahorro">Ahorras {cop(ahorro)}</span>}
        </div>
      </div>
      <div className="lz-mserv__ejemplo">
        <span className="lz-mserv__sub">Ejemplo</span>
        <VideoSlot src={d.ejemplo} poster="" etiqueta="Video de ejemplo" />
      </div>
    </div>
  )
}

function TarjetaServicio({ item, onAbrir }: { item: ItemCatalogo; onAbrir: () => void }) {
  const ahorro = ahorroPaquete(item)
  const destacado = item.anclaje === 'recomendado' || item.anclaje === 'premium'
  return (
    <button className={`lz-srv lz-srv--btn${destacado ? ' lz-srv--destacado' : ''}`} onClick={onAbrir}>
      {item.anclaje === 'recomendado' && <span className="lz-srv__badge">Recomendado</span>}
      {item.anclaje === 'premium' && <span className="lz-srv__badge lz-srv__badge--premium">Premium</span>}
      <div className="lz-srv__top">
        <h3 className="lz-srv__t">{item.nombre}</h3>
      </div>
      <p className="lz-srv__d">{item.descripcion}</p>
      <div className="lz-srv__pie">
        <span className="lz-srv__precio">
          <em>desde </em>
          {cop(item.precio)}
        </span>
        {ahorro && <span className="lz-srv__ahorro">Ahorras {cop(ahorro)}</span>}
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
function OfertaServicio({ s }: { s: ServicioPrincipal }) {
  return (
    <>
      <BannerCat img={s.img} label={s.label} claim={s.claim} />
      <div className="lz-oferta">
        <h3 className="lz-oferta__t">{s.label}</h3>
        <div className="lz-oferta__precios">
          {s.precios.map((p, i) => (
            <div key={i} className="lz-oferta__col">
              <span className="lz-oferta__clabel">{p.label}</span>
              <div className="lz-oferta__precio">{p.valor}</div>
              {p.detalle && <span className="lz-oferta__mant">{p.detalle}</span>}
            </div>
          ))}
        </div>
        <ul className="lz-oferta__lista">
          {s.incluye.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
        <p className="lz-oferta__entrega">{s.entrega}</p>
        {s.nota && <p className="lz-oferta__nota">{s.nota}</p>}
        {s.apartado && <p className="lz-oferta__apartado">{s.apartado}</p>}
      </div>
    </>
  )
}

function Catalogo() {
  // Pestaña activa: un servicio principal o 'addons'.
  const [tab, setTab] = useState<string>(SERVICIOS_PRINCIPALES[0].id)
  const [cat, setCat] = useState<Categoria>('redes')
  const [abierto, setAbierto] = useState<ItemCatalogo | null>(null)
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
                    <TarjetaServicio key={i.id} item={i} onAbrir={() => setAbierto(i)} />
                  ))}
                </div>
              </div>
            )
          })}
        </>
      )}

      <Modal abierto={!!abierto} onCerrar={() => setAbierto(null)} ancho="ancho">
        {abierto && <ServicioModalContenido item={abierto} />}
      </Modal>
    </section>
  )
}

// ── Pie ──────────────────────────────────────────────────────────────────────
function Pie() {
  return (
    <footer className="lz-pie">
      <img className="lz-pie__logo" src="/logo-kaizen.png" alt="" />
      <span className="lz-pie__firma">{PIE.marca}</span>
      <span className="lz-pie__nota">{PIE.nota}</span>
    </footer>
  )
}

export function Lienzo() {
  return (
    <div className="lienzo">
      <Hero />
      <Proceso />
      <Promesa />
      <Casos />
      <Catalogo />
      <Cotizador />
      <Pie />
    </div>
  )
}
