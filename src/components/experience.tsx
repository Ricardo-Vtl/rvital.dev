"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLang } from "./providers";
import { experience, tData } from "@/data/portfolio";

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const prefersReducedMotion = useReducedMotion();
  const { t, lang } = useLang();

  return (
    <section id="experience" className="relative overflow-hidden px-6 py-28 md:py-40">
      {/* Background watermark */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none leading-none opacity-[0.08] md:left-8">
        <span className="font-heading text-[30vw] font-bold tracking-tighter text-text-primary md:text-[20vw]">
          PATH
        </span>
      </div>

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Label */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="font-body text-[10px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
                {t("section.path")}
              </span>
              <div className="mt-4 h-px w-8 bg-border" />
            </motion.div>
          </div>

          {/* Timeline */}
          <div className="relative md:col-span-9 md:col-start-3">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-0 w-px bg-border" />

            <div className="space-y-16 md:space-y-24">
              {experience.map((exp, i) => (
                <motion.div
                  key={`${exp.role.en}-${exp.company.en}`}
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.6,
                    delay: prefersReducedMotion ? 0 : 0.2 + i * 0.15,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="relative pl-10 md:pl-14"
                >
                  {/* Dot */}
                  <motion.div
                    initial={{ scale: prefersReducedMotion ? 1 : 0 }}
                    animate={isInView ? { scale: 1 } : { scale: prefersReducedMotion ? 1 : 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.3 + i * 0.15 }}
                    className="absolute top-1 left-0"
                  >
                    <div className="flex h-5 w-5 items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_14px_-2px_var(--color-accent-glow)]" />
                    </div>
                  </motion.div>

                  <div className="mb-2 font-body text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary">
                    {exp.period}
                  </div>

                  <div>
                    <h3 className="font-heading text-xl font-semibold text-text-primary md:text-2xl">
                      {tData(exp.role, lang)}
                    </h3>
                    <p className="mt-0.5 font-body text-sm font-medium text-text-tertiary">
                      {tData(exp.company, lang)}
                    </p>
                    <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-text-secondary">
                      {tData(exp.description, lang)}
                    </p>
                  </div>

                  {i < experience.length - 1 && (
                    <div className="mt-6 h-px w-8 bg-border" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
