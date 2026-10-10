"use client";

import { m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { ArrowDown, Github, Linkedin } from "lucide-react";
import { useLang } from "./providers";
import { personalInfo, tData } from "@/data/portfolio";
import { Reveal } from "./motion";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const { t, lang } = useLang();

  return (
    <section className="relative flex min-h-screen items-center px-6 py-28">
      <div className="grid-texture pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 md:grid-cols-12">
        {/* ─── Izquierda: texto ─── */}
        <div className="md:col-span-7">
          {/* Badge de disponibilidad */}
          <m.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.1 }}
            className="inline-flex items-center gap-2.5 border border-border bg-surface px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary"
          >
            <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
            {t("hero.available")}
          </m.span>

          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.2 }}
            className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.35em] text-accent"
          >
            {tData(personalInfo.title, lang)}
          </m.p>

          <m.h1
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.8,
              delay: prefersReducedMotion ? 0 : 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="mt-5 font-heading text-6xl font-bold leading-[0.95] tracking-tight text-text-primary md:text-8xl lg:text-9xl"
          >
            Ricardo
            <br />
            Vital
          </m.h1>

          <m.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.8,
              delay: prefersReducedMotion ? 0 : 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="mt-10 flex gap-5"
          >
            <div className="hidden w-px shrink-0 bg-accent/40 md:block" />
            <p className="max-w-md font-body text-lg leading-relaxed text-text-secondary">
              {tData(personalInfo.tagline, lang)}
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.7 }}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 border border-accent bg-accent px-7 py-3 font-body text-sm font-medium text-bg transition-colors hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>{t("hero.viewProjects")}</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </a>

            <div className="flex items-center gap-2">
              {[
                { icon: Github, href: personalInfo.social.github, label: "GitHub" },
                { icon: Linkedin, href: personalInfo.social.linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center border border-border text-text-secondary transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:h-10 md:w-10"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </m.div>
        </div>

        {/* ─── Derecha: foto limpia ─── */}
        <Reveal delay={0.4} className="md:col-span-5">
          <div className="relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden border border-border-light">
            <Image
              src="/photo.png"
              alt="Ricardo Vital"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 384px"
              priority
            />
          </div>
          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
            Irapuato, GTO · MX
          </p>
        </Reveal>
      </div>
    </section>
  );
}
