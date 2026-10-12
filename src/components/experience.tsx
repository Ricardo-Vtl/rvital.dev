"use client";

import { useRef } from "react";
import { m, useScroll, useSpring } from "motion/react";
import { useLang } from "./providers";
import { experience, tData } from "@/data/portfolio";
import { Reveal } from "./motion";
import { SplitReveal } from "./motion/split-text";
import { Parallax } from "./motion/parallax";
import { useReducedMotionSafe } from "@/lib/motion";

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const { t, lang } = useLang();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 });

  return (
    <section id="experience" className="relative overflow-hidden px-6 py-28 md:py-40">
      {/* Watermark con parallax */}
      <Parallax speed={0.13} className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 leading-none opacity-[0.07]">
          <span className="block font-heading text-[22vw] font-bold leading-none tracking-tighter text-text-primary md:text-[20vw]">
            PATH
          </span>
        </div>
      </Parallax>

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Label */}
          <div className="md:col-span-2">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
              {t("section.path")}
            </span>
            <div className="mt-4 h-px w-8 bg-border" />
          </div>

          {/* Timeline */}
          <div className="relative md:col-span-9 md:col-start-3">
            {/* Línea con progreso scrub */}
            <div className="absolute top-1 bottom-1 left-0 w-px bg-border" />
            {!reduced && (
              <m.div
                style={{ scaleY, originY: 0 }}
                className="absolute top-1 bottom-1 left-0 w-px bg-accent"
              />
            )}

            <div className="space-y-14 md:space-y-20">
              {experience.map((exp, i) => (
                <Reveal key={`${exp.role.en}-${exp.company.en}`} delay={i * 0.08} x={-16}>
                  <div className="relative pl-10 md:pl-14">
                    {/* Dot */}
                    <div className="absolute top-1.5 left-0">
                      <div className="flex h-5 w-5 items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_14px_-2px_var(--color-accent-glow)]" />
                      </div>
                    </div>

                    <div className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary">
                      {exp.period}
                    </div>

                    {i === 0 ? (
                      <SplitReveal
                        as="h3"
                        text={tData(exp.role, lang)}
                        className="font-heading text-xl font-semibold text-text-primary md:text-2xl"
                        stagger={0.015}
                      />
                    ) : (
                      <h3 className="font-heading text-xl font-semibold text-text-primary md:text-2xl">
                        {tData(exp.role, lang)}
                      </h3>
                    )}
                    <p className="mt-0.5 font-body text-sm font-medium text-text-tertiary">
                      {tData(exp.company, lang)}
                    </p>
                    <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-text-secondary md:text-base">
                      {tData(exp.description, lang)}
                    </p>
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
