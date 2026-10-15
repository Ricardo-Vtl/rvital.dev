"use client";

import { useLang } from "./providers";
import { skillGroups } from "@/data/portfolio";
import { Reveal } from "./motion";
import { SplitReveal } from "./motion/split-text";
import { Parallax } from "./motion/parallax";

/**
 * Stack: tecnologías agrupadas por ambiente (frontend, backend, base de datos,
 * infra y móvil). A diferencia del antiguo carrusel, es contenido estático y
 * escaneable — sin animación continua, así que se lee completo de un vistazo y
 * también con `prefers-reduced-motion` o sin JS.
 */
export function Stack() {
  const { t } = useLang();

  return (
    <section id="stack" className="relative overflow-hidden px-6 py-28 md:py-40">
      {/* Watermark con parallax, mismo lenguaje que las demás secciones */}
      <Parallax speed={0.12} className="pointer-events-none absolute inset-0 select-none">
        <div
          aria-hidden="true"
          className="absolute top-1/2 right-0 -translate-y-1/2 leading-none opacity-[0.05] md:right-8"
        >
          <span className="block font-heading text-[30vw] font-bold tracking-tighter text-text-primary md:text-[18vw]">
            STACK
          </span>
        </div>
      </Parallax>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Label */}
          <div className="md:col-span-2">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
              {t("section.stack")}
            </span>
            <div className="mt-4 h-px w-8 bg-border" />
          </div>

          {/* Content */}
          <div className="md:col-span-9 md:col-start-3">
            <SplitReveal
              as="h2"
              text={t("section.stack")}
              className="font-heading text-4xl font-bold tracking-tight text-text-primary md:text-6xl"
              stagger={0.02}
            />

            <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {skillGroups.map((group, i) => (
                <Reveal key={group.key} delay={i * 0.06}>
                  <div className="border-t border-border pt-5">
                    <h3 className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-text-tertiary">
                      {t(`stack.${group.key}`)}
                    </h3>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="border border-border bg-surface px-2.5 py-1 font-mono text-[11px] tracking-[0.05em] text-text-secondary"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
