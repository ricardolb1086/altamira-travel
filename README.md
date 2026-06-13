# Handoff: Altamira Travel — Rediseño del sitio (landing)

## Overview
Rediseño completo de la página principal de **altamiratravel.com**: una agencia de viajes
premium. Dirección visual editorial cálida (crema + terracota), con un hero de video en
bucle por destino, secciones de destinos / experiencias / valores / testimonios / diario /
CTA / footer, **selector de idioma EN/ES** y un **panel de administración de destinos**.

El objetivo de este paquete es que un desarrollador (usando Claude Code) lo lleve a
**producción**: repositorio en Git, despliegue automático, **videos autoalojados** y un
**CMS** real para administrar los destinos.

## About the Design Files
A diferencia de un handoff típico, estos archivos **NO son solo una maqueta de referencia**:
son un **sitio estático funcional y terminado** (HTML + CSS + JS vanilla, sin framework ni
build step). Se puede desplegar tal cual. El trabajo de Claude Code es **productizarlo**, no
reconstruirlo. Si el desarrollador prefiere migrarlo a un framework (Next.js/Astro/Eleventy),
es opcional; para un sitio de marketing de este tamaño, **Astro o Eleventy** (o incluso HTML
plano + un CMS headless) son la opción más sencilla y mantenible. Evitar React/SPA salvo que
haya un motivo claro.

## Fidelity
**Alta fidelidad (hi-fi).** Colores, tipografía, espaciado e interacciones son finales y
deben conservarse pixel a pixel. Las únicas piezas "provisionales" son:
- Los **videos del hero** (enlazados a la CDN de Pexels — hay que autoalojarlos).
- El **contenido de los destinos** (hoy viven en `localStorage`; falta CMS).
- Textos de relleno editorial (testimonios, diario) que el cliente puede ajustar.

## Files (en este paquete)
- `index.html` — el sitio (copia de "Altamira Travel.html"). Es la home completa, autónoma.
- `admin.html` — panel para administrar destinos (copia de "Altamira Travel Admin.html").
- `README.md` — este documento.

> Todo el CSS y JS está **inline** dentro de cada HTML (no hay archivos externos del proyecto).
> Las únicas dependencias externas son Google Fonts y los MP4/imágenes de Pexels (ver abajo).

---

## Arquitectura del sitio (`index.html`)

Una sola página, secciones en este orden:
1. **Nav** (fixed): logo, links de ancla, teléfono `1-888-855-1889` (`tel:`), botón "Plan your
   journey", **toggle de idioma EN/ES**.
2. **Hero**: carrusel de **videos a pantalla completa con crossfade**, 1 por destino, con
   chip de ubicación, puntos de navegación y CTA.
3. **Stats strip**: 15+ / 80+ / 4.9★ / 24-7.
4. **Destinations** ("Nuestros Destinos"): grid de tarjetas **generadas desde datos**.
5. **Experiences** ("How we travel"): split imagen + lista numerada.
6. **Values** ("Why Altamira"): banda oscura con 3 columnas.
7. **Testimonials**: rotador de citas (bilingüe).
8. **Journal**: 3 tarjetas de artículo.
9. **CTA** ("Let's design your next trip").
10. **Footer**: marca, columnas, redes (Facebook/Instagram/TikTok reales), legal.
11. **WhatsApp** flotante (`wa.me/16507650627`).

### 1) Hero — carrusel de video (lo más importante a productizar)
- Definido en JS por el arreglo **`HERO_SLIDES`** (busca ese identificador en `index.html`).
- Cada entrada: `{ city, region, src, poster }`. El carrusel hace crossfade cada 6.5 s,
  reproduce solo el video activo (pausa los demás), actualiza el chip de ubicación y los puntos.
- Cada `<video>` es `muted loop playsinline` + un `<source>` de respaldo.
- **Videos actuales (Pexels, hay que AUTOALOJAR):**
  | Destino | Pexels ID | Notas |
  |---|---|---|
  | Capadocia | 30549329 | vertical |
  | Dubái | 1660911 | landscape ✓ |
  | Shibuya (cruce, gente en movimiento) | 14952031 | 4K 60fps — el sitio pide 1080p primero; TRANSCODIFICAR a 1080p/30fps al autoalojar |
  | Machu Picchu | 4361882 | landscape ✓ |
  | Fallback | 1739010 | costa (respaldo) |
- **Tarea de producción:** descargar cada MP4 (licencia Pexels permite uso comercial),
  **recodificar a H.264, 1920×1080, ~24-30 fps, sin audio, 8-15 s, < 5 MB** (un clip 4K/60fps
  pesado NO autoreproduce y se ve congelado — fue el problema con Shibuya). Alojar en `/videos/`
  y reemplazar cada `src` por la ruta local. Recomendado además generar un `poster` .jpg propio.
  Considerar `<source>` en `.webm` + `.mp4` y `preload="metadata"`.
- Santorini quedó **fuera** del carrusel (no había clip gratuito de Oía con cúpulas azules).
  Para reactivarlo, agregar una entrada a `HERO_SLIDES` con un clip de Oía.

### 2) Internacionalización (EN / ES)
- Sistema propio al final de `index.html` (IIFE i18n). Idioma por defecto: **`es`**.
- Persistencia en `localStorage['altamira_lang']` (`'en'` | `'es'`).
- El arreglo **`M`** mapea `[selector, índice|null, esHTML(0/1), textoEN, textoES]`.
  Los testimonios usan el objeto **`QUOTES`** (en/es) y los destinos un diccionario **`DEST`**.
- **Para añadir/editar traducciones:** edita esos arreglos. Si se migra a un framework, conviene
  reemplazar este sistema por el i18n nativo del framework (p. ej. `astro-i18n`, `next-intl`) y
  exponer `/` (es) y `/en/`.

### 3) Destinos administrables (`admin.html`) — requiere CMS para producción
- Hoy: `admin.html` lee/escribe `localStorage['altamira_destinations_v1']` (un arreglo JSON de
  destinos). `index.html` lo lee al cargar (`loadDestinations()` / `renderDestinations()`) y, si
  no existe, usa `DEFAULT_DESTINATIONS`.
- **Limitación:** `localStorage` es **por navegador/dispositivo**, NO se comparte con los
  visitantes. Sirve para previsualizar, no para publicar.
- **Tarea de producción — elegir UNA vía:**
  1. **Decap CMS** (gratis, sin servidor): guarda el JSON en el propio repo (Git). Encaja perfecto
     con un sitio estático + Netlify/GitHub. El cliente edita en `/admin/` y se redeploya.
  2. **CMS headless** (Sanity / Contentful / Storyblok): el sitio hace `fetch` de los destinos
     desde la API del CMS en build o en runtime. Mejor para no-técnicos.
  3. **JSON en el repo** (`destinations.json`): el sitio hace `fetch('/destinations.json')`;
     edición vía PR. Lo más simple si el cliente no edita seguido.
  - Esquema de cada destino: `{ region, name, meta, pill, size('tall'|'wide'|'third'), photo(url), photoLabel }`.

---

## Design Tokens

**Colores (OKLCH, definidos en `:root`):**
- `--cream: oklch(0.972 0.012 78)` — fondo principal
- `--cream-2: oklch(0.945 0.016 76)`
- `--paper: oklch(0.99 0.006 80)` — superficies claras / texto sobre oscuro
- `--ink: oklch(0.245 0.014 58)` — texto principal
- `--ink-soft: oklch(0.42 0.02 60)` — texto secundario
- `--line: oklch(0.86 0.014 76)` — bordes/hairlines
- `--terra: oklch(0.575 0.115 46)` — acento terracota
- `--terra-deep: oklch(0.48 0.11 42)` — acento terracota oscuro (hover, énfasis)

**Tipografía (Google Fonts):**
- Display/títulos: **Cormorant Garamond** (500/600, e itálica para énfasis)
- Cuerpo/UI: **Hanken Grotesk** (400/500/600/700)
- Etiquetas/overlines/mono: **IBM Plex Mono** (uppercase, letter-spacing .16–.26em)
- Escala títulos: `clamp()` — hero ~clamp(44–92px); h2 ~clamp(34–60px); lead ~17–20px.

**Otros:** radios suaves (6–14px), botones tipo "pill" (border-radius 100px), sombras muy
sutiles, transiciones cubic-bezier(.2,.7,.3,1). Ancho máximo de contenido `--maxw: 1280px`,
padding lateral `--pad: clamp(20px, 5vw, 64px)`.

## Interacciones & comportamiento
- Nav: se vuelve sólida con `scroll > 40px`; texto claro sobre el hero, oscuro al fijarse.
- Reveal on scroll (IntersectionObserver, clase `.rv` → `.in`).
- Hero: crossfade automático + clic en puntos; respeta `prefers-reduced-motion`.
- Tarjetas de destino y viaje: hover con zoom de imagen y elevación.
- Testimonios: rotación cada 6.5 s + puntos.
- Toggle EN/ES: traduce in-place y persiste.

## Assets
- **Videos**: Pexels (IDs en la tabla del hero). Licencia Pexels (uso comercial, sin atribución).
- **Imágenes de destinos/experiencias/journal**: hoy son **placeholders** (rayado diagonal con
  etiqueta) o el campo `photo` (URL) en los datos. Sustituir por fotografía real del cliente.
- **Fuentes**: Google Fonts (Cormorant Garamond, Hanken Grotesk, IBM Plex Mono).
- **Iconos**: SVG inline (redes sociales, WhatsApp).
- **Logo**: marca tipográfica "ALTAMIRA" + punto terracota (no hay logotipo en archivo; si el
  cliente tiene SVG, reemplazar `.brand`).

## Deploy (resumen recomendado)
1. Repo en GitHub con `index.html` (raíz), `admin.html`, y `/videos/`, `/img/` para assets propios.
2. Conectar a **Netlify / Vercel / Cloudflare Pages** (deploy automático en cada push). HTTPS incluido.
3. Apuntar el dominio **altamiratravel.com** (DNS) al proveedor elegido.
4. Si se usa Decap CMS, habilitar Identity/Git Gateway (Netlify) para que el cliente edite destinos.

## Production checklist / TODO
- [ ] Autoalojar y optimizar los 4 videos del hero (H.264 1080p, sin audio, < 5 MB) + posters propios.
- [ ] Reemplazar imágenes placeholder por fotografía real (destinos, experiencias, journal).
- [ ] Conectar CMS para destinos (Decap / headless) — quitar dependencia de `localStorage`.
- [ ] Revisar/ajustar copys de testimonios y artículos del diario (hoy de ejemplo).
- [ ] `<title>`, meta description, Open Graph/Twitter cards, favicon, `sitemap.xml`, `robots.txt`.
- [ ] Analítica (GA4 / Plausible) y, si aplica, consentimiento de cookies.
- [ ] Formulario de contacto real si se quiere (hoy el CTA va a WhatsApp `wa.me/16507650627`).
- [ ] Accesibilidad: revisar foco/teclado en el toggle de idioma y el carrusel; `alt` en imágenes reales.
- [ ] (Opcional) Reactivar Santorini en `HERO_SLIDES` con un clip de Oía.
