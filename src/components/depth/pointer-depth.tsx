"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";
import { depthPointerFactor } from "@/lib/depth";

type PointerDepthProps = {
  children: ReactNode;
  /** Cerca responde más al puntero (misma curva que el Depth Engine). */
  depth: number;
  className?: string;
};

/**
 * Parallax de puntero para secciones normales (fuera del DepthScene).
 *
 * Misma regla que el motor principal: la amplitud escala con `depth`, así los
 * planos cercanos reaccionan más que los lejanos y el ojo lee profundidad.
 * - Solo `transform` vía quickTo → compositor.
 * - Se desactiva en touch y con `prefers-reduced-motion`.
 */
export function PointerDepth({ children, depth, className }: PointerDepthProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !isFinePointer()) return;

    const amplitude = window.innerHeight * 0.055 * depthPointerFactor(depth);

    const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      xTo(x * amplitude);
      yTo(y * amplitude * 0.5);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(el);
    };
  }, [depth]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
