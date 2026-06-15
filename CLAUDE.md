# CLAUDE.md — Altamira Travel

> **Para Claude en una nueva sesión:** Lee este archivo completo antes de trabajar. Contiene todo el contexto técnico Y estratégico del proyecto. El archivo hermano `CONTEXTO-ALTAMIRA.md` tiene el mismo contenido en otro formato — con CLAUDE.md es suficiente.

---

## 1. DESCRIPCIÓN DEL PROYECTO

**Qué es:** Sitio web de **Altamira Travel**, una agencia de viajes grupales basada en EE.UU. (mercado hispano). Es un sitio estático bilingüe (ES/EN) ya **en producción** en `altamiratravel.com`.

**Empresa:** Altamira Group LLC (constituida en Wyoming). Dueño: Ricardo Lazo.
Tres marcas bajo el grupo:
- **Altamira Travel** — viajes grupales + salidas regulares (ACTIVA, es el sitio que construimos)
- **Altamira Collection** — ultra luxury estilo Virtuoso (por crear; dominio `altamiracollection.com` comprado)
- **Altamira DMC** — B2B, vende programas a otras agencias en USA (por crear; dominio `altamiradmc.com` comprado)

**Propósito del sitio:** Captar viajeros hispanos en EE.UU., mostrar circuitos (propios y de operadores), capturar leads (email + WhatsApp), y servir de credibilidad para reactivar cartera de clientes antiguos.

**Stack tecnológico:**
- HTML/CSS/JS **estático puro** — sin framework, sin build step
- Tipografías: Cormorant Garamond (serif), Hanken Grotesk (sans), IBM Plex Mono (mono)
- Paleta: crema `oklch(0.972 0.012 78)`, terracota `#C47646` / `var(--terra)`, tinta oscura. Variables CSS en `:root`
- CMS: **Sveltia CMS** (`/admin/`) con backend GitHub + OAuth
- Hosting: **Netlify Pro** (deploy automático en cada push a `main`)
- Formularios: **Formspree** (id `xzdqydwl`)
- Mapas: ilustraciones PNG generadas en ChatGPT (NO Leaflet — se descartó por no verse premium)
- i18n: sistema propio JS con toggle EN/ES (array `M` de traducciones + diccionario `_DEST_TR` para destinos)

---

## 2. ESTRUCTURA DEL PROYECTO

```
design_handoff_altamira_travel/
├── index.html                      # Home (hero videos, destinos, circuitos, Europa Esencial, footer)
├── contacto.html                   # Formulario Formspree + tarjeta WhatsApp
├── nosotros.html                   # Quiénes somos + Misión + Visión
├── terminos.html                   # T&C en español
├── terms.html                      # T&C en inglés
├── destinations.json               # Datos de las 5 cards de "Nuestros Destinos" (editable por CMS)
├── netlify.toml                    # Config Netlify (headers, cache, no-cache para destinations.json)
├── robots.txt / sitemap.xml        # SEO básico
├── CLAUDE.md                       # ESTE archivo
├── CONTEXTO-ALTAMIRA.md            # Mismo contexto, formato alternativo
├── README.md                       # Readme original del handoff
├── admin/
│   ├── index.html                  # Carga Sveltia CMS
│   └── config.yml                  # Config CMS (backend github, colección destinations)
├── programas/
│   ├── egipto-faraonico.html       # COMPLETA: itinerario, mapa ilustrado, precios, no-incluye
│   └── la-ruta-de-los-sultanes.html# Turquía — FALTA precio + mapa ilustrado
├── itinerarios/                    # Markdown de referencia (no se publican, son notas)
│   ├── egipto-crucero-nilo.md
│   └── turquia-estambul-capadocia.md
├── img/
│   ├── egypt-route-map.png         # Mapa ilustrado Egipto (2.2M)
│   └── petra-experience.jpg        # Foto Ricardo en Petra, sección "Cómo viajamos" (221K)
└── videos/                         # MP4 H.264 1080p sin audio (<5MB c/u) + posters JPG
    ├── cappadocia.mp4 / -poster.jpg   (hero home)
    ├── dubai.mp4 / -poster.jpg        (hero home)
    ├── shibuya.mp4 / -poster.jpg      (hero home)
    ├── machu-picchu.mp4 / -poster.jpg (hero home)
    └── egypt.mp4 / -poster.jpg        (se probó en hero Egipto pero se descartó por foto estática)
```

Los `videos/*_raw.mp4` están en `.gitignore` (originales pesados, no se suben).

---

## 3. ESTADO ACTUAL (lo construido)

✅ **Home (`index.html`)** completo:
- Hero con carrusel de 4 videos (Capadocia, Dubái, Shibuya, Machu Picchu) con crossfade y autoplay
- Sección "Nuestros Destinos" — 5 cards desde `destinations.json` vía `fetch` (Santorini, Kioto, Egipto Faraónico→link, La Ruta de los Sultanes→link, Positano). Egipto y Turquía son clicables a sus páginas.
- Sección "Cómo viajamos" con foto de Petra
- 14 **Altamira Originals** (grid de circuitos)
- 6 circuitos **Europa Esencial**
- Email capture (Formspree)
- Footer: badges ASTA/IATA/USTOA/CLIA + SOT FL/CA (placeholders `#[PENDING]`) + banda Altamira Group (3 marcas)
- Toggle EN/ES funcional en todo el sitio

✅ **Página Egipto Faraónico** — la más completa: hero foto pirámides, stats strip, itinerario día a día con accordion, **mapa ilustrado**, sidebar con precios (3 temporadas + 5★ consultar), incluye/no-incluye con nota de pagos al confirmar, CTA WhatsApp.

✅ **Página La Ruta de los Sultanes (Turquía)** — itinerario 10 días completo, MISMO diseño que Egipto, PERO sin precio ni mapa todavía.

✅ **Nosotros, Términos ES/EN, Contacto** — todas completas.

✅ **CMS Sveltia** funcionando en `/admin/` (OAuth GitHub vía worker Cloudflare).

✅ **Infraestructura:** dominio con DNS A-record a Netlify, HTTPS activo, email `hola@altamiratravel.com` (Namecheap Private Email en Mac Mail).

✅ **Redes:** Instagram/TikTok/Facebook `@altamiratravelusa` con logo. Buffer conectado a las 3. Primer post (Kobe noche) programado lunes 9am Miami.

---

## 4. LO QUE ESTÁBAMOS HACIENDO (justo antes de cortar)

Acabábamos de **subir la foto de Petra** (`img/petra-experience.jpg`) a la sección "Cómo viajamos" del home — YA ESTÁ HECHO y commiteado.

El **siguiente paso inmediato** era continuar con detalles de la página. Los pendientes activos más cercanos:
1. **Precio de Turquía** (Ricardo lo traería) → agregar a `programas/la-ruta-de-los-sultanes.html` con la misma estructura de sidebar que Egipto
2. **Mapa ilustrado de Turquía** (Ricardo lo genera en ChatGPT con el mismo estilo del de Egipto) → integrar en `/img/` y reemplazar cualquier placeholder

---

## 5. DECISIONES IMPORTANTES TOMADAS

**Arquitectura de producto — 3 NIVELES (el corazón de todo):**
- **Nivel 1 — Altamira Originals:** circuitos propios. Badge `● Altamira Original`. Cupos NO especificados (flexibilidad operativa). Copy: "Diseñados y operados por nosotros." 14 destinos.
- **Nivel 2 — Salidas Regulares:** badge `✓ Salida garantizada`, "desde 2 pasajeros, todos los meses".
- **Nivel 3 — Europa Esencial:** MasEuropa. Badge `◎ Mejor valor`. NUNCA llamarlo "barato". Framing: "La manera más inteligente de descubrir Europa por primera vez". Mismo diseño de card → la elegancia visual borra la percepción de precio bajo.

**PRINCIPIO CENTRAL — "Altamira curates, no cataloga":** los operadores (Wamos, Eurowelcome, Latitude, Larimar, Vered, Explora Traveler, Honest Group, MasEuropa) son **INVISIBLES** en el sitio. El cliente compra con Altamira, no con el operador.

**Precios:** regla = utilidad mínima **$500/pax** después del 3% de tarjeta. Se absorbe el 3% en un precio final **redondeado hacia arriba**. UN SOLO precio mostrado (sin "desde", sin desglose). Descuento por efectivo/transferencia como herramienta de cierre.
- Egipto 4★: $1,150 baja / $1,190 media-alta / $1,350 Semana Santa-Fin de año. 5★: consultar.

**Diseño:** estático sin framework a propósito (rápido, simple, sin build). Mapas ilustrados PNG en vez de Leaflet (se probó Leaflet y se descartó por no verse premium). Hero de programa con foto estática, no video (se probó video en Egipto y se descartó).

**Marca:** bilingüe ES/EN desde día 1. Tono = amigo experto, no vendedor. Ricardo sale en fotos (es un activo). Opera como "Altamira Travel" sin nombre propio público (antes operaba como "Brandon" en Travel Viajes USA — NO mencionar eso).

**Jurisdicción legal:** Florida/Miami con arbitraje JAMS (aunque la LLC es de Wyoming — es legal y Miami es mejor para el negocio).

---

## 6. PROBLEMAS RESUELTOS (no repetir)

- **i18n + fetch asíncrono:** las cards de `destinations.json` cargaban en inglés porque el `fetch` terminaba DESPUÉS del `apply()` del i18n. SOLUCIÓN: traducciones inline dentro de `renderDestinations()` con diccionario `_DEST_TR` + `window.rerenderDestinations()` llamado en cada cambio de idioma. NO depender del sistema i18n externo para las cards dinámicas.
- **Cache de Netlify en destinations.json:** Netlify cacheaba el JSON viejo. SOLUCIÓN: `fetch('/destinations.json?v='+Date.now())` + header `Cache-Control: no-cache` en `netlify.toml`.
- **Videos del hero no autoreproducían en Safari:** SOLUCIÓN: atributo `autoplay` solo en el primer `<video>` (desbloquea permiso global) + `setTimeout` recursivo en vez de `setInterval` para el carrusel + listener `canplay`.
- **Sveltia config error:** `allow_multiple` no existe en Sveltia (es de Decap) → usar `multiple`. Y `destinations.json` debe estar envuelto en objeto `{"destinations":[...]}`, no array plano.
- **Netlify sin créditos pausó deploys:** se resolvió haciendo upgrade a Netlify Pro.
- **admin.html duplicado:** había un `admin.html` viejo (localStorage) que competía con `/admin/` (Sveltia). Se eliminó el viejo.
- **Migración Decap→Sveltia:** Netlify Identity + Git Gateway están deprecados (feb 2025). Se migró a Sveltia CMS + GitHub OAuth con worker en Cloudflare.

---

## 7. PRÓXIMOS PASOS (en orden de prioridad)

1. **Precio Turquía** → sidebar en `la-ruta-de-los-sultanes.html` (estructura igual a Egipto)
2. **Mapa ilustrado Turquía** → Ricardo lo genera en ChatGPT, integrar en `/img/`
3. **WhatsApp corporativo** (Google Voice) → reemplazar `16507650627` en todo el sitio y en Buffer
4. **SEO:** meta títulos + descripciones únicos por página, Open Graph tags, schema TravelAgency, Google Business Profile, Google Search Console, mejorar sitemap.xml
5. **Reel viral:** Higgsfield (plan PLUS $49) para clips cinematográficos + ElevenLabs para voz en off + CapCut (gratis) para editar. Primer reel = presentación de marca bilingüe.
6. **Reactivar clientes antiguos** vía WhatsApp/email bajo marca Altamira (sin mencionar Brandon/Travel Viajes)
7. **SOT Florida** (requiere surety bond $25k, prima ~$300/año) + **California CST**. Ricardo los tramita.
8. **Logos reales** de ASTA/IATA/USTOA/CLIA cuando se registre (hoy son chips de texto placeholder)
9. **Más páginas de programa:** Japón, Santorini, Positano, etc. (reusar plantilla de Egipto)
10. **Testimonios reales** (reemplazar placeholders), **12 posts de backlog** a Buffer

---

## 8. COMANDOS IMPORTANTES

```bash
# Ubicación del proyecto
cd /Users/ricardolazobarrueto/Downloads/design_handoff_altamira_travel/

# Flujo de cambios (Netlify despliega solo al hacer push a main)
git add <archivos>
git commit -m "mensaje descriptivo

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main

# Ver despliegue: Netlify dashboard → Deploys (tarda ~30s)
# Verificar en producción: recargar altamiratravel.com con Cmd+Shift+R

# Optimizar imágenes antes de subir (ffmpeg en homebrew)
/opt/homebrew/bin/ffmpeg -y -i input.jpg -vf "scale=1000:-1" -q:v 4 output.jpg

# Optimizar videos para hero (H.264 1080p sin audio, <5MB)
/opt/homebrew/bin/ffmpeg -y -i raw.mp4 -vf "scale=1920:1080" -c:v libx264 -crf 26 -preset slow -an -t 12 -movflags +faststart output.mp4

# Generar poster de video (frame a los 3s)
/opt/homebrew/bin/ffmpeg -y -ss 3 -i video.mp4 -frames:v 1 -q:v 3 poster.jpg

# GitHub CLI (autenticado como ricardolb1086)
/opt/homebrew/bin/gh repo view ricardolb1086/altamira-travel

# pdftotext para leer PDFs (poppler en homebrew)
/opt/homebrew/bin/pdftotext "archivo.pdf" -
```

**Reglas de trabajo:**
- Trabajar en **Sonnet** (no Opus) para ahorrar créditos — Sonnet hace el 95% de este trabajo igual de bien
- Cada cambio se commitea y pushea (Netlify auto-deploy)
- Los mapas ilustrados los hace Ricardo en ChatGPT; Claude solo los integra
- Las fotos propias de Ricardo están en su Mac (Desktop/Downloads) — pedírselas cuando se necesiten
- No hay tests ni build — es HTML estático, los cambios se ven al recargar el sitio

---

## NOTAS DE FACTURACIÓN (contexto del usuario)
Ricardo paga por recargas de créditos (no plan mensual). Opus consume ~5x más rápido que Sonnet. Recomendación: quedarse en Sonnet, y considerar plan Max mensual si el ritmo de trabajo continúa. El límite de uso/créditos se ve en claude.ai/settings/usage.
