# Iconos 3D por etapa (sección "El sistema")

Coloca aquí los 5 renders dorados, **con estos nombres exactos**:

```
logistica.png       → Logística y preparación  (checklist + calendario + ubicación)
grabacion.png       → Grabación                (cámara de cine)
postproduccion.png  → Postproducción           (laptop con onda de audio + diales)
revision.png        → Revisión y optimización  (tira de film + lupa + check)
entrega.png         → Entrega final            (pedestal con pantallas de contenido)
```

Recomendado: **PNG/WebP cuadrado (1024×1024) con fondo transparente** para que el
halo dorado del fondo se vea detrás. Si el fondo es negro también funciona (la
sección es oscura), pero transparente queda mejor.

## Activar
Cuando estén los 5 archivos, pon en `src/lib/config.ts`:

```ts
export const ASSETS = {
  …
  hasStageArt: true,
}
```

Mientras `hasStageArt` sea `false`, la web usa el line-art SVG (no se rompe nada).
