// ─────────────────────────────────────────────────────────────────────────────
// Kaizen Studios — configuración central
// Aquí vive TODO lo que David debe rellenar ([[ TODO ]]). Cambia solo este archivo.
// Regla de marca: prohibido inventar métricas o clientes. Deja null/[] si no es real.
// Voz: directa, no "bonita". Frases cortas, verbos activos. El dolor primero,
// la solución después. Cero clichés motivacionales, cero lenguaje de gurú.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: 'Kaizen Studios',
  founder: 'David Seiko',
  tagline: 'Un sistema que vende. No una web más.',
  description:
    'No vendemos servicios sueltos: vendemos un sistema. Meta Ads que traen a la gente correcta, una web 100% tuya que convierte, y contenido orgánico que hace crecer tu marca. Producción audiovisual de calidad en cada pieza.',
  descriptionMobile:
    'Un sistema que atrae, convierte y hace crecer tu marca — con producción audiovisual de calidad en cada pieza.',
  // [[ TODO ]] dominio final de producción
  url: 'https://kaizenstudios.co',
}

export const CONTACT = {
  email: 'hola@kaizenvisualstudio.com',
  // Formato E.164 sin "+" — así lo espera el link wa.me/ (ver Footer.tsx).
  whatsapp: '573237158237',
}

// Link de agendamiento (Google Calendar) que se muestra al lead calificado
// justo al enviar el formulario — ver QualifyForm.tsx.
export const SCHEDULE_URL = 'https://calendar.app.google/qeEsdfsHpcwRctAN9'

// Redes de Kaizen Studios (deja '' lo que no exista)
export const SOCIAL = {
  instagram: 'https://www.instagram.com/kaizenstudios_oficial/',
  tiktok: '',
  youtube: 'https://www.youtube.com/@KaisenStudios.oficial',
  linkedin: 'https://www.linkedin.com/company/kaizen-estudios/',
}

// Marca personal de David
export const DAVID_LINKS = {
  instagram: 'https://www.instagram.com/soydavidseiko/',
  youtube: 'https://www.youtube.com/@SoyDavidSeiko',
  linkedin: 'https://www.linkedin.com/in/soydavidseiko/',
}

// Los 2 dolores centrales (Hero + teaser en Home). No son features: son lo
// que le está costando dinero al prospecto ahora mismo.
export const PAIN_POINTS = [
  {
    title: 'Dependes de un algoritmo que no controlas',
    text: 'El día que cambian las reglas — o se cae tu cuenta — tu negocio desaparece de internet. Nada de lo que construiste ahí es tuyo.',
  },
  {
    title: 'Sin página propia, no tienes autoridad',
    text: 'Eres una cuenta más entre miles, no una marca consolidada. Y mientras tanto, pierdes tiempo reexplicando lo mismo a cada cliente que llega sin filtrar.',
  },
]

// El sistema, en 3 fases con nombre (SystemSection + /sistema).
// art: imagen 3D real (si ASSETS.hasStageArt); si no hay, cae al SVG line-art
// del mismo índice en SCENES (ver SystemSection.tsx).
export const SYSTEM_PHASES: { cap: string; art?: string; t: string; d: string }[] = [
  {
    cap: 'Atraer',
    art: '/stages/07-trafico.webp',
    t: 'Atraer',
    d: 'Meta Ads que usan tus redes para traer a la gente correcta hacia lo tuyo — no a llenar tu feed, a llenar tu agenda.',
  },
  {
    cap: 'Convertir',
    art: '/stages/06-web.webp',
    t: 'Convertir',
    d: 'Una web 100% tuya, con copy estratégico y producción audiovisual de calidad. El clic deja de perderse: se vuelve cliente.',
  },
  {
    cap: 'Crecer',
    art: '/stages/08-gestion.png',
    t: 'Crecer',
    d: 'Contenido orgánico que construye marca y confianza antes del clic — el complemento que sube la calidad de cada lead y la conversión.',
  },
]

// El diferenciador — se destaca en Home, /sistema y /servicios.
export const DIFFERENTIATOR = {
  eyebrow: 'Lo que nos diferencia',
  title: 'Producción audiovisual de calidad. No plantilla, no render genérico.',
  text: 'Es el gancho que construye autoridad — y lo que abre la puerta a la parte de tecnología y automatización. Cada pieza que ves aquí es real: nuestra, filmada y editada con estándar de cine.',
}

// Segundo bloque del diferenciador: no es solo audiovisual — el sitio entero
// (copy + estructura + estética) está construido con criterio de marketing
// para convertir, no solo para verse bien. Se muestra debajo de DIFFERENTIATOR.
export const CONVERSION_POINTS = [
  {
    title: 'Copy que persuade',
    text: 'Cada texto está escrito desde la experiencia en marketing — para mover a la acción, no para decorar.',
  },
  {
    title: 'Estructura pensada en el cliente',
    text: 'El orden de cada sección responde a la experiencia del usuario, no al azar.',
  },
  {
    title: 'Criterio estético en cada decisión',
    text: 'Nada queda a la suerte: hay una razón detrás de cada color, espacio y jerarquía visual.',
  },
] as const

// "Un sistema, tres accesos" — reemplaza cualquier framing de "servicios" o
// "paquetes". Se usa en /servicios y como teaser en Home.
export const ACCESS_TIERS = [
  {
    key: 'muestra',
    name: 'Muestra',
    subtitle: 'Landing en 24 horas',
    text: 'Una sola página, con IA y producción audiovisual premium. Sin ads, sin GoHighLevel — para que veas cómo trabajamos.',
    forWho: 'Para probar antes de comprometerte.',
  },
  {
    key: 'sistema',
    name: 'El sistema',
    subtitle: 'El que siempre vendemos',
    text: 'Las 3 fases completas — atraer, convertir, crecer — con cierre simple: Calendly, WhatsApp o formulario. Sin GoHighLevel. Resultados asegurados.',
    forWho: 'Para negocios listos para dejar de depender del algoritmo.',
    featured: true,
  },
  {
    key: 'completo',
    name: 'Sistema completo',
    subtitle: 'Premium',
    text: 'Todo lo anterior + GoHighLevel de punta a punta: conversaciones, seguimiento y onboarding 100% automáticos. La máquina en piloto automático.',
    forWho: 'Para negocios que quieren soltar la operación del día a día.',
  },
] as const

// Anti-posicionamiento — "Cómo trabajamos" en /quienes-somos.
export const HOW_WE_WORK = [
  'No somos una agencia de 50 personas. Somos un grupo de independientes que se alió para escalar a mejores clientes y mejores proyectos.',
  'Tomamos pocos proyectos a la vez. Cada uno recibe el 100% de nuestra atención — no lo repartimos entre veinte cuentas.',
  'Todo es artesanal y al detalle. Obsesivos con el resultado, no con la plantilla.',
  'No somos la opción más barata. Somos la mejor. La promesa nunca fue rapidez — es calidad.',
] as const

// Equipo (además de David, que tiene su propia sección en Founder.tsx).
// bio: párrafo corto para /quienes-somos. pos: object-position del avatar.
export const TEAM: { name: string; role: string; bio: string; photo?: string; pos?: string; social?: string }[] = [
  {
    name: 'Juan C. Moreno',
    role: 'Editor, socio y marketer',
    bio: 'Experto en marketing, sistemas de contenido y lanzamientos. Fue director de marketing de Julián Otálora, mencionado en Forbes Argentina y Forbes Ecuador, durante varios años. Él es la persona que hace que una idea llegue a millones.',
    photo: '/img/team-1.webp',
    social: 'https://www.instagram.com/juan.edita/',
  },
  {
    name: 'Jennifer Correa',
    role: 'Community Manager',
    bio: 'Experta en respuesta humana e interacción con la comunidad. Además es modelo y trabaja como tal en distintos proyectos. Atenta, servicial y cercana — la que se asegura de que ningún mensaje se quede sin respuesta.',
    photo: '/img/jennifer-retrato.webp',
    social: 'https://www.instagram.com/jennifercs07/',
  },
  {
    name: 'Juan Guzmán',
    role: 'Filmmaker y editor',
    bio: 'Más de 4 años filmando de todo: desde prensa hasta un estudio creativo de tatuajes. Su enfoque está en la calidad, no en la cantidad de proyectos — comprometido con cada uno, sin importar el tamaño del cliente.',
    photo: '/img/team-2.webp',
    pos: '50% 26%',
    social: 'https://www.instagram.com/juanfilmmaker377/',
  },
]

// URL de Calendly / GHL (legado). Ya no se usan: el formulario propio de la
// landing reemplazó el iframe embebido. Se deja documentado por si se vuelve
// a necesitar un fallback de agenda directa.
// GHL_FORM_EMBED / GHL_FORM_SCRIPT / CALENDLY_URL — retirados.

// Métricas reales. value: null muestra "—" + "por confirmar". No inventar.
export const METRICS: { value: number | null; suffix: string; label: string }[] = [
  { value: 15, suffix: '+', label: 'Proyectos entregados' },
  { value: 8, suffix: '+', label: 'Clientes atendidos' },
  { value: 4, suffix: '+', label: 'Años en audiovisual' },
  { value: 70, suffix: '+', label: 'Piezas entregadas' },
]

// Logos de clientes reales (con permiso). Vacío = oculta la sección.
export const CLIENTS: { name: string; src: string; h?: number; w?: number; iw: number; ih: number }[] = [
  { name: 'Harumi', src: '/logos-clientes/harumi.webp', h: 70, iw: 280, ih: 280 },
  { name: 'Neuropúblico', src: '/logos-clientes/neuro.webp', iw: 640, ih: 98 },
  { name: 'Trifactor', src: '/logos-clientes/trifactor.webp', h: 66, iw: 300, ih: 234 },
  { name: 'Atlax 360', src: '/logos-clientes/atlax.webp', iw: 520, ih: 175 },
  { name: 'Secretaría de Educación de Bogotá', src: '/logos-clientes/sed.webp', h: 90, w: 350, iw: 700, ih: 179 },
]

// Marquee "Nuestro trabajo": previews animados de webs construidas (/public/marquee).
// ⚠️ [[ TODO David ]] Son placeholders de motionsites.ai convertidos a MP4.
// Reemplazar por capturas/grabaciones de las webs propias cuando existan.
export const WORK_MARQUEE: { name: string; src: string; iw?: number; ih?: number }[] = [
  { name: 'Aethera', src: '/marquee/aethera.mp4' },
  { name: 'Asme', src: '/marquee/asme.webp', iw: 1000, ih: 560 },
  { name: 'Nexora', src: '/marquee/nexora.mp4' },
  { name: 'Velorah', src: '/marquee/velorah.mp4' },
]

// Testimonios reales (con permiso del cliente).
// Retratos: sube la foto CUADRADA (mín. 200×200) a /public/testimonials/ con el
// nombre exacto que dice `photo`. Mientras no exista el archivo, la card muestra
// un avatar dorado con la inicial del nombre — no se rompe nada.
// El badge calcula solo el promedio de `stars` de todos los testimonios.
export const TESTIMONIALS_BADGE = { label: 'Rating' }
export const TESTIMONIALS: { name: string; role?: string; company?: string; photo: string; quote: string; stars: number }[] = [
  {
    name: 'Ricardo Reyes', role: 'Gerente general', company: 'Atlax Colombia', photo: '/testimonials/ricardo-96.webp', stars: 5,
    quote: 'Trabajar con Kaizen ha sido una experiencia que supera cualquier expectativa: transmiten confianza desde el inicio por la calidad de sus equipos y profesionalismo, y su verdadero valor está en convertir una idea inicial en un mensaje claro, emotivo y de alto impacto. Más que producir videos, transforman ideas en historias que conectan de verdad — el resultado final siempre es mucho mejor de lo que uno imaginó.',
  },
  {
    name: 'Diana Castillo Hernández', role: 'Contadora independiente', photo: '/testimonials/diana.jpg', stars: 5,
    quote: 'Antes tenía que reexplicarle a cada cliente qué servicios manejaba y cómo agendar una cita — perdía tiempo con personas que ni siquiera iban a contratar. Kaizen me construyó una página donde explico mis servicios contables y agendo directamente desde ahí. Ahora la web hace ese filtro por mí: cuando alguien me escribe, ya sabe qué quiere y está listo para avanzar. Las llamadas que tengo hoy son mucho más efectivas.',
  },
  // [[ TODO David: completar rol/empresa, estrellas y quote de Marco y la Dra., luego descomentar ]]
  // { name: 'Marco', role: '', company: '', photo: '/testimonials/marco.jpg', stars: 5, quote: '' },
  // { name: 'Dra.', role: '', company: '', photo: '/testimonials/dra.jpg', stars: 5, quote: '' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Formulario de calificación (4 pasos) → src/components/QualifyForm.tsx
// ─────────────────────────────────────────────────────────────────────────────

export const FORM_INTEREST_OPTIONS = [
  { value: 'clientes', label: 'No consigo suficientes clientes nuevos' },
  { value: 'conversion', label: 'Mi web no convierte, pierdo clientes' },
  { value: 'seguimiento', label: 'Se me pierden leads, no doy seguimiento' },
  { value: 'no-seguro', label: 'No estoy seguro' },
  { value: 'otro', label: 'Otro' },
] as const

export const FORM_TIMELINE_OPTIONS = [
  { value: 'ya', label: 'Ya, este mes' },
  { value: '1-3-meses', label: 'En 1–3 meses' },
  { value: 'explorando', label: 'Solo estoy explorando' },
] as const

// Rangos por moneda. El primer tramo de cada lista es el "tramo bajo" que
// usa la lógica de calificación (ver QualifyForm.tsx). "Prefiero no decirlo"
// va al final a propósito: no debe caer en el tramo bajo ni descalificar.
export const FORM_REVENUE_BUCKETS = {
  COP: ['Menos de $10.000.000', '$10.000.000 – $30.000.000', '$30.000.000 – $100.000.000', 'Más de $100.000.000', 'Prefiero no decirlo'],
  USD: ['Menos de $3.000', '$3.000 – $9.000', '$9.000 – $30.000', 'Más de $30.000', 'Prefiero no decirlo'],
} as const

export const FORM_BUDGET_BUCKETS = {
  COP: ['Menos de $2.000.000', '$2.000.000 – $5.000.000', '$5.000.000 – $10.000.000', 'Más de $10.000.000'],
  USD: ['Menos de $650', '$650 – $1.500', '$1.500 – $3.000', 'Más de $3.000'],
} as const

// País → indicativo telefónico. Al elegir país en el paso 1, el teléfono
// muestra este código como prefijo fijo — el usuario solo escribe el resto.
export const COUNTRIES = [
  { name: 'Colombia', code: '+57' },
  { name: 'México', code: '+52' },
  { name: 'Estados Unidos', code: '+1' },
  { name: 'Argentina', code: '+54' },
  { name: 'Chile', code: '+56' },
  { name: 'Perú', code: '+51' },
  { name: 'Ecuador', code: '+593' },
  { name: 'Venezuela', code: '+58' },
  { name: 'España', code: '+34' },
  { name: 'Panamá', code: '+507' },
  { name: 'Costa Rica', code: '+506' },
  { name: 'Uruguay', code: '+598' },
  { name: 'Paraguay', code: '+595' },
  { name: 'Bolivia', code: '+591' },
  { name: 'Guatemala', code: '+502' },
  { name: 'Honduras', code: '+504' },
  { name: 'El Salvador', code: '+503' },
  { name: 'Nicaragua', code: '+505' },
  { name: 'República Dominicana', code: '+1' },
  { name: 'Puerto Rico', code: '+1' },
  { name: 'Cuba', code: '+53' },
  { name: 'Brasil', code: '+55' },
  { name: 'Canadá', code: '+1' },
  { name: 'Reino Unido', code: '+44' },
  { name: 'Francia', code: '+33' },
  { name: 'Alemania', code: '+49' },
  { name: 'Italia', code: '+39' },
  { name: 'Portugal', code: '+351' },
  { name: 'Otro', code: '' },
] as const

// Flags de assets: ponlos en true cuando subas los archivos reales a /public.
export const ASSETS = {
  hasShowreel: true, // /video/SHOWREEL.{webm,mp4}
  hasSequence: false, // /sequence/frame-0001.jpg … (si false, apertura procedural en canvas)
  // /img/david-retrato.jpg. Se renderiza con <img> plana en Founder.tsx, no
  // next/image: en este disco externo, el optimizador de imágenes de Next a
  // veces sirve el archivo fantasma "._david-retrato.jpg" (metadata de macOS)
  // en vez del real — <img> evita el optimizador y el problema por completo.
  hasDavidPhoto: true,
  hasStageArt: true, // /stages/*.png (iconos 3D por etapa; si false usa el line-art SVG)
  // /stages/form-success.png (calificó) y /stages/form-no-success.png (no
  // calificó) — íconos para el mensaje de "enviado" del formulario.
  hasFormSuccessArt: true,
}
