"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  // Evita recálculos por la barra de URL de móviles al hacer resize.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText };

/** Curvas compartidas: una sola escala de easing para todo el sitio. */
export const EASE = {
  outExpo: "expo.out",
  outQuart: "power4.out",
  inOutQuart: "power4.inOut",
  outCirc: "circ.out",
} as const;

/** Velocidad de scroll → grados de skew (patrón "velocity skew" de sitios award). */
export function velocitySkew(velocity: number, max = 4): number {
  return gsap.utils.clamp(-max, max, velocity / -320);
}
