# Plan de Upgrade del Portafolio — Oct 2026 (ronda 2)

> Complementa `PLAN-REFRESH-2026-10.md`. Estado: ejecutado y mergeado en `master`.
> Commits: `8186a8e` baseline · `4ce1ddf` refresh · `4743e99` upgrade · `7523a58` merge.

## Objetivo

Subir el portafolio de "bueno" a "tier S": movimiento profesional, sección diferenciadora, validación de diseño con datos, y assets listos para producción.

## Fase 1 — Validación con UI/UX Pro Max (EJECUTADA)

Skill instalada en `.agents/skills/ui-ux-pro-max` (tecnología Google, opencode).
Resultados del script de búsqueda:

- **Estilo**: `minimalism-and-swiss-style` — "grid-based, high contrast, avoid shadows and gradients, border-radius: 0px, single accent color, requires contrast-text-4.5/keyboard/visible-focus/reduced-motion".
- **Tipografía**: `Developer Mono` (JetBrains Mono + IBM Plex Sans) y `Terminal CLI Monospace`. Nuestro display Bricolage Grotesque + IBM Plex Sans + JetBrains Mono encaja en el perfil mono+sans técnico.
- **Cambio aplicado**: esquinas afiladas (radio 0) en botones, tarjetas, foto y tags. Sombras fuera salvo el glow puntual del timeline.

## Fase 2 — Arquitectura de movimiento (EJECUTADA)

- Migración a `motion/react` (paquete `motion` v14 instalado).
- `LazyMotion` + `domAnimation` + `strict` en providers → componente `m` en lugar de `motion` (~-50% del bundle de animación).
- `src/components/motion.tsx`: `Reveal` (fade+rise en viewport) y `RevealWords` (reveal palabra por palabra). Toda la coreografía pasa por ahí; `prefers-reduced-motion` respetado en un solo punto.
- Timeline de experiencia y de "How I work" con progreso ligado a scroll (`useScroll` + `useSpring`).

## Fase 3 — Sección "How I work" (EJECUTADA)

- `src/data/workflow.ts` + `src/components/workflow.tsx`, sección `#workflow` entre About y Projects.
- 4 pasos terminal-style (`$ rv.plan / rv.build / rv.verify / rv.ship`) que cuentan el método real: planear antes de construir, IA orquestada desde CLI, verificar todo, entregar documentado. Incluye la frase honesta: "La IA es mi herramienta, no mi reemplazo".
- Nav e i18n (`nav.workflow`: Method/Método) añadidos.

## Fase 4 — Componentes selectivos (EJECUTADA)

Inspirados en patrones de 21st.dev / Magic UI, **implementados a mano** sobre nuestros tokens (código propio, cero dependencias):
1. **Marquee de skills** en About (pausa en hover, animación CSS pura, reduced-motion lo detiene).
2. **Border beam** sutil en tarjetas de proyecto (máscara CSS + conic linear-gradient, solo en hover).
3. **Reveal de texto** para títulos.

## Fase 5 — Assets y pulido (EJECUTADA)

- Badge de disponibilidad en hero ("Available — Irapuato / Remote").
- `src/app/icon.svg` (RV sobre negro con acento naranja).
- `src/app/opengraph-image.tsx` — imagen OG 1200x630 generada en build (links compartidos con marca).
- Descripción SEO alineada al idioma por defecto (EN).

## Pendientes (siguiente ronda)

- [ ] Revisión visual de Ricardo en móvil y tema claro.
- [ ] Deploy (repo + Vercel) y URL real en `src/data/site.ts`.
- [ ] Lighthouse ≥95 y contraste AA verificado.
- [ ] (Opcional) fuentes propias para la OG image (hoy usa sans genérica del renderizador).
- [ ] (Opcional) foto decente para hero/LinkedIn.

## Cómo trabajar este proyecto (para cualquier sesión)

1. Cargar skills: `frontend-design`, `tailwind-css-patterns`, `accessibility`, `seo`, `next-best-practices`, `react-best-practices`, `composition-patterns`, `ui-ux-pro-max`.
2. Usar el script de la skill para validar decisiones: `python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain style|typography|color|ux`.
3. Respetar las reglas verificadas: solo transform/opacity, radio 0, reduced-motion, un solo color de acento.
4. Commits pequeños; rama `feature/*` + merge a `master`; baseline intacto para revertir.
