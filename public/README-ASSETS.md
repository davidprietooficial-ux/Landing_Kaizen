# Assets de Kaizen Studios

Sube aquí los archivos reales. Mientras falten, la web muestra placeholders elegantes
(nada se rompe). Cuando subas un asset, activa su flag en `src/lib/config.ts`.

```
video/
  showreel-loop.mp4   showreel-loop.webm   showreel-poster.jpg   (hero, 10–15 s, muted)
  showreel-full.mp4                                              (30–45 s, opcional)
img/
  david-retrato.jpg        (busto, cara visible)
  david-ambiental.jpg      (David con cámara / set)
  david-editorial.jpg      (misión / visión)
  bts-1.jpg … bts-3.jpg    (detrás de cámaras, opcional)
  og-image.jpg             (1200×630, reemplaza el og-image.svg placeholder)
logo/
  kaizen-iso.svg           ✓ placeholder incluido (la "K")
  kaizen-horizontal.svg    ✓ placeholder incluido (wordmark)
  favicon.ico / icon.png
logos-clientes/
  cliente-1.svg …          (SOLO clientes reales, con permiso)
sequence/
  frame-0001.jpg … frame-0120.jpg   (objeto girando para el scroll 3D)
```

## Flags en `src/lib/config.ts`
- `assets.hasShowreel`  → muestra el `<video>` del hero en vez del gradiente.
- `assets.hasSequence`  → usa los frames reales en el canvas en vez de la apertura procedural.
- `assets.hasDavidPhoto`→ muestra las fotos reales de David en vez del marco placeholder.
- `clients`             → array de logos reales (vacío = oculta el marquee).
- `metrics`             → pon los números reales (null = muestra "—" con etiqueta "por confirmar").
