"use client";

import { useRef } from "react";
import { m, useScroll, useSpring } from "motion/react";
import { useLang } from "./providers";
import { workflow } from "@/data/workflow";
import { tData } from "@/data/portfolio";
import { Reveal, RevealWords } from "./motion";
import { SplitReveal } from "./motion/split-text";
import { Parallax } from "./motion/parallax";
import { useReducedMotionSafe } from "@/lib/motion";

export function Workflow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const { t, lang } = useLang();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section id="workflow" className="relative overflow-hidden px-6 py-28 md:py-40">
      <div ref={ref} className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Label */}
          <div className="md:col-span-2">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
              {t("nav.workflow")}
            </span>
            <div className="mt-4 h-px w-8 bg-border" />
          </div>

          {/* Content */}
          <div className="md:col-span-9 md:col-start-3">
            <SplitReveal
              as="h2"
              text={tData(workflow.title, lang)}
              className="font-heading text-4xl font-bold tracking-tight text-text-primary md:text-6xl"
              stagger={0.02}
            />

            <Reveal delay={0.1}>
              <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-text-secondary">
                {tData(workflow.intro, lang)}
              </p>
            </Reveal>

            <div className="relative mt-16 pl-10 md:pl-14">
              {/* Timeline line — progreso ligado al scroll */}
              <div className="absolute top-1 bottom-1 left-0 w-px bg-border" />
              {!reduced && (
                <m.div
                  style={{ scaleY, originY: 0 }}
                  className="absolute top-1 bottom-1 left-0 w-px bg-accent"
                />
              )}

              <div className="space-y-12 md:space-y-16">
                {workflow.steps.map((step, i) => (
                  <Reveal key={step.cmd} delay={i * 0.08} x={-16}>
                    <div className="relative">
                      <div className="absolute top-1.5 -left-10 md:-left-14">
                        <div className="flex h-5 w-5 items-center justify-center">
                          <div className="h-2.5 w-2.5 bg-accent" />
                        </div>
                      </div>

                      {/* Número del paso: capa parallax sutil, a la izquierda de la línea */}
                      <Parallax
                        speed={0.06}
                        className="pointer-events-none absolute -top-6 -left-14 -z-10 hidden md:-left-20 md:block"
                      >
                        <div className="-translate-x-full">
                          <span
                            aria-hidden="true"
                            className="font-heading text-7xl font-bold tracking-tighter text-text-primary/[0.04] md:text-8xl"
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </Parallax>

                      <span className="inline-block border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-accent">
                        $ {step.cmd}
                      </span>

                      <h3 className="mt-4 font-heading text-xl font-semibold text-text-primary md:text-2xl">
                        {tData(step.title, lang)}
                      </h3>

                      <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-text-secondary md:text-base">
                        <RevealWords text={tData(step.body, lang)} blur={false} />
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
