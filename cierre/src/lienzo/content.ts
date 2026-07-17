/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONTENIDO DEL LIENZO — lo que el cliente lee (capa A, modo oscuro)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  TODO el texto que ve el cliente vive AQUI. David edita este archivo (no el
 *  codigo) para ajustar copy, agregar casos o cambiar el gancho. Las frases base
 *  salen del manual de marca (Kaizen_Brand_Guidelines_v1.html · Posicionamiento).
 *
 *  REGLA DE ORO: aqui NUNCA se nombra costo, margen, ni "Mirai Group".
 *  HONESTIDAD: no se promete lo que no se controla (sin metricas, sin "trimestre").
 */

import type { Categoria } from '../data/catalog'

// Prefijo hacia /public. Vite lo fija según `base` en vite.config.ts: '/' en
// dev, '/cierre/' en producción (la landing sirve esta app bajo ese subpath) —
// sin esto, las rutas absolutas "/archivo.png" ignoran el subpath y dan 404.
export const PUBLIC = import.meta.env.BASE_URL

// ── S0 · Portada / Hero ──────────────────────────────────────────────────────
export const HERO = {
  marca: 'Kaizen Studios',
  /** Titular: el tagline de la propuesta 2026 — la web como sistema de ventas. */
  gancho: 'Webs que venden. Tráfico que convierte.',
  descriptor:
    'Tu web no es una tarjeta de presentación: es tu vendedor más importante. Unimos diseño web, video con estándar de cine y tráfico en un solo sistema que vende mientras duermes.',
  /** Marco de la reunión: encuadra de qué va y que al final hay una decisión. */
  reunion:
    'En esta reunión te mostramos cómo trabajamos, qué incluye y cuánto cuesta. Al final, tomas una decisión.',
  cta: '¿Estás de acuerdo?',
  /**
   * VIDEO DE PORTADA (showreel). `src` acepta una ruta local (ej:
   * '/video/showreel.mp4' dentro de public/video/) o un enlace de YouTube
   * (watch, youtu.be o embed). Si queda vacío, se muestra un marcador con el
   * ícono de play. Recomendado: showreel de 30–45s.
   */
  video: {
    src: 'https://assets.cdn.filesafe.space/zZP894o7LdjyqMTOS0m1/media/6a59ab7c9c9b37b5fd6290c1.mp4',
    poster: '',
    titulo: 'Showreel — 30 a 45s',
  },
}

// ── S1 · Cómo trabajamos ─────────────────────────────────────────────────────
//
//  5 pasos. Cada uno abre un pop-up con título emotivo + BENEFICIOS ("lo que
//  ganas", por perfil) + "de qué te salvas" (el costo de hacerlo con afán o por
//  partes) + referente externo verificable cuando existe. `img`: ruta a un PNG
//  3D (transparente) en public/proceso/. Vacío = emoji de respaldo.

export interface PuntoValor {
  /** Etiqueta del beneficio, SIEMPRE con emoji + texto corto: por servicio
   *  (🌐 Web · 🎬 Video · 📣 Tráfico) o el ángulo puntual (📊 Reportes…). */
  perfil: string
  texto: string
}
export interface PasoProceso {
  n: string
  emoji: string
  titulo: string
  detalle: string
  img: string
  /** Contenido del pop-up. */
  tituloModal: string
  intro: string
  /** Beneficios: "lo que ganas". */
  valor: PuntoValor[]
  /** "De qué te salvas": el costo de hacerlo rápido y ya, sin método. */
  evitas: string[]
  /** Referente externo VERIFICABLE que respalda el claim del paso (opcional). */
  fuente?: { label: string; url: string }
}

export const PROCESO: {
  titulo: string
  intro: string
  pasos: PasoProceso[]
} = {
  //  Proceso Kaizen 2.0 (doc "Servicios y Paquetes"): el viaje del cliente
  //  DESPUÉS de la firma. La llamada de cierre y la firma pasan en esta misma
  //  reunión; testimonios y venta de nuevos planes son etapas internas.
  titulo: 'Un método claro → un sistema que vende',
  intro:
    'Web, tráfico o automatización: contrates lo que contrates, todo pasa por el mismo método, pulido proyecto a proyecto. Aquí no hay afán ni improvisación — hay un orden que existe porque produce resultados. Toca cada paso y mira qué ganas en cada etapa (y de qué te salvas).',
  pasos: [
    {
      n: '01',
      emoji: '🗺️',
      titulo: 'Arranque y plan',
      detalle: 'Onboarding y concept proposal: objetivo, mensaje, guion y plan de trabajo aprobado por ti.',
      img: `${PUBLIC}proceso/01-logistica.png`,
      tituloModal: '🗺️ Definimos el plan; tú solo lo apruebas',
      intro:
        'Después de la firma viene el onboarding: una reunión de concept proposal donde aterrizamos objetivo, mensaje, guion y cómo será tu web. Sales sabiendo exactamente qué haremos, cuándo, y qué necesitamos de ti.',
      valor: [
        { perfil: '🌐 Web', texto: 'La estructura y el mensaje de tu landing quedan definidos antes de diseñar un solo pixel.' },
        { perfil: '🎬 Video', texto: 'Guion y plan de toma listos: el día de grabación nadie improvisa.' },
        { perfil: '📣 Tráfico', texto: 'Estrategia clara desde el inicio: a quién le hablamos, con qué oferta y con qué presupuesto.' },
      ],
      evitas: [
        'Proyectos que arrancan "de una" y a mitad de camino descubren que el mensaje no vende.',
        'Cambios de rumbo costosos: lo que no se define al inicio se paga después en tiempo y dinero.',
        'Perseguir a tu proveedor: aquí hay plan, fechas y responsables desde el día uno.',
      ],
    },
    {
      n: '02',
      emoji: '🎥',
      titulo: 'Grabación',
      detalle: 'Una sola jornada de rodaje con dirección, cámara y luz de cine. De aquí sale todo el material.',
      img: `${PUBLIC}proceso/02-grabacion.png`,
      tituloModal: '🎥 El día de grabación, sin estrés y sin improvisar',
      intro:
        'Llegamos con todo listo. Tú te enfocas en estar bien frente a cámara; nosotros, en que cada toma sea de cine. De esta jornada sale el material de tu web y de tus anuncios.',
      valor: [
        { perfil: '🌐 Web', texto: 'Tu landing tendrá video real de tu negocio, tu equipo y tu espacio — nada de fotos de stock.' },
        { perfil: '📣 Tráfico', texto: 'De la misma jornada salen las piezas de tus anuncios.' },
        { perfil: '📈 Por qué funciona', texto: 'El video vende: la gran mayoría de la gente dice haber comprado convencida por el video de una marca.' },
      ],
      evitas: [
        'Repetir jornadas porque faltó una toma o falló el audio: grabamos con plan de toma.',
        'Contenido de celular con afán que abarata la percepción de tu marca frente a la competencia.',
      ],
      fuente: { label: 'Ver estudio (Wyzowl)', url: 'https://www.wyzowl.com/video-marketing-statistics/' },
    },
    {
      n: '03',
      emoji: '💻',
      titulo: 'Edición y construcción de tu web',
      detalle: 'Editamos con estándar de cine y construimos tu landing a medida — nada de plantillas.',
      img: `${PUBLIC}proceso/06-web.png`,
      tituloModal: '💻 Tu web cobra vida, con video de cine integrado',
      intro:
        'Mientras el material pasa por edición, color y audio profesional, construimos tu landing con la misma tecnología de las startups más exigentes (Next.js/React): veloz, medible y diseñada para convertir.',
      valor: [
        { perfil: '🌐 Web', texto: 'Cada sección empuja a la acción — captar, calificar y agendar — con dominio, hosting y correo incluidos.' },
        { perfil: '🎬 Video', texto: 'Edición con estándar de cine: color, audio y motion integrados en la web — se siente de cine, no de plantilla.' },
        { perfil: '📣 Tráfico', texto: 'Tu web queda medible desde el día uno: sabes de dónde llega cada visita y cada cliente.' },
      ],
      evitas: [
        'La web plantilla que se ve igual a la de tu competencia y no convierte.',
        'Webs lentas que espantan: más de la mitad de las visitas móviles abandona si la página tarda más de 3 segundos.',
        'Pagar por separado diseñador, desarrollador y editor que no se hablan entre sí.',
      ],
      fuente: {
        label: 'Ver dato (Google)',
        url: 'https://www.thinkwithgoogle.com/consumer-insights/consumer-trends/mobile-site-load-time-statistics/',
      },
    },
    {
      n: '04',
      emoji: '🔍',
      titulo: 'Revisión y entrega',
      detalle: 'Control de calidad y entrega: tu web lista 24 horas después de la grabación.',
      img: `${PUBLIC}proceso/04-revision.png`,
      tituloModal: '🔍 Entregada en 24 horas; al aire tras tu visto bueno',
      intro:
        'A las 24 horas de la grabación te entregamos la web lista para revisar — dominio, hosting y correo funcionando. Lo que sigue lo hacemos juntos: revisiones y ajustes (dos rondas incluidas) y tu respuesta oportuna. Con un visto bueno ágil, queda al aire enseguida.',
      valor: [
        { perfil: '🔁 Ajustes', texto: 'Dos rondas incluidas: pules el resultado sin costos sorpresa.' },
        { perfil: '🌐 Web', texto: 'Dominio, hosting y correo configurados por nosotros — cero enredos técnicos.' },
        { perfil: '✨ Tu marca', texto: 'Impecable y consistente en cada pantalla, sin errores que cuesten credibilidad.' },
      ],
      evitas: [
        'Publicar con errores que cuestan clientes: la gente juzga la credibilidad de tu empresa por el diseño de tu web.',
        'Entregas que se alargan semanas sin fecha clara: aquí hay control de calidad y un plazo firmado.',
      ],
      fuente: { label: 'Ver investigación (Stanford)', url: 'https://credibility.stanford.edu/guidelines/index.html' },
    },
    {
      n: '05',
      emoji: '📣',
      titulo: 'Tráfico y soporte',
      detalle: 'Lanzamos la pauta en Meta, reportamos resultados y mantenemos tu web al día.',
      img: `${PUBLIC}proceso/07-trafico.png`,
      tituloModal: '📣 Sistema en marcha: tráfico, reportes y mantenimiento',
      intro:
        'Con la web al aire activamos las campañas en Meta (las verificaciones de la plataforma toman hasta 2 semanas) y las optimizamos de forma continua. Y tu web no se queda sola: el mantenimiento la mantiene siempre al día.',
      valor: [
        { perfil: '📣 Tráfico', texto: 'Campañas en Meta creadas y gestionadas por nosotros, con la cuenta a tu nombre (cumpliendo los prerrequisitos).' },
        { perfil: '📊 Reportes', texto: 'Sabes qué funciona y qué estamos ajustando, con datos y no con humo.' },
        { perfil: '🔧 Mantenimiento', texto: 'Dos actualizaciones al mes para que tu web nunca se quede vieja.' },
      ],
      evitas: [
        'Botar plata en pauta sin estrategia: anuncios que se prenden y se apagan al azar.',
        'Reiniciar el aprendizaje del algoritmo a cada rato — cada reinicio de la fase de aprendizaje encarece tus resultados.',
        'Quedarte con una web que nadie visita: sin tráfico, hasta la mejor web es invisible.',
      ],
      fuente: { label: 'Ver doc de Meta', url: 'https://www.facebook.com/business/help/112167992830700' },
    },
  ],
}

// ── S2 · Incluye / No incluye (Promesa contractual del manual) ────────────────
export const PROMESA = {
  titulo: 'Lo que firmamos, lo cumplimos',
  intro:
    'Prometemos lo que controlamos al 100%. Esa honestidad es nuestra ventaja: no vendemos resultados que no dependen de nosotros, vendemos ejecución impecable.',
  // NOTA HONESTIDAD: cada item es algo que Kaizen CONTROLA al 100%, con su impacto
  // real. Los items con `fuente` citan un estudio externo verificable: el badge es
  // un enlace clicable al artículo oficial para mostrárselo al cliente.
  garantizamos: [
    {
      texto:
        'Una web 100% a medida — nada de plantillas — con la misma tecnología de las startups más exigentes (Next.js/React).',
      impacto: 'Veloz, medible y tuya: un activo propio, no un perfil alquilado al algoritmo.',
    },
    {
      texto: 'Cada sección de la web diseñada para convertir: capta, califica y agenda por ti, 24/7.',
      impacto:
        'Tu web no es una tarjeta de presentación: es tu vendedor más importante, vendiendo mientras duermes.',
    },
    {
      texto: 'Video y motion con estándar de cine, integrados en la web y listos para tus canales.',
      impacto: 'Se ve premium y proyecta confianza: el primer filtro de decisión de tu cliente es visual.',
    },
    {
      texto:
        'Campañas de pauta en Meta con estrategia, seguimiento y optimización continua — y la cuenta a tu nombre (cumpliendo los prerrequisitos de la plataforma).',
      impacto: 'Tu marca frente a las personas correctas, todos los días. Tráfico que tú controlas, no el feed.',
    },
    {
      texto:
        'Tu web entregada para revisión 24 horas después de la grabación. La pauta, activa en hasta 2 semanas (verificaciones de Meta).',
      impacto:
        'Mientras otros entregan en meses, tu sistema arranca en días — al aire tan pronto des el visto bueno a las revisiones.',
    },
    {
      texto: 'Diseño web, audiovisual y tráfico bajo una sola firma, con procesos de estudio.',
      impacto:
        'Lo que normalmente contratas por separado, funcionando como un solo sistema — sin fricciones entre proveedores.',
    },
    {
      texto: 'Consistencia visual de marca en la web, el video y la pauta.',
      impacto: 'Una marca consistente puede aumentar los ingresos hasta 33% (estudio Lucidpress).',
      fuente: {
        label: 'Ver estudio',
        url: 'https://www.prnewswire.com/news-releases/study-finds-companies-with-consistent-branding-can-see-up-to-33-increase-in-revenue-300967219.html',
      },
    },
    {
      texto: 'Dos rondas de ajustes incluidas — en la web y en cada pieza audiovisual.',
      impacto: 'Pules el resultado sin costos sorpresa. ¿Necesitas más? Rondas adicionales a bajo costo.',
    },
  ] as { texto: string; impacto: string; fuente?: { label: string; url: string } }[],
  noGarantizamos: [
    'Cifras de ventas o leads — no vendemos humo: construimos el sistema y lo optimizamos.',
    'Community management ni publicación por ti (se ofrece como servicio aparte).',
    'El costo por clic de la pauta — lo fija la subasta de Meta, no nosotros.',
  ],
  /** El "por qué importa": el argumento del activo propio vs el algoritmo. */
  porqueImporta: {
    titulo: '🎯 Por qué un activo propio lo cambia todo',
    texto:
      'En redes, la audiencia es alquilada: el algoritmo decide quién te ve hoy y quién no te ve mañana. Tu web y tu tráfico son tuyos: cada peso invertido construye un sistema que capta, califica y agenda sin pedirle permiso al feed. Por eso no competimos por precio — construimos el vendedor que trabaja para ti 24/7.',
  },
  /** Nota honesta de expectativas: el ritmo depende del cliente. */
  nota:
    '⚡ El ritmo lo marcas tú: con reuniones, firmas y comunicación ágil, el proyecto vuela. Trabajamos al 100% y siempre a tu disposición.',
}

// ── S3 · Por qué Kaizen (autoridad / prueba social) ──────────────────────────

export const CASOS_TITULO = 'Lo que hemos hecho'
export const CASOS_INTRO =
  'Una muestra del estándar, en vivo: las webs que construimos y los videos que producimos.'

//  La sección vive en TRES bloques: 1) webs construidas (carrusel infinito),
//  2) videos producidos (la rejilla de casos de abajo), 3) resultados de
//  tráfico (próximamente).

export const TRABAJOS_WEB = {
  emoji: '🖥️',
  titulo: 'Webs que hemos hecho',
  /**
   * `src` acepta video MP4 silencioso en loop o imagen (png/jpg/webp), archivos
   * en public/marquee/. iw/ih: dimensiones intrínsecas de las imágenes (evitan
   * saltos de layout). La velocidad del carrusel se ajusta en lienzo.css
   * (animation: 60s = un ciclo completo; menos segundos = más rápido).
   * OJO (igual que en la landing): son demos — reemplazar por grabaciones de
   * las webs reales cuando existan.
   */
  items: [
    { nombre: 'Aethera', src: `${PUBLIC}marquee/aethera.mp4` },
    { nombre: 'Asme', src: `${PUBLIC}marquee/asme.webp`, iw: 1000, ih: 560 },
    { nombre: 'Nexora', src: `${PUBLIC}marquee/nexora.mp4` },
    { nombre: 'Velorah', src: `${PUBLIC}marquee/velorah.mp4` },
  ] as { nombre: string; src: string; iw?: number; ih?: number }[],
}

/**
 * Bloque 2 de 3: carrusel manual en bucle de videos producidos (flechas, uno
 * por uno, siempre centrado). `url` acepta enlaces de YouTube (watch, youtu.be,
 * embed o shorts — los shorts se muestran verticales automáticamente) y también
 * IMÁGENES locales (collages/fotos: ruta dentro de public/, ej.
 * '/ejemplos/fotografia.jpeg'). El reproductor es propio (miniatura + play
 * dorado, sin interfaz de YouTube); `tag` es la etiqueta accesible de cada card.
 */
export const VIDEOS_PRODUCIDOS = {
  emoji: '🎬',
  titulo: 'Videos que hemos producido',
  videos: [
    { url: 'https://www.youtube.com/embed/BMfuZTMlRVQ', tag: 'After movie' },
    { url: 'https://www.youtube.com/embed/_juWZCitCIs', tag: 'Video corporativo' },
    { url: 'https://www.youtube.com/embed/NXnG9fBh1k8', tag: 'Testimonial' },
    { url: 'https://youtube.com/shorts/kZGOqWh0x7c', tag: 'Reel branded' },
    { url: 'https://youtube.com/shorts/Bu0BMjd-KKA', tag: 'Recap de evento' },
    { url: `${PUBLIC}ejemplos/fotografia.jpeg`, tag: 'Fotografía de evento' },
  ] as { url: string; tag: string }[],
}

// ── S4 · Catálogo navegable (modelo Kaizen 2.0) ──────────────────────────────
//
//  4 pestañas: los 3 SERVICIOS principales (una sola oferta por pestaña, un
//  solo pago) + ADD-ONS (el catálogo audiovisual por categorías, para ampliar).

export const CATALOGO_TITULO = 'El catálogo'
export const CATALOGO_INTRO =
  'Tres formas de arrancar — cada servicio es una oferta completa, con un solo pago — y los add-ons para ampliar tu sistema. Precios sin IVA.'

/** Una columna de precio de la tarjeta de servicio (1 o 2 por servicio). */
export interface ColumnaPrecio {
  label: string
  valor: string
  detalle?: string
}

export interface ServicioPrincipal {
  id: string
  label: string
  /** Banner del servicio (public/catalogo/). Vacío = marcador "por agregar". */
  img: string
  claim: string
  /** false = "Próximamente": la pestaña se ve pero no se puede abrir. */
  disponible: boolean
  /** Columnas de precio, lado a lado (ej. servicio | mantenimiento). */
  precios: ColumnaPrecio[]
  entrega: string
  incluye: string[]
  nota?: string
  /** Apartado explicativo al pie de la tarjeta (ej. qué es el mantenimiento). */
  apartado?: string
}

/** Los 3 servicios principales (doc "Kaizen 2.0 — Servicios y Paquetes"). */
export const SERVICIOS_PRINCIPALES: ServicioPrincipal[] = [
  {
    id: 'entrada-digital',
    label: 'Entrada Digital',
    img: `${PUBLIC}catalogo/entrada-digital.webp`,
    claim: 'Tu web a medida con video de cine, lista para vender.',
    disponible: true,
    precios: [
      {
        label: 'Entrada Digital',
        valor: '$3.000.000 / año',
        detalle: 'Landing + producción audiovisual, todo incluido.',
      },
      {
        label: 'Mantenimiento',
        valor: '$300.000 / mes',
        detalle: '2 actualizaciones al mes, por un año.',
      },
    ],
    entrega: '⚡ Entrega: 24 horas después de la grabación.',
    incluye: [
      'Landing 100% a medida — nada de plantillas.',
      'Dominio, hosting y correo incluidos y configurados.',
      'Producción audiovisual con estándar de cine, integrada en la web.',
    ],
  },
  {
    id: 'sistema-clientes',
    label: 'Sistema de Clientes',
    img: `${PUBLIC}catalogo/sistema-clientes.webp`,
    claim: 'Web + video + tráfico: el sistema completo vendiendo por ti.',
    disponible: true,
    precios: [
      {
        label: 'Página + tráfico',
        valor: '$5.000.000',
        detalle: 'Cuando entras al sistema completo: tu landing + las campañas montadas.',
      },
      {
        label: 'Solo tráfico · mantenimiento',
        valor: '$2.000.000 / mes',
        detalle: 'Si ya tienes la página o el sistema está andando.',
      },
    ],
    entrega: '⚡ Entrega: 24 horas después de la grabación (cumpliendo requisitos).',
    incluye: [
      'Landing a medida + video con estándar de cine.',
      '5 a 6 anuncios producidos y campañas en Meta gestionadas por nosotros.',
      'Reportes de resultados: sabes qué funciona y qué ajustamos.',
      'Cuenta publicitaria a tu nombre (cumpliendo los prerrequisitos de Meta).',
    ],
    nota: 'La inversión en pauta se paga aparte a Meta (mínima sugerida: $3.000.000/mes).',
    apartado:
      '🔧 Sobre el mantenimiento: no es lo mismo que la instalación. Los $5.000.000 son construir tu landing y montar el tráfico. El mantenimiento ($2.000.000/mes) es mantener el sistema vendiendo: cada mes seguimos produciendo tus 5 a 6 anuncios, gestionamos las campañas y te enviamos reportes — todo funcionando perfecto.',
  },
  {
    id: 'sistema-comercial',
    label: 'Sistema Comercial Automático',
    img: '',
    claim: 'Funnels, CRM y seguimiento con IA — la máquina completa.',
    disponible: false,
    precios: [],
    entrega: '',
    incluye: [],
  },
]

// `img`: banner de la categoría (public/catalogo/). Vacío = sin banner.
// (Inmobiliario salió del lienzo con el modelo 2.0; sus items siguen en catalog.ts.)
export const CATEGORIAS: { id: Categoria; label: string; img: string; claim: string }[] = [
  { id: 'redes', label: 'Redes', img: `${PUBLIC}catalogo/redes.webp`, claim: 'Tu marca, publicando con calidad de cine cada semana.' },
  { id: 'eventos', label: 'Eventos', img: `${PUBLIC}catalogo/evento.webp`, claim: 'Que tu evento se sienta tan grande como fue.' },
  { id: 'corporativo', label: 'Corporativo', img: `${PUBLIC}catalogo/corporativo.webp`, claim: 'La cara profesional de tu empresa, en video.' },
]

/**
 * Qué grupos del catálogo se muestran por categoría de add-ons:
 * redes = paquetes + servicios completos · eventos = solo paquetes ·
 * corporativo = todo, tal cual estaba.
 */
export const GRUPOS_VISIBLES: Record<Categoria, readonly string[]> = {
  redes: ['paquetes', 'completos'],
  eventos: ['paquetes'],
  corporativo: ['paquetes', 'completos', 'grabacion', 'edicion'],
  inmobiliario: [],
}

// ── Detalle de cada servicio (pop-up) ────────────────────────────────────────
//
//  Entregables y proceso se DERIVAN de la modalidad para no escribir 42 bloques a
//  mano, y se pueden afinar por item en DETALLE_OVERRIDES. El "bloque de ejemplo"
//  (video) se setea por item con un enlace de YouTube — vacío = marcador.

export interface DetalleServicio {
  entregables?: string[]
  proceso?: string[]
  /** Enlace de YouTube o ruta local (public/...) del ejemplo. Vacío = marcador. */
  ejemplo?: string
}

const ENTREGABLES_POR_MODALIDAD: Record<string, string[]> = {
  'solo-grabacion': [
    'Material grabado en alta calidad, organizado y respaldado',
    'Selección de las mejores tomas, listas para editar',
    'Entrega por enlace privado de descarga',
  ],
  'solo-edicion': [
    'Tu pieza editada con color grading y audio profesional',
    'Exportada en los formatos que necesitas (horizontal + vertical)',
    'Una ronda de revisión incluida',
  ],
  completo: [
    'Grabación profesional + pieza(s) editada(s), lista(s) para publicar',
    'Color grading, audio profesional y formatos por canal',
    'Una ronda de revisión incluida',
  ],
  paquete: [
    'Todas las piezas del paquete, listas para distribuir',
    'Kit de distribución: versiones por canal + guía de publicación',
    'Una sola jornada para optimizar costo y tiempo',
  ],
}

const PROCESO_POR_MODALIDAD: Record<string, string[]> = {
  'solo-grabacion': ['Brief y plan de toma', 'Grabación en locación', 'Selección y entrega del material'],
  'solo-edicion': ['Recibimos tu material', 'Edición, color y audio', 'Revisión y entrega final'],
  completo: ['Brief creativo', 'Grabación', 'Edición en cine', 'Revisión y entrega'],
  paquete: ['Brief y guion', 'Jornada de grabación', 'Edición de todas las piezas', 'Entrega + guía de publicación'],
}

/**
 * Afinamientos por item. El `ejemplo` es el video por TIPO de pieza, reutilizado
 * cada vez que aparece ese tipo (servicio suelto o paquete). Vacío = marcador.
 * Los ejemplos viven en YouTube (mismos videos del carrusel, reproductor propio):
 * así el proyecto no carga archivos de video pesados y el deploy queda liviano.
 */
const YT_AFTER_MOVIE = 'https://www.youtube.com/embed/BMfuZTMlRVQ'
const YT_CORPORATIVO = 'https://www.youtube.com/embed/_juWZCitCIs'
const YT_TESTIMONIAL = 'https://www.youtube.com/embed/NXnG9fBh1k8'
const YT_REEL_BRANDED = 'https://youtube.com/shorts/kZGOqWh0x7c'
const YT_RECAP_EVENTO = 'https://youtube.com/shorts/Bu0BMjd-KKA'

export const DETALLE_OVERRIDES: Record<string, DetalleServicio> = {
  // ── Eventos ──
  'evt-cobertura-4h': { ejemplo: YT_RECAP_EVENTO },
  'evt-cobertura-8h': { ejemplo: YT_AFTER_MOVIE },
  'evt-cobertura-8h-compleja': { ejemplo: YT_AFTER_MOVIE },
  'evt-recap': { ejemplo: YT_RECAP_EVENTO },
  'evt-after-movie': { ejemplo: YT_AFTER_MOVIE },
  'evt-media-jornada': { ejemplo: YT_AFTER_MOVIE },
  'evt-completo': { ejemplo: YT_AFTER_MOVIE },
  'evt-premium': { ejemplo: YT_AFTER_MOVIE },
  // ── Redes ──
  'red-reel-grab-1': { ejemplo: YT_REEL_BRANDED },
  'red-reel-grab-varios': { ejemplo: YT_REEL_BRANDED },
  'red-reel-edicion': { ejemplo: YT_REEL_BRANDED },
  'red-reel-edicion-compleja': { ejemplo: YT_REEL_BRANDED },
  'red-reel-sencillo': { ejemplo: YT_REEL_BRANDED },
  'red-reel-branded': { ejemplo: YT_REEL_BRANDED },
  'red-pack-4-reels': { ejemplo: YT_REEL_BRANDED },
  'red-retainer-esencial': { ejemplo: YT_REEL_BRANDED },
  'red-retainer-pro': { ejemplo: YT_REEL_BRANDED },
  'red-retainer-edicion': { ejemplo: YT_REEL_BRANDED },
  // ── Inmobiliario (categoría fuera de la UI; sin ejemplo online aún) ──
  // 'inm-reel-edicion': { ejemplo: '/ejemplos/inmobiliario-tour.mp4' },
  // 'inm-reel-edicion-compleja': { ejemplo: '/ejemplos/inmobiliario-tour.mp4' },
  // 'inm-video-edicion': { ejemplo: '/ejemplos/inmobiliario-film.mp4' },
  // 'inm-reel-tour': { ejemplo: '/ejemplos/inmobiliario-tour.mp4' },
  // 'inm-recorrido': { ejemplo: '/ejemplos/inmobiliario-film.mp4' },
  // ── Corporativo ──
  'cor-testimonial': { ejemplo: YT_TESTIMONIAL },
  'cor-pitch': { ejemplo: YT_CORPORATIVO },
  'cor-video-largo': { ejemplo: YT_CORPORATIVO },
}

/** Devuelve entregables + proceso + ejemplo de un item (deriva o usa override). */
export function detalleDe(item: {
  id: string
  esPaquete: boolean
  modalidad: string
}): Required<DetalleServicio> {
  const clave = item.esPaquete ? 'paquete' : item.modalidad
  const ov = DETALLE_OVERRIDES[item.id] ?? {}
  return {
    entregables: ov.entregables ?? ENTREGABLES_POR_MODALIDAD[clave] ?? ENTREGABLES_POR_MODALIDAD.completo,
    proceso: ov.proceso ?? PROCESO_POR_MODALIDAD[clave] ?? PROCESO_POR_MODALIDAD.completo,
    ejemplo: ov.ejemplo ?? '',
  }
}

/**
 * Subsecciones del catálogo, en orden INVERTIDO (anclaje): primero la mejor
 * oferta (paquetes), luego servicios completos de una pieza, al final los
 * individuales (solo grabación / solo edición). Cada grupo se muestra solo si
 * tiene items en la categoría activa.
 */
export const GRUPOS_CATALOGO = [
  {
    id: 'paquetes',
    titulo: 'Paquetes',
    emoji: '🏆',
    nota: 'La mejor oferta por pieza.',
    match: (esPaquete: boolean) => esPaquete,
  },
  {
    id: 'completos',
    titulo: 'Servicios completos',
    emoji: '🎬',
    nota: 'Grabamos y editamos una pieza, lista para publicar.',
  },
  {
    id: 'grabacion',
    titulo: 'Solo grabación',
    emoji: '🎥',
    nota: 'Capturamos el material; tú lo editas.',
  },
  {
    id: 'edicion',
    titulo: 'Solo edición',
    emoji: '✂️',
    nota: 'Tú aportas el material; lo llevamos al estándar de cine.',
  },
] as const

/**
 * Mapa de "ahorro" de paquetes: cuántas unidades de un item suelto equivalen al
 * paquete. El ahorro se CALCULA del catálogo (no se escribe a mano) para que
 * siempre sea verdadero: ahorro = precioSuelto × cantidad − precioPaquete.
 * Solo se muestra "Ahorras $X" donde hay una equivalencia limpia y honesta.
 */
export const PACK_AHORRO: Record<string, { sueltoId: string; cantidad: number }> = {
  'red-pack-4-reels': { sueltoId: 'red-reel-sencillo', cantidad: 4 },
  'red-pack-4-podcasts': { sueltoId: 'red-podcast-full', cantidad: 4 },
  'red-yt-pack-2': { sueltoId: 'red-yt-completo-simple', cantidad: 2 },
}

// ── Pie ──────────────────────────────────────────────────────────────────────
export const PIE = {
  // Bajo el isotipo va la MARCA (no la firma personal): el cliente contrata con Kaizen Studios.
  marca: 'Kaizen Studios',
  nota: 'Los precios del catálogo no incluyen IVA — el total con IVA lo ves en la cotización.',
}
