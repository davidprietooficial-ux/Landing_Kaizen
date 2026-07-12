// ─────────────────────────────────────────────────────────────────────────────
// Kaizen Studios — configuración central
// Aquí vive TODO lo que David debe rellenar ([[ TODO ]]). Cambia solo este archivo.
// Regla de marca: prohibido inventar métricas o clientes. Deja null/[] si no es real.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: 'Kaizen Studios',
  founder: 'David Seiko',
  tagline: 'Webs que venden. Tráfico que convierte.',
  description:
    'Somos un estudio creativo y tecnológico: diseñamos landing pages con enfoque audiovisual y gestionamos tu tráfico online para convertir visitas en clientes.',
  // Variante corta para el hero en móvil (sin la intro "Somos un estudio…")
  descriptionMobile:
    'Diseñamos landing pages con enfoque audiovisual y gestionamos tu tráfico online para convertir visitas en clientes.',
  // [[ TODO ]] dominio final de producción
  url: 'https://kaizenstudios.co',
}

// Solo correo como canal de contacto por ahora (teléfono/WhatsApp desactivados).
export const CONTACT = {
  email: 'kaisenpoststudio@gmail.com',
}

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

// Equipo de Kaizen además de David (refuerza "es un estudio, no un freelance").
// pos: object-position del avatar (encuadre de la cara). social: '' = ícono deshabilitado.
// [[ TODO David: pegar el @ de Instagram de cada uno cuando los tengas ]]
export const TEAM: { name: string; role: string; photo?: string; pos?: string; social?: string }[] = [
  { name: 'Juan C. Moreno', role: 'Editor, socio y marketer', photo: '/img/team-1.jpeg', social: 'https://www.instagram.com/juan.edita/' },
  { name: 'Juan Guzmán', role: 'Filmmaker y editor', photo: '/img/team-2.jpg', pos: '50% 26%', social: 'https://www.instagram.com/juanfilmmaker377/' },
  { name: 'Jennifer Correa', role: 'Community Manager', photo: '/img/jennifer-retrato.jpeg', social: 'https://www.instagram.com/jennifercs07/' },
]

// URL de Calendly de la llamada de cierre (vacío = muestra fallback con CTA a correo)
export const CALENDLY_URL = 'https://calendly.com/kaisenpoststudio/30min'

// Métricas reales. value: null muestra "—" + "por confirmar". No inventar.
export const METRICS: { value: number | null; suffix: string; label: string }[] = [
  { value: 15, suffix: '+', label: 'Proyectos entregados' },
  { value: 8, suffix: '+', label: 'Clientes atendidos' },
  { value: 4, suffix: '+', label: 'Años en audiovisual' },
  { value: 70, suffix: '+', label: 'Piezas entregadas' },
]

// Logos de clientes reales (con permiso). Vacío = oculta la sección.
// h: alto máx del logo (px). w: ancho del chip (px) para logos anchos que se ven pequeños.
export const CLIENTS: { name: string; src: string; h?: number; w?: number }[] = [
  { name: 'Harumi', src: '/logos-clientes/harumi-logo.png', h: 70 },
  { name: 'Neuropúblico', src: '/logos-clientes/Neuro-logo.png' },
  { name: 'Trifactor', src: '/logos-clientes/Trifactor-Logo.png', h: 66 },
  { name: 'Atlax 360', src: '/logos-clientes/atlax_logo.webp' },
  { name: 'Secretaría de Educación de Bogotá', src: '/logos-clientes/LOGO-SED.png', h: 90, w: 350 },
]

// Marquee "Nuestro trabajo": previews animados de webs construidas (/public/marquee).
// ⚠️ [[ TODO David ]] Son placeholders de motionsites.ai convertidos a MP4.
// Reemplazar por capturas/grabaciones de las webs propias cuando existan.
export const WORK_MARQUEE: { name: string; src: string }[] = [
  { name: 'Aethera', src: '/marquee/aethera.mp4' },
  { name: 'Asme', src: '/marquee/asme.mp4' },
  { name: 'Nexora', src: '/marquee/nexora.mp4' },
  { name: 'Velorah', src: '/marquee/velorah.mp4' },
]

// Testimonios (sección carrusel).
// ⚠️ [[ TODO David ]] Son PLACEHOLDERS (nombres/quotes/avatares de demo, avatares de Pexels).
// Reemplazar por testimonios reales de clientes (con su permiso) antes de publicar.
// El badge (p. ej. plataforma de reseñas + nota) también es placeholder.
export const TESTIMONIALS_BADGE = { stars: 5, label: 'Clutch 5/5' }
export const TESTIMONIALS: { name: string; role: string; company: string; photo: string; quote: string }[] = [
  {
    name: 'Marcus Anderson', role: 'CEO', company: 'Data.storage', photo: '/testimonials/marcus.jpg',
    quote: 'Con muy poca dirección de nuestra parte, el equipo entregó diseños que daban en el clavo una y otra vez. La landing quedó impecable y el proceso fue de cero fricción.',
  },
  {
    name: 'alexwu', role: 'Founder', company: 'Nexgate', photo: '/testimonials/alexwu.jpg',
    quote: 'Kaizen lideró la creación de nuestra mejor web hasta la fecha. Entendieron el negocio a la primera y se nota en cada detalle del resultado.',
  },
  {
    name: 'James Mitchell', role: 'VP Product', company: 'LaunchPad', photo: '/testimonials/james.jpg',
    quote: 'Trabajar con Kaizen transformó la visión de nuestro producto. La web no solo se ve increíble: convierte visitas en clientes todos los días.',
  },
  {
    name: 'Rachel Foster', role: 'Co-founder', company: 'Nexus Labs', photo: '/testimonials/rachel.jpg',
    quote: 'La calidad del diseño superó nuestras expectativas. Rápidos, ordenados y con un estándar visual de otro nivel.',
  },
  {
    name: 'David Zhang', role: 'Head of Design', company: 'Paradigm Labs', photo: '/testimonials/david.jpg',
    quote: 'Trabajo increíble de principio a fin. Comunicación clara, entregas a tiempo y un resultado que habla por sí solo.',
  },
]

// Flags de assets: ponlos en true cuando subas los archivos reales a /public.
export const ASSETS = {
  hasShowreel: true, // /video/SHOWREEL.{webm,mp4}
  hasSequence: false, // /sequence/frame-0001.jpg … (si false, apertura procedural en canvas)
  hasDavidPhoto: true, // /img/david-retrato.jpg, etc.
  hasStageArt: true, // /stages/*.png (iconos 3D por etapa; si false usa el line-art SVG)
}
