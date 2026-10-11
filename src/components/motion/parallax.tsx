"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { isMobileViewport, prefersReducedMotion } from "@/lib/motion";

type ParallaxProps = {
  children: ReactNode;
  /**
   * Intensidad 0–1. En móvil se multiplica por 0.55: menos recorrido visual,
   * mismos fps. Mantener ≤ 0.5 (umbral de confort vestibular).
   */
  speed?: number;
  axis?: "y" | "x";
  className?: string;
};

/**
 * Capa parallax ligada al scroll.
 *
 * - `scrub: true` → sincronía exacta con el scroll (sin lag de interpolación).
 * - Promoción a capa GPU solo mientras el elemento está en el rango activo:
 *   `will-change` se activa y desactiva con el trigger (sin fugas de memoria).
 * - Anima únicamente `yPercent`/`xPercent` → compositor, cero layout/paint.
 */
export function Parallax({ children, speed = 0.2, axis = "y", className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const multiplier = isMobileViewport() ? 0.55 : 1;
    const amount = speed * multiplier * 60;
    const from = axis === "y" ? { yPercent: amount } : { xPercent: amount };
    const to = axis === "y" ? { yPercent: -amount } : { xPercent: -amount };

    const ctx = gsap.context(() => {
      gsap.fromTo(el, from, {
        ...to,
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            el.style.willChange = self.isActive ? "transform" : "auto";
          },
        },
      });
    }, el);

    return () => {
      el.style.willChange = "auto";
      ctx.revert();
    };
  }, [speed, axis]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Parallax de imagen dentro de un marco con overflow oculto:
 * mueve el hijo (no el marco) para no deformar el recorte.
 */
export function ParallaxMedia({
  children,
  speed = 0.15,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  return (
    <Parallax speed={speed} className={className}>
      {children}
    </Parallax>
  );
}
