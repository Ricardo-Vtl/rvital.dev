"use client";

import { useEffect, useState } from "react";

/** ¿El usuario pidió menos movimiento? (Fuera de React: para guards en efectos.) */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Igual que `prefersReducedMotion`, pero seguro para hidratación: el primer
 * render (SSR + primer render en cliente) devuelve siempre `false` y se
 * actualiza tras el montaje. Evita el mismatch que provoca `useReducedMotion`
 * de motion cuando el usuario tiene la preferencia activada.
 *
 * Úsalo SOLO para decidir el render; para guards de efectos GSAP usa
 * `prefersReducedMotion()` directo (se ejecuta ya en cliente).
 */
export function useReducedMotionSafe(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** ¿Dispositivo con puntero fino (mouse/trackpad)? Descarta touch. */
export function isFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** ¿Viewport móvil? Se usa para rebajar intensidades, no para ocultar contenido. */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

/** Espera a que las fuentes carguen (o 1200ms máximo) antes del preloader. */
export function fontsReady(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return Promise.resolve();
  }
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, 1200));
  return Promise.race([document.fonts.ready.then(() => undefined), timeout]);
}
