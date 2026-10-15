"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { useLang } from "./providers";
import { StatementPhrase } from "./statement-phrase";
import { useReducedMotionSafe } from "@/lib/motion";

const PHRASE_CLASS =
  "mx-auto max-w-3xl text-center font-heading text-3xl leading-[1.1] font-bold tracking-tight text-text-primary";

/**
 * Sección-frase: banda compacta entre el hero y About, visible solo en móvil.
 * En desktop la frase vive dentro del hero (plano del DepthScene), así que una
 * sola versión está activa por viewport (la otra queda en `display:none`).
 *
 * Entrada y salida ligadas al scroll (scrub, reversible): la frase sube y
 * aparece al entrar y sube y se desvanece al salir, con un leve `scale`. Así
 * no se siente plana ni pierde el momento por el scroll. Respeta
 * `prefers-reduced-motion` (versión estática).
 */
export function Statement() {
  const { lang } = useLang();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [120, 0, 0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.42, 0.58, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.9]);

  return (
    <section ref={ref} className="relative px-6 py-16 md:hidden">
      {reduced ? (
        <p className={PHRASE_CLASS}>
          <StatementPhrase lang={lang} />
        </p>
      ) : (
        <m.p className={PHRASE_CLASS} style={{ y, opacity, scale }}>
          <StatementPhrase lang={lang} />
        </m.p>
      )}
    </section>
  );
}
