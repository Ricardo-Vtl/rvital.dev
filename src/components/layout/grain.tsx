/**
 * Capa de grano cinematográfico. Puramente decorativa: fija, sin repintados
 * durante el scroll (el coste de raster es único).
 */
export function FilmGrain() {
  return <div aria-hidden="true" className="film-grain" />;
}
