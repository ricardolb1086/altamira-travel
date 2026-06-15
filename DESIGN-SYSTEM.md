# DESIGN SYSTEM — Altamira Travel
> **CRÍTICO:** Mantener esta identidad en CADA página nueva. Toda página de programa, landing o sección debe usar EXACTAMENTE estos tokens, tipografías y patrones. Es lo que hace que el sitio se vea premium y coherente. Si creas una página nueva, copia el bloque `:root` y los helpers de tipografía tal cual.

---

## 1. TOKENS DE COLOR (copiar tal cual a `:root`)

```css
:root{
  --cream:    oklch(0.972 0.012 78);   /* fondo principal, crema cálido */
  --cream-2:  oklch(0.945 0.016 76);   /* fondo alterno, secciones */
  --ink:      oklch(0.245 0.014 58);   /* texto principal, casi negro cálido */
  --ink-soft: oklch(0.42 0.02 60);     /* texto secundario, gris cálido */
  --line:     oklch(0.86 0.014 76);    /* bordes, líneas divisorias */
  --terra:    oklch(0.575 0.115 46);   /* TERRACOTA — color de marca (#C47646 aprox) */
  --terra-deep: oklch(0.48 0.11 42);   /* terracota oscuro, hover/acentos texto */
  --olive:    oklch(0.52 0.055 128);   /* verde oliva, uso mínimo */
  --paper:    oklch(0.99 0.006 80);    /* blanco cálido, cards/footer */

  --serif: "Cormorant Garamond", Georgia, serif;
  --sans:  "Hanken Grotesk", system-ui, sans-serif;
  --mono:  "IBM Plex Mono", ui-monospace, monospace;

  --maxw: 1280px;
  --pad: clamp(20px, 5vw, 64px);
}
```

**Google Fonts (en `<head>`):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 2. SISTEMA TIPOGRÁFICO

**Tres tipografías, cada una con un rol fijo:**

| Tipografía | Variable | Uso |
|---|---|---|
| **Cormorant Garamond** (serif) | `--serif` | TODOS los títulos (h1, h2, h3), nombres de circuitos, números grandes decorativos. Weight 500. Elegante, editorial. |
| **Hanken Grotesk** (sans) | `--sans` | Cuerpo de texto, botones, párrafos, labels de formulario. Weight 400-700. |
| **IBM Plex Mono** (mono) | `--mono` | Overlines, etiquetas, badges, metadatos, números de día, precios pequeños. SIEMPRE en mayúsculas con `letter-spacing` amplio. Da el toque "técnico/preciso". |

**Reglas de títulos:**
```css
h1,h2,h3{ font-family: var(--serif); font-weight: 500; line-height: 1.04; letter-spacing: -0.01em; text-wrap: balance; }
.display{ font-size: clamp(44px, 7.4vw, 104px); font-weight: 500; }  /* hero principal */
.h2{ font-size: clamp(34px, 4.6vw, 60px); }                          /* títulos de sección */
.lead{ font-size: clamp(17px, 1.4vw, 20px); color: var(--ink-soft); max-width: 54ch; text-wrap: pretty; }
em.it{ font-style: italic; color: var(--terra-deep); }                /* énfasis en títulos */
```

**PATRÓN CLAVE — el énfasis itálico terracota:** en los títulos, una palabra clave va en `<em class="it">` o `<em>` itálica y color terracota. Ejemplos reales del sitio:
- "Journeys made *unforgettable*."
- "No es un paquete. Es una *forma de ver*."
- "El mundo, *a tu ritmo*."
- "Egipto *Faraónico*"
- "La Ruta de *los Sultanes*"

Esto es FIRMA visual de la marca. Cada título importante tiene una palabra en itálica terracota.

---

## 3. EL OVERLINE (etiqueta superior de cada sección)

Patrón omnipresente. Texto mono, mayúsculas, espaciado, terracota, con una rayita horizontal antes:

```css
.overline{
  font-family: var(--mono); font-size: 12px; font-weight: 500;
  letter-spacing: .22em; text-transform: uppercase; color: var(--terra-deep);
  display:inline-flex; align-items:center; gap:.7em;
}
.overline::before{ content:""; width: 26px; height:1px; background: var(--terra); display:inline-block; }
.overline.center::before{ display:none; }  /* variante centrada */
```

Uso: `<span class="overline">Nuestros circuitos</span>` aparece arriba de cada `h2` de sección.

---

## 4. BOTONES

```css
.btn{
  display:inline-flex; align-items:center; gap:.6em;
  font-family: var(--sans); font-weight: 600; font-size: 14px; letter-spacing: .01em;
  padding: 14px 26px; border-radius: 100px;  /* SIEMPRE pill, 100px */
  border: 1px solid transparent; cursor: pointer;
  transition: all .35s cubic-bezier(.2,.7,.3,1);
}
.btn .arr{ transition: transform .35s cubic-bezier(.2,.7,.3,1); }  /* la flecha → se mueve en hover */
.btn:hover .arr{ transform: translateX(4px); }
.btn-solid{ background: var(--ink); color: var(--cream); }         /* primario oscuro */
.btn-solid:hover{ background: var(--terra-deep); }                  /* hover terracota */
.btn-ghost{ border-color: color-mix(in oklab, var(--ink) 22%, transparent); color: var(--ink); }
.btn-light{ background: var(--cream); color: var(--ink); }          /* sobre fondos oscuros */
```

**Regla:** botones SIEMPRE pill (border-radius 100px). El primario lleva una flecha `<span class="arr">→</span>` que se desliza en hover. Botón de WhatsApp = verde `#25D366`.

---

## 5. ESTRUCTURA DE PÁGINA

- **Contenedor:** `.wrap{ max-width: var(--maxw); margin: 0 auto; padding-inline: var(--pad); }`
- **Secciones:** `section.block{ padding-block: clamp(72px, 11vh, 140px); }` — mucho aire vertical
- **Encabezado de sección:** `.sec-head` con overline + h2 a la izquierda, lead o link a la derecha (flex, space-between)
- **Nav:** fijo arriba, fondo crema con `backdrop-filter: blur(12px)`, se vuelve sólido al hacer scroll (clase `.solid`). Logo "ALTA**MIRA**" (segunda mitad en terracota). Toggle EN/ES.
- **Footer:** fondo paper, columnas (Explore/Company/Follow), banda de acreditaciones, banda Altamira Group con las 3 marcas.

---

## 6. PATRONES DE COMPONENTES

**Cards de circuito (`.circuit`):**
- aspect-ratio 3/2, border-radius 8px, foto de fondo con scrim oscuro gradiente abajo
- Badge arriba (mono, pill, fondo translúcido con `backdrop-filter`)
- Nombre en serif, duración en mono, CTA que aparece en hover (opacity 0→1, translateY)
- Hover: la imagen hace `scale(1.05)` con transición lenta 1.1s

**Badges de nivel de producto:**
- `● Altamira Original` — terracota
- `✓ Salida garantizada` — borde claro
- `◎ Mejor valor` — tono dorado `oklch(0.95 0.07 78)`

**Páginas de programa (`programas/*.html`):** estructura fija —
1. Nav simple (logo + teléfono + botón Reservar)
2. Hero: foto a pantalla con scrim, overline + h1 (con palabra itálica terracota)
3. Stats strip oscuro (4 columnas: días, salida, comidas, idioma)
4. Body en grid `1fr 380px`: izquierda = itinerario con accordion; derecha = sidebar sticky (precios + CTA WhatsApp + incluye/no-incluye)
5. Mapa ilustrado (imagen PNG)
6. Footer minimal

**Reveal on scroll:** elementos con clase `.rv` aparecen con fade+translateY al entrar en viewport (IntersectionObserver). `@media (prefers-reduced-motion: reduce)` los muestra sin animación.

---

## 7. PRINCIPIOS DE DISEÑO (el "alma" visual)

1. **Editorial, no comercial.** Se ve como revista de viajes (Condé Nast Traveler), no como agencia de descuentos. Mucho espacio en blanco, tipografía grande serif, fotografía como protagonista.
2. **Terracota + crema = la marca.** Nunca introducir colores ajenos a la paleta. El terracota es el único acento de color.
3. **La palabra itálica.** Cada título tiene UNA palabra en itálica terracota. Es la firma.
4. **Mono para lo técnico.** Precios, fechas, badges, etiquetas siempre en IBM Plex Mono mayúsculas espaciadas. Contrasta con la elegancia del serif.
5. **Pill everywhere.** Botones y badges siempre redondeados 100px.
6. **Movimiento sutil.** Transiciones lentas (1.1s en imágenes, .35s en botones) con curva `cubic-bezier(.2,.7,.3,1)`. Nada brusco.
7. **Bilingüe sin romper el diseño.** El toggle EN/ES cambia texto sin alterar layout.
8. **Los operadores son invisibles.** Visualmente nada delata que un circuito es de un tercero — mismo diseño de card para Originals, Regulares y Europa Esencial. Solo cambia el badge.

---

## 8. AL CREAR UNA PÁGINA NUEVA — CHECKLIST

- [ ] Copiar bloque `:root` completo (tokens + fonts + maxw + pad)
- [ ] Copiar `<link>` de Google Fonts al `<head>`
- [ ] Nav con logo "ALTA**MIRA**" (b en terracota) + estructura coherente
- [ ] Título principal con UNA palabra en `<em class="it">` itálica terracota
- [ ] Overlines mono terracota con rayita antes de cada sección
- [ ] Botones pill con flecha `.arr` en hover
- [ ] Si es página de programa: seguir la estructura fija (hero → stats → grid itinerario+sidebar → mapa → footer)
- [ ] Footer con "© 2026 Altamira Travel · Altamira Group LLC"
- [ ] Probar el toggle EN/ES si aplica
- [ ] Optimizar imágenes con ffmpeg antes de subir
