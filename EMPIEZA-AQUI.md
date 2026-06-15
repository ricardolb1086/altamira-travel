# 👋 EMPIEZA AQUÍ — Altamira Travel

## 1. Copia y pega esto como PRIMER mensaje en la sesión nueva de Code:

> Lee completos CLAUDE.md, CONTEXTO-ALTAMIRA.md y DESIGN-SYSTEM.md antes de empezar.
> Continuamos el proyecto Altamira Travel. Trabaja en Sonnet. Cada cambio:
> git add + commit + push a main (Netlify despliega solo).

Con eso la sesión nueva queda con TODO el contexto, estrategia y diseño.

---

## 2. Mapa de los documentos (qué hay en cada uno)
| Archivo | Contiene |
|---|---|
| **CLAUDE.md** | Onboarding técnico: stack, repo, hosting, CMS, comandos, errores resueltos |
| **CONTEXTO-ALTAMIRA.md** | La empresa, estrategia, arquitectura de 3 niveles + cómo se muestran en el sitio, precios, pendientes |
| **DESIGN-SYSTEM.md** | Identidad visual: tokens de color, tipografías, patrón itálica terracota, botones, checklist de páginas nuevas |
| **social/captions-backlog.md** | 12 posts de Instagram + tono + calendario + templates |
| **social/reel-script.md** | Scripts ElevenLabs (ES/EN) + prompts Higgsfield + edición CapCut |
| **social/reactivacion-clientes.md** | Secuencia de 3 semanas para reactivar la cartera de clientes |

---

## 3. LO QUE NECESITO TENER A MANO (datos que solo Ricardo tiene)
Antes de pedir cosas, ten listo:

1. **Circuitos reales para "Próximas Salidas"** — 2 a 4 circuitos con: nombre · destino · duración · precio · fecha(s) de salida · operador · nivel (Original/Regular/Esencial)
2. **Precio de Turquía** (La Ruta de los Sultanes) + su **mapa ilustrado** hecho en ChatGPT
3. **Número de WhatsApp corporativo** (Google Voice) — para reemplazar el temporal 16507650627
4. **Decisiones pendientes:**
   - ¿"Próximas Salidas" en el home o página `/salidas` aparte?
   - ¿Subdominios para DMC y Collection, o dominios propios?
   - ¿Se usa "desde $X" en las cards, o precio único? (revisar contradicción con regla de precios)

---

## 4. Pendientes en orden de prioridad
1. Precio + mapa de Turquía → `programas/la-ruta-de-los-sultanes.html`
2. Sección "Próximas Salidas" (bloqueada hasta tener los circuitos reales del punto 3.1)
3. Número WhatsApp corporativo en todo el sitio + Buffer
4. SEO: meta títulos/descripciones, Google Business Profile, Search Console
5. Reel viral #1 (presentación de marca, bilingüe)
6. Reactivar clientes antiguos (la acción de mayor retorno inmediato)
7. Más páginas de programa: Japón, Santorini, Positano

---

## 5. Recordatorios rápidos
- **Marca:** nunca mencionar "Brandon" ni "Travel Viajes USA". Todo es **Altamira Travel**.
- **Operadores:** invisibles en cards/home; en la página de detalle sí, al final, como credibilidad.
- **Precios:** utilidad mínima $500/pax después de comisión; absorber 3% en precio redondeado.
- **Diseño:** copiar el bloque `:root` y los patrones de DESIGN-SYSTEM.md en CADA página nueva.
- **Mapas ilustrados:** los hace Ricardo en ChatGPT; Claude los integra en `/img/`.
