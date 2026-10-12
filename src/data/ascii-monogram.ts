/**
 * Monograma "RV" en arte ASCII — firma del hero.
 *
 * Fuente FIGlet: "Big Money-nw" (colección figlet-fonts de xero,
 * https://github.com/xero/figlet-fonts — "Big Money-nw.flf").
 * Renderizado con kerning nativo de la fuente (old layout 0) y recorte
 * de columnas/filas vacías. No editar a mano: regenerar si cambia el arte.
 *
 * Se consume por remuestreo (cada carácter → bloque density×density de
 * partículas) en `src/components/hero/ascii-monogram.tsx`.
 */

/** Arte crudo: 21 columnas × 8 filas. */
export const MONOGRAM_ART = String.raw`$$$$$$$\  $$\    $$\
$$  __$$\ $$ |   $$ |
$$ |  $$ |$$ |   $$ |
$$$$$$$  |\$$\  $$  |
$$  __$$<  \$$\$$  /
$$ |  $$ |  \$$$  /
$$ |  $$ |   \$  /
\__|  \__|    \_/`;

export const MONOGRAM_COLS = 21;

export const MONOGRAM_ROWS = 8;

/**
 * Aspecto visual en celdas monoespaciadas (glifo ≈ 1:2 ancho/alto):
 * 21 × 0.5 / 8 = 1.3125. El contenedor del hero usa este ratio.
 */
export const MONOGRAM_ASPECT = (MONOGRAM_COLS * 0.5) / MONOGRAM_ROWS;
