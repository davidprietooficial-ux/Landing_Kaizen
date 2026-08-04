import type { Locale } from './locale'

// Índice de búsqueda del header. Estático, sin backend: cada entrada es una
// página o sección a la que la búsqueda puede llevar. Se amplía a mano cuando
// se agreguen posts de blog o recursos reales (nada de indexar contenido
// placeholder "Próximamente").

export type SearchEntry = { title: string; href: string; keywords: string[] }

// Sistema, Servicios, Clientes y Blog: comentados junto con su link en el nav
// del Header — mientras no estén activos, tampoco deben aparecer en la
// búsqueda. Descomenta la entrada correspondiente al reactivar cada página.
export const SEARCH_INDEX: SearchEntry[] = [
  { title: 'Inicio', href: '/', keywords: ['home', 'inicio', 'kaizen'] },
  // { title: 'Cómo funciona el sistema', href: '/sistema', keywords: ['sistema', 'atraer', 'convertir', 'gestionar', 'metodología', 'proceso'] },
  { title: 'Quiénes somos', href: '/quienes-somos', keywords: ['equipo', 'nosotros', 'quienes somos', 'david seiko'] },
  // { title: 'Un sistema, tres accesos', href: '/servicios', keywords: ['servicios', 'precios', 'muestra', 'sistema completo', 'accesos'] },
  // { title: 'Clientes y casos de estudio', href: '/clientes', keywords: ['clientes', 'casos de estudio', 'resultados', 'testimonios'] },
  // { title: 'Blog', href: '/blog', keywords: ['blog', 'artículos', 'noticias'] },
  { title: 'Recursos descargables', href: '/recursos', keywords: ['recursos', 'descargas', 'infoproductos', 'gratis'] },
  { title: 'Agenda tu llamada', href: '/#agendar', keywords: ['formulario', 'contacto', 'agendar', 'llamada', 'cotización'] },
  { title: 'Política de privacidad', href: '/privacidad', keywords: ['privacidad', 'datos', 'legal'] },
  { title: 'Términos y condiciones', href: '/terminos', keywords: ['términos', 'condiciones', 'legal'] },
]

// Mismas páginas, en inglés, bajo /en. Amplía junto con SEARCH_INDEX cuando
// se reactiven Sistema/Servicios/Clientes/Blog.
export const SEARCH_INDEX_EN: SearchEntry[] = [
  { title: 'Home', href: '/en', keywords: ['home', 'kaizen'] },
  { title: 'About us', href: '/en/quienes-somos', keywords: ['team', 'about', 'david seiko'] },
  { title: 'Resources', href: '/en/recursos', keywords: ['resources', 'downloads', 'free'] },
  { title: 'Book your call', href: '/en#agendar', keywords: ['form', 'contact', 'book', 'call', 'quote'] },
  { title: 'Privacy policy', href: '/en/privacidad', keywords: ['privacy', 'data', 'legal'] },
  { title: 'Terms and conditions', href: '/en/terminos', keywords: ['terms', 'conditions', 'legal'] },
]

export function searchSite(query: string, locale: Locale = 'es', limit = 6): SearchEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const index = locale === 'en' ? SEARCH_INDEX_EN : SEARCH_INDEX
  return index.filter(
    (e) => e.title.toLowerCase().includes(q) || e.keywords.some((k) => k.includes(q)),
  ).slice(0, limit)
}
