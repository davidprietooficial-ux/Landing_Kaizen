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
  { title: 'Quiénes somos', href: '/quienes-somos', keywords: ['equipo', 'nosotros', 'quienes somos', 'cómo trabajamos', 'david seiko'] },
  { title: 'Trabaja con nosotros', href: '/quienes-somos#trabaja', keywords: ['empleo', 'postular', 'trabajo', 'unirse'] },
  // { title: 'Un sistema, tres accesos', href: '/servicios', keywords: ['servicios', 'precios', 'muestra', 'sistema completo', 'accesos'] },
  // { title: 'Clientes y casos de estudio', href: '/clientes', keywords: ['clientes', 'casos de estudio', 'resultados', 'testimonios'] },
  // { title: 'Blog', href: '/blog', keywords: ['blog', 'artículos', 'noticias'] },
  { title: 'Recursos descargables', href: '/recursos', keywords: ['recursos', 'descargas', 'infoproductos', 'gratis'] },
  { title: 'Agenda tu llamada', href: '/#agendar', keywords: ['formulario', 'contacto', 'agendar', 'llamada', 'cotización'] },
  { title: 'Política de privacidad', href: '/privacidad', keywords: ['privacidad', 'datos', 'legal'] },
  { title: 'Términos y condiciones', href: '/terminos', keywords: ['términos', 'condiciones', 'legal'] },
]

export function searchSite(query: string, limit = 6): SearchEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return SEARCH_INDEX.filter(
    (e) => e.title.toLowerCase().includes(q) || e.keywords.some((k) => k.includes(q)),
  ).slice(0, limit)
}
