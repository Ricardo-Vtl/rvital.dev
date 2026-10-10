"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLang } from "./providers";
import { personalInfo, tData } from "@/data/portfolio";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const prefersReducedMotion = useReducedMotion();
  const { t, lang } = useLang();

  return (
    <section id="about" className="relative overflow-hidden px-6 py-28 md:py-40">
      {/* Background watermark */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none leading-none opacity-[0.08] md:left-8">
        <span className="font-heading text-[30vw] font-bold tracking-tighter text-text-primary md:text-[20vw]">
          ABOUT
        </span>
      </div>

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Left: vertical label */}
          <div className="hidden md:col-span-2 md:flex md:flex-col md:items-center md:justify-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="h-16 w-px bg-border" />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-text-tertiary vertical-rl [writing-mode:vertical-lr]">
                {t("nav.about")}
              </span>
              <div className="h-8 w-px bg-border" />
            </motion.div>
          </div>

          {/* Right: content */}
          <div className="md:col-span-8 md:col-start-4">
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="space-y-6">
                {tData(personalInfo.bio, lang).map((paragraph, i) => (
                  <p
                    key={i}
                    className="font-body text-lg leading-relaxed text-text-secondary md:text-xl md:leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Skills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.6 }}
                className="mt-14"
              >
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-text-tertiary">
                  {t("section.technologies")}
                </span>

                <div className="mt-5 flex flex-wrap gap-2">
                  {personalInfo.skills.map((skill, i) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : 0.7 + i * 0.05 }}
                      className="cursor-default rounded-full border border-border bg-surface px-3.5 py-1.5 font-body text-sm text-text-secondary transition-all hover:border-border-light hover:text-accent"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
