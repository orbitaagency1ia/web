# Orbita Site (Local)

## Estructura

- `index.html`: contenido, copy, SEO meta tags y schema.
- `styles.css`: diseño visual de la home + responsive.
- `script.js`: animaciones de entrada, menú móvil y envío del formulario.
- `autoescuelas.html`: landing sectorial para autoescuelas.
- `autoescuelas.css`: diseño/animaciones de la landing de autoescuelas.
- `autoescuelas.js`: interacciones, starfield y formulario de autoescuelas.
- `avatares.html`: landing de servicio de avatares IA con planes.
- `avatares.css`: estilos de la página de avatares y tabla de planes.
- `avatares.js`: interacciones de planes y modos de uso de avatares.
- `sector.css`: estilos compartidos para landings sectoriales.
- `sector.js`: interacciones y formulario compartido para landings sectoriales.
- `hoteles.html`, `restaurantes.html`, `clinicas-dentales.html`, `centros-esteticos.html`, `inmobiliarias.html`, `concesionarios.html`, `talleres.html`: landings de sectores.
- `assets/orbita-symbol-white.svg`: isotipo oficial de Órbita (header, footer y avatar del bot).
- `assets/orbita-favicon.svg`: favicon oficial (fondo negro + isotipo blanco).
- `assets/generated/`: visuales SVG generados localmente (sin stock comercial).
- `scripts/generate-visuals.sh`: regenera todos los visuales de `assets/generated`.
- `vercel.json`: configuración de deploy (URL limpias + headers + cache assets).
- `robots.txt`: directivas SEO para rastreo.
- `sitemap.xml`: URLs indexables principales.
- `google-sheets-apps-script.gs`: webhook para guardar leads en Google Sheets.

## Abrir en local

Opción simple:

1. Abre directamente `index.html` en tu navegador.

Opción servidor local (en tu máquina):

1. Ve a la carpeta `orbita-site`.
2. Ejecuta:

```bash
python3 -m http.server 8080
```

3. Abre `http://localhost:8080`.

## Editar tú personalmente

Edición rápida recomendada:

1. Abre la carpeta en tu editor:

```bash
cd "/Users/ruben/Documents/New project/orbita-site"
```

2. Cambia contenido en:
- `index.html`: home (hero, secciones, SEO).
- `autoescuelas.html` y resto de `*.html`: landings por sector.
- `chatbot.js`: configuración visual/funcional de Botpress.

3. Cambia diseño/movimiento en:
- `styles.css`: home + animaciones globales.
- `sector.css`: estilo común de sectores.
- `autoescuelas.css`: estilo específico autoescuelas.
- `script.js`, `sector.js`, `autoescuelas.js`, `avatares.js`: interacciones.

4. Si quieres rehacer visuales generados en lote:

```bash
./scripts/generate-visuals.sh
```

Páginas:

- Home: `http://localhost:8080/index.html`
- Landing autoescuelas: `http://localhost:8080/autoescuelas.html`
- Landing avatares: `http://localhost:8080/avatares.html`
- Sectores: `hoteles.html`, `restaurantes.html`, `clinicas-dentales.html`, `centros-esteticos.html`, `inmobiliarias.html`, `concesionarios.html`, `talleres.html`

### Test A/B en autoescuelas

- Forzar versión A:
  - `http://localhost:8080/autoescuelas.html?ab=a`
- Forzar versión B:
  - `http://localhost:8080/autoescuelas.html?ab=b`

La variante se guarda en `localStorage` con clave `orbita_ab_autoescuelas`.
Eventos de CTA y leads se guardan en `localStorage` con clave `orbita_events`.

## Publicación a dominio

1. Sube esta carpeta a Vercel, Netlify o tu servidor.
2. Configura el dominio `orbitaagency.com`.
3. Añade DNS en tu proveedor:
   - `A` o `ALIAS` al hosting principal.
   - `CNAME` para `www` si aplica.
4. Verifica SSL activo.
5. Mantén `canonical` y `og:url` apuntando al dominio final.

### Ruta recomendada: Vercel (rápida)

1. Crea un repo en GitHub con el contenido de `orbita-site`.
2. Entra en Vercel y pulsa **Add New Project**.
3. Importa el repo.
4. Ajustes sugeridos:
   - Framework Preset: `Other`
   - Root Directory: `/`
   - Build Command: vacío
   - Output Directory: vacío
5. Deploy.
6. En **Project Settings > Domains**, añade:
   - `orbitaagency.com`
   - `www.orbitaagency.com`

### DNS recomendado para `orbitaagency.com`

Si mantienes DNS en tu proveedor actual:

- Registro `A`:
  - Host: `@`
  - Value: usa el `A record` recomendado que te muestra Vercel en **Project > Settings > Domains**
- Registro `CNAME`:
  - Host: `www`
  - Value: usa el `CNAME` recomendado que te muestra Vercel para `www`

Vercel gestiona SSL automáticamente tras la propagación.

## Calendly embebido

- Ya está embebido en `index.html` con:
  - `https://calendly.com/orbita-agency/30min`
  - script oficial de Calendly.
- También está embebido en `autoescuelas.html`.

## Formulario y Google Sheets

El formulario siempre guarda backup en `localStorage` y puede enviar a Google Sheets por webhook (Apps Script).

1. Crea un proyecto en Google Apps Script y pega el contenido de `google-sheets-apps-script.gs`.
2. Despliega como **Web app** con acceso "Anyone with the link".
3. Copia la URL del deployment (termina en `/exec`).
4. En `index.html` y `autoescuelas.html`, define:

```html
<script>
  window.ORBITA_LEAD_CONFIG = {
    spreadsheetId: "1y8YOQaBlJkbnomZSTL2Ioi8Vo3pytLw63MivpFOiF9Y",
    webhookUrl: "https://script.google.com/macros/s/XXXX/exec",
    formsubmitEmail: "contacto@orbitaagency.com",
    formsubmitEnabled: true
  };
</script>
```

5. Recarga la página.

Si no configuras webhook:

- El sistema intenta envío por FormSubmit al email configurado.
- Si falla, abre `mailto:` como fallback.
- El lead siempre queda guardado en `localStorage` para no perder datos.

### ¿A dónde van los correos?

El destino lo define `window.ORBITA_LEAD_CONFIG.formsubmitEmail` en cada página.

Ejemplo actual:

- Destino: `contacto@orbitaagency.com`

Orden real de entrega:

1. `webhookUrl` (si existe) para guardar en Google Sheets.
2. FormSubmit (`formsubmitEmail`) para envío por email.
3. `mailto:` al mismo email como respaldo final.

### Notificación por email desde Apps Script

`google-sheets-apps-script.gs` ya incluye envío de aviso por correo con `MailApp`:

- Variable: `NOTIFY_EMAILS`
- Valor por defecto: `["contacto@orbitaagency.com"]`

Si quieres varios destinatarios, añade más emails en ese array.
