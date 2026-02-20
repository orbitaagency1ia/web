# Estructura del proyecto

## Producción web (raíz)
Estos archivos son los que usa la web en despliegue:

- `index.html`
- `precios.html`
- `aviso-legal.html`
- `politica-privacidad.html`
- `politica-cookies.html`
- `autoescuelas.html`, `avatares.html`, `hoteles.html`, `restaurantes.html`, `clinicas-dentales.html`, `centros-esteticos.html`, `inmobiliarias.html`, `concesionarios.html`, `talleres.html`
- `styles.css`, `sector.css`, `autoescuelas.css`
- `script.js`, `sector.js`, `autoescuelas.js`, `chatbot.js`
- `assets/`
- `robots.txt`, `sitemap.xml`, `vercel.json`

## Trabajo interno (_work)
Todo lo de scraping, datasets, pruebas y dependencias queda fuera de producción:

- `_work/scripts/python/` -> scripts Python
- `_work/scripts/node/` -> scripts Node/JS de scraping
- `_work/scraping-node/` -> `package.json`, `package-lock.json`, `node_modules`
- `_work/data/autoescuelas/` -> CSVs de autoescuelas
- `_work/data/leads/out/` -> exportaciones de leads
- `_work/research/` -> HTML descargados, benchmarks, informes
- `_work/archive/` -> caches y residuos antiguos

## Recomendación
Para editar la web, trabaja siempre sobre los archivos de la raíz (HTML/CSS/JS) y `assets/`.
