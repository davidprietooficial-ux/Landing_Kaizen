// ─────────────────────────────────────────────────────────────────────────────
// Kaizen Studios — posts del blog
// Regla de marca: prohibido inventar métricas o clientes — esto también aplica
// a contenido de blog, no se publican posts de relleno. Esta lista arranca
// vacía a propósito: /blog ya sabe renderizar el estado "todavía no hay nada"
// cuando BLOG_POSTS está vacío, y el grid de posts + /blog/[slug] en cuanto
// haya al menos uno. No hace falta tocar código cuando se agregue el primero.
//
// [[ TODO David ]]: cuando haya un post real, agrégalo aquí. Forma del objeto
// (no copiar el texto de ejemplo, es solo para mostrar los campos):
//   {
//     slug: 'como-elegir-agencia-de-produccion-audiovisual',
//     title: 'Título real del post',
//     excerpt: 'Uno o dos renglones que resumen el post, para la tarjeta del grid.',
//     date: '2026-09-01',       // ISO (YYYY-MM-DD), se formatea al mostrarse
//     readTime: '6 min',
//     content: 'Contenido real del post, en texto plano separado por párrafos.',
//   }
// ─────────────────────────────────────────────────────────────────────────────

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  content?: string
}

export const BLOG_POSTS: BlogPost[] = []
