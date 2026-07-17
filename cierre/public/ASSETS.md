# Cómo agregar tus imágenes y videos al lienzo

Todos los archivos van dentro de esta carpeta `public/`. Luego pegas la ruta en
`src/lienzo/content.ts` (la ruta empieza con `/`, NO con `public/`).

> ⚠️ REGLA DE PESO: aquí solo van archivos LIVIANOS (imágenes optimizadas y
> MP4 de preview < 5 MB). Los videos completos van en YouTube (no listados) y se
> enlazan; los archivos originales pesados viven FUERA del proyecto, en
> `../RESPALDO-videos-pesados/`. Así el repo se puede subir a GitHub y el deploy
> en Vercel queda liviano.

## 1. Video de portada (hero)
- Es un enlace de YouTube en content.ts → `HERO.video.src` (reproductor propio:
  miniatura + play dorado, sin interfaz de YouTube).

## 2. Elementos 3D sobre "Cómo trabajamos" (PNG transparente) — 5 pasos
- Archivos en `public/proceso/` (proceso Kaizen 2.0):
  - `01-logistica.png`  (Arranque y plan)
  - `02-grabacion.png`  (Grabación)
  - `06-web.png`  (Edición y construcción de la web — copiado de la landing)
  - `04-revision.png`  (Revisión y entrega)
  - `07-trafico.png`  (Tráfico y acompañamiento — copiado de la landing)
  - `03-postproduccion.png` y `05-entrega.png` ya no se usan: están en `../RESPALDO-videos-pesados/otros/`.
- En content.ts → `PROCESO.pasos[n].img`: `'/proceso/01-logistica.png'`, etc.

## 3. Imagen por pestaña de add-ons del catálogo
- Archivos: `public/catalogo/redes.jpeg`, `evento.jpeg`, `corporativo.jpeg`
  (`inmobiliario.jpeg` salió de la UI; está en el respaldo).
- En content.ts → `CATEGORIAS[n].img`: `'/catalogo/redes.jpeg'`, etc.

## 4. Carrusel "Videos que hemos producido" (en bucle)
- Enlaces de YouTube en content.ts → `VIDEOS_PRODUCIDOS.videos`
  (`{ url: 'https://youtube.com/...', tag: 'After movie' }`). Acepta watch, youtu.be,
  embed y shorts — los shorts se muestran verticales automáticamente.
- También acepta IMÁGENES locales (collages/fotos): `{ url: '/ejemplos/fotografia.jpeg', tag: 'Fotografía' }`.
- El reproductor es propio (miniatura + play dorado); YouTube solo aparece al dar play.

## 5. Video de ejemplo dentro del pop-up de un servicio (opcional)
- Es un enlace de YouTube en content.ts → `DETALLE_OVERRIDES`:
  `{ 'red-pack-4-reels': { ejemplo: 'https://youtube.com/shorts/...' } }`
- Los mismos 5 videos del carrusel cubren hoy todos los tipos de pieza
  (constantes `YT_*` arriba de `DETALLE_OVERRIDES`). Vacío = marcador elegante.

> Mientras un archivo no exista, el lienzo muestra un marcador elegante (▶ / "por agregar").
> Nada se rompe si faltan: puedes ir agregándolos de a poco.

## 6. Logo / favicon (isotipo dorado)
- Archivo: `public/logo-kaizen.png` (212×212, esquinas transparentes)
- Se usa en dos lugares: el logo del hero (`Lienzo.tsx`) y el favicon (`index.html`).
- Para cambiarlo, reemplaza el PNG por otro cuadrado con el mismo nombre.

## 7. Carrusel "Webs que hemos hecho" (sección Lo que hemos hecho)
- Archivos en `public/marquee/`: MP4 silencioso en loop (grabación de scroll del sitio) o imagen webp/png.
- En content.ts → `TRABAJOS_WEB.items`: `{ nombre: 'Mi web', src: '/marquee/mi-web.mp4' }`
- Receta ffmpeg para convertir una grabación de pantalla (baja de ~90 MB a ~500 KB):
  `ffmpeg -i grabacion.mov -vf "scale=-2:'min(500,ih)':flags=lanczos,fps=24" -c:v libx264 -pix_fmt yuv420p -crf 26 -preset slow -movflags +faststart -an preview.mp4`

## 8. Banners de los servicios principales (catálogo 2.0) — POR GENERAR
- Archivos sugeridos en `public/catalogo/`: `entrada-digital.jpeg`, `sistema-clientes.jpeg`,
  `sistema-comercial.jpeg` (mismo formato ancho que los banners de redes/eventos/corporativo).
- En content.ts → `SERVICIOS_PRINCIPALES[n].img`: `'/catalogo/entrada-digital.jpeg'`, etc.
- Mientras estén vacíos (`img: ''`), se muestra el marcador "Imagen de X · por agregar".
