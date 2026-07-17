/** Reporte de verificacion del catalogo. Correr con: npx vite-node src/data/_reporte.ts */
import { CATALOGO } from './catalog'
import { evaluar, pisoPrecio } from '../engine/pricing'

const cop = (n: number) => '$' + Math.round(n).toLocaleString('es-CO')
const pc = (f: number) => (f * 100).toFixed(1).replace('.', ',') + '%'

const byId = Object.fromEntries(CATALOGO.map((i) => [i.id, i]))

for (const i of CATALOGO) {
  const r = evaluar(i.precio, i.costoReal)
  const tipo = i.esPaquete ? 'PAQ' : i.modalidad === 'solo-edicion' ? 'EDIC' : 'SUELTO'
  console.log(
    [
      i.categoria.padEnd(13),
      i.nombre.padEnd(40),
      tipo.padEnd(7),
      cop(i.costoReal).padStart(12),
      cop(pisoPrecio(i.costoReal)).padStart(12),
      cop(i.precio).padStart(12),
      pc(r.margenNeto).padStart(7),
      cop(r.gananciaNeta).padStart(12),
      cop(r.totalCliente).padStart(13),
    ].join(' '),
  )
}

// Anclaje: ahorro del paquete vs comprar su contenido suelto
const p = (id: string) => byId[id].precio
console.log('\n--- ANCLAJE (ahorro paquete vs sueltos) ---')
const ancla = (nombre: string, packId: string, sueltos: number) => {
  const pack = p(packId)
  console.log(`${nombre.padEnd(24)} pack ${cop(pack).padStart(12)}  vs sueltos ${cop(sueltos).padStart(12)}  ahorra ${cop(sueltos - pack).padStart(12)} (${pc((sueltos - pack) / sueltos)})`)
}
ancla('Evento Media Jornada', 'evt-media-jornada', p('evt-cobertura-4h') + p('evt-after-movie') + 3 * p('red-reel-sencillo'))
ancla('Evento Completo', 'evt-completo', p('evt-cobertura-8h') + p('evt-after-movie') + 3 * p('red-reel-sencillo'))
ancla('Evento Premium 360', 'evt-premium', p('evt-cobertura-8h') + p('evt-after-movie') + 5 * p('red-reel-sencillo') + p('red-fotografia') + p('cor-testimonial'))
ancla('Pack 4 reels', 'red-pack-4-reels', 4 * p('red-reel-sencillo'))
ancla('Pack 4 podcasts', 'red-pack-4-podcasts', 4 * p('red-podcast-full'))
