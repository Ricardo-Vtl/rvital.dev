"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

interface SmoothScrollValue {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement, offset?: number) => void;
}

const SmoothScrollContext = createContext<SmoothScrollValue>({
  lenis: null,
  scrollTo: () => {},
});

/**
 * Smooth scroll global.
 *
 * Decisiones de rendimiento (validadas contra la guía de Chrome):
 * - Lenis se conduce desde `gsap.ticker` → un solo reloj rAF para todo el sitio
 *   (Lenis + ScrollTrigger + tweens), cero jitter entre efectos.
 * - `lagSmoothing(0)`: sin corrección de frames perdidos; Lenis ya interpola.
 * - Touch nativo (syncTouch false): no se pelea con el scroll táctil de iOS.
 * - Con `prefers-reduced-motion` no se inicializa en absoluto: scroll nativo.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
      autoRaf: false,
    });

    instance.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  const scrollTo = useCallback(
    (target: string | HTMLElement, offset = -72) => {
      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.2 });
      } else if (typeof target === "string") {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [lenis],
  );

  // Lenis desactiva el `scroll-behavior: smooth` nativo: replicamos las anclas.
  useEffect(() => {
    if (!lenis) return;

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (href === "#") {
        event.preventDefault();
        lenis.scrollTo(0);
        return;
      }

      const el = document.querySelector(href);
      if (!el) return;

      event.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -72 });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return (
    <SmoothScrollContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}
