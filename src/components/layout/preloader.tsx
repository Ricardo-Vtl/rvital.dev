"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { fontsReady, prefersReducedMotion } from "@/lib/motion";
import { usePageIntro } from "@/components/providers/page-intro";

/**
 * Preloader de entrada: espera a las fuentes (máx. 1.2s), cuenta 000→100
 * y se retira con un wipe hacia arriba. Al terminar libera `ready` para que
 * el hero arranque su coreografía en el mismo instante.
 *
 * Con `prefers-reduced-motion` no se monta nunca: se marca `ready` de inmediato.
 * El estado `mounted` garantiza que el primer render (SSR + hidratación) sea
 * siempre `null`, evitando mismatch por detección de `window`.
 */
export function Preloader() {
  const { finish } = usePageIntro();
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [skipped, setSkipped] = useState(false);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      setSkipped(true);
      finish();
      return;
    }
    setMounted(true);
  }, [finish]);

  useLayoutEffect(() => {
    if (!mounted) return;

    const root = rootRef.current;
    const count = countRef.current;
    const bar = barRef.current;
    if (!root || !count || !bar) return;

    let cancelled = false;
    const value = { current: 0 };

    const render = () => {
      count.textContent = String(Math.round(value.current)).padStart(3, "0");
    };

    fontsReady().then(() => {
      if (cancelled) return;

      const tl = gsap.timeline({
        onComplete: () => {
          finish();
        },
      });

      tl.to(bar, { scaleX: 1, duration: 1, ease: "power2.inOut" }, 0)
        .to(
          value,
          {
            current: 100,
            duration: 1,
            ease: "power2.inOut",
            onUpdate: render,
          },
          0,
        )
        .to(root, { yPercent: -101, duration: 0.85, ease: "expo.inOut" }, "+=0.08")
        .set(root, { display: "none" });
    });

    return () => {
      cancelled = true;
    };
  }, [mounted, finish]);

  if (skipped || !mounted) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[80] flex flex-col justify-end bg-bg px-6 pt-6 pb-8 md:px-10 md:pb-12"
    >
      <div className="flex items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
            Ricardo Vital
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
            Full-Stack Developer
          </p>
        </div>
        <span
          ref={countRef}
          className="font-heading text-6xl leading-none font-bold tracking-tighter text-text-primary md:text-8xl"
        >
          000
        </span>
      </div>

      <div className="mt-8 h-px w-full origin-left scale-x-0 bg-border">
        <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-accent" />
      </div>
    </div>
  );
}
