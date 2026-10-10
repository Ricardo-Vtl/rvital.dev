# Plan deRefresh del Portafolio — Oct 2026

> Documento de traspaso/ejecución. Creado el 2026-10-09 desde la bóveda MiVida (sesión de opencode).
> Estado: baseline en git (`8188a8e`) antes de cualquier cambio. Para revertir: `git reset --hard 8188a8e`.

## Contexto

Portafolio personal de Ricardo Vital Negrete (Next.js 16, Tailwind v4, i18n EN/ES). Objetivo: dejarlo publicable y desplegado para usarlo como (1) "Personal Website" en Outlier, (2) prueba de capacidad para la vacante TecNM Irapuato y para el dueño de la lavandería, (3) pieza central del perfil de LinkedIn.

## Dirección estética (cerrada)

- **Dirección**: dark técnico-minimal ("Señal Industrial"). Fondo `#0a0a0a`, atmósfera sutil, un solo elemento firma: tipografía sobredimensionada + etiquetas mono.
- **Acento**: naranja señal `#ff6b35` (hover `#ff8a5c`); tema claro `#c2410c`. Uso mesurado (dominante neutro + acento filoso).
- **Tipografía**: Bricolage Grotesque (display) · IBM Plex Sans (body) · JetBrains Mono (etiquetas/numeración).
- **Movimiento**: una sola revelación escalonada al cargar. Sin loops ni micro-interacciones dispersas.
- **Se eliminan**: Particles, GrainOverlay, Cursor custom, credencial con barcode, watermark "RV", dots infinitos, letra-por-letra, flotar, glows.
- **Se conservan**: watermarks editoriales de sección (ABOUT/WORK/PATH/TALK), i18n, theme toggle, skip link, focus rings, `prefers-reduced-motion`, timeline de experiencia.

## Skills a cargar antes de trabajar este proyecto

```
.agents/skills/frontend-design        → dirección estética y anti "AI slop"
.agents/skills/tailwind-css-patterns  → tokens, layout, animación
.agents/skills/accessibility          → contraste AA, foco, reduced-motion
.agents/skills/seo                    → metadataBase, canonical, JSON-LD, sitemap
.agents/skills/next-best-practices    → fonts, metadata, image
.agents/skills/react-best-practices   → rendering/performance
.agents/skills/composition-patterns   → estructura de componentes
```
(No aplican: nodejs-*, next-upgrade, next-cache-components, typescript-advanced-types.)

## Fase 1 — Corrección de datos (EJECUTADA)

Archivos: `src/data/portfolio.ts`, `src/data/site.ts` (nuevo), `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/lib/i18n.ts`, `src/components/providers.tsx`.

- LinkedIn: `ricard0vitalnegrete` (roto, con cero) → `https://www.linkedin.com/in/ricardo-vital-dev`.
- GitHub: `ricardovital` (roto) → `https://github.com/Ricardo-Vtl` (también en JSON-LD `sameAs`).
- Carrera: periodo `2019 — 2024` → `2021 — 2026` (feb). Escuela: "Instituto Tecnológico Superior de Irapuato (TecNM)".
- Mecatrónica: redacción honesta con tesis (brazo robótico con Arduino) y certificado/título emitidos (recogida pendiente en institución).
- POS: "Aguachilito POS" → "POS Web — Plataforma de Punto de Venta (white-label)"; sin marca ni nicho.
- `liveUrl`/`repoUrl` falsos ("#") → opcionales; si no existen, se muestra "demo en curso" (key `project.soon`).
- SEO: `metadataBase` + canonical, un solo `h1`, alt texts, `lang` dinámico (`es-MX`/`en`).
- `src/data/site.ts` centraliza la URL canónica (cambiar en un solo lugar tras el deploy).

## Fase 2 — Refresh visual (EJECUTADA)

Archivos: `src/app/globals.css`, `src/components/hero.tsx` (reescrito), `src/components/projects.tsx`, `src/components/about.tsx`, `src/components/contact.tsx`, `src/components/experience.tsx`, `src/components/footer.tsx`. Eliminados: `particles.tsx`, `grain-overlay.tsx`, `cursor.tsx`.

- Tokens de color/fuente en `globals.css` (`@theme`).
- Hero: layout asimétrico, foto limpia con hairline, CTA con texto oscuro sobre acento (contraste AA).
- Etiquetas de sección en mono;CTA oscura sobre naranja; `::selection` legible.

## Fase 3 — Deploy (PENDIENTE — Ricardo)

1. Crear repo público `portfolio` en GitHub.
2. Conectar a Vercel; nombre de proyecto `ricardo-vital` → URL `https://ricardo-vital.vercel.app`.
3. Si la URL final difiere, actualizar `src/data/site.ts` (un solo lugar) y rebuild.
4. (Opcional) Antes de push: decidir si `.agents/` se hace público. Recomendación: sí — demuestra metodología de trabajo.

## Fase 4 — Post-deploy (PENDIENTE — opencode)

- Verificar metadata/sitemap con la URL real.
- Registrar en la bóveda (MiVida): campo "Personal Website" de Outlier, sección de contacto de LinkedIn, `Inicio.md`.

## Fase 5 — Demo del POS (PENDIENTE — Ricardo, en su sesión del POS)

Ver [[POS - Publicación white label]] en la bóveda: repo white-label público + Supabase aparte con seed ficticio + reset + deploy.

## Checklist de verificación

- [x] `pnpm build` sin errores (TypeScript OK, 4 páginas estáticas)
- [x] Links GitHub/LinkedIn correctos en HTML generado (hero + footer)
- [x] JSON-LD `sameAs` con URLs reales; `metadataBase` + canonical
- [x] Acento naranja aplicado; 3 fuentes nuevas preloaded
- [x] Componentes decorativos eliminados del árbol
- [ ] Responsive móvil (revisión visual de Ricardo)
- [ ] i18n verificado visualmente en ambos idiomas
- [ ] Contraste AA en tema claro (revisión visual)
- Nota: `pnpm lint` no funciona en este proyecto (`next lint` fue removido en Next 16 y no hay ESLint instalado). La verificación de tipos corre dentro del build. Si se quiere lint real: `pnpm add -D eslint eslint-config-next` y cambiar el script a `eslint .`.
