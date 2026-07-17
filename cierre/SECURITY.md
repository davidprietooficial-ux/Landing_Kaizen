# Seguridad de claves — Kaizen Cierre

## Regla de oro
**Este proyecto es un frontend estático (Vite + React).** Todo lo que se compila
en el frontend queda **visible en el navegador** (cualquiera puede abrir DevTools
y leerlo). Por eso:

- ✅ En el frontend (`VITE_*`) solo van **valores públicos**: URLs, ids no secretos.
- ❌ **Ninguna clave/secreto** (Adobe Sign, Google Sheets, correo) puede ir en el
  frontend. Si lleva prefijo `VITE_`, **se filtra**.

## Arquitectura segura para la Etapa 4D (envío real)

```
  Navegador (React)                 Backend (serverless / VPS)         Terceros
  ─────────────────                 ──────────────────────────         ────────
  Cotización + correo   ──POST──▶   Función de cierre                  Adobe Sign
  (VITE_API_BASE_URL)               · lee secretos de su ENTORNO  ──▶  Google Sheets
                                    · firma / llena / envía            Correo (SMTP/API)
```

El navegador **nunca** ve las claves. Solo llama a TU backend; el backend es quien
guarda los secretos (en variables de entorno del VPS o de Vercel) y habla con los
terceros. La cotización al cliente (capa A) y el presupuesto interno (capa B) ya
están separados en la UI; el backend respeta esa misma separación.

## Estado actual de la auditoría (jun 2026)
- **0 secretos hardcodeados** en el código.
- **No es repo git** todavía → no hay historial que limpiar.
- `empresa.config.ts` (NIT, cuenta, correos) **no son secretos**: se le muestran al
  cliente en el correo. Pueden vivir en el frontend sin problema.
- Aún no hay llamadas a APIs externas → no hay clave expuesta en el navegador hoy.

## Lo que TÚ debes hacer manualmente
1. **Revocar** cualquier clave que hayas pegado alguna vez en un chat, captura o
   correo (esas se consideran comprometidas). Genera nuevas.
2. Pegar las claves reales en `.env` (local) — **nunca** en el código ni en `VITE_*`.
3. En el **VPS / Vercel**: cargar esas mismas variables en el panel de "Environment
   Variables" del servidor. No subir el `.env` al servidor por git.
4. Si algún día corres `git init`: confirma que `.env` aparece como *ignored*
   (`git status` no debe listarlo) **antes** del primer commit.
5. Si inicializas git en la carpeta PADRE (no en `kaizen-cierre/`), recuerda ignorar
   también los archivos de negocio sensibles que viven ahí (`.xlsx`, `.csv`, `.md`
   de contexto y costeo).
