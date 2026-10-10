"use client";

import { useRef, type ReactNode } from "react";
import { m, useInView, useReducedMotion } from "motion/react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

/**
 * Reveal — fade + rise al entrar en viewport.
 * Patrón: anima solo transform/opacity (GPU). Respeta prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  x = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <m.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </m.div>
  );
}

/**
 * RevealWords — reveal palabra por palabra (patrón inspirado en 21st.dev/Magic UI,
 * implementado sobre nuestros tokens). Uso: envolver el texto dentro de un heading.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
  blur = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  blur?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) return <span className={className}>{text}</span>;

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <m.span
          key={`${word}-${i}`}
          className="inline-block"
          initial={{ opacity: 0.15, filter: blur ? "blur(3px)" : "blur(0px)" }}
          animate={
            inView
              ? { opacity: 1, filter: "blur(0px)" }
              : { opacity: 0.15, filter: blur ? "blur(3px)" : "blur(0px)" }
          }
          transition={{ duration: 0.45, delay: delay + i * 0.05, ease: EASE }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </m.span>
      ))}
    </span>
  );
}
