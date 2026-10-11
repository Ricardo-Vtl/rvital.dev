"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type VelocityMarqueeProps = {
  items: string[];
  /** Segundos por vuelta completa a velocidad base. */
  duration?: number;
  separator?: string;
  /** "sm" = tecnico mono (skills), "lg" = display gigante (cierre). */
  size?: "sm" | "lg";
  className?: string;
};

/**
 * Marquee cuyo ritmo responde a la velocidad de scroll: al desplazarse rápido
 * acelera, al detenerse vuelve a la velocidad base. Detalle de "craft" que
 * solo se nota cuando está bien hecho.
 *
 * - GSAP + `timeScale` modulado por `ScrollTrigger.getVelocity()`.
 * - Contenido duplicado → loop seamless midiendo `scrollWidth / 2`.
 * - `prefers-reduced-motion`: lista estática, sin loop.
 */
export function VelocityMarquee({
  items,
  duration = 28,
  separator = "/",
  size = "lg",
  className,
}: VelocityMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth / 2;

      const loop = gsap.to(track, {
        x: -distance,
        duration,
        ease: "none",
        repeat: -1,
      });

      ScrollTrigger.create({
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 1400, 2.6);
          gsap.to(loop, {
            timeScale: boost,
            duration: 0.35,
            overwrite: true,
          });
        },
      });
    }, track);

    return () => ctx.revert();
  }, [items.length, duration]);

  const row = [...items, ...items];

  const itemClass =
    size === "sm"
      ? "font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary"
      : "font-heading text-5xl font-bold tracking-tight text-text-primary/12 md:text-7xl";

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center whitespace-nowrap">
            <span className={itemClass}>{item}</span>
            <span className="mx-6 font-mono text-xs text-accent-muted md:mx-10">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
