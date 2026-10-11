"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

const ROWS = [
  { words: ["ARCHITECTURE", "INTERFACES", "PERFORMANCE"], direction: -1 },
  { words: ["API DESIGN", "DATABASES", "SECURITY"], direction: 1 },
  { words: ["TESTING", "DOCUMENTATION", "SHIPPING"], direction: -1 },
];

type KineticBandProps = {
  label?: string;
};

/**
 * Corredor cinético: bandas de palabras que derivan en HORIZONTAL mientras
 * el usuario scrollea en VERTICAL. Rompe la monotonía arriba/abajo y usa el
 * mismo plano de scroll que el resto del sitio (un solo reloj).
 *
 * - Direcciones alternas entre filas → sensación de volumen.
 * - Solo `transform` (xPercent) → compositor, cero layout.
 * - `overflow: clip` (no hidden) para no crear contexto deScroll.
 * - Reduced motion: bandas estáticas, sin registro de scroll.
 */
export function KineticBand({ label }: KineticBandProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-kinetic-row]").forEach((row) => {
        const direction = Number(row.dataset.direction ?? "-1");
        const amount = direction * 18;

        gsap.fromTo(
          row,
          { xPercent: -amount },
          {
            xPercent: amount,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-clip border-y border-border py-16 md:py-24"
    >
      {label ? (
        <span className="mx-auto mb-10 block max-w-6xl px-6 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
          {label}
        </span>
      ) : null}

      <div className="flex flex-col gap-4 md:gap-6">
        {ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="overflow-clip">
            <div
              data-kinetic-row
              data-direction={row.direction}
              className="flex w-max items-center gap-8 whitespace-nowrap will-change-transform md:gap-14"
            >
              {row.words.map((word, wordIndex) => (
                <span key={`${word}-${wordIndex}`} className="flex items-center gap-8 md:gap-14">
                  <span className="font-display text-5xl leading-none font-bold tracking-tighter text-text-primary/[0.09] md:text-8xl">
                    {word}
                  </span>
                  <span className="h-1.5 w-1.5 shrink-0 bg-accent/50" aria-hidden="true" />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
