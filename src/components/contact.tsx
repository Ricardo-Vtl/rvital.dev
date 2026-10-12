"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "./providers";
import { personalInfo, tData } from "@/data/portfolio";
import { Reveal } from "./motion";
import { SplitReveal } from "./motion/split-text";
import { Parallax } from "./motion/parallax";
import { PointerDepth } from "./depth/pointer-depth";
import { Magnetic } from "./motion/magnetic";

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t, lang } = useLang();

  const heading = lang === "es" ? "Construyamos algo" : "Let's build";

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden px-6 pt-20 pb-24 md:pt-28 md:pb-44"
    >
      {/* Plano lejano (depth 0.12): watermark que apenas se mueve */}
      <Parallax speed={0.3} className="pointer-events-none absolute inset-0 select-none">
        <PointerDepth depth={0.12} className="h-full w-full">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 leading-none opacity-[0.055]">
            <span className="block font-heading text-[30vw] font-bold tracking-tighter text-text-primary md:text-[20vw]">
              TALK
            </span>
          </div>
        </PointerDepth>
      </Parallax>

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute bottom-0 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal className="flex items-center justify-center gap-4">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
              {t("section.getInTouch")}
            </span>
            <span className="pulse-dot h-1.5 w-1.5 bg-accent" aria-hidden="true" />
          </Reveal>

          <SplitReveal
            as="h2"
            text={heading}
            className="mt-8 font-heading text-5xl leading-[0.95] font-bold tracking-tight text-text-primary md:text-7xl"
            stagger={0.025}
          />

          <Reveal delay={0.15}>
            <p className="mx-auto mt-8 max-w-xl font-body text-lg leading-relaxed text-text-secondary md:text-xl">
              {t("section.contactText")}
            </p>
          </Reveal>

          {/* CTA magnético — plano cercano (depth 0.85) */}
          <div className="mt-14">
            <PointerDepth depth={0.85}>
              <Magnetic strength={0.22} className="inline-block max-w-full">
                <a
                  href={`mailto:${personalInfo.email}`}
                  data-cursor="link"
                  className="group inline-flex max-w-full flex-col items-center gap-3 border border-border bg-surface px-6 py-8 transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:px-8 md:px-12"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                    {lang === "es" ? "Escríbeme" : "Email me"}
                  </span>
                  <span className="flex min-w-0 max-w-full items-center gap-2 font-heading text-base font-bold tracking-tight text-text-primary transition-colors group-hover:text-accent sm:text-lg md:text-2xl">
                    <span className="[overflow-wrap:anywhere]">{personalInfo.email}</span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-accent transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </a>
              </Magnetic>
            </PointerDepth>
          </div>

          <Reveal delay={0.25}>
            <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary">
              {tData(personalInfo.location, lang)}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
