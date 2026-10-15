/**
 * Depth Engine — matemática de profundidad compartida.
 *
 * Cada plano se define por un `depth`:
 *   0    = infinitamente lejos (casi no se mueve)
 *   1    = plano de pantalla (se mueve 1:1 con el scroll)
 *   > 1  = delante de la pantalla (adelanta al scroll: sensación de cámara)
 *
 * De ese único valor se derivan las 5 propiedades que hacen creíble la
 * profundidad (no solo el movimiento). Un plano lejano se ve más pequeño,
 * más apagado y responde menos al puntero: el ojo lee profundidad aunque
 * no haya scroll.
 */

export interface DepthConfig {
  /** 0 = lejos, 1 = plano pantalla, >1 = delante */
  depth: number;
  /** Multiplicador del recorrido disponible del pin. */
  speed?: number;
  /** Desplazamiento vertical inicial, en unidades de viewport */
  offset?: number;
  /** Colapso final de opacidad: [% progreso donde empieza, % donde es 0; >1 = despine] */
  fadeOut?: [number, number];
  /** Aparición: [% progreso donde empieza, % donde llega a opacidad plena] */
  fadeIn?: [number, number];
  /** Amplitud del desplazamiento por puntero, en fracciones de viewport */
  pointer?: number;
  /** Override de la opacidad base (por defecto se deriva de depth) */
  baseOpacity?: number;
  /** Inclinación sutil de cámara (solo planos decorativos) */
  rotate?: boolean;
  /** Escala objetivo a `progress = 1` (1 = sin cambio). El plano encoge/crece
   *  de forma gradual con el recorrido: recede hacia el fondo al salir. */
  shrink?: number;
  /** Solo en modo `exit` (móvil): desplazamiento hacia ABAJO proporcional al
   *  progreso, en fracciones de viewport. El plano "se rezaga" y permanece en
   *  cuadro más tiempo, para que su fade/encogimiento se note. */
  lag?: number;
}

export interface ComputedDepth {
  speed: number;
  scale: number;
  opacity: number;
  pointerFactor: number;
  rotationDeg: number;
}

/** Velocidad: lejos casi quieto, cerca adelanta al scroll. */
export function depthSpeed(depth: number): number {
  return 0.2 + depth * 1.15;
}

/** El puntero mueve más a los planos cercanos (segunda fuente de profundidad). */
export function depthPointerFactor(depth: number): number {
  return 0.15 + depth * 1.25;
}

/** Cerca se ve más grande. */
export function depthScale(depth: number): number {
  return 1 + depth * 0.16;
}

/** Lejos se ve apagado y atmosférico. */
export function depthOpacity(depth: number): number {
  return 0.55 + Math.min(depth, 1) * 0.45;
}

/** Inclinación de cámara: los planos giran levemente al pasar. */
export function depthRotation(depth: number, progress: number, amount = 6): number {
  return progress * amount * (depth - 0.2);
}

/** Opacidad por rango de progreso: permite que un plano se retire antes. */
export function rangeOpacity(progress: number, fade?: [number, number]): number | null {
  if (!fade) return null;
  const [from, to] = fade;
  if (progress <= from) return 1;
  if (progress >= to) return 0;
  return 1 - (progress - from) / (to - from);
}

export function computeDepth(config: DepthConfig, progress: number): ComputedDepth {
  return {
    speed: config.speed ?? depthSpeed(config.depth),
    scale: depthScale(config.depth),
    opacity: depthOpacity(config.depth),
    pointerFactor: depthPointerFactor(config.depth),
    rotationDeg: depthRotation(config.depth, progress),
  };
}

/**
 * Progreso raw de un contenedor sticky a partir del scroll real, sin
 * clamps: 0..1 durante el pin y > 1 durante el despine (el tramo en que
 * el stage sale del encuadre). Con length L llega a L/(L-1) al final.
 */
export function pinnedRaw(scrollY: number, start: number, distance: number): number {
  if (distance <= 0) return 0;
  return (scrollY - start) / distance;
}

/** Puntero normalizado -1..1, suavizado con lerp independiente del frame rate. */
export function lerp(current: number, target: number, t: number): number {
  return current + (target - current) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
