// ─────────────────────────────────────────────────────────────────────────────
// Kaizen Studios — configuración central
// Aquí vive TODO lo que David debe rellenar ([[ TODO ]]). Cambia solo este archivo.
// Regla de marca: prohibido inventar métricas o clientes. Deja null/[] si no es real.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: 'Kaizen Studios',
  founder: 'David Seiko',
  tagline: 'Una grabación. Un sistema de contenido.',
  description:
    'Grabamos una vez y mantenemos la misma calidad de cine en cada pieza — sistematizado, sin desorden, con tecnología de punta.',
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
// [[ TODO David: nombres reales + foto opcional en /public/img + red social de cada uno ]]
export const TEAM: { name: string; role: string; photo?: string; social?: string }[] = [
  { name: 'Por confirmar', role: 'Cámara / Dirección de foto', social: '' },
  { name: 'Por confirmar', role: 'Postproducción / Edición', social: '' },
]

// URL de Calendly de la llamada de cierre (vacío = muestra fallback con CTA a correo)
export const CALENDLY_URL = 'https://calendly.com/kaisenpoststudio/30min'

// Métricas reales — [[ TODO ]]. value: null muestra "—" + "por confirmar". No inventar.
export const METRICS: { value: number | null; suffix: string; label: string }[] = [
  { value: null, suffix: '+', label: 'Proyectos entregados' },
  { value: null, suffix: '+', label: 'Clientes atendidos' },
  { value: null, suffix: '', label: 'Años produciendo' },
  { value: null, suffix: '+', label: 'Piezas publicadas' },
]

// Logos de clientes reales (con permiso). Vacío = oculta el marquee. — [[ TODO ]]
// { name: 'Cliente', src: '/logos-clientes/cliente-1.svg' }
export const CLIENTS: { name: string; src: string }[] = []

// Flags de assets: ponlos en true cuando subas los archivos reales a /public.
export const ASSETS = {
  hasShowreel: false, // /video/showreel-loop.{webm,mp4} + poster
  hasSequence: false, // /sequence/frame-0001.jpg … (si false, apertura procedural en canvas)
  hasDavidPhoto: false, // /img/david-retrato.jpg, etc.
  hasStageArt: true, // /stages/*.png (iconos 3D por etapa; si false usa el line-art SVG)
}
