# Activar el envío real (correo + Google Sheets)

El código ya está listo. Solo faltan **unas credenciales** que están dentro de TUS
cuentas de Google/Gmail (no las puedo generar yo por ti). Sigue estos pasos: son
"copia esto → pega allá". Al final corres **un comando que te dice si quedó bien**.

> En cualquier momento, para saber qué falta:
>
> ```
> npm run check-setup
> ```
>
> Te dirá ✅ o ❌ en cada parte, en español.

---

## Paso 1 · Correo (Gmail) — ~5 minutos

Los correos salen desde **kaisenpoststudio@gmail.com**. Gmail no deja que una app
use tu contraseña normal; hay que crear una "**Contraseña de aplicación**" (App
Password). Es gratis y segura (puedes borrarla cuando quieras).

1. Inicia sesión en **kaisenpoststudio@gmail.com**.
2. Activa la **Verificación en 2 pasos** (si no la tienes):
   👉 https://myaccount.google.com/signinoptions/twosv
3. Crea la contraseña de aplicación:
   👉 https://myaccount.google.com/apppasswords
   - En "Nombre de la app" escribe: `Kaizen Cierre`
   - Pulsa **Crear**. Te muestra **16 letras** (algo como `abcd efgh ijkl mnop`).
4. Copia esas 16 letras **sin espacios** y pégalas en el archivo `.env`, aquí:
   ```
   SMTP_PASSWORD=pega-aqui-tus-16-letras
   ```
   (Lo demás —host, puerto, usuario— ya está prellenado.)
5. Verifica:
   ```
   npm run check-setup
   ```
   Debe aparecer: `📧 Correo (SMTP) … ✅ OK`.

---

## Paso 2 · Google Sheets — ~10 minutos

La cuenta de servicio (la "robot" que crea las hojas) ya existe:
`claude-app-interna-kaizen@inlaid-reactor-499206-d1.iam.gserviceaccount.com`
(proyecto **inlaid-reactor-499206-d1**). Faltan 4 cosas:

### 2.1 · La llave privada (lo más importante)

La que está hoy en `.env` es un placeholder inválido. Necesitas la **llave real**:

1. Entra a Google Cloud Console → **Cuentas de servicio**:
   👉 https://console.cloud.google.com/iam-admin/serviceaccounts?project=inlaid-reactor-499206-d1
2. Clic en la cuenta `claude-app-interna-kaizen@...`
3. Pestaña **Claves (Keys)** → **Agregar clave** → **Crear clave nueva** → tipo **JSON** → **Crear**.
   Se descarga un archivo `.json`.
4. Abre ese `.json`. Busca la línea `"private_key": "-----BEGIN PRIVATE KEY-----\n....."`.
5. Copia **todo el valor entre comillas** (empieza en `-----BEGIN` y termina en
   `END PRIVATE KEY-----\n`, con los `\n` tal cual) y pégalo en `.env`, en **una sola línea**:
   ```
   GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nPEGA-AQUI-TU-LLAVE-COMPLETA\n-----END PRIVATE KEY-----\n
   ```
   > Pega los `\n` literales tal como vienen en el JSON; el programa los entiende.

### 2.2 · El ID de la plantilla

El que está hoy también es incorrecto.

1. Abre tu **hoja plantilla de costeo** en Google Sheets.
2. Mira la URL: `https://docs.google.com/spreadsheets/d/`**`ESTE_PEDAZO`**`/edit`
3. Copia ese pedazo (≈44 caracteres) y pégalo en `.env`:
   ```
   GOOGLE_SHEETS_TEMPLATE_ID=pega-aqui-el-id-de-la-hoja
   ```

### 2.3 · Compartir la plantilla con la cuenta robot

1. En la plantilla, botón **Compartir**.
2. Pega el correo de la cuenta de servicio:
   `claude-app-interna-kaizen@inlaid-reactor-499206-d1.iam.gserviceaccount.com`
3. Dale permiso de **Editor** → **Enviar**.

### 2.4 · Encender las dos APIs

Una vez cada una (haz clic y pulsa "Habilitar"):

- Google **Sheets** API 👉 https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=inlaid-reactor-499206-d1
- Google **Drive** API 👉 https://console.cloud.google.com/apis/library/drive.googleapis.com?project=inlaid-reactor-499206-d1

### 2.5 · Verifica

```
npm run check-setup
```

Debe aparecer: `📊 Google Sheets … ✅ OK — plantilla "..." accesible`.

---

## Probar el cierre de verdad

1. Arranca la app como siempre (doble clic en `iniciar-kaizen.command`, o `npm run dev`).
2. Arma una cotización, escribe **tu propio correo** como cliente de prueba.
3. **Cerrar y enviar cotización → Sí, enviar**.
4. Verás un resumen: ✅ correos enviados + enlace a la hoja creada.
   - Revisa tu bandeja (cliente) y la de David (presupuesto interno).
5. Si algo falla, el mensaje te dice qué, y abajo sigue disponible el **envío manual**
   (mailto / WhatsApp) como respaldo.

---

## Si algo sale ❌ (errores comunes)

| Mensaje                           | Qué significa                               | Arreglo                                                  |
| --------------------------------- | ------------------------------------------- | -------------------------------------------------------- |
| `Faltan variables: SMTP_PASSWORD` | No pegaste la contraseña de app             | Paso 1.4                                                 |
| `Invalid login` / `535` (correo)  | App Password mal copiada                    | Re-genera y pega sin espacios (Paso 1)                   |
| `PRIVATE_KEY no parece válida`    | Sigue el placeholder                        | Paso 2.1                                                 |
| `TEMPLATE_ID no parece un ID`     | ID incorrecto                               | Paso 2.2                                                 |
| `File not found` (Sheets)         | Plantilla no compartida o ID malo           | Pasos 2.2 y 2.3                                          |
| `has not been used / disabled`    | Falta encender una API                      | Paso 2.4                                                 |
| `storage quota` al crear la hoja  | Límite de la cuenta robot en Gmail personal | Avísame: lo resolvemos con una carpeta/Unidad compartida |

¿Te atascas en cualquier paso? Dímelo y te guío en ese punto exacto.
