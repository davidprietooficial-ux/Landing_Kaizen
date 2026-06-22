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
// pos: object-position del avatar (encuadre de la cara). social: '' = ícono deshabilitado.
// [[ TODO David: pegar el @ de Instagram de cada uno cuando los tengas ]]
export const TEAM: { name: string; role: string; photo?: string; pos?: string; social?: string }[] = [
  { name: 'Juan C. Moreno', role: 'Editor y socio estratégico', photo: '/img/team-1.jpeg', social: 'https://www.instagram.com/juan.edita/' },
  { name: 'Juan Guzmán', role: 'Filmmaker y editor', photo: '/img/team-2.jpg', pos: '50% 26%', social: 'https://www.instagram.com/juanfilmmaker377/' },
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

// Flags de assets: ponlos en true cuando subas los archivos reales a /public.
export const ASSETS = {
  hasShowreel: true, // /video/SHOWREEL.{webm,mp4}
  hasSequence: false, // /sequence/frame-0001.jpg … (si false, apertura procedural en canvas)
  hasDavidPhoto: true, // /img/david-retrato.jpg, etc.
  hasStageArt: true, // /stages/*.png (iconos 3D por etapa; si false usa el line-art SVG)
}
