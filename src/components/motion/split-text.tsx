"use client";

import { useLayoutEffect, useRef, type ElementType } from "react";
import { SplitText, gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type SplitRevealProps = {
  text: string;
  /** Elemento renderizado (h1, h2, p, span…). */
  as?: ElementType;
  className?: string;
  /** "scroll" = al entrar en viewport. "intro" = cuando `play` pasa a true. */
  trigger?: "scroll" | "intro";
  /** Solo para trigger="intro": reproduce cuando sea true. */
  play?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** Tipo de división del texto. */
  type?: "chars" | "words";
};

/**
 * Titular cinético: divide el texto en chars/words y los revela con máscara.
 * - Anima solo `transform` y `opacity` → compositor, cero layout.
 * - SplitText gestiona aria-label/aria-hidden: el texto sigue siendo legible
 *   para lectores de pantalla como unidad, no como letras sueltas.
 * - `prefers-reduced-motion`: render plano, sin split ni animación.
 */
export function SplitReveal({
  text,
  as: Tag = "span",
  className,
  trigger = "scroll",
  play = true,
  delay = 0,
  stagger = 0.028,
  duration = 1,
  type = "chars",
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !text) return;
    if (prefersReducedMotion()) return;
    if (trigger === "intro" && !play) return;

    let split: SplitText | null = null;

    const ctx = gsap.context(() => {
      split = new SplitText(el, {
        type,
        charsClass: "split-char",
        wordsClass: "split-word",
      });

      const targets = type === "chars" ? split.chars : split.words;

      gsap.set(targets, { yPercent: 118, opacity: 0 });

      const tl = gsap.timeline({
        delay,
        scrollTrigger:
          trigger === "scroll"
            ? { trigger: el, start: "top 88%", once: true }
            : undefined,
      });

      tl.to(targets, {
        yPercent: 0,
        opacity: 1,
        duration,
        ease: "expo.out",
        stagger: { each: stagger, from: "start" },
      });
    }, el);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [text, type, trigger, play, delay, stagger, duration]);

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}

/** Envoltorio semántico para títulos divididos (conserva el nivel de heading). */
export function SplitHeading({
  text,
  as = "h2",
  className,
  trigger = "scroll",
  play = true,
  delay,
  stagger,
  duration,
  type = "chars",
}: SplitRevealProps & { as?: ElementType }) {
  return (
    <SplitReveal
      as={as}
      text={text}
      className={className}
      trigger={trigger}
      play={play}
      delay={delay}
      stagger={stagger}
      duration={duration}
      type={type}
    />
  );
}
