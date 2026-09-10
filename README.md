# RiskTech — sitio estático

Sitio corporativo de RiskTech exportado desde WordPress (tema *Hello Elementor* +
Elementor Pro). Esta versión está reorganizada como sitio estático: sin PHP, sin
base de datos y con todos los recursos servidos desde `assets/`.

## Estructura

```
.
├── index.html                  Portada (única página en la raíz)
├── pages/                      Resto de páginas (30)
│   ├── nosotros.html
│   ├── tecnologia.html
│   ├── blog.html
│   ├── category-*.html         Listados por categoría del blog
│   └── ...
└── assets/
    ├── css/
    │   ├── base/               Estilos comunes a todas las páginas
    │   ├── pages/              Overrides propios de una sola página
    │   ├── elementor/          Hojas que genera Elementor por post (post-<id>.css)
    │   ├── fonts/              Declaraciones @font-face (Poppins, Roboto, Roboto Slab)
    │   ├── vendor/             Librerías de terceros, una carpeta por paquete
    │   └── responsive.css      Ajustes responsive propios (se carga el último)
    ├── js/
    │   ├── base/               Scripts comunes a todas las páginas
    │   ├── pages/              Configuración/scripts de una sola página
    │   └── vendor/             Librerías de terceros (jQuery, Swiper, Elementor…)
    ├── fonts/                  Archivos .woff2
    └── img/                    Imágenes (por año/mes, más `thumbs/` y `vendor/`)
```

## Convenciones

- **Nada de CSS ni JS incrustado en el HTML.** Cada bloque `<style>` y `<script>`
  que venía embebido se extrajo a un archivo bajo `assets/`. Lo que aparecía en
  10 páginas o más vive en `base/`; lo que es de una sola página vive en `pages/`
  con el nombre de la página como prefijo.
- **Excepciones que sí siguen incrustadas** (deben ir en el documento):
  los `<script type="application/ld+json">` de Yoast (datos estructurados / SEO),
  los `<script type="speculationrules">` y el `<style>` dentro de `<noscript>`.
- **Rutas relativas.** `index.html` referencia `assets/…`; las páginas de
  `pages/` referencian `../assets/…`. El sitio funciona igual en la raíz de un
  dominio o dentro de un subdirectorio.
- **`vendor/` no se edita.** Son librerías de terceros; cualquier ajuste va en
  `assets/css/responsive.css` o en un archivo de `assets/css/pages/`.
- **`assets/css/responsive.css` se carga al final** de cada `<head>`, por lo que
  gana en especificidad frente a Elementor sin tener que abusar de `!important`.

## Ejecutar en local

```bash
python -m http.server 8123
```

Y abrir <http://localhost:8123>. También hay una configuración lista en
`.claude/launch.json`.

> Conviene usar un servidor HTTP en vez de abrir el archivo con `file://`:
> algunos scripts y el `srcset` de las imágenes no se comportan igual bajo `file://`.

## Publicar

Basta con subir el contenido del repositorio tal cual a cualquier hosting
estático (Netlify, Vercel, GitHub Pages, S3, Nginx…). No hace falta build.

## Notas

- Los archivos `assets/js/pages/*-elementor-frontend-js-before.js` son la
  configuración que Elementor genera para cada página. Se cargan **antes** de
  `assets/js/vendor/elementor/frontend.min.js`; no cambies ese orden.
- Algunos scripts de terceros (Brevo, WonderPush, GTranslate, Google Tag Manager)
  siguen apuntando al dominio de producción `risktech.com.co`. En local no
  responden, y eso es esperado.
