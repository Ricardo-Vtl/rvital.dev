"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "./providers";
import { personalInfo, tData } from "@/data/portfolio";

export function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const prefersReducedMotion = useReducedMotion();
  const { t, lang } = useLang();

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-28 md:py-40">
      {/* Background watermark */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none leading-none opacity-[0.08] md:right-8">
        <span className="font-heading text-[30vw] font-bold tracking-tighter text-text-primary md:text-[20vw]">
          TALK
        </span>
      </div>

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
            {t("section.getInTouch")}
          </span>

          <div className="mx-auto mt-6 h-px w-8 bg-border" />

          <p className="mt-8 font-body text-lg leading-relaxed text-text-secondary md:text-xl">
            {t("section.contactText")}
          </p>

          {/* Email as hero element */}
          <motion.div
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.3 }}
            className="mt-12"
          >
            <a
              href={`mailto:${personalInfo.email}`}
              className="group inline-block"
            >
              <span className="font-heading text-xl font-bold tracking-tight text-text-primary transition-all hover:text-accent sm:text-2xl md:text-5xl">
                {personalInfo.email}
                <ArrowUpRight className="ml-1 inline-block h-5 w-5 text-text-tertiary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent md:ml-2 md:h-6 md:w-6" />
              </span>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.5 }}
            className="mt-6 font-body text-sm text-text-tertiary"
          >
            {tData(personalInfo.location, lang)}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
