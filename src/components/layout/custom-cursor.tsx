"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * Cursor custom (solo escritorio).
 *
 * - El punto sigue al cursor casi 1:1; el anillo llega con lerp → profundidad.
 * - Se activa añadiendo `cursor-none` al <html>: si el JS falla, el cursor
 *   nativo sigue intacto.
 * - Los elementos solo se montan cuando el efecto confirma que puede activarse
 *   (puntero fino + movimiento permitido): nunca queda un anillo huérfano.
 * - Reacciona a `[data-cursor]`: "link" agranda el anillo, "view" muestra
 *   una etiqueta (se toma de `data-cursor-label`).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  // 1) Decidir si puede activarse (sin tocar el DOM todavía).
  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointer()) return;
    setActive(true);
  }, []);

  // 2) Con los elementos ya montados, configurar el seguimiento.
  useLayoutEffect(() => {
    if (!active) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.documentElement.classList.add("cursor-none");

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -200, y: -200 });
    gsap.set(label, { opacity: 0, scale: 0.6 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });

    const reset = () => {
      gsap.to(ring, { scale: 1, duration: 0.35, ease: "power3.out" });
      gsap.to(label, { opacity: 0, scale: 0.6, duration: 0.2 });
    };

    // Puntero: segunda fuente de profundidad. No se coloca hasta que el ratón
    // se mueve de verdad (los navegadores emiten un movimiento inicial en 0,0
    // que dejaría el anillo visible en la esquina superior izquierda).
    let moved = false;

    const onMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;

      if (!moved) {
        moved = true;
        gsap.set([dot, ring], { x: clientX, y: clientY });
      } else {
        dotX(clientX);
        dotY(clientY);
        ringX(clientX);
        ringY(clientY);
      }

      const hover = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");

      if (!hover) {
        reset();
        return;
      }

      if (hover.dataset.cursor === "view") {
        label.textContent = hover.dataset.cursorLabel ?? "";
        gsap.to(ring, { scale: 2.9, duration: 0.4, ease: "power3.out" });
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.3 });
      } else {
        gsap.to(ring, { scale: 1.7, duration: 0.4, ease: "power3.out" });
        gsap.to(label, { opacity: 0, scale: 0.6, duration: 0.2 });
      }
    };

    const onLeaveWindow = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };
    const onEnterWindow = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.25 });
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      document.documentElement.classList.remove("cursor-none");
      gsap.killTweensOf([dot, ring]);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <div
        ref={ringRef}
        className="absolute top-0 left-0 flex h-9 w-9 items-center justify-center rounded-full border border-accent/70 mix-blend-difference"
      >
        <span
          ref={labelRef}
          className="font-mono text-[7px] font-medium tracking-[0.18em] text-accent uppercase"
        />
      </div>
      <div ref={dotRef} className="absolute top-0 left-0 h-1 w-1 rounded-full bg-accent" />
    </div>
  );
}
