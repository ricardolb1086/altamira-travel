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

---

# ESTRATEGIA Y ARQUITECTURA DE FONDO
*(Esto es el "por qué" detrás de cada decisión — lo más importante)*

## Análisis competitivo
- **ST Travel Shop** (@sttravelshop, 1M seguidores, 27 años, México+USA): rival principal. Modelo de VOLUMEN — tours genéricos, masivos, poca curaduría. Su debilidad = nuestra oportunidad.
- **Travel Vacations Groups** (16K): nicho pequeño "viajes con propósito", no es amenaza directa.
- **Legado Travesías** (luxury cultural, guías académicos, respaldo MVS World 40+ años): benchmark para Altamira Collection a futuro.

## Ventaja competitiva de Altamira (vs ST Travel)
1. LLC americana → pagos USD, protección consumidor USA, soporte en su zona horaria
2. Única con estructura de 3 niveles (grupal aspiracional + ultra luxury + B2B DMC)
3. Destinos experienciales únicos: GASTRONOMÍA y VINO (Perú Gastronómico, Viñedos Chile+Patagonia, Viñedos España) — NADIE en el mercado hispano de USA hace esto
4. Asia profunda y combinaciones únicas (China+Mongolia, Turquía+Dubái, Egipto+Jordania+Israel)
5. Salidas garantizadas desde 2 pax (vs mínimos altos de la competencia)

## PRINCIPIO CENTRAL: "Altamira curates, no cataloga"
La marca enmarca el producto, no al revés. NUNCA vendemos "un circuito de Wamos" — vendemos "Europa Central operada con nuestro socio de confianza en tierra". El cliente compra con Altamira. Los operadores son INVISIBLES en todo el sitio (solo se mencionan discretamente en página de detalle como "operado en tierra por nuestro socio especialista en [región]" si acaso).

## Arquitectura de 3 niveles (el corazón del producto)
**Nivel 1 — Altamira Originals** (la joya de la corona)
- Operaciones propias. Tratamiento editorial completo. Cupos NO especificados (flexibilidad: a veces 20, a veces 40, a veces 2 salidas/mes).
- Badge: ● Altamira Original. Copy: "Diseñados y operados por nosotros."
- 14 destinos: Japón, China+HK+Japón, Corea+Japón, China+Mongolia, Turquía+Dubái, Egipto+Jordania+Israel, Tailandia+Singapur+Cambodia, Vietnam+Bali, Viñedos Chile+Patagonia, Viñedos España, Islandia, Perú Gastronómico, Safari Kenya+Tanzania, Zimbabwe+Botsuana+Sudáfrica

**Nivel 2 — Salidas Regulares con Salida Garantizada**
- Operadores invisibles (Wamos/Europa, Eurowelcome/UK, Latitude/Turquía, Larimar/Jordania, Vered/Israel, Explora Traveler/Egipto, Honest Group)
- Key message: "Desde 2 pasajeros, todos los meses del año" — diferenciador brutal vs ST Travel
- Badge: ✓ Salida garantizada

**Nivel 3 — Europa Esencial** (MasEuropa, circuitos de colores)
- NUNCA llamarlo "barato/económico". Framing: "La manera más inteligente de descubrir Europa por primera vez"
- Badge: ◎ Mejor valor. Mismo diseño de card que los demás — la elegancia visual borra la percepción de precio bajo
- Posicionarlo como ENTRY POINT al ecosistema: "Tu primera vez en Europa. Cuando estés listo para más, estamos aquí." El viajero de bus hoy es el cliente de Altamira Collection en 3 años.

## Estrategia de precios
- Regla: utilidad mínima $500/pax DESPUÉS de comisión del procesador
- Absorber el 3% de tarjeta en el precio final REDONDEADO hacia arriba (un solo precio, sin "desde", sin mostrar el +3% aparte)
- Ofrecer descuento por pago en efectivo/transferencia como herramienta de cierre
- Decisión de marca: NO usar la palabra "desde" o mostrarla tachada (~~Desde~~ $X) como diferenciador de transparencia
- Procesador: empezar con Stripe; Payment Cloud solo si crece volumen o Stripe rechaza

## Estrategia de marca / tono
- Bilingüe desde día 1 (ES principal + línea EN). El hispano en USA es bilingüe; duplica alcance orgánico.
- Voz: amigo experto, no vendedor. Oraciones cortas. Datos específicos que demuestran conocimiento. Sin signos de exclamación excesivos ni "¡OFERTA!".
- Ricardo SALE en las fotos = activo, no problema. En viajes la gente compra al asesor. Construir la MARCA, no la persona (opera como "Altamira Travel", sin nombre propio público).

## Estrategia de redes sociales (el problema: redes vacías al lanzar)
1. Solidez sin seguidores: el SITIO web es la credibilidad inicial. Google Business Profile + testimonios reales + membresía ASTA pesan más que seguidores.
2. Backlog de 12 posts ANTES de publicar el primero (grid completo desde día 1)
3. Lista propia (emails) vale más que seguidores — capturar desde el site
4. Automatización: Buffer programa, Claude genera contenido
5. NO publicar al vacío — primero comentar/estar presente donde ya está el cliente

## Plan de recuperación de ingresos (urgente para Ricardo)
- LO MÁS RÁPIDO: reactivar clientes antiguos (cartera de "Brandon"). Un WhatsApp a 50 contactos que ya confían > 10,000 seguidores.
- Mensaje de transición SIN mencionar Brandon ni Travel Viajes: activa la relación previa por la experiencia compartida, presenta Altamira Travel como evolución.
- Secuencia: Semana 1 contacto personal top 20-30 / Semana 2 broadcast lista completa / Semana 3 email con diseño Altamira + programas con precios

## Los primeros 4 reels (orden estratégico)
1. Presentación de marca — bilingüe (PRIMERO: el mercado necesita saber quién es Altamira)
2. Egipto Faraónico — con mapa y precios
3. Japón — fotos reales + Higgsfield
4. La Ruta de los Sultanes — Turquía
