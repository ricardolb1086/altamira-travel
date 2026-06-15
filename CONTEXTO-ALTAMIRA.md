# CONTEXTO — Proyecto Altamira Travel
*(Pegar esto al inicio de una nueva sesión de Claude para continuar)*

## Quién soy / La empresa
Soy Ricardo Lazo. Empresa: **Altamira Group LLC** (constituida en Wyoming).
Tres marcas:
- **Altamira Travel** — viajes grupales + salidas regulares (ACTIVA, es en la que trabajamos)
- **Altamira Collection** — ultra luxury, estilo Virtuoso (por crear; dominio altamiracollection.com comprado)
- **Altamira DMC** — B2B, vende a otras agencias en USA (por crear; dominio altamiradmc.com comprado)

Mercado objetivo: hispano en Estados Unidos (contenido bilingüe ES/EN).
Antes operaba como "Brandon" en Travel Viajes USA — tengo cartera de clientes antiguos a reactivar bajo Altamira Travel (NO mencionar Brandon ni Travel Viajes en comunicaciones; la marca es Altamira).

## El sitio web — EN PRODUCCIÓN
- **Dominio:** altamiratravel.com (live, HTTPS)
- **Repo GitHub:** ricardolb1086/altamira-travel
- **Carpeta local:** /Users/ricardolazobarrueto/Downloads/design_handoff_altamira_travel/
- **Hosting:** Netlify Pro ($20/mes, deploys automáticos en cada git push a main)
- **CMS:** Sveltia CMS en /admin/ con GitHub OAuth (worker Cloudflare: altamira-cms-auth.ricardolb1086.workers.dev)
- **Stack:** HTML/CSS/JS estático, sin framework. Diseño: tipografía Cormorant Garamond + Hanken Grotesk + IBM Plex Mono. Colores: crema, terracota (#C47646), tinta oscura. Toggle EN/ES funcional.
- **Email leads:** Formspree (form id: xzdqydwl) → llega a hola@altamiratravel.com (buzón Namecheap Private Email, ya configurado en Mac Mail)
- **WhatsApp temporal en el site:** wa.me/16507650627 (PENDIENTE: número corporativo real vía Google Voice)

## Páginas existentes
- `index.html` — home (hero con 4 videos, Nuestros Destinos, 14 Altamira Originals, 6 Europa Esencial, email capture, footer con badges)
- `programas/egipto-faraonico.html` — itinerario 8 días, mapa ilustrado (/img/egypt-route-map.png), precios, galería
- `programas/la-ruta-de-los-sultanes.html` — Turquía 10 días (FALTA: precio + mapa ilustrado)
- `nosotros.html` — Quiénes somos + Misión + Visión
- `terminos.html` / `terms.html` — T&C bilingüe (jurisdicción Florida/Miami, JAMS arbitraje)
- `contacto.html` — formulario + WhatsApp
- `destinations.json` — datos de las 5 tarjetas de destinos del CMS

## Estructura de producto (3 niveles)
1. **Altamira Originals** — circuitos propios, badge "● Altamira Original", lista de espera
2. **Salidas Regulares** — operadores (Wamos, Eurowelcome, Latitude, Larimar, Vered, Explora Traveler, Honest Group) — NUNCA mencionar operadores en el site. Badge "✓ Salida garantizada", desde 2 pax todo el año
3. **Europa Esencial** — MasEuropa circuitos de colores, badge "◎ Mejor valor", nombres editoriales propios

## Precios (regla: utilidad mínima $500/pax; absorber 3% tarjeta en precio final redondeado)
**Egipto Faraónico** (operador Explora Traveler, costo 4★ ~$570-640 según temporada):
- 4★ temporada baja (may-sep): $1,150
- 4★ temporada media/alta: $1,190
- Semana Santa/Fin de año: $1,350
- 5★: consultar
- No incluye: vuelos intl, visado $40, propinas $45, tasas puerto $35, seguro. Pagos no incluidos se abonan al confirmar reserva.

**Turquía (La Ruta de los Sultanes)** — operador Latitude — PRECIO PENDIENTE (Ricardo lo trae)

## Redes sociales
- Instagram/TikTok/Facebook: **@altamiratravelusa** (logo terracota con "A" + estrella ya subido)
- **Buffer** conectado a las 3 redes (plan gratis)
- Primer post programado: foto Kobe de noche, lunes 9am Miami
- Tengo ~28 fotos propias catalogadas (Japón, Dubái, Corea, Jordania/Petra, Qatar, Chile, París, Egipto, Turquía/Capadocia) para backlog de contenido
- 12 posts de backlog ya escritos (copy + descripción imagen)

## Pendientes (en orden)
1. Precio de Turquía → agregar a su página
2. Mapa ilustrado de Turquía (estilo igual al de Egipto, hecho en ChatGPT)
3. Número WhatsApp corporativo (Google Voice) → actualizar en site y Buffer
4. SEO: meta títulos/descripciones, Google Business Profile, Google Search Console
5. Reel viral: Higgsfield (plan PLUS $49) para clips + ElevenLabs para voz + CapCut (gratis) para editar
6. Reactivar clientes antiguos vía WhatsApp/email bajo marca Altamira
7. SOT Florida (requiere surety bond $25k, ~$300/año) y California CST — Ricardo los tramita
8. Asociaciones: ASTA, IATA, USTOA, CLIA (badges placeholder ya en footer)
9. Más páginas de programa: Japón, Santorini, Positano, etc.

## Reglas de trabajo
- Trabajar en Sonnet (no Opus, para ahorrar créditos)
- Cada cambio: git add + commit + push a main (Netlify despliega solo)
- Co-Authored-By: Claude en commits
- Mapas ilustrados los hace Ricardo en ChatGPT, Claude los integra en /img/
- Fotos: optimizar con ffmpeg antes de subir (rutas /opt/homebrew/bin/ffmpeg)
- gh CLI en /opt/homebrew/bin/gh (autenticado como ricardolb1086)
